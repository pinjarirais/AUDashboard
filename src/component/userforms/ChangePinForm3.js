import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";


const pinSchema = z
    .object({
        currentPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "Only numbers allowed"),
        newPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "Only numbers allowed"),
        confirmPin: z.string(),
    })
    .refine((data) => data.newPin === data.confirmPin, {
        message: "PIN does not match",
        path: ["confirmPin"],
    });

const ChangePinForm3 = () => {
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(pinSchema),
        mode: "onChange",
    });

    const [showPassword, setShowPassword] = useState({
        currentPin: false,
        newPin: false,
        confirmPin: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    const watchFields = watch(["currentPin", "newPin", "confirmPin"]);

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        e.target.value = value;
        trigger(fieldName);
    };

    const onSubmit = (data) => {
        alert("PIN Updated Successfully!");
        console.log("Updated PIN:", data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Current PIN */}
            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Enter Current PIN</label>
                <div className="relative">
                    <input
                        {...register("currentPin")}
                        type={showPassword.currentPin ? "number" : "password"}
                        className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
                        maxLength={6}
                        onInput={(e) => handleInputChange(e, "currentPin")}
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
                        type={showPassword.newPin ? "number" : "password"}
                        className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
                        maxLength={6}
                        onInput={(e) => handleInputChange(e, "newPin")}
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
                        type={showPassword.confirmPin ? "number" : "password"}
                        className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
                        maxLength={6}
                        onInput={(e) => handleInputChange(e, "confirmPin")}
                    />
                    <button type="button" className="absolute right-3 top-2 text-gray-500" onClick={() => togglePasswordVisibility("confirmPin")}>
                        {showPassword.confirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.confirmPin && <small className="text-xs text-red-500 mt-1">{errors.confirmPin.message}</small>}
            </div>

            {/* Submit Button */}
            <div className="field w-full mx-auto">
                <button type="submit" className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 m-auto border-none rounded-md mt-2 mb-5">
                    Update PIN
                </button>
            </div>
        </form>
    );
};

export default ChangePinForm3;
