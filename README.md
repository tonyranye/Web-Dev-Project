# Fitness Tracking App

A Vue 3 single-page application for tracking fitness activity including workouts, food intake, and personal health metrics.


---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Vue 3 | ^3.5.31 | Frontend framework |
| Vue Router | ^5.0.4 | Client-side routing |
| Pinia | ^3.0.4 | Global state management |
| Vite | ^8.0.3 | Build tool and dev server |
| Express | ^5.2.1 | Backend server |
| Font Awesome | CDN | Icons |

---

## Project Structure

```
Web-Dev-Project
├─ .idea
├─ .prettierignore
├─ .prettierrc
├─ contributions.txt
├─ eslint.config.mjs
├─ fitness-tracking-app
│  ├─ ai-prompts.txt
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ README.md
│  ├─ server
│  │  ├─ .env
│  │  ├─ index.js
│  │  ├─ package-lock.json
│  │  └─ package.json
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  ├─ base.css
│  │  │  └─ placeholder_profile_picture.webp
│  │  ├─ components
│  │  │  ├─ activity
│  │  │  ├─ home_page
│  │  │  ├─ icons
│  │  │  ├─ navbar.vue
│  │  │  └─ profile_page
│  │  ├─ composables
│  │  │  └─ useActivity.js
│  │  ├─ lib
│  │  │  ├─ profileService.js
│  │  │  └─ supabase.js
│  │  ├─ main.js
│  │  ├─ router
│  │  │  └─ index.js
│  │  └─ views
│  │     ├─ activityPage.vue
│  │     ├─ food_tracker.vue
│  │     ├─ homepage.vue
│  │     ├─ landing_page.vue
│  │     ├─ LoginSignup.vue
│  │     └─ profile_page.vue
│  └─ vite.config.js
├─ group_members.html
├─ package-lock.json
└─ README.md
```

---

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `homepage.vue` | Dashboard with fitness overview |
| `/activity` | `activityPage.vue` | Activity logging and tracking |
| `/food_tracker` | `food_tracker.vue` | Food and calorie tracking |
| `/profile` | `profile_page.vue` | User profile and settings |
| `/login` | `LoginSignup.vue` | Log in and sign up pages |
| `/landing_page` | `landing_page.vue` | Landing page when not signed in |

---

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/fitness-tracking-app.git
cd fitness-tracking-app
```

Install dependencies:

```bash
npm install
```

### Running the App

Start the development server concurrently with the express server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
The server will be available at `http://localhost:3000`.
---

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit: `git commit -m "add: your feature description"`
4. Push: `git push origin feature/your-feature-name`
5. Open a pull request

---

## License

This project is for educational purposes as part of a university co-op project.