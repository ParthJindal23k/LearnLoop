import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-xl">
        <h1 className="text-2xl text-white font-bold mb-6 text-center">
          Login
        </h1>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-4"
          onClick={onSubmit}
        >
          Login
        </button>
      </div>
    </div>
  );
}
