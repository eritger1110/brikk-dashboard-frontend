import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/contexts/DemoModeContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function DemoModeToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isDemoMode ? "default" : "outline"}
          size="sm"
          onClick={toggleDemoMode}
          className="gap-2"
        >
          <FlaskConical className="w-4 h-4" />
          {isDemoMode ? 'Demo Mode' : 'Enable Demo'}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDemoMode ? 'Exit demo mode and use Auth0' : 'Enter demo mode (no login required)'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
