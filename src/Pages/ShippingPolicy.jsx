import React from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiPackage, FiClock, FiCalendar, FiMapPin } from "react-icons/fi";

const ShippingPolicy = () => {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/LCMLOGO.png" 
                alt="LCM Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">LCM</span>
            </Link>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiTruck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed mb-4">
              At LCM ("we," "our," or "us"), we are committed to providing transparent and reliable shipping
              information for all our products and services. This Shipping Policy outlines our shipping methods,
              delivery times, and related terms and conditions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this policy carefully before placing an order. By making a purchase, you agree to
              the terms outlined in this Shipping Policy.
            </p>
          </section>

          {/* Shipping Methods */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiPackage className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Shipping Methods</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Standard Shipping</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Our standard shipping method is available for all orders and typically takes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Domestic orders: 5-7 business days</li>
                  <li>International orders: 10-15 business days</li>
                  <li>Express shipping: 2-3 business days (additional fees apply)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Digital Products and Services</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  For digital products, software licenses, and service subscriptions:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Instant delivery via email or account access</li>
                  <li>No physical shipping required</li>
                  <li>Access credentials sent within 24 hours of purchase confirmation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Service Delivery</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  For our Meta Ads management platform and related services:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Immediate access upon account creation and payment confirmation</li>
                  <li>Setup assistance provided within 1-2 business days</li>
                  <li>Ongoing support and updates included</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Processing Time</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                All orders are processed within 1-2 business days (Monday through Friday, excluding holidays).
                Processing time begins after payment confirmation and order verification.
              </p>
              <p className="text-gray-700 leading-relaxed">
                During peak seasons or promotional periods, processing may take up to 3-5 business days.
                You will receive an email notification once your order has been processed and shipped.
              </p>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Shipping Costs</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                Shipping costs are calculated based on the shipping method selected, destination, and order weight.
                Shipping fees are displayed at checkout before you complete your purchase.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Free shipping may be available for orders above a certain threshold</li>
                <li>Digital products and services typically have no shipping fees</li>
                <li>International orders may incur additional customs duties and taxes (customer's responsibility)</li>
              </ul>
            </div>
          </section>

          {/* Delivery Locations */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiMapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Delivery Locations</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We currently ship to the following locations:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>United States and territories</li>
                <li>Canada</li>
                <li>United Kingdom</li>
                <li>European Union countries</li>
                <li>Australia and New Zealand</li>
                <li>India and select Asian countries</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                For locations not listed above, please contact our support team to inquire about shipping availability.
                Digital services are available worldwide.
              </p>
            </div>
          </section>

          {/* Tracking Orders */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Order Tracking</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                Once your order has been shipped, you will receive a tracking number via email. You can use
                this tracking number to monitor your shipment's progress through our carrier's website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For digital products and services, you will receive access credentials and setup instructions
                via email within 24 hours of purchase confirmation.
              </p>
            </div>
          </section>

          {/* Delivery Issues */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Delivery Issues</h2>
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Delayed Delivery</h3>
                <p className="text-gray-700 leading-relaxed">
                  If your order is delayed beyond the estimated delivery time, please contact our support team.
                  We will investigate and provide updates on your shipment status.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Lost or Damaged Packages</h3>
                <p className="text-gray-700 leading-relaxed">
                  If your package is lost or arrives damaged, please contact us immediately with your order number
                  and photos of the damaged items (if applicable). We will work with the carrier to resolve the
                  issue and arrange for a replacement or refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.3 Incorrect Address</h3>
                <p className="text-gray-700 leading-relaxed">
                  Please ensure your shipping address is correct at checkout. We are not responsible for packages
                  delivered to incorrect addresses provided by the customer. If you need to change your address,
                  contact us immediately after placing your order.
                </p>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Shipping</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                International orders may be subject to customs duties, taxes, and import fees imposed by the
                destination country. These charges are the responsibility of the customer and are not included
                in the product price or shipping cost.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Delivery times for international orders may vary based on customs processing. We recommend
                contacting your local customs office for more information about potential fees and processing times.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-10 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiTruck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Contact Us</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions or concerns about shipping, delivery, or your order, please contact us:
              </p>
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-gray-800 font-semibold mb-2">LCM Shipping Support</p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:shipping@lcm.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    shipping@lcm.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Support Email:</strong>{" "}
                  <a
                    href="mailto:support@lcm.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    support@lcm.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Response Time:</strong> We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8 text-center">
            <p className="text-gray-600 text-sm">
              This Shipping Policy is effective as of {lastUpdated} and applies to all orders placed through LCM.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              By placing an order, you acknowledge that you have read and understood this Shipping Policy.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} LCM. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0 flex-wrap justify-center">
              <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-600 hover:text-blue-600 text-sm">
                Terms of Service
              </Link>
              <Link to="/shipping-policy" className="text-gray-600 hover:text-blue-600 text-sm">
                Shipping Policy
              </Link>
              <Link to="/cancellations-and-refunds" className="text-gray-600 hover:text-blue-600 text-sm">
                Cancellations & Refunds
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShippingPolicy;

