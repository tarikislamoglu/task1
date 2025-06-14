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
    <div className="min-h-screen w-full relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative flex justify-center items-center min-h-screen w-full px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-6 sm:p-8 w-full max-w-md space-y-4 sm:space-y-5 bg-white/10 backdrop-blur-lg text-white rounded-lg shadow-2xl border border-white/20"
        >
          <h2 className="font-bold text-2xl sm:text-[37px] text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sign In
          </h2>
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full border-2 border-white/20 bg-white/5 rounded-md pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-white/20 bg-white/5 rounded-md pl-10 pr-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEye className="w-5 h-5" />
              ) : (
                <FaEyeSlash className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col space-y-5 px-4 pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl sm:text-[27px] rounded-md py-2 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              Sign In
            </button>
            <button
              className="w-full bg-white/10 backdrop-blur-sm text-white font-bold text-xl sm:text-[27px] rounded-md py-2 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all transform hover:scale-[1.02] cursor-pointer border border-white/20"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
