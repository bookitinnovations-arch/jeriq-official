# Security Specification — Iyoo Cartel Fan Wall

## Data Invariants
1. `name` must be a string, 2-50 chars.
2. `message` must be a string, 2-500 chars.
3. `country` must be a 2-character ISO code.
4. `likes` must be an integer, starting at 0.
5. `createdAt` must be the server time of write.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to set `likes` to 1,000,000 on create. -> DENIED.
2. **Resource Poisoning**: Injection of 1MB string into `name`. -> DENIED.
3. **State Shortcutting**: Attempting to change `name` or `country` after creation. -> DENIED.
4. **Time Spoofing**: Sending a `createdAt` date from 1999. -> DENIED.
5. **Orphaned Write**: Creating a message with missing `country` code. -> DENIED.
6. **Shadow Field**: Adding `isVerified: true` to a message payload. -> DENIED.
7. **Negative Likes**: Updating `likes` to -1. -> DENIED.
8. **Bulk Update**: Attempting to update `likes` by +50 in one write. -> DENIED.
9. **Identity Erasure**: Setting `name` to null on update. -> DENIED.
10. **Admin Hijack**: Authenticated user trying to `delete` a document. -> DENIED.
11. **Malicious ID**: Creating a message with a 1KB junk-string ID. -> DENIED.
12. **Blanket Read**: Unauthenticated mass query without `limit`. -> DENIED (via standard Firestore security).

## Test Runner
Verified via security spec audit in Phase 5.
