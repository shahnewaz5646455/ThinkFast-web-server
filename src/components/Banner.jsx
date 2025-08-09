import React from "react";
import { Link } from "react-router";
import { MdSchool } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

const images = [
  "https://i.postimg.cc/m23V2cMM/Rocket-research-bro.png",
  "https://i.postimg.cc/htSsJSbY/Research-paper-rafiki.png",
  "https://i.postimg.cc/MpdDVh9p/Research-paper-bro.png",
];

export default function Banner() {
  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content flex-col lg:flex-row-reverse gap-10 w-full">
        {/* Overlapping Triangle Animated Illustrations */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex-shrink-0 mx-auto mb-8 lg:mb-0">
          {/* Top image */}
          <motion.img
            src={images[0]}
            alt="Rocket Research"
            className="absolute z-30 rounded-xl shadow-xl border-2 border-primary
              left-1/2 -translate-x-1/2 top-0
              w-28 sm:w-32 md:w-36 lg:w-40"
            initial={{ y: -20, opacity: 1 }}
            animate={{ y: [ -10, 10, -10 ], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.08, rotate: 3 }}
          />
          {/* Bottom left image */}
          <motion.img
            src={images[1]}
            alt="Research Paper Rafiki"
            className="absolute z-20 rounded-xl shadow-xl border-2 border-secondary
              left-2 bottom-4
              w-20 sm:w-24 md:w-28 lg:w-40
              md:left-4 md:bottom-8
              lg:left-8 lg:bottom-12
              rotate-[-12deg]"
            initial={{ x: -10, y: 20, opacity: 1 }}
            animate={{ x: [ -10, 10, -10 ], y: [ 20, 0, 20 ], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            whileHover={{ scale: 1.08, rotate: -8 }}
          />
          {/* Bottom right image */}
          <motion.img
            src={images[2]}
            alt="Research Paper Bro"
            className="absolute z-10 rounded-xl shadow-xl border-2 border-accent
              right-2 bottom-4
              w-20 sm:w-24 md:w-28 lg:w-40
              md:right-4 md:bottom-8
              lg:right-8 lg:bottom-12
              rotate-[14deg]"
            initial={{ x: 10, y: 20, opacity: 1 }}
            animate={{ x: [ 10, -10, 10 ], y: [ 20, 0, 20 ], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            whileHover={{ scale: 1.08, rotate: 10 }}
          />
        </div>

        {/* Text content */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
          className="max-w-xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            Supercharge Your{" "}
            <span className="text-secondary">Study Sessions</span>
          </h1>
          <p className="py-4 text-lg text-base-content">
            Collaborate with friends, complete assignments, track progress, and
            learn together — all in one place.
          </p>
          <div className="flex gap-4 flex-wrap mt-6">
            <motion.div
              whileHover={{
                scale: 1.08,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-lg"
            >
              <Link
                to="/assignments"
                className="btn text-lg shadow-lg border-0 px-7 py-3 font-semibold text-white"
                style={{
                  background: "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)",
                  transition: "background 0.5s",
                }}
              >
                <MdSchool className="text-xl mr-2" />
                Start Learning
              </Link>
            </motion.div>
            <Link to="/login" className="btn btn-outline btn-secondary text-lg shadow-lg hover:scale-105 transition-transform">
              <FaRocket className="text-lg mr-2" />
              Join Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}