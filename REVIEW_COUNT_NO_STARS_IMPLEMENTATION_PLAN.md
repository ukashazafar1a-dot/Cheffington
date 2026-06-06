# Review Count (No Stars) — Implementation Plan

**Goal:** Match client requirement — no star ratings; show **chef review count** per restaurant everywhere (Option B). Chefs-only reviews, positive-only, and negative-language flagging stay as they are today.

**Repos:** `Cheffington` (frontend), `Cheffington_Backend` (API)

**Do not change:** Chef auth, review flagging (`reviewModeration.js`), `/review-flagged` flow, admin/owner portals, restaurant CRUD, claims, applications, geocoding, ads, or legal pages (terms/privacy) in this pass.

---

## 1) Client requirement (locked)

| Rule | Behavior |
|------|----------|
| No star ratings | Remove 1–5 stars from UI; do not show averages |
| Only chefs review | Already enforced — keep unchanged |
| Positive reviews only | Keep existing phrase flagging → `status: flagged` |
| Negative → flagged | Keep `detectFlaggedComment` + `/review-flagged` redirect |
| Trust signal | **Published chef review count** per restaurant, e.g. `2,509 chef reviews` / `1 chef review` |
| Option B | Backend adds `reviewCount` on restaurant **list + detail** APIs; all cards show count |

**Count definition:** `Review.count({ restaurantId, status: 'published' })` — flagged and removed reviews **do not** count.

**Not the same as chef profile:** `RestaurantsDetails.tsx` shows how many reviews **that chef wrote** (`X CHEF REVIEWS`). Do **not** change that label or logic in this task.

---

## 2) Current codebase state

### Already correct (leave alone)

| Area | File(s) | Notes |
|------|---------|-------|
| Chef-only submit | `routes/reviews.js`, `reviewController.js` | `protect` + `authorize('chef')` |
| Approved chef check | `assertApprovedChef()` | Blocks business owners / pending |
| Flagging | `utils/reviewModeration.js` | Phrase list → `flagged` |
| Flagged UX | `app/(main)/review-flagged/page.tsx` | Chef message after flag |
| Public review list filter | `listReviewsByRestaurant` | Only `status: 'published'` |
| Summary endpoint exists | `GET /api/restaurants/:id/reviews/summary` | Returns `reviewCount` (+ `averageRating` today) |

### Conflicts with client (must change)

| Area | File(s) | Issue |
|------|---------|-------|
| Review form | `review-1/_components/ReviewFrom.tsx` | Requires `StarRating`; sends `rating` |
| Restaurant reviews section | `restaurants/[id]/_components/restaurant-reviews.tsx` | Stars + `averageRating` |
| Review cards | `_components/ChefReviewCard.tsx` | Shows stars per review |
| Homepage featured quotes | `_components/ChefRecommends.tsx` | Stars on each quote |
| Chef “my reviews” list | `individual-chef-page/_components/ChefReviewForRestaurants.tsx` | Passes `rating` to card |
| Backend validation | `middleware/validation.js` → `validateReview` | `rating` required 1–5 |
| Backend model | `models/Review.js` | `rating` required |
| Backend submit | `reviewController.js` → `upsertReview` | Saves `rating` |
| Backend summary | `getRestaurantReviewSummary` | Computes `averageRating` |
| Public review payloads | `formatReviewForPublic`, `listMyReviews` | Include `rating` |
| Types / API client | `types/review.ts`, `lib/api-client.ts` | `rating`, `averageRating` in types |
| Restaurant types | `types/restaurant.ts` | No `reviewCount` on `PublicRestaurant` |
| Restaurant list API | `publicRestaurantController.js` | No `reviewCount` on list/detail |
| All restaurant cards | See §5 | No count displayed |
| Detail hero | `RestaurantHeroCover.tsx` | No count |

### Unused after change (optional cleanup)

| File | Action |
|------|--------|
| `components/StarRating.tsx` | Delete **only after** no imports remain |

---

## 3) Target behavior

### Public display copy

Use one shared formatter (frontend):

```ts
formatChefReviewCount(count: number): string
// 0  → "No chef reviews yet"
// 1  → "1 chef review"
// N  → "2,509 chef reviews"  (locale number formatting)
```

### API shape (after change)

**`PublicRestaurant`** (list + detail):

```json
{
  "_id": "...",
  "name": "Khan",
  "reviewCount": 2509,
  ...
}
```

**`GET /api/restaurants/:id/reviews/summary`:**

```json
{
  "success": true,
  "data": { "reviewCount": 2509 }
}
```

Remove `averageRating` from this response (frontend will not use it). No other consumers identified in admin/owner apps.

**`POST /api/reviews`** body:

```json
{
  "restaurantId": "...",
  "comment": "...",
  "title": "optional"
}
```

No `rating` in request.

**Public review objects** (`GET reviews`, featured): omit `rating` from JSON responses (or leave in DB but strip in formatters — prefer strip in formatters to avoid UI accidentally using it).

---

## 4) Backend implementation (`Cheffington_Backend`)

### 4.1 New util — batch review counts

**Add:** `utils/reviewCounts.js`

```js
/**
 * Returns Map<restaurantIdString, reviewCount> for published reviews only.
 */
export async function getPublishedReviewCountMap(restaurantIds) {
  // Review.aggregate:
  // $match: { restaurantId: { $in: ids }, status: 'published' }
  // $group: { _id: '$restaurantId', reviewCount: { $sum: 1 } }
  // return Map
}

export async function getPublishedReviewCount(restaurantId) {
  // Review.countDocuments({ restaurantId, status: 'published' })
}
```

**Why util:** Single source of truth; used by list, detail, and keeps aggregation logic out of controllers.

**Performance:** One aggregation per list request (not N+1 per restaurant). Index `{ restaurantId: 1, status: 1 }` already exists on `Review`.

### 4.2 `controllers/publicRestaurantController.js`

**`listPublishedRestaurants`:**

1. Fetch published restaurants (unchanged).
2. Collect all `_id`s from result.
3. Call `getPublishedReviewCountMap(ids)`.
4. When mapping/enriching each restaurant, set `reviewCount: map.get(id) ?? 0`.
5. Return in JSON — do **not** change sort, filter, or `enrichRestaurantForDisplay` image logic.

**`getPublishedRestaurant`:**

1. Fetch single restaurant (unchanged).
2. Call `getPublishedReviewCount(id)`.
3. Attach `reviewCount` to response `data`.

**Safety:** If aggregation fails, default `reviewCount: 0` and still return restaurants (do not fail entire list).

### 4.3 `controllers/reviewController.js`

**`upsertReview`:**

- Destructure `rating` out of body; do **not** require it.
- On upsert, either:
  - **Option A (recommended):** omit `rating` from update and set schema default (see §4.4), or
  - **Option B:** set `rating: 5` silently for legacy DB compatibility without exposing to UI.
- Keep moderation, status, `flaggedReason`, upsert key `{ restaurantId, chefId }` unchanged.

**`formatReviewForPublic`:**

- Remove `rating` from returned object.

**`getRestaurantReviewSummary`:**

- Replace aggregation with `getPublishedReviewCount(id)` OR keep aggregate but return only `{ reviewCount }`.
- Remove `averageRating` from response.

**`listMyReviews`:**

- Remove `rating` from mapped response (chef sees title, comment, status, restaurant — no stars).

**`listFeaturedReviews` / `formatFeaturedReview`:**

- Inherits no `rating` from `formatReviewForPublic`.

**Do not change:** `listReviewsByRestaurant` pagination/filter, `deleteMyReview`, `assertApprovedChef`, flagging branch.

### 4.4 `models/Review.js`

- Change `rating` to **not required** for new documents.
- Add `default: null` or `default: 5` (team pick: **`null` + no UI** is cleaner; **`5` silent default** avoids migration pain for `runValidators`).
- **Recommended for zero breakage:** `required: false`, keep `min`/`max` if present — existing rows keep their ratings in DB but app ignores them.

**No migration script required** for v1.

### 4.5 `middleware/validation.js` — `validateReview`

**Remove:**

```js
if (body.rating == null) { errors.push('rating is required'); }
// and 1-5 integer check
```

**Keep:**

- `restaurantId`, `comment` required
- `title` max length if validated elsewhere

### 4.6 Routes

**No new routes.** Existing:

- `GET /api/restaurants` → gains `reviewCount` per item
- `GET /api/restaurants/:id` → gains `reviewCount`
- `GET /api/restaurants/:id/reviews/summary` → `reviewCount` only
- `POST /api/reviews` → no `rating` required

---

## 5) Frontend implementation (`Cheffington`)

### 5.1 New shared helper

**Add:** `lib/format-chef-review-count.ts`

```ts
export function formatChefReviewCount(count: number): string { ... }
export function formatChefReviewCountShort(count: number): string { ... } // optional for tight cards
```

### 5.2 New optional UI component

**Add:** `components/ChefReviewCountBadge.tsx`

- Props: `count: number`, `variant?: 'default' | 'compact'`
- Renders formatted label only — **no stars**

Reuse on all cards and hero for consistent styling.

### 5.3 Types

**`types/restaurant.ts`:**

```ts
export interface PublicRestaurant {
  ...
  reviewCount?: number; // always present from API after backend change; default 0 in UI
}
```

**`types/review.ts`:**

- Remove `rating` from `PublicReview`, `MyReview`, `SubmitReviewResponse.data`
- Change `ReviewSummary` to `{ reviewCount: number }` only (remove `averageRating`)

### 5.4 `lib/api-client.ts`

**`submitReview`:** body type without `rating`:

```ts
body: { restaurantId: string; comment: string; title?: string }
```

No other fetch URLs change.

### 5.5 Remove stars — file-by-file

| File | Exact changes |
|------|----------------|
| `review-1/_components/ReviewFrom.tsx` | Remove `StarRating` import, `rating` state, validation, UI block “Your rating”; submit without `rating` |
| `restaurants/[id]/_components/restaurant-reviews.tsx` | Remove `StarRating`, `averageRating`; header shows `formatChefReviewCount(summary.reviewCount)`; stop passing `rating` to `ChefReviewCard` |
| `_components/ChefReviewCard.tsx` | Remove `StarRating`, `rating` prop, star row in layout |
| `_components/ChefRecommends.tsx` | Remove `StarRating` block |
| `individual-chef-page/_components/ChefReviewForRestaurants.tsx` | Remove `rating={review.rating}` prop |

### 5.6 Add review count on all restaurant surfaces (Option B)

| File | Where to show count |
|------|---------------------|
| `Individual-restaurant-page/_components/RestaurantHeroCover.tsx` | Under name/cuisine — e.g. badge `2,509 chef reviews` |
| `restaurants/[id]/page.tsx` | Pass `restaurant.reviewCount` into `RestaurantHeroCover` (extend props) |
| `_components/featured-restaurant-card.tsx` | Small line under name/cuisine |
| `restaurants/_components/restaurant-list-card.tsx` | Near title or above CTA |
| `restaurants/_components/restaurant-directory-card.tsx` | If still used in tree — same pattern |
| `search-results/_components/restaurant-card.tsx` | Same (search redirects to `/restaurants` but keep card consistent) |

**Data source:** `restaurant.reviewCount` from `getPublishedRestaurants()` / `getPublishedRestaurant()` — **no extra per-card API calls**.

**`restaurants/[id]/_components/restaurant-reviews.tsx`:** May still call `getRestaurantReviewSummary` for the reviews section header, OR use `restaurant.reviewCount` from page props to avoid duplicate fetch — **prefer single source from detail API** and pass count from `page.tsx` as prop to avoid two requests.

### 5.7 Pages that load restaurants (verify only)

| Page | Loader | Action |
|------|--------|--------|
| `app/page.tsx` → `RestaurantsList` | `getPublishedRestaurants` | Auto gets `reviewCount` after backend |
| `app/(main)/restaurants/page.tsx` | `getPublishedRestaurants` | Same |
| `app/(main)/restaurants/[id]/page.tsx` | `getPublishedRestaurant` | Pass count to hero + reviews section |

No changes to filter/sort/near-me logic in `restaurants/page.tsx`.

### 5.8 Delete dead code (end of task)

- Remove `components/StarRating.tsx` if grep shows zero imports.
- Grep repo for `averageRating`, `StarRating`, `rating` in review UI paths.

**Out of scope:** `terms/page.tsx`, `privacy-policy/page.tsx` (legal copy mentions “ratings” — separate copy ticket if client wants).

---

## 6) Implementation order (minimize breakage)

```text
Step 1  Backend util getPublishedReviewCountMap
Step 2  publicRestaurantController — attach reviewCount (list + detail)
Step 3  reviewController — drop rating from responses; summary count-only
Step 4  Review model + validateReview — rating optional
Step 5  upsertReview — accept submit without rating
Step 6  Frontend types + formatChefReviewCount + api-client submitReview
Step 7  Remove stars (form, cards, ChefRecommends, restaurant-reviews)
Step 8  Add count to all restaurant cards + RestaurantHeroCover
Step 9  Delete StarRating.tsx; smoke test
```

Deploy **backend before frontend** (or same release): frontend should treat missing `reviewCount` as `0` for safe rollout.

---

## 7) Regression / “do not break” checklist

| Feature | Must still work |
|---------|-----------------|
| Chef login + submit review | Yes — without rating field |
| Flagged review → `/review-flagged` | Yes — unchanged moderation |
| Published review appears on restaurant page | Yes |
| Flagged review not in public count | Yes |
| One review per chef per restaurant (upsert) | Yes — unique index unchanged |
| Chef profile “X CHEF REVIEWS” button | Yes — still count of chef’s written reviews |
| `GET /api/restaurants` list / filters / maps | Yes — only new field added |
| Featured reviews homepage | Yes — quotes without stars |
| Write review link / `ReviewChefGuard` | Yes |
| Delete my review | Yes |
| Admin / owner apps | Unaffected — no review star UI there |

---

## 8) Manual test plan

1. **Backend list:** `GET /api/restaurants` — each item has `reviewCount` number ≥ 0.
2. **Backend detail:** `GET /api/restaurants/:id` — includes `reviewCount`.
3. **Summary:** `GET /api/restaurants/:id/reviews/summary` — only `reviewCount`, no `averageRating`.
4. **Submit (chef token):** POST without `rating` → 200; published if positive text.
5. **Submit negative:** “terrible” → flagged, `reviewCount` unchanged on restaurant.
6. **UI form:** No stars; submit works.
7. **Restaurant page:** Hero + section show count only; no stars on review cards.
8. **Homepage:** Featured restaurants + Chef Recommends — counts/stars as designed; no stars on quotes.
9. **Directory list:** Each card shows chef review count.
10. **Chef profile:** “X CHEF REVIEWS” still reflects chef’s review list length, not restaurant count.

---

## 9) Files touched (summary)

### Backend — modify

- `utils/reviewCounts.js` *(new)*
- `controllers/publicRestaurantController.js`
- `controllers/reviewController.js`
- `models/Review.js`
- `middleware/validation.js`

### Backend — no change

- `utils/reviewModeration.js`
- `routes/reviews.js`
- `routes/publicRestaurants.js` (route paths unchanged)

### Frontend — modify

- `lib/format-chef-review-count.ts` *(new)*
- `components/ChefReviewCountBadge.tsx` *(new, optional)*
- `types/restaurant.ts`
- `types/review.ts`
- `lib/api-client.ts`
- `app/(main)/review-1/_components/ReviewFrom.tsx`
- `app/(main)/restaurants/[id]/_components/restaurant-reviews.tsx`
- `app/(main)/restaurants/[id]/page.tsx`
- `app/(main)/Individual-restaurant-page/_components/RestaurantHeroCover.tsx`
- `app/(main)/_components/ChefReviewCard.tsx`
- `app/(main)/_components/ChefRecommends.tsx`
- `app/(main)/_components/featured-restaurant-card.tsx`
- `app/(main)/restaurants/_components/restaurant-list-card.tsx`
- `app/(main)/restaurants/_components/restaurant-directory-card.tsx`
- `app/(main)/search-results/_components/restaurant-card.tsx`
- `app/(main)/individual-chef-page/_components/ChefReviewForRestaurants.tsx`

### Frontend — delete (after grep)

- `components/StarRating.tsx`

---

## 10) Future (out of scope for this plan)

- Admin queue for flagged reviews
- Stronger sentiment library beyond phrase list
- Sort restaurants by `reviewCount` on directory
- Remove `rating` column from MongoDB entirely
- Update terms/privacy legal copy

---

*Document version: 1.0 — matches codebase as of chef-only reviews with stars, phrase flagging, and public restaurant APIs without `reviewCount`.*
