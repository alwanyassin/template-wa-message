import React, { useState } from 'react';
import { Copy, Check, Send, Phone, MessageSquare, CheckCheck, RefreshCw } from 'lucide-react';

export default function WhatsAppPreview({ messageText, onResetForm, onActionLogged }) {
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      if (onActionLogged) {
        onActionLogged('copy', phoneNumber);
      }
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSendWA = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    let url = '';
    if (cleanPhone) {
      // Format to international 62 if starts with 0 or 8
      let formattedPhone = cleanPhone;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
      } else if (formattedPhone.startsWith('8')) {
        formattedPhone = '62' + formattedPhone;
      }
      url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    }

    if (onActionLogged) {
      onActionLogged('send_wa', cleanPhone || phoneNumber);
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to render WhatsApp formatting in the preview
  const formatWhatsAppText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Handle empty lines
      if (!line) return <div key={lineIdx} className="h-4" />;

      // Match bold *text*, monospace `text`, italic _text_
      const parts = [];
      let lastIndex = 0;
      // Simple regex for *bold*, `code`, _italic_
      const regex = /(\*([^*]+)\*|`([^`]+)`|_([^_]+)_|(https?:\/\/[^\s]+))/g;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }

        if (match[2]) {
          // Bold *text*
          parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[2]}</strong>);
        } else if (match[3]) {
          // Monospace `code`
          parts.push(
            <code key={match.index} className="bg-emerald-100/70 text-emerald-900 px-1 py-0.5 rounded text-[13px] font-mono font-semibold">
              {match[3]}
            </code>
          );
        } else if (match[4]) {
          // Italic _text_
          parts.push(<em key={match.index} className="italic text-slate-700">{match[4]}</em>);
        } else if (match[5]) {
          // Link URL
          parts.push(
            <span key={match.index} className="text-blue-600 underline break-all hover:text-blue-700">
              {match[5]}
            </span>
          );
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <div key={lineIdx} className="leading-relaxed break-words text-slate-800">
          {parts}
        </div>
      );
    });
  };

  const charCount = messageText.length;
  const wordCount = messageText.trim() ? messageText.trim().split(/\s+/).length : 0;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden lg:sticky lg:top-6">
      {/* WA Mock Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-700/80 flex items-center justify-center text-emerald-100 font-bold text-sm shadow-inner border border-emerald-400/30">
            <MessageSquare className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5 leading-snug">
              <span>Preview Pesan WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-200">Real-time generator output</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetForm}
          title="Reset ke format bawaan"
          className="text-xs text-emerald-100 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Form</span>
        </button>
      </div>

      {/* WA Mock Chat Body with Pattern */}
      <div className="flex-1 wa-bg-pattern p-4 sm:p-6 overflow-y-auto max-h-[520px] min-h-[360px] flex flex-col justify-start">
        {/* Date chip */}
        <div className="flex justify-center mb-4">
          <span className="bg-white/90 text-slate-700 text-[11px] px-3 py-1 rounded-lg shadow-sm font-semibold tracking-wide">
            HARI INI
          </span>
        </div>

        {/* Chat Bubble (Right - Sent message) */}
        <div className="self-end max-w-[92%] sm:max-w-[85%] bg-[#E7FCE3] border border-[#d1f5cb] text-slate-900 rounded-2xl rounded-tr-sm p-4 shadow-sm relative group transition-all">
          <div className="text-[13.5px] font-sans whitespace-pre-wrap select-text leading-relaxed">
            {formatWhatsAppText(messageText)}
          </div>

          {/* Timestamp and ticks */}
          <div className="flex items-center justify-end gap-1 mt-2 text-[11px] font-medium text-slate-600 select-none">
            <span>{currentTime}</span>
            <CheckCheck className="w-3.5 h-3.5 text-sky-600 inline" />
          </div>
        </div>
      </div>

      {/* Footer Info & Action Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
          <span>{wordCount} kata - {charCount} karakter</span>
          {copied && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin ke Clipboard!
            </span>
          )}
        </div>

        {/* Direct Phone Input (Optional) */}
        {showPhoneInput ? (
          <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
            <Phone className="w-4 h-4 text-slate-500 ml-1 shrink-0" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nomor WA tujuan (cth: 08123456789) - opsional"
              className="flex-1 text-xs outline-none text-slate-800"
            />
            <button
              type="button"
              onClick={() => setShowPhoneInput(false)}
              className="text-[11px] font-medium text-slate-600 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-100 transition active:scale-[0.98] cursor-pointer"
            >
              Batal
            </button>
          </div>
        ) : (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowPhoneInput(true)}
              className="text-[11px] text-slate-600 hover:text-emerald-700 font-medium transition cursor-pointer hover:underline"
            >
              + Kirim langsung ke nomor WhatsApp tertentu
            </button>
          </div>
        )}

        {/* Main CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer whitespace-nowrap ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Salin Pesan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSendWA}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>Buka di WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
