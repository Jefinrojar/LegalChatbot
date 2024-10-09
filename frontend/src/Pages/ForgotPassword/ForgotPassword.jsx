import React from 'react';
import forgotpassword from "../../assets/images/forgotPassword.jpg";



function ForgotPassword(){
    return(
        <section className='d-flex justify-content-center mt-5'>
            <div className="container rounded">
                <div className="row d-flex align-items-center">
                    <div className="col-md-6 col-sm-12 d-none d-md-flex justify-content-center align-items-center">
                        <img src={forgotpassword} alt="" className='w-75'/>
                    </div>

                    <div className="col-md-6 col-sm-12 d-flex flex-column">
                        <div className='d-flex flex-column align-items-center'>
                            <svg className='w-25' viewBox="0 0 195 195" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M97.5 163.8C60.84 163.8 31.2 134.16 31.2 97.5C31.2 60.84 60.84 31.2 97.5 31.2C134.16 31.2 163.8 60.84 163.8 97.5C163.8 134.16 134.16 163.8 97.5 163.8ZM97.5 39C65.13 39 39 65.13 39 97.5C39 129.87 65.13 156 97.5 156C129.87 156 156 129.87 156 97.5C156 65.13 129.87 39 97.5 39Z" fill="#375089"/>
                                <path d="M93.6 124.8H101.4V132.6H93.6V124.8ZM99.84 117H95.16L93.6 85.8V62.4H101.4V85.8L99.84 117Z" fill="#375089"/>
                            </svg>

                            <h1 className="text-center">Forgot Password</h1><br />
                            <p className='text-center'>Enter your email and we’ll send you a link to reset your password.</p>
                        </div>
                        <form action="" className="d-flex flex-column align-items-center px-3">
                            <input className="w-100 ps-3 border-login-primary py-md-3 py-2 mt-4" type="email" placeholder="Enter your email"/><br />
                            <button className='btn-copsify py-md-3 py-2 px-md-5 px-5 mt-2 text-white border'>Send OTP</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );  
}

export default ForgotPassword;