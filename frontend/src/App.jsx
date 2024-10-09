import React from 'react';
import Login  from './Pages/Login/Login.jsx';
import ChatInterface from './Pages/ChatInterface/ChatInterface.jsx';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';

const App = () => {
  return(
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chatinterface' element={<ChatInterface/>}/>
      </Routes>
    </div>
  );
}

export default App;
