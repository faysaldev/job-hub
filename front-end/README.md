# JobHub — Full-Stack Recruitment Platform

> Next.js 16 + Express.js + MongoDB + Socket.IO

**Base URL:** `http://localhost:5050/api/v1`
**Socket URL:** `ws://localhost:6100`
**Brand:** Primary `#234C6A` · Secondary `#456882` · Surface `#E3E3E3`
**Roles:** `seeker` | `recruiter` | `admin`

---

## Database Schemas (MongoDB)

### User

```ts
{
  _id: ObjectId,
  name: string,              // min 3 chars
  email: string,             // unique, lowercase
  password: string,          // min 8, must have letter+number, bcrypt hashed
  image: string,             // default avatar URL
  role: "seeker" | "recruiter" | "admin",
  phoneNumber: string,       // unique, min 10 chars
  oneTimeCode: number | null,
  isEmailVerified: boolean,
  isResetPassword: boolean,
  fcmToken: string | null,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Seeker (Job Seeker Profile)

```ts
{
  _id: ObjectId,
  userId: ObjectId → User,   // unique per user
  userLocation: string,
  designation: string,
  aboutMe: string,
  skills: string[],
  workExperiences: [{
    position: string,
    durationFrom: string,
    durationTo: string,
    companyName: string,
    responsibilities: string[]
  }],
  educations: [{
    school: string,
    degree: string,
    year: string
  }],
  resume: {
    resumeName: string,
    resumeLink: string
  },
  portfolio: string,
  socialProfiles: {
    linkedin: string,
    github: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Company (Recruiter Profile)

```ts
{
  _id: ObjectId,
  userId: ObjectId → User,   // unique per user
  companyLogo: string,
  companyName: string,        // required
  industries: string,
  companySize: string,
  companyLocation: string,
  website: string,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Job

```ts
{
  _id: ObjectId,
  author: ObjectId → User,                    // recruiter who created
  title: string,
  category: string,
  subcategory: string,
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance",
  location: string,
  locationType: "remote" | "onsite" | "hybrid",
  salaryMin: number,                           // min 0
  salaryMax: number,                           // min 0, >= salaryMin
  salaryPeriod: "hourly" | "daily" | "weekly" | "monthly" | "yearly",
  experienceLevel: "junior" | "mid" | "senior" | "lead",
  description: string,
  requirements: string[],                      // min 1
  responsibilities: string[],
  benefits: string[],
  skills: string[],                            // min 1
  applicationDeadline: Date,
  positions: number,                           // min 1
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Application

```ts
{
  _id: ObjectId,
  applicant: ObjectId → User,
  job_id: ObjectId → Job,
  cover_letter: string,       // min 30 chars
  resume_url: string,         // required
  status: "applied" | "under_review" | "interview" | "rejected" | "hired",
  paid_amount: number,        // Stripe payment for boost
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation

```ts
{
  _id: ObjectId,
  participants: [ObjectId, ObjectId],  // exactly 2 users
  lastMessage: ObjectId → Message,
  lastMessageAt: Date,
  user1UnreadCount: number,
  user2UnreadCount: number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: participants, lastMessageAt desc, updatedAt desc
```

### Message

```ts
{
  _id: ObjectId,
  conversationId: ObjectId → Conversation,
  senderId: ObjectId → User,
  receiverId: ObjectId → User,
  content: string,
  isRead: boolean,
  createdAt: Date,
  updatedAt: Date
}
// Index: conversationId + createdAt desc
```

### SavedJob

```ts
{
  _id: ObjectId,
  userId: ObjectId → User,
  jobId: ObjectId → Job,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification

```ts
{
  _id: ObjectId,
  title: string,
  link: string,
  sender: ObjectId → User,
  receiver: ObjectId → User,
  isRead: boolean,
  isDeleted: boolean,         // soft delete
  createdAt: Date,
  updatedAt: Date
}
// Indexes: receiver+createdAt, receiver+isRead, receiver+isDeleted
```

---

## Response Format

All responses follow this envelope:

```json
{
  "code": 200,
  "status": "success",
  "message": "Description",
  "data": { }
}
```

**Auth Header:** `Authorization: Bearer <jwt_token>`

---

## REST API Endpoints

### 1. Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | ❌ | `{ name, email, password, phoneNumber, role }` | Register user, sends OTP |
| POST | `/verify-email` | ❌ | `{ email, code }` | Verify email with 6-digit OTP |
| POST | `/login` | ❌ | `{ email, password, fcmToken? }` | Login, returns JWT + user |
| POST | `/forgot-password` | ❌ | `{ email }` | Send reset code to email |
| POST | `/reset-password` | ❌ | `{ email, code, newPassword }` | Reset password with code |
| POST | `/resend-verification` | ❌ | `{ email }` | Resend OTP code |
| POST | `/logout` | ❌ | — | Logout |
| DELETE | `/delete/:userId` | ❌ | — | Delete user account |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1",
  "phoneNumber": "+1234567890",
  "role": "seeker"
}
```

**Login Response:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbG...",
    "user": {
      "_id": "665abc...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "seeker",
      "image": "https://...",
      "phoneNumber": "+1234567890",
      "isEmailVerified": true
    }
  }
}
```

### 2. Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/self/in` | 🔒 | Get current user details |
| PATCH | `/update` | 🔒 | Update profile (multipart: `image` field) |
| PATCH | `/change-password` | 🔒 | `{ currentPassword, newPassword }` |
| DELETE | `/delete-profile` | 🔒 | `{ password }` to confirm deletion |

### 3. Job Seekers — `/api/v1/job-seekers`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 Seeker | Create seeker profile |
| GET | `/` | 🔒 Seeker | Get own seeker profile |
| GET | `/all` | 🔒 | Get all seekers (for recruiter browsing) |
| PUT | `/` | 🔒 Seeker | Update seeker profile |

**Create/Update Seeker Body:**
```json
{
  "userLocation": "San Francisco, CA",
  "designation": "Senior Frontend Developer",
  "aboutMe": "Passionate developer...",
  "skills": ["React", "TypeScript", "Node.js"],
  "workExperiences": [{
    "position": "Frontend Developer",
    "durationFrom": "2022-01",
    "durationTo": "Present",
    "companyName": "TechCorp",
    "responsibilities": ["Built React apps", "Led team of 4"]
  }],
  "educations": [{
    "school": "MIT",
    "degree": "BSc Computer Science",
    "year": "2022"
  }],
  "resume": {
    "resumeName": "john_doe_resume.pdf",
    "resumeLink": "https://cdn.jobhub.com/resumes/john.pdf"
  },
  "portfolio": "https://johndoe.dev",
  "socialProfiles": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  }
}
```

### 4. Companies — `/api/v1/recruiter-company`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 Recruiter | Create company (multipart: `companyLogo`) |
| GET | `/` | 🔒 Recruiter | Get own company |
| GET | `/all` | 🔒 | Get all companies |
| PUT | `/` | 🔒 Recruiter | Update company (multipart: `companyLogo`) |

**Create/Update Company Body:**
```json
{
  "companyName": "TechCorp Inc.",
  "industries": "Information Technology",
  "companySize": "51-200",
  "companyLocation": "San Francisco, CA",
  "website": "https://techcorp.com",
  "description": "We build great software..."
}
```

### 5. Jobs — `/api/v1/job`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all jobs (with filters) |
| GET | `/search` | ❌ | Search jobs (same filters) |
| GET | `/:jobId` | ❌ | Get single job by ID |
| POST | `/` | 🔒 Recruiter | Create new job |
| PUT | `/:jobId` | 🔒 Recruiter | Update job |
| DELETE | `/:jobId` | 🔒 Recruiter | Delete job |

**Query Params (GET / & /search):**
```
q, category, subcategory, type, location, locationType,
experienceLevel, minSalary, maxSalary, page (default 1), limit (default 10, max 100)
```

**Create Job Body:**
```json
{
  "title": "Senior Frontend Developer",
  "category": "engineering",
  "subcategory": "frontend",
  "type": "full-time",
  "location": "San Francisco, CA",
  "locationType": "hybrid",
  "salaryMin": "120000",
  "salaryMax": "180000",
  "salaryPeriod": "yearly",
  "experienceLevel": "senior",
  "description": "We are looking for...",
  "requirements": ["5+ years React", "TypeScript expert"],
  "responsibilities": ["Build UI components", "Code reviews"],
  "benefits": ["Health insurance", "Remote flexibility"],
  "skills": ["React", "TypeScript", "Next.js"],
  "applicationDeadline": "2025-12-31",
  "positions": "3"
}
```

### 6. Applications — `/api/v1/applications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 Seeker | Apply to a job |
| GET | `/` | 🔒 | Get user's applications |
| PUT | `/:applicationId/status` | 🔒 Recruiter | Update application status |
| DELETE | `/:applicationId` | 🔒 | Withdraw/delete application |

**Apply Body:**
```json
{
  "job_id": "665abc123...",
  "cover_letter": "I am excited to apply for this position...",
  "resume_url": "https://cdn.jobhub.com/resumes/john.pdf"
}
```

**Update Status Body:**
```json
{
  "status": "interview"
}
```

### 7. Saved Jobs — `/api/v1/saved-jobs`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 Seeker | Save a job `{ jobId }` |
| GET | `/` | 🔒 Seeker | Get saved jobs (populated) |
| DELETE | `/:jobId` | 🔒 Seeker | Remove saved job |

### 8. Conversations — `/api/v1/conversations`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 | Create conversation `{ receiverId }` |
| GET | `/` | 🔒 | Get user's conversations (populated) |
| DELETE | `/:conversationId` | 🔒 | Delete conversation |

### 9. Messages — `/api/v1/messages`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 | Send message `{ conversationId, receiverId, content }` |
| GET | `/conversation/:conversationId` | 🔒 | Get all messages in conversation |
| PUT | `/:messageId` | 🔒 | Edit message `{ content }` |
| DELETE | `/:messageId` | 🔒 | Delete message |
| PATCH | `/:messageId/read` | 🔒 | Mark message as read |

### 10. Notifications — `/api/v1/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 | Get all notifications |
| GET | `/unread` | 🔒 | Get unread notifications |
| GET | `/unread/count` | 🔒 | Get unread count `{ count: 5 }` |
| POST | `/` | 🔒 | Create notification `{ title, link, receiver }` |
| PATCH | `/:id/read` | 🔒 | Mark one as read |
| PATCH | `/read-all` | 🔒 | Mark all as read |
| DELETE | `/:id` | 🔒 | Soft delete notification |

### 11. Stripe Payments — `/api/v1/stripe`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-checkout-session` | 🔒 | Create Stripe checkout for application boost |
| GET | `/payment-details/:sessionId` | 🔒 | Get payment details by session |

---

## Socket.IO Events

**Connection:** `ws://localhost:6100`

```ts
import { io } from "socket.io-client";

const socket = io("ws://localhost:6100", {
  transports: ["websocket"],
  reconnection: true,
});
```

### Room Management

```
CLIENT → SERVER: joinRoom
  payload: roomId (string)
  // User joins a room (conversation, job updates, etc.)

CLIENT → SERVER: sendToRoom
  payload: (roomId, message)
  // Send message to specific room
```

### Messaging (Real-time Chat)

```
CLIENT → SERVER: message
  payload: {
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string
  }

SERVER → CLIENT: message
  payload: {
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt: string
  }

// Typing indicators
CLIENT → SERVER: typing:start
  payload: { conversationId, userId }

SERVER → CLIENT: typing:update
  payload: { conversationId, userId, isTyping: boolean }

CLIENT → SERVER: typing:stop
  payload: { conversationId, userId }

// Read receipts
CLIENT → SERVER: message:read
  payload: { conversationId, messageId }

SERVER → CLIENT: message:read_receipt
  payload: { conversationId, readBy, messageId }
```

### Notifications (Real-time Push)

```
SERVER → CLIENT: notification:new
  payload: {
    _id: string,
    title: string,
    link: string,
    sender: string,
    receiver: string,
    createdAt: string
  }

SERVER → CLIENT: notification:unread_count
  payload: { count: number }

CLIENT → SERVER: notification:mark_read
  payload: { notificationId: string }
```

### Job Updates (Live Application Count)

```
CLIENT → SERVER: job:subscribe
  payload: { jobId: string }

SERVER → CLIENT: job:application_count
  payload: { jobId: string, count: number }

CLIENT → SERVER: job:unsubscribe
  payload: { jobId: string }
```

### Presence / Online Status

```
SERVER → CLIENT: user:online
  payload: { userId: string }

SERVER → CLIENT: user:offline
  payload: { userId: string }

// Connection lifecycle
SERVER → CLIENT: connect     // auto on connect
SERVER → CLIENT: disconnect  // auto on disconnect
```

### Room Strategy

| Room Pattern | Members | Purpose |
|-------------|---------|---------|
| `user:<userId>` | Single user | Personal notifications |
| `conversation:<convId>` | 2 participants | Chat messages |
| `job:<jobId>` | Interested users | Live application counts |

---

## Frontend Types (TypeScript)

All types are in `src/types/index.ts`. Key mappings to backend:

| Frontend Type | Backend Model | Notes |
|--------------|---------------|-------|
| `AuthUser` | `User` | role: `seeker`/`recruiter`/`admin` |
| `JobSeekerProfile` | `Seeker` | Nested workExperiences, educations |
| `CompanyProfile` | `Company` | companyLogo via Cloudinary upload |
| `Job` | `Job` | author = recruiterId |
| `Application` | `Application` | applicant = jobSeekerId |
| `Conversation` | `Conversation` | participants array of 2 |
| `Message` | `Message` | conversationId links to Conversation |
| `Notification` | `Notification` | sender/receiver are User refs |
| `SavedJob` | `SavedJob` | userId + jobId compound |

---

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / Invalid token |
| 401 | Unauthorized (missing token) |
| 404 | Not found |
| 409 | Conflict (duplicate email/phone) |
| 422 | Validation error |
| 500 | Server error |

---

## Environment Variables

### Backend (`.env`)
```env
PORT=5050
SOCKET_PORT=6100
MONGODB_URI=mongodb://localhost:27017/jobhub
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
STRIPE_SECRET_KEY=sk_test_xxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=xxx
SMTP_PASS=xxx
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5050
NEXT_PUBLIC_SOCKET_URL=ws://localhost:6100
```

---

## Running Locally

```bash
# Backend
cd backends && pnpm install && pnpm run dev

# Frontend
cd front-end && pnpm install && pnpm run dev
```

Backend: `http://localhost:5050` | Frontend: `http://localhost:3000`
