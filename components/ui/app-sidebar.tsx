"use client";

import { useState } from "react";
import { Plus, Moon, Sun, LogOut, User, BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { COLORS } from "@/modules/notes/types";
import { useNotesStore } from "@/modules/notes/store";
import Image from "next/image";

// Desktop Sidebar Component (unchanged)
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
    <div className="w-24 bg-gray-100 dark:bg-gray-900 flex-col items-center py-6 border-r border-gray-200 dark:border-gray-800 hidden lg:flex">
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
            <Image
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

// Mobile Hamburger Menu Button Component
export function MobileMenuButton({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onOpenMenu}
      className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

// Mobile Drawer Menu Content Component
export function MobileDrawerContent({ onClose }: { onClose: () => void }) {
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
    try {
      await createNote({
        title: "Untitled Note",
        content: "",
        tags: ["new"],
        color,
        folderId: selectedFolderId || undefined,
        isPinned: false,
      });
      await fetchFolders();
    } catch (error) {
      console.error("Error creating note:", error);
    }
    setShowColors(false);
    onClose(); // Close mobile menu after creating note
  };

  const handleSignOut = () => {
    signOut({ redirectTo: "/sign-in" });
  };

  const handleAnalyticsClick = () => {
    router.push("/analytics");
    onClose(); // Close mobile menu after navigation
  };

  const handleNotesClick = () => {
    router.push("/");
    onClose(); // Close mobile menu after navigation
  };

  return (
    <div className="flex flex-col h-full px-4">
      {/* Navigation Buttons */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <motion.button
            onClick={handleCreateClick}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Note</span>
          </motion.button>

          {/* Color Options */}
          <AnimatePresence>
            {showColors && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {COLORS.map((colorOption, index) => (
                  <motion.button
                    key={colorOption.value}
                    onClick={() => handleColorSelect(colorOption.value)}
                    className="w-8 h-8 rounded-full hover:scale-110 transition-transform border border-gray-400 dark:border-gray-700"
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
          size="lg"
          onClick={handleNotesClick}
          className={`w-full justify-start h-12 px-4 ${
            pathname === "/" ? "bg-gray-200 dark:bg-gray-800" : ""
          }`}
        >
          <div className="w-5 h-5 bg-gray-600 dark:bg-gray-400 rounded-sm flex items-center justify-center mr-3">
            <div className="w-3 h-3 bg-white dark:bg-gray-900 rounded-sm" />
          </div>
          <span>Notes</span>
        </Button>

        {/* Analytics Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={handleAnalyticsClick}
          className={`w-full justify-start h-12 px-4 ${
            pathname === "/analytics" ? "bg-gray-200 dark:bg-gray-800" : ""
          }`}
        >
          <BarChart3 className="h-5 w-5 mr-3" />
          <span>Analytics</span>
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-full justify-start h-12 px-4 mb-4"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 mr-3" />
        ) : (
          <Moon className="h-5 w-5 mr-3" />
        )}
        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
      </Button>

      {/* User Section */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-3 mb-4 px-4">
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
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onClick={handleSignOut}
          className="w-full justify-start h-12 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

// Mobile Floating Create Note Button
export function MobileFloatingCreateButton() {
  const [showColors, setShowColors] = useState(false);
  const { createNote, selectedFolderId, fetchFolders } = useNotesStore();

  const handleColorSelect = async (color: string) => {
    try {
      await createNote({
        title: "Untitled Note",
        content: "",
        tags: ["new"],
        color,
        folderId: selectedFolderId || undefined,
        isPinned: false,
      });
      await fetchFolders();
    } catch (error) {
      console.error("Error creating note:", error);
    }
    setShowColors(false);
  };

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      {/* Color Options */}
      <AnimatePresence>
        {showColors && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 flex flex-col-reverse space-y-reverse space-y-3"
          >
            {COLORS.map((colorOption, index) => (
              <motion.button
                key={colorOption.value}
                onClick={() => handleColorSelect(colorOption.value)}
                className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white dark:border-gray-800"
                style={{ backgroundColor: colorOption.value }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: (COLORS.length - index - 1) * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setShowColors(!showColors)}
        className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: showColors ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6 text-white dark:text-black" />
        </motion.div>
      </motion.button>
    </div>
  );
}
