// src/components/UserProfileMenu.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfileMenu() {
    // COMMENTED OUT: Authentication logic disabled
    // const { user, signOut } = useAuth();
    // const navigate = useNavigate();

    // // Fallback avatar (for email/password users)
    // const defaultAvatar = user?.email
    //     ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
    //         user.email
    //     )}&background=0D8ABC&color=fff`
    //     : "/default-avatar.png"; // Optional local default

    // // If user signed in with Google, Firebase provides `photoURL`
    // const profilePhoto = user?.photoURL || defaultAvatar;

    // const handleSignOut = async () => {
    //     await signOut();
    //     navigate('/');
    // };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {/* COMMENTED OUT: User profile menu disabled */}
            {/* {user ? (
                <div className="relative group">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                        <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </button>

                    <div className="absolute right-0 mt-2 hidden w-56 rounded-xl border border-white/10 bg-background/95 p-4 text-sm shadow-lg backdrop-blur-md group-hover:block">
                        <p className="truncate text-muted-foreground mb-3">
                            {user.email}
                        </p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            ) : (
                <Link to="/login">
                    <Button className="relative overflow-hidden group">
                        <span className="relative z-10">Sign In</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                </Link>
            )} */}
            <div className="text-muted-foreground text-sm">
                Authentication disabled
            </div>
        </motion.div>
    );
}
