import React from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";

const CancellationsAndRefunds = () => {
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
              <FiRefreshCw className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellations and Refunds</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed mb-4">
              At LCM ("we," "our," or "us"), we strive to provide fair and transparent cancellation and refund
              policies. This policy outlines the terms and conditions for canceling subscriptions, orders,
              and requesting refunds for our products and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this policy carefully before making a purchase. By purchasing our products or services,
              you agree to the terms outlined in this Cancellation and Refund Policy.
            </p>
          </section>

          {/* Subscription Cancellations */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiXCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Subscription Cancellations</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 How to Cancel</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You may cancel your subscription at any time through:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Your account settings on our platform</li>
                  <li>Contacting our support team at support@lcm.com</li>
                  <li>Using the cancellation link provided in your subscription confirmation email</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Cancellation Effective Date</h3>
                <p className="text-gray-700 leading-relaxed">
                  Cancellations take effect at the end of your current billing period. You will continue to
                  have access to the Service until the end of the paid period. No partial refunds are provided
                  for unused portions of the billing period.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Auto-Renewal</h3>
                <p className="text-gray-700 leading-relaxed">
                  Subscriptions automatically renew unless canceled before the renewal date. You are responsible
                  for canceling your subscription if you do not wish to be charged for the next billing period.
                </p>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiDollarSign className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Refund Policy</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Digital Services and Subscriptions</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Due to the digital nature of our services, refunds are generally not available except in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><strong>14-Day Money-Back Guarantee:</strong> New subscribers may request a full refund within 14 days of initial purchase if they are not satisfied with the Service</li>
                  <li><strong>Technical Issues:</strong> If the Service is unavailable or non-functional due to our error for more than 48 hours, you may be eligible for a prorated refund</li>
                  <li><strong>Duplicate Charges:</strong> If you are accidentally charged multiple times, we will refund the duplicate charges</li>
                  <li><strong>Service Not Delivered:</strong> If you paid for a service that was not delivered as described, you may be eligible for a refund</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Physical Products</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  For physical products, refunds are available if:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>The product is returned within 30 days of delivery in its original condition</li>
                  <li>The product is defective or damaged upon arrival</li>
                  <li>The wrong product was shipped</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  Return shipping costs are the responsibility of the customer unless the product is defective
                  or incorrect.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Non-Refundable Items</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  The following are not eligible for refunds:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Subscriptions canceled after the 14-day money-back guarantee period</li>
                  <li>Custom or personalized services that have been completed</li>
                  <li>Digital products that have been downloaded or accessed</li>
                  <li>Services that have been fully utilized or consumed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Refund Process</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 How to Request a Refund</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  To request a refund, please contact our support team:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Email: refunds@lcm.com or support@lcm.com</li>
                  <li>Include your order number, account email, and reason for refund</li>
                  <li>Provide any relevant documentation or screenshots</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Refund Review</h3>
                <p className="text-gray-700 leading-relaxed">
                  All refund requests are reviewed within 5-7 business days. We will notify you of the decision
                  via email. If approved, refunds are processed within 10-14 business days to the original
                  payment method.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Refund Processing Time</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once approved, refunds may take 5-10 business days to appear in your account, depending on
                  your payment provider. Credit card refunds typically appear within 1-2 billing cycles.
                </p>
              </div>
            </div>
          </section>

          {/* Special Circumstances */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Special Circumstances</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Service Interruptions</h3>
                <p className="text-gray-700 leading-relaxed">
                  If our Service is unavailable for an extended period due to maintenance, technical issues,
                  or force majeure events, we may offer service credits or extensions rather than refunds.
                  Service credits will be applied to extend your subscription period.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Policy Violations</h3>
                <p className="text-gray-700 leading-relaxed">
                  If your account is terminated due to violation of our Terms of Service, you are not eligible
                  for a refund. This includes violations of Meta's Advertising Policies or misuse of the Service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Chargebacks</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you initiate a chargeback with your payment provider, your account may be suspended or
                  terminated. We encourage you to contact us directly to resolve any billing issues before
                  initiating a chargeback.
                </p>
              </div>
            </div>
          </section>

          {/* Partial Refunds and Credits */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Partial Refunds and Service Credits</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                In certain circumstances, we may offer partial refunds or service credits instead of full refunds:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Service credits can be applied to extend your subscription period</li>
                <li>Partial refunds may be offered for unused portions of annual subscriptions canceled mid-term</li>
                <li>Service credits are non-transferable and cannot be converted to cash</li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Dispute Resolution</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                If you are not satisfied with our refund decision, you may:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Request a review by our management team</li>
                <li>Provide additional documentation to support your refund request</li>
                <li>Contact your payment provider to dispute the charge (may result in account suspension)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We are committed to resolving disputes fairly and will work with you to find a satisfactory solution.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Policy</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify this Cancellation and Refund Policy at any time. Changes will be
                effective immediately upon posting on this page. Material changes will be communicated via email
                or through our Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The policy in effect at the time of your purchase will apply to that purchase, unless otherwise
                required by law.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-10 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiRefreshCw className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Contact Us</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                For questions about cancellations, refunds, or to submit a refund request, please contact us:
              </p>
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-gray-800 font-semibold mb-2">LCM Refunds Team</p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:refunds@lcm.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    refunds@lcm.com
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
                  <strong>Response Time:</strong> We typically respond to refund requests within 5-7 business days.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8 text-center">
            <p className="text-gray-600 text-sm">
              This Cancellation and Refund Policy is effective as of {lastUpdated} and applies to all purchases
              made through LCM.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              By making a purchase, you acknowledge that you have read and understood this Cancellation and Refund Policy.
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

export default CancellationsAndRefunds;

