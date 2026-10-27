import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Stethoscope,
  Pill,
  Hospital,
  Phone,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from './ui/Button';

interface GeneralSymptomGeminiChatProps {
  onBack: () => void;
  seniorMode: boolean;
  onOpenContactPharmacist?: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  triageLevel?: 'emergency' | 'doctor' | 'pharmacist' | 'self_care' | 'inquiry';
  followUpQuestions?: string[];
  suggestedAnswers?: string[];
}

export const GeneralSymptomGeminiChat: React.FC<GeneralSymptomGeminiChatProps> = ({
  onBack,
  seniorMode,
  onOpenContactPharmacist,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPromptChips = [
    'ปวดหัวข้างเดียวตุบๆ คลื่นไส้',
    'มีไข้ เจ็บคอ ไอ มีน้ำมูก 2 วัน',
    'แน่นท้อง จุกเสียดใต้ลิ้นปี่ แสบร้อนอก',
    'ผื่นแดงคันขึ้นตามแขนขา ตาบวม',
    'ปวดหลัง ปวดเมื่อยกล้ามเนื้อจากการยกของ',
  ];

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
  };

  // Clinical Triage Engine
  const processTriageAnalysis = (userInput: string): Message => {
    const text = userInput.toLowerCase();
    const now = 'เมื่อสักครู่';

    // 1. EMERGENCY RED FLAGS
    const hasEmergencyKeywords =
      text.includes('แน่นหน้าอก') ||
      text.includes('เจ็บหน้าอก') ||
      text.includes('หายใจไม่ออก') ||
      text.includes('หายใจหอบ') ||
      text.includes('ปากบวม') ||
      text.includes('ตาบวม') ||
      text.includes('หน้าบวม') ||
      text.includes('เสียงหวีด') ||
      text.includes('ปากเบี้ยว') ||
      text.includes('แขนขาอ่อนแรง') ||
      text.includes('พูดไม่ชัด') ||
      text.includes('หมดสติ') ||
      text.includes('อาเจียนเป็นเลือด') ||
      text.includes('ถ่ายเป็นเลือด') ||
      text.includes('อุจจาระดำ');

    if (hasEmergencyKeywords) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        triageLevel: 'emergency',
        timestamp: now,
        text: `คำแนะนำเร่งด่วน: ควรไปพบแพทย์ที่โรงพยาบาลหรือห้องฉุกเฉินทันที\n\nจากการประเมินอาการ อาการที่คุณระบุถือเป็นสัญญาณอันตรายทางการแพทย์ (Red Flag Signs) ที่อาจเป็นอันตรายถึงชีวิต เช่น ภาวะแพ้รุนแรง (Anaphylaxis), กล้ามเนื้อหัวใจขาดเลือด หรือหลอดเลือดสมองเฉียบพลัน\n\nข้อควรปฏิบัติทันที:\n1. ไม่ควรรับประทานยาแก้ปวดหรือยาใดๆ เอง\n2. รีบเดินทางไปห้องฉุกเฉินโรงพยาบาลที่ใกล้ที่สุด หรือโทรเรียกรถพยาบาล 1669\n3. หากกำลังใช้ยาตัวใหม่อยู่ ให้หยุดยานั้นและนำซองยาติดตัวไปด้วย`,
      };
    }

    // 2. Headaches Triage
    if (text.includes('ปวดหัว') || text.includes('ปวดศีรษะ') || text.includes('ไมเกรน')) {
      if (text.includes('รุนแรงที่สุด') || text.includes('ฟ้าผ่า') || text.includes('คอแข็ง') || text.includes('ชัก')) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          triageLevel: 'emergency',
          timestamp: now,
          text: `คำแนะนำ: ควรไปพบแพทย์ที่ห้องฉุกเฉินทันที\n\nอาการปวดศีรษะรุนแรงฉับพลันร่วมกับคอแข็งหรือชัก อาจเป็นสัญญาณของภาวะเลือดออกใต้เยื่อหุ้มสมอง ควรรีบพบแพทย์โดยด่วนครับ`,
        };
      }

      if (!text.includes('วัน') && !text.includes('คลื่นไส้') && !text.includes('ข้างเดียว')) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          triageLevel: 'inquiry',
          timestamp: now,
          text: `ผมขอสอบถามอาการเพิ่มเติมเพื่อประเมินความจำเป็นในการพบแพทย์หรือเภสัชกรครับ:\n\n1. ปวดบริเวณไหนครับ? (เช่น ทั่วศีรษะ, ขมับสองข้าง, หรือข้างเดียวตุบๆ)\n2. มีอาการคลื่นไส้ ตาพร่า หรือแพ้แสงร่วมด้วยไหมครับ?\n3. ปวดมานานกี่วันแล้ว และเคยกินยาอะไรไปแล้วบ้างครับ?`,
          suggestedAnswers: [
            'ปวดข้างเดียวตุบๆ คลื่นไส้',
            'ปวดตึงขมับสองข้าง ท้ายทอย',
            'ปวดมา 1 วัน ยังไม่ได้กินยา',
          ],
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        triageLevel: 'pharmacist',
        timestamp: now,
        text: `การประเมิน: สามารถปรึกษาเภสัชกรที่ร้านยาได้ครับ\n\nลักษณะอาการเข้าได้กับ โรคปวดศีรษะไมเกรน (Migraine) หรือ ปวดศีรษะจากความตึงเครียด (Tension-type Headache) ในระยะแรก\n\nแนวทางการดูแล:\n• พบเภสัชกรที่ร้านยา: เภสัชกรสามารถซักประวัติและจ่ายยาบรรเทาอาการ เช่น Paracetamol หรือยากลุ่ม NSAIDs ได้อย่างปลอดภัย\n• การดูแลตัวเอง: นอนพักในห้องมืดและเงียบ ประคบเย็นบริเวณหน้าผากหรือท้ายทอย ดื่มน้ำสะอาดให้เพียงพอ\n\n*หากทานยาแล้วไม่ดีขึ้นภายใน 48 ชั่วโมง แนะนำให้ไปพบแพทย์ที่โรงพยาบาลครับ*`,
      };
    }

    // 3. Fever / Cough / Sore Throat
    if (text.includes('ไข้') || text.includes('เจ็บคอ') || text.includes('ไอ') || text.includes('หวัด') || text.includes('น้ำมูก')) {
      if (text.includes('สัปดาห์') || text.includes('เดือน') || text.includes('ไอเป็นเลือด') || text.includes('หอบ')) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          triageLevel: 'doctor',
          timestamp: now,
          text: `คำแนะนำ: ควรไปพบแพทย์ที่คลินิกหรือโรงพยาบาล\n\nอาการไอเรื้อรังนานเกิน 2 สัปดาห์ หรือไอมีเลือดปน มีอาการหอบเหนื่อย ควรได้รับการตรวจฟังปอดและเอกซเรย์ทรวงอกโดยแพทย์เพื่อหาสาเหตุที่แท้จริงครับ`,
        };
      }

      if (!text.includes('วัน') && !text.includes('เสมหะ') && !text.includes('สูง')) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          triageLevel: 'inquiry',
          timestamp: now,
          text: `ขอซักประวัติเพิ่มเติมเพื่อประเมินระดับอาการครับ:\n\n1. มีไข้สูงหรือไข้ต่ำๆ ครับ?\n2. มีเสมหะสีอะไร (ขาวใส หรือเขียวเหลืองข้น)?\n3. เป็นมานานกี่วันแล้วครับ?`,
          suggestedAnswers: [
            'เป็นมา 1-2 วัน ไข้ต่ำๆ',
            'ไข้สูง หนาวสั่น เจ็บคอมาก',
            'ไอแห้งๆ ไม่มีเสมหะ',
          ],
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        triageLevel: 'pharmacist',
        timestamp: now,
        text: `การประเมิน: สามารถปรึกษาเภสัชกรที่ร้านยาได้ครับ\n\nอาการเบื้องต้นเป็น ไข้หวัดหรือคออักเสบจากการติดเชื้อไวรัส (URI) ในระยะ 1-3 วันแรก ซึ่งส่วนใหญ่หายได้เองโดยไม่ต้องใช้ยาปฏิชีวนะ\n\nแนวทางการดูแล:\n• พบเภสัชกรที่ร้านยา: เภสัชกรจะประเมินและจัดยาตามอาการ เช่น ยาลดไข้พาราเซตามอล ยาลดน้ำมูก หรือยาละลายเสมหะ\n• การดูแลตัวเอง: จิบนมอุ่นหรือน้ำอุ่นมากๆ พักผ่อนให้เต็มที่ กลั้วคอด้วยน้ำเกลืออุ่น\n\n*หากไข้สูงเกิน 38.5°C นานเกิน 3 วัน ควรไปพบแพทย์ครับ*`,
      };
    }

    // 4. Stomach Ache
    if (text.includes('ปวดท้อง') || text.includes('แสบท้อง') || text.includes('กรดไหลย้อน') || text.includes('ลิ้นปี่')) {
      if (text.includes('ท้องแข็ง') || text.includes('ถ่ายดำ') || text.includes('รุนแรง')) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          triageLevel: 'emergency',
          timestamp: now,
          text: `คำแนะนำเร่งด่วน: ควรไปพบแพทย์ที่โรงพยาบาลทันที\n\nอาการปวดท้องรุนแรง ท้องแข็งเกร็ง หรือมีอาการถ่ายดำ อาจบ่งบอกถึงภาวะแผลในกระเพาะทะลุ หรือเลือดออกในทางเดินอาหาร ควรรีบไปห้องฉุกเฉินครับ`,
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        triageLevel: 'pharmacist',
        timestamp: now,
        text: `การประเมิน: สามารถปรึกษาเภสัชกรที่ร้านยาได้ครับ\n\nอาการจุกแน่นใต้ลิ้นปี่ แสบร้อนอก สัมพันธ์กับมื้ออาหาร เข้าได้กับ โรคกระเพาะอาหารหรือกรดไหลย้อนระยะเริ่มต้น\n\nแนวทางการดูแล:\n• พบเภสัชกรที่ร้านยา: เภสัชกรสามารถแนะนำยาลดกรดหรือยายับยั้งการหลั่งกรด พร้อมตรวจสอบประวัติยาที่คุณทานอยู่ว่ามียาที่ระคายเคืองกระเพาะหรือไม่\n• การดูแลตัวเอง: รับประทานอาหารให้ตรงเวลา หลีกเลี่ยงอาหารรสจัด ชา กาแฟ และไม่ควรนอนทันทีหลังรับประทานอาหาร`,
      };
    }

    // 5. Skin rash / Allergy
    if (text.includes('ผื่น') || text.includes('คัน') || text.includes('ตุ่ม')) {
      if (text.includes('ยา') || text.includes('เพิ่งกิน') || text.includes('บวม')) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          triageLevel: 'emergency',
          timestamp: now,
          text: `คำแนะนำ: ควรไปพบแพทย์ที่โรงพยาบาลทันที และหยุดยาทุกตัวที่เพิ่งเริ่มทาน\n\nหากมีผื่นขึ้นหลังรับประทานยาตัวใหม่ หรือมีอาการหน้าบวม ปากบวมร่วมด้วย อาจเกิดจาก การแพ้ยา (Drug Allergy) ห้ามทานยาซ้ำเด็ดขาดและรีบนำซองยาไปพบแพทย์ครับ`,
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        triageLevel: 'pharmacist',
        timestamp: now,
        text: `การประเมิน: สามารถปรึกษาเภสัชกรที่ร้านยาได้ครับ\n\nผื่นคันจากลมพิษทั่วไป ผื่นสัมผัส หรือแมลงสัตว์กัดต่อย สามารถปรึกษาเภสัชกรที่ร้านยาเพื่อรับยาแก้แพ้กลุ่มต้านฮิสตามีน หรือยาทาบรรเทาอาการคันได้ครับ`,
      };
    }

    // Default
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      triageLevel: 'inquiry',
      timestamp: now,
      text: `ผมได้รับข้อมูลอาการเบื้องต้นแล้วครับ เพื่อการประเมินที่แม่นยำยิ่งขึ้น ขอสอบถามเพิ่มเติม:\n\n1. อาการนี้เพิ่งเริ่มเป็น หรือเป็นมานานกี่วันแล้วครับ?\n2. มีอาการอื่นร่วมด้วยไหม เช่น มีไข้ คลื่นไส้ หรืออ่อนเพลีย?\n3. ปัจจุบันมีโรคประจำตัวหรือกำลังทานยาประจำตัวอะไรอยู่ไหมครับ?`,
      suggestedAnswers: [
        'เพิ่งเริ่มเป็นวันนี้ อาการไม่รุนแรง',
        'เป็นมา 2-3 วันแล้ว ยังไม่ดีขึ้น',
        'มีโรคประจำตัวความดัน/เบาหวาน',
      ],
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'เมื่อสักครู่',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processTriageAnalysis(textToSend);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const lastAiMessageIndex = messages.map((m) => m.sender).lastIndexOf('ai');

  return (
    <div className={`flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden ${seniorMode ? 'senior-mode-active' : ''}`}>
      {/* 4.1 & 4.2 Slim Top Bar: Back button, Online status & Contact Real Pharmacist underneath */}
      <div className="bg-white border-b border-[#e5e7eb] px-3.5 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 rounded-xl text-[#0066cc] hover:bg-[#e8f1fa] transition-colors flex items-center gap-1 font-semibold text-xs cursor-pointer"
            title="กลับไปหน้าเลือกหัวข้อ"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>กลับ</span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="p-1 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f1f5f9] transition-colors flex items-center text-xs cursor-pointer ml-1"
              title="เริ่มใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: AI Online Status & Contact Real Pharmacist Underneath */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] bg-[#dcfce7] text-[#16a34a] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
            <span>ระบบ AI ออนไลน์</span>
          </span>

          {onOpenContactPharmacist && (
            <button
              type="button"
              onClick={onOpenContactPharmacist}
              className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="ติดต่อเภสัชกรตัวจริง"
            >
              <Phone className="w-3 h-3" />
              <span>ติดต่อเภสัชกรตัวจริง</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {messages.length === 0 ? (
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="max-w-md mx-auto w-full pt-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0066cc] bg-[#e8f1fa] w-fit px-3 py-1 rounded-full border border-[#b8d5f2]">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>ผู้ช่วยคัดกรองอาการเบื้องต้น</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111827]">
                คุณมีความกังวลเรื่องอะไร
              </h1>
              <p className={`text-[#4b5563] leading-relaxed pt-1 ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                พิมพ์เล่าอาการที่คุณกำลังรู้สึก AI จะช่วยซักประวัติและประเมินว่า{' '}
                <strong className="text-[#111827]">ควรไปพบแพทย์</strong> หรือ{' '}
                <strong className="text-[#0066cc]">สามารถปรึกษาเภสัชกรที่ร้านยาได้</strong>
              </p>
            </div>

            {/* Prompt Chips Suggestions */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b7280] block">
                ตัวอย่างอาการที่พบบ่อย (แตะเพื่อเริ่มถาม):
              </span>
              <div className="space-y-2">
                {quickPromptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="w-full text-left bg-white hover:bg-[#e8f1fa] active:scale-[0.99] border border-[#e5e7eb] hover:border-[#b8d5f2] rounded-2xl p-3 text-xs sm:text-sm font-medium text-[#1f2937] shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{chip}</span>
                    <span className="text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                      ถาม
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom input on empty landing */}
          <div className="max-w-md mx-auto w-full pt-4 pb-2 space-y-2">
            <p className="text-[11px] text-[#9ca3af] text-center select-none leading-tight">
              *ข้อควรทราบ: AI คัดกรองอาการเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยของแพทย์ หากมีอาการรุนแรงโปรดพบแพทย์ทันที
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="เล่าอาการของคุณที่นี่ เช่น มีไข้ ปวดท้อง แน่นหน้าอก..."
                className="w-full bg-white border border-[#d1d5db] focus:border-[#0066cc] rounded-2xl pl-4 pr-12 py-3 text-xs sm:text-sm text-[#111827] shadow-sm focus:outline-hidden transition-all placeholder:text-[#9ca3af]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 p-2 bg-[#0066cc] hover:bg-[#0052a3] disabled:opacity-40 text-white rounded-xl transition-all shadow-xs cursor-pointer"
                title="ส่งข้อความ"
                aria-label="ส่งข้อความ"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Conversation Mode */
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Chat Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8fafc]">
            {messages.map((msg, mIdx) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line text-xs sm:text-sm shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0066cc] text-white rounded-br-xs font-medium'
                      : 'bg-white text-[#111827] border border-[#e5e7eb] rounded-bl-xs'
                  } ${seniorMode ? 'text-base sm:text-lg' : ''}`}
                >
                  {/* Badge Header for AI Triage Results */}
                  {msg.triageLevel && (
                    <div className="mb-2 pb-2 border-b border-[#f1f5f9]">
                      {msg.triageLevel === 'emergency' && (
                        <div className="inline-flex items-center gap-1.5 bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-2.5 py-1 rounded-lg text-xs font-bold">
                          <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                          <span>พบสัญญาณอันตราย • ควรไปโรงพยาบาลทันที</span>
                        </div>
                      )}
                      {msg.triageLevel === 'doctor' && (
                        <div className="inline-flex items-center gap-1.5 bg-[#fef3c7] text-[#b45309] border border-[#fde68a] px-2.5 py-1 rounded-lg text-xs font-bold">
                          <Hospital className="w-4 h-4 text-[#d97706]" />
                          <span>ควรพบแพทย์เพื่อตรวจวินิจฉัย (คลินิก/รพ.)</span>
                        </div>
                      )}
                      {msg.triageLevel === 'pharmacist' && (
                        <div className="inline-flex items-center gap-1.5 bg-[#dcfce7] text-[#16a34a] border border-[#86efac] px-2.5 py-1 rounded-lg text-xs font-bold">
                          <Pill className="w-4 h-4 text-[#16a34a]" />
                          <span>อาการระดับทั่วไป • สามารถปรึกษาเภสัชกรที่ร้านยาได้</span>
                        </div>
                      )}
                      {msg.triageLevel === 'inquiry' && (
                        <div className="inline-flex items-center gap-1.5 bg-[#e8f1fa] text-[#0066cc] border border-[#b8d5f2] px-2.5 py-1 rounded-lg text-xs font-bold">
                          <Stethoscope className="w-4 h-4 text-[#0066cc]" />
                          <span>AI กำลังซักประวัติเพื่อคัดกรองอาการ</span>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.text}

                  {/* Quick Clickable Follow-up Answers */}
                  {msg.suggestedAnswers && msg.suggestedAnswers.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] space-y-1.5">
                      <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider block">
                        เลือกตอบเพื่อวินิจฉัยต่อ:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {msg.suggestedAnswers.map((ans, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleSendMessage(ans)}
                            className="text-left text-xs bg-[#f8fafc] hover:bg-[#e8f1fa] border border-[#e5e7eb] hover:border-[#b8d5f2] text-[#0066cc] font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#9ca3af] mt-1 px-1">{msg.timestamp}</span>

                {/* 4.4 Disclaimer directly underneath the latest AI message */}
                {mIdx === lastAiMessageIndex && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] flex items-start gap-2 shadow-2xs animate-in fade-in duration-200 max-w-[92%]">
                    <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong>ข้อควรทราบ:</strong> AI คัดกรองอาการเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยของแพทย์ หากมีอาการรุนแรงโปรดพบแพทย์ทันที
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
                <span className="text-xs text-[#374151] font-medium">AI กำลังวิเคราะห์อาการและตรวจคัดกรอง...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#e5e7eb] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์ตอบอาการเพิ่มเติม..."
                className="flex-1 bg-[#f8fafc] border border-[#d1d5db] focus:border-[#0066cc] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-hidden transition-all placeholder:text-[#9ca3af]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-[#0066cc] hover:bg-[#0052a3] disabled:opacity-40 text-white p-2.5 rounded-2xl transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer"
                title="ส่งข้อความ"
                aria-label="ส่งข้อความ"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
