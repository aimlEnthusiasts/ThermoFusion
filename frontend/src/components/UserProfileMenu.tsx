// src/components/UserProfileMenu.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfileMenu() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const defaultAvatar = user?.email && !(user && 'isAnonymous' in user && user.isAnonymous)
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.email
        )}&background=0D8ABC&color=fff`
        : "https://res.cloudinary.com/dmgjftmqa/image/upload/v1760428883/unknownUser_wfly4l.png";

    const profilePhoto = user?.photoURL || defaultAvatar;

    const handleSignOut = async () => {
        await signOut();
        setOpen(false);
        navigate("/");
    };

    const handleGotoSettings = async => {
        navigate("/settings")
    }

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {user ? (
                <div ref={menuRef} className="relative">
                    {/* Avatar Button */}
                    <button
                        onClick={() => setOpen((prev) => !prev)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                    >
                        <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-background/95 p-4 text-sm shadow-lg backdrop-blur-md z-50"
                        >
                            <p className="truncate text-muted-foreground mb-3">
                                {user && 'isAnonymous' in user && user.isAnonymous
                                    ? 'Unknown User (Guest)'
                                    : user?.email || 'Unknown'}
                            </p>
                            <Button
                                variant="outline"
                                className="min-w-fit  mr-2.5"
                                onClick={handleGotoSettings}
                            >
                                Settings
                            </Button>
                            <Button
                                variant="outline"
                                className="min-w-fit"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </Button>
                        </motion.div>
                    )}
                </div>
            ) : (
                <Link to="/login">
                    <Button className="relative overflow-hidden group">
                        <span className="relative z-10">Sign In</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                </Link>
            )}
        </motion.div>
    );
}
