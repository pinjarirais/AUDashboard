import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

function Mobile({ setIsData, setGetMobileData }) {
  const [mobError, setMobError] = useState('')
  const loginschema = z.object({
    mobileNumber: z.string().min(10, {
      message: "mobile number must be at least 10 number.",
    }),
  });

  const { register, handleSubmit, formState, reset, setError } = useForm({
    resolver: zodResolver(loginschema),
  });

  const { errors, isValid } = formState;

  async function postdata(data) {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        data
      );
      console.log("data response >>>>>", response);

      if (response.status === 201) {
        setIsData(true);
        setGetMobileData(response.data.mobileNumber);
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
            className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            autoFocus
            placeholder="Enter Your Number"
            {...register("mobileNumber")}
          />
          {errors.mobileNumber && (
            <p className="text-xs w-full block text-red-500 mt-1">
              {errors.mobileNumber.message}
            </p>
          )}

          {mobError.message && (
            <p className="text-xs w-full block text-red-500 mt-1">
              {mobError.message}
            </p>
          )}
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
            Genrate OTP
          </button>
        </div>
      </form>
    </>
  );
}

export default Mobile;
