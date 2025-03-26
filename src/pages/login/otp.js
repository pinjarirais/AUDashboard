import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../../component/counttime";

function OTP({
  getmobiledata,
  mobileresponse,
  encryptAES,
  decryptAES,
  setIsData,
}) {
  let navigate = useNavigate();
  const [isTimer, setIsTimer] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [inValidOtpCount, setInvalidOtpCount] = useState(0);

  const otpschema = z.object({
    otpfield: z.string().min(6, {
      message: "OTP must be at least 6 characters.",
    }),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { mobileNumber: getmobiledata },
    resolver: zodResolver(otpschema),
    mode: "onChange",
  });

  console.log("params >>>>", encryptAES(getmobiledata));

  const { errors, isValid } = formState;

  async function postdata(data) {
    try {
      const payload = JSON.stringify({
        phone: getmobiledata,
        otp: data.otpfield,
      });

      const encryptedPayload = encryptAES(payload);
      const requestBody = { payload: encryptedPayload };

      const response = await axios.post(
        "http://localhost:8080/api/auth/validate-otp",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("otp responce >>>>", response);

      if (response.status === 200) {
        setInvalidOtpCount(0);
        let authuser = response.data.roleName;
        let jwtToken = response.data.token;
        let mobileNumber = response.data.mobileNumber;
        let userId = response.data.userId;

        localStorage.setItem("authuser", JSON.stringify(authuser));
        localStorage.setItem("token", JSON.stringify(jwtToken));
        localStorage.setItem("mobileNumber", JSON.stringify(mobileNumber));
        if (authuser === "CH USER") {
          localStorage.setItem("CHuserId", JSON.stringify(userId));
        }

        if (authuser === "AUS USER") {
          localStorage.setItem("AUSuserId", JSON.stringify(userId));
        }
        navigate("/dashboard");
      }
    } catch (error) {
      setInvalidOtpCount((prevCount) => prevCount + 1);
      setResponseError(error.response?.data?.message || "Something went wrong");
    }
  }

  const onSubmit = (data) => {
    postdata(data);
    reset();
  };

  const handleResentOTP = () => {
    setIsData(false);
  };

  useEffect(() => {
    if (inValidOtpCount === 3) {
      setIsData(false);
      navigate("/");
      setInvalidOtpCount(0);
    }
  }, [inValidOtpCount, navigate, setIsData]);

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
            <span className="text-base text-slate-500"><CountdownTimer startTime={20} setIsTimer={setIsTimer} /></span>
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
        {inValidOtpCount > 0 && inValidOtpCount < 3 ? (
          <div className="bg-[#ff00002e] border-red-500 border-[1px] p-2 mt-5 md:max-w-80">
            <span className="text-xs text-red-500 mt-1 text-left md:max-w-full m-0">
              <b>Invalid OTP. Only {3 - inValidOtpCount} attempt remaining</b>
            </span>
          </div>
        ) : null}
      </div>
    </form>
  );
}

export default OTP;
