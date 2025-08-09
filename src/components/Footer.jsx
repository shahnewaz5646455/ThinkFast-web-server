import React, { use } from "react";
import { FaXTwitter, FaLinkedinIn, FaInstagram, FaFacebookF, FaArrowUp } from "react-icons/fa6";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function Footer() {
  const {darkMode}=use(AuthContext);
  return (
    <footer className="w-full rounded-t-2xl  shadow-xl border  ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        {/* Left Section */}
        <div className="flex-1 mb-8 md:mb-0 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <polygon points="11,3 20,19 2,19" fill="#184445" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-white tracking-widest">
              <span className={`${darkMode?"text-black":"text-white"}`}>Group</span>
              <span className="text-orange-400">Study</span>
            </span>
          </div>
          <p className=" max-w-xs mb-6 text-center md:text-left">
            GroupStudy connects students for collaborative learning. Join study groups, share notes, and prepare for exams together with real-time chat, shared resources, and teamwork. Study smarter, stay organized, and succeed together.
          </p>
          <div className="flex gap-4 mb-6 justify-center md:justify-start">
            <a href="https://twitter.com/" className=" hover:text-yellow-400 text-xl transition"><FaXTwitter /></a>
            <a href="https://www.linkedin.com/" className=" hover:text-blue-400 text-xl transition"><FaLinkedinIn /></a>
            <a href="https://www.instagram.com/" className=" hover:text-pink-400 text-xl transition"><FaInstagram /></a>
            <a href="https://www.facebook.com/" className=" hover:text-blue-300 text-xl transition"><FaFacebookF /></a>
          </div>
          <a
            href="#top"
            className="inline-flex items-center gap-2 border  px-4 py-2 rounded-md  hover:bg-[#b9d3c2] hover:text-[#184445] font-semibold transition"
          >
            <FaArrowUp /> BACK TO TOP
          </a>
        </div>
        {/* Center Section */}
        <div className="flex-1 flex flex-col sm:flex-row gap-8 justify-center w-full">
          <div className="flex-1 min-w-[150px]">
            <h3 className=" font-bold mb-3 text-center sm:text-left">Site Map</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <NavLink
                  to="/"
                  className=" hover:text-yellow-400 transition font-semibold"
                >
                  Homepage
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Assignments"
                  className=" hover:text-cyan-400 transition font-semibold"
                >
                  Assignments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/CreateAssignment"
                  className=" hover:text-green-400 transition font-semibold"
                >
                  Create Assignment
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mysubmission"
                  className=" hover:text-pink-400 transition font-semibold"
                >
                  My Assignments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pending"
                  className=" hover:text-orange-400 transition font-semibold"
                >
                  Pending
                </NavLink>
              </li>
              
            </ul>
          </div>
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-white font-bold mb-3 text-center sm:text-left">Legal</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <a href="#" className=" hover:text-yellow-400 transition font-semibold">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className=" hover:text-yellow-400 transition font-semibold">
                  Terms of Services
                </a>
              </li>
              <li>
                <a href="#" className=" hover:text-yellow-400 transition font-semibold">
                  Lawyer's Corners
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-cyan-700 text-white text-center py-2  text-sm font-semibold tracking-wide">
        Copyright &copy; {new Date().getFullYear()}, GroupStudy, All Rights Reserved.
      </div>
    </footer>
  );
}