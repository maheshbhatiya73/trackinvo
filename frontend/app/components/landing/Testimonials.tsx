"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { LuMessageSquare } from 'react-icons/lu';

// Testimonial Card Component
const TestimonialCard = ({ name, role, company, quote, avatar, rating, delay, isFeatured }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group bg-gradient-to-br ${
        isFeatured 
          ? 'from-cyan-400/10 via-blue-500/10 to-purple-500/10 border-cyan-400/30' 
          : 'from-white/5 to-gray-900/5 border-white/10'
      } backdrop-blur-xl rounded-2xl p-6 border-2 hover:border-cyan-400/50 transition-all duration-300`}
    >
      {/* Floating Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-[radial-gradient(200px_at_center,_#06b6d430,_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      {/* Featured Badge */}
      {isFeatured && (
        <motion.div
          className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-xs font-semibold text-white flex items-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiStar className="mr-1" /> Featured
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Quote Icon */}

        {/* Rating Stars */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + i * 0.1 }}
            >
              <FiStar
                className={`w-5 h-5 ${
                  i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.p
          className="text-gray-200 text-lg mb-6 italic leading-relaxed"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.9 }}
        >
          "{quote}"
        </motion.p>

        {/* User Info */}
        <div className="flex items-center">
          <motion.img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full mr-4 border-2 border-cyan-400/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          <div>
            <h4 className="text-white font-semibold">{name}</h4>
            <p className="text-gray-400 text-sm">
              {role} at <span className="text-cyan-400">{company}</span>
            </p>
          </div>
        </div>

        {/* Hover Effect Particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                initial={{ scale: 0, x: '50%', y: '50%' }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CFO",
      company: "TechCorp",
      quote: "This platform transformed our invoicing process. What used to take hours now takes minutes!",
      avatar: "https://i.pravatar.cc/150?img=7",
      rating: 5,
      isFeatured: true,
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      company: "CreativeFlow",
      quote: "The AI insights help me predict cash flow and make better business decisions.",
      avatar: "https://i.pravatar.cc/150?img=10",
      rating: 4,
      isFeatured: false,
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Manager",
      company: "ScaleUp",
      quote: "The automation features saved our team countless hours of manual work.",
      avatar: "https://i.pravatar.cc/150?img=30",
      rating: 5,
      isFeatured: false,
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Background Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-96 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl"
      />
      
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(600px_at_center,_rgba(6,182,212,0.1),_transparent)]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Users Say
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Real stories from businesses thriving with TrackInvo
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-400/30 transition-all"
            >
              Join Our Happy Customers
              <motion.span
                className="ml-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-cyan-400 rounded-full blur-sm"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;