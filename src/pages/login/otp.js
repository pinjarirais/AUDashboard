import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import CountdownTimer from "../../component/counttime";

const SECRET_KEY = "9f6d7e1b2c3a8f4d0e5b6c7d8a9e2f3c"; // 32 char
const IV = "MTIzNDU2Nzg5MDEy"; // 16 chars

function OTP({ getmobiledata, mobileresponse }) {
  let navigate = useNavigate();
  const [isTimer, setIsTimer] = useState(false);
  const [responseError, setResponseError] = useState("");

  const otpschema = z.object({
    otpfield: z.string().min(6, {
      message: "OTP must be at least 6 characters.",
    }),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { mobileNumber: decryptAES(getmobiledata)},
    resolver: zodResolver(otpschema),
    mode: "onChange",
  });

  const { errors, isValid } = formState;

  // AES Encryption function for OTP
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
    return decrypted.toString(CryptoJS.enc.Utf8); // Properly decode decrypted text
  }

 async function postdata(data) {
  try {
    // Encrypt OTP before sending
    const encryptedOtp = encryptAES(data.otpfield);

    const payload = {
      phone: getmobiledata,
      otp: encryptedOtp,
    };

    const response = await axios.post(
      "http://localhost:8080/api/auth/validate-otp",
      payload, 
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      let authuser = response.data.roleName;
      let jwtToken = response.data.token;
      let mobileNumber = response.data.mobileNumber;

      localStorage.setItem("authuser", JSON.stringify(authuser));
      localStorage.setItem("token", JSON.stringify(jwtToken));
      localStorage.setItem("mobileNumber", JSON.stringify(mobileNumber));
      navigate("/dashboard");
    }
  } catch (error) {
    setResponseError(error.response?.data?.message || "Something went wrong");
  }
}


  const onSubmit = (data) => {
    postdata(data);
    reset();
  };

  const handleResentOTP = () => {
    onSubmit({ mobileNumber: getmobiledata });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="feild w-full md:max-w-80">
        <label className="block text-sm/6 text-gray-700">
          Register Mobile Number
        </label>
        <input
          className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none opacity-50"
          autoFocus
          placeholder="Enter Your Number"
          readOnly
          {...register("mobileNumber")}
        />

        {mobileresponse && (
          <p className="text-xs w-full block text-green-500 mt-1">
            {mobileresponse}
          </p>
        )}
      </div>

      <div className="feild w-full md:max-w-80 mt-6">
        <label className="text-sm/6 text-gray-700 flex justify-between">
          Enter OTP
          <div>
            <CountdownTimer setIsTimer={setIsTimer} />
          </div>
        </label>
        <input
          className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
          autoFocus
          placeholder="Enter OTP"
          {...register("otpfield")}
          maxLength={6}
        />

        {responseError.code && (
          <p className="text-xs w-full block text-red-500 mt-1">
            {responseError.code}
          </p>
        )}

        

        {errors.otpfield && (
          <p className="text-xs w-full block text-red-500 mt-1">
            {errors.otpfield.message}
          </p>
        )}
      </div>

      <div className="feild w-full md:max-w-80">
        <div className="flex justify-end mt-1">
          <div>
            <button
              disabled={!isTimer}
              type="button"
              onClick={handleResentOTP}
              className="text-xs text-[#6d3078] underline"
            >
              Resend OTP
            </button>
          </div>
        </div>

        <button
          className={
            !isValid
              ? "bg-opacity-35 w-full bg-[#9a48a9] text-white p-2 m-auto border-none rounded-md my-5"
              : "bg-opacity-100 w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 m-auto border-none rounded-md my-5"
          }
          disabled={!isValid}
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default OTP;