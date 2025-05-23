import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Card from '../../components/ui/Card';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <FileText size={48} className="text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
        <p className="mt-2 text-lg text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Literary Contest Platform ("the Platform"), you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing the Platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">2. Contest Eligibility</h2>
          <p className="mb-4">
            Participation in the literary contest is open to individuals who:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">Are 18 years of age or older</li>
            <li className="mb-2">Have a valid email address</li>
            <li className="mb-2">Submit original, unpublished work</li>
            <li className="mb-2">Agree to these Terms and Conditions</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">3. Registration and Account</h2>
          <p className="mb-4">
            To participate in the contest, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">4. Submission Guidelines</h2>
          <p className="mb-2">All submissions must:</p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">Be original work created by the participant</li>
            <li className="mb-2">Not infringe upon any third-party rights</li>
            <li className="mb-2">Not contain any inappropriate, offensive, or illegal content</li>
            <li className="mb-2">Adhere to the specified genre and format requirements</li>
            <li className="mb-2">Be submitted before the deadline</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">5. Selection Process</h2>
          <p className="mb-4">
            The contest follows a three-stage selection process:
          </p>
          <ol className="list-decimal pl-5 mb-4">
            <li className="mb-2">
              <strong>Submission Stage:</strong> Participants submit a video and synopsis. Judges select 10 participants per genre.
            </li>
            <li className="mb-2">
              <strong>Manuscript Stage:</strong> Selected participants upload their manuscript. Judges select 2 finalists per genre.
            </li>
            <li className="mb-2">
              <strong>Public Voting Stage:</strong> The public votes for their favorite finalists. One winner per genre is selected.
            </li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">6. Intellectual Property Rights</h2>
          <p className="mb-4">
            Participants retain the copyright to their submitted works. By submitting to the contest, participants grant the Platform a non-exclusive, royalty-free license to display, distribute, and promote their submissions for contest-related purposes.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">7. Privacy</h2>
          <p className="mb-4">
            Your privacy is important to us. Our <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-500">Privacy Policy</Link> explains how we collect, use, and protect your personal information.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">8. Voting Rules</h2>
          <p className="mb-4">
            During the public voting stage, the following rules apply:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">Each user may vote once per genre</li>
            <li className="mb-2">Attempts to manipulate the voting process are prohibited</li>
            <li className="mb-2">The Platform reserves the right to remove fraudulent votes</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">9. Limitation of Liability</h2>
          <p className="mb-4">
            The Platform and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Platform or the contest.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">10. Modifications to Terms</h2>
          <p className="mb-4">
            The Platform reserves the right to modify these Terms and Conditions at any time. Continued use of the Platform after any changes constitutes acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">12. Contact Information</h2>
          <p className="mb-4">
            For questions regarding these Terms, please contact <Link to="#" className="text-primary-600 hover:text-primary-500">terms@literarycontest.com</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TermsPage;