import React, { useState } from "react";
import Mobile from "./mobile";
import OTP from "./otp";
import loginImg from '../../imgs/walk_bank_facility.webp';
import logoImg from '../../imgs/AU-Bank-logo.png';
import CryptoJS from "crypto-js";

const SECRET_KEY = "9f6d7e1b2c3a8f4d0e5b6c7d8a9e2f3c"; // 32 chars
const IV = "MTIzNDU2Nzg5MDEy"; // 16 chars

// AES Encryption function
function encryptAES(text) {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

  // AES Encryption function for OTP
  function decryptAES(text) {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);
    const decrypted = CryptoJS.AES.decrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8); 
  }

function Login() {
  const [isData, setIsData] = useState(false);
  const [getmobiledata, setGetMobileData] = useState("");
  const [resendFunc, setResendFunc] = useState(null)
  const [mobileresponse, setMobileResponse] = useState('')

  console.log(isData);
  console.log(getmobiledata);
  return (
    <>
      <div className="flex flex-col md:flex-row h-[100vh]">
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
            <OTP mobileresponse={mobileresponse} getmobiledata={getmobiledata} resendFunc={resendFunc} encryptAES={encryptAES}  setIsData={setIsData}/>
          ) : (
            <Mobile setMobileResponse={setMobileResponse} setIsData={setIsData} setGetMobileData={setGetMobileData} setResendFunc={setResendFunc} encryptAES={encryptAES} decryptAES={decryptAES}/>
          )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
