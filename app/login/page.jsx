"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: userName, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Giriş başarısız");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen max-w-full bg-[#E8F3FC] relative">
      <div className="flex flex-col p-6 lg:w-1/3 md:w-1/2 w-2/3 justify-center items-center space-y-5 bg-[#434343E5] opacity-90 text-white rounded-md relative ">
        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          <h2 className="font-bold text-[37px]">Sign In</h2>
          <div className="relative">
            <FaUserAlt className="absolute top-2 left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border-2 rounded-md px-7 py-1 w-full"
            />
          </div>
          <div className="relative w-full">
            <RiLockPasswordFill className="absolute top-2 left-2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" border-2 rounded-md px-7 py-1 w-full"
            />

            {showPassword ? (
              <FaEye
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEyeSlash
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {error && <p className="text-red-500 ">{error}</p>}
          <button
            type="submit"
            className="bg-white text-[#0068C8] font-bold text-[27px] rounded-md p-0.5 cursor-pointer w-full"
          >
            Log In
          </button>
        </form>
        <button
          className="font-bold text-[27px] rounded-md border-white border-2 cursor-pointer w-full "
          onClick={() => router.push("/register")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
