import React, { useState } from "react";
import {
  FiBookOpen,
  FiEdit,
  FiCalendar,
  FiAward,
  FiImage,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function CreateAssignment() {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    marks: "",
    thumbnail: "",
    difficulty: "easy",
    dueDate: new Date(),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation helpers
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim() || !/^[a-zA-Z0-9\s\-_,\.;:()]+$/.test(form.title)) {
      newErrors.title = "Title should be valid text.";
    }
    if (
      !form.description ||
      form.description.trim().length < 20 ||
      form.description.trim().length > 300
    ) {
      newErrors.description = "Description must be 20-300 characters.";
    }
    if (!form.marks || isNaN(form.marks) || Number(form.marks) < 1) {
      newErrors.marks = "Marks should be a positive number.";
    }
    if (!form.thumbnail || !isValidUrl(form.thumbnail)) {
      newErrors.thumbnail = "Thumbnail must be a valid URL.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, dueDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    setLoading(true);

    // Prepare data for API
    const assignmentData = {
      username: user?.displayName || user?.name || "",
      email: user?.email || "",
      title: form.title,
      description: form.description,
      marks: form.marks,
      imgUrl: form.thumbnail,
      difficulty: form.difficulty,
      submissionDate: form.dueDate,
    };

    try {
      const res = await fetch("https://groupstudyserver.vercel.app/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData),
      });
      if (!res.ok) throw new Error("Failed to create assignment");
      toast.success("Assignment created successfully!");
      setForm({
        title: "",
        description: "",
        marks: "",
        thumbnail: "",
        difficulty: "easy",
        dueDate: new Date(),
      });
      navigate("/Assignments");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="bg-base-100 shadow-2xl rounded-2xl p-8 w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
          <FiBookOpen className="text-secondary" /> Create Assignment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Name (Read Only) */}
          <div>
            <label className="label font-semibold">User Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="username"
                className="input input-bordered w-full pl-10 bg-base-200 cursor-not-allowed placeholder:italic placeholder:text-base-content/60"
                value={user?.displayName || user?.name || ""}
                readOnly
                tabIndex={-1}
                placeholder="Your Name"
                style={{ fontWeight: 500, color: "#6366f1" }}
              />
            </div>
          </div>
          {/* User Email (Read Only) */}
          <div>
            <label className="label font-semibold">User Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="email"
                name="useremail"
                className="input input-bordered w-full pl-10 bg-base-200 cursor-not-allowed placeholder:italic placeholder:text-base-content/60"
                value={user?.email || ""}
                readOnly
                tabIndex={-1}
                placeholder="Your Email"
                style={{ fontWeight: 500, color: "#06b6d4" }}
              />
            </div>
          </div>
          <div>
            <label className="label font-semibold">Title</label>
            <div className="relative">
              <FiEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="title"
                className={`input input-bordered w-full pl-10 placeholder:italic placeholder:text-base-content/60 ${
                  errors.title ? "input-error" : ""
                }`}
                placeholder="Enter assignment title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            {errors.title && (
              <span className="text-error text-sm">{errors.title}</span>
            )}
          </div>
          <div>
            <label className="label font-semibold">Description</label>
            <textarea
              name="description"
              className={`textarea textarea-bordered w-full placeholder:italic placeholder:text-base-content/60 ${
                errors.description ? "textarea-error" : ""
              }`}
              placeholder="Describe the assignment in detail (20-300 characters)"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              minLength={20}
              maxLength={300}
            />
            {errors.description && (
              <span className="text-error text-sm">{errors.description}</span>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="label font-semibold">Marks</label>
              <div className="relative">
                <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="number"
                  name="marks"
                  className={`input input-bordered w-full pl-10 placeholder:italic placeholder:text-base-content/60 ${
                    errors.marks ? "input-error" : ""
                  }`}
                  placeholder="Total marks (e.g. 100)"
                  value={form.marks}
                  onChange={handleChange}
                  required
                  min={1}
                />
              </div>
              {errors.marks && (
                <span className="text-error text-sm">{errors.marks}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="label font-semibold">Difficulty</label>
              <select
                name="difficulty"
                className="select select-bordered w-full"
                value={form.difficulty}
                onChange={handleChange}
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label font-semibold">Thumbnail Image URL</label>
            <div className="relative">
              <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="thumbnail"
                className={`input input-bordered w-full pl-10 placeholder:italic placeholder:text-base-content/60 ${
                  errors.thumbnail ? "input-error" : ""
                }`}
                placeholder="Paste a thumbnail image URL"
                value={form.thumbnail}
                onChange={handleChange}
                required
              />
            </div>
            {errors.thumbnail && (
              <span className="text-error text-sm">{errors.thumbnail}</span>
            )}
          </div>
          <div>
            <label className="label font-semibold">Due Date</label>
            <div className="relative flex items-center">
              <FiCalendar className="absolute left-3 text-primary" />
              <DatePicker
                selected={form.dueDate}
                onChange={handleDateChange}
                className="input input-bordered w-full pl-10 placeholder:italic placeholder:text-base-content/60"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                required
                placeholderText="Select due date"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn btn-primary w-full text-lg font-semibold mt-2"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Assignment"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
