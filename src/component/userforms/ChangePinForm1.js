import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";


const formSchema = z.object({
    cardNumber: z.string().regex(/^\d{16}$/, "Card Number must be exactly 16 digits"),
    cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)"),
    cvv: z.string().regex(/^\d{3}$/, "CVV must be exactly 3 digits"),
});

const ChangePinForm1 = ({ setCardNo, setGenerateOtp, setVerifyOtp, encryptAES, toast }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const [expiry, setExpiry] = useState("");

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
        setExpiry(value);
        setValue("cardExpiry", value, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            const payload = JSON.stringify({
                cardNumber: data.cardNumber,
                cardExpiry: data.cardExpiry,
                cvv: data.cvv,
            });

            const encryptedPayload = encryptAES(payload);

            const requestBody = { payload: encryptedPayload };

            const response = await axios.post(
                "http://localhost:8081/api/cardholders/generateOtp/pinGeneration",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            if (!response.data) {
                toast.error("Please enter valid Card details.");
            } else {
                toast.success(response.data || "OTP Generated Successfully!");
            }

            if (response.status === 200) {
                setGenerateOtp(false);
                setVerifyOtp(true);
            }

            setCardNo(data.cardNumber);
        } catch (err) {
            const message = err.response?.data?.message || "Please enter valid card details";
            toast.error(message);
        }
    };

    return (
        <>

      

            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-center text-[24px] my-5 font-bold">Generate OTP</h1>

                {/* Card Number */}
                <div className="field w-full">
                    <label className="block text-sm text-gray-700 font-bold">Card Number</label>
                    <input
                        {...register("cardNumber")}
                        className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
                        placeholder="Enter Your Card Number"
                        type="number"
                        onInput={(e) => {
                            if (e.target.value.length > 16) {
                                e.target.value = e.target.value.slice(0, 16);
                            }
                        }}
                    />
                    {errors.cardNumber && (
                        <small className="text-xs w-full block text-red-500 mt-1">
                            {errors.cardNumber.message}
                        </small>
                    )}
                </div>

                {/* Expiry & CVV */}
                <div className="field w-full">
                    <label className="block text-sm text-gray-700 font-bold">Card Expiry & CVV</label>
                    <div className="flex gap-3">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={handleExpiryChange}
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
                            />
                            {errors.cardExpiry && (
                                <small className="text-xs w-full block text-red-500 mt-1">
                                    {errors.cardExpiry.message}
                                </small>
                            )}
                        </div>

                        <div className="w-full">
                            <input
                                {...register("cvv")}
                                type="number"
                                placeholder="CVV"
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
                                onInput={(e) => {
                                    if (e.target.value.length > 3) {
                                        e.target.value = e.target.value.slice(0, 3);
                                    }
                                }}
                            />
                            {errors.cvv && (
                                <small className="text-xs w-full block text-red-500 mt-1">
                                    {errors.cvv.message}
                                </small>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="field w-full mx-auto">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`${!isValid ? 'bg-[#ba76c6] cursor-not-allowed' : 'bg-[#9a48a9] hover:bg-[#6d3078]'} w-full text-white p-2 m-auto border-none rounded-md my-5`}
                    >
                        {isSubmitting ? 'Generating...' : 'Generate OTP'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ChangePinForm1;
