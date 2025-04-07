# GitHub Profile Analyzer

📊 A tool that analyzes a developer’s GitHub profile to show their repositories, commit activity, and coding habits.

## 🛠️ Tech Stack

- React + Vite + TypeScript
- TailwindCSS for styling
- ShadCN UI for components
- Axios for GitHub API calls
- Recharts for data visualization

## ✨ Features

- **User Profile Analysis**: View basic GitHub profile information
- **Repository Overview**: Display user's repositories with key metrics
- **Commit Activity**: Visualize commit patterns over the last 30 days
- **Language Statistics**: See the developer's most used programming languages
- **Activity Insights**: Identify most active days and commit streaks
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/sujal862/ProfileAnalyzer.git
   cd github-profile-analyzer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your GitHub token:
   ```
   VITE_GITHUB_TOKEN=your_github_personal_access_token
   ```

   > **Note**: To create a GitHub personal access token, go to GitHub Settings > Developer Settings > Personal access tokens > Generate new token. Select the `repo` and `user` scopes.

4. Start the development server
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your GitHub API token as an environment variable named `VITE_GITHUB_TOKEN`
4. Deploy!

## 📝 Usage

1. Enter a GitHub username in the search field
2. Click "Analyze" to fetch and display the user's profile data
3. Explore repositories, commit patterns, and developer insights

## 🧩 Project Structure

- `src/components/` - React components
- `src/lib/` - Utility functions and API wrappers
- `src/components/ui/` - ShadCN UI components

