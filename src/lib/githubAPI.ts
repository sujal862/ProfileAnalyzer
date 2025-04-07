import axios from 'axios';

// axios instance to call GitHub API
const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// Get user's public repositories
export async function getUserRepos(username: string) {
  try {
    const response = await githubAPI.get(`/users/${username}/repos`, {
      params: {
        sort: 'updated',
        per_page: 100, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
}

// Get commits for a specific repository in the last 30 days
export async function getCommits(username: string, repo: string) {
  try {
    // Calculate date 30 days ago
    console.log(repo);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sinceDate = thirtyDaysAgo.toISOString();

    const response = await githubAPI.get(`/repos/${username}/${repo}/commits`, {
      params: { //filter by date
        since: sinceDate,
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching commits for ${repo}:`, error);
    throw error;
  }
}

// Get user profile information
export async function getUserProfile(username: string) {
  try {
    const response = await githubAPI.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
