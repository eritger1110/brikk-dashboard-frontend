import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Store,
  Wrench,
  Workflow,
  BarChart3,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetPage: string;
  highlightSelector?: string;
  action: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Brikk Platform',
    description: 'Build and deploy autonomous AI agent teams that work together to solve complex business problems. Let\'s take a quick tour of the key features.',
    icon: <Sparkles className="w-12 h-12 text-primary" />,
    targetPage: '/',
    action: 'Get Started'
  },
  {
    id: 'marketplace',
    title: 'BrikkStore',
    description: 'Browse and install pre-built AI agents. Choose from 9 specialized agents including GPT-4, Claude 3, and custom agents for specific tasks.',
    icon: <Store className="w-12 h-12 text-cyan-500" />,
    targetPage: '/marketplace',
    action: 'Visit Marketplace'
  },
  {
    id: 'builder',
    title: 'Custom Agent Builder',
    description: 'Create your own AI agents with our no-code drag-and-drop interface. Select skills, configure integrations, and design custom prompts without writing code.',
    icon: <Wrench className="w-12 h-12 text-violet-500" />,
    targetPage: '/builder',
    action: 'Try Builder'
  },
  {
    id: 'BrikkFlow',
    title: 'Workflow Builder',
    description: 'Connect multiple agents together to create powerful automated BrikkFlows. Design complex multi-agent systems with visual connections and coordination rules.',
    icon: <Workflow className="w-12 h-12 text-green-500" />,
    targetPage: '/BrikkFlow',
    action: 'Build Workflow'
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Track performance, costs, and ROI with deep analytics. Monitor agent success rates, execution times, and get predictive insights to optimize your BrikkFlows.',
    icon: <BarChart3 className="w-12 h-12 text-yellow-500" />,
    targetPage: '/analytics',
    action: 'View Analytics'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'ve completed the tour. Explore the sidebar to discover more features like A/B testing, cost optimization, real-time collaboration, and more.',
    icon: <CheckCircle className="w-12 h-12 text-green-500" />,
    targetPage: '/',
    action: 'Start Building'
  }
];

export default function OnboardingTutorial() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('brikk_onboarding_completed');
    if (completed) {
      setHasCompletedOnboarding(true);
    } else {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Navigate to the target page
      const targetPage = tutorialSteps[nextStep].targetPage;
      if (targetPage !== '/') {
        setLocation(targetPage);
      }
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem('brikk_onboarding_completed', 'true');
    setHasCompletedOnboarding(true);
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('brikk_onboarding_completed', 'true');
    setHasCompletedOnboarding(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
    setLocation('/');
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Navigate to the target page
      const targetPage = tutorialSteps[prevStep].targetPage;
      setLocation(targetPage);
    }
  };

  return (
    <>
      {/* Restart Tutorial Button (shown after completion) */}
      {hasCompletedOnboarding && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="fixed bottom-4 right-4 z-40 gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Restart Tutorial
        </Button>
      )}

      {/* Tutorial Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription className="text-base">
              Step {currentStep + 1} of {tutorialSteps.length}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <Card className="p-8 bg-muted/50">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-background">
                  {currentStepData.icon}
                </div>
                <p className="text-lg text-muted-foreground max-w-md">
                  {currentStepData.description}
                </p>
              </div>
            </Card>

            {/* Feature Highlights (for specific steps) */}
            {currentStep === 1 && (
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">9</div>
                  <div className="text-xs text-muted-foreground">Pre-built Agents</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">5★</div>
                  <div className="text-xs text-muted-foreground">Top Rated</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">1-Click</div>
                  <div className="text-xs text-muted-foreground">Installation</div>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="font-semibold mb-1">10 Skills</div>
                  <div className="text-xs text-muted-foreground">Text generation, data extraction, sentiment analysis, and more</div>
                </Card>
                <Card className="p-3">
                  <div className="font-semibold mb-1">10 Integrations</div>
                  <div className="text-xs text-muted-foreground">OpenAI, Claude, Slack, Salesforce, and more</div>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">4,185%</div>
                  <div className="text-xs text-muted-foreground">ROI Tracking</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-500 mb-1">$163</div>
                  <div className="text-xs text-muted-foreground">Monthly Savings</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-500 mb-1">94.2%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </Card>
              </div>
            )}

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-8'
                      : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < tutorialSteps.length - 1 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tutorial
                </Button>
              )}
              <Button onClick={handleNext} className="gap-2">
                {currentStepData.action}
                {currentStep < tutorialSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
