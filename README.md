# പരാതിപ്പെട്ടി (ParathiPetti)
### Unified Grievance Redressal Portal for Kerala Grama Panchayaths
*An initiative inspired by the Local Self Government Department (LSGD), Government of Kerala & Kerala Right to Services Act 2012 (സേവനാവകാശ നിയമം).*

---

## 🏛️ Overview

**ParathiPetti** (പരാതിപ്പെട്ടി - meaning "Grievance Box") is a citizen grievance redressal platform built for the **941 Grama Panchayaths** across all **14 Districts of Kerala**. 

The portal allows any civilian to draft and lodge a formal petition letter to **any specific authority** in the Panchayat (Elected Representatives, Executive Secretariat, Engineering, Health, Agriculture, or Welfare Officers). The petition is **promptly delivered** into the designated officer's digital in-tray, and the officer can conduct inspections, schedule actions, issue Action Taken Reports (ATRs), and update the live status with statutory 7-day SLA tracking.

---

## 🌟 Key Features

### 1. Civilian / Citizen Portal
- **Direct Authority Addressing**: Citizens can address their petition directly to:
  - **Grama Panchayat President** (പഞ്ചായത്ത് പ്രസിഡന്റ്) — Policy, governance, disaster relief
  - **Panchayat Secretary** (പഞ്ചായത്ത് സെക്രട്ടറി) — Executive orders, certificates, trade licenses
  - **Ward Member** (വാർഡ് മെമ്പർ) — Local roads, streetlights, drainage, neighborhood issues
  - **Assistant Engineer, LSGD** (അസിസ്റ്റന്റ് എഞ്ചിനീയർ) — PWD roads, culverts, building permits
  - **Health Inspector / JHI** (ഹെൽത്ത് ഇൻസ്പെക്ടർ) — Solid waste, plastic ban, public nuisance, sanitation
  - **Village Extension Officer - VEO** (വില്ലേജ് എക്സ്റ്റൻഷൻ ഓഫീസർ) — Life Mission housing, social pensions
  - **Agricultural Officer, Krishi Bhavan** (കൃഷി ഓഫീസർ) — Crop loss, flood damage compensation
  - **CDS Chairperson, Kudumbashree** (കുടുംബശ്രീ ചെയർപേഴ്സൺ) — Women empowerment & micro-enterprises
- **Authentic Kerala Location Hierarchy**: Select from all 14 Districts (Thiruvananthapuram, Kollam, Alappuzha, Kottayam, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur, Kasaragod, Idukki, Pathanamthitta) and their respective Grama Panchayaths and Wards.
- **Formal Malayalam Petition Generator**: Automatically drafts authentic Malayalam government petition phrasing (*"ബഹുമാനപ്പെട്ട അസിസ്റ്റന്റ് എഞ്ചിനീയർ അവർകൾ മുൻപാകെ..."*).
- **Official Letterhead Preview & Print Receipt**: Generates formal government letterhead with QR code, reference memo, token ID, and printable receipt.
- **Urgency Classification**: Categorize by `Normal`, `High`, or `Monsoon / Natural Calamity Emergency`.

### 2. Live Tracking & Audit Trail
- **Lookup by Token ID** (e.g., `KL-TVM-VNG-2026-0421`) or Registered Mobile Number.
- **Full Life-Cycle Timeline**:
  - `SUBMITTED` ➔ `ACKNOWLEDGED` ➔ `UNDER_REVIEW` ➔ `SITE_INSPECTION` ➔ `ACTION_IN_PROGRESS` ➔ `RESOLVED` / `REJECTED` / `FORWARDED`
- **Kerala Right to Services (RTS) SLA Countdown**: Real-time counter for the 7-day statutory deadline.
- **Action Taken Report (ATR) View**: Inspect field findings, sanctioned financial estimates, and government order numbers.
- **Citizen Feedback**: Citizens can officially rate satisfaction or submit dissatisfaction notes.

### 3. Authority Personnel Portal (ഉദ്യോഗസ്ഥ കാര്യാലയം)
- **Role Switcher**: Seamlessly switch between official personas (President, Secretary, Ward Member, Assistant Engineer, Health Inspector, VEO, etc.) or view the consolidated Panchayat inbox.
- **Immediate In-Tray Dispatch**: Every submitted petition immediately appears in the designated officer's queue with priority tags.
- **Status & ATR Updater**: Update status, schedule inspections, attach estimates, and record official sanction orders.
- **Inter-Departmental Forwarding**: If a petition is misrouted, officers can re-route it with an endorsement note.

### 4. Citizen Charter & Transparency (സേവനാവകാശം)
- Department-wise guaranteed SLA matrix.
- Penalty guidelines for officer delays under Kerala RTS Act 2012.
- Public feed of resolved cases and Ombudsman escalation guidance.

---

## 🛠️ Tech Stack & Deployment

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Kerala LSGD color palette: Kerala Emerald Green `#0c5e3d`, Temple Gold `#d97706`, Slate `#1e293b`)
- **Icons**: Lucide React
- **Data Layer**: Reactive LocalStorage state with pre-populated realistic Kerala Panchayat demo records
- **Deployment**: Optimized for zero-config deployment on **Vercel**

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone <repo-url>
cd parathipetty

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## ☁️ Deployment to Vercel

This repository is configured for standard Vercel deployment:

1. Push this git repository to your GitHub/GitLab account.
2. In the [Vercel Dashboard](https://vercel.com/new), import your `parathipetty` repository.
3. Keep the default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Deploy**!
