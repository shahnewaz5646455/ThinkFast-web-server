import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Lottie from "lottie-react";
import lani from "../assets/error.json";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-200">
      <div className=" shadow-2xl rounded-2xl p-10 flex flex-col bg-cyan-700 items-center border-2 border-error/30">
        <div className="w-48 h-48 mb-2">
          <Lottie animationData={lani} loop={true} />
        </div>
        <FaExclamationTriangle className="text-error text-6xl mb-4 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-error mb-2 drop-shadow-lg">
          Oops! Something went wrong.
        </h1>
        <p className="text-lg text-base-content mb-6 text-center font-semibold">
          The page you are looking for might have been removed,
          <br /> had its name changed, or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="btn bg-green-200 btn-wide text-gray-800 font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}