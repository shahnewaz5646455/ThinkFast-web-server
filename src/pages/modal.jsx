import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaEnvelope, FaAward, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";
import { MdTitle, MdDescription } from "react-icons/md";

export default function AssignmentViewModal({ open, onClose, assignment }) {
  if (!assignment) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="modal-box bg-base-100 max-w-lg w-full rounded-2xl shadow-2xl relative"
          >
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes className="text-lg" />
            </button>
            <div className="flex flex-col items-center gap-4">
              <img
                src={assignment.imgUrl}
                alt={assignment.title}
                className="w-[400px] h-[200px] object-cover rounded-xl shadow border-2 border-primary"
              />
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                 {assignment.title}
              </h2>
              <p className="text-base-content text-center flex items-center gap-2">
                 {assignment.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                  <FaUser className="text-secondary" />
                  <span className="font-semibold">{assignment.username}</span>
                </div>
                <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
               
                  <span className="font-semibold">{assignment.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                  <FaAward className="text-accent" />
                  <span>
                    <span className="font-semibold">{assignment.marks}</span> Marks
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                  <FaLayerGroup className="text-accent" />
                  <span>
                    <span className="font-semibold">{assignment.difficulty.toUpperCase()}</span> <span className="font-bold text-pink-500">LEVEL</span> 
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2 col-span-1 sm:col-span-2 justify-center">
                  <FaCalendarAlt className="text-primary" />
                  <span>
                    Submission Date:{" "}
                    <span className="font-semibold">{assignment.submissionDate}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}