import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";


export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

 return (
  <div className="min-h-screen flex flex-col md:grid md:grid-cols-2 bg-gray-50 overflow-hidden">

    <div className="relative flex items-center justify-center px-6 sm:px-10 lg:px-20
                    bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 text-white">


      <motion.div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-white/20 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-indigo-400/30 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8 }}
      />

      <motion.div
        className="relative z-10 max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl lg:text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back 👋
        </motion.h1>

        <motion.p
          className="text-lg lg:text-xl text-white/90 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Continue learning, teaching, and growing with SkillSwap.
        </motion.p>

        <div className="space-y-5">
          {[
            "Live 1-on-1 learning sessions",
            "Real people, real skills",
            "Build trust with ratings & reviews",
          ].map((text, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 text-white/90"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <span className="text-xl">✔</span>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    <div className="flex justify-center items-start md:items-center px-4 sm:px-6 py-10">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
          Sign in to your account
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your credentials to continue
        </p>

        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Email address
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-600 mb-1 block">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={onSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
        >
          Sign In
        </motion.button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  </div>
);
}