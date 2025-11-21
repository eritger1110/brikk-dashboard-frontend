import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { FileCheck } from 'lucide-react';

export default function DPA() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Data Processing Agreement</h1>
            <p className="text-sm text-muted-foreground">Last updated: November 21, 2024</p>
          </div>
        </div>

        <Card className="p-8 prose prose-sm dark:prose-invert max-w-none">
          <p className="lead">
            This Data Processing Agreement ("DPA") forms part of the Terms of Service between you ("Customer") and Brikk ("Processor") and governs the processing of personal data by Processor on behalf of Customer.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person</li>
            <li><strong>"Processing"</strong> means any operation performed on Personal Data</li>
            <li><strong>"Data Subject"</strong> means the individual to whom Personal Data relates</li>
            <li><strong>"Controller"</strong> means the entity that determines the purposes and means of processing Personal Data</li>
            <li><strong>"Processor"</strong> means the entity that processes Personal Data on behalf of the Controller</li>
            <li><strong>"Sub-processor"</strong> means any third party appointed by Processor to process Personal Data</li>
          </ul>

          <h2>2. Scope and Roles</h2>
          <p>
            Customer acts as the Controller and Brikk acts as the Processor with respect to Personal Data processed through the Service. This DPA applies to all processing of Personal Data by Processor on behalf of Customer.
          </p>

          <h2>3. Processing Instructions</h2>
          <p>
            Processor shall process Personal Data only on documented instructions from Customer, including with regard to transfers of Personal Data to a third country or international organization, unless required to do so by applicable law.
          </p>

          <h2>4. Confidentiality</h2>
          <p>
            Processor shall ensure that persons authorized to process Personal Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.
          </p>

          <h2>5. Security Measures</h2>
          <p>
            Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
          </p>
          <ul>
            <li>Pseudonymization and encryption of Personal Data</li>
            <li>Ability to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems</li>
            <li>Ability to restore availability and access to Personal Data in a timely manner in the event of an incident</li>
            <li>Regular testing, assessment, and evaluation of the effectiveness of security measures</li>
          </ul>

          <h2>6. Sub-processors</h2>
          <p>
            Customer provides general authorization for Processor to engage Sub-processors. Processor shall:
          </p>
          <ul>
            <li>Maintain a list of Sub-processors</li>
            <li>Notify Customer of any intended changes concerning the addition or replacement of Sub-processors</li>
            <li>Ensure Sub-processors are bound by data protection obligations equivalent to those in this DPA</li>
          </ul>

          <h3>Current Sub-processors:</h3>
          <ul>
            <li><strong>Amazon Web Services (AWS)</strong> - Cloud hosting and infrastructure</li>
            <li><strong>Google Cloud Platform</strong> - Cloud services and analytics</li>
            <li><strong>Stripe</strong> - Payment processing</li>
            <li><strong>Auth0</strong> - Authentication services</li>
          </ul>

          <h2>7. Data Subject Rights</h2>
          <p>
            Processor shall assist Customer in fulfilling its obligations to respond to requests from Data Subjects exercising their rights under applicable data protection laws, including:
          </p>
          <ul>
            <li>Right of access</li>
            <li>Right to rectification</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
          </ul>

          <h2>8. Data Breach Notification</h2>
          <p>
            Processor shall notify Customer without undue delay after becoming aware of a personal data breach. The notification shall include:
          </p>
          <ul>
            <li>Description of the nature of the breach</li>
            <li>Categories and approximate number of Data Subjects affected</li>
            <li>Likely consequences of the breach</li>
            <li>Measures taken or proposed to address the breach</li>
          </ul>

          <h2>9. Data Protection Impact Assessment</h2>
          <p>
            Processor shall provide reasonable assistance to Customer in conducting data protection impact assessments and prior consultations with supervisory authorities when required.
          </p>

          <h2>10. Deletion or Return of Data</h2>
          <p>
            Upon termination of the Service, Processor shall, at Customer's choice, delete or return all Personal Data to Customer and delete existing copies unless storage is required by applicable law.
          </p>

          <h2>11. Audit Rights</h2>
          <p>
            Processor shall make available to Customer all information necessary to demonstrate compliance with this DPA and allow for and contribute to audits, including inspections, conducted by Customer or an auditor mandated by Customer.
          </p>

          <h2>12. International Data Transfers</h2>
          <p>
            Where Personal Data is transferred outside the European Economic Area (EEA), Processor shall ensure appropriate safeguards are in place, including:
          </p>
          <ul>
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Adequacy decisions</li>
            <li>Binding Corporate Rules</li>
            <li>Approved certification mechanisms</li>
          </ul>

          <h2>13. Liability and Indemnification</h2>
          <p>
            Each party's liability under this DPA shall be subject to the limitations and exclusions of liability set out in the Terms of Service.
          </p>

          <h2>14. Duration and Termination</h2>
          <p>
            This DPA shall remain in effect for as long as Processor processes Personal Data on behalf of Customer. Upon termination, the provisions regarding deletion or return of data shall survive.
          </p>

          <h2>15. Governing Law</h2>
          <p>
            This DPA shall be governed by the same law as the Terms of Service, except where data protection laws require otherwise.
          </p>

          <h2>16. Contact Information</h2>
          <p>
            For questions about this DPA or to exercise your rights, please contact:
          </p>
          <p>
            Email: dpo@brikk.ai<br />
            Data Protection Officer: [Name]<br />
            Address: [Company Address]
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
