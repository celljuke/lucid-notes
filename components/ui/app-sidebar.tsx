"use client";

import { useState } from "react";
import { Plus, Moon, Sun, LogOut, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { COLORS } from "@/modules/notes/types";
import { useNotesStore } from "@/modules/notes/store";

export function AppSidebar() {
  const [showColors, setShowColors] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const { createNote, selectedFolderId, fetchFolders } = useNotesStore();

  const handleCreateClick = () => {
    setShowColors(!showColors);
  };

  const handleColorSelect = async (color: string) => {
    console.log("color", color);
    try {
      await createNote({
        title: "Untitled Note",
        content: "",
        tags: ["new"],
        color,
        folderId: selectedFolderId || undefined,
        isPinned: false,
      });
      // Refresh folders to update note counts on badges
      await fetchFolders();
    } catch (error) {
      console.error("Error creating note:", error);
    }
    setShowColors(false);
  };

  const handleSignOut = () => {
    signOut({ redirectTo: "/sign-in" });
  };

  const handleAnalyticsClick = () => {
    router.push("/analytics");
  };

  const handleNotesClick = () => {
    router.push("/");
  };

  return (
    <div className="w-24 bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-6 border-r border-gray-200 dark:border-gray-800">
      {/* App Name */}
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          Lucid
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-4 mb-6 w-full flex flex-col items-center">
        <div className="relative">
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
                className="mt-2 justify-center items-center flex flex-col space-y-2"
              >
                {COLORS.map((colorOption, index) => (
                  <motion.button
                    key={colorOption.value}
                    onClick={() => handleColorSelect(colorOption.value)}
                    className="w-6 h-6 rounded-full hover:scale-110 transition-transform border border-gray-400 dark:border-gray-700"
                    style={{ backgroundColor: colorOption.value }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notes Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNotesClick}
          className={`w-12 h-12 p-0 hover:bg-gray-200 dark:hover:bg-gray-800 ${
            pathname === "/" ? "bg-gray-200 dark:bg-gray-800" : ""
          }`}
        >
          <div className="w-6 h-6 bg-gray-600 dark:bg-gray-400 rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white dark:bg-gray-900 rounded-sm" />
          </div>
        </Button>

        {/* Analytics Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAnalyticsClick}
          className={`w-12 h-12 p-0 hover:bg-gray-200 dark:hover:bg-gray-800 ${
            pathname === "/analytics" ? "bg-gray-200 dark:bg-gray-800" : ""
          }`}
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
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
