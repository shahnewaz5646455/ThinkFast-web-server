import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHourglassHalf, FaStar } from "react-icons/fa";

export default function MyAssignments() {
  const { user, logout } = useContext(AuthContext);
  const [myAssignments, setMyAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`https://groupstudyserver.vercel.app/submissions/by-email/${user?.email}`, {
      credentials: "include",
    })
      .then(async(res) => {
        if (res.status === 401 || res.status === 403) {
          await logout();
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setMyAssignments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setMyAssignments([]);
        setLoading(false);
      });
  }, [user?.email, logout]);

  return (
    <section className="min-h-screen py-10 px-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-4xl mx-auto bg-base-100 shadow-xl rounded-2xl p-6"
      >
        <h2 className="text-3xl font-bold text-primary mb-6 text-center flex items-center justify-center gap-2">
          <FaStar className="text-secondary" /> My Submitted Assignments
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title/Assignment ID</th>
                <th>Status</th>
                <th>Total Marks</th>
                <th>Obtained Marks</th>
                <th>Feedback</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-lg">
                    <span className="loading loading-bars loading-lg text-primary"></span>
                  </td>
                </tr>
              ) : myAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-lg text-base-content/70"
                  >
                    You have not submitted any assignments yet.
                  </td>
                </tr>
              ) : (
                myAssignments.map((a) => (
                  <tr key={a._id}>
                    <td className="font-semibold">{a.assignmenTitle}</td>
                    <td>
                      {a.status === "completed" ? (
                        <span className="badge badge-success gap-1">
                          <FaCheckCircle /> Completed
                        </span>
                      ) : (
                        <span className="badge badge-warning gap-1">
                          <FaHourglassHalf /> Pending
                        </span>
                      )}
                    </td>
                    <td>{a.totalMark !== undefined ? a.totalMark : "--"}</td>
                    <td>
                      {a.obtainedMarks !== null &&
                      a.obtainedMarks !== undefined ? (
                        <span className="font-bold text-primary">
                          {a.obtainedMarks}
                        </span>
                      ) : (
                        <span className="text-base-content/60">--</span>
                      )}
                    </td>
                    <td>
                      {a.feedback ? (
                        <span className="text-success">{a.feedback}</span>
                      ) : (
                        <span className="text-base-content/60">--</span>
                      )}
                    </td>
                    <td>
                      {a.submittedAt
                        ? new Date(a.submittedAt).toLocaleString()
                        : "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
