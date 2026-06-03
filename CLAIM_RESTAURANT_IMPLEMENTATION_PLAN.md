# Claim Restaurant Implementation Plan

## 1) Current codebase state (what exists right now)

- The public claim page is UI-only and uses hardcoded dummy restaurants; no API call is made to backend restaurant data.
- Claim step-2/step-3/step-4 pages are also UI flows without backend persistence.
- Backend has:
  - restaurant ownership via `Restaurant.ownerId`
  - business-owner accounts in `ChefApplication` (`applicationType: "business_owner"`)
  - admin review workflow for chef/business-owner applications
- There is **no claim-request model or claim-review API** yet.
- Admin app currently manages `ChefApplication` statuses only.

---

## 2) Target behavior (from requirement)

1. User visits claim page and searches their business.
2. User selects restaurant and submits claim details.
3. Admin sees pending claim requests.
4. Admin approves/rejects.
5. On approval, that exact restaurant is assigned to that user (owner access for that restaurant).

---

## 3) Data model design (Backend: `Cheffington_Backend`)

### 3.1 Add new model: `models/RestaurantClaim.js`

Fields:
- `restaurantId` (ObjectId, ref `Restaurant`, required, indexed)
- `claimantId` (ObjectId, ref `ChefApplication`, nullable if guest claim)
- `claimantName` (required)
- `claimantEmail` (required, lowercase, indexed)
- `claimantPhone` (required)
- `relationshipToBusiness` (enum: owner | manager | authorized_representative | other)
- `jobTitle` (optional)
- `proofSummary` (required text)
- `proofDocumentUrls` (string[])
- `status` (enum: pending | approved | rejected, default pending, indexed)
- `adminNotes` (optional)
- `reviewedBy` (ObjectId, ref `Admin`)
- `reviewedAt` (Date)
- timestamps

Indexes:
- `{ restaurantId: 1, status: 1, createdAt: -1 }`
- `{ claimantEmail: 1, status: 1 }`

Guard rules:
- Prevent duplicate active pending claims by same email for same restaurant.

---

## 4) API design (Backend: `Cheffington_Backend`)

### 4.1 New routes file: `routes/restaurantClaims.js`

Mount in `server.js`:
- `app.use('/api/restaurant-claims', restaurantClaimRoutes);`

### 4.2 Endpoints

#### Public / owner-authenticated submit
- `POST /api/restaurant-claims`
- Body:
  - `restaurantId`
  - `claimantName`
  - `claimantEmail`
  - `claimantPhone`
  - `relationshipToBusiness`
  - `jobTitle?`
  - `proofSummary`
  - `proofDocumentUrls?`
- Behavior:
  - verify restaurant exists
  - reject if already published+owned and owner is different (or allow with warning based on policy)
  - save `pending` claim
  - optional: notify admin email

#### Admin listing
- `GET /api/restaurant-claims?status=pending&search=&page=&limit=`
- `protect` + role check for admin only
- include populated `restaurantId` minimal fields (`name`, `city`, `country`)

#### Admin detail
- `GET /api/restaurant-claims/:id`

#### Admin decision
- `PATCH /api/restaurant-claims/:id/status`
- Body: `{ status: 'approved' | 'rejected', adminNotes?: string }`
- On approve (transactional):
  1. Set claim status approved.
  2. Set all other pending claims for same restaurant to rejected (reason: already assigned).
  3. Assign `Restaurant.ownerId = claimantId` (or create/link owner account first if needed).
  4. Optionally set owner application status to approved when needed.
- On reject:
  - set claim rejected + notes.

---

## 5) Frontend implementation (`Cheffington`)

### 5.1 Step 1: `/claim-a-restaurant` (search/select real restaurants)

Replace dummy list with live API search:
- Call `GET /api/restaurants` and filter by typed name client-side (or add backend query param in future).
- Keep dropdown UX.
- On select + claim click, navigate with query:
  - `/claim-a-restaurant-2?restaurantId=<id>&restaurantName=<name>`

Files to update:
- `app/(main)/claim-a-restaurant/page.tsx`

### 5.2 Step 2: `/claim-a-restaurant-2` (real claim form submission)

Current form fields are not claim-specific; convert to:
- claimant full name
- email
- phone
- relationship to business
- job title (optional)
- proof summary text
- optional document URLs/upload

Submit to:
- `POST /api/restaurant-claims`

On success:
- route to `/claim-a-restaurant-3?claimId=<id>`

Files to update:
- `app/(main)/claim-a-restaurant-2/_components/ClaimRestaurantForm.tsx`

### 5.3 Step 3: `/claim-a-restaurant-3` (status/instructions)

Current OTP mock can be replaced with:
- “Application submitted”
- claim id + pending status
- expected review timeline
- support link

Files to update:
- `app/(main)/claim-a-restaurant-3/_components/CodeField.tsx`
- `app/(main)/claim-a-restaurant-3/_components/Hero.tsx`

### 5.4 Step 4: `/claim-a-restaurant-4`

Repurpose as confirmation / “Add listing if not found” branch, not required for core claim workflow.

---

## 6) Admin implementation (`Admin_Cheffington`)

Add claim-review module similar to existing application moderation:

### 6.1 Types
- Add `RestaurantClaim` type in `lib/types.ts`.

### 6.2 API client
- Add methods in `lib/api-client.ts`:
  - `getRestaurantClaims(filters)`
  - `getRestaurantClaim(id)`
  - `updateRestaurantClaimStatus(id, status, adminNotes?)`

### 6.3 UI
- New page/component for pending claims:
  - list table/cards
  - detail modal
  - approve/reject actions with admin notes

Suggested files:
- `app/claims/page.tsx` (or existing dashboard tab extension)
- `components/restaurant-claim-details-modal.tsx`

---

## 7) Business-owner portal impact (`Cheffington-admin-busniess-owner`)

No major UI rewrite required if ownership assignment is correct, because owner APIs already scope restaurants by `req.user.id`.

Validation step after approval:
- Owner logs in
- `GET /api/owner/restaurants` returns claimed restaurant

---

## 8) Exact implementation order (recommended)

1. **Backend model + routes + controller** for `restaurant-claims`.
2. **Admin API + list/review UI** in `Admin_Cheffington`.
3. **Public claim step-1 and step-2 wiring** in `Cheffington`.
4. Replace step-3/step-4 mock content with real status messaging.
5. End-to-end testing (submit → admin approve → owner sees restaurant).

---

## 9) Acceptance criteria

- User can search real restaurant names on claim page.
- User can submit a claim tied to one restaurant id.
- Admin can view pending claims and approve/reject with notes.
- Approval assigns ownership of that specific restaurant.
- Rejected claims remain visible with reason.
- Duplicate pending claims are blocked or handled deterministically.

---

## 10) Notes for minimal-risk rollout

- Keep existing business-owner application flow unchanged.
- Introduce claim flow as additive feature (new model + new endpoints).
- Add server-side validation first; UI can evolve safely afterward.
