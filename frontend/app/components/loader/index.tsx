"use client";
import React from "react";
import { motion } from "framer-motion";

function Loader({ isLoading }: any) {
    // Container variants for fade in/out
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 },
        },
    };

    if (!isLoading) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{

            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-15 h-15 border-4 border-transparent text-blue-400 text-4xl spin-outer flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-10 h-10 border-4 border-transparent text-red-400 text-2xl spin-middle flex items-center justify-center border-t-red-400 rounded-full">
                        <div className="w-6 h-6 border-4 border-transparent text-green-400 text-xl spin-inner flex items-center justify-center border-t-green-400 rounded-full" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Loader;