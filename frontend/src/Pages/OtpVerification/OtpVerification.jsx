import React, { useRef } from 'react';
import OtpEnter from '../../assets/images/OTP.jpg'

function OtpVerification() {
  const otpRefs = useRef([]);

  const moveToNext = (e, index) => {
    const currentInput = otpRefs.current[index];
    if (e.target.value.length === 1 && index < 5) {
      otpRefs.current[index + 1].focus();  // Move to the next input
    }
  };

  return (
    <section className='d-flex justify-content-center mt-5'>    
        <div className='container rounded'>
            <div className="row d-flex align-items-center">
                <div className="col-md-6 col-sm-12 d-none d-md-flex justify-content-center align-items-center">
                    <img src={OtpEnter} alt="" className='w-75'/>
                </div>
                <div className="col-md-6 col-sm-10">
                    <h1 className="text-center">Enter the OTP</h1>
                    <p className="text-center mt-3">One Time Password is sent to your Email ID</p>
                    <div className="otp-input text-center">
                        {Array(6).fill(0).map((_, index) => (
                        <input
                            key={index}
                            ref={el => otpRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            className="otp-box"
                            onInput={(e) => moveToNext(e, index)}
                        />
                        ))}
                    </div>
                    <form action="" className="d-flex flex-column align-items-center mt-3">
                        <p>Didn't receive OTP? <a href='' style={{color:"#083087"}}>Resend OTP</a></p>
                        <button className='btn-copsify py-md-3 py-2 px-md-5 px-5 mt-2 text-white border'>Verify</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  );
}

export default OtpVerification;
