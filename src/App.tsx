import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { RepoCard } from "./components/RepoCard";
import { CommitChart } from "./components/CommitChart";
import { InsightsSection } from "./components/InsightsSection";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { RepoCardSkeleton, ChartSkeleton, InsightsSkeleton } from "./components/SkeletonLoader";
import { getUserProfile, getUserRepos, getCommits } from "./lib/githubAPI";
import { format } from "date-fns"; // format date

function App() {
  const [username, setUsername] = useState<string>('');
  const [inputUsername, setInputUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [repos, setRepos] = useState<any[]>([]); // array of any type
  const [commitData, setCommitData] = useState<Record<string, number>>({});
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [mostActiveDay, setMostActiveDay] = useState<{ day: string; count: number } | null>(null);
  const [commitStreak, setCommitStreak] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Function to fetch user data
  const fetchUserData = async (username: string) => {
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setIsLoading(true);
    setUsername(username);

    try {
      // Fetch user profile
      const profile = await getUserProfile(username);
      setUserProfile(profile);

      // Fetch repositories
      const repositories = await getUserRepos(username);
      setRepos(repositories);

      // merge language data(count) from all repos
      const langData: Record<string, number> = {};
      repositories.forEach((repo: any) => {
        if (repo.language) {
          langData[repo.language] = (langData[repo.language] || 0) + 1;
        }
      });

      setLanguages(langData);

      // Fetch commits for each repository (last 30 days)
      const commitsByDay: Record<string, number> = {};  // to store number of commits on specific day
      const commitDates: string[] = []; // array to store all dates

      // Only processing the first 5 repos
      const reposToProcess = repositories.slice(0, 5);

      for (const repo of reposToProcess) {
        try {
          const commits = await getCommits(username, repo.name);

          // Process commit data
          commits.forEach((commit: any) => {
            const date = commit.commit.author.date.split('T')[0]; // YYYY-MM-DD format
            commitsByDay[date] = (commitsByDay[date] || 0) + 1;
            commitDates.push(date);
          });
        } catch (error) {
          console.error(`Error fetching commits for ${repo.name}:`, error);
        }
      }

      setCommitData(commitsByDay);

      // Find most active day
      let maxCount = 0;
      let maxDay = null;

      for (const [date, count] of Object.entries(commitsByDay)) {
        if (count > maxCount) {
          maxCount = count;
          maxDay = date;
        }
      }
      if (maxDay) {
        setMostActiveDay({
          day: format(new Date(maxDay), 'EEEE, MMM d'),
          count: maxCount
        });
      }

      // Calculate commit streak
      const sortedDates = commitDates
        .map(date => new Date(date).getTime())
        .sort((a, b) => a - b);

      let currentStreak = 1;
      let maxStreak = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);

        // Check if dates are consecutive
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) { //consecutive days commits
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      setCommitStreak(maxStreak);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching user data. Please check the username and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData(inputUsername);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold">GitHub Profile Analyzer</h1>
            <p className="text-muted-foreground">Analyze GitHub profiles and repositories</p>
          </header>

          {/* Search Form */}
          <Card className="animate-slide-up">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter GitHub username"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="flex-1 transition-all duration-300 hover:border-primary/50 focus-visible:border-primary/70 focus-visible:ring-primary/20"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="relative overflow-hidden group transition-all hover:shadow-md"
                >
                  <span className="relative z-10">
                    {isLoading ? <LoadingSpinner /> : "Analyze"}
                  </span>
                  <span className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* User Profile Section */}
          {username && (
            <div className="space-y-8">
              {/* User Info */}
              {isLoading ? (
                <Card className="animate-pulse">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-muted rounded"></div>
                      <div className="h-4 w-48 bg-muted rounded"></div>
                    </div>
                  </CardHeader>
                </Card>
              ) : userProfile ? (
                <Card className="animate-slide-up transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <img
                      src={userProfile.avatar_url}
                      alt={`${username}'s avatar`}
                      className="h-16 w-16 rounded-full"
                    />
                    <div>
                      <CardTitle>{userProfile.name || username}</CardTitle>
                      <p className="text-muted-foreground">
                        {userProfile.bio || `GitHub user @${username}`}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                          </svg>
                          <span>{userProfile.public_repos} repos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>{userProfile.followers} followers</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://github.com/${username}`, '_blank')}
                          className="flex items-center gap-1.5 transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer"
                        >
                          <span>View Profile</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 7h10v10" />
                            <path d="M7 17 17 7" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ) : null}

              {/* Repositories cards */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Repositories</h2>
                  {!isLoading && repos.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://github.com/${username}?tab=repositories`, '_blank')}
                      className="flex items-center gap-1.5 transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      <span>View All</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </Button>
                  )}
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, index) => (
                      <RepoCardSkeleton key={index} />
                    ))}
                  </div>
                ) : repos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {repos.slice(0, 6).map((repo) => (
                      <RepoCard
                        key={repo.id}
                        name={repo.name}
                        description={repo.description}
                        stars={repo.stargazers_count}
                        forks={repo.forks_count}
                        language={repo.language}
                        lastCommitDate={repo.updated_at}
                        username={username}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No repositories found for this user
                  </p>
                )}
              </div>

              {/* Commit Chart and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <ChartSkeleton />
                    <InsightsSkeleton />
                  </>
                ) : (
                  <>
                    <CommitChart commitData={commitData} />
                    <InsightsSection
                      languages={languages}
                      mostActiveDay={mostActiveDay}
                      commitStreak={commitStreak}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
