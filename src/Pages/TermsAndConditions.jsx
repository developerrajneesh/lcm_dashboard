import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiShield, FiAlertCircle, FiCheckCircle, FiCalendar } from "react-icons/fi";

const TermsAndConditions = () => {
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
              <FiFileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to LCM ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access
              to and use of our Meta Ads management platform, website, and related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you do not agree
              to these Terms, please do not use our Service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                By creating an account, accessing, or using our Service, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and our Privacy Policy. These Terms constitute
                a legally binding agreement between you and LCM.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you are using the Service on behalf of an organization, you represent and warrant that you
                have the authority to bind that organization to these Terms.
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiFileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Description of Service</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                LCM provides a platform for managing Meta (Facebook) advertising campaigns, including but not
                limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Creating and managing advertising campaigns, ad sets, and ads</li>
                <li>Accessing and analyzing advertising performance metrics</li>
                <li>Managing Facebook Ad Accounts and Pages</li>
                <li>Providing tools and features to optimize advertising efforts</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time
                with or without notice.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Account Registration</h3>
                <p className="text-gray-700 leading-relaxed">
                  To use our Service, you must create an account by providing accurate, current, and complete
                  information. You are responsible for maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You agree to immediately notify us of any unauthorized use of your account or any other
                  breach of security. We are not liable for any loss or damage arising from your failure to
                  protect your account credentials.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Account Responsibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are solely responsible for all activities conducted through your account, including any
                  actions taken using your connected Facebook/Meta accounts.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Service */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Acceptable Use</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Use the Service to create or distribute spam, malicious content, or illegal advertisements</li>
                <li>Attempt to gain unauthorized access to any part of the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with any entity</li>
                <li>Violate Meta's Advertising Policies or Terms of Service</li>
              </ul>
            </div>
          </section>

          {/* Facebook/Meta Integration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Facebook/Meta Integration</h2>
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Connection to Meta</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our Service integrates with Meta's (Facebook's) APIs. By connecting your Facebook account,
                  you grant us permission to access and manage your advertising accounts, campaigns, and related
                  data on your behalf.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Meta's Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your use of Meta's services is also subject to Meta's Terms of Service, Data Policy, and
                  Advertising Policies. You are responsible for ensuring your advertising content complies with
                  Meta's policies.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.3 Access Tokens</h3>
                <p className="text-gray-700 leading-relaxed">
                  We securely store your Meta access tokens to facilitate API operations. You can revoke access
                  at any time through your account settings or Meta's settings.
                </p>
              </div>
            </div>
          </section>

          {/* Payment and Billing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment and Billing</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                If you purchase a paid subscription or service:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>You agree to pay all fees associated with your subscription</li>
                <li>Fees are billed in advance on a recurring basis (monthly or annually)</li>
                <li>All fees are non-refundable except as required by law or as stated in our Cancellation and Refund Policy</li>
                <li>We reserve the right to change our pricing with 30 days' notice</li>
                <li>Failure to pay may result in suspension or termination of your account</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                The Service, including all content, features, functionality, and software, is owned by LCM and
                protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You are granted a limited, non-exclusive, non-transferable license to access and use the Service
                for your personal or business use. You may not copy, modify, distribute, or create derivative
                works based on the Service without our written permission.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Disclaimer of Warranties</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.
                We are not responsible for any losses or damages resulting from your use of the Service or
                reliance on any information provided through the Service.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, LCM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA,
                OR USE, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability for any claims arising from or related to the Service shall not exceed the
                amount you paid to us in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless LCM and its officers, directors, employees,
                and agents from and against any claims, damages, losses, liabilities, and expenses (including
                legal fees) arising out of or related to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content or advertising created through the Service</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate your account and access to the Service at any time, with or without
                cause or notice, for any reason, including if you breach these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may terminate your account at any time by contacting us or using the account deletion feature
                in your account settings. Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes
                by posting the updated Terms on this page and updating the "Last Updated" date. Your continued
                use of the Service after such changes constitutes acceptance of the modified Terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                without regard to its conflict of law provisions. Any disputes arising from these Terms or the
                Service shall be resolved in the courts of [Your Jurisdiction].
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-10 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiFileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">14. Contact Us</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-gray-800 font-semibold mb-2">LCM Legal Team</p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:legal@lcm.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    legal@lcm.com
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
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8 text-center">
            <p className="text-gray-600 text-sm">
              These Terms and Conditions are effective as of {lastUpdated} and apply to all users of the LCM Service.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              By using our Service, you acknowledge that you have read and understood these Terms and Conditions.
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

export default TermsAndConditions;

