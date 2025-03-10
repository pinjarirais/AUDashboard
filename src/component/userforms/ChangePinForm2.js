import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const formSchema = z.object({
    otp: z
        .string()
        .regex(/^[a-zA-Z0-9]{6}$/, "OTP must be exactly 6 alphanumeric characters"),
});

const ChangePinForm2 = ({ cardNo, setVerifyOtp, setPin, encryptAES }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [timeLeft, setTimeLeft] = useState(120);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (timeLeft === 0){
            setTimeout(() => {
                if (window.confirm("Session expired! Please try again later.")) {
                  navigate("/dashboard");
                }
              }, 100); 
        };

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min} : ${sec}`;
    };

    const getTimerColor = () => {
        const percentage = (timeLeft / 120) * 100;
        if (percentage > 66) return "#000000"; 
        if (percentage > 33) return "#f97316"; 
        return "#dc2626";
    };

    const onSubmit = async (data) => {
        const encryptedOtp = encryptAES(data.otp);
        const payload = {
            cardNumber: cardNo,
            otp: encryptedOtp
        };

        await axios.post(
            "http://localhost:8081/api/cardholders/validateOtp",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }
        ).then((res) => {
            alert(res.data);
            if (res.status === 200) {
                setVerifyOtp(false);
                setPin(true);
            }
        })
        .catch((err) => {
            const message = err.response?.data?.message || "Invalid or expired OTP.";
           alert(message)
        });
    };

    return (
        <>
            <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-center text-[24px] my-5 font-bold">
                    Validate OTP
                </h1>
                <div className='feild w-full'>
                    <label className='block text-sm/6 text-gray-700 flex flex-auto justify-between font-bold'>
                        Enter OTP
                        <small
                            className='text-xs'
                            style={{
                                color: getTimerColor(),
                                fontWeight: 'bold',
                                transition: 'color 0.5s ease',
                            }}
                        >
                            {formatTime(timeLeft)}
                        </small>
                    </label>
                    <input
                        {...register("otp")}
                        className='w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none'
                        placeholder='Enter OTP'
                        onBlur={() => trigger("otp")}
                        maxLength={6}
                    />
                    <div className='flex flex-auto gap-5'>
                        {errors.otp && (
                            <small className='text-xs w-full block text-red-500 mt-1'>
                                
                            </small>
                        )}
                    </div>
                </div>
                <div className='feild w-full mx-auto'>
                    <button
                        type='submit'
                        disabled={!isValid || timeLeft === 0}
                        className={`${(!isValid || timeLeft === 0)
                            ? 'bg-[#ba76c6] cursor-not-allowed'
                            : 'bg-[#9a48a9] hover:bg-[#6d3078]'
                            } w-full text-white p-2 m-auto border-none rounded-md my-5`}
                    >
                        {isSubmitting ? 'Verifying...' : timeLeft === 0 ? 'Expired' : 'Verify'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ChangePinForm2;
