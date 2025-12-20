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
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-xl">
        <h1 className="text-2xl text-white font-bold mb-6 text-center">
          Register
        </h1>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none"
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
        />

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

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none"
          name="teachSkills"
          value={form.teachSkills}
          placeholder="Skills you can teach (comma separated)"
          onChange={handleChange}
        />

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none"
          name="learnSkills"
          value={form.learnSkills}
          placeholder="Skills you want to learn (comma separated)"
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-4"
          onClick={onSubmit}
        >
          Register
        </button>
      </div>
    </div>
  );
}
