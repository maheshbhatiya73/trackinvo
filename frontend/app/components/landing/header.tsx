"use client";
import { getToken } from '@/app/lib/api';
import { motion } from 'framer-motion';
import { useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbInvoice } from 'react-icons/tb';

const Header = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const router = useRouter();
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleMouseMove = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleGetstart = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <header className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-96 h-96 bg-purple-500/10 rounded-full -top-48 -left-48"
      />
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'loop',
        }}
        className="absolute w-64 h-64 border-4 border-cyan-300/20 rounded-full -top-32 -right-32"
      />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold"><TbInvoice />
              </span>
            </div>
            <span className="text-white text-2xl font-bold">TrackInvo</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Pricing', 'Testimonials'].map((item, index) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.05, color: '#06b6d4' }}
                className="text-gray-200 hover:text-cyan-400 cursor-pointer font-medium"
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              onClick={handleGetstart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer ml-8 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-400/30 transition-shadow"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container px-6 relative z-10 pt-20">
        <div className="flex flex-row lg:flex-row items-center justify-between ">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
            >
              Revolutionize Your
              <motion.span
                initial={{ backgroundSize: '0% 100%' }}
                animate={{ backgroundSize: '100% 100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent bg-[length:100%_100%]"
              >
                {' '}Invoice Management
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-gray-200 mb-12"
            >
              Transform your billing process with AI-powered invoice tracking, automated reminders, and real-time analytics.
            </motion.p>

            <motion.div
              onMouseMove={handleMouseMove}
              style={{ rotateX, rotateY }}
              className="inline-block perspective"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold text-lg shadow-2xl hover:shadow-cyan-400/40 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <motion.span
                    className="ml-3"
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side - Image Container */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="lg:w-1/3 mt-12 lg:mt-0 "
          >
            <div className="relative max-w-md mx-auto lg:mx-0">
              {/* Image Container with Decorative Elements */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-3xl blur-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.img
                src="https://virtualtrader.com/wp-content/uploads/2024/06/E-InvoicingSquare.png" // Replace with your preferred image URL
                alt="Invoice Management"
                className="relative z-10 w-full rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
              {/* Floating Card Effect */}
              
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-indigo-900/50 to-transparent pointer-events-none"
      />
    </header>
  );
};

export default Header;