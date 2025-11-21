import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function HIPAA() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">HIPAA Business Associate Agreement</h1>
            <p className="text-sm text-muted-foreground">Last updated: November 21, 2024</p>
          </div>
        </div>

        <Card className="p-8 prose prose-sm dark:prose-invert max-w-none">
          <p className="lead">
            This Business Associate Agreement ("BAA") supplements the Terms of Service and applies when Customer is a Covered Entity or Business Associate under the Health Insurance Portability and Accountability Act ("HIPAA").
          </p>

          <h2>1. Definitions</h2>
          <p>
            Terms used but not otherwise defined in this BAA shall have the meanings set forth in HIPAA:
          </p>
          <ul>
            <li><strong>"Protected Health Information" or "PHI"</strong> has the meaning given in 45 CFR § 160.103</li>
            <li><strong>"Covered Entity"</strong> has the meaning given in 45 CFR § 160.103</li>
            <li><strong>"Business Associate"</strong> has the meaning given in 45 CFR § 160.103</li>
            <li><strong>"Security Incident"</strong> has the meaning given in 45 CFR § 164.304</li>
            <li><strong>"Breach"</strong> has the meaning given in 45 CFR § 164.402</li>
          </ul>

          <h2>2. Obligations of Business Associate</h2>
          
          <h3>2.1 Permitted Uses and Disclosures</h3>
          <p>
            Business Associate shall use or disclose PHI only as permitted by this BAA or as required by law. Business Associate shall not use or disclose PHI in any manner that would violate the Privacy Rule if done by Covered Entity.
          </p>

          <h3>2.2 Safeguards</h3>
          <p>
            Business Associate shall implement appropriate safeguards to prevent use or disclosure of PHI other than as provided for by this BAA, including implementing administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of electronic PHI.
          </p>

          <h3>2.3 Reporting</h3>
          <p>
            Business Associate shall report to Covered Entity:
          </p>
          <ul>
            <li>Any use or disclosure of PHI not provided for by this BAA</li>
            <li>Any Security Incident</li>
            <li>Any Breach of Unsecured PHI without unreasonable delay and in no case later than 10 business days after discovery</li>
          </ul>

          <h3>2.4 Subcontractors</h3>
          <p>
            Business Associate shall ensure that any subcontractors that create, receive, maintain, or transmit PHI on behalf of Business Associate agree to the same restrictions and conditions that apply to Business Associate.
          </p>

          <h2>3. Permitted Uses and Disclosures by Business Associate</h2>
          
          <h3>3.1 Services</h3>
          <p>
            Business Associate may use and disclose PHI to perform functions, activities, or services for or on behalf of Covered Entity as specified in the Terms of Service.
          </p>

          <h3>3.2 Business Associate's Management and Administration</h3>
          <p>
            Business Associate may use PHI for the proper management and administration of Business Associate or to carry out the legal responsibilities of Business Associate.
          </p>

          <h3>3.3 Data Aggregation</h3>
          <p>
            Business Associate may use PHI to provide data aggregation services to Covered Entity as permitted by 45 CFR § 164.504(e)(2)(i)(B).
          </p>

          <h2>4. Obligations of Covered Entity</h2>
          
          <h3>4.1 Permissible Requests</h3>
          <p>
            Covered Entity shall not request Business Associate to use or disclose PHI in any manner that would not be permissible under the Privacy Rule if done by Covered Entity.
          </p>

          <h3>4.2 Notice of Privacy Practices</h3>
          <p>
            Covered Entity shall notify Business Associate of any limitation(s) in its Notice of Privacy Practices that affect Business Associate's use or disclosure of PHI.
          </p>

          <h3>4.3 Permission to Use or Disclose</h3>
          <p>
            Covered Entity shall notify Business Associate of any changes in, or revocation of, permission by an individual to use or disclose PHI.
          </p>

          <h2>5. Individual Rights</h2>
          
          <h3>5.1 Access to PHI</h3>
          <p>
            Business Associate shall make PHI maintained in a Designated Record Set available to Covered Entity for inspection and copying within 10 business days of a request to enable Covered Entity to fulfill its obligations under 45 CFR § 164.524.
          </p>

          <h3>5.2 Amendment of PHI</h3>
          <p>
            Business Associate shall make PHI available to Covered Entity for amendment and incorporate any amendments to PHI within 10 business days of receipt of notice from Covered Entity.
          </p>

          <h3>5.3 Accounting of Disclosures</h3>
          <p>
            Business Associate shall document disclosures of PHI and information related to such disclosures as would be required for Covered Entity to respond to a request for an accounting of disclosures under 45 CFR § 164.528.
          </p>

          <h2>6. Security Requirements</h2>
          <p>
            Business Associate shall implement and maintain appropriate administrative, physical, and technical safeguards including:
          </p>
          <ul>
            <li><strong>Access Controls:</strong> Unique user identification, emergency access procedures, automatic logoff, encryption and decryption</li>
            <li><strong>Audit Controls:</strong> Hardware, software, and procedural mechanisms to record and examine activity</li>
            <li><strong>Integrity Controls:</strong> Mechanisms to authenticate electronic PHI and protect it from improper alteration or destruction</li>
            <li><strong>Transmission Security:</strong> Technical security measures to guard against unauthorized access to PHI being transmitted over electronic networks</li>
          </ul>

          <h2>7. Breach Notification</h2>
          <p>
            In the event of a Breach of Unsecured PHI, Business Associate shall:
          </p>
          <ul>
            <li>Notify Covered Entity without unreasonable delay and in no case later than 10 business days after discovery</li>
            <li>Provide the identification of each individual whose Unsecured PHI has been breached</li>
            <li>Provide a brief description of what happened, including the date of the Breach and the date of discovery</li>
            <li>Describe the types of Unsecured PHI involved</li>
            <li>Describe the investigation, mitigation, and corrective action</li>
          </ul>

          <h2>8. Term and Termination</h2>
          
          <h3>8.1 Term</h3>
          <p>
            This BAA shall be effective as of the date Customer first uses the Service to process PHI and shall terminate when all PHI provided by Covered Entity to Business Associate is destroyed or returned to Covered Entity.
          </p>

          <h3>8.2 Termination for Cause</h3>
          <p>
            Upon Covered Entity's knowledge of a material breach by Business Associate, Covered Entity may:
          </p>
          <ul>
            <li>Provide an opportunity for Business Associate to cure the breach</li>
            <li>Terminate the Terms of Service if Business Associate does not cure the breach</li>
            <li>Report the violation to the Secretary of Health and Human Services if termination is not feasible</li>
          </ul>

          <h3>8.3 Effect of Termination</h3>
          <p>
            Upon termination, Business Associate shall:
          </p>
          <ul>
            <li>Return or destroy all PHI received from Covered Entity that Business Associate maintains</li>
            <li>Retain no copies of the PHI</li>
            <li>If return or destruction is not feasible, extend the protections of this BAA to such PHI and limit further uses and disclosures</li>
          </ul>

          <h2>9. Miscellaneous</h2>
          
          <h3>9.1 Regulatory References</h3>
          <p>
            A reference in this BAA to a section in HIPAA means the section as in effect or as amended.
          </p>

          <h3>9.2 Amendment</h3>
          <p>
            The parties agree to take such action as is necessary to amend this BAA to comply with the requirements of HIPAA and the Health Information Technology for Economic and Clinical Health Act.
          </p>

          <h3>9.3 Interpretation</h3>
          <p>
            Any ambiguity in this BAA shall be resolved to permit Covered Entity to comply with HIPAA.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            For questions about this BAA or to report a security incident, please contact:
          </p>
          <p>
            Email: hipaa@brikk.ai<br />
            Security Officer: [Name]<br />
            Phone: [Phone Number]<br />
            Address: [Company Address]
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
