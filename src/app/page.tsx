'use client';

import { useState } from 'react';
import { useGitHubData } from '@/hooks/use-github-data';
import { Scene } from '@/components/3d/Scene';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DraggableCard } from '@/components/ui/draggable-card';
import { Slider } from '@/components/ui/slider';
import { Search, Github, Loader2, AlertCircle, GitBranch, X, Eye, EyeOff, Zap, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Curated list of GitHub users with repositories
const RANDOM_USERS = [
  { username: 'torvalds', name: 'Torvalds' },
  { username: 'octocat', name: 'Octocat' },
  { username: 'vercel', name: 'Vercel' },
  { username: 'tailwindlabs', name: 'Tailwind Labs' },
  { username: 'facebook', name: 'Facebook' },
  { username: 'google', name: 'Google' },
  { username: 'microsoft', name: 'Microsoft' },
  { username: 'airbnb', name: 'Airbnb' },
  { username: 'netflix', name: 'Netflix' },
  { username: 'spotify', name: 'Spotify' },
  { username: 'stripe', name: 'Stripe' },
  { username: 'shopify', name: 'Shopify' },
  { username: 'atlassian', name: 'Atlassian' },
  { username: 'github', name: 'GitHub' },
  { username: 'gitlab', name: 'GitLab' },
  { username: 'freeCodeCamp', name: 'FreeCodeCamp' },
];

// Animated Logo Component - With revolving planets
function AnimatedLogo() {
  return (
    <div className="relative w-10 h-10">
      {/* Outer rotating ring */}
      <div className="absolute inset-0 animate-[spin_25s_linear_infinite]">
        <div className="w-full h-full rounded-full border-2 border-primary/20" />
      </div>
      
      {/* Middle rotating ring (reverse) */}
      <div className="absolute inset-[3px] animate-[spin_35s_linear_infinite_reverse]">
        <div className="w-full h-full rounded-full border border-primary/15" />
      </div>
      
      {/* Inner rotating ring */}
      <div className="absolute inset-[6px] animate-[spin_20s_linear_infinite]">
        <div className="w-full h-full rounded-full border border-primary/25" />
      </div>
      
      {/* Central core */}
      <div className="absolute inset-[9px] rounded-full bg-primary animate-pulse" />
      
      {/* Revolving planets */}
      <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/70" />
      </div>
      <div className="absolute inset-0 animate-[spin_45s_linear_infinite_reverse]">
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1 w-1.5 h-1.5 rounded-full bg-primary/60" />
      </div>
      <div className="absolute inset-0 animate-[spin_55s_linear_infinite]">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1 w-1 h-1 rounded-full bg-primary/40" />
      </div>
    </div>
  );
}

// Cool Loading Animation
function CoolLoader() {
  return (
    <div className="relative w-16 h-16 mx-auto">
      {/* Rotating ring 1 */}
      <div className="absolute inset-0 rounded-full border-4 border-primary/8" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-[spin_2.5s_linear_infinite]" />
      
      {/* Rotating ring 2 */}
      <div className="absolute inset-[5px] rounded-full border-4 border-primary/8" />
      <div className="absolute inset-[5px] rounded-full border-4 border-transparent border-t-primary/70 animate-[spin_3s_linear_infinite_reverse]" />
      
      {/* Rotating ring 3 */}
      <div className="absolute inset-[10px] rounded-full border-4 border-primary/8" />
      <div className="absolute inset-[10px] rounded-full border-4 border-transparent border-t-primary/50 animate-[spin_4s_linear_infinite]" />
      
      {/* Center */}
      <div className="absolute inset-[15px] rounded-full bg-primary" />
    </div>
  );
}

export default function GitHubGalaxyPage() {
  const [username, setUsername] = useState('');
  const [uiVisible, setUiVisible] = useState(true);
  const [galaxySpeed, setGalaxySpeed] = useState(1);
  const { data, loading, error, userNotFound, fetchGitHubData } = useGitHubData();
  const { toast } = useToast();

  const handleRandomUser = () => {
    const randomUser = RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)];
    setUsername(randomUser.username);
    fetchGitHubData(randomUser.username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        title: 'Username required',
        description: 'Please enter a GitHub username to explore.',
        variant: 'destructive',
      });
      return;
    }

    await fetchGitHubData(username.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const hasData = data && !loading;

  return (
    <div className={`min-h-screen flex flex-col bg-background ${hasData ? 'h-screen overflow-hidden' : ''}`}>
      {/* Header */}
      {(!hasData || uiVisible) && (
        <header className="border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <AnimatedLogo />
              <h1 className="text-xl font-semibold text-foreground">
                GitHub Galaxy
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter GitHub username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 w-64 bg-background border-foreground text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:ring-offset-0"
                  style={{ borderWidth: '2px' }}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                onClick={handleRandomUser}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className={`relative overflow-hidden ${hasData ? 'flex-1 w-full h-full' : 'flex-1'}`}>
        {/* User Not Found State */}
        {userNotFound && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-6 max-w-md px-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-[-4px] rounded-full bg-destructive/10 animate-ping" />
                  <X className="h-16 w-16 text-destructive" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">User Not Found</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We could not find a GitHub user matching <span className="font-medium text-foreground">"{username}"</span>.
              </p>
              <p className="text-sm text-muted-foreground/70 mb-6">
                Try a random user with repositories, or check the username and try again.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRandomUser}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Random User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUsername('');
                    setUserNotFound(false);
                  }}
                >
                  Try Different Username
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* General Error State */}
        {error && !userNotFound && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-6 max-w-md px-6">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Error</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {error.message}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setError(null);
                  setUsername('');
                }}
                className="mx-auto"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Full screen 3D scene when data is loaded */}
        <div className={`absolute inset-0 ${hasData ? 'z-0' : 'z-0'}`}>
          <Scene data={data} galaxySpeed={galaxySpeed} />
        </div>

        {/* Floating UI toggle when data is loaded */}
        {hasData && (
          <button
            onClick={() => setUiVisible(!uiVisible)}
            className="absolute top-5 right-5 z-50 p-2 rounded-lg bg-card/95 border-border border-foreground backdrop-blur-sm hover:bg-card transition-colors"
            title={uiVisible ? "Hide UI" : "Show UI"}
          >
            {uiVisible ? (
              <EyeOff className="h-4 w-4 text-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-foreground" />
            )}
          </button>
        )}

        {/* Floating UI when data is loaded */}
        {hasData && uiVisible && (
          <>
            {/* User info card - draggable, high on left */}
            <DraggableCard className="p-4 bg-card/95 border-border border-foreground backdrop-blur-sm shadow-sm max-w-xs" initialPosition={{ x: 20, y: 80 }}>
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={data.user.avatar_url}
                  alt={data.user.login}
                  className="w-12 h-12 rounded-lg border border-primary/30 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-foreground text-base leading-tight truncate">{data.user.name || data.user.login}</h2>
                  <p className="text-sm text-muted-foreground">@{data.user.login}</p>
                </div>
                <button
                  onClick={() => setUiVisible(false)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0 text-muted-foreground hover:text-foreground"
                  title="Hide"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Followers</span>
                  <span className="font-medium text-foreground">{data.user.followers.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Repos</span>
                  <span className="font-medium text-foreground">{data.user.public_repos.toLocaleString()}</span>
                </div>
              </div>
              {data.user.bio && (
                <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed">{data.user.bio}</p>
              )}
            </DraggableCard>

            {/* Legend - bottom left of screen */}
            <DraggableCard className="p-3 bg-card/95 border-border border-foreground backdrop-blur-sm shadow-sm" initialPosition={{ x: 20, y: 0 }} style={{ bottom: '24px', top: 'auto' }}>
              <h3 className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="uppercase tracking-wide text-xs">Legend</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-foreground">Sun</span>
                  <span className="text-muted-foreground/60 ml-1">User profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                  <span className="text-foreground">Planet</span>
                  <span className="text-muted-foreground/60 ml-1">Repository</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2.5 rounded-full bg-muted-foreground" />
                  <span className="text-foreground">Moon</span>
                  <span className="text-muted-foreground/60 ml-1">Open issues</span>
                </div>
              </div>
            </DraggableCard>

            {/* Galaxy Speed Control - Bottom panel */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-64">
              <Card className="p-3 bg-card/95 border-border border-foreground backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Galaxy Speed</span>
                </div>
                <Slider
                  value={[galaxySpeed]}
                  onValueChange={(values) => setGalaxySpeed(values[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Slow</span>
                  <span className="font-medium text-foreground">{galaxySpeed.toFixed(1)}x</span>
                  <span>Fast</span>
                </div>
              </Card>
            </div>

            {/* Instructions - bottom panel */}
            <div className="absolute bottom-6 right-6 z-10">
              <Card className="p-3 bg-card/95 border-border border-foreground backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5" />
                    <span>Click planet</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">⎘</span>
                    <span>Drag to rotate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🔍</span>
                    <span>Scroll to zoom</span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* No data state - Welcome screen */}
        {!userNotFound && !error && !hasData && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-8 max-w-md px-6">
              <div className="flex justify-center">
                <AnimatedLogo />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-foreground mb-3">Explore GitHub as a Galaxy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Enter a GitHub username to visualize their profile as an interactive 3D solar system.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground mt-4">
                <Button
                  variant="outline"
                  onClick={handleRandomUser}
                  className="mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Random User
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-6">
              <CoolLoader />
              <p className="text-sm text-muted-foreground">Fetching data from GitHub...</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom panel - Only show when no data */}
      {!hasData && (
        <div className="border-t border-border bg-card/50 backdrop-blur-sm px-6 py-4 mt-auto">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Github className="h-4 w-4" />
              <span>Click planet to open repository</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⎘</span>
              <span>Drag to rotate view</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🔍</span>
              <span>Scroll to zoom in/out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
