import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useLocation } from "react-router-dom";

const formSchema = z.object({
    debitCardNumber: z.string().regex(/^\d{16}$/, "Debit Card Number must be exactly 16 digits"),
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
    panCardNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN card format"),
    mobileNumber: z.string().regex(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
    email: z.string().email("Invalid email format"),
});

// const obj = {
//     name: "Jane Smith1",
//     email: "jane.smith2@example.com",
//     phone: "9767087882",
//     pan_card: "FGHIJ5678K",
//     cardNumber: "2345678901234567"
// };

const EditProfileForm = () => {
    const location = useLocation();
    const userData = location.state[0] || {};
    console.log("Edit form page", userData)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({
        defaultValues: {
            debitCardNumber: userData.cardNumber,
            name: userData.name,
            panCardNumber: userData.pancardNumber,
            mobileNumber: userData.phone,
            email: userData.email,
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            if (!token) {
                alert("Authorization token not found");
                setIsSubmitting(false);
                return;
            }

            const payload = {
                name: data.name,
                email: data.email,
                phone: data.mobileNumber,
                cardNumber: data.debitCardNumber,
            };

            const response = await axios.put('http://localhost:8081/api/cardholders/update', payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            alert("Data Updated Successfully!");
            console.log("Response Data:", response.data);
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Failed to update data. Please try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center text-[24px] my-5 font-bold">Edit Profile</h1>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Card Number</label>
                <input {...register("debitCardNumber")} disabled type="number" className="opacity-35 w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base" />
                {errors.debitCardNumber && <small className="text-xs text-red-500">{errors.debitCardNumber.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Name</label>
                <input {...register("name")} className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base" />
                {errors.name && <small className="text-xs text-red-500">{errors.name.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">PAN Card Number</label>
                <input {...register("panCardNumber")} disabled className="opacity-35 w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base" />
                {errors.panCardNumber && <small className="text-xs text-red-500">{errors.panCardNumber.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Mobile Number</label>
                <input {...register("mobileNumber")} type="number" className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base" />
                {errors.mobileNumber && <small className="text-xs text-red-500">{errors.mobileNumber.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Email</label>
                <input {...register("email")} type="email" className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base" />
                {errors.email && <small className="text-xs text-red-500">{errors.email.message}</small>}
            </div>

            <button type="submit" className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 rounded-md mt-2 mb-8" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
};

export default EditProfileForm;