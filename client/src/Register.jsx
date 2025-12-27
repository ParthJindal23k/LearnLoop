import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    teachSkills: "",
    learnSkills: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async () => {
    try {
      const payload = {
        ...form,
        teachSkills: form.teachSkills.split(",").map((s) => s.trim()),
        learnSkills: form.learnSkills.split(",").map((s) => s.trim()),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/register`,
        payload
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* LEFT SIDE (Brand / Visual) */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl font-bold mb-4">
          SkillSwap
        </h1>
        <p className="text-lg opacity-90 mb-6">
          Learn skills from real people.<br />
          Teach what you know. Grow together.
        </p>

        <ul className="space-y-3 text-sm opacity-90">
          <li>• 1-on-1 live sessions</li>
          <li>• Real community feedback</li>
          <li>• Learn & teach simultaneously</li>
        </ul>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex justify-center items-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            It takes less than a minute
          </p>

          {/* NAME */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* TEACH */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Skills you can teach
            </label>
            <input
              name="teachSkills"
              value={form.teachSkills}
              onChange={handleChange}
              placeholder="React, DSA, Java"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate skills with commas
            </p>
          </div>

          {/* LEARN */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-1 block">
              Skills you want to learn
            </label>
            <input
              name="learnSkills"
              value={form.learnSkills}
              onChange={handleChange}
              placeholder="Node.js, System Design"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            onClick={onSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            Create Account
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
