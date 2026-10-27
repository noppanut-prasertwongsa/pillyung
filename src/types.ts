export interface DrugSideEffectDetail {
  id: string;
  name: string;
  isUrgent: boolean; // true = red flag / severe allergic reaction, false = common mild
  description: string;
  frequencyRate: string; // e.g. "พบบ่อย (10-20%)" or "พบได้น้อย (<1%)"
  imageUrl?: string;
  recommendation: string;
}

export interface DrugSpecialTechnique {
  deviceType: 'metered_dose_inhaler' | 'nasal_spray' | 'eye_drops' | 'insulin_pen';
  title: string;
  badge: string; // e.g. "ยาพ่นสูดชนิด MDI"
  duration: number; // in seconds, e.g. 18
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    timestamp: string;
    keyTip?: string;
  }[];
  videoThumbnailUrl?: string;
}

export interface Drug {
  id: string;
  tradeName: string;
  genericName: string;
  strength: string;
  category: string;
  drugGroup: string;
  route: string;
  frequency: string;
  timing: string;
  instructions: string;
  canCrush: boolean;
  warnings: string;
  pharmacistAdvice?: string;
  commonSideEffects: string;
  crossAllergies: string[];
  referenceSource: string;
  scheduleMeal: ('morning' | 'noon' | 'evening' | 'bedtime')[];
  iconType?: string;
  labelImageUrl?: string;
  isSpecialTechnique?: boolean;
  specialTechnique?: DrugSpecialTechnique;
  sideEffectDetails?: DrugSideEffectDetail[];
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'unspecified';
  weight: number; // in kg
  height: number; // in cm
  hasAllergy: boolean;
  allergies: string[];
  allergySymptoms: string;
}

export interface ScheduledDose {
  id: string;
  drugId: string;
  drugName: string;
  dose: string;
  meal: 'morning' | 'noon' | 'evening' | 'bedtime';
  time: string;
  instructions: string;
  taken: boolean;
  takenAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  sourceRef?: string;
}

export interface DailyDoseRecord {
  id: string;
  drugId: string;
  drugName: string;
  dose: string;
  meal: 'morning' | 'noon' | 'evening' | 'bedtime';
  scheduledTime: string;
  status: 'taken' | 'missed';
  takenAt?: string;
  note?: string;
}

export interface DayAdherenceRecord {
  dateString: string; // ISO format "2026-10-24"
  displayDate: string; // "24 ต.ค. 2569"
  dayOfWeek: string; // "เสาร์"
  dayNumber: number; // 24
  monthYear: string; // "ตุลาคม 2569"
  isToday: boolean;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  adherencePercentage: number;
  status: 'complete' | 'partial' | 'missed';
  doses: DailyDoseRecord[];
}

export interface SurveyAnswerRecord {
  id?: string;
  doseId: string;
  drugName: string;
  question: string;
  selectedChoice: string;
  answeredAt: string;
  dateStr?: string;
  symptomAnswer?: string;
  convenienceAnswer?: string;
  adherenceAnswer?: string;
}


