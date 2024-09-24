import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompts, setShowPrompts] = useState(true); // State to show/hide example cards
  const chatBoxRef = useRef(null); 

  // Example legal scenarios for quick prompts
  const examplePrompts = [
    "தடை செய்யப்பட்ட பகுதிகளுக்கு செல்வதற்காக பொது இடத்தில் ராணுவ சீருடை அணிந்து, ராணுவ வீரர் போல் நடித்து பொதுமக்கள் பிடிபட்டனர். இந்த ஆள்மாறாட்டம் செய்ததற்காக IPC பிரிவு 140 இன் கீழ் தனிநபர் என்ன தண்டனையை எதிர்கொள்ளலாம்?",
    "அண்டை நாட்டின் எல்லையில் கிளர்ச்சியாளர்களால் சட்டவிரோத சோதனையின் போது எடுக்கப்பட்ட திருடப்பட்ட பொருட்களை ஒரு நபர் தெரிந்தே வாங்குகிறார். ஐபிசி பிரிவு 127ன் படி, இந்தச் சொத்தைப் பெறுவதற்கு அவர் என்ன சட்டரீதியான விளைவுகளை சந்திக்க நேரிடும்?",
    "ஒரு பொது ஊழியர் வேண்டுமென்றே தனது காவலில் இருக்கும் போர்க் கைதியை தடுப்புக் காவலில் இருந்து தப்பிக்க அனுமதிக்கிறார். IPC பிரிவு 128ன் கீழ் இந்த அரசு ஊழியர் எதிர்கொள்ளக்கூடிய அதிகபட்ச தண்டனை என்ன?",
    "இந்திய அரசாங்கத்தின் மீது வெறுப்பையும் வெறுப்பையும் தூண்டும் வகையில் ஒரு தனிநபர் பொதுப் பேச்சுக்களை நிகழ்த்துவது கண்டறியப்பட்டுள்ளது. தேசத்துரோகத்தை தூண்ட முயற்சித்ததற்காக IPC பிரிவு 124A இன் கீழ் அவர்கள் என்ன தண்டனைகளை எதிர்கொள்ள முடியும்?"
  ];

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

    // Hide the prompt cards after the first submit
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

      const botMessage = {
        sender: 'bot',
        text: result.data.content, 
        title: result.data.title,
        section: result.data.section,
        punishment: result.data.punishment,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
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
      {/* Chat Interface */}
      <div className="d-flex flex-column flex-grow-1" style={{ maxHeight: '100vh', overflowY: 'hidden' }}>
        <div className="chat-header bg-primary text-white text-center py-3">
          <h2>Legal Chatbot</h2>
        </div>

        {/* Show example prompts only if showPrompts is true */}
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

        {/* Chat History */}
        <div ref={chatBoxRef} className="chat-box flex-grow-1 p-3" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
          {messages.map((message, index) => (
            <div key={index} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
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

        {/* Input Area */}
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
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && <div className="text-danger text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default App;
