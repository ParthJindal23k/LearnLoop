import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";


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
        teachSkills: form.teachSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        learnSkills: form.learnSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/register`,
        payload
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2 bg-gray-50">

      <div className="relative flex items-center justify-center px-6 sm:px-10 lg:px-20
                bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4"
          >
            Learn Faster.
            <br />
            Teach Smarter.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg lg:text-xl text-white/90 mb-8"
          >
            LearnLoop connects learners and mentors for real,
            1-on-1 skill exchange — no courses, no fluff.
          </motion.p>

          <div className="space-y-6">
            {[
              { icon: "🎯", text: "Match with people who actually know the skill you want" },
              { icon: "🤝", text: "Teach what you’re good at and learn in return" },
              { icon: "⚡", text: "Live sessions, real feedback, real growth" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-4"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-white/90">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-10 text-sm text-white/70"
          >
            Built for learners who value real skills.
          </motion.p>
        </motion.div>
      </div>


      <div className="flex justify-center items-start md:items-center px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1"
          >
            Create your account
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-sm text-gray-500 mb-6"
          >
            It takes less than a minute
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {[
              {
                label: "Full Name",
                name: "name",
                placeholder: "John Doe",
                type: "text",
                value: form.name,
              },
              {
                label: "Email Address",
                name: "email",
                placeholder: "john@example.com",
                type: "text",
                value: form.email,
              },
              {
                label: "Password",
                name: "password",
                placeholder: "••••••••",
                type: "password",
                value: form.password,
              },
              {
                label: "Skills you can teach",
                name: "teachSkills",
                placeholder: "React, DSA, Java",
                type: "text",
                value: form.teachSkills,
                helper: "Separate skills with commas",
              },
              {
                label: "Skills you want to learn",
                name: "learnSkills",
                placeholder: "Node.js, System Design",
                type: "text",
                value: form.learnSkills,
              },
            ].map((field, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                <label className="block text-sm text-gray-600 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {field.helper && (
                  <p className="text-xs text-gray-400 mt-1">{field.helper}</p>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition mt-2"
          >
            Create Account
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-xs text-gray-400 text-center mt-4"
          >
            By signing up, you agree to our Terms & Privacy Policy
          </motion.p>
        </motion.div>
      </div>

    </div>
  );
}
