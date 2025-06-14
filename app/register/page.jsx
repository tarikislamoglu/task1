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
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const userNameRef = useRef();

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasNumber = /\d/.test(pass);
    const hasPunctuation = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength) {
      setPasswordError("Şifre en az 8 karakter olmalıdır");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Şifre en az 1 rakam içermelidir");
      return false;
    }
    if (!hasPunctuation) {
      setPasswordError("Şifre en az 1 noktalama işareti içermelidir");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Sadece rakamları al
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (value.length !== 10) {
        setPhoneError("Telefon numarası 10 haneli olmalıdır");
      } else {
        setPhoneError("");
      }
    }
  };

  const formatPhoneNumber = (number) => {
    if (number.length === 10) {
      return `0${number}`;
    }
    return number;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      return;
    }

    if (phoneNumber.length !== 10) {
      setPhoneError("Telefon numarası 10 haneli olmalıdır");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userName,
        password,
        email: emailAddress,
        phoneNumber: formattedPhone,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error);
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
            Sign Up
          </h2>
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              ref={userNameRef}
              className="w-full border-2 border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              aria-label="Username"
            />
          </div>
          <div className="relative">
            <IoMdMail className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              className="w-full border-2 border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              aria-label="Email address"
            />
          </div>
          <div className="relative">
            <FaPhoneAlt className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            <input
              type="tel"
              placeholder="Telefon Numarası (5XX...)"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
              className="w-full border-2 border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              aria-label="Phone number"
              maxLength={10}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifre (min. 8 karakter, 1 rakam, 1 noktalama işareti)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
              className="w-full border-2 border-gray-300 rounded-md pl-10 pr-10 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEye className="w-5 h-5" />
              ) : (
                <FaEyeSlash className="w-5 h-5" />
              )}
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <label htmlFor="terms" className="text-sm sm:text-base">
              I agree to the{" "}
              <a
                href="#"
                className="font-bold text-blue-400 hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Terms and Conditions & Privacy Policy
              </a>{" "}
              by signing up
            </label>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-white text-[#0068C8] font-bold text-xl sm:text-[27px] rounded-md py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Sign up"
            >
              Sign Up
            </button>
          </div>
          {error && (
            <p
              className="text-red-500 text-sm sm:text-base text-center mt-2"
              role="alert"
            >
              {error}
            </p>
          )}
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
