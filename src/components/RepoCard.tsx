import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";  // dist b/w curr and given date in words

interface RepoCardProps {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  lastCommitDate: string;
  username?: string; // GitHub username for creating the repo URL
}

// Language color mapping
const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  "C#": "bg-purple-500",
  PHP: "bg-indigo-500",
  Ruby: "bg-red-600",
  Go: "bg-blue-400",
  HTML: "bg-orange-500",
  CSS: "bg-pink-500",
  default: "bg-gray-400",
};

export function RepoCard({ name, description, stars, forks, language, lastCommitDate, username }: RepoCardProps) {
  // Format the last commit date
  const formattedDate = lastCommitDate
    ? formatDistanceToNow(new Date(lastCommitDate), { addSuffix: true })
    : "Unknown";

  // Get language color or default
  const languageColor = language ? (languageColors[language] || languageColors.default) : languageColors.default;

  // Function to handle card click
  const handleCardClick = () => {
    if (username) {
      window.open(`https://github.com/${username}/${name}`, '_blank');  // Open the repo in a new tab
    }
  };

  return (
    <Card
      className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 animate-slide-up cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
          {name}
          {username && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg> // Arrow icon
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 h-10">
          {description || "No description available"}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {language && (
              <div className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${languageColor}`}></div>
                <span>{language}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg> {/*Star icon*/}
              <span>{stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-fork">
                <circle cx="12" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="6" r="3" />
                <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
                <path d="M12 12v3" />
              </svg> {/* fork icon */}
              <span>{forks}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Last updated: {formattedDate}
        </div>
      </CardContent>
    </Card>
  );
}
