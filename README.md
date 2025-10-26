
# Matenet API

A Node.js/Express backend for Matenet, providing authentication, user management, friend requests, points, and file upload features. Uses MongoDB, Google Cloud Secret Manager, and Google Cloud Storage.

## Features

- **User Authentication**: SIWE (Sign-In With Ethereum) and JWT-based authentication.
- **User Profiles**: Create, update, and retrieve user profiles.
- **Friend Requests**: Send, accept, and list friend requests (via wallet, referral code, or NFC).
- **Points System**: Track user interactions and award points.
- **Profile Picture Upload**: Upload and store user profile pictures in Google Cloud Storage.
- **Secure Secrets**: Uses Google Cloud Secret Manager for sensitive configuration.

## Project Structure

```
src/
	components/         # Business logic (e.g., interaction points)
	config/             # Express and environment configuration
	controllers/        # Route handlers for users, friends, auth, etc.
	helpers/            # Utility functions (crypto, secrets, upload, etc.)
	models/             # Mongoose models (User, FriendRequest, Interaction)
	routes/             # Express route definitions
	services/           # DB and storage service setup
index.js              # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- Google Cloud project with Secret Manager and Storage enabled

### Setup

1. **Clone the repository**

	 ```sh
	 git clone <repo-url>
	 cd matenet-api
	 ```

2. **Install dependencies**

	 ```sh
	 npm install
	 ```

3. **Configure environment variables**

	 - Copy `.env.example` to `.env` and fill in your secrets.
	 - Ensure your Google Cloud credentials are available (see [Google Auth Docs](https://cloud.google.com/docs/authentication/getting-started)).

4. **Run the server**

	 ```sh
	 npm start
	 ```

	 The API will run on `http://localhost:3000` by default.

### Docker

To run with Docker:

```sh
docker build -t matenet-api .
docker run -p 8080:8080 --env-file .env matenet-api
```

## API Endpoints

- **Auth**
	- `GET /api/auth/siwe/nonce` – Get SIWE nonce
	- `POST /api/auth/siwe/verify` – Verify SIWE message and get JWT

- **Users**
	- `GET /api/users/profile` – Get user profile (auth required)
	- `POST /api/users` – Create user
	- `PUT /api/users` – Update user profile (auth required)
	- `POST /api/users/profile-picture` – Upload profile picture (auth required)
	- `POST /api/users/register-nfc` – Register NFC ID (auth required)
	- `GET /api/users/points` – Get user points (auth required)

- **Friends**
	- `POST /api/friends/scan-nfc` – Send friend request via NFC (auth required)
	- `GET /api/friends/requests` – List incoming friend requests (auth required)
	- `POST /api/friends/requests` – Send friend request via wallet/referral (auth required)
	- `POST /api/friends/accept` – Accept friend request (auth required)

- **Healthcheck**
	- `GET /api/healthcheck` – Check API status

## Code Quality

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Prettier** and **ESLint** are configured.

## License

ISC

---

**Note:** This project uses Google Cloud services for secrets and file storage. Make sure your environment is properly configured with the necessary permissions.
