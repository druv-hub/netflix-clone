import { NetflixIntro } from "@/components/NetflixIntro";
import { ProfileSelector } from "@/components/ProfileSelector";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProfile } from "@/lib/memoryStore";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ShowDetail from "@/pages/ShowDetail";
import Watch from "@/pages/Watch";
import React, { useState } from "react";
import { Route, Switch, Redirect } from "wouter";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(
    null
  );

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setActiveProfileState(profile);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
    setActiveProfileState(null);
  };

  // 1. Initial Netflix Ribbon + Sound Intro Screen
  if (showIntro) {
    return <NetflixIntro onComplete={handleIntroComplete} />;
  }

  // 2. "Who's Watching?" Profile Selection Screen
  if (!activeProfile) {
    return <ProfileSelector onSelect={handleSelectProfile} />;
  }

  // 3. Main Netflix App Experience
  return (
    <TooltipProvider>
      <Toaster richColors position="bottom-right" />
      <Switch>
        <Route path="/">
          <Home onReplayIntro={handleReplayIntro} />
        </Route>
        <Route path="/show">
          <ShowDetail onReplayIntro={handleReplayIntro} />
        </Route>
        <Route path="/watch/:id">
          <Watch />
        </Route>
        <Route path="/admin">
          <Redirect to="/" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}
