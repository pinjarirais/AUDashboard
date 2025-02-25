import React, { useState } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";
import axios from "axios";

const fileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone Number should be exactly 10 digits." }),
  pancard_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Invalid PAN Card format" }),
  card_number: z.string().regex(/^\d{16}$/, { message: "Card Number should be exactly 16 digits." }),
  aus_user_id: z.union([z.number().positive(), z.literal(0), z.null(), z.undefined()]).optional(),
  role_id: z.number().positive({ message: "Role ID must be a positive number" }),
});

const requiredHeaders = ["name", "email", "phone", "pancard_number", "card_number", "aus_user_id", "role_id"];

const ExcelUploader = () => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MzI1MzY4ODAxIiwicm9sZSI6IkNIX1VTRVIiLCJpYXQiOjE3NDA0Njk5NjYsImV4cCI6MTc0MDQ3MzU2Nn0.4GblGxgCxZLrlS2-rwgOLA6Ov-R83wk7n3oyaI1EUQ4';
  // const token = localStorage.getItem("jwtToken");

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      setErrors(["No file selected."]);
      return;
    }
    setFile(selectedFile);
    setErrors([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrors(["No file selected. Please choose a file first."]);
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      try {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
          setErrors(["The uploaded file is empty."]);
          return;
        }

        const fileHeaders = Object.keys(data[0]).map((h) => h.toLowerCase());
        const missingHeaders = requiredHeaders.filter((header) => !fileHeaders.includes(header));

        if (missingHeaders.length > 0) {
          setErrors([`Missing columns: ${missingHeaders.join(", ")}`]);
          return;
        }

        const validatedData = data.map((row, index) => {
          try {
            return fileSchema.parse({
              name: row.name,
              email: row.email,
              phone: row.phone.toString(),
              pancard_number: row.pancard_number,
              card_number: row.card_number.toString(),
              aus_user_id: Number(row.aus_user_id),
              role_id: Number(row.role_id),
            });
          } catch (err) {
            throw new Error(`Row ${index + 2}: ${err.errors.map((e) => e.message).join(", ")}`);
          }
        });

        await axios.post("http://localhost:8081/api/cardholders/upload-excel", validatedData,
          {headers: {
            Authorization: `Bearer ${token}`,
          },}
        );
        setErrors([]);
        alert("File uploaded successfully!");
      } catch (error) {
        setErrors([error.message || "Invalid Excel file format."]);
      }
    };
  };

  const handleDownload = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MzI1MzY4ODAxIiwicm9sZSI6IkNIX1VTRVIiLCJpYXQiOjE3NDA0Njk5NjYsImV4cCI6MTc0MDQ3MzU2Nn0.4GblGxgCxZLrlS2-rwgOLA6Ov-R83wk7n3oyaI1EUQ4';
      const response = await axios.get("http://localhost:8081/api/cardholders/download-empty-excel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrors(["Failed to download the file. Please try again."]);
    }
  };

  return (
    <div className="p-4  w-[90vw] mx-auto my-3 text-center">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileSelect} className="mt-3 border p-2 rounded" />
      {file && <p className="mt-2 text-green-600">Selected: {file.name}</p>}

      <div className="mt-4 flex justify-center gap-4">
        <button onClick={handleUpload} className="bg-[#6436d7] text-white py-2 px-4 rounded-lg hover:bg-[#502bb5] transition">
          Upload
        </button>
        <button onClick={handleDownload} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
          Download
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 text-red-600 border border-red-400 p-3 rounded bg-red-100 text-left max-w-xl mx-auto">
          <strong>Errors:</strong>
          <ul className="mt-2 list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
