import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const pinSchema = z
  .object({
    currentPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "Only numbers allowed"),
    newPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "Only numbers allowed"),
    confirmPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "Only numbers allowed"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "PIN does not match",
    path: ["confirmPin"],
  });

const ChangePinForm3 = ({ cardNo, encryptAES }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(pinSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState({
    currentPin: false,
    newPin: false,
    confirmPin: false,
  });

  const [expired, setExpired] = useState(false);

  useEffect(() => {                     //
    const timer = setTimeout(() => {
      setExpired(true);
      setTimeout(() => {
        if (window.confirm("Session expired! Please try again later.")) {
          navigate("/dashboard");
        }
      }, 100); 
    }, 120000); 

    return () => clearTimeout(timer); 
  }, [navigate]);


  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (e, fieldName) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue(fieldName, value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {

    if (expired) {
      alert("Session expired! Please start again."); //
      return;
    }

    const encryptedCurrentPin = encryptAES(data.currentPin);
    const encryptedNewPin = encryptAES(data.newPin);
    const encryptedConfirmNewPin = encryptAES(data.confirmPin);
    const payload = {
      cardNumber: cardNo,
      currentPin: encryptedCurrentPin,
      newPin: encryptedNewPin,
      confirmNewPin: encryptedConfirmNewPin,
    };

    await axios
      .post("http://localhost:8081/api/cardholders/updatePin", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
       if(res.status === 400){
          alert("Please enter valid credentials.");
      }
      else{
          alert(res.data)
      }
        if (res.status === 200) {
            navigate("/dashboard");
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Please enter valid credentials.";
       alert(message)
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Current PIN */}
      <h1 className="text-center text-[24px] my-5 font-bold">
                    Change PIN
                </h1>
      <div className="field w-full">
        <label className="block text-sm text-gray-700 font-bold">Enter Current PIN</label>
        <div className="relative">
          <input
            {...register("currentPin")}
            type={showPassword.currentPin ? "text" : "password"}
            className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            maxLength={6}
            onChange={(e) => handleInputChange(e, "currentPin")}
          />
          <button type="button" className="absolute right-3 top-2 text-gray-500" onClick={() => togglePasswordVisibility("currentPin")}>
            {showPassword.currentPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.currentPin && <small className="text-xs text-red-500 mt-1">{errors.currentPin.message}</small>}
      </div>

      {/* New PIN */}
      <div className="field w-full">
        <label className="block text-sm text-gray-700 font-bold">Enter New PIN</label>
        <div className="relative">
          <input
            {...register("newPin")}
            type={showPassword.newPin ? "text" : "password"}
            className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            maxLength={6}
            onChange={(e) => handleInputChange(e, "newPin")}
          />
          <button type="button" className="absolute right-3 top-2 text-gray-500" onClick={() => togglePasswordVisibility("newPin")}>
            {showPassword.newPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPin && <small className="text-xs text-red-500 mt-1">{errors.newPin.message}</small>}
      </div>

      {/* Confirm PIN */}
      <div className="field w-full">
        <label className="block text-sm text-gray-700 font-bold">Confirm PIN</label>
        <div className="relative">
          <input
            {...register("confirmPin")}
            type={showPassword.confirmPin ? "text" : "password"}
            className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            maxLength={6}
            onChange={(e) => handleInputChange(e, "confirmPin")}
          />
          <button type="button" className="absolute right-3 top-2 text-gray-500" onClick={() => togglePasswordVisibility("confirmPin")}>
            {showPassword.confirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPin && <small className="text-xs text-red-500 mt-1">{errors.confirmPin.message}</small>}
      </div>

      {/* Submit Button */}
      <div className="field w-full mx-auto">
      <button
          type="submit"
          disabled={!isValid || expired}
          className={`${
            !isValid || expired ? "bg-[#ba76c6] cursor-not-allowed" : "bg-[#9a48a9] hover:bg-[#6d3078]"
          } w-full text-white p-2 m-auto border-none rounded-md my-5`}
        >
          {expired ? "Session Expired" : isSubmitting ? "Updating..." : "Update PIN"}
        </button>
      </div>
    </form>
  );
};

export default ChangePinForm3;
