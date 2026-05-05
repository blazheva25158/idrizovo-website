# Idrizovo Prison Visitation Scheduling System - Complete User Stories

## EPIC 1: Visitor Registration & Visit Request Submission

### US-101: Visitor Submits Initial Visit Request (Family Member)

As a family member,
I want to submit a visit request with my details and the inmate's information,
so that I can request to visit my relative in prison.

**Acceptance Criteria:**
- Visitor can enter First Name, Last Name, and Inmate ID
- System validates that all required fields are filled
- Visitor can optionally provide an email address
- System confirms submission and displays next steps
- System automatically approves the request (family member automatic approval)
- System generates a verification PDF file with approval details
- If email provided, system sends approval email with PDF attachment
- If email NOT provided, system generates a unique tracking code (PIN) and displays it on screen
- Visitor receives clear instructions to save/screenshot the code or PDF

---

### US-102: Visitor Submits Initial Visit Request (Family Doctor)

As a family doctor,
I want to submit a visit request with my professional details and the patient's inmate information,
so that I can request medical visitation for my patient.

**Acceptance Criteria:**
- Doctor can enter First Name, Last Name, Professional ID/License, and Inmate ID
- System validates all required fields
- Doctor can optionally provide an email address
- System automatically approves the request (family doctor automatic approval)
- System generates a verification PDF with medical visitor status
- Email notification sent if email provided
- Unique tracking code generated and displayed if no email
- System tags this visitor as "Family Doctor" in records

---

### US-103: Visitor Submits Initial Visit Request (Friend - Manual Approval)

As a friend of an inmate,
I want to submit a visit request that requires staff approval,
so that I can request permission to visit based on the prison's discretion.

**Acceptance Criteria:**
- Friend can enter First Name, Last Name, and Inmate ID
- System validates all required fields
- Friend can optionally provide an email address
- System marks request as "Pending Staff Approval" (NOT automatically approved)
- Request is flagged as "Special Request - Friend Visitation"
- Request appears in Prison Staff dashboard for manual review
- Unique tracking code generated and provided to friend
- Friend receives message: "Your request is pending approval. Check status using your code."
- No PDF generated until staff approves/rejects

---

### US-104: Visitor Tracks Request Status Without Email (PIN Code)

As a visitor without email,
I want to use my unique PIN code to check my request status online,
so that I can verify if my visit has been approved.

**Acceptance Criteria:**
- Visitor can enter their PIN code on the "Check Status" page
- System displays current request status (Pending, Approved, Rejected)
- System displays the generated verification PDF once approved
- System displays rejection reason if applicable
- Visitor can download or screenshot verification details
- PIN code works indefinitely (never expires)
- System logs all PIN code lookups for security

---

## EPIC 2: Visit Scheduling & Capacity Management

### US-201: Visitor Views Available Timeslots

As an approved visitor,
I want to view available visiting timeslots for a specific inmate,
so that I can choose a convenient time to schedule my visit.

**Acceptance Criteria:**
- Visitor selects an inmate from their approved requests
- System displays a calendar showing available dates (next 30 days)
- System shows 3-4 timeslots per day (each 2 hours duration)
- Example timeslots: 09:00-11:00, 11:00-13:00, 13:00-15:00, 15:00-17:00
- Timeslots are available 7 days a week (including weekends)
- System displays remaining capacity (e.g., "12/15 spots available")
- System prevents selection of full timeslots (shows "All spots are filled")
- Visitor can see color-coded availability (green=available, red=full)
- System checks frequency limits before showing options

---

### US-202: System Enforces 2-Visit-Per-Month Limit (Family/Doctors)

As the system,
I want to enforce a maximum of 2 visits per month per inmate for family members and doctors,
so that capacity is fairly distributed and prison operations are maintained.

**Acceptance Criteria:**
- System counts approved/scheduled visits for each visitor-inmate pair in current month
- If visitor already has 2 visits scheduled this month, timeslot selection is disabled
- System displays message: "You have already scheduled 2 visits this month. Next available date: [date]"
- Calendar shows future months where scheduling is possible
- Visitor can see their current visit count (e.g., "2/2 visits used this month")
- Limit resets on the 1st of each month
- System logs all frequency check decisions for audit trail

---

### US-203: System Enforces 1-Visit-Per-90-Days Limit (Friends - Special Request)

As the system,
I want to enforce a maximum of 1 visit every 90 days for friends (special requests),
so that friend visitations are carefully controlled.

**Acceptance Criteria:**
- System tracks the last approved visit date for each friend-inmate pair
- If friend has a visit within last 90 days, scheduling is blocked
- System displays message: "Next available visit date: [date + 90 days]"
- System calculates 90-day window from visit completion date
- Special Request status prevents normal timeslot selection
- Friend must resubmit request after 90-day window expires
- System logs all 90-day restriction checks

---

### US-204: Visitor Schedules a Visit Within Allowed Limits

As an approved visitor,
I want to select and confirm a timeslot to schedule my visit,
so that my visit is officially booked.

**Acceptance Criteria:**
- Visitor selects a specific date and timeslot
- System confirms frequency limits are met
- System confirms timeslot has available capacity (< 15 booked)
- System increments capacity counter for selected timeslot
- Booking is saved to database with timestamp
- System generates confirmation with visit details (date, time, inmate, visitor)
- Confirmation displays cancellation deadline (48 hours before visit)
- If email available, confirmation email is sent
- System updates visitor's dashboard with scheduled visit
- System logs the booking in historical records

---

### US-205: System Prevents Overbooking (Hard Cap at 15 Visits)

As the system,
I want to prevent more than 15 visits from being booked in any single timeslot,
so that the physical visiting room capacity is never exceeded.

**Acceptance Criteria:**
- System counts confirmed bookings for each timeslot
- If 15 visits already booked, system rejects new booking attempt
- System displays: "All spots are filled for this timeslot"
- System prevents any manual override (hard cap is enforced)
- Suggestion shown: "Try the next available timeslot: [date/time]"
- Booking attempt is logged even if rejected
- Overbooking is impossible even with simultaneous requests
- System uses database locking/transactions to prevent race conditions

---

### US-206: Visitor Cancels a Visit (Within 48-Hour Window)

As a visitor,
I want to cancel my scheduled visit up to 48 hours before the scheduled time,
so that I can free up the timeslot for someone else if plans change.

**Acceptance Criteria:**
- Visitor can view their scheduled visits in their dashboard
- System displays a "Cancel" button for upcoming visits
- System checks if cancellation is within 48-hour window
- If within 48 hours: system shows "Cannot cancel - less than 48 hours before visit"
- If > 48 hours: cancellation is permitted
- System requires confirmation: "Are you sure you want to cancel?"
- Upon confirmation, booking is deleted and capacity counter is decremented
- Timeslot becomes available again for other visitors
- If email on file, cancellation confirmation is sent
- Cancellation is logged in historical records
- Frequency limit counter is NOT decremented (visit still counts against monthly quota)

---

### US-207: Visitor Cannot Cancel (Within 48-Hour Window - Visit Forfeited)

As the system,
I want to prevent cancellations within 48 hours of a scheduled visit,
so that the prison has time to prepare and the timeslot is not wasted.

**Acceptance Criteria:**
- Cancel button is disabled for visits within 48 hours
- System displays: "Cancellations must be made at least 48 hours in advance"
- Visitor can see countdown timer: "Time remaining to cancel: [X hours]"
- If visitor does not cancel within 48 hours, visit slot is forfeited
- Forfeited visit is marked in system but capacity slot remains unavailable
- Visit still counts against visitor's monthly/quarterly frequency limits
- Forfeited visits are tracked separately in reports
- No refund or rescheduling option is available

---

## EPIC 3: Prison Staff Request Management

### US-301: Prison Staff Views Pending Visit Requests

As a Prison Staff member (Message Reader/Approver),
I want to view all pending visit requests that require manual approval,
so that I can review and decide on friend visitations.

**Acceptance Criteria:**
- Staff logs in with their pre-created account credentials
- Dashboard displays all "Pending Staff Approval" requests
- Each request shows: Visitor Name, Visitor Type (Friend), Inmate ID, Submission Date
- Staff can filter requests by status (Pending, Approved, Rejected)
- Staff can filter by date range
- System displays count of pending requests
- Staff can search for specific requests by visitor name or inmate ID
- Requests are sorted by submission date (oldest first)
- Staff can sort by any column
- System logs all staff access to request dashboard

---

### US-302: Prison Staff Approves a Friend Visit Request

As a Prison Staff member,
I want to approve a friend's visit request,
so that the visitor can proceed to schedule their special visit.

**Acceptance Criteria:**
- Staff selects a pending request and clicks "Approve"
- System requires optional notes/reason for approval
- Staff confirms approval with a button click
- Request status changes to "Approved"
- System generates verification PDF for the visitor
- If visitor email on file, approval email is sent with PDF
- If no email, visitor is informed to use their PIN code to retrieve PDF
- System unlocks timeslot selection for this visitor
- Approval timestamp is recorded
- Staff name is logged as the approver
- Approval is recorded in historical audit trail

---

### US-303: Prison Staff Rejects a Friend Visit Request

As a Prison Staff member,
I want to reject a friend's visit request with a reason,
so that denied visitors understand why they cannot schedule a visit.

**Acceptance Criteria:**
- Staff selects a pending request and clicks "Reject"
- System opens a form requiring a rejection reason
- Reason options include: "Security Concern", "No Prior Relationship", "Inmate Request", "Other"
- Staff can add custom comments/explanation
- Staff confirms rejection
- Request status changes to "Rejected"
- Rejection message is sent to visitor (if email on file)
- Rejection reason is included in notification
- Rejection timestamp and staff name are recorded
- Rejection is logged in historical audit trail
- Visitor can resubmit request after 90 days

---

### US-304: Prison Staff Updates Request Status (Authority Decision)

As a Prison Staff member (after receiving Authority decision),
I want to update a Special Request status based on higher authority approval/rejection,
so that the system reflects official legal/directional decisions.

**Acceptance Criteria:**
- Staff receives official decision from Prison Director, Judge, or relevant Authority
- Request remains in "Pending Authority Approval" state until decision received
- Staff manually updates status to "Approved" or "Rejected" based on Authority decision
- System requires staff to input Authority name/reference for audit
- Staff can upload supporting documentation/decision letter
- Status update timestamp is recorded
- Visitor is notified via email (if on file) of Authority decision
- If approved, verification PDF is generated
- If rejected, rejection reason from Authority is included in notification
- Decision is logged with Authority reference for legal compliance

---

## EPIC 4: Administrator Functions & System Configuration

### US-401: Administrator Views and Manages Timeslot Configuration

As a System Administrator,
I want to view, modify, and manage visiting timeslots and capacities,
so that I can adjust prison operations based on needs.

**Acceptance Criteria:**
- Admin can access "Schedule Configuration" section
- System displays all timeslots per day (3-4 slots × 7 days)
- Each timeslot shows: Start Time, End Time, Capacity (15), Current Bookings
- Admin can edit start/end times for each slot
- Admin can modify capacity limits (though hard cap logic must prevent overages)
- Admin can enable/disable specific timeslots
- Admin can block entire days (holidays, maintenance)
- Changes are effective immediately for new bookings
- Existing bookings are not affected by timeslot modifications
- All changes are logged with timestamp and admin name
- Admin can preview impact of changes before confirming

---

### US-402: Administrator Manages Staff Profiles

As a System Administrator,
I want to manage employee/staff profiles that were pre-created in the database,
so that staff access and permissions are properly controlled.

**Acceptance Criteria:**
- Admin can view list of all pre-created staff accounts
- Each profile displays: Name, ID, Role, Email, Account Status (Active/Inactive)
- Admin can edit staff profile details (except staff ID)
- Admin can assign/modify staff roles (Message Reader, Approver, etc.)
- Admin can temporarily deactivate staff accounts
- Admin can reactivate deactivated accounts
- Admin can reset staff password (staff receives reset link via email)
- Admin cannot create new staff accounts (pre-created only)
- All profile changes are logged for audit
- Staff profile changes do not affect existing approvals/decisions

---

### US-403: Administrator Updates Dynamic Content (News, Activities, Announcements)

As a System Administrator,
I want to manage and update dynamic content on the CMS board (news, activities, announcements),
so that important information is communicated to visitors.

**Acceptance Criteria:**
- Admin can access "Content Management" section
- Admin can create new announcement/news post
- Admin can edit title, description, and content
- Admin can set publication date/time (schedule posting)
- Admin can upload images/attachments with posts
- Admin can categorize content (News, Activities, Announcements)
- Admin can mark content as "Featured" (appears at top)
- Admin can set expiration date for content (auto-removal)
- Admin can preview content before publishing
- Admin can edit/delete published content
- Content appears on visitor-facing homepage/dashboard
- All content changes are logged with timestamp and admin name
- Content is searchable by visitors

---

## EPIC 5: Historical Logs & Audit Trail

### US-501: System Maintains Complete Visit History

As the system,
I want to securely store a complete history of all visits,
so that the prison has an auditable record of all visitations.

**Acceptance Criteria:**
- System records: Visitor Name, Visitor Type, Inmate ID, Visit Date, Visit Time, Timeslot
- System records: Booking Date, Booking Status (Scheduled, Completed, Cancelled, Forfeited)
- System records: Approval Status, Approver Name (if applicable)
- Historical records cannot be edited or deleted
- Historical records are encrypted and securely stored
- Admin can generate historical reports by date range
- Admin can filter history by inmate, visitor, or staff member
- System generates audit trail timestamps for all actions
- History is retained for minimum 5 years (configurable)
- System exports history in PDF/CSV format for legal compliance

---

### US-502: System Maintains Request Action Audit Trail

As the system,
I want to log all request actions (submission, approval, rejection, status changes),
so that there is a complete record of decision-making.

**Acceptance Criteria:**
- System logs: Request Creation (date, time, visitor type)
- System logs: System Decisions (auto-approval, auto-rejection)
- System logs: Staff Actions (approval, rejection, status updates)
- System logs: Authority Decisions (approval/rejection from higher authority)
- Each log entry includes: Timestamp, Action Type, Staff/System Name, Reason/Notes
- Audit trail is tamper-proof and immutable
- Admin can view complete audit trail for any request
- Audit trail is exported for legal/compliance review
- System preserves complete decision history even if request is later modified

---

## EPIC 6: Notifications & Communication

### US-601: System Sends Email Notifications (Approval)

As the system,
I want to send email notifications when a visit request is approved,
so that visitors are informed immediately.

**Acceptance Criteria:**
- System sends email only if visitor provided email address
- Email subject: "Your Prison Visit Request - APPROVED"
- Email contains: Approval details, verification PDF attachment, next steps
- Email includes: Inmate name/ID, visit scheduling link
- Email is sent within 1 minute of approval
- Email contains clear instructions for scheduling
- Email is formatted professionally and is mobile-responsive
- System logs all email sends (timestamp, recipient, status)
- Failed email sends are retried automatically (3 attempts)
- Admin can resend approval email manually if needed

---

### US-602: System Sends Email Notifications (Rejection)

As the system,
I want to send email notifications when a visit request is rejected,
so that visitors understand why their request was denied.

**Acceptance Criteria:**
- System sends email only if visitor provided email address
- Email subject: "Your Prison Visit Request - NOT APPROVED"
- Email contains: Rejection reason, staff contact information, appeal process (if available)
- Email is professional and empathetic in tone
- Email includes: Resubmission eligibility date (if applicable, e.g., after 90 days)
- Email is sent within 1 minute of rejection
- System logs all rejection emails
- Failed emails are retried automatically
- Email is mobile-responsive and readable

---

### US-603: System Sends Email Notifications (Scheduling Confirmation)

As the system,
I want to send confirmation emails when a visit is successfully scheduled,
so that visitors have proof of their booking.

**Acceptance Criteria:**
- Email sent immediately after successful booking
- Email subject: "Visit Scheduled - Confirmation"
- Email contains: Inmate name/ID, Visit date, Visit time, Timeslot details
- Email contains: Cancellation deadline (48 hours notice requirement)
- Email contains: Visitor instructions (what to bring, where to go)
- Email includes: Unique booking reference number
- Email is formatted clearly with all essential details
- System logs confirmation emails
- Failed emails are retried automatically

---

### US-604: System Sends Email Notifications (Cancellation Confirmation)

As the system,
I want to send cancellation confirmation emails when a visitor cancels,
so that there is documentation of the cancellation.

**Acceptance Criteria:**
- Email sent immediately after successful cancellation
- Email subject: "Visit Cancelled - Confirmation"
- Email contains: Cancellation date/time, Original visit details, Booking reference
- Email includes: Note that visit still counts against frequency limits
- Email provides link to reschedule if desired
- System logs all cancellation emails
- Failed emails are retried automatically

---

## EPIC 7: Multi-Language Support & Localization

### US-701: System Supports Three Languages (Macedonian, English, Albanian)

As a visitor,
I want to use the prison visitation website in my preferred language,
so that I can complete my request in a language I understand.

**Acceptance Criteria:**
- Website default language is Macedonian (on first load)
- Language selector displayed prominently (top of page)
- Supported languages: Macedonian, English, Albanian
- Language preference persists in browser session
- Language preference optionally saved to account (if registered)
- All UI text is fully translated in all three languages
- All forms accept input in selected language
- All email notifications are sent in user's selected language
- All PDFs generated in selected language
- Date/time formats follow language convention
- RTL language support (if needed for Albanian)
- Language switching does not lose form data (if mid-form)
- All system messages and error messages are translated
- Accessibility maintained in all languages

---

### US-702: System Displays Macedonian on Initial Load

As the system,
I want to display the website in Macedonian when first accessed,
so that the default experience is in the local language.

**Acceptance Criteria:**
- Website loads in Macedonian for all first-time visitors
- Browser language detection does not override Macedonian default
- Language selector allows immediate switch to English or Albanian
- This behavior applies regardless of visitor's browser language settings
- Macedonian remains default even for subsequent page loads (until language changed)

---

## EPIC 8: System Security & Data Protection

### US-801: System Secures Visitor Data with Encryption

As the system,
I want to encrypt all visitor personal data,
so that sensitive information is protected from unauthorized access.

**Acceptance Criteria:**
- All visitor names, contact details stored encrypted
- All inmate IDs and references encrypted
- All email addresses encrypted in database
- All PIN codes stored encrypted (salted hash)
- All passwords stored as salted hashes (BCRYPT or similar)
- Data in transit encrypted (HTTPS/TLS 1.2+)
- Database backups encrypted
- Encryption keys stored securely (not in code)
- Regular encryption audit for compliance

---

### US-802: System Prevents Unauthorized Access to Request Status

As the system,
I want to ensure only the visitor can access their own request status,
so that privacy of all visitors is protected.

**Acceptance Criteria:**
- PIN code access requires exact PIN match
- Three failed PIN attempts locks access temporarily (5 minutes)
- Staff access to requests limited to their approval role
- Visitors cannot see other visitors' requests
- Inmates cannot access the visitation system
- All unauthorized access attempts are logged
- System displays generic error for failed authentication
- Session timeout after 15 minutes of inactivity

---

## Summary Table

| Epic | User Stories | Total |
|------|--------------|-------|
| 1: Visitor Registration | US-101, US-102, US-103, US-104 | 4 |
| 2: Visit Scheduling | US-201, US-202, US-203, US-204, US-205, US-206, US-207 | 7 |
| 3: Staff Management | US-301, US-302, US-303, US-304 | 4 |
| 4: Admin Functions | US-401, US-402, US-403 | 3 |
| 5: Historical Logs | US-501, US-502 | 2 |
| 6: Notifications | US-601, US-602, US-603, US-604 | 4 |
| 7: Multi-Language | US-701, US-702 | 2 |
| 8: Security | US-801, US-802 | 2 |
| **TOTAL** | **28 User Stories** | **28** |
