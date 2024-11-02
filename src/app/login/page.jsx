"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/Loader/page";

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "Test123@gmail.com",
    password: "Test123",
  });

  const [buttonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      if (response.data.success) {
        console.log(response.data);
        toast.success("Logged In Successfully");
        router.push("/");
      } else {
        toast.error("Please Enter Valid Details");
        throw new Error(response.data.error);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Please Enter Valid Details");
      console.error("Error in Frontend:", error);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center h-[80vh] bg-white">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Login</h1>
          <h2 className="font-inter font-semibold text-lg leading-6 text-center mb-2">
            Welcome back to ECOMMERCE.
          </h2>
          <p className="font-inter font-normal text-base leading-5 text-center mb-6">
            The next-gen business marketplace.
          </p>
        </div>
        <form onSubmit={onSignup} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-base font-semibold">
              Email
            </label>
            <input
              id="email"
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="email"
              placeholder="Enter your Email..."
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-base font-semibold">
              Password
            </label>
            <input
              id="password"
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="password"
              placeholder="Enter your Password..."
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-5 bg-black text-white rounded-md hover:bg-gray-800 mt-4"
            disabled={buttonDisable}
          >
            {buttonDisable ? "Please Enter all Fields" : "Log In"}
          </button>
          <div className="w-full h-px bg-gray-300 my-4"></div>
          <p className="text-center text-base">
            <span className="font-inter font-normal">
              Don’t have an Account?{" "}
            </span>
            <Link
              href={"/signup"}
              className="text-black font-bold hover:underline"
            >
              SIGN UP
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Page;
