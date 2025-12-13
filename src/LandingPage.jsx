import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-xl font-bold text-blue-600">LCM</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium transition text-sm md:text-base"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition shadow-md text-sm md:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Powerful Facebook Ad Management{" "}
              <span className="text-yellow-300">Made Simple</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Create, manage, and optimize your Facebook ad campaigns all in one
              place with our intuitive mobile app.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/user"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition text-center"
              >
                Start Free Trial
              </a>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-bold text-lg transition">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white/10 rounded-3xl border-2 border-white/20 backdrop-blur-sm p-2 shadow-2xl">
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-800 font-bold px-4 py-1 rounded-full shadow-lg">
                NEW
              </div>
              <img
                src="https://via.placeholder.com/400x800/3b82f6/ffffff?text=App+Preview"
                alt="App Preview"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Amazing Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your Facebook ad campaigns
              effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "👥",
                title: "Facebook Login",
                desc: "Seamless login with your Facebook account to manage your ad campaigns",
              },
              {
                icon: "📊",
                title: "Campaign Management",
                desc: "Create and manage ad campaigns directly from our intuitive interface",
              },
              {
                icon: "📱",
                title: "Mobile Analytics",
                desc: "View real-time analytics and performance metrics on the go",
              },
              {
                icon: "💳",
                title: "Flexible Payments",
                desc: "Monthly, yearly, and combo subscription plans available",
              },
              {
                icon: "🖼️",
                title: "Creative Management",
                desc: "Admin-controlled image display with interactive features",
              },
              {
                icon: "🤖",
                title: "AI Assistance",
                desc: "Get guidance on how to use the app effectively with built-in AI",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

            <div className="space-y-12">
              {[
                {
                  step: "1",
                  title: "Login with Facebook",
                  desc: "Connect your Facebook account securely to access your ad campaigns",
                  direction: "left",
                },
                {
                  step: "2",
                  title: "Create Campaigns",
                  desc: "Use our intuitive interface to set up and launch new ad campaigns",
                  direction: "right",
                },
                {
                  step: "3",
                  title: "Manage Creatives",
                  desc: "Upload and organize your ad creatives with drag-and-drop functionality",
                  direction: "left",
                },
                {
                  step: "4",
                  title: "Track Performance",
                  desc: "Monitor your campaign analytics and optimize for better results",
                  direction: "right",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row ${
                    item.direction === "left" ? "md:text-right" : "md:text-left"
                  } items-center`}
                >
                  {item.direction === "left" ? (
                    <>
                      <div className="hidden md:block md:w-1/2"></div>
                      <div className="hidden md:flex absolute left-1/2 -ml-5 h-10 w-10 bg-blue-600 rounded-full items-center justify-center text-white font-bold text-lg z-10">
                        {item.step}
                      </div>
                      <div className="md:w-1/2 md:pl-12">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:w-1/2 md:pr-12 order-2">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                      <div className="hidden md:flex absolute left-1/2 -ml-5 h-10 w-10 bg-blue-600 rounded-full items-center justify-center text-white font-bold text-lg z-10">
                        {item.step}
                      </div>
                      <div className="hidden md:block md:w-1/2 order-1"></div>
                    </>
                  )}
                  <div className="md:hidden flex h-10 w-10 bg-blue-600 rounded-full items-center justify-center text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$19",
                period: "month",
                features: [
                  "5 Campaigns",
                  "Basic Analytics",
                  "Email Support",
                  "100 Creative Uploads",
                ],
                popular: false,
              },
              {
                name: "Professional",
                price: "$49",
                period: "month",
                features: [
                  "20 Campaigns",
                  "Advanced Analytics",
                  "Priority Support",
                  "500 Creative Uploads",
                  "AI Assistance",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "month",
                features: [
                  "Unlimited Campaigns",
                  "Full Analytics Suite",
                  "24/7 Support",
                  "Unlimited Creatives",
                  "AI Assistance",
                  "Dedicated Account Manager",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden shadow-md ${
                  plan.popular
                    ? "border-2 border-blue-500 transform md:-translate-y-5"
                    : "border border-gray-200"
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-bold ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    } transition`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Looking for yearly billing? Save up to 20%!
            </p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View Yearly Plans →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This app has completely transformed how I manage my Facebook ads. The interface is so intuitive!",
                name: "Sarah Johnson",
                role: "Digital Marketer",
                rating: 5,
              },
              {
                quote:
                  "The campaign management features save me hours every week. Worth every penny!",
                name: "Michael Chen",
                role: "E-commerce Owner",
                rating: 5,
              },
              {
                quote:
                  "Best mobile ad management solution I've found. The analytics are incredibly detailed.",
                name: "David Wilson",
                role: "Marketing Director",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-blue-100">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about LCM
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How do I connect my Facebook account?",
                answer:
                  "Simply click the 'Login with Facebook' button in the app and follow the prompts to authorize access to your ad account.",
              },
              {
                question: "Can I manage multiple ad accounts?",
                answer:
                  "Yes, our Professional and Enterprise plans support managing multiple Facebook ad accounts from a single dashboard.",
              },
              {
                question: "Is there a free trial available?",
                answer:
                  "Yes, we offer a 14-day free trial for all our plans with no credit card required.",
              },
              {
                question: "How does the AI assistance work?",
                answer:
                  "Our built-in AI can guide you through campaign setup, suggest optimizations, and answer questions about using the app.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Absolutely. You can cancel your subscription at any time, and you'll retain access until the end of your billing period.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition">
                  <span className="text-lg font-medium text-gray-800">
                    {item.question}
                  </span>
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="p-6 pt-0 text-gray-600">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Ad Management?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of marketers who are saving time and boosting results
            with LCM
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition">
            Start Your Free Trial Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xl font-bold text-white">LCM</span>
              </div>
              <p className="text-gray-400">
                Powerful Facebook ad management made simple for marketers and
                businesses of all sizes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Updates
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
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@admanagerpro.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
                <li className="text-gray-400">
                  123 Business Ave, Suite 100
                  <br />
                  San Francisco, CA 94107
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} LCM. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
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
