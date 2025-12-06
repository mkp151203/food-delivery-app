# Food Delivery App 🍔

A full-stack serverless food delivery application built with React, Node.js, and AWS.

## 🚀 Live Demo
- **Frontend**: [https://d13ys9ydnenx7c.cloudfront.net](https://d13ys9ydnenx7c.cloudfront.net)
- **API Endpoint**: `https://gf3w1gt2sf.execute-api.us-east-1.amazonaws.com/prod`

## 🛠 Tech Stack

### Frontend
- **React** (Vite) - UI Framework
- **Lucide React** - Icons
- **Context API** - State Management (Auth & Cart)
- **CSS3** - Custom styling with responsive design

### Backend (Serverless)
- **Node.js** - Runtime
- **AWS Lambda** - Serverless Compute
- **Amazon API Gateway** - REST API Interface
- **Amazon DynamoDB** - NoSQL Database
- **Express.js** - Local development framework

### DevOps & Infrastructure
- **AWS SAM** (Serverless Application Model) - IaC for backend
- **AWS S3** - Static Website Hosting
- **Amazon CloudFront** - CDN & HTTPS
- **AWS CodePipeline** - CI/CD Automation
- **AWS CloudTrail** - Auditing & Logging
- **GitHub** - Source Control

## ✨ Key Features
- **Browse Restaurants**: View list of available restaurants.
- **View Menu**: Dynamic menu loading per restaurant.
- **Cart Management**: Add/remove items, real-time total calculation.
- **Order Placement**: Checkout flow with order confirmation.
- **Order Tracking**: Track status of placed orders.
- **Admin Dashboard**: Manage restaurants and menu items.
- **Authentication**: User login/signup (Demo accounts available).

## 📂 Project Structure
```
food-delivery/
├── backend/                # Serverless Backend
│   ├── src/
│   │   ├── handlers/       # Lambda Function Handlers
│   │   ├── services/       # Business Logic
│   │   ├── routes/         # Express Routes (Local)
│   │   └── utils/          # Helper functions
│   ├── template.yaml       # AWS SAM Template
│   └── seed.js             # Database Seeding Script
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Application Pages
│   │   ├── services/       # API Integration
│   │   └── context/        # Global State
│   └── buildspec.yml       # CI/CD Build Specification
```

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js (v18+)
- AWS CLI (Configured)
- AWS SAM CLI

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## ☁️ AWS Deployment Guide

This project follows a fully serverless architecture within the AWS Free Tier.

### 1. Backend Deployment (AWS SAM)
The backend uses AWS SAM to deploy Lambda, API Gateway, and DynamoDB.
```bash
cd backend
sam build
sam deploy --guided
```
**Resources Created:**
- 4 Lambda Functions (Restaurants, Menu, Orders, Users)
- 4 DynamoDB Tables
- 1 API Gateway

### 2. Frontend Deployment (S3 + CloudFront)
The frontend is hosted on S3 and distributed via CloudFront.

**Manual Deployment:**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://YOUR-BUCKET-NAME --delete
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

### 3. CI/CD Pipeline (Automated)
An AWS CodePipeline is configured to automatically deploy frontend changes from GitHub.

- **Source**: GitHub (`main` branch)
- **Build**: AWS CodeBuild (using `buildspec.yml`)
- **Deploy**: S3 Sync + CloudFront Invalidation

## 🔐 Credentials (Demo)
- **Admin**: `admin@fooddelivery.com`
- **User**: `demo@example.com`

---

