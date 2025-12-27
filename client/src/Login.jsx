import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* LEFT BRAND PANEL */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <h1 className="text-4xl font-bold mb-4">SkillSwap</h1>
        <p className="text-lg opacity-90 mb-6">
          Welcome back 👋 <br />
          Continue learning with the community.
        </p>

        <ul className="space-y-3 text-sm opacity-90">
          <li>• Live 1-on-1 learning</li>
          <li>• Real people, real skills</li>
          <li>• Build trust with ratings</li>
        </ul>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex justify-center items-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to continue
          </p>

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* SUBMIT */}
          <button
            onClick={onSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            Sign In
          </button>

          {/* FOOTER */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
