"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "../components/common/Toast";

// Define types for toast messages
type ToastType = "success" | "error" | "info" | "warning";
type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  position?: ToastPosition;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, position?: ToastPosition, duration?: number) => void;
}

// Create the context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast Provider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Function to add a new toast
  const showToast = (
    type: ToastType,
    message: string,
    position: ToastPosition = "top-right",
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for each toast
    setToasts((prev) => [
      ...prev,
      { id, type, message, position, duration },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            position={toast.position}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};