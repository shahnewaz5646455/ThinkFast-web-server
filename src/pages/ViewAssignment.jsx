import React, { useState, useEffect, useContext, use } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileAlt,
  FaUser,
  FaEnvelope,
  FaAward,
  FaLayerGroup,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

// Simulate ObjectId (for demo)
const generateObjectId = () =>
  Math.random().toString(16).slice(2) + Date.now().toString(16);

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    googleDoc: "",
    note: "",
  });

  // Fetch assignment details from API
  useEffect(() => {
    fetch(`https://groupstudyserver.vercel.app/assignments/${id}`)
      .then((res) => res.json())
      .then((data) => setAssignment(data))
      .catch(() => setAssignment(null));
  }, [id]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submission = {
      assignmentId: id,
      examineeName: user.displayName,
      totalMark: assignment.marks,
      assignmenTitle: assignment.title,
      submittedBy: user?.email || "",
      googleDoc: form.googleDoc,
      note: form.note,
      status: "pending",
      obtainedMarks: null,
      feedback: null,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://groupstudyserver.vercel.app/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const data = await res.json();
      setLoading(false);
      setShowModal(false);

      if (res.status === 201) {
        navigate("/mysubmission");
        toast.success(data.message || "Assignment submitted! Status: Pending");
      } else if (res.status === 409) {
        toast.error(data.message || "Assignment is already taken");
      } else if (res.status === 400) {
        toast.error(data.message || "Submission data is required");
      } else {
        toast.error(data.message || "Failed to submit assignment.");
      }
      setForm({ googleDoc: "", note: "" });
      console.log("Submitted Assignment Object:", submission);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Failed to submit assignment.");
    }
  };
  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="min-h-screen  py-10 px-2 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-2xl md:max-w-4xl  w-full  shadow-xl rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={assignment.imgUrl}
            alt={assignment.title}
            className="w-[300px] h-[200px] object-cover rounded-xl border-2 border-primary shadow"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-2 mb-2">
              <FaFileAlt /> {assignment.title}
            </h2>
            <p className="mb-3 text-base-content">{assignment.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                <FaUser className="text-secondary" />
                <span className="font-semibold">{assignment.username}</span>
              </div>
              <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                <FaEnvelope className="text-secondary" />
                <span className="font-semibold">{assignment.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                <FaAward className="text-accent" />
                <span>
                  <span className="font-semibold">{assignment.marks}</span>{" "}
                  Marks
                </span>
              </div>
              <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                <FaLayerGroup className="text-accent" />
                <span>
                  <span className="font-bold">
                    {assignment.difficulty.toUpperCase()}
                  </span>{" "}
                  <span className="font-bold text-pink-500">LEVEL</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2 col-span-1 sm:col-span-2 justify-center">
                <FaCalendarAlt className="text-primary" />
                <span>
                  Submission Date:{" "}
                  <span className="font-semibold">
                    {assignment.submissionDate}
                  </span>
                </span>
              </div>
            </div>
            <button
              className="btn btn-primary w-full mt-2 flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <FaPaperPlane /> Take Assignment
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal for assignment submission */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="modal-box bg-base-100 max-w-md w-full rounded-2xl shadow-2xl relative"
              onSubmit={handleSubmitAssignment}
            >
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                onClick={() => setShowModal(false)}
                type="button"
                aria-label="Close"
              >
                <FaTimes className="text-lg" />
              </button>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <FaPaperPlane /> Submit Assignment
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="label">Google Docs Link</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="googleDoc"
                      className="input input-bordered w-full pr-10"
                      value={form.googleDoc}
                      onChange={handleFormChange}
                      required
                      placeholder="Paste your Google Docs link"
                    />
                    {form.googleDoc && (
                      <a
                        href={form.googleDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                        title="Open in new tab"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <label className="label">Quick Note</label>
                  <textarea
                    name="note"
                    className="textarea textarea-bordered w-full"
                    value={form.note}
                    onChange={handleFormChange}
                    required
                    placeholder="Write a quick note for the examiner"
                  />
                </div>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  <FaPaperPlane />
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
