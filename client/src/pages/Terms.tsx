import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: November 21, 2024</p>
          </div>
        </div>

        <Card className="p-8 prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Brikk ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Brikk provides an AI agent orchestration platform that enables users to create, manage, and deploy autonomous AI agents and workflows ("the Platform").
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Not share your account credentials with others</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit malicious code or malware</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Brikk and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2>6. User Content</h2>
          <p>
            You retain ownership of any content you create using the Service. By using the Service, you grant us a license to use, store, and process your content solely for the purpose of providing the Service.
          </p>

          <h2>7. Payment Terms</h2>
          <p>
            Certain features of the Service require payment. You agree to provide accurate billing information and authorize us to charge your payment method for the applicable fees.
          </p>
          <ul>
            <li>Fees are billed in advance on a monthly or annual basis</li>
            <li>All fees are non-refundable except as required by law</li>
            <li>We reserve the right to change our pricing with 30 days notice</li>
          </ul>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will immediately cease.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            In no event shall Brikk be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Brikk from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:
          </p>
          <p>
            Email: legal@brikk.ai<br />
            Address: [Company Address]
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
