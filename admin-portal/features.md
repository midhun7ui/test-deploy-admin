# HireD Admin Operations Portal — Features & Modules

## 1. Authentication & Security
- **Admin Login:** Secure authentication with email and password.
- **Session Management:** JWT Bearer access & refresh token lifecycle, stored with persistence and automatic heartbeat validation.
- **Password Reset:** Self-service password reset email dispatch and token-verified password update workflow.
- **Role-Based Access Control:** Strict permission verification (`role: admin`), ensuring unauthorized roles cannot access operations data.

---

## 2. Operations Dashboard (Home Screen)

The Dashboard serves as the central command room for HireD administrators, providing real-time corridor telemetry, order pipeline tracking, fleet dispatch status, and financial reconciliation.

### 2.1 Side Features Bar (Sidebar Navigation)
- **Brand Identity:** HireD Ops badge with portal logo and quick collapse/expand toggle.
- **Operations:**
  - `Operations Dashboard` (Live)
  - `Enquiries & CRM` (Lead pipeline & 4 New badge)
  - `B2B Trips Control` (Live fleet telemetry & 42 Active badge)
  - `Orders Management` (18 Pending review badge)
  - `Driver Management` (KYC verification queue & 9 Pending badge)
  - `Company Accounts` (Enterprise partner directory)
- **Finance & Settlements:**
  - `Accounts & Credit` (Credit limit alerts & exposure monitoring)
  - `Driver Payouts` (Disbursements & batch settlements)
  - `Invoicing & Billing` (Tax invoicing & statement generation)
  - `Statements` (Published partner account statements)
- **Intelligence:**
  - `Operational Reports` (Corridor SLA & transit metrics)
  - `Performance Analytics` (Client booking velocity & fleet utilization)
- **System Administration:**
  - `Notification Center` (System alerts & unread badge)
  - `Admin Users & Roles` (Staff access control)
  - `Audit Trail` (Immutable operational event logs)
  - `System Settings` (Corridor definitions & platform configs)
- **User Profile Footer:** Administrator avatar, display name, role indicator, and one-click Sign Out.

---

### 2.2 Top Navigation Bar (Header)
- **Breadcrumb Navigation:** Hierarchy indicator (`Operations Control / Dashboard`).
- **Live Backend Connectivity:** Real-time pulse indicator showing status of Django REST Framework backend (`http://127.0.0.1:8000`).
- **Global Command Search (`Ctrl + K`):** Quick-filter command palette for searching orders, trips, drivers, companies, and settings.
- **Quick Action:** `+ Quick Dispatch` button for fast order routing.
- **Notifications Bell:** Real-time unread alert counter with toggleable flyout drawer.
- **Administrator Profile Dropdown:** Displays session credentials, user role, backend connectivity info, and secure logout.

---

### 2.3 Dashboard Header & Controls
- **Welcome Banner:** Central Operations Desk corridor overview.
- **Time Period Filter:** Dynamic metric filtering across `Today`, `This Week`, `This Month (Oct 2026)`, and `Q3 Fiscal`.
- **Telemetry Sync Button:** Live data refresh with rotating indicator and timestamp tracking.

---

### 2.4 Operational Key Performance Indicators (KPIs)
1. **Total Orders:** Consolidated order count across enterprise accounts, monthly volume growth, and completed vs ongoing breakdown.
2. **Pending Orders:** Review queue count, SLA response warning badge, and urgency tags.
3. **Active Trips:** Live vehicles currently en route across corridors, on-time SLA status, and telemetry pulse.
4. **Completed Trips:** Closed and delivered trips, on-time delivery rate (99.4%), and ePOD verification status.
5. **Available Drivers:** Ready-for-dispatch driver roster, categorized by regional hubs (Kochi, Bengaluru, Mumbai).
6. **Busy Drivers:** Drivers currently engaged in live corridor transit with average estimated time to arrival.
7. **Pending Driver Onboarding:** KYC verification backlog (commercial licenses, RC books, background checks).

---

### 2.5 Monthly Revenue & Billing Summary
- **Gross Monthly Revenue:** Total realized and projected revenue with monthly growth rate (+16.4%).
- **Financial Status Breakdown:**
  - *Total Invoiced:* Verified B2B bookings.
  - *Realized / Collected:* Cash collections & payment gateway settlements (87.6% collection rate).
  - *Outstanding Receivables:* Balances within credit grace period.
- **Corridor Revenue Distribution:** Stacked progress bar visualizing FTL (62%), LTL/Express (24%), and Platform Margin (14%).
- **Financial Alerts:** Real-time notices for invoices requiring two-factor authorization and credit threshold warnings.
- **Direct Action:** Link to the complete B2B Invoicing & Statements Ledger.

---

### 2.6 Driver Payout & Settlement Summary
- **Disbursement Totals:** Net amount credited to driver accounts this cycle via NEFT/UPI.
- **Pending Audit & Clearance:** Settlements awaiting electronic proof-of-delivery (ePOD) and toll receipt verification.
- **Average Driver Earnings:** Average earnings per driver across closed trips.
- **Upcoming Payout Batch:** Next scheduled disbursement batch details (Batch code, due date, driver count, estimated amount, and dual-person verification sign-off).
- **Top Earning Drivers Roster:** Ranked by verified trip completion, showing vehicle model, rating, and settled earnings.

---

### 2.7 Recent Operational Activities
- **Live Activity Feed:** Chronological audit stream of operational actions.
- **Category Filter Tabs:** `All Activity`, `Orders`, `Trips`, `Drivers & KYC`, and `Payouts`.
- **Search Filter:** Instant client-side search across events, entity codes, and descriptions.
- **Interactive Details:** Click any activity to view structured inspection modal with full audit information.

---

### 2.8 Corridor Control Room & Pending Review Queue
- **Live Corridor Telemetry Table:** Real-time view of ongoing trips with route distance, client partner, assigned driver, vehicle number, progress bar, ETA, and SLA status badge.
- **Pending Orders Review Queue:** Actionable incoming orders with company, route, tonnage, quote amount, and one-click `Accept` (converts to active trip) and `Reject` actions with instant toast feedback.

---

## 3. Enquiries & CRM (Lead Pipeline)

- **Lead Pipeline Kanban View:** 5 progressive operational stages (`New Enquiry`, `Review / Feasibility`, `Quote Generated`, `Negotiation`, `Won / Convert to Order`).
- **Interactive Drag-and-Drop & Reordering:** Live stage transitions with automatic audit logging and toast notifications.
- **List / Table View Toggle:** Switch between visual Kanban cards and high-density tabular view with sorting and bulk actions.
- **Operational Metrics Ribbon:** Total Enquiries, High-Value Leads, Conversion Rate (72.4%), Avg Quote Response Time (18 mins).
- **Direct Order Conversion Modal:** One-click conversion of won leads into active freight orders with PRD v0.2 platform margin calculation.
- **Enquiry Detail Drawer & Filters:** Multi-criteria filtering by priority, source, and assigned ops manager with complete audit timeline.

---

## 4. B2B Trips Control Room (Live Fleet Telemetry & Dispatch)

The B2B Trips Control Room provides a unified master-detail operational command desk for managing nationwide corridor freight operations, live vehicle telemetry, exception handling, and digital proof-of-delivery sign-offs.

### 4.1 Header & Control Desk
- **Live Fleet Dispatch Indicator:** Real-time pulse indicator showing live fleet dispatch connectivity.
- **Export CSV:** One-click client-side export of filtered trip records to CSV.
- **Auto-Sync (30s):** Real-time countdown timer with toggle (pause/resume) for automated telemetry refreshes.
- **+ Create New Trip:** Actionable modal for initiating and dispatching on-demand and contract corridor trips.

### 4.2 Operational KPI Metric Ribbons (4 Cards)
1. **Active Trips:** 48 active operations (32 in transit, 16 at dock / loading).
2. **On-Time SLA Rate:** 94.2% (+1.8% corridor benchmark target 95.0%).
3. **Awaiting Driver:** 6 trips requiring immediate action (Avg dispatch delay: 18 mins).
4. **Exceptions / Delayed:** 4 corridor exceptions (2 critical congestion alerts on NH-48 & NH-44).

### 4.3 Pipeline Segment Status Tabs
- Horizontal filter tabs with live counters:
  - `All Trips (48)`
  - `Scheduled (16)`
  - `In Transit (24)`
  - `At Pickup (4)`
  - `Delivered (128)`
  - `Delayed (4)` (critical red alert counter)

### 4.4 Master-Detail Operational Surface
- **Left Panel (Trip Register):**
  - Instant search across Trip ID, Account, Driver, Vehicle, and Corridor.
  - Tonnage filter chips (`All Fleet`, `Heavy Truck 20T+`, `Medium LCV 10T-16T`, `Multi-Axle Trailer`, `Reefer / Cold Box`).
  - Sort by `Live ETA` and `Priority`.
  - Rich interactive table with active row selection, dot markers, corridor route badges, driver info, and unassigned cancellation alerts.
  - SLA status badges: `On Time`, `At Risk`, `Delayed`, and `POD Verified`.
  - Contextual row actions: `Track Live`, `Trip Report`, `Assign Driver`, and details menu.
  - Pagination controls with active range display.

- **Right Panel (Live Selected Trip Details Card):**
  - **Header:** Selected trip code, status badge, start time, and quick `Track Live` button.
  - **Subtabs:** `Overview`, `Route & Map`, `Expenses`, `Timeline`, and `Documents`.
  - **Shipper Card:** Client partner name, contract code, credit terms, and direct link to account ledger.
  - **Assigned Fleet Resource:** Verified driver avatar, star rating (4.9 ★), phone, vehicle registration (`MH-12 AB 1334`), and tonnage type.
  - **Live Route Telemetry HUD:** Active corridor speed badge (`54 km/h • On Corridor`), interactive map preview with animated pulse pin, next corridor waypoint (`Narayangaon Toll Plaza`), and remaining distance/time HUD overlay (`62 km (1h 15m)`).
  - **Verification Checkpoints:** Driver start selfie photo with geo-tagged verification, and Delivery OTP display with verification status (`Pending` / `Verified`).
  - **Execution Timeline Stepper:** Step-by-step progress tracking with timestamps and active pulsing step indicator.
  - **Action CTAs:** `Mark As Delivered` (transitions trip to Delivered, marks OTP verified, updates timeline) and `Cancel Trip` (exception logging).

### 4.5 Interactive Modal Dialogs
- **CreateTripModal:** Dispatches new corridor trips with origin/destination, tonnage type, freight quote, and driver assignment.
- **AssignDriverModal:** Instant dispatch of nearby verified available drivers (with ETA and vehicle type) for unassigned or cancelled trips.
- **LiveTrackingModal:** Full-screen telemetry radar HUD with live coordinates, FASTag unit ID, fuel level, and corridor SOS dispatch.

---

## 5. Orders Management

The Orders Management module serves as the operations clearinghouse for reviewing, validating, and dispatching partner transport orders across active contracts, modeled strictly after Stitch reference `5._orders_management`.

### 5.1 Orders Header & Operational Actions
- **Module Identity:** "Orders" headline with real-time "Live Feed" pill indicator.
- **Corridor Subtitle:** Clear status description for partner transport order review across active contracts.
- **Time Window Filter:** Toggle controls between `All Time` and `This Month` aggregations.
- **CSV Data Export:** One-click CSV export of filtered or checkbox-selected orders with full corridor metadata.
- **Order Booking Modal Trigger:** `+ Create Order` button for direct ops consignment entry.

### 5.2 Summary KPI Cards (4-Card Ribbon)
1. **Total Orders:** Consolidated order count (`124`), month-over-month growth badge (`+14.2%` trending up), and fulfillment subtitle (`86 fulfilled this month`).
2. **Pending Review:** Orders awaiting review (`8`), urgency badge (`Requires action`), and average turnaround metric (`Avg turnaround: 24 mins`).
3. **Accepted Orders:** Accepted partner commitments (`104`), readiness badge (`Active status`), and dispatch subtitle (`Ready for dispatch / trip creation`).
4. **Rejected / Cancelled:** Rejection count (`12`), cancellation rate badge (`9.6% rate`), and classification subtitle (`Pricing or fleet mismatch`).
- **Interactive KPI Filtering:** Clicking any KPI card immediately filters the pipeline register table.

### 5.3 Pipeline Status Tabs
- `All Orders (124)`
- `Pending Review` with pill count badge `8`
- `Accepted (104)`
- `Converted to Trip (92)`
- `Rejected (12)`

### 5.4 High-Density Orders Register Table
- **Live Search Input:** Instant multi-field search across Order ID, partner company, origin, destination, and cargo.
- **Fleet Category Filter:** Dropdown filtering across `All Fleet`, `Heavy Truck (20T+)`, `LCV (14ft / 16T)`, and `Container / 32ft MXL`.
- **Multi-Select Checkboxes:** Header select-all with indeterminate state and individual row selection.
- **Row Selection Highlighting:** Selected row highlight with pulsating active indicator for the focused order.
- **Data Columns:**
  - *Order ID:* Prefixed identifier (e.g. `#ORD-00124`) with highlight styling.
  - *Company:* Partner trade name with account tier category pill (e.g. `B2B Prime`, `Pharma Fleet`).
  - *Route & Schedule:* Origin to destination with directional arrow icon and scheduled loading datetime.
  - *Vehicle / Ton:* Tonnage requirement and cargo classification tag.
  - *Amount:* Formatted Indian currency (INR) commercial freight total.
  - *Status:* Color-coded pill (`Pending Review`, `Accepted`, `Converted`, `Rejected`).
  - *Actions:* Quick inspector view (`visibility`), trip converter / launcher (`local_shipping`), open connected trip (`open_in_new`), and options menu (`more_vert`).
- **Pagination Footer:** Order count range and navigation controls (`Showing 1 - 5 of 124 orders`).

### 5.5 Master-Detail Inspector Panel (Sticky Inspection Card)
- **Header:** Order ID, status pill, timestamp, creation source (`Via Enterprise EDI Portal`), and quick `Reject` / `Accept` action buttons.
- **Sub-Navigation Tabs:**
  - `Order Information`: Primary corridor inspection view.
  - `Goods & Specs`: Detailed cargo dimensions, e-Way bill references, and dock guidelines.
  - `Timeline`: Chronological operational events and milestone tracking.
  - `Notes`: Internal ops notes stream with quick-post note input.
- **Inspection Components:**
  - *Company Partner Card:* Enterprise initials avatar, verified checkmark, operations head contact, email, and GSTIN.
  - *Route & Map Visual Card:* Waypoint locations for pickup and delivery, distance capsule (`212 km • Est. Duration: 6 hrs via NH60`), route map visual with freight corridor HUD and Fastag toll pill.
  - *Cargo Specs & Vehicle Required (2-Column Grid):* Side-by-side cards with cargo tonnage, hazard status, vehicle model, and nearby available fleet count.
  - *Agreed Commercials Card:* Total freight value (Tax Incl. 18% GST), payment terms (`Net 30 Days Credit`), and quotation verification badge.
  - *Special Dock Instructions:* Callout for PPE safety helmet requirements and loading bay entry gate windows.
  - *Unified Ops Flow Reference:* Active contract SLA tier link.
  - *Bottom Action Footer:* `✓ Accept & Create Trip` (primary container button) and `✕ Reject Order` (danger outline button).

### 5.6 Operational Dispatch & Reason Dialogs
- **Accept Order & Trip Dispatch Modal:**
  - Order snapshot with quoted commercials and route distance.
  - **Spacious 2-Column Driver Assignment Grid:** Verified driver cards featuring driver photo, verified rating, vehicle plate, current corridor hub, and bold ETA indicator with distinct radio selection.
  - Departure schedule window and Fastag corporate wallet allocation.
  - Immediate conversion to active B2B trip with automatic timeline event generation.
- **Reject Order Modal:** Standardized rejection reason codes (capacity crunch, tariff mismatch, regulatory constraints, client cancellation) with audit trail remarks.
- **Create Order Modal:** Full modal dialog to book fresh enterprise transport orders directly into the ops pipeline.

---

## 6. Driver Management (Fleet Registry & Compliance Control Desk)

The Driver Management module provides a unified command center for managing commercial freight drivers, tracking statutory KYC and regulatory compliances, monitoring live driver telemetry along operational corridors, managing digital wallets and payouts, and assigning available drivers to urgent B2B shipments, strictly adhering to Stitch reference `6._driver_management`.

### 6.1 Drivers Header & Global Actions
- **Module Identity:** "Drivers" headline with real-time "FLEET REGISTRY" pill indicator.
- **Corridor Subtitle:** Concise operations summary describing verified commercial drivers, real-time availability, and regulatory compliance.
- **Corridor Location Filter:** Multi-corridor dropdown selector (`All Regions / Hubs`, `Mumbai - Pune Corridor (NH-48)`, `Bengaluru - Chennai Expressway`, `Delhi - Ahmedabad Corridor`, `Kochi - Coimbatore Corridor`).
- **CSV Data Export:** One-click CSV export of filtered driver records including license, vehicle, KYC status, and wallet balance.
- **Driver Onboarding Modal Trigger:** `+ Add Driver` button to onboard new commercial operators.

### 6.2 Operational Summary KPI Cards (4-Card Ribbon with Progress Indicators)
1. **Total Drivers:** Consolidated fleet roster count (`342`), growth badge (`+12 this month` trending up), and registered fleet subtitle.
2. **Active / On Trip:** Active corridor drivers (`218`), utilization metric (`63.7% of total fleet`), and dynamic green progress bar.
3. **Available:** Ready-for-dispatch drivers (`98`), immediate dispatch availability (`28.6% ready`), and cyan progress bar.
4. **Pending Verification:** Onboarding & KYC audit queue (`26`), alert badge (`Requires review`), and amber progress bar highlighting compliance urgency.
- **Interactive KPI Filtering:** Clicking any KPI card instantly filters the driver register table by corresponding status.

### 6.3 Pipeline Status Tabs
- `All Drivers (342)`
- `Active (218)`
- `Available (98)`
- `On Trip (120)`
- `Pending KYC` with prominent amber pill counter badge `26`
- `Inactive (14)`

### 6.4 High-Density Drivers Register Table
- **Search & Filter Controls:**
  - Instant multi-field search across driver name, code, phone number, vehicle registration plate, and base hub.
  - Quick filter tune trigger for advanced criteria.
- **Row Selection Highlighting:** Bold active row border and background highlighting for the currently inspected driver.
- **Data Columns:**
  - *Driver Profile:* High-resolution driver photo, verified rating badge (e.g. `★ 4.9`), full name, and driver ID (`DRV-001`).
  - *Contact Phone:* Formatted phone number with monospace typography.
  - *Assigned Vehicle & Tonnage:* Vehicle registration plate (`MH-12 AB 1334`) and vehicle category (`24T Multi-Axle`).
  - *KYC Compliance Status:* Color-coded pill badge (`Verified`, `Pending Review`, `Rejected`, `Expired DL`).
  - *Operational Status:* Status pill with pulsating indicator (`On Trip`, `Available`, `Pending KYC`, `Inactive`).
  - *Wallet Balance:* Real-time digital wallet credit in INR format (e.g. `₹18,450`).
  - *Row Actions:* Contextual actions: `View` (inspect in right panel), `Assign Trip` (quick dispatch), and `Verify KYC` (for pending review).
- **Pagination Footer:** Range indicator (`Showing 1 - 5 of 342 drivers`) with previous/next controls.
- **Operational Integration Callout:** Bottom banner referencing seamless driver assignment to active B2B orders and trips.

### 6.5 Master-Detail Driver Profile Inspector Panel (Sticky Right Column)
- **Header:**
  - Dual status badges (Operational status pill + KYC badge).
  - Prominent 64x64 driver avatar with active status ring.
  - Driver full name, driver ID code, star rating (`4.9 ★`), completed trips count (`342 trips`), and phone contact.
  - **Quick Action Bar:**
    - `Assign Trip` (primary container button)
    - `Call Driver` (secondary button with phone icon)
    - `Suspend` (danger warning action)
- **Sub-Navigation Tabs:**
  - `Overview & Telemetry`: Live transit HUD, corridor route, and speed metrics.
  - `KYC & Documents`: Regulatory compliance checklist with verified stamps.
  - `Trip History`: Chronological completed and active freight trips.
  - `Wallet & Settlements`: Driver wallet breakdown, pending dues, and last IMPS payout.
  - `Performance`: On-time delivery SLA score (98.6%) and safety index.
- **Compliance & Regulatory Checklist (5 Documents):**
  - Commercial Driving License (DL) with expiry date and verified status.
  - Aadhaar Card (Govt ID) with masked UID.
  - Police Clearance Certificate (PCC) with annual validity.
  - Medical Fitness Certificate with occupational fitness sign-off.
  - Vehicle Registration Certificate (RC) & Fitness check.
  - Overall compliance status badge (`5/5 Verified`).
- **Live Telemetry & Trip HUD:**
  - Current trip badge (`TRP-10482 • Active Trip`).
  - GPS corridor route (`Bhiwandi Hub ➔ Chakan MIDC via NH-48`).
  - Live vehicle speed badge (`54 km/h • Normal Speed`) with pulsing green radar dot.
  - Fastag toll tag ID and live vehicle plate display.
- **Digital Wallet & Settlement Summary:**
  - Total Wallet Balance (`₹18,450`) with `View Ledger` action.
  - Pending settlement hold (`₹4,200`).
  - Last payout timestamp and IMPS reference code (`₹24,500 via IMPS`).
- **Bottom Action Footer:**
  - `✓ Documents Verified` (success button)
  - `Re-assign Fleet Vehicle` (secondary action button)

### 6.6 Interactive Modal Dialogs
- **Add Driver Modal:** Complete onboarding form capturing full name, mobile, email, base corridor hub, commercial DL number & expiry, assigned vehicle plate & category, and emergency contact details.
- **Verify KYC Modal:** Document inspection modal reviewing DL, Aadhaar, PCC, Medical Certificate, and RC with high-resolution document previews, verification metadata, and one-click `Approve All Documents` or `Request Re-upload`.
- **Assign Driver Trip Modal:** Rapid dispatch dialog showing available orders and active corridor trips requiring fleet allocation, featuring origin, destination, cargo tonnage, quote value, and instant driver dispatch confirmation.

---

## 7. Company Accounts (Partner Directory & Enterprise Credit Desk)

The Company Accounts module serves as the commercial backbone for managing B2B enterprise client accounts, contractual credit limits, GSTIN compliance, and driver payout split configurations, strictly modeled after Stitch reference `7._company_management`.

### 7.1 Companies Header & Operational Actions
- **Module Identity:** "Companies" headline with real-time `PARTNER DIRECTORY` pill indicator.
- **Corridor Subtitle:** Clear status description for administering B2B enterprise client accounts, contractual credit limits, GSTIN compliance, and driver payout split configurations.
- **Corridor / Hub Filter:** Multi-corridor dropdown selector (`All Corridors & Types`, `Mumbai - Pune Corridor (NH-48)`, `Bengaluru - Chennai Expressway`, `Delhi - Ahmedabad Corridor`, `Kochi - Coimbatore Corridor`).
- **CSV Data Export:** One-click CSV export of the full enterprise directory including Legal Entity, GSTIN, PAN, Industry, Status, Credit Limit, Used Balance, and Primary Contact.
- **Add Company Modal Trigger:** `+ Add Company` button to onboard fresh enterprise accounts.

### 7.2 Summary KPI Cards (4-Card Ribbon)
1. **Total Companies:** Consolidated enterprise count (`84` registered), active contract subtitle (`62 active enterprise contracts`), and apartment emblem.
2. **Active Accounts:** Accounts with live billing (`76`), growth badge (`+4 this month`), and operational subtitle.
3. **Pending KYC:** Compliance audit queue (`5`), urgency badge (`Action Required`), and GSTIN/bank review subtitle.
4. **Credit Breaches:** Credit limit alerts (`3`), breach badge (`Limit Breached`), and outstanding exposure subtitle.
- **Interactive KPI Filtering:** Clicking any KPI card immediately filters the partner directory table.

### 7.3 Pipeline Status Tabs
- `All Companies (84)`
- `Active (76)`
- `Pending KYC` with amber badge `(5)`
- `Credit Watch (8)`
- `Suspended (3)`

### 7.4 High-Density Companies Register Table
- **Search & Filter Controls:**
  - Instant multi-field search across company name, GSTIN, contact person, and company code.
  - Industry category dropdown (`All Industries`, `Cement & Heavy Goods`, `Cold Chain & FMCG`, `Pharma & Chemicals`, `Automotive & Spares`).
  - Column / Filter tune trigger.
- **Row Selection Highlighting:** Bold active row border and background highlighting for the currently inspected enterprise account.
- **Data Columns:**
  - *Select Checkbox:* Row-level selection and header select-all.
  - *Company / Tier:* High-contrast company initials avatar box, trade name, verified checkmark, tier badge (`Enterprise Prime`, `Standard B2B`, `Reefer Specialist`), and code (`CMP-2026-001`).
  - *Contact Details:* Primary contact person name and formatted phone in monospace.
  - *GSTIN & State:* 15-digit GSTIN with state and region indicator.
  - *Credit / Split:* Utilised amount vs approved credit limit (e.g. `₹12.4L / ₹15L`) and split ratio (`85% Drv · 15% Platform` or breach warning `121% Breached`).
  - *Status:* Color-coded status badge with pulsating dot (`Active`, `Credit Watch`, `Credit Breach`, `Pending KYC`, `Suspended`).
  - *Actions:* Quick dossier view button (`visibility`) and options menu (`more_vert`).
- **Pagination Footer:** Range indicator (`Showing 1 - 5 of 84 companies`) with step controls (`< 1 2 3 ... 17 >`).
- **Bulk Operations Callout Banner:** "Bulk GSTIN & KYC Verification Run" with queued accounts counter and instant one-click MCA verification trigger.

### 7.5 Master-Detail Company Profile Inspector Panel (Sticky Right Column)
- **Header:**
  - Gradient avatar pod (`SL`), verified blue checkmark, enterprise code, tier pill, and account vintage (`Active since Feb 2024`).
  - Header actions: `Edit Company Details` (`edit`), `Download Dossier` (`download`), `Account Actions / Suspend` (`block`).
- **Sub-Navigation Tabs:**
  - `Overview`: Primary commercial and tax inspection view.
  - `Contracts & Split`: Active freight contracts and SLA commitments.
  - `Live Trips (4)`: Ongoing transit shipments billed to the account.
  - `Ledger & Invoices`: Historical GST invoices and payment receipts.
  - `Audit Log`: Account parameter modification timeline.
- **Section 1: Business & Tax Information:**
  - Verified GST badge (`✓ GST Verified`).
  - Legal Entity name, GSTIN number, PAN reference, Registered state code, and Operating HQ address.
- **Section 2: Credit Limit & Utilisation:**
  - Contractual credit terms pill (`Net 30 Days`).
  - Utilisation progress bar meter with percentage and remaining headroom (`82.6% Utilised`, `₹2,60,000 Remaining`).
  - Overdue balance card (`₹0.00`) and Security deposit guarantee (`₹5,00,000 Bank Guarantee on file`).
- **Section 3: Commission & Payout Split:**
  - Payout split cards: Driver Partner Allocation (`85%`), HireD Platform Margin (`15%`).
  - Quick `Edit Rules >` action link.
  - Surcharge transparency callout: Fuel surcharges and detention allowances pass 100% directly to assigned driver.
- **Section 4: Operational Performance Metrics:**
  - 4-box metrics grid: `Trips 30D (142)`, `In Transit (4)`, `SLA Rate (96.4%)`, `Billed 30D (₹48.2L)`.
- **Section 5: Key Contact Person Card:**
  - Contact initials avatar (`RS`), full name, designation, email, and one-click call button.
- **Bottom Action Footer:**
  - `Adjust Credit` (secondary container button).
  - `View Account Ledger` (primary container button).

### 7.6 Interactive Modal Dialogs
- **Add Company Modal:** Comprehensive modal for onboarding fresh enterprise accounts, capturing company name, legal entity, GSTIN, PAN, industry, tier, freight corridor, credit limit, credit terms, security deposit, and primary contact details.
- **Adjust Credit Modal:** Dedicated commercial risk modal to revise approved credit limits, payment cycles (`Net 15` to `Net 60`), security deposit instruments, and audit justification remarks.
- **Edit Split Modal:** Commission configuration modal to calibrate driver payout percentage vs platform margin percentage with surcharge pass-through policies.

---

## 8. Accounts & Credit (Financial Risk & Ledger)

The Accounts & Credit module provides real-time financial exposure tracking, credit limit surveillance, ageing bucket schedules, and automated dunning controls for all enterprise B2B partner accounts on the HireD platform. Modeled after the Stitch design system (`8._accounts_credit`).

### 8.1 Header & Operational Risk Controls
- **Page Title & Category Badge:** `Accounts & Credit` with `FINANCIAL RISK & LEDGER` pill badge.
- **Descriptive Subtitle:** `Sanctioned credit limits, live exposure tracking, ageing schedules, and automated dunning control.`
- **Month Period Selector:** Dynamic monthly ledger toggle (`Oct 2026`, `Sep 2026`, `Aug 2026`).
- **CSV Register Export:** One-click CSV export generating a comprehensive audit register of all enterprise credit lines, current utilization, and ageing buckets.
- **Credit Note Voucher Trigger:** Secondary fill CTA to issue commercial credit notes against disputed or adjusted enterprise invoices.
- **Adjust Credit Limit CTA:** Primary action button to revise approved credit ceilings, payment terms, and bank guarantee collateral.

### 8.2 Portfolio & Financial Risk Key Performance Indicators (KPIs)
1. **Total Outstanding:**
   - Consolidated exposure across all accounts (`₹62,61,000`).
   - Growth delta tag (`↑ 4.8%`, high alert badge).
   - Subtitle: `Across 76 active credit lines`.
   - Linear progress track showing 78% exposure utilization.
2. **Portfolio Utilisation:**
   - Aggregate ratio of sanctioned limits utilized (`78.3%`).
   - Policy safety badge (`Safe Cap < 85%`).
   - Headroom subtitle: `₹17.38 L buffer before system ceiling`.
   - Dual-segment progress track (60% core utilized + 18.3% incremental).
3. **90+ Days Delinquent:**
   - Severely overdue exposure balance (`₹14,08,900`).
   - Critical risk badge (`High Risk`).
   - Dunning alert subtitle: `3 enterprise accounts flagged for dunning`.
   - Linear danger track (22% delinquency load).
4. **Blocked Accounts:**
   - Accounts suspended from automated vehicle dispatches (`2 Accounts`).
   - Urgency badge (`Action Required`).
   - Policy trigger subtitle: `Bookings automatically halted via rules`.
   - Linear danger track (4% portfolio breach).

### 8.3 Pipeline Filter Tabs
- **Filter Tabs:**
  - `All (84)`: Complete enterprise register.
  - `Active (76)`: Live accounts with active dispatch eligibility.
  - `Watchlist (8)`: Accounts near or at 85% utilization cap.
  - `Breached (2)`: Accounts exceeding sanctioned limits or placed on booking lock (with high-visibility circular danger counter badge).
  - `Healthy (74)`: Accounts with zero delinquency and >20% credit buffer.
- **Quick Action Controls:**
  - Column customizer toggle (`view_column`).
  - Instant ledger synchronization trigger (`refresh`).

### 8.4 High-Density Financial Register Table
- **Multi-Field Instant Search:** Real-time search across account name, account code, GSTIN, payment terms, and client tier.
- **Data Columns:**
  - *Checkbox:* Row-level selection and header select-all.
  - *Account & Tier:* Initials avatar pod (`SL`, `TP`, `VR`, `BC`), company legal name, account code (`#ACC-2026-001`), and tier badge (`PRIME`, `STANDARD`, `STRATEGIC`, `DELINQUENT`).
  - *Terms:* Settlement payment terms pill (`Net 15`, `Net 30`, `Net 45`, `Prepaid Only`).
  - *Credit Limit:* Sanctioned credit facility amount (e.g., `₹15,00,000`).
  - *Outstanding Balance:* Live balance figure with mini horizontal progress track and utilization percentage (e.g., `₹12,40,000` / `82.6%`).
  - *Ageing Spectrum:* High-density chip cluster breaking down overdue bands:
    - Current: Green/subtle chip (`Cur: 9.2L`)
    - 30 Days: Blue/container chip (`30d: 3.2L`)
    - 60 Days: Red/danger chip (`60d: 4.8L`)
    - Delinquency note (`· 0 over 60d`)
  - *Status Badge:* Dot-indicator pill (`Active`, `Blocked`, `Watchlist`, `Healthy`).
  - *Row Action:*
    - `View Ledger`: Opens inspector ledger tab for active accounts.
    - `Edit Limit`: Quick limit revision for watchlist accounts.
    - `Override`: Emergency dispatch unlock for blocked accounts.
- **Pagination Footer:** `Showing 1 - 5 of 84 enterprise accounts` with page navigation controls.

### 8.5 360° Account Credit & Live Ledger Detail Panel (Sticky Inspector)
- **Hero Identity Cluster:**
  - Initials avatar (`SL`), account trade name, terms pill (`Net 30`), account code, and GSTIN.
  - Quick action icons: Download Statement (`description`) and Account Settings (`settings`).
- **Sub-Navigation Tabs:**
  - `Credit Overview`: Core risk, utilization gauge, and ageing matrix.
  - `Ledger`: Detailed debit/credit transaction record.
  - `Invoices (14)`: Tax invoices pending payment.
  - `Guarantees`: Active bank guarantee instruments.
- **Card 1: Sanctioned Credit Utilisation Gauge:**
  - Header with utilization badge (`82.6% Utilised`).
  - Full-width utilization progress track meter with breach color shifts.
  - 3-column metric breakdown: `CREDIT LIMIT (₹15,00,000)`, `UTILISED (₹12,40,000)`, `AVAILABLE BUFFER (₹2,60,000)`.
  - Bank Guarantee on File: Shield verified callout with bank name, BG reference (`HDFC #BG-9921`), amount (`₹5,00,000`), and `VERIFIED` tag.
- **Card 2: Outstanding Ageing Analysis:**
  - Standing status tag (`Good Standing` or `Action Required`).
  - Stacked horizontal ageing bar visually dividing Current, 1-30D, 31-60D, and 60+D delinquency shares.
  - 4-column spectrum grid:
    - `CURRENT`: Amount and % of outstanding balance.
    - `1-30 DAYS`: Amount and overdue percentage.
    - `31-60 DAYS`: Overdue bucket balance.
    - `60+ DAYS`: Critical delinquent exposure.
  - Dispatch Eligibility Callout: Verified badge confirming eligibility for automated instantaneous fleet dispatch or flagging dunning lock.
- **Card 3: Recent Transactions Live Feed:**
  - List of recent billing and settlement events:
    - Freight Trip Billed (`local_shipping`, debit amount, resulting balance).
    - NEFT/RTGS Settlement Received (`payments`, credit amount, cleared status).
    - Administrative hold/override events (`block`).
  - Link to `View Full Statement`.
- **Card 4: Operational Credit Controls & Action Triggers:**
  - `Edit Limit (₹)`: Direct trigger to open limit adjustment modal.
  - `Halt Bookings` / `Resume Bookings`: Immediate administrative booking suspension or reactivation with status reflection.
  - `Grant 48h Temporary Override`: Full-width primary CTA for high-priority emergency dispatches.
  - Automated Dunning Reminder Callout: Timestamps of last auto-dunning notice and upcoming scheduled reminder.

### 8.6 Interactive Modal Dialogs
- **Adjust Credit Limit Modal:**
  - Real-time display of current outstanding, utilization percentage, and tier.
  - Inputs for revised credit limit (₹), payment terms (`Net 15` to `Prepaid Only`), bank guarantee collateral amount, guarantee reference, and mandatory audit rationale.
- **Issue Commercial Credit Note Modal:**
  - Select target enterprise account, target tax invoice ref (`#INV-2026-X`), credit note amount (₹), reason code (`Transit Shortage / Demurrage Waiver`, `Rate Discrepancy`, `Damage Settlement`, etc.), GST treatment (18% IGST vs CGST/SGST), authorizing official, and audit remarks.
  - Automatically updates account ledger balance, reduces outstanding exposure, and logs credit transaction.
- **Grant Temporary Override Modal:**
  - High-risk action warning callout explaining exposure implications.
  - Duration picker (`24 Hours`, `48 Hours`, `72 Hours`, `7 Days`).
  - Additional temporary buffer amount (₹) and authorizing executive signature.
  - Audit explanation and payment promise tracking.

---

## 9. Payouts & Driver Wallets (Disbursement & Settlements)

The Payouts & Driver Wallets module provides high-throughput administrative control over driver partner earnings, automated gross-to-net trip calculation breakdowns, digital wallet balance management, corporate banking rails telemetry, and instant IMPS/NEFT disbursements, strictly modeled after Stitch reference `9._payouts_driver_wallets`.

### 9.1 Header & Settlement Controls
- **Page Title & Category Badge:** `Payouts & Driver Wallets` with `DISBURSEMENT & SETTLEMENTS` pill badge and primary indicator dot.
- **Descriptive Subtitle:** `Administer driver partner earnings, verify trip gross allocations vs platform split, record external bank transfers, and reconcile digital wallets.`
- **Month Period Selector:** Dynamic monthly ledger toggle (`Oct 2026`, `Sep 2026`, `Aug 2026`).
- **CSV Register Export:** One-click CSV export generating a comprehensive audit register of all driver disbursements, gross earnings, split ratios, deductions, and banking references.
- **Reconcile IMPS / UPI Trigger:** Secondary action button to run two-way statement verification with corporate banking partner APIs (HDFC & ICICI).
- **Process Batch Payout CTA:** Primary action button (`+ Process Batch Payout`) to trigger multi-driver batch disbursements across corporate API rails.

### 9.2 Financial Settlement Key Performance Indicators (KPIs)
1. **Total Driver Payable:**
   - Consolidated net driver earnings queued across trips (`₹24,82,450`).
   - Growth delta badge (`+6.4%`).
   - Subtitle: `Net driver earnings queued across 218 trips`.
   - Linear progress meter showing 72% cycle allocation.
2. **Pending Disbursements:**
   - Review queue count requiring ops verification (`42 Disbursements`).
   - Alert badge (`Action Required`).
   - Subtitle: `₹5,18,200 pending ops approval & OTP match`.
   - Linear amber track showing 45% queue load.
3. **Paid This Cycle:**
   - Completed disbursements for the current settlement cycle (`₹18,64,250`).
   - Status badge (`On Schedule`).
   - Subtitle: `176 successful IMPS/NEFT transfers`.
   - Linear emerald progress track showing 84% completion.
4. **Failed / On Hold:**
   - Errored disbursements due to banking or KYC mismatch (`3 Accounts`).
   - Urgency badge (`High Priority`).
   - Subtitle: `₹42,800 failed due to IFSC / bank mismatch`.
   - Linear danger track (12% issue rate).

### 9.3 Pipeline Status Tabs & Filters
- **Filter Tabs:**
  - `All Payouts (221)`: Complete disbursement register.
  - `Pending Approval (42)`: Payouts requiring supervisor authorization.
  - `Ready for Disbursal (38)`: Validated transactions queued for API execution.
  - `Settled / Paid (138)`: Successfully transferred payouts with verified UTRs.
  - `Failed / On Hold (3)`: Transactions halted due to IFSC, name mismatch, or ops hold.
- **Multi-Field Instant Search:** Real-time search across payout ID (`#PAY-2026-X`), driver name, vehicle number, corridor, and bank account.
- **Corridor Dropdown Filter:** Filter by high-volume transit corridors (`Pune ⇄ Nashik`, `Mumbai ⇄ Surat`, `Delhi ⇄ Jaipur`, `Kochi ⇄ Coimbatore`).
- **Batch Dropdown Filter:** Filter by settlement batch (`Today (14 Oct)`, `Batch: 12-13 Oct`, `Weekly Cycle #41`).
- **Telemetry Reload Control:** Instant sync button to refresh real-time trip completion feeds and FASTag toll deductions.

### 9.4 High-Density Payouts Register Table
- **Data Columns:**
  - *Checkbox:* Row-level selection and header select-all.
  - *Payout ID & Date:* High-contrast payout code (`#PAY-2026-0891`) and formatted timestamp.
  - *Driver & Vehicle:* Initials avatar pod (`RK`, `IS`, `SM`, `DP`, `AV`), driver legal name, vehicle registration number, and tonnage class.
  - *Trip & Corridor:* Associated trip code (`#TRP-10482`) with directional corridor indicator (`Pune → Nashik`).
  - *Gross Val:* Agreed gross freight rate and contract split ratio (`85% Split`).
  - *Deductions:* Advance deductions and platform deductions displayed in high-contrast red (`-₹2,400`).
  - *Net Payable:* Final calculated disbursal figure highlighted in bold primary color (`₹38,570`).
  - *Status Badge:* Color-coded pill (`Pending Approval`, `Settled (IMPS)`, `On Hold (IFSC Issue)`, `Processing`, `Ready for Disbursal`).
  - *Action Triggers:* Contextual one-click action buttons:
    - `Approve`: Instant single-click disbursal execution.
    - `Fix KYC`: Direct remediation link for failed banking accounts.
    - `visibility` / `more_vert`: Detailed ledger and audit tools.
- **Pagination Footer:** Range indicator (`Showing 1 - 5 of 221 payout records`) with step navigation controls.
- **Automated IMPS Banking Rails Active Banner:**
  - Dedicated operational status strip confirming live connectivity with ICICI & HDFC Corporate Multi-Disbursal APIs with automated UTR capture.
  - Pulsating green indicator dot, `Bank Gateway Online` badge, and sub-200ms latency monitor (`Lat: 180ms`).

### 9.5 360° Selected Payout & Driver Wallet Inspector Pane (Sticky Right Column)
- **Driver Profile Card:**
  - High-resolution driver portrait with live online green badge.
  - Full name with verified blue checkmark (`verified`), driver code, and phone number.
  - Quick action icons: Download Settlement Voucher (`receipt`) and Share Confirmation (`share`).
  - 3-column performance metrics: Rating (`4.9 ★`), Completed Trips (`412 Trips`), and Statutory Compliance (`100% Tier 1`).
- **Sub-Navigation Tabs:**
  - `Payout Breakdown`: Detailed gross-to-net financial calculation sheet.
  - `Wallet Ledger`: Virtual driver wallet debit/credit timeline.
  - `Trip Details`: Vehicle specs, cargo tonnage, and corridor transit distance.
  - `Bank & KYC`: Aadhaar verification, commercial DL status, and bank penny drop check.
- **Payout Calculation Breakdown Card:**
  - Target trip code and corridor header (`#TRP-10482 (Pune → Nashik)`).
  - Agreed Gross Trip Rate (`₹48,200`).
  - Partner Contract Share (85.0%): Highlighted green banner with directional icon (`+₹40,970`).
  - Platform Retained Fee (15.0%): Strikethrough transparent line (`₹7,230`).
  - Fuel / FASTag Reimbursed: Green credit adjustment (`+₹1,200`).
  - Trip Advance Deducted: Disbursed fuel advance deduction in red (`-₹3,600`).
  - Dashed flow separator line.
  - Net Payable Callout Pod: Bold primary card displaying `Net Payable to Driver` after 1% TDS Sec 194C deduction (`₹38,570`).
- **Virtual Driver Wallet Card:**
  - Header: `Virtual Driver Wallet` with active ledger indicator.
  - Current Withdrawable Balance (`₹14,850`).
  - Lifetime Settled Volume (`₹3,42,800`).
- **External Banking & Beneficiary Specs:**
  - Masked bank account (`HDFC Bank •••• 4892`).
  - IFSC Code and branch name (`HDFC0001234 Hinjawadi`).
  - Beneficiary Match: Real-time name match percentage checkmark (`✓ Ramesh Ganpat Kumar (100%)`).
  - Disbursement Rail: `IMPS Instant API Rail`.
- **Action Triggers & Operational Controls:**
  - `Approve & Disburse Payout (₹38,570)`: Full-width primary CTA with verified shield icon.
  - `Hold for Audit`: Amber pause button for supervisor investigation.
  - `Manual UTR`: Secondary button to record manual bank wire reference.
  - Platform Compliance Disclaimer: Statutory note referencing GST and Section 194C guidelines.

### 9.6 Interactive Modal Dialogs
- **Process Batch Payout Modal:**
  - Summarizes total queued disbursements (42 drivers) and aggregate net payable (`₹5,18,200`).
  - Allows selecting corporate disbursement rails (`IMPS Instant API Rail`, `NEFT Corporate Bulk Clearing`, `UPI Direct VPA`).
  - Requires ops authorizer credential and 2FA bank OTP verification.
- **Manual UTR Capture Modal:**
  - Allows attaching external bank transaction references (UTR number), settlement date, transfer mode (IMPS, NEFT, RTGS), and audit remarks to clear offline transfers.
- **Reconcile IMPS / UPI Webhooks Modal:**
  - Automated two-way statement reconciliation with HDFC and ICICI API callback webhooks to match queued payouts with bank debits and flag discrepancies.

---

## 10. Invoicing & Billing (Billing & GST Compliance)

The Invoicing & Billing module governs the entire accounts receivable and statutory tax compliance lifecycle for HireD enterprise shippers. Faithfully modeled after Stitch Design Reference 10 (`10._invoicing`), it provides automated closed-trip freight consolidation, Rule 46 GST tax invoice generation, two-step verification guardrails, and real-time reconciliation with virtual collection accounts.

### 10.1 Module Header & Administrative Controls
- **Title & Pillar Badge:** Bold page title `Invoicing` paired with the teal category badge `BILLING & GST COMPLIANCE`.
- **Operational Subtitle:** "Enterprise billing cycles, automated GST reconciliation & multi-tier approval sign-offs."
- **Export CSV Button:** One-click client-side CSV dataset generator formatted with sanitized quotation marks for enterprise ERPs (SAP, Oracle, Tally).
- **Billing Month Calendar Selector:** Dropdown selector with calendar icon (`Oct 2026`, `Sep 2026`, `Aug 2026`, `Jul 2026`) for historical cycle auditing.
- **Primary CTA (`+ Create Invoice`):** Opens the consolidated tax invoice creation modal for generating ad-hoc or cycle invoices.

### 10.2 Statutory Key Performance Indicators (KPIs)
1. **Billed This Cycle:**
   - Primary metric: `₹29,33,100` with positive trend badge (`+12.4% vs last mo`).
   - Volume counter: `34 Invoices`.
   - Visual progress bar: 78% filled gradient track.
   - Footnote: "Across 34 verified enterprise invoices".
2. **Outstanding Receivables:**
   - Metric: `₹25,45,100` with amber credit term badge (`Due within 30d`).
   - Volume counter: `18 Invoices`.
   - Visual progress bar: 64% filled amber track.
   - Footnote: "18 invoices within credit term buffer".
3. **Overdue / Dunning:**
   - Metric: `₹14,23,100` with high-risk badge (`High Risk (5 Invoices)`).
   - Aging bucket: `Overdue >15d`.
   - Visual progress bar: 42% filled danger red track.
   - Footnote: "5 accounts exceeding agreed payment terms".
4. **Drafts Pending Review:**
   - Metric: `01` with action alert badge (`Action Required`).
   - Sign-off requirement: `Two-Step Sign-off`.
   - Visual progress bar: 25% filled pulsing accent track.
   - Footnote: "Requires second admin sign-off to publish".

### 10.3 Pipeline Status Tabs & Multi-Filter Controls
- **6 Pipeline Categories with Live Count Badges:**
  - `All Invoices (38)`: Complete billing register across all lifecycle states.
  - `Pending Verification (1)`: Highlighted amber badge for invoices waiting for Step 2 sign-off.
  - `Draft (2)`: Newly consolidated trip batches undergoing ops review.
  - `Sent / Unpaid (14)`: Dispatched invoices currently within client credit terms.
  - `Overdue (5)`: Red danger badge for accounts exceeding payment due dates.
  - `Paid (16)`: Fully reconciled invoices matched against virtual account remittances.
- **Search & Filter Controls:**
  - Search input with clear button matching invoice numbers (`#INV-2026-0481`), client names, GSTINs, or billing periods.
  - Client company dropdown selector.
  - Status filter dropdown (`Review Pending`, `Due in 18d`, `Due in 24d`, `Overdue (12d)`, `Reconciled`).
  - Filter reset button (`refresh` icon) to restore default view.

### 10.4 High-Density Invoicing Register Table (Left Column)
- **Table Columns:**
  - *Selection Checkbox:* Batch selection support with indeterminate header state.
  - *Invoice # & Date:* Bold invoice identifier (`#INV-2026-0481`) with date stamp (`14 Oct 2026`).
  - *Client / Account:* Enterprise partner name (`Sharma Logistics`), client account code (`ACC-2026-001`), and 15-digit GSTIN (`27AABCS1429B1Z2`).
  - *Period & Trips:* Period badge (`01–14 Oct`) and consolidated closed trip count (`12 Closed Trips`).
  - *Taxable + GST:* Taxable base freight (`₹9,50,000`) and computed GST (`+₹1,71,000 GST`).
  - *Total Amt:* Final payable amount in bold font (`₹11,21,000`).
  - *Status:* Color-coded status indicator dot and label (`Review Pending`, `Due in 18d`, `Overdue (12d)`, `Reconciled`).
  - *Action:* Contextual single-click triggers (`Review` for pending, `Remind` for due, `Notice` for overdue, `Receipt` for reconciled).
- **Pagination Footer:** Range indicator (`Showing 1 - 5 of 38 invoices`) with step controls (`< 1 2 3 ... 8 >`).
- **Two-Step Verification Guardrail Active Banner:**
  - Bottom compliance strip with `verified_user` shield icon, headline, and `COMPLIANCE LOCK: ENFORCED` badge.
  - Mandates secondary sign-off from Finance Controller or Operations Director on invoices above ₹5,00,000 before release to the NIC GST E-Invoicing portal and client ERP.

### 10.5 Master-Detail Selected Invoice Inspector Panel (Sticky Right Column)
- **Hero Header:**
  - Enterprise avatar pod (`SL`) with brand styling and verified checkmark.
  - Full company name (`Sharma Logistics Pvt Ltd`) and meta tags (`#ACC-2026-001 • GSTIN: 27AABCS1429B1Z2`).
  - Action buttons: Download PDF (`download`), Export Single CSV (`share`), and Quick Actions (`more_vert`).
- **Status Alert Ribbon:**
  - Amber banner: `Draft Invoice Awaiting Admin Verification`.
  - Subtitle: `Created by Rohan M. (Ops Admin) on 14 Oct, 11:30 AM`.
  - Step counter pill: `Step 2/4`.
- **Subtabs:**
  - `Summary`: Financial itemization, workflow stepper, and remittance bank details.
  - `Trips (12)`: Itemized list of closed trip legs with 100% digital POD and biometric sign-off compliance.
  - `Tax & GST`: HSN/SAC code 996511 (Goods Transport Agency), CGST 9%, SGST 9%, Place of supply 27-Maharashtra.
  - `Audit Trail`: Immutable timestamped logs of batch creation, verification locks, and admin approvals.
- **Workflow Progression Visualizer (4-Step Horizontal Stepper):**
  1. `1. Consolidated` (✓ Rohan M. • 14 Oct, completed state)
  2. `2. Sign-Off` (2 Pending Approval, active pulsing state)
  3. `3. Dispatch` (3 locked, WhatsApp / Email automated delivery)
  4. `4. Payout Match` (4 locked, NEFT Virtual Account auto-reconciliation)
- **Financial Itemization Card:**
  - Trip verification pill: `12 Trips • 100% POD Verified`.
  - Billing Cycle: `01 Oct 2026 – 14 Oct 2026 (Fortnightly)`.
  - Base Freight: `₹9,20,000.00`.
  - Loading & Detention Surcharge: `+₹30,000.00`.
  - Subtotal Taxable Value: `₹9,50,000.00`.
  - Central GST (CGST 9.0%): `+₹85,500.00`.
  - State GST (SGST 9.0%): `+₹85,500.00`.
  - Total Payable Box: Highlighted container with `TOTAL PAYABLE: ₹11,21,000` and `Net 30 Days (Due 13 Nov 2026)`.
- **Remittance Virtual Bank (Auto-Reconciliation):**
  - Displays exclusive HDFC Virtual Account (`VA-HIRED-SHARMA`) and IFSC (`HDFC0000060`).
  - One-click copy button with clipboard toast notification.
- **Action Triggers & Statutory Footnote:**
  - `Verify & Approve Invoice`: Primary CTA advancing the invoice to Step 3 and releasing IRN generation.
  - `Request Revision`: Rejection workflow sending the batch back to Ops Admin with reason categorization.
  - `Preview Full PDF`: Opens official printable tax invoice document preview.
  - Statutory note: "Authorized under GST Rule 46 • IRN generation triggered upon Step 2 approval."

### 10.6 Interactive Modal Dialogs
- **Create Consolidated Tax Invoice Modal:**
  - Enterprise client account picker, billing cycle date range, closed trips count, base freight, and demurrage inputs.
  - Live tax calculation engine computing 9% CGST, 9% SGST, and total invoice value.
  - Prepares draft invoice and queues it for two-step sign-off.
- **Request Revision Modal:**
  - Reason category picker (disputed detention, missing physical POD stamp, FASTag toll mismatch, incorrect GSTIN).
  - Admin audit notes and automatic status reset to `Revision Needed`.
- **Tax Invoice Document Preview Modal (GST Rule 46 Compliant):**
  - Official multi-section invoice layout with HireD supplier details, client billed-to and shipped-to particulars.
  - Mock NIC E-Invoice IRN hash, QR code, and acknowledgment number.
  - Itemized table with SAC Code 996511, rate, taxable freight, and split GST.
  - Virtual account remittance instructions and digital signature badge under the Information Technology Act, 2000.

---

## 11. Statements (Monthly Ledger & Settlements)

The Statements module governs partner account statements, periodic settlement cycles, multi-channel dispatch (Email & WhatsApp Bot), and ledger reconciliation for both B2B corporate enterprise shippers and registered fleet owners. Modeled faithfully after Stitch Design Reference 11 (`11._statements`), it provides automated fortnightly compilation (Cycle F1 / F2), ledger audits, automated delivery tracking, and virtual escrow remittance coordinates.

### 11.1 Module Header & Administrative Controls
- **Title & Pillar Badges:** Bold page title `Statements` accompanied by the purple category badge `MONTHLY LEDGER & SETTLEMENTS` and dynamic cycle indicator `Cycle: 01 Oct – 15 Oct 2026`.
- **Operational Subtitle:** "Generate, audit, reconcile, and dispatch consolidated billing and earnings statements for B2B enterprise clients and registered fleet owners."
- **Cycle Month Dropdown:** Historical cycle selector with calendar icon (`Cycle: Oct 2026 (F1)`, `Cycle: Oct 2026 (F2)`, `Cycle: Sep 2026 (F2)`).
- **Export Consolidated ZIP:** Generates a compressed batch archive of all compiled statement PDFs for enterprise audits.
- **Primary Action CTA (`Generate Statement Run`):** Opens the automated compilation execution modal for manual or scheduled fortnightly statement cycles.

### 11.2 Statutory Key Performance Indicators (KPIs)
1. **Statements Generated:**
   - Metric: `128` with cycle trend badge (`+14 this cycle`).
   - Partner breakdown: `84 Enterprise B2B · 44 Fleet Owners`.
   - Visual progress bar: 100% filled primary track.
2. **Consolidated Billing:**
   - Metric: `₹74,80,350` with billed percentage badge (`88.4% billed`).
   - Subtext: `Total freight billables across all routes`.
   - Visual progress bar: 88% filled secondary track.
3. **Pending Reconciliation:**
   - Metric: `08` with action needed badge (`Action Needed`).
   - Breakdown: `6 Unmatched UTRs · 2 Rate holds`.
   - Visual progress bar: 24% filled danger red track.
4. **Automated Dispatch:**
   - Metric: `116 / 128` with delivery rate badge (`90.6% Sent`).
   - Integration status: `Email trigger live · WhatsApp API synced`.
   - Visual progress bar: 91% filled primary track.

### 11.3 Pipeline Status Tabs & Multi-Filter Controls
- **5 Pipeline Categories with Live Count Pills:**
  - `All Statements (128)`: Complete statement universe across all accounts.
  - `B2B Companies (84)`: Enterprise shippers and corporate billing ledgers.
  - `Driver & Fleets (44)`: Registered fleet owners and vehicle payout statements.
  - `Pending (12)`: Newly compiled statements awaiting dispatch or review.
  - `Disputed (4)`: Statements flagged with POD, toll, or rate discrepancies.
- **Header Action Icons:**
  - `sync`: Real-time UTR payment callback sync with corporate banking nodes.
  - `tune`: Columns layout and field visibility toggle.
- **Search & Dropdown Controls:**
  - Search box with clear button matching Statement ID (`#STM-2026-1001`), partner name, GSTIN, or billing period.
  - Entity Type selector (`Entity: All Types`, `B2B Corporate`, `Fleet Operator`, `Individual Driver`).
  - Status selector (`Status: All`, `Dispatched`, `Draft Ready`, `Reconciled`, `Disputed (POD)`).

### 11.4 High-Density Statements Register Table (Left Column)
- **Table Columns:**
  - *Selection Checkbox:* Batch row selection with counter (`1 statement selected`).
  - *Statement / Date:* Bold statement identifier (`#STM-2026-1001`) with generation date (`15 Oct 2026`).
  - *Entity & GSTIN:* Enterprise partner (`Sharma Logistics Pvt Ltd`), 15-digit GSTIN (`27AABCS1429B1Z2`), and partner tier (`Prime`).
  - *Period / Trips:* Cycle date range (`01-15 Oct 2026`) and trip count (`18 Closed Trips`).
  - *Net Balance:* Closing balance (`₹10,41,000`) and balance classification (`Bal. Due` or `Payable (Credit)`).
  - *Status:* Color-coded status badge (`Dispatched`, `Draft Ready`, `Reconciled`, `Disputed (POD)`).
  - *Actions:* Quick icon triggers:
    - `download`: Download PDF statement.
    - `send`: Quick multi-channel dispatch via Email & WhatsApp.
- **Pagination Footer:** Range text (`Showing 1 to 5 of 128 statements`) with page buttons (`< 1 2 3 ... 26 >`).
- **Automated Fortnightly Settlement Cycle Banner:**
  - Bottom informational strip with `verified` icon pod, title, and `Cron Job: Active` badge.
  - Explanatory note: "Statements auto-compile on the 1st and 16th at 00:00 IST including all digital POD signatures, toll fastag surcharges, and debit notes."
  - `Configure Cron` direct action link.

### 11.5 360° Selected Statement Inspector & Dispatcher (Sticky Right Column)
- **Partner Header:**
  - Primary initials avatar pod (`SL`), verified company name (`Sharma Logistics Pvt Ltd`), statement ID, GSTIN, and credit terms badge (`Net 30`).
  - Action buttons: Download PDF (`picture_as_pdf`), Share via WhatsApp (`share`), and More Options (`more_vert`).
- **Status Alert Ribbon:**
  - Validated status container with check icon: `Statement Validated & Ready`.
  - Subtitle: `Dispatched to accounts email · WhatsApp ready`.
  - Cycle indicator tag: `Cycle F1`.
- **Subtabs:**
  - `Summary`: Full ledger breakdown, multi-channel status, and remittance coordinates.
  - `Trips (18)`: Closed trip routes, vehicle specs, and verified digital POD flags.
  - `Credits Received`: Inward CMS NEFT payments, bank transaction refs, and adjustments.
  - `Audit Trail`: Chronological timeline of compilation cron runs and client AP email opens.
- **Financial Statement Ledger Breakdown:**
  - `Opening Balance Carried Forward`: `₹2,40,000`.
  - `New Freight Debits (18 Trips)` with `e-POD verified` badge: `+₹11,21,000`.
  - `Toll FASTag & En-Route Surcharges`: `+₹45,000`.
  - `NEFT CMS Payment (Ref: CMS-883910)` (highlighted blue line): `-₹3,50,000`.
  - `Delay Waiver / Claim Adjustment (#TRP-10440)`: `-₹15,000`.
  - **Net Closing Balance Due Box:**
    - Due Date: `30 Oct 2026 (15 Days buffer)`.
    - Final Amount: `₹10,41,000`.
    - Tax note: `Includes 18% GST (RCM)`.
- **Multi-Channel Delivery Status:**
  - **Email Sent Card:** `mail` icon, blue active dot, recipient `accounts@sharma.in`, timestamp `15 Oct, 09:30 AM (Opened)`.
  - **WhatsApp Bot Card:** `chat` icon, gray dot, recipient `+91 98765 43210`, status `Ready to Trigger`.
- **Virtual Escrow Remittance Coordinates:**
  - Dedicated auto-reconciliation box with `Auto-Reconcile Enabled` tag.
  - Virtual A/C No: `VA-HIRED-SHARMA`.
  - Bank & IFSC: `HDFC Bank · HDFC0000060`.
- **Action Triggers & Statutory Disclaimer:**
  - `Trigger WhatsApp & Resend Email`: Primary dispatch button with paper plane icon.
  - `Preview PDF`: Opens official printable statement preview document.
  - `Lock / Flag Discrepancy`: Red flag action to pause automated dispatch upon customer dispute.
  - Statutory note: `GST Rule 47 & RBI Settlement Standards`.

### 11.6 Interactive Modal Dialogs
- **Generate Statement Run Modal:**
  - Cycle selector (`Oct 2026 F1 / F2`), entity scope (`All Partners`, `Enterprise B2B`, `Fleet Owners`), and e-POD validation enforcement.
- **Flag Discrepancy Modal:**
  - Reason categorization (missing e-POD seals, unmatched UTR, demurrage disputes, FASTag discrepancies) with audit notes and dispatch pause.
- **Statement Document Preview Modal:**
  - Full-page printable statement certificate displaying supplier details, recipient metadata, itemized ledger entries, net closing due, and virtual remittance instructions under GST Rule 47.

---

## 12. Operational Reports & Analytics (Operational & Financial Intelligence)

### 12.1 Overview & Architecture
The **Operational Reports & Analytics** module delivers cross-sectional business intelligence and telemetry analytics across freight billing, partner disbursal velocity, corridor SLA adherence, fleet tonnage utilization, enterprise escrow exposure, and carrier service quality.

### 12.2 Header & Controls Toolbar
- **Module Title:** `Reports & Analytics`
- **Sub-tag Badge:** `OPERATIONAL & FINANCIAL INTELLIGENCE`
- **Description:** "Consolidated freight revenue analysis, fleet utilization, corridor transit times, and carrier performance metrics."
- **Interactive Toolbar Controls:**
  - **Date Preset Range Trigger:** Default `01 Oct 2026 – 31 Oct 2026` with calendar icon and dropdown options (`Oct 2026 Full Month`, `Last 30 Days`, `Last Quarter`, `All History`). Maps to backend `?date_range=` query param.
  - **Corridor Scope Select:** Dropdown filter with route icon (`All Corridors & Hubs`, and dynamically registered routes). Maps to backend `?corridor=` query param.
  - **Refresh Metrics Button:** Direct trigger updating metrics live from database models.
  - **Export CSV Button:** Standard `download` action exporting live executive KPIs, top performing corridors, and enterprise shipper accounts directly to CSV.

### 12.3 Metric KPI Bento Grid (4 Cards)
1. **Total Billed Revenue:**
   - Metric: `₹1,24,85,000` with positive growth badge `+14.8%`.
   - Subtitle: `Gross freight invoices across enterprise accounts`.
   - Target progress: `Target ₹1.35 Cr (FY26 Q3)` with `92.4%` progress bar.
2. **Completed Trips:**
   - Metric: `1,248` with month-over-month growth badge `+9.2% MoM`.
   - Subtitle: `98.2% completion rate • trips currently in-transit`.
   - Status strip: `On-Time` (green dot) · `Delay` · `Disputed` (red).
3. **Fleet Utilization:**
   - Metric: `86.4%` with efficiency badge `+3.1% Eff.`.
   - Subtitle: `Active drivers of onboarded commercial fleet capacity`.
   - Turnaround indicator: `Avg Turnaround Cycle: 4.8 Hours`.
4. **Platform Gross Margin:**
   - Metric: `₹18,72,750` with net take badge `15.0% Net Cut`.
   - Subtitle: `Partner disburse: 85.0% split per PRD §5.4`.
   - Compliance note: `Zero settlement deficit across accounts` with verified badge.

### 12.4 Segmented Analytics Navigation Bar
- 4 View Tabs (PRD A-13 Aligned):
  - `Executive Overview` (`analytics` icon)
  - `Revenue & Billing` (`payments` icon)
  - `Trip Operations` (`local_shipping` icon)
  - `Client Volume` (`domain` icon)
- Right indicator: `Live Database Pipeline` with active green pulsing beacon.

### 12.5 Left Column: Core Velocity & Route Intelligence (approx 65% width)
1. **Freight Billing vs Net Payout Velocity (Vector Visual Chart):**
   - Header with weekly billing pace vs driver disbursals across current month.
   - Series toggles: `Gross Invoiced` (active blue), `Driver Net` (secondary slate), `Platform Take (15%)` (outline).
   - Canvas: Background gridlines with dashed `Target Pace ₹32.0L / Wk` benchmark line.
   - SVG spline area curves with gradient fill and driver payout dashed trajectory.
   - Interactive Tooltip Overlay on scrubbing across daily/weekly points.
   - Chart Footer KPI Strip with ticket size, peak day, and net retained margin.

2. **Top Performing Corridors & SLA Adherence (Dense Tabular Grid):**
   - Live route hub search box (`Search route hub...`).
   - Columns (Clean, PRD A-13 compliant):
     - `Corridor & Route Hub`: Origin ➔ Destination pins (`Pune ➔ Nashik`, `Mumbai ➔ Surat`, etc.).
     - `Trip Volume`: Count with horizontal progress bar.
     - `Freight Value`: Tabular numeric GMV (e.g. `₹38,40,000`).
     - `Avg Transit Duration`: Transit hours with target annotation.
     - `On-Time SLA`: Compliance badge with check icon.

### 12.6 Right Column: Distribution & Risk Widgets (approx 35% width)
1. **Fleet Category Mix (Tonnage Donut Chart):**
   - Header with vehicle tonnage GMV and volume breakdown.
   - SVG Donut ring with center counter: Total Trips.
   - Vehicle category slices with interactive legend.

2. **Enterprise Account Exposure (Client Concentration & Billing Status):**
   - Header with `View All` enterprise accounts link (`/companies`).
   - Client cards showing revenue contribution, booking count, and compliance badge.

3. **Carrier Earning & Quality Index (2x2 Matrix):**
   - `Active Driver Fleet`: Document-verified active commercial drivers.
   - `Delivery SLA Fulfillment`: Consignment compliance across completed trips.
   - `Wallet Credit Reliability`: 100% split credited atomically upon OTP delivery closure (PRD §5.4).
   - `Discrepancy / Incident Ratio`: Zero dispute rate verified against electronic proof of delivery.

### 12.7 Operational Intelligence Sync Banner
- Bottom operational synchronization strip.
- Rotating sync emblem and status indicator.
- Explanatory note: "Consolidated freight revenue analysis, fleet utilization, and corridor fulfillment metrics synchronized directly from live Order, Trip, and Invoicing records."
- Action button:
  - `Refresh Metrics Now` (`refresh` icon).

## 13. Performance Analytics (Client Booking Velocity & Fleet Capacity Intelligence)

### 13.1 Overview & Architecture
The **Performance Analytics** module (`/analytics`) delivers high-resolution operational and predictive intelligence on enterprise booking cadence, tonnage payload saturation, warehouse loading dock turnaround times, and deadhead empty miles optimization. It bridges real-time dispatch telemetry with historical cohort analytics to help operations dispatchers, logistics managers, and executives anticipate corridor capacity shortages, balance fleet allocation, and minimize turnaround latency.

### 13.2 Header & Analytics Control Toolbar
- **Title & Badge:** `Performance Analytics` with prominent subtitle: `Client booking velocity, tonnage payload density & warehouse dwell cycle intelligence`.
- **Category Pill:** `INTELLIGENCE & PREDICTIVE CAPACITY ENGINE` with `insights` icon.
- **Timeframe Horizon Filter:**
  - Presets: `Today (Live Telemetry)`, `Last 7 Days (WoW Pacing)`, `Current Month (01-31 Oct 2026)` (default), `Q3 FY26 Trajectory`, `Custom Window`.
- **Cohort Comparison Dropdown:**
  - Options: `vs Previous Period (MoM)`, `vs Target Optimization Model`, `vs Q2 FY26 Historical Baseline`.
- **Fleet Category Filter:**
  - Options: `All Tonnages & Cohorts`, `Heavy Commercial (32T/24T)`, `Reefer Cold Chain`, `Medium Commercial (14T/16T)`, `Express Light Open/Closed`.
- **Action Triggers:**
  - `Export Cohort Analytics` (`file_download` button) opening multi-metric data exporter.
  - `Simulate Demand Surge` (`rocket_launch` primary CTA) launching interactive what-if capacity modeling engine.

### 13.3 Executive Performance Key Performance Indicators (4-Card Bento Grid)
1. **Client Booking Velocity & Pacing:**
   - Primary metric: `42.6 Loads / Day` with `+18.4% WoW` acceleration badge.
   - Subtext: `Avg time-to-dispatch: 14.2 mins (Target < 20m)`.
   - Micro-metric: `1,280 Total Bookings logged across Oct 2026`.
2. **Tonnage Capacity Utilization & Payload Density:**
   - Primary metric: `88.7% Capacity Filled` with `+4.2% Eff.` badge.
   - Subtext: `3,840 MT moved of 4,330 MT active vehicle payload capacity`.
   - Mini-bar indicator: `5.8% Deadhead (Empty Miles)` vs 12.0% industry benchmark.
3. **Hub Loading Dwell & Turnaround Cycle:**
   - Primary metric: `2.4 Hours Avg Dwell` with `-26m Improved` green indicator.
   - Subtext: `Dock-to-gate turnaround across 38 hub fulfillment centers`.
   - Breakdown: `Docking (42m)`, `Loading & Lashing (1h 18m)`, `Gate Release (24m)`.
4. **Enterprise Retention & Cohort Expansion:**
   - Primary metric: `94.2% Repeat Rate` (`72 of 76 Active Accounts`).
   - Subtext: `Net Revenue Retention: 114.8% NRR (Zero accounts in churn risk)`.
   - Status badge: `Verified zero customer order attrition in active quarter`.

### 13.4 Segmented Analytics Dimension Navigation Bar
- 4 Primary Analytic Views:
  - `Velocity & Demand Curves` (active, `trending_up` icon)
  - `Fleet Tonnage & Deadhead` (`local_shipping` icon)
  - `Hub Dwell & Turnaround` (`schedule` icon)
  - `Enterprise Booking Retention` (`hub` icon)
- Right indicator: `Live Telemetry Frequency: 30s Realtime Engine` with pulsing green beacon.

### 13.5 Left Column: Velocity Curves & Dwell Benchmarks (approx 65% width)
1. **Client Booking Velocity & Fulfillment Pacing (Interactive SVG Visual Chart):**
   - Header with dynamic daily booking pace, confirmed dispatch line, and capacity threshold.
   - Interactive day-by-day cursor crosshairs with live date, confirmed loads, dispatched tonnage, and fulfillment SLA.
   - Series toggles: `Confirmed Bookings` (electric cyan `#00a8ff`), `Fulfilled Loads` (deep indigo `#5145f5`), `Capacity Ceiling` (dashed slate line).
   - Timeframe range tabs: `All (31 Days)`, `Week 1`, `Week 2`, `Week 3`, `Week 4`.
   - Milestone nodes with peak surge annotation (`Surge Event: Pre-Festive Logistics Peak +38% on Oct 15`).
   - Footer KPI Strip: `Peak Velocity: 68 loads/day`, `Fulfillment SLA: 99.1%`, `Dispatch Latency: 14.2m`.

2. **Hub Loading Dwell & Turnaround Benchmark (Interactive Comparative Bar Chart):**
   - Comparative dwell duration across key logistics hubs (Pune Logistics Park, Bhiwandi Central, Surat GIDC, Delhi Okhla, Hyderabad Patancheru, Ahmedabad Sanand).
   - Color-coded benchmarks: `< 2.5h Optimal` (green), `2.5-3.5h Normal` (amber), `> 3.5h Congestion Alert` (red).
   - Interactive bar hover showing detailed breakdown (Queue, Loading, Lashing, Paperwork/e-Way).

### 13.6 Right Column: Efficiency & Bottleneck Widgets (approx 35% width)
1. **Fleet Deadhead & Empty Miles Optimizer (Visual Radial Meter):**
   - Circular efficiency dial displaying deadhead mileage percentage (`5.8%`).
   - Category breakdown: Heavy (4.2%), Reefer (7.1%), Medium (5.4%), Express (8.9%).
   - Estimated monthly savings: `₹4,20,000 Saved` through automated triangulated backhauls.
2. **Corridor Capacity Bottleneck Radar:**
   - Real-time capacity saturation across high-density lanes:
     - `Pune ➔ Nashik`: `94% Saturated` (`HIGH DEMAND - 8 Drivers Needed`).
     - `Mumbai ➔ Surat`: `82% Normal` (`Optimal Balance`).
     - `Delhi NCR ➔ Jaipur`: `76% Capacity` (`Surplus 6 Trucks`).
     - `Hyderabad ➔ Warangal`: `89% Tight` (`2 Loads Queued`).
3. **Enterprise Demand Concentration Matrix:**
   - Top 4 demand drivers with weekly booking acceleration:
     - `Sharma Logistics`: 38 loads/wk (+12%) · SLA 98.4%.
     - `Bluestone Cements`: 28 loads/wk (+8%) · SLA 94.0%.
     - `Nova Cold Chain`: 24 loads/wk (+22% Surge) · SLA 99.1%.
     - `Trident Pharma`: 18 loads/wk (Steady) · SLA 92.5%.

### 13.7 Interactive Modal Dialogs
- **Simulate Demand Surge Modal:**
  - Interactive what-if simulation tool enabling dispatch managers to test 20%, 40%, or 60% demand spikes across designated corridors.
  - Calculates required incremental driver headcount, expected deadhead impact, and simulated gross margin expansion.
- **Cohort Deep Dive Modal:**
  - Comprehensive inspection drawer for any selected enterprise client or hub detailing booking cadence, dwell distribution, vehicle allocation, and cancellation rates.
- **Export Cohort Analytics Modal:**
  - Multi-dimensional data export compiler with checkboxes for Velocity, Payload Density, Dwell Times, and Deadhead savings formatted in CSV, XLSX, or PDF.

---

## 14. Section 14: Notification Center & Incident Activity Stream (System Alerts & Incident Operations)

The Notification Center functions as the real-time operational air-traffic control room and incident dispatch console for HireD logistics administrators. It aggregates mission-critical telemetry anomalies, carrier compliance expirations, corridor SLA transit delays, financial settlement holds, and webhook delivery lifecycles into a unified dual-pane incident command center.

### 14.1 Key Visual Design & Philosophy
- **Reference Specification:** Matches the Stitch reference design (`13._notifications_activity_center/screen.png` and `code.html`).
- **Dual-Pane Operations Workspace:** Left dominant event stream (approx 65% width) paired with a high-fidelity right alert inspector & action console (approx 35% width).
- **Incident Escalation Color Coding:**
  - `Critical / SLA Breach`: Crimson Red (`#ba1a1a` / `#ffdad6`) with pulsing alert beacons.
  - `Compliance Warning`: Amber / Ochre (`#b45309` / `#fef3c7`) for regulatory expirations (≤ 7 days).
  - `Financial & Escrow Webhooks`: Slate Indigo (`#5145f5` / `#c9d3fe`) for IMPS/NEFT disbursals.
  - `Operations Broadcast / Success`: Emerald Green (`#059669` / `#d1fae5`) for reconciled batches and corridor broadcasts.
- **Live Stream Engine:** Auto-polling toggle (10s pulse) with real-time stream connectivity indicator.

### 14.2 Top Command Header & Real-Time Telemetry Bar
- **Page Title:** `Notifications & Activity Center` with badge pill `REAL-TIME OPS & COMPLIANCE TELEMETRY`.
- **Subtitle:** `Live event stream, critical operational alerts, SLA tolerance warnings, carrier compliance expirations, and financial webhook triggers.`
- **Quick Action Controls:**
  - Shift / Timeframe Selector dropdown: `Last 24 Hours`, `Last 6 Hours`, `Last 7 Days`, `Current Shift (08:00 - 20:00)` with green pulsing real-time stream status dot.
  - `Mark All Read` button with `done_all` icon and instant badge clearing.
  - `Channels` pill button displaying active notification delivery adapters (`4` active channels: In-App, WhatsApp, SMS DLT, Webhook).
  - `Alert Rules & Subscriptions` primary button opening the automated policy rule engine modal.
  - `Broadcast Fleet Alert` button enabling immediate corridor-wide emergency announcements.

### 14.3 4-Card Alert Summary Bento Grid
1. **Critical Alerts:**
   - Big Metric: `05` with `Action Required` crimson badge and left red accent bar.
   - Header: `CRITICAL ALERTS` with `warning` symbol in circular container.
   - Subtitle: `Immediate intervention needed`.
   - Footer metadata strip: `3 SLA breaches • 2 Bank verification fails`.
2. **Compliance Warnings:**
   - Big Metric: `12` with `≤ 7 Days Expiry` amber badge and left amber accent bar.
   - Header: `COMPLIANCE WARNINGS` with `shield_with_heart` icon.
   - Subtitle: `Document renewal required`.
   - Footer metadata strip: `8 Driver fitness • 4 Fleet insurance`.
3. **Financial & Webhooks:**
   - Big Metric: `148` with `99.4% Delivery` cyan/blue badge and left indigo accent bar.
   - Header: `FINANCIAL & WEBHOOKS` with `account_balance_wallet` icon.
   - Subtitle: `Auto-reconciled events today`.
   - Footer metadata strip: `₹48.2L settled • 0 dropped webhooks`.
4. **Operations Broadcasts:**
   - Big Metric: `24` with `Sync Active` emerald badge and left slate accent bar.
   - Header: `OPERATIONS BROADCASTS` with `campaign` icon.
   - Subtitle: `Dispatched to drivers & clients`.
   - Footer metadata strip: `WhatsApp & In-App push • 100% corridor reach`.

### 14.4 Left Pane: Event Stream & Filtered Activity Feed (approx 65% width)
1. **Segmented Navigation Tabs:**
   - `All Notifications` (189 total)
   - `Critical & SLA` (5 urgent)
   - `Compliance & KYC` (12 warnings)
   - `Finance & Payouts` (46 reconciled)
   - `Trip Telemetry` (98 live events)
   - `Webhooks` (28 delivery payloads)
2. **Advanced Filter & Controls Bar:**
   - Search input: `Search trip #, driver name, KYC ref, or error...` with instant dynamic filtering.
   - Severity filter dropdown: `All Severities`, `Critical Only`, `Warnings`, `Informational`.
   - Channel filter dropdown: `All Channels`, `System UI`, `WhatsApp Ops`, `SMS Gateway`, `REST Webhooks`.
   - Auto-poll status button: `Auto-poll 10s` with sync animation.
3. **Interactive Feed Card Stream:**
   - Each notification item displays:
     - Vertical left status indicator line (Red, Amber, Emerald, or Blue).
     - Circular categorized icon (`crisis_alert`, `credit_card_off`, `assignment_late`, `task_alt`, `swap_calls`).
     - Title, unread indicator dot, and status category badge (e.g. `SLA Exceeded`, `Bank Rejection`, `Expires 48h`, `Reconciled`, `CRM Milestone`).
     - Detailed incident narrative with highlighted identifiers (Trip number, vehicle number, driver name, location, amounts).
     - Bottom metadata pill: relative time (`12 mins ago`), corridor route, account name.
     - Inline context actions: `Assign Incident Manager`, `Review KYC & Retry`, `Ping WhatsApp`, `Live GPS`, `View Statement`, and dismiss (`close`).
     - Active selection state with distinctive blue ring highlighting and right-pane inspector binding.
4. **Pagination & Stream Status:**
   - Shows event range (`Showing 5 of 189 operational events`) with `← Newer` and `Older →` controls.

### 14.5 Right Pane: Selected Alert Deep-Dive & Action Console (approx 35% width)
1. **Alert Inspector & Action Console:**
   - Incident Header: `ALERT INSPECTOR & ACTION CONSOLE` with entity code (`Trip #TRP-10471`) and severity badge (`Critical Severity`).
   - Incident Metadata Grid: Corridor / Route, Driver In-Charge (with phone & rating), Assigned Vehicle, Consignor & Cargo, Current Delay Delta.
   - Telemetry Audit Trail (Step-by-step vertical timeline):
     - `11:45 AM`: Gurgaon Warehouse (Trip commenced, temp log 4.2°C).
     - `01:20 PM`: Passed Manesar Toll (Cruising speed 54 km/h).
     - `03:15 PM`: Speed Drop at Behror Bypass (Geofence dwell alert).
     - `03:40 PM`: Driver Mechanical Alert (FASTag blacklisted + brake sensor).
     - `04:02 PM`: Critical SLA Breach Event (Auto-escalation dispatched).
   - Automated Policy Action Triggers:
     - Client SMS & WhatsApp advisory dispatched.
     - Standby replacement Reefer Fleet located 22km away (Jaipur Shahpura Depot).
   - Incident Action Controls:
     - Primary: `Acknowledge & Dispatch Support Hub`
     - Secondary grid: `Call Driver Dinesh`, `Waive Penalty`
   - Internal Dispatch Audit Note:
     - Resolution comment input and `Post` button with immediate local audit addition.
2. **Quick Telemetry Map Card / Asset Snapshot:**
   - Precise GPS coordinates (`27.9821° N, 76.2214° E`).
   - Satellite corridor view showing vehicle halt point near Kotputli Toll Plaza with live pulsing beacon.

### 14.6 Bottom Notification Channels & Webhook Infrastructure Health Bar
- **Dispatcher Status:** Green status indicator: `All Event Dispatchers Operational`.
- **Infrastructure Metrics:**
  - `WhatsApp Business API:` 99.8% delivery (32ms avg)
  - `Webhook Gateway:` 0 failed retries
  - `SMS Tier-1 Route:` DLT Active
  - `Push Queue:` 4 Workers Active
- **Action Buttons:**
  - `Webhook Logs`: Opens the real-time REST webhook log modal.
  - `Configure Dispatch Webhooks`: Opens channel endpoint routing modal.

### 14.7 Interactive Modals & Drawers
1. **Alert Rules & Subscriptions Modal (`AlertRulesSubscriptionsModal.jsx`):**
   - Configures automatic trigger conditions (e.g. SLA tolerance breach > 60m, temperature excursion > 2°C, document expiry < 7d, payout gateway failure).
   - Enables channel dispatch toggles (WhatsApp, SMS, Email, In-app push, Webhook).
2. **Webhook Logs Viewer Modal (`WebhookLogsModal.jsx`):**
   - Inspects raw JSON event payloads, response status codes (`200 OK`, `504 Gateway Timeout`), response times, and retry histories.
3. **Broadcast Fleet Alert Modal (`BroadcastAlertModal.jsx`):**
   - Dispatches emergency highway alerts (e.g. weather advisories, toll plaza congestion, safety protocols) to selected vehicle categories and corridors.
4. **Channel Configuration Modal (`ChannelConfigModal.jsx`):**
   - Manages gateway credentials, DLT templates, SMTP server parameters, and endpoint retry limits.

---

# 15. Admin Users & Access Control (Enterprise RBAC & Governance)

The **Admin Users & Access Control** module provides mission-critical enterprise role-based access control (RBAC), multi-factor authentication (MFA) enforcement, staff directory governance, and granular permission scoping across all HireD operational hubs and corporate departments. Designed in strict compliance with the zero-trust security architecture and Stitch reference design (`14._admin_users_roles`), it enables super administrators to enforce the principle of least privilege, manage hardware FIDO2/TOTP credentials, assign geographic corridor bounds, and audit administrative actions across the platform.

```
+---------------------------------------------------------------------------------------------------------+
|                                  ADMIN USERS & ACCESS CONTROL HEADER                                    |
| [Admin Users & Access Control] [ENTERPRISE RBAC & GOVERNANCE]  (● MFA Enforced: 96%) [Roles ▼] [Export] [Invite User] |
+---------------------------------------------------------------------------------------------------------+
|                                         4-CARD BENTO KPI SUMMARY                                        |
|  [Total Admin Users: 28]    [System Roles: 06]      [Privileged Admins: 04]     [MFA Compliance: 96.4%] |
|  Active (+3 this mo)        Custom Matrix (100%)    Hardware Key (Zero-Trust)   1 Pending (24h Grace)   |
+---------------------------------------------------------------------------------------------------------+
| [Admin Users (28)]   [Roles & Permission Matrix (6)]   [Security & MFA Policies]   [API & Service Accounts (4)] |
+---------------------------------------------------------------------------------------------------------+
|                      DUAL-PANE WORKSPACE (ADMIN DIRECTORY + INSPECTOR PANEL)                            |
| +-------------------------------------------------------+ +-------------------------------------------+ |
| | LEFT PANE: Staff User Directory (approx 58-60%)       | | RIGHT PANE: User Permission Inspector    | |
| | [Search staff...] [All Hubs ▼] [Status: All ▼]        | | [Avatar RM] Rohan Mehta [Active Staff]    | |
| |-------------------------------------------------------| | rohan.m@hired.in • EMP-OPS-104            | |
| | [ ] User / Employee   Role & Scope  2FA   Active  Act | | Role: Senior Ops Manager • West Hub       | |
| | [x] Rohan Mehta       Sr Ops Mgr    TOTP  Now     ⚙ ⋮ | | [Revoke Session] [More ⋮]                 | |
| | [ ] Priya Nambiar     Fin Auditor   FIDO2 18m     ⚙ ⋮ | |-------------------------------------------| |
| | [ ] Vikramaditya S.   Super Admin   Yubi  2h      ⚙ ⋮ | | [Assigned Permissions] [Hubs (4)] [Audit] | |
| | [ ] Ananya Sengupta   Dispatcher    TOTP  45m     ⚙ ⋮ | |-------------------------------------------| |
| | [ ] Mohammed Faizal   Compliance    Pend  3h      ⚙ ⋮ | | Active Template: Senior Ops Manager v2.4  | |
| |-------------------------------------------------------| | [B2B Trips & Control Room] [Full Dispatch]| |
| | Showing 1 - 5 of 28 admin staff  [<] [1] [2] [3] [>]  | |  [x]View [x]Create [x]Edit [x]Dispatch [ ]| |
| |-------------------------------------------------------| | [Orders & Enquiries CRM] [Commercial]     | |
| | [🛡️ Enterprise RBAC Consensus Guardrail Advisory]     | | [Driver & Fleet Governance] [Ops Alloc]   | |
| | Dual-admin consensus logged to CloudTrail & SIEM      | | [Invoicing & Settlements] [2-Step Verif]  | |
| +-------------------------------------------------------+ | Secondary Verifier Limit: ≤ ₹15,00,000    | |
|                                                           | [Staff Security Parameters: VPN, Timeout] | |
|                                                           | [Save Adjustments]  [Reset]  [Suspend]    | |
|                                                           +-------------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
```

---

### 15.1 Header & Access Governance Toolbar
1. **Title & Enterprise Category Tag:**
   - Page Title: `Admin Users & Access Control`.
   - Category Badge: `ENTERPRISE RBAC & GOVERNANCE` with subtle indigo highlight.
   - Descriptive Subtitle: *"Configure role-based access control (RBAC), multi-factor authentication policies, administrative staff permissions, and departmental role templates across logistics operations."*
2. **Governance Status & Quick Action Controls:**
   - **MFA Policy Status Badge:** Interactive pill with pulsating emerald status dot: `MFA Policy Enforced (96% Compliant)`.
   - **Role Filter Dropdown:** Quick-switch filter with active counts (`All Roles (6 Active)`, `Super Admin (4)`, `Senior Ops Manager (7)`, `Finance Auditor (5)`, `Corridor Dispatcher (8)`, `Compliance Officer (4)`).
   - **Export Access Log Button:** Triggers modal to export system access logs in CSV, JSON, or Audit-ready PDF with cryptographic hash verification.
   - **Invite Admin User Button (Primary CTA):** Opens the staff invitation modal to onboard new administrative personnel with mandatory role template assignment, hub scoping, and MFA enrollment grace period.

---

### 15.2 4-Card Bento KPI Summary Grid
1. **Total Admin Users:**
   - Metric: `28 Active`
   - Trend Pill: `+3 this mo` (emerald up-trend badge).
   - Subtitle: `Across 5 operational hubs & HQ` (with apartment icon).
   - Visual Progress Bar: `88%` capacity utilization against licensed enterprise seats (32 seats total).
2. **System Roles Defined:**
   - Metric: `06 Roles`
   - Badge: `Custom Matrix` (secondary container pill).
   - Subtitle: `Super Admin, Ops Mgr, Auditor, Dispatcher +2` (with shield icon).
   - Visual Progress Bar: `100%` matrix integrity status.
3. **Privileged Admins:**
   - Metric: `04 Accounts`
   - Badge: `Hardware Key` (purple security badge).
   - Subtitle: `Strict zero-trust financial clearance` (with verified shield icon).
   - Visual Progress Bar: `14.2%` privileged account ratio to enforce minimal super-user exposure.
4. **MFA Compliance:**
   - Metric: `96.4%`
   - Badge: `1 Pending` (amber warning pill).
   - Subtitle: `27/28 Enrolled (Grace: 24h remaining)` (with timer alert).
   - Visual Progress Bar: `96.4%` emerald compliance bar.

---

### 15.3 Navigation Pill Tabs
1. **Admin Users (28) (Default View):**
   - Displays the dual-pane workspace containing the dense staff user directory table on the left and the interactive permission inspector & role editor on the right.
2. **Roles & Permission Matrix (6):**
   - Displays an enterprise capability matrix across all 6 predefined system roles (Super Admin, Senior Ops Manager, Finance Auditor, Corridor Dispatcher, Compliance Officer, Customer Support Lead) mapped across 14 operational modules with granular View, Create, Edit, Delete, and Authorize permissions.
3. **Security & MFA Policies:**
   - Manages zero-trust security parameters: mandatory FIDO2 hardware token enforcement, session idle timeout intervals, corporate VPN IP CIDR whitelisting, dual-approver consensus rules for high-value financial actions, and failed login lockout thresholds.
4. **API & Service Accounts (4):**
   - Governs automated machine-to-machine (M2M) service accounts and background integration daemons (e.g., FASTag Reconciliation Bot, Telematics Ingestion Daemon, Tally Prime ERP Bridge, Cognito Directory Sync), including client IDs, secret rotation timers, rate limits, and IP boundaries.
5. **Security Metadata Indicator (Right-aligned):**
   - Displays: `Policy Version: 2026.3-Gov • Sync: AWS Cognito Okta Bridge` with verified checkmark.

---

### 15.4 Left Pane: Staff User Directory & Filtering Table (approx 58-60% width)
1. **Directory Filter Bar:**
   - Search input: Real-time query matching across staff full name, work email, and employee ID (e.g. `EMP-OPS-104`).
   - Hub Scope Filter: Dropdown filtering by operational jurisdiction (`All Hubs & HQ`, `West Hub (Mumbai/Pune)`, `North Hub (Delhi NCR)`, `South Hub (BLR/Chennai)`, `HQ Executive`).
   - Status Filter: Dropdown filtering by account state (`Status: All`, `Active`, `Suspended`, `2FA Pending`).
2. **Dense Staff Directory Table:**
   - **Multi-select Checkbox:** Master toggle and individual row selection for batch administrative actions.
   - **User / Employee:** Circular avatar with user initials, full name, selected badge when focused, verified work email (`@hired.in`), and employee reference code (`EMP-xxx`).
   - **Role & Scope:** Color-coded role badge (e.g., `Senior Ops Manager`, `Finance Auditor`, `Super Admin`, `Corridor Dispatcher`), assigned operational hub, and concise permissions scope overview.
   - **2FA Status:** Verification icon and status badge (`Enforced` with `TOTP + Biometric`, `FIDO2 Key`, `YubiKey 5C`, or amber `Pending Setup` with grace period countdown).
   - **Last Active:** Relative activity timestamp (e.g., `Active Now` with pulsing green ping, `18m ago`, `2h ago`), along with corporate IP address or operational depot location.
   - **Actions:** Quick tuning icon (`tune`) to focus permissions in the inspector, and contextual options menu (`more_vert`) to edit, reset credentials, or suspend access.
3. **Table Pagination Footer:**
   - Displays current pagination status (`Showing 1 - 5 of 28 admin staff`) with interactive page controls (`chevron_left`, numbered pages `1`, `2`, `3`, `...`, `6`, and `chevron_right`).
4. **Enterprise RBAC Consensus Guardrail Advisory:**
   - Highlighted security advisory card with policy icon detailing: *"Any role privilege escalation, finance disbursement threshold modification, or deletion permission triggers a dual-admin consensus requirement and logs an immutable audit event directly to AWS CloudTrail & HireD SIEM archives."*

---

### 15.5 Right Pane: Selected User Permission Inspector & Role Matrix Editor (approx 40-42% width)
1. **Inspector Header & Identity Card:**
   - Large avatar initials pod, staff full name, active status pill (`Active Staff`), email and employee ID.
   - Assigned role badge and operational hub jurisdiction.
   - Quick console actions: `Revoke Session` (forces logout across all active browser and mobile sessions) and options dropdown (`more_vert`).
2. **Inspector Sub-Tabs:**
   - **Assigned Permissions:** Granular module permissions with live toggle checkboxes and privilege bounds.
   - **Hubs & Corridors (4):** Geographic corridor routing assignments and dispatch authorization radius.
   - **Audit Trail:** Immutable activity stream showing recent logins, IP changes, permission modifications, and administrative decisions by this user.
3. **Active Role Template Header:**
   - Displays current template version (e.g., `Template: Senior Ops Manager v2.4`) with `Switch Template` action.
4. **Granular Permissions Matrix by Operational Domains:**
   - **B2B Trips & Control Room:** Badge: `Full Dispatch`. Checkbox controls for `View`, `Create`, `Edit`, `Dispatch`, and disabled/struck `Delete`. Notes geographic corridor sector scope (`Mumbai, Pune, Surat, Nashik corridor sectors`).
   - **Orders & Enquiries CRM:** Badge: `Commercial Lead`. Checkbox controls for `View`, `Create`, `Edit`, and `Approve Quotes`.
   - **Driver & Fleet Management:** Badge: `Ops Allocated`. Checkbox controls for `View`, `Onboard`, `Assign`, and disabled `Blacklist` (with explicit advisory: *"Blacklisting restricted exclusively to Compliance Officer"*).
   - **Invoicing & Settlements:** Badge: `2-Step Verifier`. Checkbox controls for `View Invoices`, `Draft Review`, and restricted `Final Disburse`. Highlights disbursement limit constraint (`Secondary Verifier Limit: ≤ ₹15,00,000 / batch`).
5. **Staff Security Parameters Card:**
   - Password Rotation status (e.g., `Rotated 14 days ago`).
   - Session Timeout parameter (e.g., `30 min idle lock`).
   - IP Whitelist & Boundary subnet with strict enforcement badge (`103.21.54.0/24 (Corporate VPN)`).
6. **Inspector Action Controls:**
   - Primary: `Save Adjustments` (persists custom permissions modifications).
   - Secondary: `Reset` (restores default role template baseline).
   - Destructive: `Suspend Account` / `Re-activate Account` with instant status recalculation.

---

### 15.6 Full System Matrix & Secondary Tabs
1. **Roles & Permission Matrix View (`RolesPermissionMatrixWidget.jsx`):**
   - Full-width grid comparing all 6 system roles across 14 HireD operational modules:
     - Operations: Dashboard, Enquiries/CRM, B2B Trips, Orders, Drivers, Companies.
     - Finance: Accounts & Credit, Payouts, Invoicing, Statements.
     - Intelligence: Operational Reports, Performance Analytics.
     - Administration: Notification Center, Admin Users & Roles, Audit Logs, Settings.
   - Displays capability icons for View, Create, Edit, Delete, and Authorize.
   - Supports creating new custom role definitions and cloning existing templates.
2. **Security & MFA Policies View (`SecurityPoliciesWidget.jsx`):**
   - Zero-Trust Enforcement mode toggle.
   - Mandatory MFA requirement for all staff with 48h grace period before automated credential lock.
   - Session idle timeout dropdown (15m, 30m, 60m, 4h).
   - Dual-Admin Authorization Threshold (transactions exceeding ₹10,00,000 require approval from two level-3 administrators).
   - Corporate CIDR IP Boundary management with whitelist entries.
3. **API & Service Accounts View (`ApiServiceAccountsWidget.jsx`):**
   - Catalog of M2M integration bots:
     - `FASTag-AutoSync-Bot` (National Toll Reconciliation - Read/Write Trips).
     - `Telematics-Ingest-Worker` (GPS & OBD-II Telemetry - Write Telemetry).
     - `Tally-ERP-Bridge` (Ledger & GST Settlement Sync - Read/Write Invoicing).
     - `Cognito-Directory-Sync` (Enterprise Identity Bridge - Read Users).
   - Token lifecycle management, client key masking, regenerate secret action, and revoke button.

---

### 15.7 Interactive Modals & Governance Drawers
1. **Invite Admin User Modal (`InviteUserModal.jsx`):**
   - Inputs for First Name, Last Name, Work Email (`@hired.in`), Employee ID, Department, and Primary Role Template.
   - Hub and corridor scoping selector (HQ, West Hub, North Hub, South Hub, East Hub).
   - MFA Enrollment grace period selector (Immediate, 24 Hours, 48 Hours).
   - Form validation and instant optimistic directory addition.
2. **Edit User & Template Modal (`EditUserModal.jsx`):**
   - Fast modification of assigned role template, operational hub scope, account state (Active / Suspended / Restricted), and contact details.
3. **Manage Role Definition Modal (`ManageRoleModal.jsx`):**
   - Role creation and editing modal allowing super administrators to configure granular module permissions, approval limits, and role descriptions.
4. **Export Access Log Modal (`ExportAccessLogModal.jsx`):**
   - Selects export formats (CSV, JSON, Cryptographically-signed PDF), date range presets, and inclusion of IP addresses, MFA methods, and permission diffs.

---

# 16. Audit Logs & Security Telemetry (Immutable System Activity Trail)

The **Audit Logs & Security Telemetry** module provides an immutable, cryptographically signed operational ledger tracking system authentication events, privileged RBAC permission shifts, financial disbursements, rate card modifications, data exports, and operational overrides across all logistics subsystems. Designed for strict compliance with SOC2 Type II, ISO 27001, RBI payment aggregator directives, and MoRTH digital transport regulations, this module guarantees non-repudiation through SHA-256 Merkle chain verification, dual-key consensus tracking, and automated real-time dispatch to enterprise SIEM platforms (Splunk, Datadog, AWS CloudTrail).

```
+---------------------------------------------------------------------------------------------------------+
|                                AUDIT LOGS & SECURITY TELEMETRY HEADER                                   |
| [Audit Logs & Security Telemetry] [IMMUTABLE AUDIT TRAIL • SOC2 & ISO 27001] (Date ▼) (Prod ▼) [SIEM] [Verify] [Rule] |
+---------------------------------------------------------------------------------------------------------+
|                                         4-CARD BENTO KPI SUMMARY                                        |
|  [Total Events Logged]      [Privileged RBAC Shifts]  [Financial Mutations]     [Chain Integrity]       |
|  1,42,890 (+8.4%)           142 (4 Critical)          86 (100% Signed)          100% Valid (Merkle Root)|
+---------------------------------------------------------------------------------------------------------+
| [All Logs (1.42L)] [Privileged RBAC (142)] [Financial (86)] [Overrides (214)] [Auth (1.8K)] [Exports (19)] |
|                                                                        (● Live Tail: 5s Poll) [⏸ Pause] |
+---------------------------------------------------------------------------------------------------------+
| [🔍 Search Actor, IP, Resource ID...]   [Severity: All ▼]  [Role: All ▼]  [Status: All ▼]  [↺ Reset]     |
+---------------------------------------------------------------------------------------------------------+
|                      DUAL-PANE WORKSPACE (EVENT STREAM + DEEP-DIVE INSPECTOR)                           |
| +-------------------------------------------------------+ +-------------------------------------------+ |
| | LEFT PANE: Event Stream List (~62% width)             | | RIGHT PANE: Event Inspector (~38% width)  | |
| |                                                       | | [Event Inspector] [HIGH SEVERITY]         | |
| | [🛡️ RBAC_PERMISSION_ESCALATION] [Critical] [Dual-Sign]| | #EVT-2026-994182 • TraceID: trc_49f821    | |
| | Upgraded threshold to ₹15,00,000 / batch              | |-------------------------------------------| |
| | Actor: Vikramaditya Singh • IP: 103.21.54.12          | | Actor: Vikramaditya Singh (Super Admin)   | |
| | Target: Rohan Mehta (EMP-OPS-104 • West Hub)          | | FIDO2 YubiKey 5C • 103.21.54.12 (HQ-VPN)  | |
| |-------------------------------------------------------| |-------------------------------------------| |
| | [💳 PAYOUT_MANUAL_OVERRIDE] [Financial] [Reconciled]  | | State Mutation Payload (JSON Diff Viewer) | |
| | Released escrow hold for ₹42,800                      | | - "max_disbursement_limit": 500000        | |
| | Actor: Priya Nambiar • Target: Driver #DRV-2026-001   | | + "max_disbursement_limit": 1500000       | |
| |-------------------------------------------------------| | - "b2b_override_allowed": false           | |
| | [🏷️ RATE_CARD_DISCOUNT_APPLIED] [Commercial] [Approved] | + "b2b_override_allowed": true            | |
| | Applied 5% volume concession on Pune ➔ Nashik route   | |-------------------------------------------| |
| |-------------------------------------------------------| | Dual-Key Governance Consensus             | |
| | [📥 BULK_DATA_EXPORT_ATTEMPT] [Audit Flag] [DLP Mark] | | ✓ Initiator: Vikramaditya S. (Super Admin)| |
| | Exported 450 trip records to encrypted CSV            | | ✓ Co-Signer: Priya Nambiar (Head Finance) | |
| |-------------------------------------------------------| | [🔒 sig_sha256: 7e8d4a92c...39a1 (VALID)] | |
| | [⚠️ FAILED_LOGIN_MFA_LOCKOUT] [Security Block] [Chall]| |-------------------------------------------| |
| | 3 invalid TOTP attempts from untrusted IP             | | Downstream SIEM Dispatch:                 | |
| |-------------------------------------------------------| | Splunk: 200 OK • Datadog: Delivered      | |
| | Showing 1 - 5 of 1,42,890 events  [<] [1] [2] [3] [>] | | [Copy JSON] [View Trace] [Flag / Revoke]  | |
| |-------------------------------------------------------| +-------------------------------------------+ |
| | [🛡️ Immutable WORM Storage Architecture Notice]       |                                               |
| | AWS S3 Object Lock (Compliance Mode) - 7-Yr Retention |                                               |
| +-------------------------------------------------------+                                               |
+---------------------------------------------------------------------------------------------------------+
```

---

### 16.1 Header & Compliance Context Toolbar
1. **Title & Regulatory Governance Tag:**
   - Page Title: `Audit Logs & Security Telemetry`.
   - Security Badge: `IMMUTABLE AUDIT TRAIL • SOC2 & ISO 27001` with shield verification icon.
   - Subtitle: *"Cryptographically signed event ledger tracking system authentication, RBAC permission shifts, financial disbursements, rate card changes, and operational overrides."*
2. **Operations Controls:**
   - **Date Range Selector:** Temporal range selector (`Last 7 Days (08 Oct - 15 Oct 2026)`, `Last 24 Hours`, `Last 30 Days`, `Q3 FY26`, `Custom`).
   - **Environment Cluster Scope:** Node selector with active pulsating dot (`Prod (Cluster-AP-South-1)`, `Staging Enclave`, `DR Disaster Recovery Hot-Standby`).
   - **Export SIEM:** Triggers automated streaming export to Splunk Enterprise, Datadog Cloud SIEM, or AWS CloudTrail format.
   - **Verify Hash Chain:** Initiates client-side Merkle tree cryptographic verification of consecutive event SHA-256 block signatures.
   - **Create Rule CTA:** Opens the automated anomaly alert trigger builder for suspicious security patterns.

---

### 16.2 4-Card Bento KPI Summary Grid
1. **Total Events Logged:**
   - Metric: `1,42,890`
   - Trend Badge: `+8.4%` (up-trend indicator).
   - Subtitle: `Across 6 API microservices • 28 Admins` (with receipt icon).
   - Visual Progress Bar: `74%` logging capacity fill.
2. **Privileged RBAC Shifts:**
   - Metric: `142`
   - Badge: `4 Critical` (error container pill).
   - Subtitle: `Dual-signoff approval active for >₹10L bounds` (with admin shield icon).
   - Visual Progress Bar: `28%` threshold saturation.
3. **Financial Mutations:**
   - Metric: `86`
   - Badge: `100% Signed` (primary highlight pill).
   - Subtitle: `Wallet releases, tariff discounts, ledger credits` (with currency icon).
   - Visual Progress Bar: `95%` cryptographic signing completion.
4. **Chain Integrity:**
   - Metric: `100% Valid`
   - Icon: Pulsing green checkmark verification indicator.
   - Subtitle: `SHA-256 Merkle root validated 4m ago` (with shield icon).
   - Visual Progress Bar: `100%` green integrity bar.

---

### 16.3 Filter & Live Stream Controller Bar
1. **Category Tabs:**
   - `All Logs (1,42,890)`
   - `Privileged RBAC (142)`
   - `Financial Disbursals (86)`
   - `Trip & Rate Overrides (214)`
   - `Auth & SSO (1,840)`
   - `Data Exports (19)`
2. **Live Tail Stream Controller:**
   - Pulsing emerald live beacon: `Live Tail: 5s Poll`.
   - Stream toggle control: Pause / Resume live polling button (`pause_circle` / `play_circle`).

---

### 16.4 Search & Granular Filter Bar
1. **Full-Text Multi-Field Search:**
   - Matches Actor names, email addresses, employee IDs (`EMP-xxx`), client IP addresses, resource IDs (`TRP-10471`, `INV-2026-001`, `DRV-2026-001`), and event codes.
2. **Severity Dropdown:**
   - Options: `Severity: All`, `Critical`, `High`, `Medium`, `Low`, `Info`.
3. **Actor Role Dropdown:**
   - Options: `Role: All`, `Super Admin`, `Senior Ops Mgr`, `Finance Auditor`, `Corridor Dispatcher`, `Compliance Officer`.
4. **Outcome Status Dropdown:**
   - Options: `Status: All`, `Success & Flagged`, `Success`, `Security Blocked`, `Challenged`.
5. **Reset Filters Action:**
   - Quick reset button (`restart_alt`) restoring default telemetry stream parameters.

---

### 16.5 Left Pane: Audit Event Stream List (~62% width)
1. **Interactive Event Stream Cards:**
   - Highlighted card for active selection with subtle gradient boundary and elevation.
   - **Header Cluster:** Event icon, event code title (`RBAC_PERMISSION_ESCALATION`, `PAYOUT_MANUAL_OVERRIDE`, `RATE_CARD_DISCOUNT_APPLIED`, `BULK_DATA_EXPORT_ATTEMPT`, `FAILED_LOGIN_MFA_LOCKOUT`), severity pill, governance badge (`Dual-Signed`, `Reconciled`, `DLP Watermarked`, `Auto-Challenged`), timestamp (`15 Oct 2026, 14:32:18 IST`).
   - **Event Narrative:** Human-readable operational description with bold entity identifiers and financial thresholds.
   - **Footer Context Strip:**
     - Left: Actor avatar badge, name, employee ID, client IP address (`103.21.54.12`).
     - Right: Target entity code (`EMP-OPS-104`, `DRV-2026-001`, `B2B_TRIPS_ARCHIVE_Q3`) with forward chevron indicator.
2. **Pagination Footer:**
   - Displays current telemetry window (`Showing 1 – 5 of 1,42,890 recorded telemetry events`) with prev/next and page selectors.
3. **Compliance Notice Banner:**
   - Immutable WORM Storage Architecture advisory documenting AWS S3 Object Lock compliance retention for 7 years under RBI and MoRTH directives.

---

### 16.6 Right Pane: Selected Event Deep-Dive Inspector (~38% width)
1. **Inspector Header:**
   - Title: `Event Inspector` with severity badge (`HIGH SEVERITY`).
   - Event Code: `#EVT-2026-994182` with distributed Trace ID (`trc_49f821`).
   - Quick action: `Download Cryptographic Receipt` icon button.
2. **Actor Security Context Box:**
   - Actor initials avatar, full name (`Vikramaditya Singh`), title (`Super Admin • EMP-ADM-002`), MFA verification badge (`MFA Hardware Key`).
   - 4-cell security grid:
     - Client IP & Node: `103.21.54.12 (HQ-VPN)`
     - Device Fingerprint: `macOS Sonoma • Chrome 129`
     - Session Reference: `sess_8f912c40b`
     - Token Auth Mechanism: `FIDO2 YubiKey 5C (Biometric)`
3. **State Mutation Payload (JSON Diff Viewer):**
   - Syntax-highlighted JSON differential showing pre-mutation vs post-mutation object state.
   - Green highlight (`+`) for added keys / upgraded values.
   - Red highlight (`−`) for removed keys / superseded values.
4. **Dual-Key Governance Consensus:**
   - Initiator: `Vikramaditya S.` (Super Admin • 14:32:18 IST) with verified check.
   - Co-Signer: `Priya Nambiar` (Head of Finance • 14:33:02 IST) with verified check.
   - Cryptographic Hash Box: `sig_sha256: 7e8d4a92c10b8f391ad9821ef9a2c347...39a1 (VALID)`.
5. **Downstream SIEM Dispatch Status:**
   - Splunk Enterprise: `200 OK` (Green badge).
   - Datadog Cloud SIEM: `Delivered` (Blue badge).
6. **Action Controls:**
   - `Copy Raw JSON Event Payload` (copies event payload to clipboard).
   - `View Actor Full Session Trace (Vikramaditya S.)`.
   - `Flag for Security Review / Revoke Change` (triggers escalation workflow).

---

### 16.7 Interactive Modals & Tooling
1. **SIEM Streaming Export Modal (`ExportSiemModal.jsx`):**
   - Configures SIEM format (Splunk HEC, Datadog JSON, AWS CloudWatch, Raw Syslog RFC 5424).
   - Temporal range selection and cryptographic signature inclusion.
2. **Merkle Hash Chain Verification Modal (`VerifyHashChainModal.jsx`):**
   - Simulates block-by-block cryptographic verification of the SHA-256 Merkle tree root hash across the recent block window.
3. **Automated Audit Alert Rule Modal (`CreateAuditRuleModal.jsx`):**
   - Configures real-time alerts for anomalous patterns (e.g., after-hours payouts > ₹5L, multiple failed logins, off-VPN administrative sessions).

---

# 17. System Settings & Platform Configurations

The **System Settings & Platform Configurations** module serves as the mission-critical operational cockpit for HireD administrators to define and govern global platform parameters, corporate legal entities, dynamic freight tariff commission algorithms, automated escrow disbursement floors, AIS-140 government telematics gateways, external API webhooks, and communication routes.

---

### 17.1 Header Toolbar & Environment Metadata
1. **Context & Environment Meta:**
   - **Governance Pill:** `Platform Governance & Integrations`.
   - **Infrastructure Cluster Beacon:** `Cluster: AP-South-1 (Mumbai)` with a pulsating emerald beacon indicating live AWS multi-AZ synchronization.
   - **Last Config Sync Timestamp:** `Last Config Sync: 4 mins ago by Vikramaditya S.`.
2. **Module Title & Narrative:**
   - Title: `System Settings & Platform Configurations`.
   - Narrative: *"Manage global platform parameters, corporate entity billing coordinates, default freight commission margins, automated escrow triggers, API webhook gateways, and notification rules."*
3. **Action Controls:**
   - `Export Config JSON`: Downloads an immutable cryptographic JSON snapshot of all active runtime configuration trees.
   - `Save All System Changes`: Primary CTA with verified badge to commit modified platform parameters with dual-signatory audit attestation.

---

### 17.2 Platform Key Performance Metrics (Bento KPI Cards)
A responsive 4-column Bento KPI grid displaying runtime platform baselines:
1. **Default Platform Take:**
   - Value: `15.0%` with `Target Cut` badge.
   - Subtitle: *"Applied across non-custom enterprise contracts"*.
   - Icon: `percent`.
2. **Corridors Configured:**
   - Value: `38 Active` with `5 Hubs` badge.
   - Subtitle: *"Spanning West, North, South & East logistics nodes"*.
   - Icon: `alt_route`.
3. **Payment & FASTag:**
   - Value: `4 Gateways` with `100% SLA` badge.
   - Subtitle: *"ICICI CMS, HDFC Escrow, NETC, RazorpayX"*.
   - Icon: `check_circle`.
4. **Config Immutable Hash:**
   - Value: `v2.8.4-prod` with `SOC2` badge.
   - Subtitle: `sha256:4a8f9c2d1840e7...` (Merkle tree root hash).
   - Icon: `security`.

---

### 17.3 Settings Navigation Tabs
Horizontal scrollable pill navigation with dedicated icons and active focus states:
1. `General & Entity Profile` (`domain`): Corporate entity billing data, tax coordinates, brand logo mark, and hub regional nodes.
2. `Freight Commission & Rate Cards` (`receipt_long`): Platform take slider (8%–25%), detention surcharge, minimum corridor base fare, and diesel indexing.
3. `Payment Gateways & Escrow` (`account_balance_wallet`): e-POD instant release, single admin payout cap, wallet trip buffer, and FASTag auto-recharge.
4. `Fleet Telemetry & GPS` (`sensors`): AIS-140 GPS tracking adapters, government National Permit gateways, and gateway ping diagnostics.
5. `Messaging & Alerts` (`chat`): WhatsApp Cloud API, DLT SMS telemarketer gateways, Telegram critical incident bot, and escalation matrix.
6. `Security & Audit Defaults` (`verified_user`): Session idle timeouts, mandatory MFA policy, SOC-2 audit logging levels, and VPN IP whitelisting.

---

### 17.4 Corporate Entity & Operational Profile (General Tab)
1. **Legal Identity Box:**
   - Status badge: `PAN Verified` (Government MCA verified).
   - Brand Mark Pod: HireD Logistics Brand Mark with `Change Logo` and `Remove Logo` actions.
2. **Form Fields:**
   - **Company Legal Name:** `HireD Logistics Private Limited`
   - **Registered GSTIN (India):** `32AAACH2941K1Z5` (Kerala GST jurisdiction)
   - **Support & Billing Email:** `admin@hired.in`
   - **Central Dispatch Hotline:** `+91 98765 43210`
   - **Registered HQ Address:** `Infopark Kochi, Phase II, Kakkanad, Kochi, Kerala - 682042`
3. **Active Regional Logistics Hubs:**
   - Interactive corridor nodes: `West Hub (Mumbai / Pune)`, `North Hub (Delhi NCR)`, `South Hub (Bengaluru / Kochi)`, `East Hub (Kolkata)`.
   - `+ Add Corridor Node` CTA to register new freight corridors and dispatch hubs.

---

### 17.5 Global Freight Commission & Tariff Rules (Freight Tab)
1. **Interactive Platform Commission Slider:**
   - Default Take: `15.0% (Standard Tier)` with real-time range slider (8.0% to 25.0%).
   - Range labels: `Min Baseline (8.0%)`, `Nominal Average (15.0%)`, `Enterprise Max (25.0%)`.
2. **Parameters Grid:**
   - **Driver Wallet Instant TDS Deductions:** `1.5% TDS (Sec 194C) + 18% GST on Fee` (automated filing under individual driver PAN).
   - **Minimum Corridor Base Fare:** `₹4,500 / 100km Base Payload` (minimum gross commercial freight allocation).
   - **En-Route Detention / Dwell Surcharge:** `₹350 / hr after 3 hours dwell` (auto-calculated via GPS geo-fence entry/exit).
3. **Automated Indices:**
   - **Fuel Price Surcharge Auto-Indexing Toggle:** Automatically recalibrates freight rates when regional diesel fluctuates ±3%.

---

### 17.6 Escrow, Disbursal & FASTag Automation (Gateways & Escrow Tab)
1. **Automated Wallet Release:**
   - Toggle: `Auto-Disburse to Driver Wallet on e-POD Verification` (Instantly clears remaining balance via ICICI Bank Connected Banking when consignee signs electronically).
2. **Financial Guardrails:**
   - **Single Admin Payout Cap:** `₹5,00,000` (>₹5L requires dual sign-off).
   - **Driver Wallet Trip Floor:** `₹1,500` (Mandatory buffer for trip lock).
   - **FASTag Auto-Topup Trigger:** `Recharge ₹2,500 < ₹800` (Direct debit from HireD Escrow).

---

### 17.7 Fleet Telemetry & AIS-140 GPS Gateways (Fleet Telemetry Tab)
1. **Certified Tracking Adapters:**
   - `Ping Devices` telemetry health refresh button.
   - **Minda AIS-140 VTS Stream:** Active on 412 Commercial Units (`Active` badge).
   - **AWS Location Fleet Tracking:** Real-time Vehicle GPS Streams (`Active` badge).

---

### 17.8 Operational Inspector Widgets (Secondary Column)
1. **Integration Status Card:**
   - Real-time connectivity monitor with live diagnostics across core infrastructure and third-party services (AWS RDS, S3, SES, SNS, AWS Location, Platform Cache).
3. **Maintenance & Memory Flush (Danger Zone):**
   - **Platform Maintenance Mode Toggle:** Temporarily locks out dispatcher consoles during hotfix deployments.
   - **Purge Redis Config Key-Store:** Clears edge cache and invalidates stale configuration trees.
   - **Re-initialize Pricing Engine Matrix:** Recalculates all active corridor tariffs and dynamic multiplier matrices.
   - Notice: *"All configuration overrides are cryptographically recorded in the SOC-2 immutable audit trail."*

---

### 17.9 Sticky Confirmation Action Bar (Dirty State)
Appears dynamically at the bottom of the viewport whenever runtime settings are modified:
- Pulsing primary status beacon.
- Notice: `Unsaved Configuration Changes Pending: Modified settings require commit.`
- `Discard Changes` revert button.
- `Save & Apply Changes` primary commit button with cryptographic confirmation.

---

### 17.10 Full ASCII Layout Architecture
```
+----------------------------------------------------------------------------------------------------------+
|  HireD OPS                                             [Search trips, settings... Cmd+K]  (AO) Admin/Ops  |
+----------------------------------------------------------------------------------------------------------+
|  [Platform Governance & Integrations] (•) Cluster: AP-South-1 (Mumbai) • Last Sync: 4m ago                |
|  System Settings & Platform Configurations                      [Export Config JSON] [Save All Changes]  |
|  Manage global platform parameters, corporate entity billing coordinates, freight margins & webhooks...   |
+----------------------------------------------------------------------------------------------------------+
|  [ Default Platform Take ] [ Corridors Configured ] [ Payment & FASTag ] [ Config Immutable Hash ]       |
|    15.0% [Target Cut]        38 Active [5 Hubs]       4 Gateways [100%]    v2.8.4-prod [SOC2]            |
+----------------------------------------------------------------------------------------------------------+
|  [General Profile] [Freight & Tariffs] [Gateways & Escrow] [Fleet Telemetry] [Messaging] [Security]     |
+---------------------------------------------------------------------+------------------------------------+
|  PRIMARY SETTINGS COLUMN (8 COLS)                                    | INSPECTOR COLUMN (4 COLS)          |
|                                                                     |                                    |
|  Section 1: Corporate Entity & Operational Profile [PAN Verified]    | +-- Integration Status (5 Healthy)-+
|  [Logo Pod] HireD Logistics Brand Mark  [Change Logo] [Delete]      | | (•) ICICI Corporate CMS   82ms   |
|  - Company Legal Name: HireD Logistics Private Limited              | | (•) NETC FASTag NPCI Switch      |
|  - GSTIN: 32AAACH2941K1Z5       - Support Email: admin@hired.in     | | (•) Meta WhatsApp Cloud API      |
|  - Central Hotline: +91 98765   - Registered HQ Address: Kochi...   | | (•) DLT SMS Telemarketer Route   |
|  - Active Hubs: [West Hub] [North Hub] [South Hub] [East] [+ Node]  | | (•) Splunk SIEM Telemetry        |
|                                                                     |                                    |
|  Section 2: Global Freight Commission & Tariff Rules [Auto-Enforce] | +-- Maintenance & Flush (Danger) --+
|  - Platform Cut Slider: [======O=====] 15.0% (Standard Tier)        | | [ ] Platform Maintenance Mode    |
|  - TDS Deductions: 1.5% TDS + 18% GST on Fee                        | | [ Purge Redis Config Key-Store ] |
|  - Base Fare: ₹4,500 / 100km  - Detention: ₹350/hr dwell            | | [ Re-init Pricing Engine Matrix ]|
|  - [X] Fuel Price Surcharge Auto-Indexing (±3% Diesel Trigger)      | +------------------------------------+
|                                                                     |
|  Section 3: Escrow, Disbursal & FASTag Automation [IMPS/NEFT]       |
|  - [X] Auto-Disburse to Driver Wallet on e-POD Verification          |
|  - Single Payout Cap: ₹5,00,000  - Wallet Trip Floor: ₹1,500        |
|  - FASTag Auto-Topup: Recharge ₹2,500 when < ₹800                   |
|  Section 4: Fleet Telemetry & AIS-140 GPS Gateways [Ping Devices]    |
|  - Minda AIS-140 VTS Stream (412 Units) [Active]                    |
|  - Google Maps Fleet Engine (Routing & Toll API) [Active]           |
+---------------------------------------------------------------------+------------------------------------+
|  [•] Unsaved Configuration Changes Pending: Modified settings        [Discard Changes] [Save & Apply]    |
+----------------------------------------------------------------------------------------------------------+
```













