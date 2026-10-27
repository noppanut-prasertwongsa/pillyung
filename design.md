# pillyung (เมดเซฟ) — Design System & Technical Specification
> Designed for **PSAT HealthHacks 2026** — *Advancing Healthy Ageing Through Innovation*  
> Theme: **Apple-design-analysis** (Clean, Soothing, Photography-First & Senior-Accessible)

---

## 1. Executive Summary & Design Vision

**pillyung** is an intelligent medication safety and adherence platform engineered for lifelong health and senior wellness. Designed following Apple's human interface principles and the **Apple-design-analysis** system, the application delivers a tranquil, museum-grade aesthetic that eliminates cognitive overload.

By combining an **AI Prescription & Label Scanner (OCR)** with a verified Thai medical drug reference database, pillyung prevents adverse drug events, detects dangerous cross-allergy risks (such as Penicillins in Augmentin/Amoxicillin), explains drug-crushing contraindications, and offers a compassionate AI Pharmacist for side-effect reassurance.

### Core Design Values
1. **Tranquil Clarity**: Whitespace acts as a pedestal. Zero gratuitous gradients, zero noisy card borders, and no cluttered pill badges.
2. **Senior-First Ergonomics**: Minimum $48 \times 48\text{px}$ touch targets, generous 17px–22px type scale, high WCAG AAA contrast, and an instant "Senior Friendly Mode" for enlarged typography.
3. **Clinical Trust & Safety**: Medical alerts are unequivocal. When an allergy is detected, the UI shifts from serene neutrals to a deliberate, high-visibility alert state with clear clinical advice.
4. **Frictionless Demo Experience**: Designed with a built-in mobile viewport simulator (iPhone 16 Pro styling) and desktop presentation toolbar for effortless 60–90 second hackathon video recording.

---

## 2. Color Palette & Surface Tokens

pillyung strictly adopts the **Apple-design-analysis** palette. Every interactive element speaks through a single Action Blue (`#0066cc`), complemented by soothing parchment surfaces and clinical status indicators.

### A. Primary Brand & Accent
| Token | Hex | Role | Contrast vs Canvas |
|---|---|---|---|
| `colors.primary` (Action Blue) | `#0066cc` | The universal interactive color. Primary buttons, active tabs, focused inputs. | 4.8:1 (WCAG AA) |
| `colors.primary-focus` | `#0071e3` | Keyboard focus ring (`2px solid`) and active selection border. | 4.6:1 |
| `colors.primary-on-dark` | `#2997ff` | Links and highlights against dark tiles or overlays. | 7.1:1 |
| `colors.on-primary` | `#ffffff` | Text inside primary action buttons. | 4.8:1 |

### B. Canvas & Structural Neutrals
| Token | Hex | Usage |
|---|---|---|
| `colors.canvas` | `#ffffff` | Pure White background for primary content tiles and modal surfaces. |
| `colors.canvas-parchment` | `#f5f5f7` | Apple's signature off-white. Applied to page canvas, sub-nav bars, and footer. |
| `colors.surface-pearl` | `#fafafc` | Near-white fill for secondary interactive capsules and card containers. |
| `colors.surface-tile-1` | `#1d1d1f` | Deep ink tile for the simulated device chassis, dark modal overlays, and status headers. |
| `colors.hairline` | `#e5e5ea` | Subtle 1px structural dividing lines (never heavy card borders). |
| `colors.divider-soft` | `#f0f0f2` | Subtle inset divider for list rows. |

### C. Text & Typographic Ink
| Token | Hex | Usage |
|---|---|---|
| `colors.ink` | `#1d1d1f` | Near-black ink for headlines, body copy, and prominent medication names. |
| `colors.ink-muted-80` | `#48484a` | Secondary descriptions, dosage instructions, and timestamps. |
| `colors.ink-muted-48` | `#8e8e93` | Metadata, medical source citations, and disabled labels. |

### D. Clinical Semantic Tones
| Semantic State | Fill / Tint | Border / Accent | Text | Purpose |
|---|---|---|---|---|
| **Critical Allergy Alert** | `#fff1f0` | `#ff3b30` | `#d70015` | Severe penicillin cross-reaction, contraindication warnings. |
| **Adherence Completed** | `#f2f9f4` | `#34c759` | `#248a3d` | Medication taken confirmation checkmark. |
| **Scheduled Pending** | `#fff9f0` | `#ff9500` | `#b25e00` | Upcoming dosage reminder notification. |
| **Info / AI Insight** | `#f0f6ff` | `#0066cc` | `#004ea3` | Verified Thai National Formulary citation box. |

---

## 3. Typography & Hierarchy

pillyung utilizes `SF Pro Display` / `SF Pro Text` with fallback to `system-ui, -apple-system, sans-serif` and Thai font support via `Prompt, Sarabun, sans-serif`.

### Standard Mode vs. Senior Mode Type Scale

| Element | Standard Size | Senior Mode Size | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| **Hero Display** | 34px | 40px | 600 (Semibold) | 1.15 | -0.35px |
| **Section Header** | 24px | 28px | 600 (Semibold) | 1.25 | -0.20px |
| **Drug Name / Title** | 19px | 23px | 600 (Semibold) | 1.30 | -0.15px |
| **Body Primary** | 17px | 20px | 400 (Regular) | 1.47 | -0.10px |
| **Body Strong** | 17px | 20px | 600 (Semibold) | 1.35 | -0.10px |
| **Caption & Timing** | 14px | 17px | 400 (Regular) | 1.40 | 0.0px |
| **Micro Footnote** | 12px | 14px | 400 (Regular) | 1.30 | 0.0px |

### Key Typographic Rules
- **Negative Letter-Spacing**: Display sizes feature tight negative tracking for the signature Apple feel.
- **True 17px Base**: Standard body copy starts at 17px rather than the generic 16px or 14px, ensuring comfort for elderly eyes.
- **Zero-Pill Discipline**: Metadata uses unboxed typography with typographic bullet separators (`·` or `|`) rather than static colorful pill capsules.

---

## 4. Senior-Friendly UX & Accessibility Principles

To guarantee that elderly individuals and their caregivers can operate the app effortlessly:
1. **Generous Touch Targets**: All buttons, switches, and clickable list items provide $\ge 48\text{px}$ touch targets.
2. **Single-Elevation Cards**: No cards-inside-cards. Information is structured through calm vertical hierarchy, generous whitespace ($20\text{px}$–$24\text{px}$), and subtle 1px hairlines.
3. **Multi-Sensory Feedback**: Actions trigger visible confirmation rings, color state switches, and haptic/audio-visual simulation.
4. **One-Tap Actions**: Pre-configured sample buttons allow 1-click drug scanning and sample questions without typing on miniature keyboards.
5. **Jargon-Free Instructions**: Clear instructions such as *"รับประทานพร้อมอาหารทันที"* and *"ห้ามบดยา"* are presented in prominent cards.

---

## 5. Information Architecture & Navigation

The application is structured into a logical 3-stage user journey:

```
[ First-time Launch: Screen 0 - Health Baseline Onboarding ]
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    [ Tab 1 ]        [ Tab 2 ]        [ Tab 3 ]
  ยาของฉัน (Meds)   เตือนฉันที (Alerts)  ตั้งค่า (Settings)
         │                │                │
  • AI OCR Scanner • Morning Schedule • Senior Mode Toggle
  • Drug Card List • Evening Schedule • High Contrast Mode
  • Warning Badges • 1-Tap "ทานแล้ว"  • Allergy Profile
  • Ask AI Pharmacist                 • Vaccine Log
```

### 1. Screen 0: Health Baseline Onboarding
- **Header**: pillyung clean wordmark with brief friendly welcome.
- **Form Fields**:
  - Name: `สมชาย ใจดี`
  - Age: `68` ปี
  - Gender: `ชาย` / `หญิง` / `อื่นๆ`
  - Weight & Height: `65 กก.` / `168 ซม.` (พร้อมการคำนวณค่า BMI อัตโนมัติ: `23.0 kg/m²`)
  - Known Drug Allergies (Optional): ปุ่มเลือก `ไม่มีประวัติแพ้ยา (NKDA)` หรือ `มีประวัติแพ้ยา` (เช่น `Penicillin / Amoxicillin`)
- **Primary CTA**: Full-width Apple pill button `[ บันทึกข้อมูลและเข้าสู่ระบบ pillyung ]`

### 2. Screen 1: ยาของฉัน (My Medication) — *Primary Landing*
- **Header Action**: `[ 📷 สแกนฉลากยาด้วย AI ]` in Action Blue pill style.
- **Realistic Prescription Label OCR Scanner**:
  - รองรับการอัปโหลดไฟล์ภาพฉลากยาจริงจากคอมพิวเตอร์ หรือเลือกตัวอย่างภาพถ่ายซองยาโรงพยาบาลที่สมจริง (Metformin / Augmentin)
  - แสดงภาพถ่ายฉลากยาจริงขึ้นมาในหน้าต่างสแกนเนอร์ พร้อมเลเซอร์สแกนและกรอบตรวจจับตัวหนังสือ (OCR Bounding Box)
- **Medication Cards**:
  - Drug Name & Strength: e.g., `Metformin 500 mg`
  - Dosage & Route: `1 เม็ด | วันละ 2 ครั้ง | รับประทานพร้อมอาหารทันที`
  - Clinical Warnings Box: Highlighted warning against crushing/chewing (`⚠️ กลืนทั้งเม็ด ห้ามเคี้ยวหรือบดยา`).
  - Action Link: `[ 💬 ปรึกษาอาการ / ผลข้างเคียงของยานี้กับ AI เภสัชกร ]`

### 3. Screen 2: เตือนฉันที (Medication Reminders)
- **Header**: Daily progress summary (e.g. `ทานแล้ว 2 จาก 4 รายการวันนี้`).
- **Timeline Slots**:
  - Morning (`☀️ มื้อเช้า 08:00 น.`): แสดงป้ายขนาดยาขนาดใหญ่พิเศษ `[ 1 เม็ด ]`
  - Evening (`🌙 มื้อเย็น 18:00 น.`): แสดงป้ายขนาดยา `[ 1 เม็ด ]`
- **Senior Mode (ขยายตัวอักษรใหญ่)**:
  - หัวข้อมื้ออาหาร ("☀️ มื้อเช้า") และป้ายขนาดยา ("1 เม็ด") จะขยายใหญ่ขึ้นเป็น 24px–28px พร้อมสีกรอบที่เด่นชัด อ่านง่ายแม้ผู้สูงอายุมีสายตายาวหรือต้อกระจก
- **Interactive Check-off**: Tapping `[ กดบันทึกการกินยา ]` smoothly updates to `[ ทานแล้วเรียบร้อย ✓ ]` with a serene green checkmark.

### 4. Screen 3: ตั้งค่า & ข้อมูลผู้ใช้ (Settings & Profile)
- **User Health Card**: Editable basic information, persistent allergy warning tag, and vaccine checklist.
- **Accessibility Suite**:
  - `Toggle: โหมดตัวหนังสือขนาดใหญ่ (Senior Friendly)`
  - `Toggle: โหมดสีคอนทราสต์สูง (High Contrast)`
  - `Toggle: เสียงเตือนเมื่อถึงเวลาทานยา (Voice Reminder)`
- **Data Source Verification**: Citation badges referencing the Thai National List of Essential Medicines & MIMS Thailand.

---

## 6. Smart Features & AI Integration Specification

### Feature A: AI OCR Scanner & Safety Check
When the user clicks `[ 📷 สแกนฉลากยาด้วย AI ]`, a bottom sheet modal presents simulated prescription labels:
1. **Safe Drug Example**: *Metformin 500 mg*  
   $\rightarrow$ System matches Thai medical book database, populates dosage, creates reminder schedule, and displays crush warning.
2. **Severe Cross-Allergy Example**: *Augmentin 1000 mg (Amoxicillin + Clavulanic acid)*  
   $\rightarrow$ System compares against `Penicillin` allergy tag, immediately blocks addition, and triggers the **Critical Allergy Alert Modal**.

### Feature B: Critical Allergy Alert Modal
- **Visual Design**: High-contrast white modal framed with an Apple-style red safety accent line (`#ff3b30`).
- **Symbol**: Minimalist warning octagon / shield icon.
- **Content**:
  - **Headline**: *ตรวจพบความเสี่ยงแพ้ยารุนแรง!*
  - **Explanation**: *ยา Augmentin มีตัวยา Amoxicillin ซึ่งเป็นยาในกลุ่ม Penicillin ตรงกับประวัติการแพ้ยาของคุณ*
  - **Recommendation**: *ห้ามรับประทานยานี้เด็ดขาด กรุณาแจ้งแพทย์หรือเภสัชกรเพื่อเปลี่ยนกลุ่มยา*
- **Action**: High-visibility dismissal button `[ ยกเลิกรายการยา ]`.

### Feature C: AI Pharmacist Assistant Modal
- Grounded strictly in verified Thai clinical reference data (no hallucinations).
- Contextual to the selected drug (e.g. Metformin).
- Includes one-tap quick prompt chips:
  - *❓ "ทานแล้วคลื่นไส้ แน่นท้อง ปกติไหม?"* $\rightarrow$ AI explains it is a common transient side effect of Biguanides and suggests taking it during meals.
  - *❓ "ยานี้เม็ดใหญ่ บดหรือเคี้ยวได้ไหม?"* $\rightarrow$ AI warns that crushing destroys the extended-release formulation and irritates the stomach.
  - *❓ "ลืมทานยาตอนเช้า ต้องเบิ้ลมื้อเย็นไหม?"* $\rightarrow$ AI instructs to skip the missed dose and never double doses.

---

## 7. Verified Thai Drug Reference Mock Database (JSON Schema)

```json
[
  {
    "id": "DRUG-001",
    "trade_name": "Glucophage",
    "generic_name": "Metformin hydrochloride",
    "strength": "500 mg",
    "category": "ยารักษาโรคเบาหวาน",
    "drug_group": "Biguanides",
    "route": "รับประทาน",
    "frequency": "วันละ 2 ครั้ง (เช้า - เย็น)",
    "timing": "พร้อมอาหารหรือหลังอาหารทันที",
    "instructions": "รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง พร้อมอาหารหรือหลังอาหารทันที เพื่อลดอาการระคายเคืองกระเพาะ",
    "can_crush": false,
    "warnings": "กลืนทั้งเม็ด ห้ามเคี้ยวหรือบดยาเด็ดขาด",
    "common_side_effects": "คลื่นไส้ พะอืดพะอม แน่นท้อง ท้องเสียช่วง 1-2 สัปดาห์แรก ซึ่งมักหายได้เองเมื่อร่างกายปรับตัว",
    "cross_allergies": [],
    "reference_source": "คู่มือการใช้ยาอย่างสมเหตุผลตามบัญชียาหลักแห่งชาติ (Thai NLEM)"
  },
  {
    "id": "DRUG-002",
    "trade_name": "Augmentin",
    "generic_name": "Amoxicillin + Clavulanic acid",
    "strength": "1000 mg",
    "category": "ยาปฏิชีวนะ (ฆ่าเชื้อแบคทีเรีย)",
    "drug_group": "Penicillins",
    "route": "รับประทาน",
    "frequency": "วันละ 2 ครั้ง (เช้า - เย็น ห่างกัน 12 ชม.)",
    "timing": "ก่อนอาหาร หรือ พร้อมอาหาร",
    "instructions": "รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง ติดต่อกันจนหมดตามแพทย์สั่งอย่างเคร่งครัด",
    "can_crush": true,
    "warnings": "ห้ามใช้ในผู้ที่มีประวัติแพ้ยากลุ่ม Penicillin และต้องทานยาให้ครบระยะเวลาเพื่อป้องกันเชื้อดื้อยา",
    "common_side_effects": "ถ่ายเหลว คลื่นไส้ ผื่นคัน ผิวหนังอักเสบ",
    "cross_allergies": ["Penicillin", "Amoxicillin", "Ampicillin"],
    "reference_source": "MIMS Thailand & คณะกรรมการอาหารและยา (อย.)"
  },
  {
    "id": "DRUG-003",
    "trade_name": "Norvasc",
    "generic_name": "Amlodipine besylate",
    "strength": "5 mg",
    "category": "ยาลดความดันโลหิตสูง",
    "drug_group": "Calcium Channel Blockers (CCB)",
    "route": "รับประทาน",
    "frequency": "วันละ 1 ครั้ง",
    "timing": "หลังอาหารเช้า เวลาเดียวกันทุกวัน",
    "instructions": "รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง ในช่วงเช้า",
    "can_crush": true,
    "warnings": "ไม่ควรหยุดยาเองกะทันหัน ระวังอาการหน้ามืดเมื่อเปลี่ยนอิริยาบถเร็วๆ",
    "common_side_effects": "ข้อเท้าบวม หน้าแดง ร้อนวูบวาบ เวียนศีรษะเล็กน้อย",
    "cross_allergies": [],
    "reference_source": "คู่มือมาตรฐานการจัดการโรคความดันโลหิตสูง สมาคมความดันโลหิตสูงแห่งประเทศไทย"
  },
  {
    "id": "DRUG-004",
    "trade_name": "Tylenol",
    "generic_name": "Paracetamol",
    "strength": "500 mg",
    "category": "ยาบรรเทาปวด ลดไข้",
    "drug_group": "Analgesics / Antipyretics",
    "route": "รับประทาน",
    "frequency": "ทานเมื่อมีอาการ ทุก 4-6 ชม.",
    "timing": "ก่อนหรือหลังอาหาร",
    "instructions": "รับประทานครั้งละ 1 เม็ด เมื่อมีอาการปวดหรือเป็นไข้ ห่างกันอย่างน้อย 4-6 ชั่วโมง (ไม่เกิน 8 เม็ด/วัน)",
    "can_crush": true,
    "warnings": "ห้ามทานเกินวันละ 4,000 มก. เพราะอาจเป็นพิษต่อตับ และห้ามทานร่วมกับเครื่องดื่มแอลกอฮอล์",
    "common_side_effects": "อาการข้างเคียงพบน้อยมาก หากใช้ในขนาดที่ถูกต้อง",
    "cross_allergies": [],
    "reference_source": "เภสัชตำรับโรงพยาบาลศิริราช & บัญชียาหลักแห่งชาติ"
  }
]
```

---

## 8. Presentation & Demo Video Recording Guide (PSAT HealthHacks 2026)

This application is built with a **Presentation Shell**:
1. **Desktop Viewport Frame**: Simulates an Apple iPhone 16 Pro mockup in the center of the browser screen with smooth shadows and dynamic status bar.
2. **Presenter Control Strip**: A discreet top control bar allowing the presenter to:
   - Reset Demo to First-time Onboarding (`🔄 รีเซ็ตการสาธิต`)
   - Toggle Senior-Friendly Large Font (`🔤 ขยายตัวอักษร`)
   - Simulate Prescription Scan: Safe Metformin (`📷 สแกนยาปกติ`)
   - Simulate Prescription Scan: Dangerous Augmentin (`⚠️ จำลองแพ้ยา`)
   - Open AI Pharmacist Assistant (`💬 ปรึกษา AI`)

### 90-Second Demo Storyboard Script:
- **00:00 - 00:20 (Baseline Onboarding)**: Show user profile creation with age 68, Penicillin allergy history, and Lifespan Vaccine checklist. Click "เริ่มต้นใช้งาน".
- **00:20 - 00:40 (AI Scan & Auto-lookup)**: Click AI Scan $\rightarrow$ Metformin. Point out automated dosage, crush warning, and automatic synchronization to the "เตือนฉันที" schedule.
- **00:40 - 01:05 (Killer Safety Feature: Allergy Alert)**: Click AI Scan $\rightarrow$ Augmentin. Highlight the instant red alert showing cross-allergy detection against Penicillin.
- **01:05 - 01:20 (AI Pharmacist Assistant)**: Open AI Chat on Metformin card. Click "ทานแล้วคลื่นไส้ ปกติไหม?". Show real-time evidence-based response explaining common side effects.
- **01:20 - 01:30 (Healthy Ageing UI & Reminders)**: Switch to "เตือนฉันที", check off morning pill. Switch to "ตั้งค่า", toggle Senior Large Mode. Conclude on sustainable wellness and medication safety across a lifetime.
