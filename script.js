/**
 * iBrandQueen - Personal Branding Website & Digital Card Logic
 * Author: Antigravity
 * Version: 1.0
 */

// ==========================================================================
// 0. 雲端系統整合設定 (Cloud Integration Config)
// ==========================================================================
// 請在下方引號中貼上您部署好的 Google Apps Script 網頁應用程式 (Web App) 網址：
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxaa_U0FEf2ehEBICuq4h79-HCvWO54mGjD0bRkZNuadcGQY4_CHlPvbzmmIghw2_fM/exec";

// 1. Localization Dictionary (Traditional Chinese & English)
const translations = {
  zh: {
    nav_about: "關於女王",
    nav_services: "品牌服務",
    nav_connect: "數位名片",
    nav_booking: "合作預約",
    nav_admin: "會員登入",
    pricing_label: "MEMBERSHIP PLANS",
    pricing_title: "選取您的品牌訂閱方案",
    pricing_subtitle: "訂閱專屬品牌行銷方案，立即解鎖相應等級的菁英商業 IP 定位、媒體曝光與跨界資源對接文章。",
    hero_tag: "PERSONAL BRAND CONSULTANT",
    hero_title: "定義品牌高度<br><span class=\"gradient-text\">釋放商業影響力</span>",
    hero_desc: "專為創辦人、企業菁英與高階主管量身規劃的個人品牌定位與整合行銷策略。我們透過多維度的定位診斷、社群IP孵化與高端公關對接，協助您在行業中建立無可替代的個人權威與商業影響力。",
    btn_explore_services: "探索服務項目",
    btn_book_consultation: "預約一對一諮詢",
    exp_badge_text: "年顧問資歷",
    about_label: "MEET IBRANDQUEEN",
    about_title: "關於 iBrandQueen",
    about_quote: "「每個卓越的靈魂背後，都需要一個能被世界看見的品牌定位。」",
    about_desc1: "iBrandQueen（品牌女王）是專為高端商務人士、新創創辦人及專業菁英打造的個人品牌推手。我們深信，在數位行銷的時代，個人影響力就是最具價值的無形資產。",
    about_desc2: "憑藉超過十年的品牌定位診斷、整合行銷策略與跨界資源引薦經驗，我們已協助無數企業家與各產業菁英將自身的專業知識與理念，孵化為具備商業變現價值的個人 IP，實現跨越式的品牌升級與資源對接。",
    skill_1: "個人品牌診斷與策略定位",
    skill_2: "自媒體商業 IP 孵化顧問",
    skill_3: "整合行銷傳播與媒體公關",
    skill_4: "跨界商務媒合與資源鏈結",
    services_label: "EXPERT SERVICES",
    services_title: "品牌服務生態",
    services_subtitle: "我們提供一站式的專業個人行銷方案，從思維重塑、媒體曝光到商務資源對接，全方位開拓您的影響力版圖。",
    service1_title: "個人品牌定位顧問",
    service1_desc: "針對創辦人與菁英進行深度的品牌人格診斷，梳理出獨一無二的核心優勢與價值，提供精準的市場競爭力定位與品牌識別策略。",
    service1_feat1: "個人品牌 DNA 定位診斷",
    service1_feat2: "核心故事與行銷標籤規劃",
    service1_feat3: "高端商務形象與視覺識別顧問",
    service2_title: "整合行銷公關傳播",
    service2_desc: "規劃多維度的整合行銷方案，包含主流媒體公關採訪企劃、數位行銷宣傳與高端商業社群網絡推廣，讓您的品牌迅速建立專業信任感。",
    service2_feat1: "媒體公關報導與專題採訪企劃",
    service2_feat2: "多管道數位社群整合行銷",
    service2_feat3: "個人自媒體運營推廣策略",
    service3_title: "自媒體與 IP 孵化",
    service3_desc: "協助專業人士將知識結構化，孵化為具有高黏著度與傳播力的知識型或商業型個人 IP。搭配影音策略，加速商業轉化與對接。",
    service3_feat1: "自媒體影音企劃與內容內容",
    service3_feat2: "線上知識課程與個人 IP 孵化",
    service3_feat3: "商業合作與商務機會媒合",
    connect_label: "DIGITAL BUSINESS CARD",
    connect_title: "隨手對接商機，<br>隨時與女王保持聯絡",
    connect_desc: "我們將實體感應碰碰卡與專屬的個人數位名片網頁完美結合。只需感應 NFC 卡片或掃描 QR Code，即可在手機上開啟個人數位名片，一鍵下載聯絡資訊存入電話簿，或透過 LINE、Email 迅速對接您的商務合作機會。",
    btn_open_card: "開啟數位名片",
    btn_show_qr: "掃描名片 QR Code",
    booking_label: "CONSULTATION BOOKING",
    booking_headline: "開啟您的品牌高度",
    booking_desc: "不論您是需要深度的個人品牌顧問診斷、整合行銷策略規劃，或是尋求商務對接與 IP 孵化合作，請填寫右側表單。我們將於 24 小時內安排顧問與您聯繫，為您客製化最適合的商務品牌提升計劃。",
    info_phone_label: "聯絡電話",
    info_email_label: "電子郵件",
    info_address_label: "服務總部",
    address_value: "台北市信義區信義路五段7號 (台北101)",
    form_name_label: "您的姓名",
    form_phone_label: "聯絡電話",
    form_email_label: "電子郵件信箱",
    form_service_label: "諮詢服務項目",
    form_service_default: "請選擇想諮詢的服務...",
    form_service_opt1: "個人品牌定位顧問",
    form_service_opt2: "整合行銷公關傳播",
    form_service_opt3: "自媒體與 IP 孵化顧問",
    form_service_opt4: "其他跨界商務合作",
    form_message_label: "合作需求備註",
    btn_submit_text: "送出諮詢申請",
    btn_submit_loading: "傳送中...",
    toast_success: "您的諮詢表單已成功送出！我們將儘快聯絡您。",
    toast_validation: "請填寫所有欄位並選擇諮詢服務！",
    footer_desc: "高端菁英與創辦人個人品牌與行銷對接的頂尖顧問團隊。定義高度，放大影響力。",
    footer_links_title: "探索連結",
    footer_admin: "管理員登入",
    footer_contact_title: "聯絡諮詢",
    copyright: "&copy; 2026 iBrandQueen. All rights reserved.",
    modal_title: "掃描分享名片",
    modal_desc: "請使用手機相機掃描下方 QR Code，即可在您的行動裝置上即刻開啟品牌女王的專屬數位電子名片。",
    modal_close: "關閉視窗",
    mockup_name: "品牌女王",
    mockup_title: "Founder & Chief Consultant",
    mockup_badge: "個人品牌定位與整合行銷",
    mockup_hint: "觸碰或點擊探索",
    btn_website: "進入官方網站",
    btn_vcard: "儲存至電話簿",
    quick_call: "撥號",
    quick_line: "LINE",
    quick_map: "導航",
    quick_email: "郵件",
    card_brand_title: "核心品牌優勢",
    card_brand_desc: "我們為企業家、高階經理人與專家提供客製化的品牌影響力方案。透過「診斷定位、傳播曝光、資源媒合」三大階段，助您建立標誌性的行業 IP，實現資源效益極大化。",
    card_booking_title: "預約商務諮詢",
    card_form_name: "您的姓名",
    card_form_phone: "聯絡電話",
    card_form_message: "合作需求簡述",
    card_btn_submit: "送出留言",
    card_btn_submitting: "傳送中...",
    card_toast_success: "訊息已成功傳送！我們會盡快與您聯絡。",
    card_modal_title: "掃描分享名片",
    card_modal_desc: "用手機相機掃描下方 QR Code，即可在手機上開啟品牌女王的數位名片。",
    card_modal_close: "關閉視窗",
    hero_title_static: "定義品牌高度",
    orbit_tag_1: "👑 商業 IP 孵化",
    orbit_tag_2: "✨ 整合行銷策略",
    orbit_tag_3: "🤝 跨界商務對接",
    orbit_tag_4: "💡 品牌 DNA 定位",
    stat_exp: "年顧問資歷",
    stat_clients: "企業菁英品牌孵化",
    stat_matchings: "商務對接媒合",
    stat_exposure: "媒體傳播曝光"
  },
  en: {
    nav_about: "About Queen",
    nav_services: "Services",
    nav_connect: "Digital Card",
    nav_booking: "Booking",
    nav_admin: "Member Login",
    pricing_label: "MEMBERSHIP PLANS",
    pricing_title: "Select Your Subscription Plan",
    pricing_subtitle: "Subscribe to unlock premium articles on personal branding IP positioning, media exposure, and resource matchmaking.",
    hero_tag: "PERSONAL BRAND CONSULTANT",
    hero_title: "Define Brand Heights<br><span class=\"gradient-text\">Amplify Commercial Influence</span>",
    hero_desc: "Tailored branding and marketing strategies for founders and executives. We construct irreplaceable authority and commercial impact through multi-dimensional diagnosis, social media IP incubation, and premium PR alignment.",
    btn_explore_services: "Explore Services",
    btn_book_consultation: "Book One-on-One",
    exp_badge_text: "YEARS EXP",
    about_label: "MEET IBRANDQUEEN",
    about_title: "About iBrandQueen",
    about_quote: "“Behind every extraordinary soul lies a brand positioning that deserves to be seen by the world.”",
    about_desc1: "iBrandQueen is a premier personal brand architect designed for entrepreneurs and professionals. We believe personal influence is the most valuable intangible asset in the digital marketing era.",
    about_desc2: "With over a decade of experience in consulting, integrated marketing, and resource matchmaking, we have helped countless founders structure their expertise into high-value personal IPs, achieving breakthrough brand upgrades.",
    skill_1: "Personal Brand Diagnosis & Positioning",
    skill_2: "Self-Media Business IP Incubation",
    skill_3: "Integrated Marketing & Media PR",
    skill_4: "Cross-Industry Matchmaking & Networking",
    services_label: "EXPERT SERVICES",
    services_title: "Services Ecosystem",
    services_subtitle: "We offer one-stop professional personal marketing, from mindset reframing and media exposure to commercial resource matchmaking.",
    service1_title: "Brand Positioning Consultant",
    service1_desc: "Deep personality diagnostics for founders and elites to untangle core values, delivering precise competitive market positioning and identity strategies.",
    service1_feat1: "Personal Brand DNA Diagnostics",
    service1_feat2: "Core Story & Marketing Tagging",
    service1_feat3: "High-End Corporate Identity Consult",
    service2_title: "Integrated Marketing & PR",
    service2_desc: "Multi-dimensional campaigns including mainstream PR planning, digital advertisements, and elite business community networks for rapid trust building.",
    service2_feat1: "PR Coverage & Focus Interview Planning",
    service2_feat2: "Multi-Channel Digital Marketing",
    service2_feat3: "Self-Media Operation & Promotion",
    service3_title: "Self-Media & IP Incubation",
    service3_desc: "Helping professionals structure knowledge into high-engagement, shareable IPs, supported by video tactics to accelerate commercial conversions.",
    service3_feat1: "Video Content Strategy & Matrix",
    service3_feat2: "Online Knowledge IP Incubation",
    service3_feat3: "Commercial Matchmaking & Deal-Flow",
    connect_label: "DIGITAL BUSINESS CARD",
    connect_title: "Connect Instantly,<br>Stay in Touch Anytime",
    connect_desc: "We merge physical touch cards with custom digital cards. Just tap your phone or scan the QR code to access contact details, download the VCF card, or connect via LINE and email.",
    btn_open_card: "Open Digital Card",
    btn_show_qr: "Scan Card QR Code",
    booking_label: "CONSULTATION BOOKING",
    booking_headline: "Elevate Your Brand Height",
    booking_desc: "Whether you need brand diagnosis, marketing strategies, or IP incubation cooperation, fill in the form. Our consultant will contact you within 24 hours.",
    info_phone_label: "Phone Number",
    info_email_label: "Email Address",
    info_address_label: "Headquarters",
    address_value: "No. 7, Sec. 5, Xinyi Rd., Xinyi Dist., Taipei (Taipei 101)",
    form_name_label: "Your Name",
    form_phone_label: "Phone Number",
    form_email_label: "Email Address",
    form_service_label: "Inquiry Service",
    form_service_default: "Select inquiry service...",
    form_service_opt1: "Personal Brand Consulting",
    form_service_opt2: "Integrated Marketing & PR",
    form_service_opt3: "Self-Media & IP Incubation",
    form_service_opt4: "Other Business Cooperation",
    form_message_label: "Inquiry Details",
    btn_submit_text: "Submit Request",
    btn_submit_loading: "Sending...",
    toast_success: "Your inquiry has been successfully sent! We will contact you shortly.",
    toast_validation: "Please fill in all fields!",
    footer_desc: "Premier consulting team connecting personal brands and marketing opportunities for founders and executives. Define Heights, Amplify Influence.",
    footer_links_title: "Explore Links",
    footer_admin: "Admin Portal",
    footer_contact_title: "Contact Info",
    copyright: "&copy; 2026 iBrandQueen. All rights reserved.",
    modal_title: "Scan to Share Card",
    modal_desc: "Scan the QR code below with your phone camera to open the digital business card immediately.",
    modal_close: "Close Window",
    mockup_name: "Brand Queen",
    mockup_title: "Founder & Chief Consultant",
    mockup_badge: "Personal Brand Positioning",
    mockup_hint: "Tap or Click to Explore",
    btn_website: "Enter Official Website",
    btn_vcard: "Save to Address Book",
    quick_call: "Call",
    quick_line: "LINE",
    quick_map: "Directions",
    quick_email: "Email",
    card_brand_title: "Core Strengths",
    card_brand_desc: "We provide tailored brand impact solutions for entrepreneurs and executives. Through diagnosis, exposure, and matchmaking, we build your signature industry IP.",
    card_booking_title: "Business Booking",
    card_form_name: "Your Name",
    card_form_phone: "Phone Number",
    card_form_message: "Inquiry Notes",
    card_btn_submit: "Submit Message",
    card_btn_submitting: "Sending...",
    card_toast_success: "Message successfully sent! We will reach out soon.",
    card_modal_title: "Scan to Share Card",
    card_modal_desc: "Scan the QR code below with your phone camera to open the digital card immediately.",
    card_modal_close: "Close",
    hero_title_static: "Define Brand Heights",
    orbit_tag_1: "👑 Business IP",
    orbit_tag_2: "✨ Integrated Marketing",
    orbit_tag_3: "🤝 Strategic Matchmaking",
    orbit_tag_4: "💡 Brand DNA Positioning",
    stat_exp: "Years Experience",
    stat_clients: "Brands Incubated",
    stat_matchings: "Business Matchings",
    stat_exposure: "Media Impressions"
  }
};

let currentLang = 'zh';

// 2. Initial Setup on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLanguage();
  initTheme();
  initNavbar();
  init3DTilt();
  initQRModal();
  initForms();
  initTypewriter();
  initScrollReveal();
  initMemberNavbar();
});

// Member Navbar Dynamic State Logic
function initMemberNavbar() {
  const updateNavbarText = () => {
    const navAdminLinks = document.querySelectorAll('.nav-admin-link, #nav-login-btn');
    const footerAdminLink = document.querySelector('[data-i18n="footer_admin"]');
    const isAuthed = sessionStorage.getItem('aiu_member_auth') === 'true';
    
    navAdminLinks.forEach(link => {
      if (isAuthed) {
        link.href = './articles.html';
        link.innerHTML = `<i class="fa-solid fa-book-open"></i> ${currentLang === 'zh' ? '會員專區' : 'Member Zone'}`;
      } else {
        link.href = './login.html';
        link.innerHTML = `<i class="fa-solid fa-user-lock"></i> ${currentLang === 'zh' ? '會員登入' : 'Member Login'}`;
      }
    });

    if (footerAdminLink) {
      if (isAuthed) {
        footerAdminLink.href = './articles.html';
        footerAdminLink.innerHTML = `<i class="fa-solid fa-book-open"></i> ${currentLang === 'zh' ? '進入專屬文章庫' : 'Member Articles'}`;
      } else {
        footerAdminLink.href = './login.html';
        footerAdminLink.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${currentLang === 'zh' ? '會員登入 / 註冊' : 'Login / Register'}`;
      }
    }
  };

  // Sync with Firebase state if available
  if (typeof useFirebase !== 'undefined' && useFirebase) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('aiu_member_auth', 'true');
      } else {
        sessionStorage.removeItem('aiu_member_auth');
      }
      updateNavbarText();
    });
  } else {
    updateNavbarText();
  }

  // Hook into translation updates to refresh custom navbar texts dynamically
  const origApplyTranslations = applyTranslations;
  applyTranslations = function(lang) {
    origApplyTranslations(lang);
    updateNavbarText();
  };
}

// 3. Language Selector Logic
function initLanguage() {
  const langSelects = document.querySelectorAll('.lang-select');
  if (langSelects.length === 0) return;

  // Load saved preference or fallback to system locale or default to zh
  const savedLang = localStorage.getItem('brandqueen_lang');
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  } else {
    const userLocale = navigator.language.substring(0, 2);
    currentLang = translations[userLocale] ? userLocale : 'zh';
  }

  // Apply localization
  applyTranslations(currentLang);

  langSelects.forEach(select => {
    select.value = currentLang;
    select.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('brandqueen_lang', currentLang);
      applyTranslations(currentLang);
      
      // Update other select selectors in page to match
      langSelects.forEach(other => {
        if (other !== select) other.value = currentLang;
      });
      
      // Update dynamic typewriter text for the new language
      if (typeof initTypewriter === 'function') {
        initTypewriter();
      }
    });
  });
}

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // Set html document lang attribute
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant-TW' : 'en';

  // Translate text content or innerHTML for elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (dict[key].includes('<')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Translate placeholders for inputs
  document.querySelectorAll('[placeholder]').forEach(el => {
    const i18nPlaceholderKey = el.getAttribute('id') ? `form_${el.getAttribute('id').replace('form-', '')}_placeholder` : null;
    
    // Check specific translation mapping overrides
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const isCard = document.body.classList.contains('card-body-page');
      let lookupKey = '';
      
      if (el.id === 'form-name') lookupKey = isCard ? 'card_form_placeholder_name' : 'form_name_placeholder';
      if (el.id === 'form-phone') lookupKey = isCard ? 'card_form_placeholder_phone' : 'form_phone_placeholder';
      if (el.id === 'form-email') lookupKey = 'form_email_placeholder';
      if (el.id === 'form-message') lookupKey = isCard ? 'card_form_placeholder_message' : 'form_message_placeholder';
      
      // Fallback placeholder logic
      if (lookupKey && dict[lookupKey]) {
        el.placeholder = dict[lookupKey];
      } else {
        // Fallback default dictionary
        if (el.id === 'form-name') el.placeholder = lang === 'zh' ? '請輸入姓名' : 'Enter your name';
        if (el.id === 'form-phone') el.placeholder = lang === 'zh' ? '請輸入電話' : 'Enter your phone';
        if (el.id === 'form-email') el.placeholder = lang === 'zh' ? 'example@domain.com' : 'example@domain.com';
        if (el.id === 'form-message') el.placeholder = lang === 'zh' ? '請輸入需求...' : 'Enter details...';
      }
    }
  });
}

function getTranslation(key) {
  return translations[currentLang] && translations[currentLang][key] !== undefined
    ? translations[currentLang][key]
    : translations['zh'][key] || '';
}

// 4. Dark/Light Theme Handler
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  if (themeToggleBtns.length === 0) return;

  // Load saved theme (defaults to light theme unless dark is saved)
  const savedTheme = localStorage.getItem('brandqueen_theme');
  const isDark = savedTheme ? (savedTheme === 'dark') : false;
  
  if (isDark) {
    enableDarkMode();
  } else {
    enableLightMode();
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyDark = document.body.classList.contains('dark-theme');
      if (isCurrentlyDark) {
        enableLightMode();
      } else {
        enableDarkMode();
      }
    });
  });

  function enableDarkMode() {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('brandqueen_theme', 'dark');
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-sun';
    });
  }

  function enableLightMode() {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('brandqueen_theme', 'light');
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-moon';
    });
  }
}

// 5. Header Scroll State & Mobile Hamburger
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const active = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', active);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// 6. Card 3D Tilt Hover Physics
function init3DTilt() {
  // 1. Digital Card Mockup Tilt
  const card = document.getElementById('digital-card-mockup');
  if (card) {
    card.addEventListener('click', () => {
      window.location.href = 'card.html';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      
      const glow = card.querySelector('.card-mockup-glow');
      if (glow) {
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(139, 92, 246, 0.45) 0%, rgba(20, 16, 35, 0) 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      const glow = card.querySelector('.card-mockup-glow');
      if (glow) {
        glow.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(20, 16, 35, 0) 70%)';
      }
    });
  }

  // 2. Hero Portrait Frame Tilt
  const portrait = document.getElementById('hero-portrait-frame');
  if (portrait) {
    portrait.addEventListener('mousemove', (e) => {
      const rect = portrait.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * 8; // Slightly less rotation for elegant portrait frame
      const rotateY = ((x - centerX) / centerX) * 8;
      
      portrait.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    portrait.addEventListener('mouseleave', () => {
      portrait.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
}

// 7. Share Dialog (QR Code Generation)
function initQRModal() {
  const showQrBtn = document.getElementById('btn-show-qr');
  const shareBtn = document.getElementById('share-card-btn');
  const modal = document.getElementById('qr-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const closeAction = document.getElementById('modal-close-action');
  const qrImage = document.getElementById('qr-code-image');

  if (!modal || !qrImage) return;

  const triggerModal = () => {
    let currentUrl = window.location.href;
    let cardUrl = '';

    // Calculate full path to card.html
    if (currentUrl.endsWith('index.html')) {
      cardUrl = currentUrl.replace('index.html', 'card.html');
    } else if (currentUrl.endsWith('/')) {
      cardUrl = currentUrl + 'card.html';
    } else if (currentUrl.includes('card.html')) {
      cardUrl = currentUrl;
    } else {
      const lastSlash = currentUrl.lastIndexOf('/');
      cardUrl = currentUrl.substring(0, lastSlash + 1) + 'card.html';
    }

    // Call QR API
    const qrServerUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(cardUrl)}`;
    qrImage.src = qrServerUrl;
    modal.showModal();
  };

  if (showQrBtn) showQrBtn.addEventListener('click', triggerModal);
  if (shareBtn) shareBtn.addEventListener('click', triggerModal);

  const hideModal = () => {
    modal.close();
  };

  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  if (closeAction) closeAction.addEventListener('click', hideModal);

  // Close when selecting backdrop
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInside = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!isInside) hideModal();
  });
}

// 8. Consultation Booking Form Handling (Saves to localStorage)
function initForms() {
  const consultationForm = document.getElementById('consultation-form');
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');

  if (!toast) return;

  const handleFormSubmit = (e, formElement, isCardPage = false) => {
    e.preventDefault();

    const nameInput = formElement.querySelector('#form-name');
    const phoneInput = formElement.querySelector('#form-phone');
    const emailInput = formElement.querySelector('#form-email'); // Only on landing page
    const serviceInput = formElement.querySelector('#form-service'); // Only on landing page
    const messageInput = formElement.querySelector('#form-message');
    const submitBtn = formElement.querySelector('#btn-submit');

    // Validation
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : 'N/A';
    const serviceVal = serviceInput ? serviceInput.options[serviceInput.selectedIndex].text : 'N/A';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    const validationMsg = getTranslation(isCardPage ? 'toast_validation' : 'toast_validation');
    const successMsg = getTranslation(isCardPage ? 'card_toast_success' : 'toast_success');

    if (!nameVal || !phoneVal || !messageVal || (!isCardPage && (!emailVal || !serviceInput.value))) {
      triggerToast(validationMsg, 'fa-solid fa-triangle-exclamation');
      return;
    }

    // Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      const textSpan = submitBtn.querySelector('.btn-submit-text');
      if (textSpan) textSpan.textContent = getTranslation(isCardPage ? 'card_btn_submitting' : 'btn_submit_loading');
      const icon = submitBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-spinner fa-spin';
    }

    // Simulate Network Delay (1.2s)
    setTimeout(() => {
      // Save data locally
      const inquiries = JSON.parse(localStorage.getItem('brandqueen_inquiries') || '[]');
      const newEntry = {
        id: 'bq_' + Date.now(),
        name: nameVal,
        phone: phoneVal,
        email: emailVal,
        service: serviceVal,
        message: messageVal,
        source: isCardPage ? 'digital_card' : 'landing_page',
        date: new Date().toISOString()
      };
      inquiries.unshift(newEntry);
      localStorage.setItem('brandqueen_inquiries', JSON.stringify(inquiries));

      // 串接傳送至 Google Sheets
      const sheetsUrl = GOOGLE_SHEETS_URL || localStorage.getItem('brandqueen_google_sheets_url');
      if (sheetsUrl) {
        fetch(sheetsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newEntry.name,
            phone: newEntry.phone,
            email: newEntry.email,
            service: newEntry.service,
            message: newEntry.message,
            source: newEntry.source === 'digital_card' ? '品牌女王數位名片' : '品牌女王官網首頁'
          })
        }).then(() => {
          console.log('預約資訊已同步寫入 Google Sheets！');
        }).catch(err => {
          console.error('寫入 Google Sheets 失敗：', err);
        });
      }

      console.log('--- iBrandQueen New Booking Inquiry ---', newEntry);

      // Reset submit button state
      if (submitBtn) {
        submitBtn.disabled = false;
        const textSpan = submitBtn.querySelector('.btn-submit-text');
        if (textSpan) textSpan.textContent = getTranslation(isCardPage ? 'card_btn_submit' : 'btn_submit_text');
        const icon = submitBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-paper-plane';
      }

      // Reset fields
      formElement.reset();
      triggerToast(successMsg, 'fa-solid fa-circle-check');
    }, 1200);
  };

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => handleFormSubmit(e, consultationForm, false));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, contactForm, true));
  }

  function triggerToast(message, iconClass) {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastText = toast.querySelector('.toast-message');
    
    if (toastIcon) toastIcon.className = `${iconClass} toast-icon`;
    if (toastText) toastText.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
}

// 9. Premium Preloader Control
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  // Hide preloader when page finishes loading (min display duration of 0.8s)
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 500);
  });

  // Fallback in case window load event doesn't fire or takes too long (timeout 1.5s)
  setTimeout(() => {
    if (!preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 1500);
}

// 10. Dynamic Typewriter Headline Switcher
let typewriterInterval = null;
function initTypewriter() {
  const typedTextSpan = document.getElementById('hero-typed-text');
  if (!typedTextSpan) return;

  const textArray = {
    zh: [
      "釋放商業影響力",
      "打造自媒體商業 IP",
      "倍增高端個人價值",
      "對接跨界商務資源"
    ],
    en: [
      "Amplify Commercial Influence",
      "Build Self-Media Business IP",
      "Amplify Premium Personal Value",
      "Connect Global Business Network"
    ]
  };

  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000; // Delay between texts
  let textArrayIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  // Clear any existing intervals/timeouts from language switching
  if (typewriterInterval) {
    clearTimeout(typewriterInterval);
  }

  function type() {
    const currentLangText = textArray[currentLang] || textArray['zh'];
    
    // Safety check if we switch languages and index is out of bounds
    if (!currentLangText[textArrayIndex]) {
      textArrayIndex = 0;
    }
    
    const currentString = currentLangText[textArrayIndex];

    if (!isErasing && charIndex < currentString.length) {
      // Typing
      typedTextSpan.textContent += currentString.charAt(charIndex);
      charIndex++;
      typewriterInterval = setTimeout(type, typingDelay);
    } else if (isErasing && charIndex > 0) {
      // Erasing
      typedTextSpan.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      typewriterInterval = setTimeout(type, erasingDelay);
    } else if (!isErasing && charIndex === currentString.length) {
      // Finished typing, pause before erasing
      isErasing = true;
      typewriterInterval = setTimeout(type, newTextDelay);
    } else if (isErasing && charIndex === 0) {
      // Finished erasing, move to next text
      isErasing = false;
      textArrayIndex = (textArrayIndex + 1) % currentLangText.length;
      typewriterInterval = setTimeout(type, typingDelay + 500);
    }
  }

  // Start typewriter
  typedTextSpan.textContent = "";
  type();
}

// 11. Intersection Observer Scroll Reveal Animation
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px" // trigger slightly before entering
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}
