# GitHub User Finder App

A modern, responsive React application to search for GitHub users and explore their public profiles and repositories with a beautiful, user-friendly interface.

---

## 🚀 Project Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Malay786/Github-user-finder.git
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Add your GitHub personal access token:**
   - Create a `.env` file in the root directory.
   - Add this line:
     ```
     VITE_GITHUB_TOKEN=your_github_personal_access_token
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Build for production:**
   ```sh
   npm run build
   ```

---

## 🏗️ Architecture & Structure

- **Vite + React**: Fast development and build tooling.
- **Redux Toolkit**: State management for user and repository data.
- **Tailwind CSS**: Utility-first styling for rapid, responsive UI.
- **Component Structure:**
  - `src/App.jsx`: Main app logic, theme, and layout.
  - `src/components/RepositoryCard.jsx`: Displays each repository with language breakdown and stars.
  - `src/components/RepositorySorting.jsx`: Simple toggle for sorting repos by stars.
  - `src/userSlice.js` & `src/reposSlice.js`: Redux slices for user and repo state.
  - `src/hooks/useDebounce.js`: Custom hook for debounced input.
- **API Integration:**
  - Uses GitHub REST API for user and repo data.
  - Personal access token is securely loaded from environment variables.

---

## ✨ Features Implemented

- **Live GitHub User Search**: Search for any GitHub username and view their profile details (avatar, bio, location, followers, repo count).
- **Repository Explorer**: Browse a user’s public repositories with infinite scroll for seamless loading.
- **Sort by Stars**: Toggle to sort repositories by star count.
- **Language Breakdown**: Each repository card displays a visual breakdown of the top programming languages used.
- **Dark/Light Mode**: Toggle between a warm, earthy light theme and a vibrant dark mode, both with smooth gradients and elegant transitions.
- **Debounced Search**: Prevents excessive API calls for a smooth, efficient search experience.
- **Mobile Friendly**: Fully responsive design for all device sizes.
- **Secure API Access**: Uses a personal GitHub token stored in environment variables for higher rate limits and security.

---

## 📁 Folder Structure (Simplified)

```
github-user-finder/
├── public/
├── src/
│   ├── components/
│   │   ├── RepositoryCard.jsx
│   │   └── RepositorySorting.jsx
│   ├── hooks/
│   │   └── useDebounce.js
│   ├── App.jsx
│   ├── userSlice.js
│   ├── reposSlice.js
│   └── ...
├── .env           # Your GitHub token (not committed)
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 📝 License

This project is for educational/demo purposes. Feel free to use and modify for your own learning!