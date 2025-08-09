import React, { use } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { Outlet, ScrollRestoration } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
export default function Mainlayouts() {
  const {darkMode}=use(AuthContext);
  return (
    <div data-theme={darkMode ? "light" : "dark"} className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="">
        <Navbar></Navbar>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet></Outlet>
      </main>

      {/* Footer */}
      <footer className="">
        <Footer></Footer>
      </footer>
      <ToastContainer position="top-left" />
      <ScrollRestoration></ScrollRestoration>
    </div>
  );
}
