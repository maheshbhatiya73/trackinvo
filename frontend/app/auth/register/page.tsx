"use client";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api, setAuthData } from "@/app/lib/api"; // Assuming this is the correct path
import Loader from "@/app/components/loader"; // Assuming this is the correct path

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!termsAccepted) {
      setError("You must agree to the Terms and Privacy Policy.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.register(name, email, password, "user"); // Assuming "USER" as default role
      setAuthData(data.token, data.userId); // Store token and userId
      router.push("/dashboard"); // Redirect to dashboard on success
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-hidden">
      {/* Loader component */}
      <Loader isLoading={isLoading} />

      {/* Animated background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute w-[100px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">$</span>
            </div>
            <h1 className="text-3xl font-bold text-white">TrackInvo</h1>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Start Your Free Trial
          </motion.h2>
          <p className="text-gray-300">Manage invoices smarter, faster, better</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Signup Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                required
              />
            </div>
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                required
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                required
              />
            </div>
            {/* Password Strength */}
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 w-full bg-white/10 rounded-full"
                  whileHover={{ scaleY: 1.5 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="appearance-none w-5 h-5 border border-white/20 rounded-md checked:bg-cyan-400/20"
              />
              <FiCheck className="absolute inset-0 text-cyan-400 opacity-0 pointer-events-none transition-opacity check:opacity-100" />
            </div>
            <label htmlFor="terms" className="text-sm text-gray-300">
              I agree to the{" "}
              <a href="#" className="text-cyan-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-cyan-400 hover:underline">
                Privacy Policy
              </a>
            </label>
          </motion.div>

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-400/20 transition-all ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            <FiArrowRight className="text-xl" />
          </motion.button>
        </form>

        {/* Social Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-400">Or sign up with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ y: -2 }}
              className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-lg flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaGoogle className="text-xl" />
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-lg flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaGithub className="text-xl" />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          <p>
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
            >
              Log in
            </button>
          </p>
          <p className="mt-2">
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Resend confirmation email
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default SignupPage;