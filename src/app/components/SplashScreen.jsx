// app/components/SplashScreen.jsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-base-100/95 z-50"
    >
      {/* Persian/Azerbaijani pattern background with theme colors */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9InJnYmEoMTg1LDEyOCwxMTgsMC4xKSI+PC9yZWN0Pjwvc3ZnPg==')]"
          style={{ mixBlendMode: "overlay" }}
        ></div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-base-200 border border-primary/20 shadow-xl"
      >
        {/* Animated quill pen writing */}
        <motion.div
          className="relative w-32 h-32 mb-8 flex items-center justify-center"
          animate={{
            x: [0, 5, -5, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
            },
          }}
        >
          <div className="absolute w-16 h-24 bg-gradient-to-b from-primary to-primary-focus rounded-lg shadow-lg transform rotate-12">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSI+PC9yZWN0Pjwvc3ZnPg==')] opacity-10"></div>
          </div>
          <motion.div
            className="absolute w-8 h-24 bg-primary-content origin-bottom transform -rotate-45"
            animate={{
              y: [0, -5, 0],
              rotate: [-45, -50, -45],
              transition: {
                duration: 2,
                repeat: Infinity,
              },
            }}
          >
            <div className="absolute bottom-0 left-0 w-full h-4 bg-primary"></div>
          </motion.div>
        </motion.div>

        {/* Website title with theme colors */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-primary font-[Scheherazade] tracking-wider"
        >
          قیزیل
        </motion.h1>

        {/* Rotating loading texts */}
        <motion.div className="h-8 mb-6 overflow-hidden">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-lg text-base-content/80 text-center"
          >
            "شعرلریمیز یوکلنیر..."
          </motion.p>
        </motion.div>

        {/* Animated progress bar using theme colors */}
        <div className="w-48 sm:w-64 h-2 bg-base-300 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>

        {/* Decorative elements using theme colors */}
        <motion.div
          className="absolute -bottom-6 -right-6 w-12 h-12 text-primary/20"
          animate={{
            rotate: 360,
            transition: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C15 4 15 8 15 12C15 16 15 20 12 22"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 2C9 4 9 8 9 12C9 16 9 20 12 22"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute -top-6 -left-6 w-12 h-12 text-secondary/20"
          animate={{
            rotate: -360,
            transition: {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C9 20 9 16 9 12C9 8 9 4 12 2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 22C15 20 15 16 15 12C15 8 15 4 12 2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Footer attribution */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 text-xs text-base-content/40"
      >
        شعر و ادبیات آذربایجان
      </motion.p>
    </motion.div>
  );
}
