import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Card from '../../components/ui/Card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <Shield size={48} className="text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-lg text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="mb-4">
            This Privacy Policy explains how we collect, use, store, and protect your personal information in compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
          </p>
          <p className="mb-4">
            By using our contest platform, you consent to the data practices described in this policy.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">2. Information We Collect</h2>
          <p className="mb-2">We collect the following types of personal information:</p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">Identity information (name, email address)</li>
            <li className="mb-2">Account information (username, password)</li>
            <li className="mb-2">Content you provide (submissions, manuscripts, videos)</li>
            <li className="mb-2">Voting information</li>
            <li className="mb-2">Technical information (IP address, browser type, device information)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">3. How We Use Your Information</h2>
          <p className="mb-2">We use your personal information for the following purposes:</p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">To manage your account and provide our services</li>
            <li className="mb-2">To process your contest submissions and votes</li>
            <li className="mb-2">To communicate with you about the contest</li>
            <li className="mb-2">To ensure the security and proper functioning of our platform</li>
            <li className="mb-2">To comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">4. Legal Basis for Processing</h2>
          <p className="mb-4">
            We process your personal information based on the following legal grounds:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">Your consent</li>
            <li className="mb-2">Performance of a contract (our Terms of Service)</li>
            <li className="mb-2">Legitimate interests</li>
            <li className="mb-2">Compliance with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">5. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">6. Your Data Protection Rights</h2>
          <p className="mb-2">Under the GDPR, you have the following rights:</p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">Right to access your personal data</li>
            <li className="mb-2">Right to rectification of inaccurate personal data</li>
            <li className="mb-2">Right to erasure ("right to be forgotten")</li>
            <li className="mb-2">Right to restriction of processing</li>
            <li className="mb-2">Right to data portability</li>
            <li className="mb-2">Right to object to processing</li>
            <li className="mb-2">Right not to be subject to automated decision-making</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us through your account settings or at <Link to="#" className="text-primary-600 hover:text-primary-500">privacy@literarycontest.com</Link>
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">7. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">8. Third-Party Services</h2>
          <p className="mb-4">
            Our platform may use third-party services for specific functions. These services have their own privacy policies, and we encourage you to review them.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">9. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at <Link to="#" className="text-primary-600 hover:text-primary-500">privacy@literarycontest.com</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;