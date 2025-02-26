import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    debitCardNumber: z.string().regex(/^\d{16}$/, "Debit Card Number must be exactly 16 digits"),
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
    panCardNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN card format"),
    mobileNumber: z.string().regex(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
    email: z.string().email("Invalid email format"),
});

const EditProfileForm = () => {
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const onSubmit = (data) => {
        alert("Data Submitted Successfully!");
        console.log("Form Data:", data);
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center text-[24px] my-5 font-bold">Edit Profile</h1>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Card Number</label>
                <input
                    {...register("debitCardNumber")}
                    type="number"
                    className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] outline-none"
                    placeholder="Enter Card Number"
                    onBlur={() => trigger("debitCardNumber")}

                />
                {errors.debitCardNumber && <small className="text-xs text-red-500">{errors.debitCardNumber.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Name</label>
                <input
                    {...register("name")}
                    className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] outline-none"
                    placeholder="Enter Name"
                    onBlur={() => trigger("name")}
                />
                {errors.name && <small className="text-xs text-red-500">{errors.name.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">PAN Card Number</label>
                <input
                    {...register("panCardNumber")}
                    className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] outline-none"
                    placeholder="Enter PAN Card Number"
                    onBlur={() => trigger("panCardNumber")}
                />
                {errors.panCardNumber && <small className="text-xs text-red-500">{errors.panCardNumber.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Mobile Number</label>
                <input
                    {...register("mobileNumber")}
                    type="number"
                    className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] outline-none"
                    placeholder="Enter Mobile Number"
                    onBlur={() => trigger("mobileNumber")}
                />
                {errors.mobileNumber && <small className="text-xs text-red-500">{errors.mobileNumber.message}</small>}
            </div>

            <div className="field w-full">
                <label className="block text-sm text-gray-700 font-bold">Email</label>
                <input
                    {...register("email")}
                    type="email"
                    className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] outline-none"
                    placeholder="Enter Email"
                    onBlur={() => trigger("email")}
                />
                {errors.email && <small className="text-xs text-red-500">{errors.email.message}</small>}
            </div>

            <button type="submit" className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 rounded-md mt-2 mb-8">
                Save Changes
            </button>
        </form>
    );
};

export default EditProfileForm;
