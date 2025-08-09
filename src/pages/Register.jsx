import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import rani from "../assets/rani.json";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, updateProfile } from "firebase/auth";

export default function Register() {
  const { createUsers, setUser, googleLogin } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password) => {
    const length = password.length >= 6;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    return length && upper && lower;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, photoURL, password } = form;
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters, include an uppercase and a lowercase letter."
      );
      toast.error(
        "Password must be at least 6 characters, include an uppercase and a lowercase letter."
      );
      return;
    }
    createUsers(email, password)
      .then((result) => {
        const user = result.user;
        updateProfile(user, { displayName: name, photoURL: photoURL })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL: photoURL });
            setForm({
              name: "",
              email: "",
              photoURL: "",
              password: "",
            });
            toast.success("Registration successful!");
            navigate("/");
          })
          .catch((error) => {
            toast.error(error.message);
            setUser(user);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        toast.error(errorMessage);
      });
  };

  // Google Register Handler
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const result = await googleLogin(auth, provider);
      setUser(result.user);
      toast.success("Registered with Google successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-10">
      <div className="bg-base-100 shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <div className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
          <Lottie animationData={rani} loop={true} className="w-72 h-72" />
        </div>
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label font-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="input placeholder:font-semibold input-bordered w-full focus:outline-none"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="label font-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="input placeholder:font-semibold input-bordered w-full focus:outline-none"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label className="label font-semibold">Photo URL</label>
              <input
                type="text"
                name="photoURL"
                className="input input-bordered w-full placeholder:font-semibold focus:outline-none"
                value={form.photoURL}
                onChange={handleChange}
                required
                placeholder="Paste your photo URL"
              />
              <div>
                <label className="label font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input input-bordered w-full pr-12 focus:outline-none placeholder:font-semibold"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Password (min 6 chars, upper & lower case)"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-primary cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    style={{ zIndex: 10 }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>
            </div>
            {error && (
              <div className="text-error text-sm font-medium">{error}</div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full text-lg font-semibold mt-2"
            >
              Register
            </button>
          </form>
          <div className="divider">or</div>
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="btn btn-outline btn-secondary w-full flex items-center justify-center gap-2 text-lg font-semibold"
          >
            <FcGoogle className="text-2xl" />
            Register with Google
          </button>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}