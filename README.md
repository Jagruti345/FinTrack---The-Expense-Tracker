# 💰 Expense Tracker

A modern and responsive Expense Tracker web application that helps users manage their daily income and expenses efficiently. The project is automatically deployed to an AWS EC2 instance using GitHub Actions (CI/CD) and served through Nginx.

---

## 📌 Project Overview

Expense Tracker is a frontend web application that enables users to:

- ➕ Add income and expense transactions
- 📊 View current balance
- 💸 Track total income and expenses
- 📝 View complete transaction history
- 🗑️ Delete transactions
- 💾 Store data locally in the browser
- 📱 Responsive design for desktop and mobile devices

This project also demonstrates an automated deployment pipeline using **GitHub Actions**, **AWS EC2**, and **Nginx**.

---

# 🚀 Live Deployment Architecture

```
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions (CI/CD)
    │
    ▼
SSH Authentication
    │
    ▼
AWS EC2 Ubuntu Instance
    │
    ▼
Git Pull
    │
    ▼
Nginx Reload
    │
    ▼
Updated Live Website
```

---

# ✨ Features

- Add Income
- Add Expense
- Delete Transactions
- Balance Calculation
- Income Summary
- Expense Summary
- Transaction History
- Responsive UI
- Local Storage Support
- Automatic EC2 Deployment
- GitHub Actions CI/CD

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Cloud

- Amazon EC2
- Nginx
- GitHub Actions
- Git
- SSH

---

# 📁 Project Structure

```
Expense-Tracker
│
├── index.html
├── style.css
├── script.js
├── assets
│
├── images
│
├── README.md
│
└── .github
    └── workflows
        └── deploy.yml
```

---

# ⚙️ AWS Services Used

## Amazon EC2

- Hosts the Expense Tracker website.
- Runs Ubuntu Server.
- Provides a public IP for accessing the website.

---

## Nginx

- Serves static files.
- Acts as the web server.
- Automatically reloads after deployment.

---

## GitHub

- Stores project source code.
- Version control system.
- Trigger point for deployment.

---

## GitHub Actions

Automates deployment whenever code is pushed to GitHub.

Workflow:

```
git push
      ↓
GitHub Actions
      ↓
SSH Login
      ↓
EC2 Instance
      ↓
git fetch
git reset
      ↓
Reload Nginx
```

---

# 🔐 GitHub Secrets

The following secrets are configured in GitHub.

| Secret | Description |
|----------|-------------|
| HOST | EC2 Public IP |
| USERNAME | ubuntu |
| KEY | SSH Private Key |

---

# 🚀 Deployment Process

Whenever new code is pushed:

1. Developer pushes code to GitHub.

```
git add .
git commit -m "Updated UI"
git push
```

2. GitHub Actions starts automatically.

3. SSH connects to EC2.

4. Latest code is pulled.

```
git fetch origin main
git reset --hard origin/main
```

5. Nginx reloads.

```
sudo systemctl reload nginx
```

6. Updated website becomes live.

---

# 📦 Installation

Clone repository

```
git clone https://github.com/YourUsername/Expense-Tracker.git
```

Move into project

```
cd Expense-Tracker
```

Open

```
index.html
```

or

Run using VS Code Live Server.

---

# 🌐 Deploy on EC2

Clone repository

```
cd /var/www

git clone https://github.com/YourUsername/Expense-Tracker.git expense-tracker
```

Configure Nginx

```
root /var/www/expense-tracker;
```

Restart Nginx

```
sudo systemctl reload nginx
```

---

# 🔄 CI/CD Workflow

```
Developer
      │
      ▼
Git Commit
      │
      ▼
Git Push
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
      ▼
SSH
      │
      ▼
AWS EC2
      │
      ▼
Git Pull
      │
      ▼
Nginx Reload
      │
      ▼
Live Website
```

---

# 📸 Screenshots

Add screenshots here.

Example:

```
images/homepage.png
images/dashboard.png
images/mobile.png
```

---

# 📈 Future Improvements

- User Authentication
- Cloud Database
- Monthly Reports
- Charts & Analytics
- Export to PDF
- CSV Download
- Multi-user Support
- Dark Mode
- AWS S3 Backup
- AWS CloudFront Integration

---

# 👩‍💻 Author

**Jagruti Patil**

Computer Engineering Student

Frontend & Cloud Developer

---

# 📜 License

This project is created for educational and learning purposes.