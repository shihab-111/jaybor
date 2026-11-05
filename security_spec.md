# Jaybor Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All**: All paths not explicitly matched (`/outfits/{outfitId}`, `/orders/{orderId}`, `/admins/{adminId}`) deny all reads and writes.
2. **Identity & Verification Invariant**: Every write operation requires an authenticated user with `request.auth != null && request.auth.token.email_verified == true`.
3. **Admin Privilege Invariant**: Only a verified admin (`shihabahmmed700@gmail.com` with `email_verified == true`, or a user whose UID exists in `/admins/$(request.auth.uid)`) may create, update, or delete `/outfits/{outfitId}`, or update fulfillment status on `/orders/{orderId}`.
4. **PII Isolation Invariant**: `/orders/{orderId}` contains customer PII (`phone`, `address`, `customerName`). Reading (`get` or `list`) is strictly restricted to the order owner (`resource.data.customerUid == request.auth.uid`) or a verified admin (`isAdmin()`).
5. **Terminal State Lock Invariant**: Once an order in `/orders/{orderId}` reaches `status == 'Delivered'`, non-admin users cannot mutate it.
6. **Temporal & Key Integrity**: `createdAt` and `updatedAt` must match `request.time`. Updates must use `incoming().diff(existing()).affectedKeys().hasOnly(...)` and validate with `isValidOutfit(incoming())` or `isValidOrder(incoming())`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Outfit Create**: Adding `"isFeaturedHack": true` to `/outfits/kurti-1` -> Rejected by `hasOnly`.
2. **Unverified Admin Email Spoof**: User with `email == "shihabahmmed700@gmail.com"` but `email_verified == false` attempting to create an outfit -> Rejected by `isVerifiedUser()`.
3. **Identity Spoofing on Order Create**: Authenticated user setting `customerUid` to another user's UID -> Rejected by `data.customerUid == request.auth.uid`.
4. **ID Poisoning Attack**: Creating `/orders/invalid$id!with*spaces` or >128 chars -> Rejected by `isValidId(orderId)`.
5. **Denial-of-Wallet String Overflow**: Sending a 50,000-character `address` in `/orders/ord-1` -> Rejected by `data.address.size() <= 300`.
6. **Unbounded Array Injection**: Sending 50 elements in `itemSummaryList` on `/orders/ord-1` -> Rejected by `data.itemSummaryList.size() <= 10`.
7. **PII Blanket Read / Scrape**: Signed-in user attempting to `get` or `list` `/orders` belonging to another `customerUid` -> Rejected by `resource.data.customerUid == request.auth.uid || isAdmin()`.
8. **Value Poisoning on Order Update**: Updating `status` on `/orders/ord-1` to `"HackedStatus"` -> Rejected by `isValidOrder(incoming())` enum check.
9. **Terminal State Reversal**: Non-admin attempting to update an order after `existing().status == 'Delivered'` -> Rejected by terminal state lock.
10. **Immutable Field Mutation**: Attempting to change `createdAt` or `customerUid` during an order update -> Rejected by immutability guard.
11. **Client Timestamp Forgery**: Creating an order with a past or future `createdAt != request.time` -> Rejected by `incoming().createdAt == request.time`.
12. **Privilege Escalation on `/admins`**: Regular user attempting to create `/admins/{theirUid}` -> Rejected because `/admins` writes are locked to `false`.
