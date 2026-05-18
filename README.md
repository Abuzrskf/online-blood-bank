# 🩸 Online Blood Bank

A full-stack web application for managing blood donors, emergency requests, and live blood stock — built with HTML/JS on the frontend and Node.js + MongoDB on the backend, deployed on Vercel and Render.

🔗 **Live App:** [online-blood-bank-six.vercel.app](https://online-blood-bank-six.vercel.app)

---

## Features

- **Donor Registration** — Register donors with name, blood group, phone, and city
- **Emergency Requests** — Post urgent blood requests with patient and hospital details
- **Live Blood Stock** — Real-time inventory display showing available units per blood group
- **Admin Dashboard** — Password-protected panel to manage donors and requests
- **Fulfill Requests** — Mark a request as complete, automatically removing it and deducting 1 unit from stock

---

## Project Structure

```
online-blood-bank/
├── client/
│   ├── index.html        # Public-facing page (donor registration + requests)
│   └── admin.html        # Admin dashboard (protected)
└── server/
    └── index.js          # Node.js + Express REST API
```

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML, CSS, Vanilla JavaScript     |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB (via Mongoose)            |
| Hosting   | Vercel (frontend), Render (API)   |

---

## API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/api/inventory`     | Get blood stock (count per group)  |
| POST   | `/api/register`      | Register a new donor               |
| GET    | `/api/admin/data`    | Get all donors and requests        |
| DELETE | `/api/donors/:id`    | Delete a donor record              |
| POST   | `/api/requests`      | Post an emergency request          |
| DELETE | `/api/requests/:id`  | Delete/fulfill a request           |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/Abuzrskf/online-blood-bank.git
cd online-blood-bank

# Install server dependencies
cd server
npm install

# Add your MongoDB connection string
# Create a .env file in /server:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000

# Start the server
node index.js
```

Then open `client/index.html` in your browser, or serve the `client/` folder with any static file server.

---

## Admin Access

Navigate to `/admin.html` and enter the admin password.

> ⚠️ The password is currently stored in the frontend. For production, move authentication to the server with hashed passwords.

---

## How Fulfill Works

Blood stock is derived from the donor count per blood group. When a request is fulfilled:

1. The request record is deleted from the database
2. One donor of the matching blood group is removed, reducing the stock count by 1

---

## Deployment

- **Frontend** — push to `main` branch; Vercel auto-deploys
- **Backend** — hosted on Render; update via push or manual redeploy

---

## License

MIT
