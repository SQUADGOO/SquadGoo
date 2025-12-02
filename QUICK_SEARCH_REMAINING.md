# Quick Search Flow - Remaining Implementation

Based on the SquadGooRequirement.md document, here's what remains to be implemented in the Quick Search flow:

## ✅ What's Already Implemented

1. **Basic Quick Search Flow**
   - Job creation
   - Auto-matching candidates
   - Sending offers (manual and auto)
   - Accept/decline offers
   - Chat connection after match (30 days)
   - Contact reveal after match (30 days)

2. **Location Tracking** (Basic Structure)
   - Location tracking service exists
   - Basic stage management

3. **Timer/Clock** (Basic Structure)
   - Start/stop/resume timer actions exist
   - Timer display component exists

4. **Payment Request** (Basic Structure)
   - Request platform payment
   - Code generation and sharing
   - Code verification

5. **Job Complete** (Basic Structure)
   - Job completion action
   - Invoice sending (basic)
   - Payment proof request (basic)

---

## ❌ What's Missing or Incomplete

### 1. **Location Sharing - Complete 7-Stage Flow**

According to requirements (lines 35-44), the location sharing should have these stages:

**Stage 1: Accept Offer** ✅ (Done)
- Job seeker accepts the offer

**Stage 2: Preparing** ⚠️ (Incomplete)
- Job seeker has timeframe (e.g., 30 min) to prepare
- Countdown timer should be shown
- Location sharing not yet active

**Stage 3: Location Sharing Starts** ❌ (Missing)
- Location sharing starts when job seeker is about 5km away from home
- Recruiter can view live progress (like Uber Eats)
- Real-time location updates

**Stage 4: Approaching Workplace** ❌ (Missing)
- When job seeker arrives within 5km of workplace
- **Real-time notification sent to recruiter** (critical)
- Status update visible to recruiter

**Stage 5: Arrived at Workplace** ⚠️ (Partially Done)
- Job seeker clicks "Arrived at workplace"
- Location sharing stops
- **Missing**: Notification to recruiter

**Stage 6: Request In-Platform Payment** ⚠️ (Incomplete)
- Request button available in "Active job offer" section
- **Missing Features**:
  - Balance checking BEFORE code generation
  - Warning message if recruiter has low balance
  - Three options for job seeker:
    - **ACKNOWLEDGE AND CONTINUE ANYWAY**: Job seeker understands platform won't be liable
    - **DECLINE**: Job seeker declines and leaves
    - **REQUEST OTHER PARTY TO RECHARGE**: 5-10 minute window for recruiter to recharge
  - Balance requirement calculation and display
  - Code generation on recruiter side with agreement details
  - Recruiter can accept/edit pay rate and timing before sharing code

**Stage 7: Timer/Clock** ⚠️ (Incomplete)
- **Missing Features**:
  - Balance holding from recruiter wallet during timer
  - Low balance warning (1 hour before balance runs out)
  - Job seeker options when low balance warning appears
  - Auto-stop timer after pre-agreed hours
  - Resume clock within 1 hour window
  - **Recruiter stop logic**: Needs code from job seeker if stopping before agreed time
  - **Job seeker stop logic**: No code needed, but recruiter notified
  - Resume conditions based on who stopped and if terms changed
  - Auto-complete job if clock not resumed within 1 hour

---

### 2. **Payment Stage 6 - Complete Implementation**

**Missing Features:**

1. **Balance Checking Logic** (Lines 40-44)
   - Check recruiter balance BEFORE code generation
   - Calculate required balance: `hourlyRate × expectedHours`
   - Show warning if balance is insufficient
   - Display available balance vs required balance

2. **Low Balance Warning Flow** (Lines 40-44)
   - Show warning message to job seeker
   - Display how many hours the current balance covers
   - Three action buttons:
     - Acknowledge & Continue Anyway
     - Decline
     - Request Recharge

3. **Recharge Request Flow** (Line 44)
   - Send notification to recruiter
   - 5-10 minute countdown timer
   - If recruiter doesn't recharge: Show failed attempt notification
   - Job seeker gets same three options again

4. **Code Generation with Agreement** (Lines 37-40)
   - Job seeker can edit/confirm pay rate and timing
   - Recruiter receives notification with details
   - Recruiter can accept or request changes
   - Code generated only after both parties agree
   - Balance hold calculated and displayed

---

### 3. **Timer/Clock Stage 7 - Complete Implementation**

**Missing Features:**

1. **Balance Holding** (Lines 39-42)
   - Hold SG coins from recruiter wallet when timer starts
   - Real-time balance deduction as timer runs
   - Show held balance vs available balance

2. **Low Balance Warning** (Line 39)
   - Check balance 1 hour before it runs out
   - Send notification to job seeker
   - Job seeker options:
     - Continue (platform not liable)
     - Discontinue/Leave workplace
     - Request recharge

3. **Auto-Stop Timer** (Line 66)
   - Timer auto-stops after pre-agreed hours
   - Both parties notified

4. **Resume Clock Logic** (Lines 67-72)
   - **1-hour window** to resume after stop
   - **Recruiter resume**:
     - If no changes: Can resume unilaterally (no code)
     - If changes pay rate/end time: Needs code from job seeker
   - **Job seeker resume**:
     - If stopping before agreed time: Needs code from recruiter to resume
     - Can preview agreement and request changes
   - If not resumed within 1 hour: Job auto-completes

5. **Stop Clock Logic** (Lines 57-59, 69)
   - **Recruiter stops before agreed time**: Needs code from job seeker
   - **Job seeker stops before agreed time**: No code needed, recruiter notified
   - Code generation and sharing flow

6. **Auto-Complete After 1 Hour** (Line 71)
   - If clock not resumed within 1 hour after stop
   - Job automatically completes
   - SG coins deposited to job seeker wallet
   - Coins remain on hold for 7 days

---

### 4. **Job Complete - Complete Implementation**

**Missing Features:**

1. **Auto-Generate Invoice** (Line 74)
   - If job seeker (ABN) doesn't send invoice within 7 days
   - System auto-generates invoice
   - Recruiter can request invoice generation unilaterally
   - Available in "Completed or expired job offer" menu

2. **File Upload for Invoices** (Line 76)
   - For external payments (not handled by platform)
   - Job seeker can upload invoice file
   - Recruiter can request invoice upload
   - File delivery to recruiter

3. **Payment Proof Upload** (Lines 79-81)
   - Recruiter can upload payment proof (payslips, receipts, bank statements)
   - Available for both TFN and ABN job seekers
   - File upload functionality

4. **7-Day Hold Period** (Line 71)
   - SG coins remain on hold for 7 days after job completion
   - Coins available for use/withdrawal after 7 days
   - Dispute/complaint window
   - Auto-release if no disputes

---

### 5. **Quick Search Settings Integration**

**Missing Features:**

1. **Job Seeker Settings** (Lines 46-50)
   - Settings exist in UI but not integrated into matching
   - **"Only receive offers where recruiter has enough balance"**
     - Should filter offers BEFORE sending
     - Check recruiter balance during matching
   - **"All payment handled by SquadGoo"**
     - Should filter offers to only those with platform payment
     - Check recruiter payment preference during matching

2. **Settings Persistence**
   - Settings should be saved and retrieved
   - Used during auto-matching process
   - Filter candidates based on settings

---

### 6. **Recruiter Side Features**

**Missing Features:**

1. **Location Tracking View** (Lines 35-36)
   - Real-time map view of job seeker location
   - Live progress tracking (like Uber Eats)
   - Stage indicators
   - ETA calculation

2. **Real-Time Notifications** (Line 35)
   - Notification when job seeker is 5km away from workplace
   - Notification when job seeker arrives
   - Notification for all stage changes

3. **Timer Management UI** (Lines 57-59)
   - View running timer
   - Stop timer button (with code requirement)
   - Resume timer button
   - Edit terms and request code
   - View held balance

4. **Payment Code Sharing UI** (Lines 37-40)
   - View payment request from job seeker
   - Review/edit agreement details
   - Generate and share code
   - QR code display
   - Balance checking UI

5. **Balance Management**
   - View current balance
   - View held balance
   - Recharge wallet option
   - Low balance warnings

---

### 7. **Additional Missing Features**

1. **Auto-Complete Logic** (Line 71)
   - Auto-complete job if timer not resumed within 1 hour
   - Deposit SG coins to job seeker wallet
   - Move to completed jobs

2. **Dispute/Complaint Integration** (Line 71)
   - 7-day window for disputes
   - Hold coins during dispute period
   - Release coins after 7 days if no disputes

3. **Real-Time Updates**
   - WebSocket/real-time updates for location
   - Real-time timer updates
   - Real-time balance updates
   - Push notifications for all events

4. **TFN Employee Restrictions** (Line 83)
   - Platform payment NOT available for TFN employees
   - Should prevent TFN job seekers from requesting platform payment
   - Only ABN contractors can use platform payment

---

## Priority Implementation Order

### High Priority (Core Functionality)
1. ✅ Complete Location Sharing Stages 2-5
2. ✅ Complete Payment Stage 6 (balance checking, warnings, recharge flow)
3. ✅ Complete Timer Stage 7 (balance holding, auto-stop, resume logic)
4. ✅ Integrate Quick Search Settings into matching
5. ✅ Recruiter location tracking view

### Medium Priority (User Experience)
6. ✅ Real-time notifications
7. ✅ Recruiter timer management UI
8. ✅ Recruiter payment code sharing UI
9. ✅ Auto-complete job logic
10. ✅ 7-day hold period enforcement

### Low Priority (Polish)
11. ✅ Auto-generate invoice after 7 days
12. ✅ File upload for invoices/payment proof
13. ✅ Dispute integration
14. ✅ TFN restrictions enforcement

---

## Key Files That Need Updates

1. **Location Tracking Service** (`src/services/locationTrackingService.js`)
   - Implement all 7 stages
   - Add stage transition logic
   - Add notification triggers

2. **Quick Search Slice** (`src/store/quickSearchSlice.js`)
   - Add balance checking actions
   - Add recharge request actions
   - Add auto-complete logic
   - Add 7-day hold period logic

3. **Payment Request Screen** (`src/screens/main/JobSeeker/QuickSearch/PaymentRequest.jsx`)
   - Add balance checking UI
   - Add low balance warning UI
   - Add recharge request flow

4. **Timer Control** (`src/screens/main/JobSeeker/QuickSearch/TimerControl.jsx`)
   - Add balance holding display
   - Add low balance warnings
   - Add auto-stop logic

5. **Recruiter Timer Management** (`src/screens/main/Recruiter/QuickSearch/TimerManagement.jsx`)
   - Add code requirement logic
   - Add stop/resume with conditions
   - Add balance display

6. **Recruiter Location View** (New file needed)
   - Real-time map view
   - Stage indicators
   - ETA display

7. **Job Seeker Settings** (`src/screens/main/JobSeeker/DashBoard/Settings/JobSettings.jsx`)
   - Integrate settings into Redux
   - Use settings in matching logic

8. **Auto-Matching Service** (`src/services/autoOfferService.js`)
   - Filter by job seeker settings
   - Check recruiter balance
   - Check payment preferences

---

## Notes

- All balance-related features require integration with wallet system
- Real-time features require WebSocket/Socket.io implementation
- Notifications require push notification service integration
- File uploads require file storage service integration
- 7-day hold period requires scheduled job/background task

