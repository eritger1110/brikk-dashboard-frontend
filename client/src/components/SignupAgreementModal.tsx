import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";

interface SignupAgreementModalProps {
  open: boolean;
  onAccept: (consents: ConsentData) => void;
  onDecline: () => void;
  userLocation?: "EU" | "California" | "Other";
}

export interface ConsentData {
  accepted_tos_at: string;
  accepted_privacy_policy_at: string;
  accepted_aup_at: string;
  accepted_clickwrap_at: string;
  accepted_dpa_at?: string;
  accepted_ai_liability_at: string;
}

export default function SignupAgreementModal({ 
  open, 
  onAccept, 
  onDecline,
  userLocation = "Other" 
}: SignupAgreementModalProps) {
  const [acceptedTOS, setAcceptedTOS] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedAUP, setAcceptedAUP] = useState(false);
  const [acceptedDPA, setAcceptedDPA] = useState(false);
  const [acceptedAILiability, setAcceptedAILiability] = useState(false);
  const [error, setError] = useState("");

  const requiresDPA = userLocation === "EU" || userLocation === "California";
  const allRequiredAccepted = acceptedTOS && acceptedPrivacy && acceptedAUP && acceptedAILiability && (!requiresDPA || acceptedDPA);

  const handleAccept = () => {
    if (!allRequiredAccepted) {
      setError("You must accept all required agreements to continue");
      return;
    }

    const timestamp = new Date().toISOString();
    const consents: ConsentData = {
      accepted_tos_at: timestamp,
      accepted_privacy_policy_at: timestamp,
      accepted_aup_at: timestamp,
      accepted_clickwrap_at: timestamp,
      accepted_ai_liability_at: timestamp,
    };

    if (requiresDPA) {
      consents.accepted_dpa_at = timestamp;
    }

    onAccept(consents);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onDecline()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Brikk</DialogTitle>
          <DialogDescription>
            Before you continue, please review and accept our legal agreements
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* Click-Through Agreement Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Brikk Click-Through Agreement</h3>
              <p className="text-sm text-muted-foreground mb-3">
                By using Brikk, you agree to our terms and policies. This agreement governs your use of the Brikk platform, 
                including all AI agents, workflows, and integrations.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Key Points:</strong>
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                <li>You must be 18+ and authorized to bind your organization</li>
                <li>You are responsible for all activity under your account</li>
                <li>AI agents act on your behalf - you retain full liability</li>
                <li>We process data according to our Privacy Policy and DPA</li>
                <li>Enterprise features require separate MSA and SLA</li>
              </ul>
            </div>

            {/* Required Agreements */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">REQUIRED AGREEMENTS</h3>
              
              {/* Terms of Service */}
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="tos" 
                  checked={acceptedTOS}
                  onCheckedChange={(checked) => setAcceptedTOS(checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="tos" className="text-sm font-medium cursor-pointer">
                    I agree to the Brikk Terms of Service
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Governs your use of the platform, billing, and account management
                  </p>
                  <a 
                    href="/legal#terms-of-service" 
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Read full Terms of Service <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="privacy" 
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                    I agree to the Brikk Privacy Policy
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Explains how we collect, use, and protect your data
                  </p>
                  <a 
                    href="/legal#privacy-policy" 
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Read full Privacy Policy <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Acceptable Use Policy */}
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="aup" 
                  checked={acceptedAUP}
                  onCheckedChange={(checked) => setAcceptedAUP(checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="aup" className="text-sm font-medium cursor-pointer">
                    I agree to the Brikk Acceptable Use Policy
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Defines prohibited uses and content restrictions
                  </p>
                  <a 
                    href="/legal#acceptable-use-policy" 
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Read full Acceptable Use Policy <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* AI Liability Disclaimer */}
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="ai-liability" 
                  checked={acceptedAILiability}
                  onCheckedChange={(checked) => setAcceptedAILiability(checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="ai-liability" className="text-sm font-medium cursor-pointer">
                    I acknowledge the Brikk AI Agent Liability Disclaimer
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    You are responsible for AI agent actions and outputs
                  </p>
                  <a 
                    href="/legal#ai-liability" 
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Read full AI Liability Addendum <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Data Processing Addendum (EU/California only) */}
              {requiresDPA && (
                <div className="flex items-start gap-3 p-3 border border-amber-500/50 rounded-lg bg-amber-500/5">
                  <Checkbox 
                    id="dpa" 
                    checked={acceptedDPA}
                    onCheckedChange={(checked) => setAcceptedDPA(checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor="dpa" className="text-sm font-medium cursor-pointer">
                      I agree to the Data Processing Addendum (DPA)
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for {userLocation} users - governs GDPR/CCPA compliance
                    </p>
                    <a 
                      href="/legal#dpa" 
                      target="_blank"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Read full Data Processing Addendum <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Enterprise Customers</h4>
              <p className="text-xs text-muted-foreground">
                If you require a Master Service Agreement (MSA), Service Level Agreement (SLA), 
                HIPAA Business Associate Agreement (BAA), or other enterprise legal documents, 
                please contact our sales team at <a href="mailto:enterprise@getbrikk.com" className="text-primary hover:underline">enterprise@getbrikk.com</a>
              </p>
            </div>
          </div>
        </ScrollArea>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={onDecline}>
            Decline & Exit
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!allRequiredAccepted}
            className="min-w-[120px]"
          >
            Accept & Continue
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By clicking "Accept & Continue", you confirm that you have read, understood, and agree to be bound by all agreements listed above.
        </p>
      </DialogContent>
    </Dialog>
  );
}
