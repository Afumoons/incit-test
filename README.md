# Authentication and User Management System

This project is a modern web application for user authentication and management, featuring Google and Facebook OAuth integration, built with React, TypeScript, Express, and Tailwind CSS.

## Features

- **User Registration and Login**
  - Standard email/password registration and login.
  - OAuth integration with Google and Facebook.

- **Profile Management**
  - Display user profile with email and name.
  - Allow users to change their name.
  - Allow users to change their password with validation rules:
    - At least 8 characters.
    - One lowercase letter.
    - One uppercase letter.
    - One digit.
    - One special character.

- **Dashboard**
  - Displays a list of all users with:
    - Timestamp of sign-up.
    - Number of logins.
    - Timestamp of last logout.
  - Shows statistics:
    - Total number of users.
    - Total number of active sessions today.
    - Average number of active session users in the last 7 days.

- **Session Management**
  - Using cookies for token storage.
  - Secure token handling.
  - Logout functionality.

## Technologies Used

- **Frontend:**
  - React
  - TypeScript
  - Axios
  - Tailwind CSS

- **Backend:**
  - Express
  - TypeScript
  - JWT for authentication
  - Sequelize ORM for database management

## Installation

### Prerequisites

- Node.js
- npm or yarn
- PostgreSQL (or your preferred SQL database)

### Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:
    ```plaintext
    JWT_SECRET=your_jwt_secret
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    NODE_ENV=development
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4. **Set up the database:**
    ```bash
    npx sequelize-cli db:migrate
    ```

5. **Start the backend server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Start the frontend development server:**
    ```bash
    cd client
    npm start
    # or
    yarn start
    ```

## Usage

- Open your browser and navigate to `http://localhost:3000` to access the application.
- Register a new user or log in using Google or Facebook OAuth.
- Manage your profile and change your password.
- Access the dashboard to view user statistics and details.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please reach out to afumoons@gmail.com(mailto:afumoons@gmail.com).

---

Happy coding!
