// LegalChatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // You can remove this if you are using Tailwind CSS only

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handlePromptClick = (e) => {
    setUserInput(e.target.innerText);
  }

  // Function to submit the user's query
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput) {
      setError('Please enter a scenario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await axios.post('http://127.0.0.1:5000/chat', {
        message: userInput,
      });

      setResponse(result.data);
    } catch (err) {
      setError('Error fetching data from the chatbot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Legal Chatbot</h2>
      <div className="egPrompts">
        <div className="row">
          <div className="col d-flex text-center mt-2">
            <div className="card prompt-card p-2" onClick={handlePromptClick}>
              <p>A person promises to sell land and takes an advance payment but never delivers the land or refunds the money</p>
            </div>
          </div>
          <div className="col d-flex text-center mt-2">
            <div className="card prompt-card p-2" onClick={handlePromptClick}>
              <p>A woman is subjected to physical and emotional abuse by her husband and in-laws for dowry</p>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col d-flex text-center mt-2">
            <div className="card prompt-card p-2" onClick={handlePromptClick}>
              <p>A driver recklessly drives his car, causing an accident that results in the death of a pedestrian</p>
            </div>
          </div>
          <div className="col d-flex text-center mt-2">
            <div className="card prompt-card p-2" onClick={handlePromptClick}>
              <p>A group of five people gathers with the intention of violently protesting outside a private company’s office</p>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your legal scenario..."
          value={userInput}
          onChange={handleInputChange}
          rows={4} id='textarea'
          className="textarea form-control p-2 rounded shadow-sm"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className={`w-100 mt-3 py-2 px-4 btn btn-primary text-white rounded shadow-md ${loading ? 'bg-secondary disabled border' : 'btn-primary'}`}
        >
          {loading ? 'Fetching...' : 'Submit'}
        </button>
      </form>

      {error && <p className="mt-4 text-danger">{error}</p>}

      {response && (
        <div className="mt-3 p-4 bg-light border rounded shadow-sm">
          <h3 className="h3 pb-2">Legal Response:</h3>
          <p><strong className="h4">Title:</strong> {response.title}</p>
          <p><strong className="h4">Section:</strong> {response.section}</p>
          <p><strong className="h4">Details:</strong> {response.content}</p>
          <p><strong className="h4">Punishment:</strong> {response.punishment}</p>
        </div>
      )}
    </div>
  );
};

export default App;
