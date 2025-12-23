import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in
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

  const getDashboardPath = () => {
    return userRole === "admin" ? "/admin" : "/user";
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/LCMLOGO.png" 
              alt="LCM Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LCM
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              FAQ
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
                  className="text-gray-700 hover:text-blue-600 font-semibold transition text-sm md:text-base"
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                🚀 All-in-One Marketing Platform
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Manage Your
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Marketing Campaigns
                </span>
                Like a Pro
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Meta Ads, IVR Calls, WhatsApp, Email & SMS Marketing - All in one powerful platform. 
                Create, manage, and optimize your campaigns with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                    Start Free Trial
                  </Link>
                )}
                <a
                  href="#features"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-xl font-bold text-lg transition text-center"
                >
                  Explore Features
                </a>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">10,000+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="font-semibold">99.9% Uptime</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-2xl opacity-50 transform rotate-6"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 p-6 shadow-2xl">
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-4 py-2 rounded-full shadow-xl animate-pulse">
                    NEW
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <h3 className="text-2xl font-bold mb-2">Mobile & Web</h3>
                    <p className="text-blue-100">Access from anywhere, anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50K+", label: "Campaigns Created" },
              { number: "₹5Cr+", label: "Ad Spend Managed" },
              { number: "99.9%", label: "Uptime Guarantee" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Meta Ads Management",
                desc: "Create, manage, and optimize your Facebook & Instagram ad campaigns with precision targeting and powerful analytics.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: "📞",
                title: "IVR Call Marketing",
                desc: "Interactive Voice Response system for automated customer engagement and lead generation.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: "💬",
                title: "WhatsApp Marketing",
                desc: "Reach customers directly on WhatsApp with personalized messages and automated campaigns. (Coming Soon)",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: "📧",
                title: "Email Marketing",
                desc: "Create effective email campaigns with beautiful templates and advanced automation. (Coming Soon)",
                color: "from-red-500 to-red-600",
              },
              {
                icon: "💬",
                title: "SMS Marketing",
                desc: "Send targeted text messages with high open rates and instant delivery. (Coming Soon)",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: "🎨",
                title: "Creative Workshop",
                desc: "Admin-controlled creative management with drag-and-drop functionality and real-time preview.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: "📈",
                title: "Advanced Analytics",
                desc: "Real-time performance metrics, ROI tracking, and detailed insights across all your campaigns.",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                icon: "🤖",
                title: "AI-Powered Insights",
                desc: "Get intelligent recommendations and automated optimizations powered by advanced AI algorithms.",
                color: "from-cyan-500 to-cyan-600",
              },
              {
                icon: "💳",
                title: "Flexible Subscriptions",
                desc: "Choose from monthly, yearly, or combo plans that fit your business needs and budget.",
                color: "from-orange-500 to-orange-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 transform -translate-x-1/2"></div>

              <div className="space-y-16">
                {[
                  {
                    step: "1",
                    title: "Sign Up & Connect",
                    desc: "Create your free account and connect your Meta (Facebook) account securely with one-click OAuth integration.",
                    icon: "🔐",
                  },
                  {
                    step: "2",
                    title: "Choose Your Channel",
                    desc: "Select from Meta Ads, IVR Calls, WhatsApp, Email, or SMS marketing based on your campaign goals.",
                    icon: "📱",
                  },
                  {
                    step: "3",
                    title: "Create & Launch",
                    desc: "Use our intuitive interface to set up campaigns, upload creatives, and launch with advanced targeting options.",
                    icon: "🚀",
                  },
                  {
                    step: "4",
                    title: "Monitor & Optimize",
                    desc: "Track real-time performance, analyze metrics, and use AI-powered insights to optimize your campaigns.",
                    icon: "📊",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} mb-8 md:mb-0`}>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-4xl">{item.icon}</div>
                          <div>
                            <div className="text-sm font-semibold text-blue-600 mb-1">STEP {item.step}</div>
                            <h3 className="text-2xl font-bold text-gray-800">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -ml-6 h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full items-center justify-center text-white font-bold text-xl z-10 shadow-xl">
                      {item.step}
                    </div>
                    <div className="md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              Affordable Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Basic Plan",
                price: "₹999",
                originalPrice: "₹1,499",
                period: "month",
                features: [
                  "Unlimited Creatives",
                  "Meta Ads Access",
                  "Basic Analytics",
                  "Email Support",
                  "1 Ad Account",
                ],
                popular: false,
                badge: "Early Bird",
              },
              {
                name: "Professional Plan",
                price: "₹2,499",
                originalPrice: "₹3,499",
                period: "month",
                features: [
                  "Everything in Basic",
                  "Advanced Analytics",
                  "Priority Support",
                  "Multiple Ad Accounts",
                  "AI Assistance",
                  "IVR Call Marketing",
                ],
                popular: true,
                badge: "Most Popular",
              },
              {
                name: "Enterprise Plan",
                price: "₹4,999",
                originalPrice: "₹6,999",
                period: "month",
                features: [
                  "Everything in Professional",
                  "Unlimited Everything",
                  "24/7 Dedicated Support",
                  "Custom Integrations",
                  "Dedicated Account Manager",
                  "All Marketing Channels",
                ],
                popular: false,
                badge: "Best Value",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-blue-500 transform md:-translate-y-4 scale-105 bg-white"
                    : "border border-gray-200 bg-white"
                } hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-bold text-center">
                    {plan.badge}
                  </div>
                )}
                {!plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 text-sm font-bold text-center">
                    {plan.badge}
                  </div>
                )}
                <div className={`p-8 ${plan.popular ? "pt-12" : "pt-12"}`}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-400 line-through">
                        {plan.originalPrice}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        Save {Math.round(((parseInt(plan.originalPrice.replace(/[₹,]/g, '')) - parseInt(plan.price.replace(/[₹,]/g, ''))) / parseInt(plan.originalPrice.replace(/[₹,]/g, ''))) * 100)}%
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={isLoggedIn ? getDashboardPath() : "/signup"}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition transform hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    } text-center block`}
                  >
                    {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4 text-lg">
              💰 Looking for yearly billing? Save up to 20% with annual plans!
            </p>
            <Link
              to="/user/subscription"
              className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-lg"
            >
              View Yearly Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              Customer Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers who are growing their business with LCM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "LCM has completely transformed how I manage my Meta ad campaigns. The interface is intuitive, and I've seen a 3x increase in ROI since switching. The IVR feature is a game-changer!",
                name: "Rajesh Kumar",
                role: "Digital Marketing Manager",
                company: "TechStart India",
                rating: 5,
                avatar: "👨‍💼",
              },
              {
                quote:
                  "The campaign management features save me hours every week. Being able to manage Meta Ads, IVR, and plan for WhatsApp marketing all in one place is incredible. Worth every rupee!",
                name: "Priya Sharma",
                role: "E-commerce Owner",
                company: "StyleHub",
                rating: 5,
                avatar: "👩‍💼",
              },
              {
                quote:
                  "Best marketing platform I've found. The analytics are incredibly detailed, and the AI-powered insights help me optimize campaigns in real-time. Customer support is top-notch!",
                name: "Amit Patel",
                role: "Marketing Director",
                company: "GrowthCo",
                rating: 5,
                avatar: "👨‍💻",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-lg">{testimonial.name}</div>
                    <div className="text-blue-100">{testimonial.role}</div>
                    <div className="text-blue-200 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Why Choose LCM?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in digital marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Set up campaigns in minutes, not hours",
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                desc: "Bank-level security with 99.9% uptime",
              },
              {
                icon: "📱",
                title: "Mobile First",
                desc: "Manage everything from your phone",
              },
              {
                icon: "🎯",
                title: "AI-Powered",
                desc: "Smart insights and optimizations",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
              Got Questions?
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about LCM
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "How do I connect my Meta (Facebook) account?",
                answer:
                  "Simply click the 'Connect with Facebook' button in the app or dashboard. You'll be redirected to Facebook's secure login page. Once authorized, your account will be connected automatically, and you can start managing your ad campaigns immediately.",
              },
              {
                question: "Can I manage multiple Meta ad accounts?",
                answer:
                  "Yes! Our Professional and Enterprise plans support managing multiple Facebook and Instagram ad accounts from a single dashboard. You can easily switch between accounts and manage all your campaigns in one place.",
              },
              {
                question: "What marketing channels are available?",
                answer:
                  "Currently, we support Meta Ads (Facebook & Instagram) and IVR Call Marketing. WhatsApp Marketing, Email Marketing, and SMS Marketing are coming soon. All channels will be accessible from the same platform.",
              },
              {
                question: "Is there a free trial available?",
                answer:
                  "Yes! We offer a 14-day free trial for all our plans with full access to all features. No credit card required. You can cancel anytime during the trial period.",
              },
              {
                question: "How does the AI assistance work?",
                answer:
                  "Our built-in AI analyzes your campaign performance and provides intelligent recommendations for optimization. It can suggest better targeting, ad creative improvements, budget adjustments, and answer questions about using the platform effectively.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Absolutely! You can cancel your subscription at any time from your account settings. You'll retain full access to all features until the end of your current billing period. No cancellation fees or penalties.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, UPI, and net banking. We also support annual billing with significant discounts. All payments are processed securely through our payment partners.",
              },
              {
                question: "Do you offer customer support?",
                answer:
                  "Yes! Basic plan includes email support, Professional plan includes priority support, and Enterprise plan includes 24/7 dedicated support with a dedicated account manager. We also have comprehensive documentation and video tutorials.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-semibold text-gray-800 pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-gray-500 flex-shrink-0 transition-transform ${
                      openFaq === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of marketers who are saving time, reducing costs, and boosting results with LCM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                Start Your Free Trial
              </Link>
            )}
            <a
              href="#features"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-xl font-bold text-lg transition"
            >
              Learn More
            </a>
          </div>
          {!isLoggedIn && (
            <p className="mt-6 text-blue-100">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
                    href="#faq"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Careers
                  </a>
                </li>
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
                <li className="text-gray-400">support@leadscraftmarketing.com</li>
                <li className="text-gray-400">+91 98765 43210</li>
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
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
              <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;