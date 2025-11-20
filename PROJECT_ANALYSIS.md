# SquadGoo Project Analysis

## Executive Summary

SquadGoo is a comprehensive labor hire marketplace platform connecting three types of users: Job Seekers (TFN/ABN), Recruiters (Business Owners/Representatives), and Individuals. The platform facilitates job matching through Quick Search (immediate, location-based) and Manual Search (traditional hiring) mechanisms, with integrated payment systems, marketplace functionality, and advanced features like Squad profiles and real-time location tracking.

---

## 1. Project Overview

### 1.1 Core Concept
- **Platform Type**: Labor hire marketplace with matchmaking capabilities
- **Primary Market**: Australian labor market
- **Business Model**: Commission-based matching fees + transaction fees
- **Native Currency**: SG COINS (1:1 with AUD)

### 1.2 Technology Stack
- **Frontend**: React Native 0.76.0
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation (Stack, Drawer, Tabs)
- **Forms**: React Hook Form + Yup validation
- **API**: Axios + React Query (TanStack Query)
- **Platforms**: iOS & Android

---

## 2. User Types & Requirements

### 2.1 Job Seekers
**Subtypes:**
- **TFN (Tax File Number) Employees**: Traditional employees receiving salary with tax deductions
- **ABN (Australian Business Number) Contractors**: Independent contractors who invoice clients

**Key Features Required:**
- Profile management (experience, qualifications, preferences)
- KYC verification (Sumsub integration)
- Resume verification (paid service)
- Job offer management (accept/decline/modify)
- Acceptance rating system
- Badge system (Bronze, Platinum, Gold)
- Squad profile creation
- Wallet management
- Quick/Manual job preferences

**Current Implementation Status:**
- ✅ Basic profile structure exists
- ✅ Preferred jobs management
- ✅ Experience management (AddExperience component)
- ✅ Dashboard navigation
- ⚠️ KYC verification UI exists but Sumsub integration unclear
- ❌ Acceptance rating system not implemented
- ❌ Badge system not implemented
- ❌ Squad profile functionality missing

### 2.2 Recruiters
**Subtypes:**
- **Business Owner (Main Account)**: Primary account with full control
- **Representative (Sub Account)**: Secondary accounts under main account control

**Key Features Required:**
- Company profile management
- KYC & KYB verification
- Quick Search functionality
- Manual Search functionality
- Staff preference settings
- Badge system (Bronze, Platinum, Gold)
- Sub-account management (for main accounts)
- Wallet management
- Labor pool browsing

**Current Implementation Status:**
- ✅ Quick Search multi-step form (4 steps)
- ✅ Manual Search multi-step form (3 steps)
- ✅ Job posting and management
- ✅ Basic profile structure
- ⚠️ Sub-account management not fully implemented
- ❌ Badge system not implemented
- ❌ Auto-matching AI not implemented

### 2.3 Individuals
**Key Features Required:**
- Similar to recruiters but for domestic/non-commercial tasks
- Find Contractor functionality (instead of Find Staff)
- Project-based payments (not hourly)
- Lower transaction fees (2% manual, 5% quick, capped)
- No timer/clock functionality

**Current Implementation Status:**
- ✅ Basic user type exists in authentication
- ⚠️ Find Contractor functionality may need separate implementation
- ❌ Project-based payment logic not implemented
- ❌ Different fee structure not implemented

---

## 3. Core Features Analysis

### 3.1 Quick Search
**Requirements:**
- Auto-matching based on percentage compatibility
- System can auto-send offers
- Location sharing (5-stage process)
- In-app payment with timer/clock system
- QR code/code sharing for payment activation
- Balance checking and warnings
- Resume clock functionality
- 7-day hold period for payments

**Current Implementation:**
- ✅ Multi-step form (4 steps) for creating quick search
- ✅ Basic job posting
- ❌ Auto-matching algorithm not implemented
- ❌ Location sharing/tracking not implemented
- ❌ Timer/clock system not implemented
- ❌ QR code generation/sharing not implemented
- ❌ Balance checking logic not implemented
- ❌ Payment hold system not implemented

**Gaps:**
- Real-time location tracking integration needed
- Timer component with start/stop/resume functionality
- Payment gateway integration for SG COINS
- Notification system for location updates
- Code/QR generation library integration

### 3.2 Manual Search
**Requirements:**
- Percentage-based profile matching
- Manual offer sending
- Accept/Decline/Modify workflow
- Acceptance rating impact on declines
- 30-day chat/contact access after match
- No in-app payment (handled externally)

**Current Implementation:**
- ✅ Multi-step form (3 steps) for creating manual search
- ✅ Job posting
- ⚠️ Profile matching percentage calculation unclear
- ❌ Acceptance rating system not implemented
- ❌ Decline reason tracking not implemented
- ⚠️ Chat functionality exists but 30-day expiry not implemented

**Gaps:**
- Matching algorithm implementation
- Acceptance rating calculation logic
- Decline reason tracking and impact system

### 3.3 Payment System (SG COINS)
**Requirements:**
- 1:1 conversion with AUD
- Wallet functionality (purchase, withdraw, transfer)
- Transaction history
- 7-day hold period for completed jobs
- Transaction fees (varies by user type and search type)
- Invoice generation (for ABN contractors)
- Payment proof requests

**Current Implementation:**
- ✅ Wallet UI components exist
- ✅ Purchase coins screen
- ✅ Withdraw coins screen
- ✅ Bank details form
- ⚠️ Transaction history display exists
- ❌ Actual payment processing not implemented
- ❌ Hold period logic not implemented
- ❌ Invoice generation not implemented
- ❌ Payment proof system not implemented

**Gaps:**
- Payment gateway integration
- Transaction state management (hold, pending, completed)
- Invoice PDF generation
- Payment proof upload/verification

### 3.4 Marketplace
**Requirements:**
- Buy/Sell functionality
- Multiple categories (Vehicles, Property, Items, etc.)
- Delivery/Inspection service (Squad Courier)
- Dispute resolution center
- Hold listing feature
- Transaction fees (0.2% capped at $100)
- 7-day hold period

**Current Implementation:**
- ✅ Marketplace screens exist
- ✅ Product listing form
- ✅ Product details view
- ✅ Cart functionality
- ⚠️ Checkout flow exists
- ❌ Squad Courier integration not implemented
- ❌ Dispute resolution center not implemented
- ❌ Hold listing feature not implemented

**Gaps:**
- Courier service integration with Quick Search
- Dispute mediation UI and workflow
- Hold listing payment logic

### 3.5 Squad Profiles
**Requirements:**
- Group profile creation (pairing system)
- Admin control
- Combined experience/preferences
- Squad wallet (admin controlled)
- No expiry chat for squad members
- Squad hiring for recruiters

**Current Implementation:**
- ❌ Squad profile functionality completely missing
- ⚠️ Squad settings UI exists but not functional
- ❌ Pairing system not implemented
- ❌ Squad wallet not implemented

**Gaps:**
- Complete Squad profile system
- Pairing/group management
- Squad-specific matching logic

### 3.6 KYC/KYB Verification
**Requirements:**
- Sumsub integration for identity verification
- Address verification
- Resume verification (paid service)
- Business verification (KYB) for recruiters
- Document upload and management

**Current Implementation:**
- ✅ KYC verification screens exist
- ✅ Document upload UI
- ⚠️ Sumsub integration status unclear
- ❌ Resume verification workflow not implemented
- ❌ KYB verification workflow not fully implemented

**Gaps:**
- Sumsub SDK integration
- Verification status tracking
- Resume verification payment and workflow

### 3.7 Badge System
**Requirements:**
- **Job Seekers**: Bronze (20 SG), Platinum (99 SG), Gold (199 SG)
- **Recruiters**: Bronze (50 SG), Platinum (100 SG), Gold (200 SG)
- Eligibility criteria (time on platform, job offers completed)
- Benefits vary by badge level

**Current Implementation:**
- ❌ Badge system completely missing
- ⚠️ Account upgrade screen exists but not functional

**Gaps:**
- Badge purchase flow
- Eligibility checking
- Badge display in profiles
- Benefit application logic

### 3.8 Chat System
**Requirements:**
- 30-day access after match (Quick/Manual)
- No expiry for Squad members
- Video/voice call capability
- Document sharing
- Chat transcripts saved for 12 months

**Current Implementation:**
- ✅ Chat screens exist
- ✅ Basic messaging UI
- ❌ 30-day expiry logic not implemented
- ❌ Video/voice call not implemented
- ❌ Document sharing not implemented
- ❌ Chat transcript storage not implemented

**Gaps:**
- Expiry date tracking
- Media sharing functionality
- Call integration (WebRTC or similar)

### 3.9 Location Services
**Requirements:**
- Real-time location sharing for Quick Search
- 5-stage location tracking:
  1. Job acceptance
  2. Preparation phase (30 min)
  3. Location sharing starts (5km from home)
  4. Within 5km of workplace
  5. Arrived at workplace
- Live progress view for recruiters

**Current Implementation:**
- ✅ Location permission handling exists
- ✅ Basic location picker in forms
- ❌ Real-time location tracking not implemented
- ❌ Location sharing not implemented
- ❌ Progress tracking not implemented

**Gaps:**
- Real-time location tracking service
- Background location updates
- Map integration with live tracking
- Geofencing for workplace arrival

---

## 4. Technical Architecture Analysis

### 4.1 Current Structure
```
src/
├── api/              # API client and queries
├── assets/           # Images, icons, fonts
├── components/       # Reusable components
├── core/             # Core UI components
├── hooks/            # Custom hooks
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── store/            # Redux slices
├── styles/           # Global styles
├── theme/            # Theme configuration
└── utilities/        # Helper functions
```

### 4.2 State Management
- **Redux Toolkit**: Used for global state
- **Slices Identified**:
  - `authSlice`: Authentication state
  - `walletSlice`: Wallet/coin management
  - `jobsSlice`: Job postings and management
  - `jobSeekerPreferredSlice`: Preferred jobs
  - `jobSeekerExperienceSlice`: Experience management
  - `jobSeekerOffersSlice`: Job offers
  - `marketplaceSlice`: Marketplace state
  - `bankSlice`: Bank details

### 4.3 Navigation Structure
- **Root Navigator**: Handles auth vs main navigation
- **Role-based Navigation**: Different drawers for Recruiter/JobSeeker/Individual
- **Tab Navigation**: Used in JobSeeker dashboard
- **Stack Navigation**: Used for nested flows

### 4.4 API Integration
- **API Client**: Axios-based (`apiClient.js`)
- **React Query**: Used for data fetching (`@tanstack/react-query`)
- **Current Status**: Mostly using dummy data for local testing

---

## 5. Critical Missing Features

### 5.1 High Priority
1. **Payment Processing System**
   - SG COINS transaction processing
   - Payment gateway integration
   - Hold period management
   - Transaction state machine

2. **Location Tracking & Sharing**
   - Real-time location updates
   - Background location services
   - Geofencing implementation
   - Live map tracking

3. **Timer/Clock System**
   - Start/stop/resume functionality
   - Code/QR sharing for clock control
   - Balance checking and warnings
   - Auto-stop on completion

4. **Matching Algorithm**
   - Profile compatibility calculation
   - Percentage-based matching
   - Acceptance rating integration
   - Auto-matching for Quick Search

5. **Badge System**
   - Eligibility checking
   - Purchase flow
   - Benefit application
   - Badge display

### 5.2 Medium Priority
1. **Squad Profiles**
   - Pairing system
   - Group management
   - Squad wallet
   - Squad-specific matching

2. **Acceptance Rating System**
   - Rating calculation
   - Impact on matching
   - Decline reason tracking
   - Rating reset logic

3. **Chat Enhancements**
   - 30-day expiry implementation
   - Video/voice calls
   - Document sharing
   - Transcript storage

4. **Invoice System**
   - PDF generation
   - Invoice sending
   - Payment proof requests
   - Document management

### 5.3 Low Priority
1. **Dispute Resolution**
   - Mediation UI
   - Evidence upload
   - Decision workflow
   - Appeal system

2. **Squad Courier**
   - Integration with Quick Search
   - Delivery request flow
   - Fee calculation

3. **Notification System**
   - Push notifications
   - In-app notifications
   - Email notifications
   - Notification preferences

---

## 6. Integration Requirements

### 6.1 Third-Party Services Needed
1. **Sumsub**: KYC/KYB verification
2. **Payment Gateway**: For AUD to SG COINS conversion
3. **Maps Service**: Google Maps or Mapbox for location tracking
4. **Push Notifications**: Firebase Cloud Messaging or similar
5. **Video Calling**: WebRTC or third-party service (Twilio, Agora)
6. **PDF Generation**: For invoices and documents
7. **File Storage**: AWS S3 or similar for document storage

### 6.2 Backend Requirements
- RESTful API or GraphQL endpoint
- Real-time capabilities (WebSocket) for:
  - Location updates
  - Chat messages
  - Job offer notifications
- Database for:
  - User profiles
  - Job postings
  - Transactions
  - Chat history
  - Documents

---

## 7. Recommendations

### 7.1 Immediate Actions
1. **Complete Payment System**
   - Integrate payment gateway
   - Implement transaction state management
   - Add hold period logic
   - Create invoice generation system

2. **Implement Location Tracking**
   - Integrate maps service
   - Build real-time tracking
   - Implement geofencing
   - Create location sharing UI

3. **Build Timer System**
   - Create timer component
   - Implement code/QR sharing
   - Add balance checking
   - Build clock control logic

4. **Develop Matching Algorithm**
   - Create compatibility scoring
   - Implement percentage calculation
   - Integrate acceptance rating
   - Build auto-matching logic

### 7.2 Short-term (1-3 months)
1. Implement Badge System
2. Complete Squad Profile functionality
3. Enhance Chat with expiry and media
4. Build Acceptance Rating system
5. Integrate Sumsub for KYC/KYB

### 7.3 Long-term (3-6 months)
1. Dispute Resolution Center
2. Squad Courier integration
3. Advanced notification system
4. Analytics and reporting
5. Admin panel development

### 7.4 Technical Debt
1. **Code Organization**
   - Some components mix business logic with UI
   - Consider separating concerns better

2. **Type Safety**
   - Project uses JavaScript primarily
   - Consider migrating to TypeScript for better type safety

3. **Testing**
   - No test files found (except default App.test.tsx)
   - Add unit tests for critical business logic
   - Add integration tests for flows

4. **Error Handling**
   - Implement comprehensive error handling
   - Add error boundaries
   - Improve user feedback for errors

5. **Performance**
   - Optimize image loading
   - Implement code splitting
   - Add lazy loading for screens

---

## 8. Risk Assessment

### 8.1 High Risk Areas
1. **Payment System**: Critical for platform operation, needs robust implementation
2. **Location Tracking**: Privacy concerns, battery usage, background permissions
3. **Real-time Features**: Scalability concerns for WebSocket connections
4. **KYC Integration**: Compliance requirements, verification accuracy

### 8.2 Medium Risk Areas
1. **Matching Algorithm**: Accuracy affects user experience
2. **Badge System**: Business logic complexity
3. **Squad Profiles**: Complex state management

### 8.3 Mitigation Strategies
1. Use proven third-party services for payments and KYC
2. Implement proper error handling and fallbacks
3. Add comprehensive logging and monitoring
4. Implement gradual rollout for new features
5. Regular security audits

---

## 9. Compliance & Legal Considerations

### 9.1 Required Policies (Documented)
- Terms of Service
- Privacy Policy
- Data Protection Policies
- Cookie Policy
- Anti-Fraud Policies
- Workplace Safety Disclaimers
- Refund and Cancellation Policies
- User Agreement

### 9.2 Implementation Status
- ✅ Documents exist (referenced in requirements)
- ⚠️ Need to verify integration in app
- ⚠️ Need to ensure users accept during signup

---

## 10. Conclusion

The SquadGoo project has a solid foundation with basic UI components, navigation, and some core features implemented. However, significant work remains to be done on:

1. **Payment and transaction systems** - Critical for platform operation
2. **Real-time features** - Location tracking, chat, notifications
3. **Business logic** - Matching algorithms, badge system, acceptance ratings
4. **Third-party integrations** - Payment gateway, KYC service, maps
5. **Advanced features** - Squad profiles, dispute resolution, courier service

The project structure is well-organized, and the codebase appears maintainable. With focused development on the missing features, the platform can achieve its vision of being a comprehensive labor hire marketplace.

**Estimated Completion**: 6-9 months with a dedicated team, depending on team size and backend infrastructure readiness.

---

## Appendix: File Structure Reference

### Key Files to Review
- `src/navigation/`: Navigation configuration
- `src/store/`: Redux state management
- `src/screens/main/JobSeeker/`: Job seeker screens
- `src/screens/main/Recruiter/`: Recruiter screens
- `src/api/`: API integration layer
- `SquadGooRequirement.md`: Complete requirements document

### Key Components
- `src/core/`: Reusable UI components
- `src/components/`: Feature-specific components
- `src/utilities/`: Helper functions and utilities

