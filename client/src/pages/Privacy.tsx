import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: November 21, 2024</p>
          </div>
        </div>

        <Card className="p-8 prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Brikk ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI agent orchestration platform.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, company name, and billing information</li>
            <li><strong>User Content:</strong> AI agents, workflows, configurations, and data you create or upload</li>
            <li><strong>Communications:</strong> Messages you send to our support team</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data:</strong> Features used, actions taken, time spent on the platform</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
            <li><strong>Cookies:</strong> Session identifiers and preferences</li>
            <li><strong>Log Data:</strong> API calls, errors, and system events</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>We may share your information in the following circumstances:</p>
          
          <h3>4.1 Service Providers</h3>
          <p>
            We may share your information with third-party service providers who perform services on our behalf, such as:
          </p>
          <ul>
            <li>Cloud hosting providers (AWS, Google Cloud)</li>
            <li>Payment processors (Stripe)</li>
            <li>Analytics providers</li>
            <li>Customer support tools</li>
          </ul>

          <h3>4.2 Legal Requirements</h3>
          <p>
            We may disclose your information if required to do so by law or in response to valid requests by public authorities.
          </p>

          <h3>4.3 Business Transfers</h3>
          <p>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information, including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Employee training on data protection</li>
            <li>Incident response procedures</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your information</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Objection:</strong> Object to processing of your information</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
          </ul>

          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>

          <h2>10. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@brikk.ai<br />
            Address: [Company Address]<br />
            Data Protection Officer: dpo@brikk.ai
          </p>

          <h2>13. GDPR Compliance</h2>
          <p>
            For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). Our lawful basis for processing includes consent, contract performance, and legitimate interests.
          </p>

          <h2>14. CCPA Compliance</h2>
          <p>
            For California residents, we comply with the California Consumer Privacy Act (CCPA). You have the right to know what personal information we collect, delete your information, and opt-out of the sale of your information (we do not sell personal information).
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
