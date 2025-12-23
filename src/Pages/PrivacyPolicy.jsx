import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiLock, FiEye, FiDatabase, FiMail, FiCalendar } from "react-icons/fi";

const PrivacyPolicy = () => {
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
              <FiShield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed mb-4">
              At LCM ("we," "our," or "us"), we are committed to protecting your privacy and ensuring
              the security of your personal information. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our Meta Ads management platform
              and related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our Service, you agree to the collection and use of information in accordance
              with this Privacy Policy. If you do not agree with our policies and practices, please
              do not use our Service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiDatabase className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  When you register for our Service, we may collect the following personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Name and email address</li>
                  <li>Phone number (optional)</li>
                  <li>Profile image (optional)</li>
                  <li>Account credentials and authentication tokens</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Facebook/Meta Account Information</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  When you connect your Facebook/Meta account to our Service, we may access and collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Facebook Ad Account IDs and names</li>
                  <li>Campaign, Ad Set, and Ad data</li>
                  <li>Advertising performance metrics and analytics</li>
                  <li>Facebook Page IDs and information</li>
                  <li>Access tokens (stored securely and used only for API operations)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Usage Data</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We automatically collect certain information when you use our Service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Log files and error reports</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiEye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Service Provision:</strong> To provide, maintain, and improve our Meta Ads management platform
                </li>
                <li>
                  <strong>Account Management:</strong> To create and manage your account, authenticate your identity,
                  and process your requests
                </li>
                <li>
                  <strong>API Integration:</strong> To connect with Meta's APIs and perform operations on your behalf,
                  such as creating campaigns, ad sets, and ads
                </li>
                <li>
                  <strong>Analytics:</strong> To analyze usage patterns, track performance metrics, and generate reports
                </li>
                <li>
                  <strong>Communication:</strong> To send you service-related notifications, updates, and support messages
                </li>
                <li>
                  <strong>Security:</strong> To detect, prevent, and address technical issues, fraud, and security threats
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes
                </li>
              </ul>
            </div>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Data Sharing and Disclosure</h2>
            </div>
            
            <div className="ml-9 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Meta/Facebook</h3>
                <p className="text-gray-700 leading-relaxed">
                  We share your information with Meta (Facebook) as necessary to provide our Service. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Accessing your Facebook Ad Accounts through Meta's APIs</li>
                  <li>Creating and managing advertising campaigns on your behalf</li>
                  <li>Retrieving advertising performance data and analytics</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  Your use of our Service is also subject to Meta's Data Policy and Terms of Service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share your information with third-party service providers who perform services on our behalf,
                  such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Cloud hosting and storage providers (e.g., AWS)</li>
                  <li>Payment processors (if applicable)</li>
                  <li>Analytics and monitoring services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose your information if required by law, court order, or governmental authority,
                  or to protect our rights, property, or safety, or that of our users or others.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.4 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred
                  to the acquiring entity.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiLock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure storage of access tokens and credentials</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to use commercially acceptable means to protect your information, we cannot
                guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Your Rights and Choices</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> You can request access to the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> You can update or correct your personal information through your account settings
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your account and associated data
                </li>
                <li>
                  <strong>Data Portability:</strong> You can request a copy of your data in a portable format
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can disconnect your Facebook account at any time through your account settings
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> You can withdraw your consent for data processing at any time
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our Service and fulfill
                the purposes outlined in this Privacy Policy, unless a longer retention period is required or
                permitted by law.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you delete your account, we will delete or anonymize your personal information, except where
                we are required to retain it for legal, regulatory, or legitimate business purposes.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for individuals under the age of 18. We do not knowingly collect
              personal information from children. If you believe we have collected information from a child,
              please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of
              residence. These countries may have data protection laws that differ from those in your country.
              By using our Service, you consent to the transfer of your information to these countries.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage
              you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-10 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiMail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">10. Contact Us</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-gray-800 font-semibold mb-2">LCM Privacy Team</p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@lcm.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    privacy@lcm.com
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
              This Privacy Policy is effective as of {lastUpdated} and applies to all users of the LCM Service.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              By using our Service, you acknowledge that you have read and understood this Privacy Policy.
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

export default PrivacyPolicy;

