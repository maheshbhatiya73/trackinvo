"use client"; // For Next.js client-side rendering

import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Close icon from react-icons
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button'; // Adjust path as needed

interface ModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Callback to close the modal
  title?: string; // Optional title for the modal
  children: React.ReactNode; // Content inside the modal
  width?: string; // Optional width customization (e.g., '500px', '80%')
  showCloseButton?: boolean; // Optional toggle for bottom close button
  onProcess?: () => void; // Optional callback for the process/save button
  processLabel: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = '500px', // Default width
  showCloseButton = false, // Default to hidden
  onProcess, // Callback for the process button
  processLabel
}) => {
  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Modal content animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-6"
            style={{ width, maxWidth: '90vw', maxHeight: '90vh' }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Close modal"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div
              className="overflow-y-auto max-h-[70vh] flex flex-col gap-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none; /* Hide scrollbar for Webkit browsers */
                }
              `}</style>
              {children}
              {showCloseButton && (
                <div className="flex justify-end space-x-2">
                  {onProcess && (
                    <Button
                      variant="primary"
                      size="medium"
                      className="cursor-pointer"
                      onClick={onProcess}
                    >
                      {processLabel || "save"}
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="medium"
                    className="cursor-pointer"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;