"use client"
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCheck, FiStar } from 'react-icons/fi';

const PricingCard = ({ plan, price, features, popular, delay }:any) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className={`relative group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border-2 ${
      popular 
        ? 'border-cyan-400/40 hover:border-cyan-400/60'
        : 'border-white/10 hover:border-cyan-400/30'
    } transition-all`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-xs font-semibold text-white flex items-center"
        >
          <FiStar className="mr-2" />
          Most Popular
        </motion.div>
      </div>
    )}

    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-white mb-2">{plan}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          ${price}
        </span>
        <span className="text-gray-400 ml-2">/ month</span>
      </div>

      <div className="mb-8">
        {features.map((feature:any, index:number) => (
          <div key={index} className="flex items-center mb-3">
            <FiCheck className="w-5 h-5 text-cyan-400 mr-3" />
            <span className="text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          popular
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg hover:shadow-cyan-400/30'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        Get Started
      </motion.button>
    </div>

    {/* Hover effect gradient */}
    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(300px_at_50%_120%,_#06b6d430,_transparent)] opacity-0 group-hover:opacity-40 transition-opacity" />
  </motion.div>
);

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  
  const plans = [
    {
      plan: "Starter",
      price: "29",
      features: [
        "Up to 50 invoices/month",
        "Basic Analytics",
        "5 Team Members",
        "Email Support",
        "API Access"
      ]
    },
    {
      plan: "Professional",
      price: "79",
      features: [
        "Up to 200 invoices/month",
        "Advanced Analytics",
        "15 Team Members",
        "Priority Support",
        "Custom Branding",
        "Workflow Automation"
      ],
      popular: true
    },
    {
      plan: "Enterprise",
      price: "149",
      features: [
        "Unlimited Invoices",
        "Full Analytics Suite",
        "Unlimited Team Members",
        "24/7 Support",
        "SSO & SAML",
        "Dedicated Account Manager"
      ]
    }
  ];

  return (
    <section className="relative py-20  bg-gradient-to-br from-indigo-900 via-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-96 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Pricing
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-gray-300">Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative w-14 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                animate={{ x: annualBilling ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-white">Annual</span>
              <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-sm rounded">
                -20%
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.plan}
              {...plan}
              delay={index * 0.15}
              price={annualBilling ? (plan.price * 0.8).toFixed(0) : plan.price}
            />
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">
            Need custom solutions? Let's build something amazing together.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all"
          >
            Contact Sales
          </motion.button>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
    </section>
  );
};

export default Pricing;