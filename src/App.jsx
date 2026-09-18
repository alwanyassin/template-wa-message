import React, { useState, useMemo } from 'react';
import TemplatePromedia from './components/TemplatePromedia';
import TemplateAccess2G from './components/TemplateAccess2G';
import WhatsAppPreview from './components/WhatsAppPreview';
import { Newspaper, BarChart2, Sparkles, CheckCircle2, SlidersHorizontal, Info } from 'lucide-react';

const initialPromediaData = {
  mediaName: 'PortalMediaContoh.com',
  emails: [
    'penulis1.dummy@gmail.com',
    'penulis2.dummy@gmail.com',
    'redaksi.dummy@gmail.com',
  ],
  password: 'PasswordDummy123!',
  cmsLink: 'https://editor1.promediaindonesia.com',
};

const initialAccess2GData = {
  mediaName: 'PortalMediaContoh.com',
  ga4Link:
    'https://analytics.google.com/analytics/web/#/p000000000/reports/dashboard',
  gdsLink:
    'https://lookerstudio.google.com/reporting/00000000-0000-0000-0000-000000000000',
  email: 'akunmitra.dummy@gmail.com',
  traktirKopiUsername: 'akunmitra.dummy@gmail.com',
  traktirKopiPassword: 'PasswordKopi123!',
  traktirKopiLink: 'https://traktir-kopi.promediateknologi.id/',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('promedia'); // 'promedia' | 'access2g'
  const [formatMode, setFormatMode] = useState('professional'); // 'professional' | 'standard'

  const [promediaData, setPromediaData] = useState(initialPromediaData);
  const [access2gData, setAccess2gData] = useState(initialAccess2GData);

  // Generate Message for Template 1
  const generatePromediaMessage = (data, mode) => {
    const mediaTitle = data.mediaName.trim() || 'Media';
    const validEmails = data.emails.map((e) => e.trim()).filter(Boolean);
    const password = data.password.trim() || '-';
    const cmsLink = data.cmsLink.trim() || '-';

    if (mode === 'standard') {
      const emailList = validEmails.length > 0 ? validEmails.join('\n') : '-';
      return `Akses CMS Editor ${mediaTitle}

Username:
${emailList}

Password:
${password}

Link CMS Editor:
${cmsLink}`;
    }

    // Professional Mode (WhatsApp Markdown)
    const emailListFormatted =
      validEmails.length > 0
        ? validEmails.map((e) => `• ${e}`).join('\n')
        : '• -';

    return `Halo Rekan Redaksi, berikut informasi akses akun CMS Editor:

*Akses CMS Editor ${mediaTitle}*

*Username / Email Terdaftar:*
${emailListFormatted}

*Password:*
\`${password}\`

*Link CMS Editor:*
${cmsLink}

_Silakan login menggunakan kredensial di atas, lakukan verifikasi email dan ganti password, lalu simpan dengan aman. Terima kasih._`;
  };

  // Generate Message for Template 2
  const generateAccess2GMessage = (data, mode) => {
    const mediaTitle = data.mediaName.trim() || 'Media';
    const ga4 = data.ga4Link.trim() || '-';
    const gds = data.gdsLink.trim() || '-';
    const email = data.email.trim() || '-';
    const tkUser = data.traktirKopiUsername.trim() || email;
    const tkPass = data.traktirKopiPassword.trim() || '-';
    const tkLink = data.traktirKopiLink.trim() || 'https://traktir-kopi.promediateknologi.id/';

    if (mode === 'standard') {
      return `Akses Google Tools ${mediaTitle}

Google Analytics 4:
${ga4}

Google Data Studio:
${gds}

Akses Email: 
${email}

=========================================

Akses Dashboard Traktir Kopi ${mediaTitle}

Username:
${tkUser}

Password:
${tkPass}

Link Dashboard:
${tkLink}`;
    }

    // Professional Mode (WhatsApp Markdown)
    return `Halo Rekan Mitra, berikut detail informasi akses Google Tools & Dashboard Traktir Kopi:

*DETAIL AKSES TOOLS & DASHBOARD*
*Nama Media:* ${mediaTitle}

📊 *1. Akses Google Tools (GA4 & Data Studio)*
• *Google Analytics 4:*
${ga4}

• *Google Data Studio:*
${gds}

• *Akses Email Terdaftar:*
${email}

────────────────────────

☕ *2. Akses Dashboard Traktir Kopi*
• *Username:* ${tkUser}
• *Password:* \`${tkPass}\`
• *Link Dashboard:*
${tkLink}

_Catatan: Harap pastikan login Google menggunakan email terdaftar di atas. Terima kasih._`;
  };

  // Compute Active Message
  const currentMessage = useMemo(() => {
    if (activeTab === 'promedia') {
      return generatePromediaMessage(promediaData, formatMode);
    }
    return generateAccess2GMessage(access2gData, formatMode);
  }, [activeTab, formatMode, promediaData, access2gData]);

  // Reset current form to initial state
  const handleResetCurrentForm = () => {
    if (activeTab === 'promedia') {
      setPromediaData(initialPromediaData);
    } else {
      setAccess2gData(initialAccess2GData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <span className="text-xl font-black">💬</span>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-2">
                WA Template Generator
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Promedia
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Generator Pesan Akses CMS & Google Tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Host di:
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Cloudflare Pages Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab & Format Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Template Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('promedia')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'promedia'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Newspaper className="w-4 h-4 text-emerald-600" />
              <span>1. Akses CMS Promedia</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('access2g')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'access2g'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <span>2. Akses 2G & Traktir Kopi</span>
            </button>
          </div>

          {/* Mode Format Switcher */}
          <div className="flex items-center gap-2 px-2 self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Format:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFormatMode('professional')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  formatMode === 'professional'
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Format rapi dengan tebal bold, bullet point, dan salam pembuka"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Mode Rapi (WA Markdown)
              </button>

              <button
                type="button"
                onClick={() => setFormatMode('standard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  formatMode === 'standard'
                    ? 'bg-slate-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Format teks standar asli sesuai draft lama"
              >
                Format Asli (Standar)
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Inputs (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeTab === 'promedia'
                    ? 'Template 1: Akses CMS Editor Promedia'
                    : 'Template 2: Akses Google Tools (2G) & Traktir Kopi'}
                </h2>
                <p className="text-xs text-slate-500">
                  Lengkapi data di bawah untuk membuat teks pesan secara otomatis.
                </p>
              </div>
            </div>

            {activeTab === 'promedia' ? (
              <TemplatePromedia
                data={promediaData}
                onChange={setPromediaData}
                onReset={handleResetCurrentForm}
              />
            ) : (
              <TemplateAccess2G
                data={access2gData}
                onChange={setAccess2gData}
                onReset={handleResetCurrentForm}
              />
            )}

            {/* Helper Alert Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Tips Penggunaan:</p>
                <p className="text-emerald-800 leading-relaxed">
                  Semua perubahan input langsung ter-update di kotak preview sebelah kanan.
                  Gunakan tombol <strong>Salin Pesan</strong> untuk menyalin teks secara instan atau tombol <strong>Buka di WhatsApp</strong> untuk langsung membuka aplikasi WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp Live Preview & Actions (5 cols on lg) */}
          <div className="lg:col-span-5">
            <WhatsAppPreview
              messageText={currentMessage}
              onResetForm={handleResetCurrentForm}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white/50 text-center text-xs text-slate-400">
        <p>WhatsApp Message Generator • Siap dideploy ke Cloudflare Pages</p>
      </footer>
    </div>
  );
}
