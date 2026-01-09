# Student-Teacher Booking Appointment System

A production-ready React web application for scheduling appointments between students and teachers.

## Features

- **Role-based Authentication**: Admin, Teacher, Student roles.
- **Admin Dashboard**: Manage users, approve students, view system logs.
- **Teacher Dashboard**: Manage appointments, view messages.
- **Student Dashboard**: Search teachers, book appointments, track status.
- **Real-time Logging**: All actions are logged to Firestore.
- **Secure**: Firestore rules protect data privacy.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router
- **Icons**: Lucide React

## Setup Instructions

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Firebase**:
    - Create a project in Firebase Console.
    - Enable Authentication (Email/Password).
    - Enable Firestore Database.
    - Copy your firebase config keys.
    - Open `src/services/firebase.js` and replace the placeholder config with your actual keys.
4.  **Run the application**:
    ```bash
    npm run dev
    ```
5.  **Deploy**:
    - Build the project: `npm run build`
    - Deploy to Firebase Hosting (requires firebase-tools):
        ```bash
        npm install -g firebase-tools
        firebase login
        firebase init
        firebase deploy
        ```

## Security Rules

Copy the contents of `firestore.rules` to your Firebase Console > Firestore > Rules.

## Architecture

- **/src/components**: Reusable UI components.
- **/src/pages**: Application pages (Dashboards, Login, Register).
- **/src/services**: Firebase service wrappers (Auth, Data, Logs).
- **/src/contexts**: Global state management (AuthContext).
- **/src/routes**: Route protection logic.

## Testing

Run tests with:
```bash
npm test
```
