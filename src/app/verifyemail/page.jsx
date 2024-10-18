"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import OtpInput from "../components/OtpInput";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/Loader/page";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otpValues, setOtpValues] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: "",
    otp7: "",
    otp8: "",
  });

  const handleChange = (e, id) => {
    const { value } = e.target;
    setOtpValues((prev) => {
      const newOtpValues = { ...prev, [id]: value };
      if (value && id !== "otp8") {
        const nextInput = document.getElementById(
          `otp${parseInt(id.slice(3)) + 1}`
        );
        nextInput?.focus();
      }
      return newOtpValues;
    });
  };

  const handleVerify = async () => {
    const enteredOtp = Object.values(otpValues).join(""); // Concatenate all values

    try {
      const response = await axios.post("/api/users/verifyemail", {
        enteredOtp,
      });

      if (response.data.success) {
        toast.success("Verified Successfully");
        router.push("/login");
      } else {
        toast.error(response.data.error || "Verification failed");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md p-4 mx-auto mt-8 md:mt-12 lg:mt-16 rounded-lg border border-gray-300 bg-white shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col w-full gap-6 px-4 sm:px-6 md:px-8 lg:px-10"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-center leading-tight">
            Verify Email
          </h1>
          <div className="flex flex-col gap-2 items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-center">
              Enter the 8-digit code you received at
            </h3>
            <p className="text-sm sm:text-base text-center">{email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-center text-sm sm:text-base">Code</p>
            <div className="w-full flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
              {Array.from({ length: 8 }).map((_, index) => (
                <OtpInput
                  key={`otp${index + 1}`}
                  id={`otp${index + 1}`}
                  handleChange={handleChange}
                  value={otpValues[`otp${index + 1}`]}
                />
              ))}
            </div>
          </div>
          <button
            className="w-full py-3 px-5 bg-indigo-500 text-white rounded-md font-semibold cursor-pointer transition duration-200 hover:bg-indigo-400"
            type="submit"
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default Page;
