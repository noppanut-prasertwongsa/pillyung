import { DayAdherenceRecord, DailyDoseRecord, ScheduledDose } from '../types';

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];
const THAI_MONTHS_LONG = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

/**
 * Generate realistic 30-day medication adherence history.
 * If liveScheduledDoses are provided, Day 0 (today) will reflect the actual live state.
 */
export function generate30DayAdherenceHistory(liveScheduledDoses?: ScheduledDose[]): DayAdherenceRecord[] {
  const records: DayAdherenceRecord[] = [];
  const baseDate = new Date();

  // Prescribed standard daily regimen
  const standardDailyDoses: Omit<DailyDoseRecord, 'id' | 'status' | 'takenAt' | 'note'>[] = [
    {
      drugId: 'DRUG-003',
      drugName: 'Norvasc 5 mg',
      dose: '1 เม็ด',
      meal: 'morning',
      scheduledTime: '08:00 น.',
    },
    {
      drugId: 'DRUG-001',
      drugName: 'Glucophage 500 mg',
      dose: '1 เม็ด',
      meal: 'morning',
      scheduledTime: '08:00 น.',
    },
    {
      drugId: 'DRUG-006',
      drugName: 'Ventolin Evohaler',
      dose: '2 สูด',
      meal: 'morning',
      scheduledTime: '08:00 น.',
    },
    {
      drugId: 'DRUG-001',
      drugName: 'Glucophage 500 mg',
      dose: '1 เม็ด',
      meal: 'evening',
      scheduledTime: '18:00 น.',
    },
  ];

  // Specific simulation profile for realistic missed doses across 30 days
  // dayIndex: 0 = today, 1 = yesterday, etc.
  const missedDoseMap: Record<number, { meal: string; note: string }[]> = {
    3: [{ meal: 'evening', note: 'ลืมทานมื้อเย็นเนื่องจากออกไปรับประทานอาหารนอกบ้าน' }],
    9: [{ meal: 'evening', note: 'หลับพักผ่อนก่อนเวลาแจ้งเตือนมื้อเย็น' }],
    14: [{ meal: 'morning', note: 'ลืมพ่นยา Ventolin ในช่วงเช้า' }],
    21: [{ meal: 'evening', note: 'ลืมพกยา Glucophage ติดตัว' }],
    26: [{ meal: 'morning', note: 'ทานมื้อเช้าช้ากว่าปกติ ข้ามยาลดความดัน' }],
  };

  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);

    const yearBE = d.getFullYear() + 543;
    const monthShort = THAI_MONTHS_SHORT[d.getMonth()];
    const monthLong = THAI_MONTHS_LONG[d.getMonth()];
    const dayOfWeek = THAI_DAYS[d.getDay()];
    const dayNumber = d.getDate();
    const dateString = d.toISOString().split('T')[0];
    const displayDate = `${dayNumber} ${monthShort} ${yearBE}`;
    const monthYear = `${monthLong} ${yearBE}`;
    const isToday = i === 0;

    let dayDoses: DailyDoseRecord[] = [];

    if (isToday && liveScheduledDoses && liveScheduledDoses.length > 0) {
      // Use live state for today
      dayDoses = liveScheduledDoses.map((dose, idx) => ({
        id: `dose-history-today-${idx}`,
        drugId: dose.drugId,
        drugName: dose.drugName,
        dose: dose.dose,
        meal: dose.meal,
        scheduledTime: dose.time,
        status: dose.taken ? 'taken' : 'missed',
        takenAt: dose.takenAt || (dose.taken ? '08:12 น.' : undefined),
        note: dose.taken ? 'รับประทานตรงเวลา' : 'ยังไม่ได้รับประทาน',
      }));
    } else {
      // Historical days
      const missedConfigs = missedDoseMap[i] || [];

      dayDoses = standardDailyDoses.map((std, idx) => {
        const isMissed = missedConfigs.some((m) => m.meal === std.meal && std.drugName.includes(m.meal === 'morning' && i === 14 ? 'Ventolin' : 'Glucophage'));
        const missedConfig = missedConfigs.find((m) => m.meal === std.meal);

        if (isMissed) {
          return {
            id: `dose-hist-${dateString}-${idx}`,
            ...std,
            status: 'missed',
            note: missedConfig?.note || 'ไม่ได้บันทึกการรับประทาน',
          };
        } else {
          // Generate realistic taken timestamp slightly varying around scheduled time
          let takenAt = '08:08 น.';
          if (std.meal === 'evening') takenAt = '18:15 น.';
          if (std.meal === 'noon') takenAt = '12:10 น.';

          return {
            id: `dose-hist-${dateString}-${idx}`,
            ...std,
            status: 'taken',
            takenAt,
            note: 'รับประทานตรงเวลาตามแพทย์สั่ง',
          };
        }
      });
    }

    const totalDoses = dayDoses.length;
    const takenDoses = dayDoses.filter((dose) => dose.status === 'taken').length;
    const missedDoses = totalDoses - takenDoses;
    const adherencePercentage = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

    let status: 'complete' | 'partial' | 'missed' = 'complete';
    if (adherencePercentage === 0) status = 'missed';
    else if (adherencePercentage < 100) status = 'partial';

    records.push({
      dateString,
      displayDate,
      dayOfWeek,
      dayNumber,
      monthYear,
      isToday,
      totalDoses,
      takenDoses,
      missedDoses,
      adherencePercentage,
      status,
      doses: dayDoses,
    });
  }

  return records;
}

/**
 * Calculate overarching metrics for the 30-day period
 */
export function calculateAdherenceMetrics(history: DayAdherenceRecord[]) {
  let totalDoses = 0;
  let takenDoses = 0;
  let missedDoses = 0;
  let perfectDays = 0;
  let currentStreak = 0;
  let isStreakActive = true;

  // Records are ordered from today (index 0) to 29 days ago
  history.forEach((day, idx) => {
    totalDoses += day.totalDoses;
    takenDoses += day.takenDoses;
    missedDoses += day.missedDoses;

    if (day.status === 'complete') {
      perfectDays++;
      if (isStreakActive) {
        currentStreak++;
      }
    } else {
      // If today is incomplete, don't break streak if doses are still upcoming
      if (idx !== 0) {
        isStreakActive = false;
      }
    }
  });

  const overallPercentage = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  return {
    totalDoses,
    takenDoses,
    missedDoses,
    perfectDays,
    currentStreak: Math.max(currentStreak, 3), // e.g. at least 3-day active streak
    overallPercentage,
  };
}
