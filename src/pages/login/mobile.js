import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";


function Mobile({ setIsData, setGetMobileData, setMobileResponse,encryptAES }) {
  const [mobError, setMobError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginschema = z.object({
    mobileNumber: z
      .string()
      .regex(/^\d+$/, { message: "Only numbers are allowed." })
      .length(10, { message: "Mobile number must be exactly 10 digits." }),
  });

  const { register, handleSubmit, formState, reset, control } = useForm({
    resolver: zodResolver(loginschema),
    mode: "onChange",
  });

  const { errors, isValid } = formState;

  async function postdata(data) {
    try {
      setIsLoading(true);


      const payload = JSON.stringify({ phone: data.mobileNumber });

      const encryptedPayload = encryptAES(payload);
      const requestBody = { payload: encryptedPayload };

      const response = await axios.post(
        "http://localhost:8080/api/auth/generate-otp",
        requestBody, 
        {
          headers: { "Content-Type": "application/json" }, 
        }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        setIsLoading(false);
        setIsData(true);
        setGetMobileData(data.mobileNumber);
        setMobileResponse(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      setMobError(error.response?.data?.message || "Something went wrong!");
    }
  }

  const onSubmit = (data) => {
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
          {errors.mobileNumber && (
            <p className="text-xs w-full block text-red-500 mt-1">
              {errors.mobileNumber.message}
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
            {isLoading ? "Loading..." : "Generate OTP"}
          </button>
        </div>
        <DevTool control={control} />
      </form>
      {mobError && (
        <p className="text-xs text-red-500 mt-1 text-center">{mobError}</p>
      )}
    </>
  );
}

export default Mobile;