import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ToastNotification from "../../component/ToastNotifications";

function Mobile({ setIsData, setGetMobileData, setMobileResponse }) {
  const [mobError, setMobError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const loginschema = z.object({
    mobileNumber: z
      .string()
      .regex(/^\d+$/, { message: "Only numbers are allowed." })
      .length(10, { message: "Mobile number must be exactly 10 digits." }),      
  });

  const { register, handleSubmit, formState, reset, control} = useForm({
    resolver: zodResolver(loginschema),
    mode: "onChange",
  });

  const { errors, isValid, isSubmitted, submitCount } = formState;

  //console.log("formState >>>>>>", submitCount);

  async function postdata(data) {
    try {
      setIsLoading(true)
      const response = await axios.post(
        `http://localhost:8080/api/auth/generate-otp?phone=${data.mobileNumber}`        
      );
      console.log("data response >>>>>", response);

      if (response.status === 200) {
        setIsLoading(false)
        setIsData(true);
        setGetMobileData(data.mobileNumber);
        setMobileResponse(response.data.message)
      }
    } catch (error) {
      setMobError(error);
    }
  }

  const onSubmit = (data) => {
    console.log(data);    
    postdata(data);
    reset();
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="feild w-full md:max-w-80">
          <label className="block text-sm/6 text-gray-700">
            Register Mobile Number
          </label>
          <input
            type="text"
            className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            autoFocus
            placeholder="Enter Your Number"
            {...register("mobileNumber")}
            maxLength={10}
          />
          {/* {errors.mobileNumber && (
            <p className="text-xs w-full block text-red-500 mt-1">
              {errors.mobileNumber.message}
            </p>
          )} */}
          {errors.mobileNumber && (
                  <ToastNotification message={errors.mobileNumber.message} type="error" />
                )}
          {/* {mobError && (
            <p className="text-xs w-full block text-red-500 mt-1">{mobError}</p>
          )} */}
        </div>

        <div className="feild w-full md:max-w-80">
          
          <button
            className={
              !isValid
                ? "bg-opacity-35 w-full bg-[#9a48a9] text-white p-2 m-auto border-none rounded-md my-5"
                : "bg-opacity-100 w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 m-auto border-none rounded-md my-5"
            }
            disabled={!isValid}
          >
            {isLoading ? 'loading...': 'Genrate OTP'}
          </button>
        </div>
        <DevTool control={control} /> {/* set up the dev tool */}
      </form>
    </>
  );
}

export default Mobile;
