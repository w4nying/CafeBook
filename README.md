# CafeBook

CafeBook is a cafe-hopping wishlist web application that lets cafe hoppers keep track of cafes they want to visit. They can manage cafe details, search for cafes, and filter and sort the list to find their next cafe destination.

**Live demo:** https://cafebook-web.onrender.com/
> Running on Render's free tier and sleeps when idle, so first load can take up to 30-60s.
> Cafes added on live demo are stored in a JSON file and reset whenever the server restarts/ redeploys.

## Requirements✅
1. On a page, display JSON data in a table
2. On the same page, create an 'Add Item' button that opens a form to allow users to enter data
3. Ensure the form fields have validation
4. Upon submitting, the data in the form should be added to the table in (1)
5. On the same page, have a button that can switch the table in (1) from light mode to dark mode and vice versa. Ensure that the mode is cached i.e. the dark mode stays the same after closing the broswer and re-launching the application again.

## Features

- **Cafe Management** – Add and manage cafe information.
- **Search** – Search cafes by name, country, or address.
- **Filter** – Filter cafes by country, price range, and minimum rating.
- **Sorting** – Sort cafe records by clicking table column headings.
- **Pagination** – Display up to 10 cafes per page.
- **Dark Mode** – Switch between light and dark themes.
- **Google Maps Link** – Open cafe addresses in Google Maps.
- **Responsive Layout** – Browse cafes on different screen sizes.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- CORS

**Data Storage**
- JSON file (`src/data/cafes.json`)

**External API**
- [countries.dev](https://countries.dev/) for list of countries in form

**Hosting**
- Render (Static Site for the frontend, Web Service for the backend)

## API Endpoints
Base URL (production): `https://cafebook-api.onrender.com`

'name', 'country', 'address', 'priceRange' field are required.

## Project Skeleton

```text
CafeBook/
├── public/
├── server.cjs
├── src/
│   ├── components/
│   │   └── ToggleSwitch.tsx
│   ├── data/
│   │   └── cafes.json
│   ├── types/
│   │   ├── cafe.ts
│   │   └── country.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/w4nying/CafeBook.git
   ```

2. Navigate to the project directory:

   ```bash
   cd CafeBook
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the frontend and backend:

   ```bash
   npm run dev:all
   ```

5. Open the local URL displayed in your terminal:
  Frontend:
   ```bash
  http://localhost:5173

   ```

## Usage

1. Launch CafeBook in your browser.
2. Browse the cafe list.
3. Add cafes and their details.
4. Use the search bar to find cafes by name, country, or address.
5. Apply filters to narrow down cafes by country, price range, or rating.
6. Click table headings to sort cafe records.
7. Use pagination to navigate through the cafe list.
8. Toggle dark mode for a different viewing experience.
9. Open a cafe's address in Google Maps to explore its location.


## Author

Created by **HUANG WAN YING**.
