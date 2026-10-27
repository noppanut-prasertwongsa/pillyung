import React, { useState, useRef, useEffect } from 'react';
import { Drug, ChatMessage } from '../types';
import { Send, X, Sparkles, BookOpen, AlertTriangle, Phone, HelpCircle } from 'lucide-react';
import { ContactRealPharmacistModal } from './ContactRealPharmacistModal';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: Drug | null;
  seniorMode?: boolean;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, drug, seniorMode = false }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update greeting when selected drug changes
  useEffect(() => {
    if (drug) {
      setMessages([
        {
          id: `init-${drug.id}`,
          sender: 'ai',
          text: `สวัสดีครับ ผมเป็นผู้ช่วย AI ด้านยาประจำแอป pillyung อ้างอิงข้อมูลทางการแพทย์จากฐานข้อมูลยามาตรฐาน (Lexidrug, MIMS Thailand)\n\nท่านมีข้อสงสัยหรืออาการผิดปกติใดเกี่ยวกับยา ${drug.tradeName} (${drug.genericName}) หรือไม่ครับ`,
          timestamp: 'เมื่อสักครู่',
          sourceRef: 'ฐานข้อมูลยามาตรฐาน (Lexidrug, MIMS Thailand)',
        },
      ]);
    }
  }, [drug?.id]);

  // Auto-scroll chat stream to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !drug) return null;

  const quickPrompts = [
    'ทานยานี้แล้วมีผลข้างเคียงอะไรบ้าง?',
    'ยานี้บดหรือเคี้ยวได้ไหม กลืนยาก?',
    'ถ้าลืมทานยา ควรทานเบิ้ล 2 เม็ดไหม?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

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

      if (text.includes('คลื่นไส้') || text.includes('แน่นท้อง') || text.includes('ถ่ายเหลว') || text.includes('ผลข้างเคียง') || text.includes('อาการข้างเคียง')) {
        reply = `เกี่ยวกับยา ${drug.tradeName} (${drug.genericName}):\n\n${drug.commonSideEffects}\n\nคำแนะนำจากเภสัชกร: แนะนำให้รับประทานยาพร้อมอาหารหรือหลังอาหารทันที จะช่วยลดอาการระคายเคืองกระเพาะอาหารได้ดีมาก หากมีผื่นลมพิษหรือปากบวม ให้หยุดยาทันทีและรีบพบแพทย์ครับ`;
      } else if (text.includes('บด') || text.includes('เคี้ยว') || text.includes('กลืนยาก')) {
        if (!drug.canCrush) {
          reply = `ข้อห้ามสำคัญ: ยา ${drug.tradeName} ${drug.warnings}\n\nการบดหรือเคี้ยวเม็ดยาจะทำให้สารเคลือบตัวยาหรือเม็ดออกฤทธิ์เนิ่น (Extended Release) ถูกทำลาย ส่งผลให้ยาดูดซึมเร็วเกินไปและระคายเคืองกระเพาะอาหาร หากกลืนยาก แนะนำให้ปรึกษาแพทย์เพื่อพิจารณาเปลี่ยนรูปแบบยาครับ`;
        } else {
          reply = `ยา ${drug.tradeName} สามารถแบ่งครึ่งหรือบดยาได้ แต่แนะนำให้รับประทานพร้อมน้ำสะอาดปริมาณพอเหมาะเพื่อความปลอดภัยครับ`;
        }
      } else if (text.includes('ลืม') || text.includes('เบิ้ล')) {
        reply = `คำแนะนำเมื่อลืมทานยา:\n\nหากนึกได้ใกล้เคียงเวลาเดิม ให้รับประทานทันที แต่หากใกล้ถึงมื้อถัดไปแล้ว ให้ข้ามมื้อที่ลืมไป แล้วรับประทานมื้อต่อไปตามปกติในขนาดยาเดิม\n\n"ห้ามเพิ่มขนาดยาเป็น 2 เท่า (ห้ามเบิ้ลยา)" อย่างเด็ดขาด เพราะอาจก่อให้เกิดอันตรายจากระดับยาในเลือดที่สูงเกินไปครับ`;
      } else {
        reply = `จากการตรวจสอบฐานข้อมูลยามาตรฐาน (Lexidrug, MIMS Thailand):\n\nยา ${drug.tradeName} (${drug.genericName})\nวิธีใช้: ${drug.instructions}\n\nข้อควรระวัง: ${drug.warnings}\n\nหากท่านมีอาการผิดปกติรุนแรง แน่นหน้าอก หรือมีผื่นคัน ควรรีบไปพบแพทย์ทันทีครับ`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: 'เมื่อสักครู่',
          sourceRef: `ฐานข้อมูลยามาตรฐาน (Lexidrug, MIMS Thailand)`,
        },
      ]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 overflow-hidden"
    >
      <div className={`bg-[#ffffff] w-full h-full flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${seniorMode ? 'senior-mode-active' : ''}`}>
        
        {/* Header */}
        <div className="px-3.5 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#e8f1fa] text-[#0066cc] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className={`font-bold text-[#111827] truncate ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                  ผู้ช่วย AI ด้านยา
                </h3>
                <span className="text-[10px] bg-[#dcfce7] text-[#16a34a] font-bold px-2 py-0.5 rounded-full">
                  ออนไลน์
                </span>
              </div>
              <p className="text-xs text-[#6b7280] truncate">
                กำลังปรึกษาเรื่องยา: <span className="text-[#0066cc] font-medium">{drug.tradeName} ({drug.strength})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="bg-[#16a34a] hover:bg-[#15803d] text-white px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="ติดต่อเภสัชกรตัวจริง"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>ติดต่อเภสัชกร</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded-full hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#f8fafc]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                  seniorMode ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                } ${
                  msg.sender === 'user'
                    ? 'bg-[#0066cc] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-[#111827] border border-[#e5e7eb] rounded-bl-xs shadow-2xs'
                }`}
              >
                {msg.text}

                {msg.sourceRef && (
                  <div className="mt-1.5 pt-1 border-t border-[#f1f5f9] text-[10px] text-[#6b7280] flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5 text-[#0066cc] shrink-0" />
                    <span className="truncate">อ้างอิง: {msg.sourceRef}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#6b7280] mt-0.5 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280] bg-white border border-[#e5e7eb] rounded-2xl px-3 py-1.5 w-fit shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse delay-75"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse delay-150"></span>
              <span className="ml-1 text-[10px]">AI กำลังค้นตำรับยาอ้างอิง...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-white border-t border-[#e5e7eb] space-y-1.5 shrink-0">
          <div className="text-xs font-bold text-[#6b7280] px-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#0066cc]" />
            <span>คำถามด่วน (แตะเพื่อส่งคำถาม):</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="text-xs bg-[#f8fafc] hover:bg-[#e8f1fa] text-[#111827] border border-[#d1d5db] px-3 py-1.5 rounded-xl text-left transition-colors truncate max-w-full cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#e5e7eb] shrink-0">
          <p className="text-[11px] text-[#9ca3af] text-center pb-2 select-none leading-tight">
            *ข้อควรทราบ: คุณกำลังคุยกับผู้ช่วย AI ด้านยา ไม่ใช่เภสัชกรตัวจริง ตรวจสอบข้อมูลกับแพทย์/เภสัชกรก่อนใช้ยาเสมอ
          </p>
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
              placeholder="พิมพ์คำถามเกี่ยวกับยาหรือผลข้างเคียง..."
              className="flex-1 bg-[#f8fafc] border border-[#d1d5db] rounded-xl px-3.5 py-2 text-xs text-[#111827] focus:outline-hidden focus:border-[#0066cc] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#0066cc] hover:bg-[#0052a3] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all active:scale-95 shrink-0 cursor-pointer"
              title="ส่งคำถาม"
              aria-label="ส่งคำถาม"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
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
};
