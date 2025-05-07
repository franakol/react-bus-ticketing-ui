# Bus Ticketing System

A modern bus ticketing system with a FastAPI backend and React frontend. This project allows users to browse bus routes, schedules, make bookings, and process payments.

## Project Structure

The project consists of two main parts:

1. **FastAPI Backend**: RESTful API for handling bus routes, schedules, bookings, and user authentication
2. **React Frontend**: Modern UI built with React, Tailwind CSS, and Axios for API communication

## Features

- User authentication (login/register)
- Browse bus routes and schedules
- Book tickets for specific schedules
- Manage bookings (view, cancel)
- Process payments
- Admin dashboard for managing buses, routes, and schedules

## Backend Setup

### Prerequisites

- Python 3.8+
- PostgreSQL
- pip

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd fastapi-project
```

2. Create and activate a virtual environment

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Set up environment variables (create a .env file)

```
DATABASE_URL=postgresql://username:password@localhost/bus_ticketing
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Run the application

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## Frontend Setup

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Navigate to the frontend directory

```bash
cd bus-ticketing-frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Creating a React Frontend from Scratch

If you want to create a similar React frontend from scratch, follow these steps:

1. **Initialize a new Vite project with React**

```bash
npm create vite@latest my-project -- --template react
cd my-project
npm install
```

2. **Install necessary dependencies**

```bash
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
```

3. **Set up Tailwind CSS**

Create a `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#8B5CF6',
        dark: '#1E293B',
        darker: '#0F172A',
        light: '#F1F5F9',
      },
    },
  },
  plugins: [],
}
```

Create a `postcss.config.js` file:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Update your `src/index.css` file with Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Create project structure**

```bash
mkdir -p src/components src/pages src/services src/context
```

5. **Set up API service with Axios**

Create `src/services/api.js` for API communication.

6. **Create React components and pages**

Build your components in the `src/components` directory and pages in the `src/pages` directory.

7. **Set up routing with React Router**

Configure routes in your main App component.

8. **Connect to the backend API**

Use the API service to connect your React frontend to the FastAPI backend.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
