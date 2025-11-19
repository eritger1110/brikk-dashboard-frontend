import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Download, ExternalLink } from "lucide-react";

const legalDocs = [
  { id: "terms-of-service", title: "Terms of Service", file: "/legal/terms-of-service.html", public: true },
  { id: "privacy-policy", title: "Privacy Policy", file: "/legal/privacy-policy.html", public: true },
  { id: "acceptable-use-policy", title: "Acceptable Use Policy", file: "/legal/acceptable-use-policy.html", public: true },
  { id: "security", title: "Security & Compliance", file: "/legal/security.html", public: true },
  { id: "dpa", title: "Data Processing Addendum", file: "/legal/dpa.html", public: true },
  { id: "msa", title: "Master Service Agreement", file: "/legal/msa.html", enterprise: true },
  { id: "sla", title: "Service Level Agreement", file: "/legal/sla.html", enterprise: true },
  { id: "ai-liability", title: "AI Agent Liability Addendum", file: "/legal/ai-liability.html", enterprise: true },
  { id: "hipaa-baa", title: "HIPAA Business Associate Agreement", file: "/legal/hipaa-baa.html", enterprise: true },
  { id: "developer-terms", title: "Integration Developer Terms", file: "/legal/developer-terms.html", developer: true },
  { id: "marketplace-publisher", title: "Marketplace Publisher Agreement", file: "/legal/marketplace-publisher.html", developer: true },
  { id: "beta-features", title: "Beta Features Agreement", file: "/legal/beta-features.html", public: true },
];

export default function Legal() {
  const [, setLocation] = useLocation();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check URL hash for direct document link
    const hash = window.location.hash.slice(1);
    if (hash) {
      const doc = legalDocs.find(d => d.id === hash);
      if (doc) {
        setSelectedDoc(doc.id);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDoc) {
      const doc = legalDocs.find(d => d.id === selectedDoc);
      if (doc) {
        setLoading(true);
        fetch(doc.file)
          .then(res => res.text())
          .then(html => {
            setContent(html);
            setLoading(false);
            window.location.hash = doc.id;
          })
          .catch(err => {
            console.error("Failed to load document:", err);
            setContent("<p>Failed to load document. Please try again.</p>");
            setLoading(false);
          });
      }
    }
  }, [selectedDoc]);

  const handleBack = () => {
    setSelectedDoc(null);
    setContent("");
    window.location.hash = "";
  };

  const handleDownload = () => {
    const doc = legalDocs.find(d => d.id === selectedDoc);
    if (doc) {
      // Create a blob and download
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.id}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (selectedDoc) {
    const doc = legalDocs.find(d => d.id === selectedDoc);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Legal Documents
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold">{doc?.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Card className="p-8">
              <div 
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Documents</h1>
          <p className="text-muted-foreground">
            Access all Brikk legal agreements, policies, and compliance documents
          </p>
        </div>

        <div className="space-y-8">
          {/* Public Documents */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Public Legal Documents
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {legalDocs.filter(d => d.public).map(doc => (
                <Card 
                  key={doc.id}
                  className="p-6 hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedDoc(doc.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to view full document
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Enterprise Documents */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Enterprise Legal Package
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {legalDocs.filter(d => d.enterprise).map(doc => (
                <Card 
                  key={doc.id}
                  className="p-6 hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedDoc(doc.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Enterprise customers only
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Developer Documents */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Developer & Marketplace
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {legalDocs.filter(d => d.developer).map(doc => (
                <Card 
                  key={doc.id}
                  className="p-6 hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedDoc(doc.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        For developers and publishers
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
