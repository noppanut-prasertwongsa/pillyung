import React from 'react';
import { X, Trophy, Clock } from 'lucide-react';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#e5e5ea] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#f0f0f2] flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="font-bold text-[#1d1d1f] text-base sm:text-lg">
              สคริปต์การอัดคลิปสาธิต (Demo Script 90 วินาที)
            </h3>
            <p className="text-xs text-[#8e8e93]">
              PSAT HealthHacks 2026 — เกณฑ์รอบ Prototype 30% เต็ม
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#8e8e93] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-[#1d1d1f]">
          {/* Rules & Naming Reminder */}
          <div className="bg-[#fff9f0] border border-[#ff9500]/30 rounded-2xl p-4 text-xs space-y-1">
            <div className="font-bold text-[#b25e00] flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>กติกาการส่งคลิปวิดีโอ (ตามเอกสารหน้า 6-7):</span>
            </div>
            <p className="text-[#1d1d1f]">
              • ตั้งชื่อไฟล์เป็น: <code className="bg-white px-2 py-0.5 rounded font-mono text-[#b25e00] border border-[#ff9500]/20">ชื่อทีม_VideoHealthHack2026.mp4</code><br />
              • ขนาดไฟล์ไม่เกิน 100 MB | ความยาวแนะนำ 1.30 – 2 นาที (ไม่เกิน 3 นาที)<br />
              • เน้นโชว์ให้เห็น: <b>การกรอกข้อมูล $\rightarrow$ สแกนรูปภาพฉลากยาจริง $\rightarrow$ เตือนแพ้ยาข้ามกลุ่ม $\rightarrow$ ปรึกษาผลข้างเคียง AI $\rightarrow$ โหมดตัวอักษรใหญ่ผู้สูงวัย</b>
            </p>
          </div>

          {/* Step-by-Step Script */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#1d1d1f] text-base border-b pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0066cc]" />
              <span>ลำดับขั้นตอนการกดและบทพากย์ในคลิป:</span>
            </h4>

            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0066cc]">⏱️ 0:00 - 0:20 | ฉากที่ 1: ข้อมูลสุขภาพและสรีระ (Onboarding)</span>
                <span className="text-[#8e8e93]">Theme: Personalized Healthcare</span>
              </div>
              <p className="text-xs text-[#48484a]">
                <b>การกระทำ:</b> โชว์หน้าเริ่มต้น มีชื่อผู้ใช้ (นายสมชาย อายุ 68 ปี, น้ำหนัก 65 กก., ส่วนสูง 168 ซม., เพศชาย), มีการคำนวณ BMI อัตโนมัติ, เลือกตัวเลือก <b>"มีประวัติแพ้ยา: Penicillin / Amoxicillin"</b> จากนั้นกดปุ่ม "บันทึกข้อมูลและเข้าสู่ระบบ"
              </p>
              <p className="text-xs text-[#1d1d1f] italic bg-white p-2 rounded-lg border border-[#e5e5ea]">
                🎙️ <b>บทพูด:</b> "pillyung เริ่มต้นจากการบันทึกข้อมูลสุขภาพ น้ำหนัก ส่วนสูง เพื่อคำนวณขนาดยาที่เหมาะสม พร้อมทั้งประวัติการแพ้ยาเพื่อป้องกันอันตรายจากการใช้ยาตลอดช่วงชีวิตครับ"
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0066cc]">⏱️ 0:20 - 0:40 | ฉากที่ 2: สแกนภาพฉลากยาจริง & ดึงข้อมูลอัตโนมัติ</span>
                <span className="text-[#8e8e93]">AI Vision OCR & Crush Warning</span>
              </div>
              <p className="text-xs text-[#48484a]">
                <b>การกระทำ:</b> กดปุ่ม <b>"สแกนฉลากยาด้วย AI"</b> โชว์ว่าสามารถอัปโหลดภาพฉลากยาจริงจากคอมพิวเตอร์ หรือเลือกตัวอย่างภาพซองยา รพ. Metformin 500 mg $\rightarrow$ ระบบโชว์ภาพฉลากยาจริงพร้อมเลเซอร์สแกนและกรอบตรวจจับตัวหนังสือ (OCR) $\rightarrow$ ดึงวิธีทานและข้อห้ามบดยาขึ้นมาอัตโนมัติ
              </p>
              <p className="text-xs text-[#1d1d1f] italic bg-white p-2 rounded-lg border border-[#e5e5ea]">
                🎙️ <b>บทพูด:</b> "ผู้ป่วยสามารถอัปโหลดภาพถ่ายซองยาจริง AI Vision จะอ่านข้อความบนฉลากยาเทียบกับฐานข้อมูลยามาตรฐานอย่าง Lexidrug และ MIMS Thailand ดึงขนาดยาและคำเตือนเรื่องการห้ามบดยา เพื่อป้องกันการระคายเคืองกระเพาะอาหารทันทีครับ"
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-[#fff1f0] border border-[#ff3b30]/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#d70015]">⏱️ 0:40 - 0:60 | ฉากที่ 3: ระบบตรวจจับการแพ้ยาข้ามกลุ่ม (Killer Safety Feature)</span>
                <span className="text-[#d70015] font-semibold">★ จุดเด่นด้านเภสัชกรรม</span>
              </div>
              <p className="text-xs text-[#48484a]">
                <b>การกระทำ:</b> กดปุ่มสแกนยาอีกครั้ง เลือกภาพซองยาขอบแดง <b>Augmentin 1000 mg (Amoxicillin)</b> $\rightarrow$ ระบบแสดงภาพซองยา สแกน แล้วเด้งป๊อปอัปเตือนภัยสีแดงฉุกเฉินทันที! ชี้ให้เห็นว่าตรวจพบการแพ้ข้ามกลุ่มกับ Penicillin
              </p>
              <p className="text-xs text-[#1d1d1f] italic bg-white p-2 rounded-lg border border-[#ff3b30]/20">
                🎙️ <b>บทพูด:</b> "ไฮไลต์สำคัญคือความปลอดภัยทางยา เมื่อสแกนยาฆ่าเชื้อ Augmentin ระบบจะเทียบกับประวัติแพ้ยาและตรวจพบว่าอยู่ในกลุ่ม Penicillin จึงสั่งระงับและเด้งเตือนสีแดงทันที ป้องกันภาวะ Anaphylaxis ที่อาจอันตรายถึงชีวิตครับ"
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0066cc]">⏱️ 1:00 - 1:15 | ฉากที่ 4: AI เภสัชกรส่วนตัวตอบคำถามผลข้างเคียง</span>
                <span className="text-[#8e8e93]">Clinical AI Assistant</span>
              </div>
              <p className="text-xs text-[#48484a]">
                <b>การกระทำ:</b> กดปุ่ม "ปรึกษาอาการกับ AI" บนการ์ดยา Metformin คลิกคำถามด่วน <i>"ทานแล้วคลื่นไส้ แน่นท้อง ปกติไหม?"</i> โชว์คำตอบจากคู่มือยาแนะนำให้ทานพร้อมอาหาร
              </p>
              <p className="text-xs text-[#1d1d1f] italic bg-white p-2 rounded-lg border border-[#e5e5ea]">
                🎙️ <b>บทพูด:</b> "ผู้ป่วยสามารถปรึกษา AI เภสัชกรได้ตลอดเวลา เพื่อแยกแยะผลข้างเคียง เช่น อาการคลื่นไส้ของ Metformin พร้อมแนะนำการทานยาพร้อมอาหารเพื่อลดอาการอย่างปลอดภัยครับ"
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0066cc]">⏱️ 1:15 - 1:30 | ฉากที่ 5: ตารางเตือนมื้อยา & ขยายฟอนต์ใหญ่สำหรับผู้สูงวัย</span>
                <span className="text-[#8e8e93]">Senior Accessibility & Adherence</span>
              </div>
              <p className="text-xs text-[#48484a]">
                <b>การกระทำ:</b> สลับไปแท็บ <b>"เตือนฉันที"</b> กดบันทึกมื้อเช้าให้ขึ้นเครื่องหมายถูก $\rightarrow$ กดเปิด <b>"โหมดฟอนต์ผู้สูงวัย"</b> ชี้ให้เห็นว่าคำว่า "มื้อเช้า" และ "1 เม็ด" ขยายใหญ่พิเศษ อ่านง่ายสบายตา
              </p>
              <p className="text-xs text-[#1d1d1f] italic bg-white p-2 rounded-lg border border-[#e5e5ea]">
                🎙️ <b>บทพูด:</b> "หน้าเตือนฉันทีช่วยติดตามการทานยาแต่ละมื้อได้อย่างแม่นยำ และมีโหมดขยายตัวหนังสือใหญ่พิเศษ ทั้งขนาดเม็ดยาและมื้ออาหาร เพื่อให้ผู้สูงอายุใช้งานได้อย่างสบายตา pillyung ขอร่วมเป็นส่วนหนึ่งในการขับเคลื่อนสังคมสูงวัยอย่างมีสุขภาวะที่ยั่งยืน ขอบคุณครับ"
              </p>
            </div>

            {/* Step 6: iOS Alarm Screen */}
            <div className="p-3.5 rounded-2xl bg-[#0f172a] text-white border border-[#38bdf8]/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#38bdf8]">⏱️ ฟีเจอร์พิเศษ: แจ้งเตือนยาเต็มจอ 17:30 น. (iOS MedAlert)</span>
                <span className="text-[#94a3b8]">Full-Screen iOS Alarm & Slide to Dismiss</span>
              </div>
              <p className="text-xs text-[#cbd5e1]">
                <b>การกระทำ:</b> กดปุ่ม <b>"5. เตือนยา 17:30 (iOS Alarm)"</b> บนแถบเครื่องมือ $\rightarrow$ หน้าจอเตือนเต็มจอแบบนาฬิกาปลุก iOS ปรากฏขึ้น โชว์เวลา 17:30 น. พร้อมเสียงเตือนดังฟังชัด และรายการยามื้อเย็น 18:00 น. ในกรอบสี่เหลี่ยมชัดเจน $\rightarrow$ เลื่อนแถบเลื่อนจากซ้ายไปขวา (Slide to dismiss) เพื่อปลดล็อคและหยุดเสียง
              </p>
              <p className="text-xs text-white italic bg-[#1e293b] p-2 rounded-lg border border-[#38bdf8]/20">
                🎙️ <b>บทพูด:</b> "และเมื่อถึงเวลา 17:30 น. ระบบจะส่งสัญญาณเสียงเตือนได้เวลารับประทานยาเสียงดังฟังชัดเจนพิเศษ พร้อมหน้าจอเตือนเต็มจอเหมือนนาฬิกาปลุกของ iOS สรุปรายชื่อยาที่ต้องทานตอน 6 โมงเย็นในกรอบสี่เหลี่ยมชัดเจน และสามารถเลื่อนแถบเลื่อนจากซ้ายไปขวาเพื่อยืนยัน ป้องกันการไม่ได้ยินและป้องกันการลืมทานยาของผู้สูงวัยได้อย่างสมบูรณ์แบบครับ"
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#0071e3] transition-colors"
            >
              เข้าใจแล้ว ปิดหน้าต่างเพื่อเริ่มอัดคลิป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
