# Stripe Payment Integration

This module handles Stripe payment processing for the application service.

## API Endpoints

### Create Checkout Session
- **POST** `/api/stripe/create-checkout-session`
- Creates a new Stripe checkout session for payment processing
- **Request Body:**
  ```json
  {
    "price": 19.99,
    "title": "Job Application Premium Service",
    "metadata": {
      "job_id": "job123",
      "user_id": "user123"
    }
  }
  ```
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "Checkout session created successfully",
    "data": {
      "sessionId": "cs_test_...",
      "checkoutUrl": "https://checkout.stripe.com/pay/..."
    }
  }
  ```

### Get Payment Details
- **GET** `/api/stripe/payment-details/:sessionId`
- Retrieves payment details for a specific session ID
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "Payment details retrieved successfully",
    "data": {
      "sessionId": "cs_test_...",
      "status": "paid",
      "paymentIntent": "pi_...",
      "amountTotal": 19.99,
      "currency": "usd",
      "customerEmail": "customer@example.com",
      "metadata": {},
      "completed": true
    }
  }
  ```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (optional for basic functionality)

## Success and Cancel URLs

- Success URL: `http://localhost:3000/applied-successfully?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `http://localhost:3000/cancel`