# NSKustoms Game Backend API Documentation

## Done until Notifications

**Base URL:** `/api/v1`

**Authentication:** All endpoints (except auth) require Bearer token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Become Seller](#become-seller)
4. [Boosting Posts](#boosting-posts)
5. [Offers](#offers)
6. [Orders](#orders)
7. [Notifications](#notifications)
8. [Ratings](#ratings)
9. [Conversations](#conversations)

---

## Authentication

### Register User

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phoneNumber": "+1234567890"
}
```

**Response:**

```json
{
  "code": 201,
  "status": "OK",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Verify Email

```
POST /auth/verify-email
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "code": 123456
}
```

---

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Forgot Password

```
POST /auth/forgot-password
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

---

### Reset Password

```
POST /auth/reset-password
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "code": 123456,
  "newPassword": "NewPassword123"
}
```

---

### Resend Verification

```
POST /auth/resend-verification
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

---

### Logout

```
POST /auth/logout
```

---

### Delete User

```
DELETE /auth/delete/:userId
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User ID to delete |

---

## Users

### Get Current User

```
GET /users/me
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "User details retrieved",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "user",
    "image": "https://example.com/avatar.png",
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Profile

```
PUT /users/me
```

**Request Body:**

```json
{
  "name": "John Updated",
  "phoneNumber": "+1234567899",
  "image": "https://example.com/new-avatar.png",
  "dateOfBirth": "1990-01-15",
  "description": "Gaming enthusiast"
}
```

---

### Change Password

```
POST /users/me/change-password
```

**Request Body:**

```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

---

### Search Users

```
GET /users/search
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (min 2 chars) |
| limit | number | No | Results limit (default: 10) |

**Example:** `GET /users/search?q=john&limit=5`

---

### Get All Users (Admin)

```
GET /users
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| role | string | No | Filter by role: user, admin, buyer, seller |
| search | string | No | Search by name or email |

**Example:** `GET /users?page=1&limit=10&role=seller`

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Users retrieved",
  "data": {
    "users": [...],
    "total": 100,
    "pages": 10
  }
}
```

---

### Get Public Profile

```
GET /users/profile/:id
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | User ID |

---

### Get User By ID (Admin)

```
GET /users/:id
```

---

### Update User Role (Admin)

```
PATCH /users/:id/role
```

**Request Body:**

```json
{
  "role": "seller"
}
```

---

### Upload Single File

```
POST /users/upload-single
```

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| image | file | Image file to upload |

---

### Upload Multiple Files

```
POST /users/upload-multiple
```

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| image | file[] | Up to 5 image files |

---

## Become Seller

### Submit Seller Application

```
POST /become-seller/apply
```

**Request Body:**

```json
{
  "sellerType": "individual",
  "sellingCategory": "boosting",
  "firstName": "John",
  "lastName": "Doe",
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "nationality": "American",
  "streetAddress": "123 Main St",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001",
  "frontId": "https://storage.example.com/front-id.jpg",
  "backId": "https://storage.example.com/back-id.jpg",
  "selfieWithId": "https://storage.example.com/selfie.jpg"
}
```

**Enums:**

- `sellerType`: `individual`, `company`
- `sellingCategory`: `boosting`

---

### Get My Application

```
GET /become-seller/my-application
```

---

### Update My Application

```
PUT /become-seller/my-application
```

**Request Body:** (All fields optional)

```json
{
  "firstName": "John Updated",
  "streetAddress": "456 New St"
}
```

---

### Delete My Application

```
DELETE /become-seller/my-application
```

---

### Get Pending Applications (Admin)

```
GET /become-seller/pending
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

---

### Get Approved Sellers (Admin)

```
GET /become-seller/approved
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

---

### Get Application By ID (Admin)

```
GET /become-seller/:id
```

---

### Approve/Reject Application (Admin)

```
POST /become-seller/approve
```

**Request Body:**

```json
{
  "sellerId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "isApproved": true
}
```

**For Rejection:**

```json
{
  "sellerId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "isApproved": false,
  "rejectionReason": "Invalid ID documents"
}
```

---

## Boosting Posts

### Create Boosting Post

```
POST /boosting-posts
```

**Request Body (Rank Boost):**

```json
{
  "boostingType": "rank_boost",
  "currentRank": {
    "currentRank": "Gold IV",
    "queue": "solo/duo",
    "currentLp": "45"
  },
  "desiredRank": {
    "desiredRank": "Platinum IV",
    "region": "NA"
  },
  "customizeOrder": {
    "solo": {
      "stream": true,
      "soloQueue": false,
      "offlineMode": true
    },
    "duo": false
  }
}
```

**Request Body (Placement Matches):**

```json
{
  "boostingType": "placement_matches",
  "placementMatches": {
    "previousRank": "Gold II",
    "region": "EUW",
    "queue": "solo/duo",
    "numberOfGames": 10
  },
  "customizeOrder": {
    "duo": true
  }
}
```

**Request Body (Net Wins):**

```json
{
  "boostingType": "net_wins",
  "netWins": {
    "currentRank": "Silver I",
    "region": "NA",
    "queue": "5v5_flex",
    "numberOfWins": 5
  }
}
```

**Request Body (Custom Request):**

```json
{
  "boostingType": "custom_request",
  "customRequest": {
    "gameType": "League of Legends",
    "requestDescription": "I need help with climbing out of Bronze. Looking for coaching + boosting combo."
  }
}
```

**Enums:**

- `boostingType`: `rank_boost`, `placement_matches`, `net_wins`, `custom_request`
- `queue`: `solo/duo`, `5v5_flex`

---

### Get All Boosting Posts

```
GET /boosting-posts
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| boostingType | string | No | Filter by type |
| region | string | No | Filter by region |
| isActive | boolean | No | Filter by active status (default: true) |

**Example:** `GET /boosting-posts?boostingType=rank_boost&region=NA&page=1`

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Boosting posts retrieved",
  "data": {
    "posts": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "userId": {
          "_id": "...",
          "name": "John Doe",
          "email": "john@example.com",
          "image": "..."
        },
        "boostingType": "rank_boost",
        "currentRank": {...},
        "desiredRank": {...},
        "isActive": true,
        "isCompleted": false,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 50,
    "pages": 5
  }
}
```

---

### Get My Boosting Posts

```
GET /boosting-posts/my-posts
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| isActive | boolean | No | Filter by active status |

---

### Get Boosting Post By ID

```
GET /boosting-posts/:id
```

---

### Update Boosting Post

```
PUT /boosting-posts/:id
```

**Request Body:** (Fields are optional)

```json
{
  "currentRank": {
    "currentRank": "Gold III",
    "currentLp": "60"
  },
  "isActive": false
}
```

---

### Delete Boosting Post

```
DELETE /boosting-posts/:id
```

---

### Mark Post as Completed

```
PATCH /boosting-posts/:id/complete
```

---

## Offers

### Create Offer (Seller)

```
POST /offers
```

**Request Body:**

```json
{
  "boostingPostId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "deliverTime": "3-5 days",
  "price": 50,
  "message": "I can help you reach your desired rank. I have 5 years of experience."
}
```

---

### Get My Offers (Seller)

```
GET /offers/my-offers
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| status | string | No | Filter: pending, accepted, declined |

---

### Get Offers for a Post (Buyer)

```
GET /offers/post/:postId
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| postId | string | Boosting Post ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| status | string | No | Filter by status |

---

### Get Offer By ID

```
GET /offers/:id
```

---

### Update Offer (Seller)

```
PUT /offers/:id
```

**Request Body:**

```json
{
  "deliverTime": "2-3 days",
  "price": 45,
  "message": "Updated offer with faster delivery"
}
```

---

### Respond to Offer (Buyer)

```
POST /offers/respond
```

**Request Body:**

```json
{
  "offerId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "status": "accepted"
}
```

**Enums:**

- `status`: `accepted`, `declined`

> **Note:** When an offer is accepted, all other pending offers for that post are automatically declined.

---

### Delete/Withdraw Offer (Seller)

```
DELETE /offers/:id
```

---

## Orders

### Create Order (Buyer)

```
POST /orders
```

**Request Body:**

```json
{
  "offerId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "gameUsername": "SummonerName123",
  "gamePassword": "securePassword"
}
```

> **Note:** Order can only be created after an offer is accepted. Platform charges 10% fee.

---

### Get My Orders as Buyer

```
GET /orders/my-orders/buyer
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| status | string | No | Filter by status |

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Orders retrieved",
  "data": {
    "orders": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "userId": "...",
        "sellerId": {...},
        "boostingPostId": {...},
        "gameUsername": "SummonerName123",
        "orderPrice": 50,
        "platformCharge": 5,
        "total": 55,
        "status": "paid",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 10,
    "pages": 1
  }
}
```

---

### Get My Orders as Seller

```
GET /orders/my-orders/seller
```

**Query Parameters:** Same as buyer orders.

---

### Get Order Stats

```
GET /orders/stats
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| role | string | No | `buyer` or `seller` (default: buyer) |

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Order stats retrieved",
  "data": {
    "total": 25,
    "completed": 20,
    "inProgress": 3,
    "unpaid": 2
  }
}
```

---

### Get All Orders (Admin)

```
GET /orders
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| status | string | No | Filter by status |

---

### Get Order By ID

```
GET /orders/:id
```

---

### Update Order Status

```
PATCH /orders/:id/status
```

**Request Body:**

```json
{
  "status": "paid"
}
```

**Enums:**

- `status`: `unpaid`, `paid`, `in_progress`, `completed`, `cancelled`

> **Note:** When status is set to `completed`, the associated boosting post is also marked as completed.

---

### Update Game Credentials (Buyer)

```
PATCH /orders/:id/credentials
```

**Request Body:**

```json
{
  "gameUsername": "NewUsername",
  "gamePassword": "NewPassword"
}
```

---

## Notifications

### Get My Notifications

```
GET /notifications
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| isRead | boolean | No | Filter by read status |
| type | string | No | Filter by notification type |

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Notifications retrieved",
  "data": {
    "notifications": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "userId": "...",
        "title": "New Offer Received",
        "message": "You have received a new offer on your boosting post",
        "type": "rank_boost",
        "price": 50,
        "isRead": false,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 15,
    "pages": 1,
    "unreadCount": 5
  }
}
```

---

### Get Unread Count

```
GET /notifications/unread-count
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Unread count retrieved",
  "data": {
    "unreadCount": 5
  }
}
```

---

### Get Notification By ID

```
GET /notifications/:id
```

---

### Mark Notifications as Read

```
POST /notifications/mark-read
```

**Request Body (Mark Specific):**

```json
{
  "notificationIds": ["64a1b2c3d4e5f6g7h8i9j0k1", "64a1b2c3d4e5f6g7h8i9j0k2"]
}
```

**Request Body (Mark All):**

```json
{
  "markAll": true
}
```

---

### Delete Notification

```
DELETE /notifications/:id
```

---

### Create Notification (Admin)

```
POST /notifications
```

**Request Body:**

```json
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "System Notification",
  "message": "Your account has been verified",
  "type": "rank_boost",
  "price": 0,
  "referenceId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "referenceType": "Order"
}
```

**Enums:**

- `type`: `rank_boost`, `placement_matches`, `net_wins`, `custom_request`
- `referenceType`: `BoostingPost`, `Offer`, `Order`

---

## Ratings

### Create Rating (Buyer)

```
POST /ratings
```

**Request Body:**

```json
{
  "orderId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "content": "Excellent service! Fast delivery and great communication throughout the process.",
  "rating": 5
}
```

> **Note:** Rating can only be created for completed orders. One rating per order.

---

### Get My Ratings

```
GET /ratings/my-ratings
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

---

### Get Rating By Order

```
GET /ratings/order/:orderId
```

---

### Get Ratings for a Seller

```
GET /ratings/seller/:sellerId
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| minRating | number | No | Minimum rating filter (1-5) |

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Seller ratings retrieved",
  "data": {
    "ratings": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "userId": {
          "name": "John Doe",
          "image": "..."
        },
        "content": "Great service!",
        "rating": 5,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 25,
    "pages": 3,
    "averageRating": 4.8
  }
}
```

---

### Get Seller Rating Stats

```
GET /ratings/seller/:sellerId/stats
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Seller rating stats retrieved",
  "data": {
    "averageRating": 4.8,
    "totalRatings": 150
  }
}
```

---

### Get Rating By ID

```
GET /ratings/:id
```

---

### Update Rating

```
PUT /ratings/:id
```

**Request Body:**

```json
{
  "content": "Updated review content",
  "rating": 4
}
```

---

### Delete Rating

```
DELETE /ratings/:id
```

---

## Conversations

### Create Conversation

```
POST /conversations
```

**Request Body:**

```json
{
  "receiverId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "type": "boosting",
  "referenceId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "initialMessage": "Hi, I'm interested in your boosting services."
}
```

**Enums:**

- `type`: `boosting`, `orders`, `support`

**Response:**

```json
{
  "code": 201,
  "status": "OK",
  "message": "Conversation created",
  "data": {
    "conversation": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "participants": ["...", "..."],
      "lastMessage": "Hi, I'm interested in your boosting services.",
      "lastMessageAt": "2024-01-15T10:30:00.000Z",
      "type": "boosting",
      "isActive": true
    },
    "message": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "conversationId": "...",
      "author": "...",
      "message": "Hi, I'm interested in your boosting services.",
      "isRead": false
    }
  }
}
```

---

### Get My Conversations

```
GET /conversations
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| type | string | No | Filter by type |

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Conversations retrieved",
  "data": {
    "conversations": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "participants": [
          {
            "_id": "...",
            "name": "John Doe",
            "email": "john@example.com",
            "image": "..."
          },
          {
            "_id": "...",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "image": "..."
          }
        ],
        "lastMessage": "Thanks for the update!",
        "lastMessageAt": "2024-01-15T10:30:00.000Z",
        "type": "boosting",
        "isActive": true
      }
    ],
    "total": 5,
    "pages": 1
  }
}
```

---

### Get Unread Message Count

```
GET /conversations/unread-count
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Unread count retrieved",
  "data": {
    "unreadCount": 12
  }
}
```

---

### Get/Check Conversation with User

```
GET /conversations/with/:userId
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | Conversation type |

---

### Get Conversation By ID

```
GET /conversations/:id
```

---

### Get Messages in Conversation

```
GET /conversations/:id/messages
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 50) |
| before | string | No | ISO date for cursor pagination |

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "Messages retrieved",
  "data": {
    "messages": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "conversationId": "...",
        "author": {
          "_id": "...",
          "name": "John Doe",
          "image": "..."
        },
        "message": "Hello!",
        "isRead": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 100,
    "pages": 2
  }
}
```

---

### Send Message

```
POST /conversations/:id/messages
```

**Request Body:**

```json
{
  "message": "Hello, how are you?",
  "attachments": [
    "https://storage.example.com/image1.jpg",
    "https://storage.example.com/image2.jpg"
  ]
}
```

---

### Mark Messages as Read

```
POST /conversations/:id/read
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "message": "5 message(s) marked as read",
  "data": {
    "count": 5
  }
}
```

---

### Archive Conversation

```
DELETE /conversations/:id
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Pagination

All list endpoints support pagination with consistent response format:

```json
{
  "data": {
    "items": [...],
    "total": 100,
    "pages": 10
  }
}
```

**Default Values:**

- `page`: 1
- `limit`: 10 (varies by endpoint)

---

## Enums Reference

### Roles

- `user` - Default role
- `admin` - Administrator
- `buyer` - Can create boosting posts and orders
- `seller` - Can make offers on posts

### Seller Types

- `individual`
- `company`

### Seller Categories

- `boosting`

### Boosting Types

- `rank_boost`
- `placement_matches`
- `net_wins`
- `custom_request`

### Queue Types

- `solo/duo`
- `5v5_flex`

### Offer Status

- `pending`
- `accepted`
- `declined`

### Order Status

- `unpaid`
- `paid`
- `in_progress`
- `completed`
- `cancelled`

### Notification Types

- `rank_boost`
- `placement_matches`
- `net_wins`
- `custom_request`

### Conversation Types

- `boosting`
- `orders`
- `support`
