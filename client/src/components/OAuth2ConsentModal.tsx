import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ExternalLink, Shield, CheckCircle2 } from "lucide-react";

interface OAuth2Provider {
  id: string;
  name: string;
  logo: string;
  authUrl: string;
  scopes: string[];
  description: string;
}

interface OAuth2ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: OAuth2Provider | null;
  onAuthorize: (provider: OAuth2Provider) => Promise<void>;
}

export default function OAuth2ConsentModal({
  isOpen,
  onClose,
  provider,
  onAuthorize,
}: OAuth2ConsentModalProps) {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!provider) return null;

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
    setError(null);

    try {
      await onAuthorize(provider);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authorization failed");
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img src={provider.logo} alt={provider.name} className="w-10 h-10" />
            <div>
              <DialogTitle>Connect to {provider.name}</DialogTitle>
              <DialogDescription className="text-sm">
                Authorize Brikk to access your {provider.name} account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground">{provider.description}</p>

          {/* Permissions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-primary" />
              Brikk will be able to:
            </div>
            <ul className="space-y-2">
              {provider.scopes.map((scope, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your credentials are encrypted and never stored on Brikk servers. You can revoke access at any time from your {provider.name} account settings.
            </AlertDescription>
          </Alert>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isAuthorizing} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleAuthorize} disabled={isAuthorizing} className="w-full sm:w-auto">
            {isAuthorizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authorizing...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Authorize {provider.name}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
