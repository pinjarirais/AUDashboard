import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../../component/counttime";

function OTP({ getmobiledata }) {
  let navigate = useNavigate();

  const [isTimer, setIsTimer] = useState(false);

  const otpschema = z.object({
    mobileNumber: z.string().min(10, {
      message: "mobile number must be at least 10 number.",
    }),
    otpfield: z.string().min(6, {
      message: "otp must be at least 6 alpha number.",
    }),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      mobileNumber: getmobiledata,
    },
    resolver: zodResolver(otpschema),
  });

  const { errors, isValid } = formState;

  async function postdata(data) {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        data
      );
      console.log("data response >>>>>", response);
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    postdata(data);
    reset();
    navigate("/dashboard");
  };

  const handleResentOTP = () => {
    onSubmit({"mobileNumber": getmobiledata})
    navigate("/")
  }

  return (
    <>
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
          {errors.mobileNumber && (
            <p className="text-xs w-full block text-red-500 mt-1">
              {errors.mobileNumber.message}
            </p>
          )}
        </div>

        <div className="feild w-full md:max-w-80 mt-6">
          <label className="text-sm/6 text-gray-700 flex justify-between">
            Enter OTP
            <div><CountdownTimer setIsTimer={setIsTimer} /></div>
          </label>
          <input
            className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            autoFocus
            placeholder="Enter OTP"
            {...register("otpfield")}
          />
          {errors.otpfield && (
            <p className="text-xs w-full block text-red-500 mt-1">
              {errors.otpfield.message}
            </p>
          )}
        </div>

        <div className="feild w-full md:max-w-80">
          <>
            <div className="flex justify-between mt-1">
              <div>
                {/* <CountdownTimer /> */}
              </div>
              <div>
                <button disabled={!isTimer} type="button" onClick={handleResentOTP} className="text-xs text-[#6d3078] underline">
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
          </>
        </div>
      </form>
    </>
  );
}

export default OTP;
