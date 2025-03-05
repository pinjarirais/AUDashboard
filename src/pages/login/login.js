import React, { useState } from "react";
import Mobile from "./mobile";
import OTP from "./otp";
import loginImg from '../../imgs/walk_bank_facility.webp';
import logoImg from '../../imgs/AU-Bank-logo.png';

function Login() {
  const [isData, setIsData] = useState(false);
  const [getmobiledata, setGetMobileData] = useState("");
  const [resendFunc, setResendFunc] = useState(null)
  const [mobileresponse, setMobileResponse] = useState('')

  console.log(isData);
  console.log(getmobiledata);
  return (
    <>
      <div className="flex flex-col md:flex-row h-[100vh] w-full">
        <div className="bgImg w-full md:w-1/2 bg-[#6d3078] hidden md:flex">
          <img
            className="self-center justify-self-center m-auto"
            src={loginImg}
            alt="loginimg"
          />
        </div>
        <div className="login-form w-full md:w-1/2 p-5">
        <div className='form-wrapp mx-auto md:mx-5 sm:w-full sm:max-w-sm'>
          <div className='logo-wrap'><img src={logoImg} className='w-[120px] mx-auto md:mx-0' alt="logo" /></div>
          {isData ? (
            <OTP mobileresponse={mobileresponse} getmobiledata={getmobiledata} resendFunc={resendFunc} />
          ) : (
            <Mobile setMobileResponse={setMobileResponse} setIsData={setIsData} setGetMobileData={setGetMobileData} setResendFunc={setResendFunc} />
          )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
