import React, { useEffect, useState } from "react";
import ChangePinForm1 from "./ChangePinForm1";
import ChangePinForm2 from "./ChangePinForm2";
import ChangePinForm3 from "./ChangePinForm3";
import CryptoJS from "crypto-js";



function ChangePin() {
    const [cardNo, setCardNo] = useState('')
    const [generateOtp, setGenerateOtp] = useState(true)
    const [verifyOtp, setVerifyOtp] = useState(false)
    const [pin, setPin] = useState(false)

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

    useEffect(() => {
        if (!generateOtp && !verifyOtp && !pin) {
          console.log("All steps are false. Maybe reset?");
        }
      
        if (!generateOtp && !verifyOtp && !pin) {
          console.log("Process complete or reset state.");
        }
      
      }, [generateOtp, verifyOtp, pin]);
      

    return (<>
        <div className="form-wrap">
            <div className='login-form w-full p-4 pb-16'>
                <div className='form-wrapp mx-auto sm:w-full sm:max-w-sm'>
                    

                    { generateOtp && <ChangePinForm1 setCardNo={setCardNo}  setGenerateOtp={setGenerateOtp}  setVerifyOtp={setVerifyOtp} encryptAES={encryptAES} />}

                    {verifyOtp && <ChangePinForm2 cardNo={cardNo} setVerifyOtp={setVerifyOtp}  setPin={setPin} encryptAES={encryptAES} />}

                    {pin && <ChangePinForm3 cardNo={cardNo} encryptAES={encryptAES} />}

                </div>
            </div>
        </div>
    </>)
}

export default ChangePin;