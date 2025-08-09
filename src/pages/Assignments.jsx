import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import ani from "../assets/ani.json";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { FaTrash, FaEdit, FaEye, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import AssignmentViewModal from "./modal";

export default function Assignments() {
  const { user, darkMode,loading, setLoading } = React.useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // On view button click:
  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setViewModalOpen(true);
  };
  const [editAssignment, setEditAssignment] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    marks: "",
    difficulty: "",
    thumbnail: "",
  });

  // Fetch assignments from API
  useEffect(() => {
    if (search) return; // Don't fetch on difficulty change if searching
    if (difficulty === "all") {
      setLoading(true);
      fetch("https://groupstudyserver.vercel.app/assignments")
        .then((res) => res.json())
        .then((data) => setAssignments(Array.isArray(data) ? data : []))
        .catch(() => setAssignments([]));
        setLoading(false);
    } else {
      fetch(
        `https://groupstudyserver.vercel.app/assignments/difficulty/${difficulty}`
      )
        .then((res) => res.json())
        .then((data) => setAssignments(Array.isArray(data) ? data : []))
        .catch(() => setAssignments([]));
    }
  }, [difficulty, search,setLoading]);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      // If search is empty, reload by difficulty
      if (difficulty === "all") {
        fetch("https://groupstudyserver.vercel.app/assignments")
          .then((res) => res.json())
          .then((data) => setAssignments(Array.isArray(data) ? data : []))
          .catch(() => setAssignments([]));
      } else {
        fetch(`https://groupstudyserver.vercel.app/difficulty/${difficulty}`)
          .then((res) => res.json())
          .then((data) => setAssignments(Array.isArray(data) ? data : []))
          .catch(() => setAssignments([]));
      }
      return;
    }
    setLoading(true);
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://groupstudyserver.vercel.app/assignments/search?q=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch {
      setAssignments([]);
    }
    setSearchLoading(false);
    setLoading(false);
  };

  const handleDelete = async (id, creatorEmail) => {
    if (user?.email !== creatorEmail) {
      toast.error("You can only delete assignments you created.");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://groupstudyserver.vercel.app/assignments/${id}`,
            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (data.deletedCount || data.success || res.ok) {
            setAssignments((prev) => prev.filter((a) => a._id !== id));
            toast.success("Assignment deleted successfully.");
          } else {
            toast.error("Failed to delete assignment.");
          }
        } catch (err) {
          console.log(err);
          toast.error("Failed to delete assignment.");
        }
      }
    });
  };

  // Open modal and set form data
  const handleEditClick = (assignment) => {
    setEditAssignment(assignment);
    setEditForm({
      title: assignment.title,
      description: assignment.description,
      marks: assignment.marks,
      difficulty: assignment.difficulty,
      thumbnail: assignment.imgUrl,
    });
    setShowModal(true);
  };

  // Handle form change
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Update assignment API call
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if(!user){
      return toast.error(" You are not authorized to update. First login ");
    }
    fetch(
      `https://groupstudyserver.vercel.app/assignments/${editAssignment._id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include", // <-- This sends credentials (cookies) to the server
        body: JSON.stringify(editForm),
      }
    )
      .then(async (res) => {
        if (res.status === 401) {
         await toast.success(" You are not authorized to update ");
        }
        return res.json();
      })
      .then((data) => {
        if (data.modifiedCount) {
          toast.success("Assignment updated successfully!");
          setAssignments((prev) =>
            prev.map((a) =>
              a.id === editAssignment.id ? { ...a, ...editForm } : a
            )
          );
          setShowModal(false);
        }
      });
  };

  return (
    <div
      className={`container mx-auto px-4 py-8 min-h-screen transition-colors duration-500 `}
    >
      <motion.div
        className={`text-center mb-10 `}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <Lottie animationData={ani} loop={true} className="h-32 w-32" />
        </div>
        <h1
          className={`text-4xl font-bold mb-2 ${
            darkMode ? "text-primary drop-shadow-lg" : ""
          }`}
        >
          Explore Assignments
        </h1>
        <p
          className={
            darkMode ? "text-secondary/80 font-bold" : "text-gray-400 font-bold"
          }
        >
          Sharpen your skills by taking up challenges!
        </p>
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center items-center gap-2 mt-6"
        >
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              className="input input-bordered w-full pl-10 pr-4 py-2 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus={false}
              style={{
                fontWeight: 500,
                background: darkMode ? "#fff" : "#232526",
                color: darkMode ? "#232526" : "#fff",
              }}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
            {searchLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner loading-xs text-primary"></span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary rounded-full px-5 font-bold shadow hover:scale-105 transition-all duration-200"
            disabled={searchLoading}
          >
            Search
          </button>
        </form>
        {/* Difficulty Filter Dropdown */}
        <div className="mt-6 flex justify-center">
          <select
            className="select select-primary w-full max-w-xs border-2 font-semibold focus:outline-none "
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(assignments) &&
          assignments.map((assignment) => (
            <motion.div
              key={assignment.id || assignment._id}
              className={`rounded-xl shadow-lg border-2 border-blue-400 p-4 relative overflow-hidden hover:shadow-xl transition 
             `}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 32px 0 rgba(80, 80, 200, 0.25)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={assignment.imgUrl}
                alt={assignment.title}
                className={`w-full h-40 object-cover rounded-md mb-4`}
              />
              <h3 className={`text-xl font-semibold mb-1 `}>
                {assignment.title}
              </h3>
              <p
                className={
                  darkMode
                    ? "text-primary/80 mb-2"
                    : "text-sm text-gray-500 mb-2"
                }
              >
                Marks: {assignment.marks}
              </p>
              <p className={darkMode ? "text-accent mb-4" : "text-sm  mb-4"}>
                Difficulty:{" "}
                <span className="font-semibold">
                  {assignment.difficulty?.toUpperCase()}
                </span>
              </p>

              <div className="flex justify-between items-center">
                <button
                  className={`btn btn-sm bg-gradient-to-r from-red-500 to-pink-500 border-0 text-white font-bold shadow-md hover:scale-105 hover:from-pink-600 hover:to-red-600 transition-all duration-200 ${
                    darkMode ? "hover:brightness-110" : ""
                  }`}
                  onClick={() => handleDelete(assignment._id, assignment.email)}
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
                <button
                  className={`btn btn-sm bg-gradient-to-r from-blue-500 to-cyan-400 border-0 text-white font-bold shadow-md hover:scale-105 hover:from-cyan-500 hover:to-blue-700 transition-all duration-200 ${
                    darkMode ? "hover:brightness-110" : ""
                  }`}
                  onClick={() => handleEditClick(assignment)}
                >
                  <FaEdit className="mr-1" /> Update
                </button>
                <Link
                  to={`/assignmentDetails/${assignment._id}`}
                  className={`btn btn-sm bg-gradient-to-r from-purple-500 to-indigo-500 border-0 text-white font-bold shadow-md hover:scale-105 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 ${
                    darkMode ? "hover:brightness-110" : ""
                  }`}
                >
                  <FaEye className="mr-1" /> View
                </Link>
              </div>
              {darkMode && (
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
              )}
            </motion.div>
          ))}
      </div>
      <AssignmentViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        assignment={selectedAssignment}
      ></AssignmentViewModal>

      {/* Modal for update */}
      {showModal && (
        <dialog open className="modal modal-open">
          <form
            method="dialog"
            className={`modal-box `}
            onSubmit={handleUpdateSubmit}
          >
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <FaEdit /> Update Assignment
            </h3>
            <div className="space-y-3">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered w-full"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  name="description"
                  className="input input-bordered w-full"
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label className="label">Marks</label>
                <input
                  type="number"
                  name="marks"
                  className="input input-bordered w-full"
                  value={editForm.marks}
                  onChange={handleEditChange}
                  required
                  min={1}
                />
              </div>
              <div>
                <label className="label">Difficulty</label>
                <select
                  name="difficulty"
                  className="select select-bordered w-full"
                  value={editForm.difficulty}
                  onChange={handleEditChange}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="label">Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnail"
                  className="input input-bordered w-full"
                  value={editForm.thumbnail}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </dialog>
      )}

      {assignments.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Lottie animationData={ani} loop={true} className="h-72" />
          <p
            className={`text-xl font-bold ${
              darkMode ? "text-secondary/80" : "text-gray-600"
            }`}
          >
            No assignments found.
          </p>
        </motion.div>
      )}
    </div>
  );
}
