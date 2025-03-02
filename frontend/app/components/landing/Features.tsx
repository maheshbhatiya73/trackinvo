'use client';
import { motion } from 'framer-motion';
import { FiZap, FiClock, FiPieChart, FiShield, FiServer, FiActivity } from 'react-icons/fi';

const FeatureCard = ({ icon: Icon, title, description, delay }:any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all"
  >
    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(200px_at_0%_0%,_#06b6d430,_transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative z-10">
      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
      
      <motion.div
        whileHover={{ x: 5 }}
        className="inline-flex items-center mt-4 text-cyan-400 cursor-pointer"
      >
        <span className="mr-2">Learn more</span>
        <span>→</span>
      </motion.div>
    </div>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: FiZap,
      title: "Instant Automation",
      description: "Automate invoice generation, reminders, and follow-ups with smart workflows"
    },
    {
      icon: FiClock,
      title: "Real-time Tracking",
      description: "Monitor payment statuses and client activities with live updates"
    },
    {
      icon: FiPieChart,
      title: "Advanced Analytics",
      description: "Visual financial reports and customizable dashboards"
    },
    {
      icon: FiShield,
      title: "Bank-grade Security",
      description: "End-to-end encryption and GDPR compliant data handling"
    },
    {
      icon: FiServer,
      title: "Cloud Sync",
      description: "Access your data anywhere with automatic multi-device sync"
    },
    {
      icon: FiActivity,
      title: "AI Insights",
      description: "Predictive analytics and financial health assessments"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900  overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-96 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Modern Business
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Everything you need to streamline your invoicing process and financial management
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full" />
            <button className="relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-400/30 transition-all">
              Start Your Free Trial Today
              <span className="ml-3">🚀</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;