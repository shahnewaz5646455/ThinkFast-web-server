import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import lani from "../assets/lani.json";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

export default function Login() {
  const { login, setUser, googleLogin } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await login(form.email, form.password);
      setUser(userCredential.user);
      toast.success("Login successful!");
      navigate(from, { replace: true }); // Redirect to intended page
    } catch (err) {
      console.log(err);
      setError("Invalid email or password.");
      toast.error("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const result = await googleLogin(auth, provider);
      setUser(result.user);
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Google login failed.");
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-10">
      <div className="bg-base-100 shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        <div className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
          <Lottie animationData={lani} loop={true} className="w-72 h-72" />
        </div>
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label font-semibold">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="input placeholder:font-semibold input-bordered w-full  focus:outline-none"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="label font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input placeholder:font-semibold input-bordered w-full pr-12 focus:outline-none"
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
              Login
            </button>
          </form>
          <div className="divider">or</div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline btn-secondary w-full flex items-center justify-center gap-2 text-lg font-semibold"
          >
            <FcGoogle className="text-2xl" />
            Login with Google
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-secondary font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
