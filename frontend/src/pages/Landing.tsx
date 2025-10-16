import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Zap, Download, Satellite, Github, CheckCircle, TrendingUp, Users, Shield, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserProfileMenu from '@/components/UserProfileMenu';
import { StarsBackground } from '@/components/stars';
import { useEffect, useState } from 'react';
import { X } from "lucide-react";
import ThermalVisualizationCard from '@/components/ThermalVisualizationCard';
import ContributorsStack from '@/components/ui/ContributorsStack';

export default function Landing() {

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [showDemo, setShowDemo] = useState(false);

  const handleDemoClick = () => setShowDemo(true);
  const handleCloseDemo = () => setShowDemo(false);

  const contributors = [
    { name: "Org", imageUrl: "https://avatars.githubusercontent.com/u/193256770?s=96&v=4", profileUrl: "https://github.com/aimlEnthusiasts" },
    { name: "Yash", imageUrl: "https://avatars.githubusercontent.com/u/166858346?v=4", profileUrl: "https://yashbarai.netlify.app/" },
    { name: "Sahil", imageUrl: "https://avatars.githubusercontent.com/u/187351491?v=4", profileUrl: "https://sahil-giri.netlify.app/" },
    { name: "Soham", imageUrl: "https://avatars.githubusercontent.com/u/193231889?v=4", profileUrl: "https://github.com/Soham303" },
    { name: "Alsanad", imageUrl: "https://avatars.githubusercontent.com/u/172475158?v=4", profileUrl: "https://mohammad-alsanad-sheikh-portfolio.vercel.app/" },
    { name: "Farhan", imageUrl: "https://avatars.githubusercontent.com/u/170020578?v=4", profileUrl: "https://github.com/farhannsheikhh" },
    { name: "Harshada", imageUrl: "https://avatars.githubusercontent.com/u/198323051?v=4", profileUrl: "https://github.com/harsha05-ui" },
  ];


  // Ensure page starts at top on mount to prevent auto-scroll issues
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur-md shadow-lg shadow-white/5">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
          </motion.div>
          <motion.nav
            className="hidden items-center gap-6 md:flex"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              How it Works
            </a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              Statistics
            </a>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              About
            </Link>
          </motion.nav>
          <UserProfileMenu />

        </div>
      </header>
      <ScrollProgressBar />

      {/* Hero Section */}
      <StarsBackground className="relative overflow-hidden min-h-screen flex items-center">
        <section className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 text-left ml-5"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm shadow-lg shadow-white/10"
              >
                <Satellite className="h-4 w-4 text-white animate-bounce-slow" />
                <span className="text-white/90">ISRO Super-Resolution Initiative</span>
              </motion.div>

              <motion.h1
                className="mb-6 text-4xl font-bold md:text-6xl leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">
                  Optical-Guided
                </span>
                <br />
                <span className="text-white/95">
                  Thermal Super-Resolution
                </span>
              </motion.h1>

              <motion.p
                className="mb-12 max-w-2xl text-lg text-muted-foreground drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Advanced AI-powered enhancement for thermal infrared imagery using optical guidance.
                Transform low-resolution thermal data into crystal-clear insights.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Link to="/dashboard">
                  <Button size="lg" className="relative overflow-hidden group shadow-lg shadow-white/20 hover:shadow-white/30 transition-all duration-300">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDemoClick}
                  className="border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
                >
                  View Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Side - Visualization Card */}
            <motion.div
              className="w-full flex justify-center md:justify-end animate-fade-in delay-300"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ThermalVisualizationCard />
            </motion.div>
          </div>

          {/* Demo Modal */}
          <AnimatePresence>
            {showDemo && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDemo}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl shadow-xl shadow-white/10 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleCloseDemo}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src="https://www.youtube.com/embed/2EFcKO_lVRg?autoplay=1&rel=0"
                    title="ThermoFusion Demo"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </StarsBackground>



      {/* Features Section */}
      <section id="features" className="border-y bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold"
          >
            Powerful Features
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Upload,
                title: 'Easy Upload',
                description: 'Simple drag-and-drop interface for optical and thermal image pairs',
              },
              {
                icon: Zap,
                title: 'AI Enhancement',
                description: 'State-of-the-art deep learning models enhance thermal resolution up to 8x',
              },
              {
                icon: Download,
                title: 'Quick Results',
                description: 'Get high-quality enhanced thermal images with detailed quality metrics',
              },
              {
                icon: Shield,
                title: 'Secure Processing',
                description: 'Enterprise-grade security with Firebase authentication and encrypted storage',
              },
              {
                icon: TrendingUp,
                title: 'Quality Metrics',
                description: 'Comprehensive PSNR, SSIM, and RMSE metrics for each enhancement',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Share and manage super-resolution jobs across your organization',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 border-white/10 hover:border-white/20 group backdrop-blur-sm bg-card/80 hover:bg-card/90">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white/95">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold"
          >
            How It Works
          </motion.h2>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {[
                {
                  step: '01',
                  title: 'Upload Image Pairs',
                  description: 'Provide spatially-aligned optical and thermal image pairs. Our system supports JPEG, PNG, and TIFF formats.',
                  icon: Upload,
                },
                {
                  step: '02',
                  title: 'AI Processing',
                  description: 'Our fusion-based deep learning architecture extracts high-frequency details from optical imagery to guide thermal enhancement.',
                  icon: Zap,
                },
                {
                  step: '03',
                  title: 'Quality Analysis',
                  description: 'Receive enhanced thermal images with comprehensive quality metrics including PSNR, SSIM, and RMSE.',
                  icon: CheckCircle,
                },
                {
                  step: '04',
                  title: 'Download Results',
                  description: 'Export high-resolution thermal imagery ready for analysis, research, or operational use.',
                  icon: Download,
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-6 group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-background shadow-lg shadow-white/20 group-hover:shadow-white/40 group-hover:scale-110 transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <step.icon className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-xl font-bold text-white/95">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="border-y bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold"
          >
            Proven Results
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: '8x', label: 'Max Resolution Increase' },
              { value: '95%', label: 'User Satisfaction' },
              { value: '<5min', label: 'Average Processing Time' },
              { value: '10K+', label: 'Images Processed' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="mb-2 text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300 animate-glow-pulse">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Enhance Your Thermal Imagery?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join researchers and organizations worldwide using ThermoFusion for advanced thermal super-resolution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* COMMENTED OUT: Start Free Trial button disabled */}
              {/* <Link to="/login">
                <Button size="lg">
                  Start Free Trial
                </Button>
              </Link> */}
              <Link to="/dashboard">
                <Button size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Advanced thermal super-resolution for Earth observation
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-bold">Connect</h3>
              <div className="flex gap-4">
                <ContributorsStack contributors={contributors} />
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 ThermoFusion | Built with React, FastAPI, Firebase and ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
