<!-- 354c94cd-44a1-40bb-ae25-483e3303afbb f9fcd112-ec5e-47cc-bbad-91edcd7807ac -->
# Complete Selector Components Implementation

## Overview

Implement all reusable bottom sheet selector components for the application including the original requirements plus new requirements for Qualifications, Address Proof, Education/Courses, and Identity Proof.

## Phase 1: Original Requirements (Completed)

- User Titles, Job Categories, Countries, Languages, Visa Types

## Phase 2: Additional Requirements (To Implement)

### Qualifications

- Multiple qualification types with special handling:
- White card, Police check, Children check
- Driving License (requires sub-menu with: C Car, LR Light Rigid, MR Medium Rigid, HR Heavy Rigid, HC Heavy Combination, MC Multi Combination, R-DATE Motorcycle, R Motorcycle)
- Various licenses (Forklift, Scaffolding levels, Rigging levels, Crane operations, etc.)
- RSA License, RSG/RCG License, Barista Certificate
- Other (manual entry)
- Multi-select capability needed

### Address Proof

- Role-based lists:
- Jobseekers/Individuals: Contract of lease, Vehicle registration, Driver licence, Council rates, Land Tax, ATO assessment, Utility bills, Bank statement
- Recruiters: Rental/Lease Agreement, GST Certificate, Utility bills, Company registration, Property tax, Bank statements, Company vehicle registration, Telephone bill

### Education/Courses

- Hierarchical with conditional questions:
- <_10th (no follow-up)
- 12th, Certificate I-IV, Diploma, Advanced Diploma, Bachelor, Masters, PHD (require "Which course" - manual entry)
- OTHERS (manual entry)
- If not <_10th, also ask "In which faculty" (manual entry)

### Identity Proof

- Simple list: Medicare card, Passport, Driving license, Birth Certificate, Citizenship Certificate, Immigration travel document, Proof of Age Card, Student ID/Work Related ID

## Implementation Steps

### Step 1: Update appData.js

- Add `QUALIFICATIONS` array
- Add `DRIVING_LICENSE_TYPES` array
- Add `ADDRESS_PROOF_JOBSEEKER` array
- Add `ADDRESS_PROOF_RECRUITER` array
- Add `EDUCATION_LEVELS` object with conditional question structure
- Add `IDENTITY_PROOF` array

### Step 2: Create QualificationSelector Component

- Multi-select capability
- Special handling for Driving License (shows sub-menu)
- "Other" option with manual entry
- Uses RbSheetComponent, AppText, VectorIcons

### Step 3: Create AddressProofSelector Component

- Accepts `userType` prop ('jobseeker'/'individual' vs 'recruiter')
- Shows appropriate list based on user type
- Single select

### Step 4: Create EducationSelector Component

- Two-level selection with conditional questions
- <_10th has no follow-up
- All others require "Which course" and "In which faculty" (manual text inputs)
- Uses RbSheetComponent with conditional input fields

### Step 5: Create IdentityProofSelector Component

- Simple single-select list
- Uses RbSheetComponent

## Files to Create

1. `src/components/QualificationSelector.jsx` - Multi-select qualifications
2. `src/components/AddressProofSelector.jsx` - Role-based address proof
3. `src/components/EducationSelector.jsx` - Education with conditional questions
4. `src/components/IdentityProofSelector.jsx` - Identity proof selector

## Files to Modify

1. `src/utilities/appData.js` - Add all new data structures

## Component Design Requirements

- All components use `RbSheetComponent` for bottom sheet UI
- Include search functionality where applicable
- Use `AppText` for typography
- Use VectorIcons for visual elements
- Follow existing design patterns
- Accept `onSelect` callback
- Accept `selectedValue` prop
- Handle "Other" options with text input
- QualificationSelector supports multi-select
- AddressProofSelector is role-aware
- EducationSelector handles conditional questions based on selection