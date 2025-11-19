import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Shield, Lock, Scale, FileCheck, Building2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const enterpriseDocuments = [
  {
    id: "msa",
    title: "Master Service Agreement (MSA)",
    description: "Comprehensive agreement governing the relationship between Brikk and enterprise customers",
    file: "/legal/msa.html",
    icon: FileText,
    category: "Core Agreement",
  },
  {
    id: "sla",
    title: "Service Level Agreement (SLA)",
    description: "Guaranteed uptime, performance metrics, and support response times",
    file: "/legal/sla.html",
    icon: CheckCircle2,
    category: "Service Guarantees",
  },
  {
    id: "security",
    title: "Security & Compliance Addendum",
    description: "SOC 2 Type II, ISO 27001, and enterprise security controls",
    file: "/legal/security.html",
    icon: Shield,
    category: "Security",
  },
  {
    id: "ai-liability",
    title: "AI Agent Liability Addendum",
    description: "Liability framework for autonomous AI agent actions and decisions",
    file: "/legal/ai-liability.html",
    icon: Scale,
    category: "AI Governance",
  },
  {
    id: "dpa",
    title: "Data Processing Addendum (GDPR/CCPA)",
    description: "GDPR Article 28 compliant data processing terms",
    file: "/legal/dpa.html",
    icon: Lock,
    category: "Data Privacy",
  },
  {
    id: "hipaa-baa",
    title: "HIPAA Business Associate Agreement",
    description: "HIPAA compliance for healthcare organizations processing PHI",
    file: "/legal/hipaa-baa.html",
    icon: FileCheck,
    category: "Healthcare Compliance",
  },
];

export default function EnterpriseLegal() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (doc: typeof enterpriseDocuments[0]) => {
    setDownloading(doc.id);
    
    try {
      // Fetch the HTML content
      const response = await fetch(doc.file);
      const htmlContent = await response.text();
      
      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Brikk_${doc.id.toUpperCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${doc.title}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download document');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloading('all');
    
    try {
      for (const doc of enterpriseDocuments) {
        const response = await fetch(doc.file);
        const htmlContent = await response.text();
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Brikk_${doc.id.toUpperCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      toast.success('Downloaded all enterprise documents');
    } catch (error) {
      console.error('Download all failed:', error);
      toast.error('Failed to download all documents');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewDocument = (doc: typeof enterpriseDocuments[0]) => {
    window.open(`/legal#${doc.id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Enterprise Legal Package</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive legal documentation for enterprise customers
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Complete Package</p>
              <p className="text-xs text-muted-foreground mt-1">
                {enterpriseDocuments.length} documents ready for download
              </p>
            </div>
            <Button 
              onClick={handleDownloadAll}
              disabled={downloading === 'all'}
              size="lg"
            >
              {downloading === 'all' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download All Documents
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {enterpriseDocuments.map((doc) => {
            const Icon = doc.icon;
            
            return (
              <Card key={doc.id} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {doc.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        disabled={downloading === doc.id}
                      >
                        {downloading === doc.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Information */}
        <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Need Custom Terms?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our enterprise team can work with your legal department to customize these agreements 
            to meet your specific requirements, including:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Custom data residency and sovereignty requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Industry-specific compliance addendums (FINRA, FedRAMP, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Custom SLA terms and performance guarantees</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Liability caps and indemnification terms</span>
            </li>
          </ul>
          <Button variant="outline" asChild>
            <a href="mailto:enterprise@getbrikk.com">
              Contact Enterprise Sales
            </a>
          </Button>
        </div>

        {/* Document Versions */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>All documents are current as of January 2025</p>
          <p className="mt-1">
            For questions about these agreements, contact{" "}
            <a href="mailto:legal@getbrikk.com" className="text-primary hover:underline">
              legal@getbrikk.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
