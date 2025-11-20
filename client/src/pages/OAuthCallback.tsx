import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  verifyOAuthState,
  getStoredProvider,
  clearOAuthState,
  exchangeCodeForToken,
  storeOAuthTokens,
  OAUTH2_PROVIDERS,
} from "@/lib/oauth2";

export default function OAuthCallback() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/oauth/callback");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      // Check for errors
      if (error) {
        throw new Error(`Authorization failed: ${error}`);
      }

      // Validate required parameters
      if (!code || !state) {
        throw new Error("Missing authorization code or state");
      }

      // Verify state (CSRF protection)
      if (!verifyOAuthState(state)) {
        throw new Error("Invalid state parameter - possible CSRF attack");
      }

      // Get provider ID
      const providerId = getStoredProvider();
      if (!providerId) {
        throw new Error("Provider information not found");
      }

      const provider = OAUTH2_PROVIDERS[providerId];
      if (!provider) {
        throw new Error(`Unknown provider: ${providerId}`);
      }

      // Exchange code for tokens
      setMessage(`Exchanging authorization code for ${provider.name}...`);
      const tokens = await exchangeCodeForToken(providerId, code);

      // Store tokens
      storeOAuthTokens(providerId, tokens);

      // Clear OAuth state
      clearOAuthState();

      // Success!
      setStatus("success");
      setMessage(`Successfully connected to ${provider.name}!`);

      // Redirect to marketplace after 2 seconds
      setTimeout(() => {
        navigate("/marketplace/integrations");
      }, 2000);
    } catch (err) {
      console.error("OAuth callback error:", err);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Authorization failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Status Icon */}
        <div className="flex justify-center">
          {status === "loading" && (
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-16 h-16 text-destructive" />
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {status === "loading" && "Completing Authorization..."}
            {status === "success" && "Authorization Successful!"}
            {status === "error" && "Authorization Failed"}
          </h1>
        </div>

        {/* Message */}
        {message && (
          <Alert variant={status === "error" ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {status === "success" && (
          <div className="text-center text-sm text-muted-foreground">
            Redirecting to Integration Marketplace...
          </div>
        )}

        {status === "error" && (
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/marketplace/integrations")}>
              Back to Marketplace
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
