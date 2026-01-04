import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import Confetti from "react-confetti";
import {
  FiTrendingUp,
  FiImage,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiCheck,
  FiStar,
  FiZap,
  FiShield,
  FiAward,
  FiArrowRight,
  FiMenu,
  FiX,
  FiLinkedin,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMail as FiEmail,
  FiMessageSquare,
  FiDownload,
  FiSmartphone,
} from "react-icons/fi";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState({});
  const [cardDimensions, setCardDimensions] = useState({});
  const cardRefs = useRef({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  
  // Backend URL for APK download
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const apkDownloadUrl = `${BACKEND_URL}/download/lcm.apk`;

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");
      
      if (user && authToken && user !== "null" && authToken !== "null") {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserRole(userData.role || "user");
        } catch (parseError) {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "Tech Solutions India",
      location: "Mumbai, Maharashtra",
      rating: 5,
      text: "LCM has transformed our marketing campaigns! The Meta Ads management is incredibly intuitive, and we've seen a 3x increase in our ROI. The support team is always responsive and helpful.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "Digital Marketing Pro",
      location: "Delhi, NCR",
      rating: 5,
      text: "Best marketing platform I've used! The WhatsApp marketing feature helped us reach 10,000+ customers in just one month. The pricing is very affordable for small businesses like ours.",
    },
    {
      id: 3,
      name: "Amit Patel",
      company: "E-commerce Ventures",
      location: "Ahmedabad, Gujarat",
      rating: 5,
      text: "The IVR campaign feature is a game-changer! We've automated our customer engagement and seen a 40% increase in lead conversion. The platform is easy to use and the results speak for themselves.",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      company: "Creative Agency Hub",
      location: "Bangalore, Karnataka",
      rating: 5,
      text: "Love the Creative Workshop feature! We can create stunning festival creatives in minutes. The email marketing campaigns have improved our customer retention significantly. Highly recommended!",
    },
    {
      id: 5,
      name: "Vikram Singh",
      company: "Startup Growth Co.",
      location: "Pune, Maharashtra",
      rating: 5,
      text: "As a startup, we needed an all-in-one solution, and LCM delivered perfectly! The Premium Plan gives us access to all features at a great price. Our marketing efficiency has improved by 60%.",
    },
    {
      id: 6,
      name: "Anjali Mehta",
      company: "Retail Marketing Solutions",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      text: "The SMS marketing feature has been incredible for our retail business. We can send targeted offers to customers instantly. The analytics dashboard helps us track everything in real-time.",
    },
  ];

  // Auto-scroll testimonials carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getDashboardPath = () => {
    return userRole === "admin" ? "/admin" : "/user";
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      id: 1,
      name: "BASIC PLAN",
      regularPrice: 2000,
      earlyBirdPrice: 999,
      discount: 50,
      period: "month",
      features: [
        "Email Marketing",
        "SMS Marketing",
        "Premium Festival Creatives",
        "Basic Customer Support",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "PREMIUM PLAN",
      regularPrice: 5000,
      earlyBirdPrice: 2999,
      discount: 40,
      period: "month",
      features: [
        "Meta Ads",
        "WhatsApp Marketing",
        "Email Marketing",
        "SMS Marketing",
        "IVR Voice Campaign",
        "1k IVR Free Credits",
        "24x7 Priority Support (Live Chat)",
        "Premium Festival Creatives",
      ],
      popular: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const particlesInit = useCallback(async (engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error("Error loading particles:", error);
    }
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles container loaded:", container);
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-br from-teal-600 via-emerald-500 to-lime-400 min-h-screen overflow-x-hidden relative">
      {/* Fixed Navigation */}
      <motion.nav
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-teal-600 via-emerald-500 to-lime-400 backdrop-blur-md shadow-lg border-b border-white/20"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <img 
              src="/LCMLOGO.png" 
              alt="LCM Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-white">
              LCM
            </span>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Contact
            </a>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
            {isLoggedIn ? (
              <Link
                to={getDashboardPath()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold transition shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-300 font-semibold transition text-sm md:text-base hidden md:block"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold transition shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  Sign Up Free
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gradient-to-br from-teal-600 via-emerald-500 to-lime-400 border-t border-white/20 z-40"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-yellow-300 transition font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-yellow-300 transition font-medium"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-yellow-300 transition font-medium"
              >
                Pricing
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-yellow-300 transition font-medium"
              >
                Contact
              </a>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-yellow-300 font-semibold transition"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-700 via-emerald-600 to-lime-500 text-white pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden z-10">
        {/* Galaxy Particles - Hero Section Only */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ zIndex: 1 }}
        >
          <Particles
            id="galaxy-particles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "grab",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 3,
                  },
                  grab: {
                    distance: 200,
                    links: {
                      opacity: 0.5,
                    },
                  },
                },
              },
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 200,
                  enable: true,
                  opacity: 0.3,
                  width: 1,
                },
                collisions: {
                  enable: false,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: true,
                  speed: 0.5,
                  straight: false,
                  attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200,
                  },
                },
                number: {
                  density: {
                    enable: true,
                    area: 1000,
                  },
                  value: 100,
                },
                opacity: {
                  value: 0.8,
                  random: {
                    enable: true,
                    minimumValue: 0.3,
                  },
                  animation: {
                    enable: true,
                    speed: 0.5,
                    minimumValue: 0.2,
                    sync: false,
                  },
                },
                shape: {
                  type: ["circle", "star"],
                  options: {
                    star: {
                      sides: 5,
                    },
                  },
                },
                size: {
                  value: { min: 1, max: 4 },
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 0.5,
                    sync: false,
                  },
                },
              },
              detectRetina: true,
            }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <motion.div variants={itemVariants} className="md:w-1/2 text-center md:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
              >
                🚀 All-in-One Marketing Platform
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
              >
                Manage Your
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Marketing Campaigns
                </span>
                Like a Pro
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
              >
                Meta Ads, IVR Calls, WhatsApp, Email & SMS Marketing - All in one powerful platform. 
                Create, manage, and optimize your campaigns with ease.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                {isLoggedIn ? (
                  <Link
                    to={getDashboardPath()}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition transform hover:scale-105 text-center"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition transform hover:scale-105 text-center"
                  >
                    Get Started
                  </Link>
                )}
                <a
                  href="#features"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-xl font-bold text-lg transition text-center"
                >
                  Explore Features
                </a>
              </motion.div>
              {/* Download APK Section */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
              >
                <motion.a
                  href={apkDownloadUrl}
                  download="LCM.apk"
                  className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-purple-500/50 flex items-center gap-3 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></span>
                  <FiSmartphone className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Download Mobile App</span>
                  <FiDownload className="w-5 h-5 relative z-10 group-hover:translate-y-1 transition-transform" />
                </motion.a>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <FiCheck className="w-4 h-4 text-green-300" />
                  <span>Free Download</span>
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 text-sm"
              >
                <div className="flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">5,000+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">99.9% Uptime</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="md:w-1/2 flex justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="relative w-full max-w-2xl z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-2xl opacity-50 transform rotate-6 z-0" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 p-2 md:p-4 shadow-2xl z-10">
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-4 py-2 rounded-full shadow-xl z-20">
                    NEW
                  </div>
                  <div className="relative rounded-2xl">
                    <img 
                      src="/10902.jpg" 
                      alt="LCM Marketing Platform" 
                      className="w-full h-auto object-contain rounded-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/10 backdrop-blur-sm border-b border-white/20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "5K", label: "Active Users" },
              { number: "12K", label: "Campaigns Created" },
              { number: "₹2.5Cr", label: "Ad Spend Managed" },
              { number: "99.9%", label: "Uptime Guarantee" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Succeed in Marketing
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive marketing tools designed to help you reach your audience across all channels
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Meta Ads Management",
                desc: "Create, manage, and optimize your Facebook & Instagram ad campaigns with precision targeting and powerful analytics.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <FiPhone className="w-8 h-8" />,
                title: "IVR Call Marketing",
                desc: "Interactive Voice Response system for automated customer engagement and lead generation.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: <FiMessageSquare className="w-8 h-8" />,
                title: "WhatsApp Marketing",
                desc: "Reach customers directly on WhatsApp with personalized messages and automated campaigns.",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: <FiMail className="w-8 h-8" />,
                title: "Email Marketing",
                desc: "Create effective email campaigns with beautiful templates and advanced automation.",
                color: "from-red-500 to-red-600",
              },
              {
                icon: <FiMessageCircle className="w-8 h-8" />,
                title: "SMS Marketing",
                desc: "Send targeted text messages with high open rates and instant delivery.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: <FiImage className="w-8 h-8" />,
                title: "Creative Workshop",
                desc: "Admin-controlled creative management with drag-and-drop functionality and real-time preview.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Advanced Analytics",
                desc: "Real-time performance metrics, ROI tracking, and detailed insights across all your campaigns.",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                icon: <FiZap className="w-8 h-8" />,
                title: "AI-Powered Insights",
                desc: "Get intelligent recommendations and automated optimizations powered by advanced AI algorithms.",
                color: "from-cyan-500 to-cyan-600",
              },
              {
                icon: <FiAward className="w-8 h-8" />,
                title: "Flexible Subscriptions",
                desc: "Choose from monthly plans that fit your business needs and budget.",
                color: "from-orange-500 to-orange-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group bg-white/40 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="py-20 bg-white/10 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative group z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity z-0" />
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30 z-10">
                <img 
                  src="/5616698.jpg" 
                  alt="Marketing Solutions" 
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
                <img 
                  src="/86652-OI65AH-119.jpg" 
                  alt="Business Growth" 
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 transform -translate-x-1/2" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="space-y-16"
              >
                {[
                  {
                    step: "1",
                    title: "Sign Up & Connect",
                    desc: "Create your free account and connect your Meta (Facebook) account securely with one-click OAuth integration.",
                    icon: <FiShield className="w-6 h-6" />,
                  },
                  {
                    step: "2",
                    title: "Choose Your Channel",
                    desc: "Select from Meta Ads, IVR Calls, WhatsApp, Email, or SMS marketing based on your campaign goals.",
                    icon: <FiTrendingUp className="w-6 h-6" />,
                  },
                  {
                    step: "3",
                    title: "Create & Launch",
                    desc: "Use our intuitive interface to set up campaigns, upload creatives, and launch with advanced targeting options.",
                    icon: <FiZap className="w-6 h-6" />,
                  },
                  {
                    step: "4",
                    title: "Monitor & Optimize",
                    desc: "Track real-time performance, analyze metrics, and use AI-powered insights to optimize your campaigns.",
                    icon: <FiAward className="w-6 h-6" />,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} mb-8 md:mb-0`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/30"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-4xl text-blue-600">{item.icon}</div>
                          <div>
                            <div className="text-sm font-semibold text-blue-600 mb-1">STEP {item.step}</div>
                            <h3 className="text-2xl font-bold text-gray-800">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      </motion.div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -ml-6 h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full items-center justify-center text-white font-bold text-xl z-20 shadow-xl">
                      {item.step}
                    </div>
                    <div className="md:w-1/2"></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/10 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-white/90 backdrop-blur-md text-green-700 rounded-full text-sm font-semibold mb-4 border border-white/50">
              Client Reviews
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
              What Our Clients Say
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Trusted by thousands of businesses across India
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="max-w-5xl mx-auto relative">
            <div className="overflow-hidden rounded-3xl">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                animate={{
                  x: `-${currentTestimonial * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="min-w-full px-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: index === currentTestimonial ? 1 : 0.7,
                        scale: index === currentTestimonial ? 1 : 0.95,
                      }}
                      className="bg-white/95 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/50 shadow-2xl"
                    >
                      {/* Rating Stars */}
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FiStar
                            key={i}
                            className="w-6 h-6 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-700 text-center mb-8 leading-relaxed italic"
                      >
                        "{testimonial.text}"
                      </motion.p>

                      {/* Client Info */}
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 font-medium mb-1">
                          {testimonial.company}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {testimonial.location}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setCurrentTestimonial(
                  (prev) => (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 z-20"
              aria-label="Previous testimonial"
            >
              <FiArrowRight className="w-6 h-6 text-gray-700 rotate-180" />
            </button>
            <button
              onClick={() =>
                setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 z-20"
              aria-label="Next testimonial"
            >
              <FiArrowRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Testimonial Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "4.9/5", label: "Average Rating", icon: <FiStar className="w-6 h-6" /> },
              { number: "500+", label: "Happy Clients", icon: <FiCheck className="w-6 h-6" /> },
              { number: "98%", label: "Satisfaction Rate", icon: <FiAward className="w-6 h-6" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50"
              >
                <div className="flex justify-center mb-3 text-yellow-500">
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white/10 backdrop-blur-sm relative z-10">
        {/* Grid Particles Pattern */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
          <Particles
            id="pricing-particles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              interactivity: {
                events: {
                  onHover: {
                    enable: false,
                  },
                  resize: true,
                },
              },
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  enable: true,
                  color: "#ffffff",
                  distance: 80,
                  opacity: 0.3,
                  width: 1,
                },
                collisions: {
                  enable: false,
                },
                move: {
                  enable: true,
                  direction: "none",
                  outModes: {
                    default: "bounce",
                  },
                  random: true,
                  speed: 0.5,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.6,
                },
                shape: {
                  type: "square",
                },
                size: {
                  value: 4,
                },
              },
              detectRetina: true,
            }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-white/90 backdrop-blur-md text-green-700 rounded-full text-sm font-semibold mb-4 border border-white/50">
              Affordable Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Choose the plan that works best for your business needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                ref={(el) => {
                  cardRefs.current[plan.id] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: plan.popular ? 1.05 : 1.03,
                  y: plan.popular ? -8 : -5,
                }}
                onHoverStart={() => {
                  const card = cardRefs.current[plan.id];
                  if (card) {
                    const rect = card.getBoundingClientRect();
                    setCardDimensions(prev => ({
                      ...prev,
                      [plan.id]: {
                        width: rect.width,
                        height: rect.height,
                      }
                    }));
                    setConfettiActive(prev => ({ ...prev, [plan.id]: true }));
                    setTimeout(() => {
                      setConfettiActive(prev => ({ ...prev, [plan.id]: false }));
                    }, 3000);
                  }
                }}
                className={`relative rounded-3xl transition-all duration-500 ${
                  plan.popular
                    ? "md:-mt-4 z-20"
                    : "z-10"
                }`}
                style={{
                  background: plan.popular 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.90) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: plan.popular
                    ? '0 20px 60px rgba(147, 51, 234, 0.3), 0 0 0 2px rgba(147, 51, 234, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
                    : '0 15px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                {/* Confetti inside card */}
                {confettiActive[plan.id] && cardDimensions[plan.id] && (
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none" style={{ zIndex: 1000 }}>
                    <Confetti
                      width={cardDimensions[plan.id].width}
                      height={cardDimensions[plan.id].height}
                      recycle={false}
                      numberOfPieces={200}
                      gravity={0.3}
                      colors={plan.popular 
                        ? ['#9333EA', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
                        : ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
                      }
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>
                )}
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none"
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-xs font-bold shadow-xl relative z-[100] inline-block">
                      <span className="relative z-10">Most Popular</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-50"></span>
                    </span>
                  </motion.div>
                )}
                <div className="overflow-hidden rounded-3xl">
                  {/* Gradient overlay for popular card */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                  )}
                  <div className={`p-8 ${plan.popular ? "pt-14" : "pt-8"} relative`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <h3 className={`text-2xl font-extrabold mb-4 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                          : "text-gray-800"
                      }`}>
                        {plan.name}
                      </h3>
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-black text-gray-900 tracking-tight">
                            ₹{plan.earlyBirdPrice.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-lg">/{plan.period}</span>
                          {plan.discount && (
                            <motion.span 
                              className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
                              whileHover={{ scale: 1.1 }}
                            >
                              {plan.discount}% OFF
                            </motion.span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-gray-400 line-through text-sm">
                            From ₹{plan.regularPrice.toLocaleString()}
                          </span>
                          <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                            Launching Offer
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start group"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                          >
                            <div className="flex-shrink-0 mr-3 mt-0.5">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <FiCheck className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={isLoggedIn ? "/user/subscription" : "/signup"}
                          className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 text-center block relative overflow-hidden group ${
                            plan.popular
                              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md hover:shadow-lg"
                          }`}
                          style={{
                            backgroundSize: plan.popular ? '200% 100%' : '100% 100%',
                          }}
                          onMouseEnter={(e) => {
                            if (plan.popular) {
                              e.currentTarget.style.backgroundPosition = 'right center';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (plan.popular) {
                              e.currentTarget.style.backgroundPosition = 'left center';
                            }
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoggedIn ? "View Plan" : "Get Started"}
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                          {plan.popular && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                          )}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/user/subscription"
                className="inline-flex items-center gap-2 text-white hover:text-yellow-300 font-semibold text-lg transition-colors bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 group"
              >
                View All Plans <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-white/90 backdrop-blur-md text-green-700 rounded-full text-sm font-semibold mb-4 border border-white/50">
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
              Contact Us
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              We're here to help! Reach out to us through any of these channels
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10"
          >
            {/* Phone Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative z-10 bg-white/95 backdrop-blur-lg p-8 rounded-2xl border border-white/50 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Customer Support</h3>
              <div className="space-y-2">
                <a href="tel:8882921155" className="block text-blue-600 hover:text-blue-800 font-semibold">
                  8882921155
                </a>
                <a href="tel:8506003018" className="block text-blue-600 hover:text-blue-800 font-semibold">
                  8506003018
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative z-10 bg-white/95 backdrop-blur-lg p-8 rounded-2xl border border-white/50 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiEmail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Email Us</h3>
              <div className="space-y-2">
                <a href="mailto:info@leadscraftmarketing.com" className="block text-green-600 hover:text-green-800 font-semibold text-sm break-all">
                  info@leadscraftmarketing.com
                </a>
                <a href="mailto:support@leadscraftmarketing.com" className="block text-green-600 hover:text-green-800 font-semibold text-sm break-all">
                  support@leadscraftmarketing.com
                </a>
              </div>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="relative z-10 bg-white/95 backdrop-blur-lg p-8 rounded-2xl border border-white/50 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">WhatsApp</h3>
              <div className="space-y-2">
                <a
                  href="https://wa.me/918882921155"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-emerald-600 hover:text-emerald-800 font-semibold transition-colors"
                >
                  8882921155
                </a>
                <a
                  href="https://wa.me/918506003018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-emerald-600 hover:text-emerald-800 font-semibold transition-colors"
                >
                  8506003018
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold mb-8 text-white drop-shadow-lg">Follow Us</h3>
            <div className="flex justify-center gap-6">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://www.linkedin.com/in/leads-craft-marketing-9404a3391?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition shadow-lg"
              >
                <FiLinkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="https://www.instagram.com/leads_craft_marketing?igsh=MWk1MmwyNDNiY2tsYw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
              >
                <FiInstagram className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://www.facebook.com/share/1D7f1u998J/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition shadow-lg"
              >
                <FiFacebook className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="https://youtube.com/@leadscraftmarketing?si=vHG1KvhLr2H4RpNU"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition shadow-lg"
              >
                <FiYoutube className="w-6 h-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-700 via-emerald-600 to-lime-500 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Ready to Transform Your Marketing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-blue-100"
          >
            Join thousands of marketers who are saving time, reducing costs, and boosting results with LCM
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {isLoggedIn ? (
              <Link
                to={getDashboardPath()}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
            <a
              href="#features"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-xl font-bold text-lg transition"
            >
              Learn More
            </a>
          </motion.div>
          {!isLoggedIn && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-blue-100"
            >
              No credit card required • Cancel anytime
            </motion.p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/LCMLOGO.png" 
                  alt="LCM Logo" 
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold">LCM</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                All-in-one marketing platform for Meta Ads, IVR Calls, WhatsApp, Email & SMS. 
                Manage your campaigns with ease and grow your business.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping-policy"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cancellations-and-refunds"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Cancellations and Refunds
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@leadscraftmarketing.com" className="text-gray-400 hover:text-white transition">
                    support@leadscraftmarketing.com
                  </a>
                </li>
                <li>
                  <a href="tel:8882921155" className="text-gray-400 hover:text-white transition">
                    8882921155
                  </a>
                </li>
                <li>
                  <a href="tel:8506003018" className="text-gray-400 hover:text-white transition">
                    8506003018
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/918882921155" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    WhatsApp: 8882921155
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/918506003018" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    WhatsApp: 8506003018
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} LeadsCraft Marketing (LCM). All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="https://www.linkedin.com/in/leads-craft-marketing-9404a3391?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/leads_craft_marketing?igsh=MWk1MmwyNDNiY2tsYw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/share/1D7f1u998J/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com/@leadscraftmarketing?si=vHG1KvhLr2H4RpNU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
