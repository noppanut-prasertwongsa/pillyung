import React, { useState, useEffect } from 'react';
import { Drug, UserProfile, ScheduledDose, SurveyAnswerRecord } from './types';
import { INITIAL_DRUG_DATABASE } from './data/mockDrugs';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MyMedicationTab } from './components/MyMedicationTab';
import { ReminderTab } from './components/ReminderTab';
import { SettingsTab } from './components/SettingsTab';
import { IOSPhotosPickerModal } from './components/IOSPhotosPickerModal';
import { AllergyAlertModal } from './components/AllergyAlertModal';
import { SideEffectsModal } from './components/SideEffectsModal';
import { SpecialTechniqueVideoModal } from './components/SpecialTechniqueVideoModal';
import { UserGuideModal } from './components/UserGuideModal';
import { SplashScreen } from './components/SplashScreen';
import { AIPHarmacistTab } from './components/AIPHarmacistTab';
import { IOSMedAlarmModal } from './components/IOSMedAlarmModal';
import { AlarmSoundType } from './utils/audioAlert';
import { Pill, Clock, Settings, MessageCircle } from 'lucide-react';

export default function App() {
  // Live current time for iPhone status bar (HH:mm)
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Onboarding state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Active tab in main app (4 tabs: medication, reminder, chat, settings)
  const [activeTab, setActiveTab] = useState<'medication' | 'reminder' | 'chat' | 'settings'>('medication');

  // User Profile with weight, height, gender
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'นายสมชาย ใจดี',
    age: 68,
    gender: 'male',
    weight: 65,
    height: 168,
    hasAllergy: true,
    allergies: ['Penicillin', 'Amoxicillin'],
    allergySymptoms: 'ผื่นลมพิษ แน่นหน้าอกเฉียบพลัน',
  });

  // Active medications:
  // Norvasc (DRUG-003 - Oral tablet)
  // Glucophage / Metformin (DRUG-001 - Oral tablet)
  // Ventolin Evohaler (DRUG-006 - Special Technique MDI Inhaler)
  const [activeDrugs, setActiveDrugs] = useState<Drug[]>([
    INITIAL_DRUG_DATABASE[3],
    INITIAL_DRUG_DATABASE[0],
    INITIAL_DRUG_DATABASE[1],
  ]);

  // Scheduled Doses for Reminder tab
  const [scheduledDoses, setScheduledDoses] = useState<ScheduledDose[]>([
    {
      id: 'dose-nor-1',
      drugId: 'DRUG-003',
      drugName: 'Norvasc 5 mg',
      dose: '1 เม็ด',
      meal: 'morning',
      time: '08:00 น.',
      instructions: 'รับประทานครั้งละ 1 เม็ด ในช่วงเช้าสม่ำเสมอ',
      taken: false,
    },
    {
      id: 'dose-1',
      drugId: 'DRUG-001',
      drugName: 'Glucophage 500 mg',
      dose: '1 เม็ด',
      meal: 'morning',
      time: '08:00 น.',
      instructions: 'พร้อมอาหารเช้าทันที (ห้ามบดยา)',
      taken: false,
    },
    {
      id: 'dose-2',
      drugId: 'DRUG-006',
      drugName: 'Ventolin Evohaler',
      dose: '2 สูด',
      meal: 'morning',
      time: '08:00 น.',
      instructions: 'สูดพ่นทางปากแล้วกลั้นหายใจ 10 วินาที พร้อมบ้วนปาก',
      taken: false,
    },
    {
      id: 'dose-3',
      drugId: 'DRUG-001',
      drugName: 'Glucophage 500 mg',
      dose: '1 เม็ด',
      meal: 'evening',
      time: '18:00 น.',
      instructions: 'พร้อมอาหารเย็นทันที (ห้ามบดยา)',
      taken: false,
    },
  ]);

  // Accessibility & Presenter modes (with localStorage persistence)
  const [seniorMode, setSeniorMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pillyung_senior_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pillyung_senior_mode', String(seniorMode));
    } catch (e) {
      console.warn('Failed to persist seniorMode to localStorage', e);
    }
  }, [seniorMode]);

  const [highContrast, setHighContrast] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [alarmSoundType, setAlarmSoundType] = useState<AlarmSoundType>('nene');

  // Medication Adherence Evaluation Form Survey Logs
  const [surveyLogs, setSurveyLogs] = useState<SurveyAnswerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pillyung_survey_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse survey logs from localStorage', e);
    }
    return [
      {
        id: 'log-1',
        doseId: 'dose-nor-1',
        drugName: 'Norvasc 5 mg',
        question: 'แบบประเมินการใช้ยา 3 ด้าน (อาการ, ความสะดวก, ความสม่ำเสมอ)',
        selectedChoice: 'ปกติ / สะดวกดี / รับประทานตรงเวลา',
        answeredAt: '08:05 น.',
        dateStr: 'วันนี้',
        symptomAnswer: 'ปกติ ไม่มีอาการผิดปกติใดๆ',
        convenienceAnswer: 'สะดวกดี ไม่มีปัญหาในการใช้ยา',
        adherenceAnswer: 'รับประทานตรงเวลาตามแผนครบถ้วน',
      },
      {
        id: 'log-2',
        doseId: 'dose-1',
        drugName: 'Glucophage 500 mg',
        question: 'แบบประเมินการใช้ยา 3 ด้าน (อาการ, ความสะดวก, ความสม่ำเสมอ)',
        selectedChoice: 'ปกติ / สะดวกดี / รับประทานตรงเวลา',
        answeredAt: '08:10 น.',
        dateStr: 'เมื่อวาน',
        symptomAnswer: 'ปกติ ไม่มีอาการผิดปกติใดๆ',
        convenienceAnswer: 'เม็ดยาใหญ่ กลืนค่อนข้างยากเล็กน้อย',
        adherenceAnswer: 'รับประทานตรงเวลาตามแผนครบถ้วน',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('pillyung_survey_logs', JSON.stringify(surveyLogs));
    } catch (e) {
      console.warn('Failed to save survey logs to localStorage', e);
    }
  }, [surveyLogs]);

  const handleSurveyAnswer = (newRecord: SurveyAnswerRecord) => {
    const recordWithMeta: SurveyAnswerRecord = {
      ...newRecord,
      id: `survey-${Date.now()}`,
      dateStr: 'วันนี้',
    };
    setSurveyLogs((prev) => [recordWithMeta, ...prev]);
  };

  const handleClearSurveyLogs = () => {
    setSurveyLogs([]);
  };

  // Modals state
  const [isIOSPhotosOpen, setIsIOSPhotosOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [detectedAllergicDrug, setDetectedAllergicDrug] = useState<Drug | null>(null);

  const [chatSelectedDrug, setChatSelectedDrug] = useState<Drug | null>(INITIAL_DRUG_DATABASE[0]);

  // Side Effects & Special Technique Video Modals
  const [isSideEffectsOpen, setIsSideEffectsOpen] = useState(false);
  const [selectedSideEffectsDrug, setSelectedSideEffectsDrug] = useState<Drug | null>(null);

  const [isSpecialTechniqueOpen, setIsSpecialTechniqueOpen] = useState(false);
  const [selectedSpecialTechniqueDrug, setSelectedSpecialTechniqueDrug] = useState<Drug | null>(null);

  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isMedAlarmOpen, setIsMedAlarmOpen] = useState(false);

  // Auto trigger alarm if live time hits 17:30
  useEffect(() => {
    if (currentTime.startsWith('17:30')) {
      setIsMedAlarmOpen(true);
    }
  }, [currentTime]);

  const handleTriggerMedAlarm = () => {
    setIsMedAlarmOpen(true);
  };

  // Sub-navigation inside My Medication tab: 'drugs' vs 'history'
  const [medicationSubTab, setMedicationSubTab] = useState<'drugs' | 'history'>('drugs');

  // Handle Onboarding Completion
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setHasCompletedOnboarding(true);
    setActiveTab('medication');
  };

  // Add drug to schedule helper
  const syncDrugToSchedule = (drug: Drug) => {
    if (!drug.scheduleMeal || drug.scheduleMeal.length === 0) {
      return;
    }
    const newDoses: ScheduledDose[] = [];

    drug.scheduleMeal.forEach((meal, idx) => {
      let time = '08:00 น.';
      if (meal === 'noon') time = '12:00 น.';
      if (meal === 'evening') time = '18:00 น.';
      if (meal === 'bedtime') time = '21:00 น.';

      newDoses.push({
        id: `dose-${drug.id}-${meal}-${idx}`,
        drugId: drug.id,
        drugName: `${drug.tradeName} ${drug.strength}`,
        dose: drug.isSpecialTechnique ? '1-2 สูด' : '1 เม็ด',
        meal,
        time,
        instructions: drug.instructions,
        taken: false,
      });
    });

    setScheduledDoses((prev) => [...prev, ...newDoses]);
  };

  // Process Scan Result from iOS Photos Picker
  const handleScanResult = (scannedDrug: Drug, customImage?: string) => {
    setIsIOSPhotosOpen(false);

    // Cross-Allergy Check
    if (userProfile.hasAllergy) {
      const isPenicillinAllergic = userProfile.allergies.some((a) =>
        a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('amoxicillin')
      );

      const isDrugPenicillinRelated =
        scannedDrug.drugGroup.toLowerCase().includes('penicillin') ||
        scannedDrug.crossAllergies.some((ca) =>
          ca.toLowerCase().includes('penicillin') || ca.toLowerCase().includes('amoxicillin')
        );

      if (isPenicillinAllergic && isDrugPenicillinRelated) {
        setDetectedAllergicDrug(scannedDrug);
        setIsAllergyModalOpen(true);
        return;
      }
    }

    // If safe, add to list if not present
    if (!activeDrugs.some((d) => d.id === scannedDrug.id)) {
      const drugWithImage = customImage ? { ...scannedDrug, labelImageUrl: customImage } : scannedDrug;
      setActiveDrugs((prev) => [drugWithImage, ...prev]);
      syncDrugToSchedule(scannedDrug);
    }
  };

  // Add drug manually (from ManualAddDrugModal)
  const handleAddManualDrug = (newDrug: Drug) => {
    // Cross-Allergy Check
    if (userProfile.hasAllergy) {
      const isPenicillinAllergic = userProfile.allergies.some((a) =>
        a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('amoxicillin')
      );

      const isDrugPenicillinRelated =
        newDrug.drugGroup.toLowerCase().includes('penicillin') ||
        newDrug.crossAllergies.some((ca) =>
          ca.toLowerCase().includes('penicillin') || ca.toLowerCase().includes('amoxicillin')
        );

      if (isPenicillinAllergic && isDrugPenicillinRelated) {
        setDetectedAllergicDrug(newDrug);
        setIsAllergyModalOpen(true);
        return;
      }
    }

    if (!activeDrugs.some((d) => d.id === newDrug.id)) {
      setActiveDrugs((prev) => [newDrug, ...prev]);
      syncDrugToSchedule(newDrug);
    }
  };

  // Remove drug
  const handleRemoveDrug = (drugId: string) => {
    setActiveDrugs((prev) => prev.filter((d) => d.id !== drugId));
    setScheduledDoses((prev) => prev.filter((d) => d.drugId !== drugId));
  };

  // Toggle dose taken
  const handleToggleTaken = (doseId: string) => {
    setScheduledDoses((prev) =>
      prev.map((dose) => {
        if (dose.id === doseId) {
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
          ).padStart(2, '0')} น.`;
          return {
            ...dose,
            taken: !dose.taken,
            takenAt: !dose.taken ? timeStr : undefined,
          };
        }
        return dose;
      })
    );
  };

  // Open side effects modal
  const handleOpenSideEffects = (drug: Drug) => {
    setSelectedSideEffectsDrug(drug);
    setIsSideEffectsOpen(true);
  };

  // Open special technique video modal
  const handleOpenSpecialTechniqueVideo = (drug: Drug) => {
    setSelectedSpecialTechniqueDrug(drug);
    setIsSpecialTechniqueOpen(true);
  };

  // Reset demo
  const handleResetDemo = () => {
    setShowSplash(true);
    setHasCompletedOnboarding(false);
    setActiveTab('medication');
    setActiveDrugs([INITIAL_DRUG_DATABASE[3], INITIAL_DRUG_DATABASE[0], INITIAL_DRUG_DATABASE[1]]);
    setScheduledDoses([
      {
        id: 'dose-nor-1',
        drugId: 'DRUG-003',
        drugName: 'Norvasc 5 mg',
        dose: '1 เม็ด',
        meal: 'morning',
        time: '08:00 น.',
        instructions: 'รับประทานครั้งละ 1 เม็ด ในช่วงเช้าสม่ำเสมอ',
        taken: false,
      },
      {
        id: 'dose-1',
        drugId: 'DRUG-001',
        drugName: 'Glucophage 500 mg',
        dose: '1 เม็ด',
        meal: 'morning',
        time: '08:00 น.',
        instructions: 'พร้อมอาหารเช้าทันที (ห้ามบดยา)',
        taken: false,
      },
      {
        id: 'dose-2',
        drugId: 'DRUG-006',
        drugName: 'Ventolin Evohaler',
        dose: '2 สูด',
        meal: 'morning',
        time: '08:00 น.',
        instructions: 'สูดพ่นทางปากแล้วกลั้นหายใจ 10 วินาที พร้อมบ้วนปาก',
        taken: false,
      },
      {
        id: 'dose-3',
        drugId: 'DRUG-001',
        drugName: 'Glucophage 500 mg',
        dose: '1 เม็ด',
        meal: 'evening',
        time: '18:00 น.',
        instructions: 'พร้อมอาหารเย็นทันที (ห้ามบดยา)',
        taken: false,
      },
    ]);
  };

  return (
    <div
      className={`min-h-[100dvh] flex flex-col bg-white ${seniorMode ? 'senior-mode-active' : ''} ${
        highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Main Viewport Container */}
      <main className="flex-1 flex items-stretch justify-center p-0 overflow-hidden">
        <div
          className="app-shell relative w-full h-[100dvh] max-w-none p-0 rounded-none bg-white flex flex-col"
        >
          <div className={`w-full h-full bg-[#ffffff] overflow-hidden flex flex-col relative ${seniorMode ? 'senior-mode-active' : ''}`}>
            {/* Splash Screen Component (when triggered or replayed) */}
            {showSplash && (
              <SplashScreen
                inline
                duration={1800}
                onFinish={() => setShowSplash(false)}
              />
            )}
            
            {/* Screen Content Engine */}
            <div className="flex-1 overflow-y-auto relative flex flex-col">
              {!hasCompletedOnboarding ? (
                /* Screen 0: Baseline Onboarding */
                <OnboardingScreen
                  onComplete={handleOnboardingComplete}
                  seniorMode={seniorMode}
                />
              ) : (
                /* Post-Onboarding Main App */
                <div className="flex-1 flex flex-col h-full bg-[#f5f5f7]">
                  {/* Top Bar Strip */}
                  <div className="bg-[#ffffff] border-b border-[#e5e5ea] px-4 py-2.5 flex items-center justify-between shrink-0">
                    <div className="min-w-0 flex-1">
                      <h1 className="font-bold text-base text-[#1d1d1f] tracking-tight truncate">
                        {activeTab === 'medication' && 'ยาของฉัน'}
                        {activeTab === 'reminder' && 'เตือนฉันที'}
                        {activeTab === 'chat' && 'AI เภสัชกร'}
                        {activeTab === 'settings' && 'ตั้งค่า & ข้อมูลผู้ใช้'}
                      </h1>
                      <p className="text-[11px] text-[#8e8e93] truncate">
                        ผู้ป่วย: {userProfile.name} ({userProfile.age} ปี · {userProfile.weight} กก.)
                      </p>
                    </div>

                    {userProfile.hasAllergy && userProfile.allergies.length > 0 && (
                      <div className="text-[11px] font-bold text-[#d70015] bg-[#fff1f0] border border-[#ff3b30]/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-2">
                        <span>แพ้: {userProfile.allergies[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Tab Views */}
                  <div className="flex-1 overflow-y-auto w-full">
                    {activeTab === 'medication' && (
                      <MyMedicationTab
                        drugs={activeDrugs}
                        liveScheduledDoses={scheduledDoses}
                        activeSubTab={medicationSubTab}
                        onSubTabChange={setMedicationSubTab}
                        onOpenScanner={() => setIsIOSPhotosOpen(true)}
                        onAddDrug={handleAddManualDrug}
                        onOpenAIChat={(drug) => {
                          setChatSelectedDrug(drug);
                          setActiveTab('chat');
                        }}
                        onOpenSideEffects={handleOpenSideEffects}
                        onOpenSpecialTechniqueVideo={handleOpenSpecialTechniqueVideo}
                        onRemoveDrug={handleRemoveDrug}
                        seniorMode={seniorMode}
                      />
                    )}

                    {activeTab === 'reminder' && (
                      <ReminderTab
                        schedule={scheduledDoses}
                        onToggleTaken={handleToggleTaken}
                        seniorMode={seniorMode}
                        onOpenAlarmDemo={handleTriggerMedAlarm}
                        onSurveyAnswer={handleSurveyAnswer}
                      />
                    )}

                    {activeTab === 'chat' && (
                      <AIPHarmacistTab
                        drugs={activeDrugs}
                        selectedDrug={chatSelectedDrug}
                        onSelectDrug={(drug) => setChatSelectedDrug(drug)}
                        seniorMode={seniorMode}
                      />
                    )}

                    {activeTab === 'settings' && (
                      <SettingsTab
                        userProfile={userProfile}
                        seniorMode={seniorMode}
                        setSeniorMode={setSeniorMode}
                        highContrast={highContrast}
                        setHighContrast={setHighContrast}
                        soundAlerts={soundAlerts}
                        setSoundAlerts={setSoundAlerts}
                        alarmSoundType={alarmSoundType}
                        setAlarmSoundType={setAlarmSoundType}
                        surveyLogs={surveyLogs}
                        onClearSurveyLogs={handleClearSurveyLogs}
                        onEditProfile={() => setHasCompletedOnboarding(false)}
                        onResetAll={handleResetDemo}
                        onOpenGuide={() => setIsUserGuideOpen(true)}
                      />
                    )}
                  </div>

                  {/* Bottom Navigation Bar (4-Tab Structure) */}
                  <nav aria-label="แถบนำทางหลักของแอปพลิเคชัน" className="bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e5e5ea] px-2 py-2 flex items-center justify-around shrink-0 select-none z-30">
                    <button
                      onClick={() => setActiveTab('medication')}
                      className={`flex flex-col items-center justify-center min-w-[62px] py-1 rounded-xl transition-all ${
                        activeTab === 'medication'
                          ? 'text-[#007aff] font-bold'
                          : 'text-[#8e8e93] hover:text-[#1d1d1f]'
                      }`}
                    >
                      <Pill className="w-5 h-5 mb-0.5 stroke-[2.2]" />
                      <span className="text-[11px] tracking-tight font-medium">ยาของฉัน</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('reminder')}
                      className={`flex flex-col items-center justify-center min-w-[62px] py-1 rounded-xl transition-all relative ${
                        activeTab === 'reminder'
                          ? 'text-[#007aff] font-bold'
                          : 'text-[#8e8e93] hover:text-[#1d1d1f]'
                      }`}
                    >
                      <Clock className="w-5 h-5 mb-0.5 stroke-[2.2]" />
                      <span className="text-[11px] tracking-tight font-medium">เตือนฉันที</span>
                      {scheduledDoses.some((d) => !d.taken) && (
                        <span className="absolute top-1 right-3.5 w-2 h-2 rounded-full bg-[#ff9500]"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex flex-col items-center justify-center min-w-[62px] py-1 rounded-xl transition-all relative ${
                        activeTab === 'chat'
                          ? 'text-[#007aff] font-bold'
                          : 'text-[#8e8e93] hover:text-[#1d1d1f]'
                      }`}
                    >
                      <div className="relative">
                        <MessageCircle className="w-5 h-5 mb-0.5 stroke-[2.2]" />
                        <span className="absolute -top-1 -right-2 text-[8px] font-black bg-[#007aff] text-white px-1 rounded-full">
                          AI
                        </span>
                      </div>
                      <span className="text-[11px] tracking-tight font-medium">AI เภสัชกร</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`flex flex-col items-center justify-center min-w-[62px] py-1 rounded-xl transition-all ${
                        activeTab === 'settings'
                          ? 'text-[#007aff] font-bold'
                          : 'text-[#8e8e93] hover:text-[#1d1d1f]'
                      }`}
                    >
                      <Settings className="w-5 h-5 mb-0.5 stroke-[2.2]" />
                      <span className="text-[11px] tracking-tight font-medium">ตั้งค่า</span>
                    </button>
                  </nav>
</div>
              )}

              {/* iOS Photos Picker Sheet Modal */}
              <IOSPhotosPickerModal
                isOpen={isIOSPhotosOpen}
                onClose={() => setIsIOSPhotosOpen(false)}
                onScanResult={handleScanResult}
              />

              {/* Allergy Alert Modal strictly inside phone screen */}
              <AllergyAlertModal
                isOpen={isAllergyModalOpen}
                onClose={() => setIsAllergyModalOpen(false)}
                detectedDrug={detectedAllergicDrug}
                userProfile={userProfile}
              />

              {/* Side Effects Modal with Illustration Photos strictly inside phone screen */}
              <SideEffectsModal
                isOpen={isSideEffectsOpen}
                onClose={() => setIsSideEffectsOpen(false)}
                drug={selectedSideEffectsDrug}
                seniorMode={seniorMode}
              />

              {/* Special Technique Fast-Forward Demonstration Video Modal strictly inside phone screen */}
              <SpecialTechniqueVideoModal
                isOpen={isSpecialTechniqueOpen}
                onClose={() => setIsSpecialTechniqueOpen(false)}
                drug={selectedSpecialTechniqueDrug}
                seniorMode={seniorMode}
              />
            </div>

            {/* iOS 17:30 Full-screen Medication Alarm with Slide-to-Dismiss (บังทั้งจอเหมือนนาฬิกาปลุก / สายเรียกเข้า iOS) */}
            <IOSMedAlarmModal
              isOpen={isMedAlarmOpen}
              onClose={() => setIsMedAlarmOpen(false)}
              scheduledDoses={scheduledDoses}
              activeDrugs={activeDrugs}
              seniorMode={seniorMode}
              soundType={alarmSoundType}
              onSoundTypeChange={setAlarmSoundType}
              onMarkEveningTaken={() => {
                setScheduledDoses((prev) =>
                  prev.map((dose) =>
                    dose.meal === 'evening' || dose.time.includes('18:00')
                      ? { ...dose, taken: true, takenAt: '18:00 น.' }
                      : dose
                  )
                );
              }}
            />
          </div>
        </div>
      </main>

      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />
    </div>
  );
}
