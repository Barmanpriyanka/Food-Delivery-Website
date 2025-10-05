# Fix Payment Redirect to Thank You Page

## Problem
After successful payment, the app redirects to `http://localhost:5173/verify?success=true&orderId=...` which causes "localhost refused to connect" error because the app is deployed, not running locally.

## Root Cause
- Backend's `placeOrder` function was using incorrect frontend URL for Stripe success/cancel redirects.
- Frontend was calling incorrect backend URL for API requests.

## Changes Made
- [x] Updated `backend/controllers/orderControllers.js`: Changed default `frontend_url` to `https://food-delivery-frontendd-zpfd.onrender.com`
- [x] Updated `frontend/src/context/StoreContext.jsx`: Changed `url` to `https://food-delivery-backend-wlo9.onrender.com`

## Next Steps
- [ ] Commit and push the changes to your git repository
- [ ] Redeploy the backend on Render (https://food-delivery-backend-wlo9.onrender.com)
- [ ] Redeploy the frontend on Render (https://food-delivery-frontendd-zpfd.onrender.com)
- [ ] Test the payment flow:
  1. Place an order and proceed to payment
  2. Complete payment on Stripe
  3. Verify it redirects to the deployed frontend's verify page
  4. Confirm it shows the Thank You page after verification
- [ ] If issues persist, check Render deployment logs for errors
