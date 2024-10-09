import React from 'react';
import changepassword from "../../assets/images/changePassword.jpg";



function ChangePassword(){
    return(
        <section className='d-flex justify-content-center mt-5'>
            <div className="container rounded">
                <div className="row d-flex align-items-center">
                    <div className="col-md-6 col-sm-12 d-none d-md-flex justify-content-center align-items-center">
                        <img src={changepassword} alt="" className='w-75'/>
                    </div>

                    <div className="col-md-6 col-sm-12 d-flex flex-column">
                        <h1 className="text-center">Change Password</h1>
                        <form action="" className="d-flex flex-column align-items-center px-3">
                            <input className="w-100 ps-3 border-login-primary py-md-3 py-2 mt-4" type="email" placeholder="Create a password"/>
                            <input className="w-100 ps-3 border-login-primary py-md-3 py-2 mt-4" type="email" placeholder="Re-enter your password"/>
                            <button className='btn-copsify py-md-3 py-2 px-md-5 px-5 mt-4 text-white border'>Submit</button>
                        </form>
                        <p className='text-center mt-4 h6'>Back to <a href="">Login</a></p>
                    </div>
                </div>
            </div>
        </section>
    );  
}

export default ChangePassword;