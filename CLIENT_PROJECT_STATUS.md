# Cheffington — Project Status (Client Summary)

**Date:** June 2026  
**Purpose:** Simple overview of what is built, what each dashboard does, and what is still to do.

---

## What is Cheffington?

Cheffington is a platform with **four connected parts**:

1. **Public website** — where customers browse restaurants, read reviews, and chefs/business owners sign up.
2. **Admin panel** — where your team reviews applications, manages restaurants, and handles ownership claims.
3. **Business owner portal** — where approved business owners manage their restaurant listings.
4. **Backend server** — stores data, handles uploads, sends emails, and connects everything together.

---

## What is already working (main features)

### For the public (customers & visitors)

- **Home page** with featured restaurants and chef recommendations.
- **Restaurant listings** — browse and search restaurants.
- **Restaurant detail pages** — photos, info, map area, and reviews.
- **Reviews** — customers can leave reviews; reviews can be shown on restaurant pages.
- **Join / sign up** — two paths:
  - **Join as Chef** (with job details and document upload).
  - **Join as Business Owner** (with business details and document upload — same upload flow as chefs).
- **Sign in** for approved chefs.
- **Claim a restaurant** — a person can search for a business, submit a claim with details and supporting files, and wait for admin approval.
- **Legal & info pages** — About, Terms, Privacy Policy.

### For chefs

- Application form with **document and image upload** (saved securely in the cloud).
- After admin **approval**, chef receives an **email** with sign-in instructions.
- If **rejected**, chef receives an **email** with the reason.
- Chef profile area (including profile photo upload).

### For business owners

- Same style of application form, including **business verification documents**.
- After admin **approval**, owner receives an **email** with link to the owner portal.
- If **rejected**, owner receives an **email** with the reason.
- **Owner portal login** to manage their restaurants (add, edit, publish, draft, archive).
- Restaurant images and content can be uploaded and stored in the cloud.

### For your admin team

- **Secure admin login.**
- Review **chef and business owner applications** (view details, open uploaded documents, approve or reject).
- **Email notifications** sent automatically when applications are approved or rejected.
- **Restaurants management** — see all listings, filter by city/status/owner, change status, reassign owner, view details.
- **Restaurant claims** — review claim requests, see attachments, approve or reject; claimant gets an email on decision.
- **Main admin dashboard** with real counts (applications, restaurants, claims) and recent activity lists.

### Behind the scenes (already in place)

- User accounts and passwords (secure).
- File storage for applications, claims, and restaurant photos.
- Location/geocoding support for addresses.
- Separate storage folders for chef vs business owner documents.

---

## Dashboards included (3 dashboards)

| Dashboard | Who uses it | What they can do |
|-----------|-------------|------------------|
| **1. Admin dashboard** | Cheffington staff | See overview stats; manage applications; manage all restaurants; review restaurant ownership claims. |
| **2. Business owner dashboard** | Approved business owners | See overview of their listings; add new restaurants; edit existing ones; publish or unpublish listings. *(Some charts on this dashboard still use sample/demo numbers, not live analytics yet.)* |
| **3. Public website** | Everyone | Browse, search, review, apply, claim restaurants, and sign in (chefs). *(This is not a “dashboard” in the admin sense, but it is the main customer-facing product.)* |

**Note:** Chefs do not have a separate admin-style dashboard. They use the public site (profile and sign-in) after approval.

### Admin dashboard — sections

1. **Dashboard (home)** — Totals for applications, restaurants, and claims; short lists of recent applications and recent claims.
2. **Applications** — All chef and business owner sign-ups; filter by status and type; open full details and documents; approve or reject.
3. **Restaurants** — Full list of businesses on the platform; search and filters; actions like publish, archive, change owner.
4. **Restaurant claims** — Pending/approved/rejected claims; view proof files; approve or reject and notify the claimant.

### Business owner dashboard — sections

1. **Dashboard (home)** — Summary of how many listings they have (published, draft, etc.). Charts for views/inquiries are **placeholder/demo** until a real analytics feature is built.
2. **Restaurants** — List, create new listing, edit listing (details, images, sections, status).

---

## What is not finished yet (remaining work)

### 1. Advertising feature (main gap)

This is the largest piece still missing end-to-end:

- **“Advertise with us” page** exists but is mostly a **marketing headline** — no booking form, pricing, or payment flow yet.
- **Ad spaces on restaurant pages** are **empty grey boxes** (placeholders), not real ads.
- No admin tool yet to **create, schedule, or manage ads**.
- No reporting for advertisers (impressions, clicks, etc.).

**In short:** The idea and page layout are there; the full advertising product (sell ads, show ads, manage ads) still needs to be built.

### 2. “Add an establishment” (public form)

- There is a form on the website, but it is **not connected** to the backend yet — submissions are not saved.

### 3. Business owner dashboard analytics

- Restaurant counts are **real**.
- Charts for “views,” “inquiries,” and “reservations” use **sample data** until tracking and reporting are implemented.

### 4. Other polish (typical for late-stage projects)

- Production hosting, domain, and email delivery setup (depends on client environment).
- Final QA across all flows on mobile and desktop.
- Any extra features from the original wish list not listed above (e.g. payments, subscriptions, advanced chef tools) should be confirmed against the contract/scope.

---

## Rough progress (non-technical estimate)

| Area | Status |
|------|--------|
| Core platform (accounts, restaurants, reviews, applications) | **Mostly complete** |
| Admin operations (applications, restaurants, claims, emails) | **Mostly complete** |
| Business owner portal (manage listings) | **Mostly complete** |
| Claim restaurant flow | **Complete** |
| Document uploads (chef + business owner) | **Complete** |
| Advertising system | **Not started** (placeholders only) |
| Public “add listing” form | **UI only** |
| Owner analytics (real numbers) | **Partial** |

**Overall:** A large share of the core product is built and usable. The main **new feature** still to deliver is the **advertising program** (and tying ad slots on pages to real content). Secondary items are analytics for owners and connecting the public add-listing form.

---

## Suggested next steps for the client

1. **Prioritize advertising** — define how ads are sold (contact form vs online booking), where they appear, and who manages them in admin.
2. **Decide on “Add establishment”** — connect the existing form to the same pipeline as owner-created listings, or remove/hide it until ready.
3. **Plan owner analytics** — what numbers matter (page views, clicks, inquiries) so charts can use real data.
4. **User acceptance testing** — run through: apply as chef, apply as owner, approve in admin, claim a restaurant, publish a listing, leave a review.

---

*This document is written in plain language for client reporting. For technical implementation details, see the other planning documents in the project repositories.*
