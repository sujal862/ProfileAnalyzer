import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightsSectionProps {
  languages: Record<string, number>;
  mostActiveDay: { day: string; count: number } | null;
  commitStreak: number;
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
  // Add more languages as needed
  default: "bg-gray-400",
};

export function InsightsSection({ languages, mostActiveDay, commitStreak }: InsightsSectionProps) {
  // Sort languages by usage (highest first)
  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1]) 
    .slice(0, 5); // Show top 5 languages

  // Calculate total for percentage
  const totalBytes = Object.values(languages).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="w-full animate-fade-in transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Developer Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full divide-y divide-border/50">
          <AccordionItem value="languages" className="py-1">
            <AccordionTrigger className="hover:text-primary transition-colors duration-200 hover:no-underline">Top Languages</AccordionTrigger>
            <AccordionContent>
              {sortedLanguages.length > 0 ? (
                <div className="space-y-3">
                  {sortedLanguages.map(([language, bytes]) => {
                    const percentage = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0;
                    const languageColor = languageColors[language] || languageColors.default;

                    return (
                      <div key={language} className="space-y-1 group cursor-pointer transition-all duration-300 hover:bg-secondary/30 p-2 rounded-md">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${languageColor} group-hover:scale-125 transition-transform duration-300`}></div>
                            <span className="group-hover:font-medium transition-all">{language}</span>
                          </div>
                          <span className="group-hover:text-primary transition-colors">{percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className={`${languageColor} h-2 rounded-full transition-all duration-500 ease-out group-hover:brightness-110`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No language data available</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="active-day" className="py-1">
            <AccordionTrigger className="hover:text-primary transition-colors duration-200 hover:no-underline">Most Active Day</AccordionTrigger>
            <AccordionContent>
              {mostActiveDay ? (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                  <span>
                    <strong>{mostActiveDay.day}</strong> with {mostActiveDay.count} commits
                  </span> {/* calendar icon */}
                </div>
              ) : (
                <p className="text-muted-foreground">No activity data available</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="streak" className="py-1">
            <AccordionTrigger className="hover:text-primary transition-colors duration-200 hover:no-underline">Commit Streak</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 18v-1" />
                  <path d="M16 18v-3" />
                </svg>
                <span>
                  <strong>{commitStreak}</strong> day{commitStreak !== 1 ? 's' : ''} streak
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
