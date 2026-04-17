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
fitness-tracking-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── base.css
│   │   ├── main.css
│   │   └── logo.svg
│   ├── components/
|   |   ├── activity/
|   |   │       ├── ActivityLog.vue
│   │   │       ├── CategoryBreakdown.vue
│   │   │       ├── LogForm.vue
│   │   │       ├── StatsBar.vue
│   │   │       └── WeeklyChart.vue
│   │   │
│   │   ├── navbar.vue        # Sidebar navigation
│   │   ├── overviewCard.vue  # Homepage stats overview
│   │   └── icons/
│   ├── composables/
|   |    └── useActivity.js
│   ├── router/
│   │   └── index.js          # Route definitions
│   ├── stores/
│   │   └── counter.js        # Pinia store
│   ├── views/
│   │   ├── activityPage.vue
│   │   ├── homepage.vue
│   │   ├── fitness_tracker.vue
│   │   ├── food_tracker.vue
│   │   ├── profile_page.vue
│   │   └── LoginSignup.vue
│   ├── App.vue               # Root layout
│   └── main.js               # App entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `homepage.vue` | Dashboard with fitness overview |
| `/workouts` | `fitness_tracker.vue` | Workout logging and tracking |
| `/activity` | `activityPage.vue` | Activity logging and tracking |
| `/food_tracker` | `food_tracker.vue` | Food and calorie tracking |
| `/profile` | `profile_page.vue` | User profile and settings |

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

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Components

### `navbar.vue`

Sidebar navigation component rendered globally in `App.vue`. Displays links to all main pages using Font Awesome icons. The active route is automatically highlighted via Vue Router's `router-link-active` class.

### `overviewCard.vue`

A stats overview card displayed on the homepage. Accepts a `stats` prop — an array of objects with the following shape:

```js
{
  label: String,   // e.g. 'Steps'
  value: String,   // e.g. '10,000'
  change: String,  // e.g. '+12.5%'
  arrow: String    // 'up' or 'down'
}
```

Positive trends render in green, negative trends render in red.

---

## State Management

Global state is managed with Pinia. Stores are located in `src/stores/`. To add a new store, create a new file in that directory and import it in the relevant component using `useYourStore()`.

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
