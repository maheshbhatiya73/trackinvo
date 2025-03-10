"use client";
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api, setAuthData } from '@/app/lib/api';
import Loader from '@/app/components/loader';
import { useToast } from '@/app/Context/ToastContext';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await api.login(email, password, showToast);
      setAuthData(data.token, data.user.id);
      
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-hidden">
       <Loader isLoading={isLoading} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
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
            Streamline Your Invoices
          </motion.h2>
          <p className="text-gray-300">Effortless invoice management made simple</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-center"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                required
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                required
              />
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-400/20 transition-all ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <FiArrowRight className="text-xl" />
          </motion.button>
        </form>

        {/* Rest of the component remains the same */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-400">Or continue with</span>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          <p>
            Don't have an account?{' '}
            <a onClick={() => router.push('/auth/register')} className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">
              Sign up
            </a>
          </p>
          <a 
            href="#" 
            className="inline-block mt-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Forget password?
          </a>
        </motion.div>
      </motion.div>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
};

export default LoginPage;