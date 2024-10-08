import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompts, setShowPrompts] = useState(true); 
  const chatBoxRef = useRef(null); 
  const recognitionRef = useRef(null);

  const examplePrompts = [
    "தடை செய்யப்பட்ட பகுதிகளுக்கு செல்வதற்காக பொது இடத்தில் ராணுவ சீருடை அணிந்து, ராணுவ வீரர் போல் நடந்து பிடிபட்டனர். இந்த ஆள்மாறாட்டம் செய்ததற்காக IPC பிரிவு 140 இன் கீழ் என்ன தண்டனை?",
    "அண்டை நாட்டின் எல்லையில் சட்டவிரோதமாக ஒரு நபர் திருடப்பட்ட சொத்துகளை வாங்குகிறார். IPC பிரிவு 127ன் படி என்ன விளைவுகள்?",
    "ஒரு பொது ஊழியர் தப்பிக்க அனுமதிக்கிறார். IPC பிரிவு 128ன் கீழ் அவர் எதிர்கொள்ளக்கூடிய தண்டனை என்ன?",
    "தேசத்துரோகத்தை தூண்ட முயற்சித்ததற்காக, IPC பிரிவு 124A இன் கீழ் என்ன தண்டனைகளை எதிர்கொள்ளலாம்?"
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ta-IN'; 
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript); 
      };

      recognition.onend = () => {
        console.log("Voice recognition ended.");
      };

      recognitionRef.current = recognition;
    } else {
      console.error('Speech Recognition API not supported in this browser.');
    }
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handlePromptClick = (prompt) => {
    setUserInput(prompt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput) {
      setError('Please enter a scenario');
      return;
    }

    setShowPrompts(false); 

    const userMessage = { sender: 'user', text: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput(''); 

    setLoading(true);
    setError(null);

    try {
      const result = await axios.post('http://127.0.0.1:5000/chat', {
        message: userMessage.text,
      });

      const botMessages = result.data.map(doc => ({
        sender: 'bot',
        text: doc.content,
        title: doc.title,
        section: doc.section,
        punishment: doc.punishment,
      }));

      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (err) {
      setError('Error fetching data from the chatbot.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 p-0">
      <div className="d-flex flex-column flex-grow-1" style={{ maxHeight: '100vh', overflowY: 'hidden' }}>
        <div className="chat-header bg-primary text-white text-center py-3">
          <h2>Copsify AI</h2>
        </div>

        {showPrompts && (
          <div className="bg-light p-3 text-center">
            <h5 className="mb-3">Try one of these examples:</h5>
            <div className="">
              {examplePrompts.map((prompt, index) => (
                <button 
                  key={index} 
                  className="btn btn-outline-primary m-2 w-50" 
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatBoxRef} className="chat-box flex-grow-1 p-3" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
          {messages.map((message, index) => (
            <div key={index} className={ `d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-3 rounded shadow-sm ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }}>
                <p className="mb-0"><strong>Title: </strong>{message.text}</p>
                {message.sender === 'bot' && (
                  <>
                    <p className="mt-2"><strong>Description:</strong> {message.title}</p>
                    <p><strong>Section:</strong> {message.section}</p>
                    <p><strong>Punishment:</strong> {message.punishment}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input bg-light p-3">
          <form onSubmit={handleSubmit} className="d-flex">
            <textarea
              className="form-control me-3"
              placeholder="Describe your legal scenario..."
              value={userInput}
              onChange={handleInputChange}
              rows={1}
              style={{ resize: 'none' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleVoiceInput}
            >
              🎤 Speak
            </button>
            <button
              type="submit"
              className="btn btn-primary ms-3"
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Send'}
            </button>
          </form>
        </div>

        {error && <div className="text-danger text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default App;
