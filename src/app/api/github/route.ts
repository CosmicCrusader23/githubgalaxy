import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Note: Add 'Authorization': `token ${process.env.GITHUB_TOKEN}` if you need higher rate limits
        // Without token: 60 requests/hour
        // With token: 5000 requests/hour
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      if (userResponse.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 403 }
        );
      }
      throw new Error(`GitHub API error: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();

    // Fetch user's public repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
    }

    const reposData = await reposResponse.json();

    // Return combined data
    return NextResponse.json({
      user: userData,
      repos: reposData,
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub data',
      },
      { status: 500 }
    );
  }
}
