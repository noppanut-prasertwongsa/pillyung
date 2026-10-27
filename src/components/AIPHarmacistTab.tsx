import React, { useState, useRef, useEffect } from 'react';
import { Drug, ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  BookOpen,
  Pill,
  RotateCcw,
  ArrowLeft,
  Stethoscope,
  ChevronRight,
  AlertTriangle,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { GeneralSymptomGeminiChat } from './GeneralSymptomGeminiChat';
import { ContactRealPharmacistModal } from './ContactRealPharmacistModal';
import { Button } from './ui/Button';

interface AIPHarmacistTabProps {
  drugs: Drug[];
  selectedDrug: Drug | null;
  onSelectDrug: (drug: Drug | null) => void;
  seniorMode: boolean;
}

export const AIPHarmacistTab: React.FC<AIPHarmacistTabProps> = ({
  drugs,
  selectedDrug,
  onSelectDrug,
  seniorMode,
}) => {
  // Navigation Mode inside AI Pharmacist:
  // 'hub': Selection Landing Screen (Icon in middle-top, 'ต้องการปรึกษาเรื่องอะไร?', 2 rectangular boxes)
  // 'drug_consult': Option 1 (Original Drug-specific chat interface with full features)
  // 'general_symptoms': Option 2 (Gemini-style General Symptom triage chat)
  const [activeMode, setActiveMode] = useState<'hub' | 'drug_consult' | 'general_symptoms'>('hub');

  // Contact Real Pharmacist Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Drug-specific consultation state (Option 1)
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createInitialMessage = (drug: Drug | null): ChatMessage => ({
    id: `welcome-${Date.now()}`,
    sender: 'ai',
    text: drug
      ? `สวัสดีครับ ผมคือผู้ช่วย AI ด้านยา\nกำลังให้ข้อมูลยา: **${drug.tradeName} (${drug.strength})**\n\nคำแนะนำสำคัญ: ${
          drug.pharmacistAdvice || drug.instructions
        }\n\nมีข้อสงสัยเรื่องวิธีทานยา อาหารที่ห้ามทานคู่กัน หรือผลข้างเคียง สามารถสอบถามได้เลยครับ`
      : `สวัสดีครับ ผมคือผู้ช่วย AI ด้านยาประจำแอป pillyung\nสามารถเลือกรายการยาด้านบนเพื่อสอบถาม หรือพิมพ์ข้อสงสัยเรื่องการใช้ยา อาหาร/นมที่ห้ามทานคู่กับยาได้ตลอดเวลาครับ`,
    timestamp: 'เมื่อสักครู่',
    sourceRef: drug?.referenceSource || 'ฐานข้อมูลยามาตรฐาน (Lexidrug, MIMS Thailand)',
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => [createInitialMessage(selectedDrug)]);
  const lastDrugIdRef = useRef<string | undefined>(selectedDrug?.id);

  useEffect(() => {
    if (selectedDrug?.id !== lastDrugIdRef.current) {
      lastDrugIdRef.current = selectedDrug?.id;
      if (selectedDrug) {
        setMessages((prev) => [
          ...prev,
          {
            id: `switch-${selectedDrug.id}-${Date.now()}`,
            sender: 'ai',
            text: `สลับมายังยา **${selectedDrug.tradeName} (${selectedDrug.strength})**\n${
              selectedDrug.pharmacistAdvice ? selectedDrug.pharmacistAdvice : selectedDrug.instructions
            }`,
            timestamp: 'เมื่อสักครู่',
            sourceRef: selectedDrug.referenceSource,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `switch-general-${Date.now()}`,
            sender: 'ai',
            text: 'สลับสู่โหมด: ข้อสงสัยยาทั่วไปและอันตรกิริยาระหว่างยา',
            timestamp: 'เมื่อสักครู่',
          },
        ]);
      }
    }
  }, [selectedDrug?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'ยา Ciprofloxacin ทานพร้อมนมได้ไหม?',
    'ถ้าลืมทานยา ควรทานเบิ้ล 2 เม็ดไหม?',
    'ยานี้บดหรือเคี้ยวได้ไหม กลืนยาก?',
    'ทานยานี้แล้วมีผลข้างเคียงอะไรที่ต้องระวัง?',
  ];

  const handleClearChat = () => {
    setMessages([createInitialMessage(selectedDrug)]);
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'เมื่อสักครู่',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      // Specific query for Ciprofloxacin and Milk
      if (
        lower.includes('cipro') ||
        lower.includes('นม') ||
        lower.includes('แคลเซียม') ||
        lower.includes('โยเกิร์ต')
      ) {
        reply = `ข้อห้ามสำคัญทางเภสัชกรรม (Drug-Food Interaction):\n\nยา Ciprofloxacin (หรือยาปฏิชีวนะกลุ่ม Fluoroquinolones) "ห้ามรับประทานพร้อมนม โยเกิร์ต ชีส ยาลดกรด หรือแคลเซียม/ธาตุเหล็ก" อย่างเด็ดขาด!\n\nสาเหตุ: แคลเซียมจะจับกับตัวยาทำให้ร่างกายไม่ดูดซึมยา เชื้ออาจไม่หายและดื้อยา\n\nวิธีปฏิบัติที่ถูกต้อง: หากจำเป็นต้องดื่มนม ให้ทานยาก่อนดื่มนม 2 ชั่วโมง หรือดื่มนมหลังทานยาไปแล้วอย่างน้อย 4 ชั่วโมง และควรดื่มน้ำสะอาดตามมากๆ ครับ`;
      } else if (
        lower.includes('คลื่นไส้') ||
        lower.includes('แน่นท้อง') ||
        lower.includes('ท้องเสีย') ||
        lower.includes('ผลข้างเคียง')
      ) {
        if (selectedDrug) {
          reply = `ข้อมูลผลข้างเคียงของยา ${selectedDrug.tradeName} (${selectedDrug.genericName}):\n\n${selectedDrug.commonSideEffects}\n\nคำแนะนำ: ${
            selectedDrug.pharmacistAdvice || 'แนะนำให้รับประทานยาตามเวลาที่กำหนด หากมีผื่นลมพิษหรือปากบวมให้หยุดยาทันที'
          }`;
        } else {
          reply = `ผลข้างเคียงของยาส่วนใหญ่มักเกี่ยวกับระบบทางเดินอาหาร เช่น แน่นท้อง คลื่นไส้ หากทาน Metformin ควรทานพร้อมอาหารคำแรก\n\nสัญญาณอันตราย: หากมีผื่นลมพิษ เปลือกตาบวม ริมฝีปากบวม หรือแน่นหน้าอก ให้หยุดยาทันทีและรีบไปโรงพยาบาลครับ`;
        }
      } else if (lower.includes('บด') || lower.includes('เคี้ยว') || lower.includes('กลืนยาก')) {
        if (selectedDrug) {
          if (!selectedDrug.canCrush) {
            reply = `ข้อห้ามสำคัญ: ยา ${selectedDrug.tradeName} ${selectedDrug.warnings}\n\nการบดหรือเคี้ยวจะทำลายระบบเคลือบตัวยา ทำให้ยาดูดซึมเร็วเกินไปและระคายเคืองกระเพาะอาหาร หากกลืนยาก แนะนำให้ปรึกษาแพทย์เพื่อปรับรูปแบบยาครับ`;
          } else {
            reply = `ยา ${selectedDrug.tradeName} (${selectedDrug.genericName}) สามารถแบ่งหรือบดเม็ดยาได้หากมีปัญหาการกลืนลำบาก ดื่มน้ำตามให้เพียงพอครับ`;
          }
        } else {
          reply = `ยาเคลือบฟิล์ม ยาออกฤทธิ์เนิ่น (XR/ER) หรือแคปซูล เช่น Glucophage หรือ Losec "ห้ามบดหรือเคี้ยวเด็ดขาด" เพราะจะทำลายสารเคลือบยาครับ`;
        }
      } else if (lower.includes('ลืม') || lower.includes('เบิ้ล')) {
        reply = `เมื่อลืมทานยา:\n\n1. หากนึกได้ทันที: ให้รับประทานยามื้อที่ลืมทันที\n2. หากใกล้ถึงเวลามื้อถัดไป: ให้ข้ามมื้อที่ลืมไป แล้วรับประทานมื้อถัดไปในขนาดยาปกติ\n\n"ห้ามเพิ่มขนาดยาเป็น 2 เท่า (ห้ามเบิ้ลยา)" อย่างเด็ดขาด`;
      } else {
        reply = selectedDrug
          ? `จากการตรวจสอบฐานข้อมูลยามาตรฐาน:\n\nยา: ${selectedDrug.tradeName} (${selectedDrug.genericName} ${selectedDrug.strength})\nวิธีใช้: ${selectedDrug.instructions}\nคำแนะนำเภสัชกร: ${selectedDrug.pharmacistAdvice || selectedDrug.warnings}`
          : `คุณสามารถสอบถามเรื่องวิธีใช้ยา ข้อห้ามทานคู่กับอาหาร หรือเครื่องดื่ม เช่น นม ยาลดกรด น้ำเกรปฟรุต แอลกอฮอล์ ได้ตลอดเวลาครับ`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: 'เมื่อสักครู่',
          sourceRef: 'ฐานข้อมูลยามาตรฐาน (Lexidrug, MIMS Thailand, US FDA)',
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  // -------------------------------------------------------------
  // VIEW 1: Selection Hub
  // -------------------------------------------------------------
  if (activeMode === 'hub') {
    return (
      <div className={`flex-1 flex flex-col h-full bg-[#ffffff] overflow-y-auto ${seniorMode ? 'senior-mode-active' : ''}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-6">
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            {/* Centered AI Pharmacist Icon */}
            <div className="relative mb-4 flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-blue-500/15 blur-xl pointer-events-none" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0066cc] via-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white shadow-xl shadow-blue-500/25 border-2 border-white">
                <Sparkles className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>

            {/* Heading Text */}
            <h1
              className={`font-black text-[#111827] tracking-tight mb-1.5 ${
                seniorMode ? 'text-3xl' : 'text-2xl sm:text-3xl'
              }`}
            >
              ต้องการปรึกษาเรื่องอะไร
            </h1>
            <p
              className={`text-[#6b7280] leading-relaxed mb-5 max-w-xs ${
                seniorMode ? 'text-base' : 'text-xs sm:text-sm'
              }`}
            >
              เลือกบริการที่ต้องการขอคำแนะนำจากผู้ช่วย AI ด้านยา
            </p>

            {/* Two Option Boxes */}
            <div className="w-full space-y-3">
              {/* Option 1: ปรึกษาอาการเกี่ยวกับยา */}
              <button
                type="button"
                onClick={() => setActiveMode('drug_consult')}
                className="w-full bg-[#f8fafc] hover:bg-[#f0f7ff] active:scale-[0.98] border-2 border-[#e5e7eb] hover:border-[#0066cc] rounded-3xl p-4 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#e8f1fa] text-[#0066cc] flex items-center justify-center shrink-0 border border-[#b8d5f2] group-hover:bg-[#0066cc] group-hover:text-white transition-colors shadow-2xs">
                  <Pill className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2
                      className={`font-bold text-[#111827] group-hover:text-[#0066cc] transition-colors ${
                        seniorMode ? 'text-xl' : 'text-base'
                      }`}
                    >
                      ปรึกษาอาการเกี่ยวกับยา
                    </h2>
                    <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className={`text-[#4b5563] leading-relaxed ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                    สอบถามวิธีทานยา ผลข้างเคียง ยาตีกับอาหาร/นม หรือข้อห้ามบดยาตามตำรับมาตรฐาน
                  </p>
                </div>
              </button>

              {/* Option 2: ปรึกษาอาการทั่วไป */}
              <button
                type="button"
                onClick={() => setActiveMode('general_symptoms')}
                className="w-full bg-[#f8fafc] hover:bg-[#faf5ff] active:scale-[0.98] border-2 border-[#e5e7eb] hover:border-[#7c3aed] rounded-3xl p-4 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f3e8ff] text-[#7c3aed] flex items-center justify-center shrink-0 border border-[#ddd6fe] group-hover:bg-[#7c3aed] group-hover:text-white transition-colors shadow-2xs">
                  <Stethoscope className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2
                      className={`font-bold text-[#111827] group-hover:text-[#7c3aed] transition-colors ${
                        seniorMode ? 'text-xl' : 'text-base'
                      }`}
                    >
                      ปรึกษาอาการทั่วไป
                    </h2>
                    <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#7c3aed] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className={`text-[#4b5563] leading-relaxed ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                    ประเมินอาการผิดปกติเบื้องต้น AI ช่วยซักประวัติและวินิจฉัยว่าควรไปพบแพทย์หรือพบเภสัชกร
                  </p>
                </div>
              </button>
            </div>

            {/* Distinct Separated Contact Real Pharmacist Card */}
            <div className="w-full mt-4 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] border-2 border-[#16a34a]/30 hover:border-[#16a34a] rounded-3xl p-4 shadow-xs flex items-center justify-between gap-3 text-left transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <span className={`font-black text-[#111827] leading-snug block ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                    ติดต่อเภสัชกรตัวจริง
                  </span>
                  <span className="text-[11px] text-[#4b5563] block truncate">
                    ปรึกษาเภสัชกรวิชาชีพผ่านสายตรงหรือวิดีโอคอล
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทรปรึกษา</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real Pharmacist Contact Modal */}
        <ContactRealPharmacistModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          seniorMode={seniorMode}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: General Symptom Triage Chat
  // -------------------------------------------------------------
  if (activeMode === 'general_symptoms') {
    return (
      <GeneralSymptomGeminiChat
        onBack={() => setActiveMode('hub')}
        seniorMode={seniorMode}
        onOpenContactPharmacist={() => setIsContactModalOpen(true)}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: Drug Consultation Screen
  // -------------------------------------------------------------
  const lastAiMessageIndex = messages.map((m) => m.sender).lastIndexOf('ai');

  return (
    <div className={`flex-1 flex flex-col h-full bg-[#f8fafc] ${seniorMode ? 'senior-mode-active' : ''}`}>
      {/* 4.1 & 4.2 Slim Top Bar: Back button, Online status & Contact Real Pharmacist underneath */}
      <div className="bg-white border-b border-[#e5e7eb] px-3.5 py-2 shrink-0 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Back button & Restart */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMode('hub')}
              className="p-1 -ml-1 rounded-xl text-[#0066cc] hover:bg-[#e8f1fa] transition-colors flex items-center gap-1 font-semibold text-xs cursor-pointer"
              title="กลับไปหน้าเลือกหัวข้อ"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>กลับหน้าหลัก</span>
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className="p-1 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f1f5f9] transition-colors flex items-center text-xs cursor-pointer ml-1"
              title="ล้างบทสนทนาและเริ่มใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: AI Online Badge & Contact Pharmacist Button Underneath */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] bg-[#dcfce7] text-[#16a34a] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
              <span>ระบบ AI ออนไลน์</span>
            </span>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-2.5 py-1 rounded-lg font-bold text-[11px] shadow-2xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="ติดต่อเภสัชกรตัวจริง"
            >
              <Phone className="w-3 h-3" />
              <span>ติดต่อเภสัชกรตัวจริง</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4.3 Single Line Quick Bar: Drug Context & Quick Questions in ONE line */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-3 bg-[#f8fafc] border-b border-[#e5e7eb] no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => onSelectDrug(null)}
          className={`text-xs px-2.5 py-1 rounded-xl border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            selectedDrug === null
              ? 'bg-[#0066cc] text-white border-[#0066cc] font-bold shadow-2xs'
              : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:bg-[#f1f5f9]'
          }`}
        >
          ข้อสงสัยทั่วไป
        </button>
        {drugs.map((drug) => (
          <button
            key={drug.id}
            type="button"
            onClick={() => onSelectDrug(drug)}
            className={`text-xs px-2.5 py-1 rounded-xl border transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
              selectedDrug?.id === drug.id
                ? 'bg-[#0066cc] text-white border-[#0066cc] font-bold shadow-2xs'
                : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:bg-[#f1f5f9]'
            }`}
          >
            <Pill className="w-3 h-3 shrink-0" />
            <span>{drug.tradeName} ({drug.strength})</span>
          </button>
        ))}

        <div className="h-4 w-px bg-[#cbd5e1] shrink-0 mx-0.5" />

        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isTyping}
            className="text-xs bg-white hover:bg-[#e8f1fa] text-[#1f2937] hover:text-[#0066cc] border border-[#d1d5db] hover:border-[#b8d5f2] px-2.5 py-1 rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
          >
            <HelpCircle className="w-3 h-3 text-[#0066cc] shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8fafc]">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
                seniorMode ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
              } ${
                msg.sender === 'user'
                  ? 'bg-[#0066cc] text-white rounded-br-xs shadow-xs font-medium'
                  : 'bg-white text-[#111827] border border-[#e5e7eb] rounded-bl-xs shadow-2xs'
              }`}
            >
              {msg.text}

              {msg.sourceRef && (
                <div className="mt-2 pt-1.5 border-t border-[#f1f5f9] text-[10px] text-[#6b7280] flex items-center gap-1 font-normal">
                  <BookOpen className="w-3 h-3 text-[#0066cc] shrink-0" />
                  <span className="truncate">อ้างอิง: {msg.sourceRef}</span>
                </div>
              )}
            </div>

            <span className="text-[10px] text-[#6b7280] mt-0.5 px-1">{msg.timestamp}</span>

            {/* 4.4 ข้อควรทราบ ย้ายมาอยู่ใต้ข้อความสุดท้ายของ AI โดยตรง */}
            {index === lastAiMessageIndex && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] flex items-start gap-2 shadow-2xs animate-in fade-in duration-200 max-w-[92%]">
                <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>ข้อควรทราบ:</strong> คุณกำลังสนทนากับผู้ช่วย AI ด้านยา ไม่ใช่เภสัชกรตัวจริง โปรดตรวจสอบข้อมูลสำคัญกับเภสัชกรก่อนใช้ยา
                </span>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#6b7280] bg-white border border-[#e5e7eb] rounded-2xl px-3.5 py-2 w-fit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse delay-75"></span>
            <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse delay-150"></span>
            <span className="text-xs text-[#374151] font-medium">AI กำลังค้นตำรับยาและตรวจอันตรกิริยา...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar (No clutter, disclaimer moved under AI response) */}
      <div className="p-3 bg-white border-t border-[#e5e7eb] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์คำถาม เช่น Ciprofloxacin กินกับนมได้ไหม..."
            className="flex-1 bg-[#f8fafc] border border-[#d1d5db] focus:border-[#0066cc] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-hidden transition-all placeholder:text-[#9ca3af]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#0066cc] hover:bg-[#0052a3] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer"
            title="ส่งคำถาม"
            aria-label="ส่งคำถาม"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Real Pharmacist Contact Modal */}
      <ContactRealPharmacistModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        seniorMode={seniorMode}
      />
    </div>
  );
};
