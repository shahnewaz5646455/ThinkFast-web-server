// ...other imports...
import { useState, useEffect, use } from "react";
import { FiCheckCircle, FiEdit3, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

export default function PendingAssignments() {
  const { user, logout } = use(AuthContext);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mark, setMark] = useState("");
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch pending assignments from API
  useEffect(() => {
    if (!user?.email) return;
    fetch(
      `https://groupstudyserver.vercel.app/submissions/pending/${encodeURIComponent(
        user.email
      )}`,
      {
        credentials: "include",
      }
    )
      .then(async(res) => {
        if (res.status === 401 || res.status === 403) {
          await logout();
          return [];
        }
        return res.json();
      })
      .then((data) => setPendingAssignments(Array.isArray(data) ? data : []))
      .catch(() => setPendingAssignments([]));
  }, [user?.email, logout]);

  // Open modal for marking
  const openMarkModal = (assignment) => {
    setSelected(assignment);
    setMark("");
    setFeedback("");
    setModalOpen(true);
  };

  // Submit mark and feedback using PATCH API
  const handleGiveMark = async (e) => {
    e.preventDefault();
    if (!mark || !feedback) {
      toast.error("Please provide both mark and feedback.");
      return;
    }
    try {
      const res = await fetch(
        `https://groupstudyserver.vercel.app/submissions/${selected._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            obtainedMarks: mark,
            feedback,
            status: "completed",
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Remove the marked assignment from the pending list
        setPendingAssignments((prev) =>
          prev.filter((a) => a._id !== selected._id)
        );
        toast.success("Assignment marked successfully!");
        setModalOpen(false);
      } else {
        toast.error(data.message || "Failed to mark assignment.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark assignment.");
    }
  };

  return (
    <section className="min-h-screen  py-10 px-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-5xl mx-auto bg-base-100 shadow-xl rounded-2xl p-6"
      >
        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
          <FiEdit3 className="text-secondary" /> Pending Assignments
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title/Assignment ID</th>
                <th>Marks</th>
                <th>Examinee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-lg text-base-content/70"
                  >
                    No pending assignments to mark!
                  </td>
                </tr>
              ) : (
                pendingAssignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="font-semibold">
                      {assignment.assignmenTitle || assignment.assignmentId}
                    </td>
                    <td>{assignment.totalMark || assignment.marks}</td>
                    <td>{assignment.examineeName}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm flex items-center gap-1"
                        onClick={() => openMarkModal(assignment)}
                      >
                        <FiCheckCircle /> Give Mark
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal for marking */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-base-100 rounded-xl shadow-2xl p-6 w-full max-w-md relative"
          >
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-primary">
              Mark Assignment
            </h3>
            <div className="mb-2">
              <span className="font-semibold">Title/ID:</span>{" "}
              {selected.assignmenTitle || selected.assignmentId}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Google Doc:</span>{" "}
              <a
                href={selected.googleDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-info flex items-center gap-1"
              >
                Open <FiExternalLink />
              </a>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Note:</span> {selected.note}
            </div>
            <form onSubmit={handleGiveMark} className="space-y-3 mt-4">
              <div>
                <label className="label font-semibold">Mark</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  min={0}
                  max={selected.totalMark || selected.marks}
                  required
                  placeholder={`Max: ${selected.totalMark || selected.marks}`}
                />
              </div>
              <div>
                <label className="label font-semibold">Feedback</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  placeholder="Write your feedback"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-full font-semibold"
              >
                Submit Mark
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
