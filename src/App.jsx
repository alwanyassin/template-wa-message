import React, { useState, useMemo, useEffect } from 'react';
import TemplatePromedia from './components/TemplatePromedia';
import TemplateAccess2G from './components/TemplateAccess2G';
import WhatsAppPreview from './components/WhatsAppPreview';
import MediaDirectoryModal from './components/MediaDirectoryModal';
import HistoryModal from './components/HistoryModal';
import {
  Newspaper,
  BarChart2,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Building2,
  Clock,
  Check,
} from 'lucide-react';
import {
  getSavedDraft,
  saveDraft,
  removeDraft,
  logHistoryEntry,
  saveMediaProfile,
} from './services/api';

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
  const [activeTab, setActiveTab] = useState(() =>
    getSavedDraft('active_tab', 'promedia')
  ); // 'promedia' | 'access2g'
  const [formatMode, setFormatMode] = useState(() =>
    getSavedDraft('format_mode', 'professional')
  ); // 'professional' | 'standard'

  const [promediaData, setPromediaData] = useState(() =>
    getSavedDraft('promedia', initialPromediaData)
  );
  const [access2gData, setAccess2gData] = useState(() =>
    getSavedDraft('access2g', initialAccess2GData)
  );

  // Modal states
  const [isDirModalOpen, setIsDirModalOpen] = useState(false);
  const [isHistModalOpen, setIsHistModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentMediaId, setCurrentMediaId] = useState(null);

  // Auto-save form drafts to localStorage
  useEffect(() => {
    saveDraft('promedia', promediaData);
  }, [promediaData]);

  useEffect(() => {
    saveDraft('access2g', access2gData);
  }, [access2gData]);

  useEffect(() => {
    saveDraft('active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveDraft('format_mode', formatMode);
  }, [formatMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      removeDraft('promedia');
    } else {
      setAccess2gData(initialAccess2GData);
      removeDraft('access2g');
    }
    setCurrentMediaId(null);
    showToast('Form berhasil di-reset ke data default');
  };

  // Apply media profile from directory to form (mengisi data ke kedua template sekaligus)
  const handleApplyMedia = (media) => {
    setCurrentMediaId(media.id);

    // Terapkan ke template Promedia
    setPromediaData((prev) => ({
      ...prev,
      mediaName: media.media_name || prev.mediaName,
      emails:
        Array.isArray(media.cms_emails) && media.cms_emails.length > 0
          ? media.cms_emails
          : prev.emails,
      password: media.cms_password || prev.password,
      cmsLink: media.cms_link || prev.cmsLink,
    }));

    // Terapkan ke template Access 2G & Traktir Kopi
    setAccess2gData((prev) => ({
      ...prev,
      mediaName: media.media_name || prev.mediaName,
      ga4Link: media.ga4_link || prev.ga4Link,
      gdsLink: media.gds_link || prev.gdsLink,
      email: media.google_email || prev.email,
      traktirKopiUsername:
        media.traktir_kopi_username || media.google_email || prev.traktirKopiUsername,
      traktirKopiPassword: media.traktir_kopi_password || prev.traktirKopiPassword,
      traktirKopiLink: media.traktir_kopi_link || prev.traktirKopiLink,
    }));

    showToast(`Profil "${media.media_name}" berhasil dimuat ke kedua template!`);
  };

  // Quick save current form data to directory (otomatis merge data nama sama)
  const handleQuickSaveToDirectory = async () => {
    const isPromedia = activeTab === 'promedia';
    const mediaName = (isPromedia ? promediaData.mediaName : access2gData.mediaName).trim();

    if (!mediaName) {
      alert('Nama media tidak boleh kosong');
      return;
    }

    // Selaraskan nama media di kedua form
    if (isPromedia) {
      setAccess2gData((prev) => ({ ...prev, mediaName }));
    } else {
      setPromediaData((prev) => ({ ...prev, mediaName }));
    }

    const payload = {
      id: currentMediaId || undefined,
      media_name: mediaName,
      ...(isPromedia
        ? {
            cms_emails: promediaData.emails,
            cms_password: promediaData.password,
            cms_link: promediaData.cmsLink,
          }
        : {
            ga4_link: access2gData.ga4Link,
            gds_link: access2gData.gdsLink,
            google_email: access2gData.email,
            traktir_kopi_username: access2gData.traktirKopiUsername,
            traktir_kopi_password: access2gData.traktirKopiPassword,
            traktir_kopi_link: access2gData.traktirKopiLink,
          }),
    };

    const res = await saveMediaProfile(payload);
    if (res.id) {
      setCurrentMediaId(res.id);
    }

    showToast(
      res.merged
        ? `Profil "${mediaName}" berhasil disatukan & diperbarui di database!`
        : `"${mediaName}" berhasil disimpan ke direktori!`
    );
  };

  // Callback when message is copied or opened in WhatsApp
  const handleActionLogged = async (actionType, phoneNumber) => {
    const mediaName =
      activeTab === 'promedia' ? promediaData.mediaName : access2gData.mediaName;

    await logHistoryEntry({
      template_type: activeTab,
      media_name: mediaName || 'Media',
      message_text: currentMessage,
      action: actionType,
      phone_number: phoneNumber,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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

          {/* Database Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDirModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition cursor-pointer"
              title="Kelola data direktori media bersama"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direktori Media</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition cursor-pointer"
              title="Lihat riwayat pesan yang telah disalin atau dikirim"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Riwayat</span>
            </button>
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
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
                  Lengkapi data di bawah atau muat dari Direktori Media.
                </p>
              </div>
            </div>

            {activeTab === 'promedia' ? (
              <TemplatePromedia
                data={promediaData}
                onChange={setPromediaData}
                onReset={handleResetCurrentForm}
                onOpenDirectory={() => setIsDirModalOpen(true)}
                onSaveToDirectory={handleQuickSaveToDirectory}
              />
            ) : (
              <TemplateAccess2G
                data={access2gData}
                onChange={setAccess2gData}
                onReset={handleResetCurrentForm}
                onOpenDirectory={() => setIsDirModalOpen(true)}
                onSaveToDirectory={handleQuickSaveToDirectory}
              />
            )}

            {/* Helper Alert Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Tips Penggunaan & Database Tim:</p>
                <p className="text-emerald-800 leading-relaxed">
                  Semua perubahan input otomatis tersimpan di draft browser Anda. Gunakan tombol{' '}
                  <strong>Simpan</strong> di samping nama media untuk membagikan data media ke Direktori Database Tim.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp Live Preview & Actions (5 cols on lg) */}
          <div className="lg:col-span-5">
            <WhatsAppPreview
              messageText={currentMessage}
              onResetForm={handleResetCurrentForm}
              onActionLogged={handleActionLogged}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <MediaDirectoryModal
        isOpen={isDirModalOpen}
        onClose={() => setIsDirModalOpen(false)}
        onApplyToForm={handleApplyMedia}
        activeTab={activeTab}
      />

      <HistoryModal
        isOpen={isHistModalOpen}
        onClose={() => setIsHistModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white/50 text-center text-xs text-slate-400">
        <p>WhatsApp Message Generator • Didukung Cloudflare D1 Database</p>
      </footer>
    </div>
  );
}
