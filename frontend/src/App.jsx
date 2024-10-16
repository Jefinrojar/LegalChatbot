import React from 'react';
import Login  from './Pages/Login/Login.jsx';
import ChatInterface from './Pages/ChatInterface/ChatInterface.jsx';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword.jsx';
import OtpVerification from './Pages/OtpVerification/OtpVerification.jsx';
import ChangePassword from './Pages/ChangePassword/ChangePassword.jsx';
import SignUp from './Pages/SignUp/SignUp.jsx';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';

const App = () => {

  return(
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/chatinterface' element={<ChatInterface/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/otpverification' element={<OtpVerification/>}/>
        <Route path='/changepassword' element={<ChangePassword/>}/>
        
      </Routes>
    </div>
  );
}

export default App;
