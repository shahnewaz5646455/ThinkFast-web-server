import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaTasks, FaChartLine, FaComments } from "react-icons/fa";

const features = [
  {
    icon: <FaUsers className="text-3xl text-primary" />,
    title: "Collaborative Learning",
    desc: "Work together with classmates, share ideas, and solve assignments as a team.",
  },
  {
    icon: <FaTasks className="text-3xl text-secondary" />,
    title: "Assignment Tracking",
    desc: "Easily manage, submit, and track all your assignments in one place.",
  },
  {
    icon: <FaChartLine className="text-3xl text-accent" />,
    title: "Progress Analytics",
    desc: "Visualize your learning journey and monitor your improvement over time.",
  },
  {
    icon: <FaComments className="text-3xl text-info" />,
    title: "Instant Feedback",
    desc: "Get real-time feedback and discuss solutions with peers and mentors.",
  },
];

export default function Feature() {
  return (
    <section className="py-16 bg-base-200 rounded-lg">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="text-3xl md:text-4xl font-bold text-center text-primary mb-8"
        >
          Key Features
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15, type: "spring" }}
              className="card bg-base-100 shadow-xl border-t-4 border-primary hover:scale-105 transition-transform"
              whileHover={{ scale: 1.08 }}
            >
              <div className="card-body items-center text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: idx * 0.5,
                  }}
                  className="mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="card-title text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-base-content">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}