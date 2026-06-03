# Restaurants Tab Missing Features - Exact Implementation Plan

## Scope requested

Implement in Admin Restaurants tab:

1. City-only filter (separate)
2. Claimed/unclaimed filter
3. Status controls (publish/unpublish/archive actions)
4. Claim info column
5. Quick action buttons
   - View details
   - Open public page
   - Reassign owner
   - Archive restaurant

This plan is based on current code state in:
- `Cheffington_Backend/controllers/adminRestaurantController.js`
- `Cheffington_Backend/routes/adminRestaurants.js`
- `Admin_Cheffington/components/restaurants-dashboard.tsx`
- `Admin_Cheffington/lib/api-client.ts`
- `Cheffington_Backend/models/RestaurantClaim.js`

---

## Current gaps (confirmed)

- Restaurants API currently supports only:
  - `status` filter (`draft|published|archived`)
  - text `search`
- No claim metadata is returned per restaurant.
- No route for admin status update.
- No route for admin owner reassignment.
- Frontend table has no claim info column and no action buttons.

---

## Backend changes (`Cheffington_Backend`)

## 1) Extend admin restaurants listing endpoint

### File: `controllers/adminRestaurantController.js`

### Update `listAdminRestaurants` to support:
- `city` query param (exact case-insensitive match)
- `claimed` query param (`"claimed" | "unclaimed"`)
- `owner` query param (owner name/email text match)

### Add claim summary per restaurant
For each restaurant row return:
- `claimInfo.isClaimed` (boolean; true if at least one approved claim exists)
- `claimInfo.lastClaimStatus` (`pending|approved|rejected|null`)
- `claimInfo.lastClaimAt` (date or null)

### Suggested implementation detail
- Import `RestaurantClaim` model.
- Use aggregation (recommended) for scale:
  - start from `Restaurant` with current filters
  - `$lookup` owner (`ChefApplication`)
  - `$lookup` claims by `restaurantId`
  - derive last claim via sort by `createdAt desc`
  - derive `isClaimed` from approved claim existence
- If aggregation is too heavy now, compute claim summaries using:
  - `RestaurantClaim.find({ restaurantId: { $in: ids } }).sort({createdAt:-1})`
  - map by restaurant id in memory

### Response shape extension
Keep existing keys and add:
- `cities` unique list for dropdown (`["Islamabad", "Haripur", ...]`)
- `data[].claimInfo`

---

## 2) Add status-control endpoint

### Files
- `controllers/adminRestaurantController.js`
- `routes/adminRestaurants.js`

### New controller
`updateAdminRestaurantStatus(req, res)`

### Route
`PATCH /api/admin/restaurants/:id/status`

### Body
`{ status: "draft" | "published" | "archived" }`

### Validation
- restaurant exists
- status is valid enum

### Behavior
- update restaurant status
- return updated document

---

## 3) Add owner reassignment endpoint

### Files
- `controllers/adminRestaurantController.js`
- `routes/adminRestaurants.js`

### New controller
`reassignAdminRestaurantOwner(req, res)`

### Route
`PATCH /api/admin/restaurants/:id/owner`

### Body
`{ ownerId: "<ChefApplication _id>" }`

### Validation
- restaurant exists
- target owner exists in `ChefApplication`
- target owner is `applicationType === "business_owner"`
- target owner `status === "approved"`

### Behavior
- update `Restaurant.ownerId`
- return updated document + owner info

---

## 4) Add admin restaurant details endpoint (for View details action)

### Files
- `controllers/adminRestaurantController.js`
- `routes/adminRestaurants.js`

### New controller
`getAdminRestaurantById(req, res)`

### Route
`GET /api/admin/restaurants/:id`

### Return
- full restaurant fields
- owner info
- claim summary + recent claims (optional, last 5)

---

## 5) Route registration

### File: `routes/adminRestaurants.js`

Expected final routes:
- `GET /` → list
- `GET /:id` → details
- `PATCH /:id/status` → status controls
- `PATCH /:id/owner` → reassign owner

All routes protected with:
- `protect`
- `authorize("admin","super_admin")`

No server mount change required (already mounted in `server.js`):
- `/api/admin/restaurants`

---

## Frontend changes (`Admin_Cheffington`)

## 6) API client additions

### File: `lib/api-client.ts`

Extend `getAdminRestaurants` filters:
- `city?: string`
- `claimed?: "claimed" | "unclaimed"`
- `owner?: string`

Add methods:
- `getAdminRestaurant(id: string)`
- `updateAdminRestaurantStatus(id: string, status: "draft" | "published" | "archived")`
- `reassignAdminRestaurantOwner(id: string, ownerId: string)`

Also add helper call for owner search source:
- reuse `getChefApplications({ applicationType: "business_owner", status: "approved", search })`

---

## 7) Types

### File: `lib/types.ts`

Extend `AdminRestaurant`:
- `claimInfo?: { isClaimed: boolean; lastClaimStatus?: "pending" | "approved" | "rejected" | null; lastClaimAt?: string | null }`

Add detail type:
- `AdminRestaurantDetail` (if separate detail response used)

---

## 8) Restaurants dashboard UI

### File: `components/restaurants-dashboard.tsx`

### Add filters section
- City dropdown (`All cities + backend-provided city list`)
- Claimed filter dropdown (`All / Claimed / Unclaimed`)
- Owner search input (optional in v1)

### Add table columns
- Claim status (`Claimed` / `Unclaimed`)
- Last claim decision (`Approved/Pending/Rejected/-`)
- Actions

### Add action buttons (per row)
1. **View details**
   - open modal or side panel
   - uses `getAdminRestaurant(id)`
2. **Open public page**
   - link: `${PUBLIC_APP_URL || "http://localhost:3000"}/restaurants/${id}`
   - open new tab
3. **Reassign owner**
   - modal: owner search/select + confirm
   - call `reassignAdminRestaurantOwner`
4. **Archive restaurant**
   - direct action with confirm dialog
   - call `updateAdminRestaurantStatus(id, "archived")`
   - if already archived, show `Publish` button
   - if published, show `Unpublish` -> set `draft`

### Toast feedback
Use existing local toast pattern already introduced in claims page:
- success toast on completed actions
- error toast on API failures

---

## Exact implementation order

1. Backend: extend list endpoint with city/claimed/owner filters + claimInfo.
2. Backend: add status patch endpoint.
3. Backend: add owner reassignment endpoint.
4. Backend: add details endpoint.
5. Frontend: extend API client and types.
6. Frontend: add filters UI (city + claimed).
7. Frontend: add claim columns.
8. Frontend: add quick action buttons and modals.
9. Validate via build/lints and manual QA.

---

## QA checklist

1. City filter shows only matching city rows.
2. Claimed filter:
   - `claimed` shows restaurants with approved claim.
   - `unclaimed` excludes them.
3. Status controls:
   - publish/draft/archive reflect immediately in table + counts.
4. Reassign owner updates owner name/email in row.
5. Open public page navigates to correct consumer URL.
6. Claim info column shows expected values for restaurants with/without claims.
7. Existing tabs unaffected:
   - Applications tab
   - Restaurant Claims tab

---

## Notes to keep risk low

- Keep all changes additive to admin restaurants route/component.
- Do not modify owner-side restaurant CRUD routes.
- Do not touch consumer public restaurant behavior.
- Guard all admin actions with role authorization (already standard).
