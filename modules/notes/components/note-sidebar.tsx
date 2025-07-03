"use client";

import { useState } from "react";
import { Plus, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { COLORS } from "../types";

interface NoteSidebarProps {
  onCreateNote: (color: string) => void;
}

export function NoteSidebar({ onCreateNote }: NoteSidebarProps) {
  const [showColors, setShowColors] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const handleCreateClick = () => {
    setShowColors(!showColors);
  };

  const handleColorSelect = (color: string) => {
    onCreateNote(color);
    setShowColors(false);
  };

  const handleSignOut = () => {
    signOut({ redirectTo: "/sign-in" });
  };

  return (
    <div className="w-24 bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-6 border-r border-gray-200 dark:border-gray-800">
      {/* App Name */}
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          Lucid
        </h1>
      </div>

      {/* Create Button */}
      <div className="relative mb-6">
        <motion.button
          onClick={handleCreateClick}
          className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6 text-white dark:text-black" />
        </motion.button>

        {/* Color Options */}
        <AnimatePresence>
          {showColors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 flex flex-col space-y-2"
            >
              {COLORS.map((colorOption) => (
                <motion.button
                  key={colorOption.value}
                  onClick={() => handleColorSelect(colorOption.value)}
                  className="w-8 h-8 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: colorOption.value }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: COLORS.indexOf(colorOption) * 0.1 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-12 h-12 p-0 mb-4 hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {/* User Avatar & Sign Out */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
