import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LawCharacter from "../../assets/images/LawCharacter.jpeg";
const ChatInterface = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Sidebar state
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  

  const examplePrompts = [
    "தடை செய்யப்பட்ட பகுதிகளுக்கு செல்வதற்காக பொது இடத்தில் ராணுவ சீருடை அணிந்து, ராணுவ வீரர் போல் நடந்து பிடிபட்டனர்.",
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

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if(!token){
      navigate('/');
    }
  },[navigate]);

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
      setError('Please enter a message');
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

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const logOut = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`transition-all duration-300 bg-gray-100 p-2 pt-5 flex flex-col  h-screen ${isSidebarExpanded ? 'w-1/4' : 'w-16'}`}>
        <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" className='border-2 bg-white border-gray-300 rounded-full p-2'><path fill="none" stroke="black" stroke-linecap="round" stroke-width="1.5" d="M20 7H4m16 5H4m16 5H4" /></svg>
        </button>
        <div className="">
          <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" className='mt-5 border-2 bg-white border-gray-300 rounded-full p-2'><path fill="black" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" className='mt-[450px]'><g fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2" /><path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6" /></g></svg>
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col w-full bg-white ">  
        {/* Chat Header */}
        <div className='flex items-center justify-between m-5 font-outfit'>
          <div className='flex items-center'>
            <img src={LawCharacter} alt="" width="60px" height="60px" className='border-1 rounded-full'/>
            <div className='ml-3'>
              <p className='font-bold'>Copsify AI</p>
              <div className='flex items-center gap-2 mt-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#34A853" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" /></svg>
                <p>Always active</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* SVG icon */}
      <div onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
          <path fill="black" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076q.188-.245.36-.502A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.96 9.96 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22q.324 0 .644-.02a9.95 9.95 0 0 0 5.031-1.745a10 10 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd" />
        </svg>
      </div>

      {/* Dropdown content */}
      {isOpen && (
       <div className="absolute top-14 right-0 bg-white shadow-lg p-2 px-3  rounded-md z-50" onClick={logOut}>
       <p className="m-0 cursor-pointer">Logout</p>
     </div>
      )}
    </div>
        </div>


        {/* Prompts */}
        {showPrompts && (
          <div>
            <div className="pl-10 pb-2 bg-white flex flex-col items-center">
              <h1 className="md:text-5xl text-2xl font-semibold bg-gradient-to-r from-[#FF9090] to-[#8F0092] bg-clip-text text-transparent">
                Hello, <span>Ragavan</span>
              </h1>
              <p className="text-gray-500 mt-2 md:text-5xl text-2xl">How can I help you today?</p>
            </div>
            <div className="px-5 pt-5">
              <div className="grid md:grid-cols-4 grid-cols-2 gap-4 ">
                {examplePrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-400 p-4 rounded-lg  cursor-pointer"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <p className="text-gray-700 md:text-base text-xs">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div ref={chatBoxRef} className="flex-grow p-5 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-4 rounded-lg ${message.sender === 'user' ? 'bg-[#00357B] text-white' : 'bg-gray-100 text-gray-700'}`}>
                <p>{message.text}</p>
                {message.sender === 'bot' && (
                  <>
                    <p className="mt-2 text-sm"><p className='font-bold'>Description:</p> {message.title}</p>
                    <p className="mt-2 text-sm"><p className='font-bold'>Section:</p> {message.section}</p>
                    <p className="text-sm"><p className='font-bold'>Punishment:</p> {message.punishment}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4  flex items-center">
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              placeholder="Type a prompt here..."
              value={userInput}
              onChange={handleInputChange}
              className="flex-grow p-3 rounded-full bg-white shadow-sm border border-gray-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className=" text-white p-3 rounded-full absolute right-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#000000" d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2t2.125.875T15 5v6q0 1.25-.875 2.125T12 14m-1 7v-3.075q-2.6-.35-4.3-2.325T5 11h2q0 2.075 1.463 3.538T12 16t3.538-1.463T17 11h2q0 2.625-1.7 4.6T13 17.925V21zm1-9q.425 0 .713-.288T13 11V5q0-.425-.288-.712T12 4t-.712.288T11 5v6q0 .425.288.713T12 12" /></svg>
            </button>
            <button
              type="submit"
              className="ml-3 "
              disabled={loading}
            >
              {loading ? <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#000000" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="#000000" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#3A4DE2" d="M3 20v-6l8-2l-8-2V4l19 8z"/></svg>}
            </button>
          </form>
        </div>

        {error && <div className="text-red-500 text-center mt-2">{error }</div>}
      </div>
    </div>
  );
};

export default ChatInterface;
