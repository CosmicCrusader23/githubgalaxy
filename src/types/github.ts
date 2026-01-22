// GitHub API Response Types
export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  followers: number;
  public_repos: number;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  language: string | null;
  topics: string[];
}

// Internal Data Structures for 3D Visualization
export interface PlanetData {
  repo: GitHubRepo;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  size: number;
  color: string;
}

export interface MoonData {
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  size: number;
}

// API Response Wrapper
export interface GitHubApiError {
  message: string;
  documentation_url?: string;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
}
