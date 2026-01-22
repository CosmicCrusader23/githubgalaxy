'use client';

import { useState } from 'react';
import { GitHubData, PlanetData } from '@/types/github';

export function useGitHubData() {
  const [data, setData] = useState<{
    user: GitHubData['user'];
    planets: PlanetData[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    code?: number;
  } | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);

  const generateColor = (index: number, total: number): string => {
    // Generate distinct procedural colors based on hash of repo name and index
    const hue = (index * (360 / total)) % 360;
    const saturation = 65 + Math.random() * 20; // 65-85%
    const lightness = 45 + Math.random() * 15; // 45-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const calculatePlanetSize = (stars: number): number => {
    // Logarithmic scaling to prevent huge planets
    // Base size: 0.3, Max size: 1.2
    const logStars = Math.log10(Math.max(stars, 1));
    return 0.3 + Math.min(logStars * 0.2, 0.9);
  };

  const processRepos = (repos: any[]): PlanetData[] => {
    // Sort repos by stars to distribute them
    const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Limit to 30 repos to prevent performance issues
    const maxRepos = Math.min(sortedRepos.length, 30);

    return sortedRepos.slice(0, maxRepos).map((repo, index) => {
      // Distribute orbit radii: start from 4, increase by 1.5 for each orbit band
      // Group repos into orbital bands (e.g., 3-4 repos per band)
      const bandIndex = Math.floor(index / 4);
      const positionInBand = index % 4;
      const baseRadius = 4 + bandIndex * 2;
      const orbitRadius = baseRadius + positionInBand * 0.5;

      // Random orbit speed: closer planets orbit faster
      const orbitSpeed = 0.2 + Math.random() * 0.3 / (bandIndex + 1);

      // Random starting phase
      const orbitPhase = Math.random() * Math.PI * 2;

      // Calculate size based on stars
      const size = calculatePlanetSize(repo.stargazers_count);

      // Generate color
      const color = generateColor(index, maxRepos);

      return {
        repo,
        orbitRadius,
        orbitSpeed,
        orbitPhase,
        size,
        color,
      };
    });
  };

  const fetchGitHubData = async (username: string) => {
    setLoading(true);
    setError(null);
    setUserNotFound(false);
    setData(null);

    try {
      const response = await fetch(`/api/github?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        if (response.status === 404) {
          setUserNotFound(true);
          setError({ message: 'User not found', code: 404 });
        } else {
          const errorData = await response.json();
          setError({ message: errorData.error || 'Failed to fetch GitHub data', code: response.status });
        }
        return;
      }

      const result: GitHubData = await response.json();

      // Process repos into planet data
      const planets = processRepos(result.repos);

      setData({
        user: result.user,
        planets,
      });
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    userNotFound,
    fetchGitHubData,
  };
}
