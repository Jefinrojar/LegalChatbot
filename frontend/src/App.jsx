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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Legal Chatbot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Describe your legal scenario..."
          value={userInput}
          onChange={handleInputChange}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold text-white rounded-md shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Fetching...' : 'Submit'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {response && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800">Legal Response:</h3>
          <p><strong className="font-medium text-gray-700">Title:</strong> {response.title}</p>
          <p><strong className="font-medium text-gray-700">Section:</strong> {response.section}</p>
          <p><strong className="font-medium text-gray-700">Details:</strong> {response.content}</p>
          <p><strong className="font-medium text-gray-700">Punishment:</strong> {response.punishment}</p>
        </div>
      )}
    </div>
  );
};

export default App;
