"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { FaUserAlt, FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdMail } from "react-icons/io";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const userNameRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailAddress,
        password,
        username: userName,
        phone: phoneNumber,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen max-w-full relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-8 lg:w-1/3 md:1/2 w-2/3 space-y-5 justify-center absolute bg-[#434343E5] text-white opacity-90 rounded-md"
      >
        <h2 className="font-bold text-[37px] ">Sign Up</h2>
        <div className="relative">
          <FaUserAlt className="absolute top-2 left-2 pointer-events-none" />

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            ref={userNameRef}
            className=" border-2 rounded-md px-7 py-1 w-full"
          />
        </div>
        <div className="relative">
          <IoMdMail className=" absolute top-2 left-2 pointer-events-none" />

          <input
            type="email"
            placeholder="Email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            className=" border-2 rounded-md px-7 py-1 w-full"
          />
        </div>
        <div className="relative">
          <FaPhoneAlt className=" absolute top-2 left-2 pointer-events-none" />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="border-2 rounded-md px-7 py-1 w-full"
          />
        </div>
        <div className="relative w-full">
          <RiLockPasswordFill className="  absolute top-2 left-2 pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className=" border-2  rounded-md px-7 py-1 w-full"
          />

          {showPassword ? (
            <FaEye
              className=" absolute top-2 right-2 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaEyeSlash
              className="  absolute top-2 right-2 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        <div className="">
          <input
            type="checkbox"
            className="mr-2"
            required
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <span className="text-[16px]">
            I agree
            <a href="#" className="font-bold">
              Terms and Conditions & Private Policy{" "}
            </a>
            by Signing in
          </span>
        </div>
        <div className="flex flex-col space-y-5 px-4 pt-16">
          <button
            type="submit"
            className="bg-white text-[#0068C8] font-bold text-[27px] rounded-md p-0.5 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
