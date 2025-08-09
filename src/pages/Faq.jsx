import React from "react";
import { FaQuestionCircle, FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How can I collaborate with classmates?",
    answer:
      "You can join or create study groups, share assignments, and discuss solutions in real-time using our collaborative tools.",
  },
  {
    question: "How do I track my assignment progress?",
    answer:
      "All your assignments are organized in one place. You can view deadlines, submission status, and receive instant feedback.",
  },
  {
    question: "What analytics are available for my learning?",
    answer:
      "Our analytics dashboard visualizes your progress, highlights strengths, and suggests areas for improvement.",
  },
  {
    question: "Is my data secure on GroupStudy?",
    answer:
      "Absolutely! We use industry-standard security practices to keep your data safe and private.",
  },
];

export default function Faq() {
  return (
    <section className="py-16 min-h-[70vh]">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-2">
          <span className="inline-block">
            <FaQuestionCircle className="text-secondary" />
          </span>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <div className="collapse collapse-arrow bg-base-100 shadow-lg">
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-lg font-semibold flex items-center gap-2">
                  <FaChevronDown className="text-info" />
                  {faq.question}
                </div>
                <div className="collapse-content text-base-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}