'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const DICTIONARY: Translations = {
  chamber_name: {
    en: 'Agrawal Chamber of Commerce & Industries',
    hi: 'अग्रवाल चैम्बर ऑफ कॉमर्स एंड इंडस्ट्रीज',
  },
  chamber_city: {
    en: 'Jabalpur, Madhya Pradesh',
    hi: 'जबलपुर, मध्य प्रदेश',
  },
  nav_home: { en: 'Home', hi: 'मुख्य पृष्ठ' },
  nav_about: { en: 'About ACCI', hi: 'परिचय' },
  nav_committee: { en: 'Committee', hi: 'समिति' },
  nav_directory: { en: 'Business Directory', hi: 'व्यापार निर्देशिका' },
  nav_events: { en: 'Events & Conclaves', hi: 'कार्यक्रम व सम्मेलन' },
  nav_jobs: { en: 'Opportunities', hi: 'रोजगार व रिक्तियां' },
  nav_news: { en: 'Circulars & News', hi: 'परिपत्र व समाचार' },
  nav_membership: { en: 'Membership', hi: 'सदस्यता' },
  nav_contact: { en: 'Contact', hi: 'संपर्क' },
  btn_join: { en: 'Become a Member', hi: 'सदस्य बनें' },
  btn_list_biz: { en: '+ List Your Business', hi: '+ व्यापार पंजीकृत करें' },
  btn_login: { en: 'Member Portal', hi: 'सदस्य लॉगिन' },
  btn_admin: { en: 'Chamber Admin', hi: 'प्रशासन' },
  hero_eyebrow: {
    en: "Jabalpur's Premier Agrawal Business Network",
    hi: 'जबलपुर का सबसे प्रतिष्ठित व वृहद अग्रवाल व्यापार परिसंघ',
  },
  hero_title_1: {
    en: 'Catalyzing Commerce,',
    hi: 'उद्योग व व्यापार का सशक्तिकरण,',
  },
  hero_title_2: {
    en: 'Preserving Heritage,',
    hi: 'अग्रवाल परंपरा व मूल्यों का संरक्षण,',
  },
  hero_title_3: {
    en: 'Uniting Enterprise.',
    hi: 'सामूहिक विकास का संकल्प।',
  },
  hero_desc: {
    en: 'Over two decades of fostering high-trust commercial partnerships, MSME leadership, and community welfare across Jabalpur and Central India.',
    hi: 'दो दशकों से जबलपुर व महाकोशल में विश्वसनीय व्यापारिक नेटवर्किंग, एमएसएमई विकास और सामुदायिक कल्याण की अग्रदूत संस्था।',
  },
  search_placeholder: {
    en: 'Search 70+ industries, businesses, doctors, CAs, manufacturers…',
    hi: '70+ उद्योगों, व्यापारियों, डॉक्टरों, सीए, विनिर्माताओं में खोजें…',
  },
  stat_businesses: { en: 'Verified Member Enterprises', hi: 'सत्यापित व्यापारिक प्रतिष्ठान' },
  stat_industries: { en: 'Industry Sectors Represented', hi: 'सक्रिय औद्योगिक क्षेत्र' },
  stat_employment: { en: 'Community Employment Linked', hi: 'समुदाय से जुड़े रोजगार' },
  stat_legacy: { en: 'Decades of Institutional Trust', hi: 'दशकों का अटूट विश्वास' },
};

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (l: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  setLang: () => {},
  t: (key, fallback) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('acci_lang') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('acci_lang', newLang);
    document.documentElement.lang = newLang;
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const t = (key: string, fallback?: string): string => {
    if (DICTIONARY[key] && DICTIONARY[key][lang]) {
      return DICTIONARY[key][lang];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
