'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (l: Language) => void;
  t: (keyOrPhrase: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  setLang: () => {},
  t: (keyOrPhrase, fallback) => fallback || keyOrPhrase,
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE BILINGUAL DICTIONARY
// ─────────────────────────────────────────────────────────────────────────────
const MASTER_DICTIONARY: Record<string, string> = {
  // Brand & Institution
  'chamber_name': 'अग्रवाल चैम्बर ऑफ कॉमर्स एंड इंडस्ट्रीज',
  'Agrawal Chamber of Commerce & Industries': 'अग्रवाल चैम्बर ऑफ कॉमर्स एंड इंडस्ट्रीज',
  'Agrawal Chambers of Commerce and Industries': 'अग्रवाल चैम्बर ऑफ कॉमर्स एंड इंडस्ट्रीज',
  'Agrawal Chamber of Commerce & Industries • Jabalpur': 'अग्रवाल चैम्बर ऑफ कॉमर्स एंड इंडस्ट्रीज • जबलपुर',
  'chamber_city': 'जबलपुर, मध्य प्रदेश',
  'Jabalpur, Madhya Pradesh': 'जबलपुर, मध्य प्रदेश',
  'Jabalpur (M.P.)': 'जबलपुर (म.प्र.)',
  'ACCI • Jabalpur': 'एसीसीआई • जबलपुर',
  'ACCI Jabalpur': 'एसीसीआई जबलपुर',
  'Apex Agrawal Trade Body • Jabalpur': 'शीर्ष अग्रवाल व्यापार परिसंघ • जबलपुर',

  // Navigation Links & Buttons
  'nav_home': 'मुख्य पृष्ठ',
  'Home': 'मुख्य पृष्ठ',
  'nav_about': 'परिचय',
  'About ACCI': 'परिचय',
  'nav_committee': 'समिति',
  'Committee': 'समिति',
  'Executive Committee': 'कार्यकारिणी समिति',
  'nav_directory': 'व्यापार निर्देशिका',
  'Business Directory': 'व्यापार निर्देशिका',
  'Directory': 'निर्देशिका',
  'nav_events': 'कार्यक्रम व सम्मेलन',
  'Events & Conclaves': 'कार्यक्रम व सम्मेलन',
  'Events': 'कार्यक्रम',
  'Conclaves & Seminars': 'सम्मेलन व कार्यशालाएं',
  'nav_gallery': 'गैलरी',
  'Gallery': 'गैलरी',
  'Event Photo Archives': 'कार्यक्रम फोटो अभिलेखागार',
  'nav_jobs': 'रोजगार व रिक्तियां',
  'Opportunities': 'रोजगार व अवसर',
  'Employment Board': 'रोजगार मंच',
  'nav_news': 'चैम्बर समाचार',
  'Circulars & News': 'परिपत्र व समाचार',
  'Chamber News': 'चैम्बर समाचार',
  'nav_membership': 'सदस्यता',
  'Membership': 'सदस्यता',
  'nav_contact': 'संपर्क',
  'Contact': 'संपर्क',
  'Contact Us': 'हमसे संपर्क करें',
  'Contact us at': 'हमसे संपर्क करें',
  'Help Desk': 'सहायता केंद्र',
  'btn_join': 'सदस्य बनें',
  'Become a Member': 'सदस्य बनें',
  'Become a member': 'सदस्य बनें',
  'btn_list_biz': '+ व्यापार पंजीकृत करें',
  '+ List Your Business': '+ व्यापार पंजीकृत करें',
  'btn_login': 'सदस्य पोर्टल',
  'Member Portal': 'सदस्य पोर्टल',
  'Member Login': 'सदस्य लॉगिन',
  'btn_admin': 'प्रशासन',
  'Admin Panel': 'प्रशासन पैनल',
  'Chamber Admin': 'चैम्बर प्रशासन',
  'Chamber Admin Access': 'चैम्बर प्रशासन लॉगिन',
  'Logout': 'लॉगआउट',
  'Login': 'लॉगिन',
  'Sign In': 'साइन इन करें',
  'New Business Listing': 'नया व्यापार पंजीकरण',
  'Listing Management': 'सूचीबद्धता प्रबंधन',
  'Constitution & Bylaws': 'संविधान व उपनियम',
  'Privacy Policy': 'गोपनीयता नीति',
  'Terms & Conditions': 'नियम व शर्तें',
  'All rights reserved.': 'सर्वाधिकार सुरक्षित।',
  'All rights reserved': 'सर्वाधिकार सुरक्षित',
  'Powered by Appwrite Backend': 'ऐपराइट बैकएंड द्वारा संचालित',

  // Hero Section & Headlines
  'hero_eyebrow': 'जबलपुर का सबसे प्रतिष्ठित व वृहद अग्रवाल व्यापार परिसंघ',
  "Jabalpur's Premier Agrawal Business Network": 'जबलपुर का सबसे प्रतिष्ठित व वृहद अग्रवाल व्यापार परिसंघ',
  "Jabalpur's Largest": 'जबलपुर का सबसे बड़ा',
  'Agrawal Business Network': 'अग्रवाल व्यापार नेटवर्क',
  'Find trusted businesses, services & professionals from the Agrawal community in Jabalpur.': 'जबलपुर में अग्रवाल समुदाय के विश्वसनीय व्यवसाय, सेवाएँ और पेशेवर खोजें।',
  'Find trusted businesses, services & professionals from the Agrawal community in Jabalpur': 'जबलपुर में अग्रवाल समुदाय के विश्वसनीय व्यवसाय, सेवाएँ और पेशेवर खोजें',
  'Search businesses, jewellers, steel, CAs…': 'व्यवसाय, सराफा, लोहा-इस्पात, सीए खोजें…',
  'search_placeholder': '70+ उद्योगों, व्यापारियों, डॉक्टरों, सीए, विनिर्माताओं में खोजें…',
  'Search 70+ industries, businesses, doctors, CAs, manufacturers…': '70+ उद्योगों, व्यापारियों, डॉक्टरों, सीए, विनिर्माताओं में खोजें…',
  'All Categories': 'सभी श्रेणियां',
  'All Industries': 'सभी उद्योग',
  'Search': 'खोजें',
  'Search…': 'खोजें…',
  'Quick Search': 'त्वरित खोज',

  // Statistics
  'stat_businesses': 'सत्यापित व्यापारिक प्रतिष्ठान',
  'Verified Member Enterprises': 'सत्यापित सदस्य प्रतिष्ठान',
  'stat_industries': 'सक्रिय औद्योगिक क्षेत्र',
  'Industry Sectors Represented': 'सक्रिय औद्योगिक क्षेत्र',
  'stat_employment': 'समुदाय से जुड़े रोजगार',
  'Community Employment Linked': 'समुदाय से जुड़े रोजगार',
  'stat_legacy': 'दशकों का अटूट विश्वास',
  'Decades of Institutional Trust': 'दशकों का संस्थागत विश्वास',

  // Homepage Sections
  'Explore by Category & Industry': 'श्रेणी व उद्योग अनुसार खोजें',
  'Browse verified Agrawal commercial establishments by core activity or specific industrial domain.': 'अग्रवाल व्यापारिक प्रतिष्ठानों को उनकी मुख्य व्यावसायिक श्रेणी अथवा विशिष्ट उद्योग अनुसार खोजें।',
  'Featured Member Enterprises': 'प्रमुख सदस्य प्रतिष्ठान',
  'Discover reputable Agrawal manufacturers, wholesale merchants, retailers, and service firms in Jabalpur.': 'जबलपुर के प्रतिष्ठित अग्रवाल विनिर्माता, थोक व्यापारी, खुदरा विक्रेता और सेवा प्रदाता।',
  'View All Enterprises': 'सभी प्रतिष्ठान देखें',
  'View All': 'सभी देखें',
  'Verified': 'सत्यापित',
  'Concluded Events & Gallery': 'संपन्न कार्यक्रमों की फोटो गैलरी',
  'Visual archives and photographic memories from concluded chamber events, business conclaves, and community gatherings.': 'चैम्बर द्वारा आयोजित व्यापार सम्मेलनों, बैठकों व सामाजिक कार्यक्रमों के छायाचित्र एवं स्मृतियां।',
  'View Pictures': 'तस्वीरें देखें',
  'View Photos': 'तस्वीरें देखें',
  'Photos': 'तस्वीरें',
  'Community Employment & Opportunities': 'सामुदायिक रोजगार व अवसर',
  'Connecting qualified Agrawal talent with premier member enterprises and industrial houses across Jabalpur.': 'जबलपुर के प्रतिष्ठित व्यापारिक प्रतिष्ठानों व औद्योगिक घरानों से योग्य युवाओं को जोड़ने का मंच।',
  'Post a Vacancy': 'रिक्ति पोस्ट करें',
  'Browse All Opportunities': 'सभी अवसर देखें',
  'Are you an Agrawal business owner in Jabalpur?': 'क्या आप जबलपुर में अग्रवाल व्यवसायी हैं?',
  "Get verified, access commercial networks, and list your enterprise on Jabalpur's largest Agrawal community commerce portal.": "जबलपुर के सबसे बड़े अग्रवाल व्यापार पोर्टल पर अपने प्रतिष्ठान को पंजीकृत व सत्यापित करवाएं।",
  'The apex institution fostering business collaboration, ethical enterprise, and collective welfare for the Agrawal community in Jabalpur and Mahakoshal.': 'जबलपुर व महाकोशल में अग्रवाल समाज के व्यावसायिक सहयोग, नैतिक व्यापार और सामूहिक कल्याण की शीर्ष संस्था।',

  // Directory Page
  'Commercial Enterprise Directory': 'व्यापारिक प्रतिष्ठान निर्देशिका',
  'Verified Agrawal Businesses, Services & Industrial Units in Jabalpur & Mahakoshal Region': 'जबलपुर व महाकोशल के सत्यापित अग्रवाल व्यवसाय, सेवाएँ एवं औद्योगिक इकाइयाँ',
  'Search businesses by name, sector, owner or keyword...': 'व्यवसाय का नाम, क्षेत्र, संचालक अथवा कीवर्ड से खोजें...',
  'Filter by Category': 'श्रेणी अनुसार फिल्टर',
  'Filter by Industry': 'उद्योग अनुसार फिल्टर',
  'Verified Members Only': 'केवल सत्यापित सदस्य',
  'Reset Filters': 'फिल्टर हटाएं',
  'Clear Filters': 'फिल्टर हटाएं',
  'Showing': 'प्रदर्शित',
  'enterprises matching your criteria': 'प्रतिष्ठान आपके मानदंड अनुसार मिले',
  'No businesses found': 'कोई प्रतिष्ठान नहीं मिला',
  'Try adjusting your search keywords or filter criteria.': 'कृपया अपने खोज शब्द या फिल्टर बदलकर पुनः प्रयास करें।',
  'View Enterprise Profile': 'प्रतिष्ठान प्रोफाइल देखें',
  'View Details': 'विवरण देखें',
  'Connect on WhatsApp': 'व्हाट्सएप पर संपर्क करें',
  'Call Now': 'कॉल करें',
  'Visit Website': 'वेबसाइट देखें',
  'Get Directions': 'दिशा-निर्देश देखें',
  'Directions': 'रास्ता देखें',
  'Established': 'स्थापना वर्ष',
  'Turnover': 'वार्षिक टर्नओवर',
  'Annual Turnover': 'वार्षिक टर्नओवर',
  'Employees': 'कर्मचारी',
  'Team Size': 'टीम आकार',
  'GSTIN': 'जीएसटी नंबर',
  'Key Offerings & Products': 'प्रमुख उत्पाद व सेवाएँ',
  'Products & Services': 'उत्पाद एवं सेवाएँ',
  'About Enterprise': 'प्रतिष्ठान के बारे में',
  'Contact Person': 'संपर्क व्यक्ति',
  'Designation': 'पद',
  'Operating Hours': 'कार्य समय',
  'Business Hours': 'व्यापार समय',
  'Customer Reviews': 'ग्राहकों की समीक्षाएं',
  'Write a Review': 'समीक्षा लिखें',
  'Rate this Business': 'रेटिंग दें',
  'Your Name': 'आपका नाम',
  'Your Rating': 'आपकी रेटिंग',
  'Your Review / Feedback': 'आपकी समीक्षा / विचार',
  'Submit Review': 'समीक्षा सबमिट करें',
  'Review submitted successfully!': 'समीक्षा सफलतापूर्वक दर्ज की गई!',
  'Share Profile': 'प्रोफाइल साझा करें',
  'Share': 'साझा करें',
  'Close': 'बंद करें',
  'Reviews': 'समीक्षाएं',

  // Committee Page
  'Institutional Leadership': 'संस्थागत नेतृत्व',
  'Governing Council & Executive Committee': 'शासी परिषद व प्रबंध कार्यकारिणी',
  'Meet the esteemed office bearers, industrial captains, and professional advisors stewarding the Agrawal Chamber of Commerce & Industries (ACCI) Jabalpur.': 'अग्रवाल चैम्बर ऑफ कॉमर्स एंड इंडस्ट्रीज (एसीसीआई) जबलपुर का कुशल मार्गदर्शन करने वाले सम्मानीय पदाधिकारी, औद्योगिक प्रतिनिधि एवं सलाहकार।',
  'Principal Office Bearers': 'प्रमुख पदाधिकारी',
  'Governance': 'प्रशासन',
  'Guiding chamber representations, policy formulation, and commercial initiatives.': 'चैम्बर के नीति निर्धारण, प्रशासनिक प्रतिनिधित्व एवं व्यापारिक पहलों का संचालन।',
  'Executive Committee & Chapter Leads': 'कार्यकारिणी समिति व प्रकोष्ठ प्रभारी',
  'Active industry leaders driving sectoral committees, dispute redressal, youth trade forums, and women entrepreneurship initiatives.': 'विभिन्न औद्योगिक प्रकोष्ठों, युवा मंच, महिला उद्यमिता एवं व्यापारिक संवर्धन का नेतृत्व करने वाले कार्यकारिणी सदस्य।',
  'President': 'अध्यक्ष',
  'Senior Vice President': 'वरिष्ठ उपाध्यक्ष',
  'Vice President': 'उपाध्यक्ष',
  'General Secretary': 'महासचिव',
  'Joint Secretary': 'संयुक्त सचिव',
  'Treasurer': 'कोषाध्यक्ष',
  'Patron': 'संरक्षक',
  'Chief Advisor': 'मुख्य सलाहकार',
  'Executive Member': 'कार्यकारिणी सदस्य',
  'Past President': 'पूर्व अध्यक्ष',

  // Events Page
  'Chamber Assemblies & Summits': 'चैम्बर सम्मेलन व अधिवेशन',
  'Events & Community Conclaves': 'कार्यक्रम व सम्मेलन',
  'Check upcoming events, business meets, and community conclaves organized by ACCI Jabalpur.': 'एसीसीआई जबलपुर द्वारा आयोजित आगामी कार्यक्रमों, व्यापारिक बैठकों व सम्मेलनों की जानकारी।',
  'Upcoming Events': 'आगामी कार्यक्रम',
  'Past Conclaves & Seminars': 'पूर्व सम्मेलन व कार्यशालाएं',
  'Loading events calendar…': 'कार्यक्रम कैलेंडर लोड हो रहा है…',
  'No events scheduled at the moment. Check back soon!': 'फिलहाल कोई आगामी कार्यक्रम निर्धारित नहीं है। शीघ्र पुनः देखें!',
  'Date': 'तिथि',
  'Time': 'समय',
  'Venue': 'स्थान',
  'Organizer': 'आयोजक',
  'Register for Event': 'कार्यक्रम पंजीकरण',
  'Read More': 'अधिक पढ़ें',

  // Gallery Page
  'Chamber Archives & Memories': 'चैम्बर अभिलेखागार व स्मृतियां',
  'Explore photo records, visual archives, and key memories from conclaves, trade expos, and community gatherings organized by ACCI Jabalpur.': 'एसीसीआई जबलपुर द्वारा आयोजित सम्मेलनों, व्यापार मेलों व बैठकों के छायाचित्र एवं स्मृतियां।',
  'Loading concluded events gallery…': 'फोटो गैलरी लोड हो रही है…',
  'No Event Archives Yet': 'फिलहाल कोई फोटो संग्रह उपलब्ध नहीं है',
  'Concluded events and photographs will be published here by the secretariat.': 'सचिवालय द्वारा संपन्न कार्यक्रमों के छायाचित्र यहां प्रकाशित किए जाएंगे।',
  'Event Photographs': 'कार्यक्रम के छायाचित्र',
  'Click on any photo to view full size': 'बड़ा देखने के लिए किसी भी फोटो पर क्लिक करें',
  'Close Gallery': 'गैलरी बंद करें',
  'Photo': 'फोटो',
  'of': 'का',
  'Previous': 'पिछला',
  'Next': 'अगला',

  // Jobs Page
  'Talent Portal': 'प्रतिभा मंच',
  'Connecting qualified community professionals, graduates, and skilled personnel with member manufacturing units, trading firms, and offices across Jabalpur.': 'जबलपुर के विनिर्माण इकाइयों, व्यापारिक प्रतिष्ठानों एवं कार्यालयों से योग्य युवाओं और पेशेवरों को जोड़ने का मंच।',
  'Search by role, company or skills…': 'पद, कंपनी अथवा योग्यता अनुसार खोजें…',
  'Filter by Sector': 'क्षेत्र अनुसार फिल्टर',
  'All Roles & Sectors': 'सभी पद व क्षेत्र',
  'Loading opportunities…': 'रोजगार अवसर लोड हो रहे हैं…',
  'No Vacancies Found': 'कोई रिक्ति नहीं मिली',
  'Try adjusting your search criteria or sector filter.': 'कृपया अपने खोज शब्द अथवा फिल्टर बदलकर देखें।',
  'Post New Job Vacancy': 'नई नौकरी रिक्ति पोस्ट करें',
  'Job Title': 'पद का नाम',
  'Company / Enterprise Name': 'कंपनी / प्रतिष्ठान का नाम',
  'Category / Department': 'विभाग / श्रेणी',
  'Job Type': 'नौकरी का प्रकार',
  'Urgency Status': 'प्राथमिकता',
  'Monthly Salary / Package': 'मासिक वेतन / पैकेज',
  'Location': 'स्थान',
  'Job Description & Responsibilities': 'कार्य विवरण व जिम्मेदारियां',
  'Required Skills & Qualifications': 'आवश्यक योग्यता व कौशल',
  'Contact Email': 'संपर्क ईमेल',
  'Contact WhatsApp Number': 'संपर्क व्हाट्सएप नंबर',
  'Publish Vacancy': 'रिक्ति प्रकाशित करें',
  'Submitting...': 'जमा हो रहा है...',
  'Vacancy Posted Successfully!': 'रिक्ति सफलतापूर्वक पोस्ट की गई!',
  'Full-Time': 'पूर्णकालिक',
  'Part-Time': 'अंशकालिक',
  'Urgent Hiring': 'तत्काल आवश्यकता',
  'Apply Now': 'आवेदन करें',
  'Apply via Email / Phone': 'ईमेल / फोन द्वारा आवेदन करें',
  'Salary': 'वेतन',

  // Contact Page
  'Contact ACCI': 'एसीसीआई से संपर्क करें',
  'Reach out to the Agrawal Chamber of Commerce & Industries (ACCI) Jabalpur for membership verification, Events or commercial and non commercial partnerships.': 'सदस्यता सत्यापन, कार्यक्रमों अथवा व्यापारिक व गैर-व्यापारिक सहयोग हेतु एसीसीआई जबलपुर से संपर्क करें।',
  'Telephone & WhatsApp': 'दूरभाष व व्हाट्सएप',
  'Monday to Saturday (10:00 AM – 06:30 PM)': 'सोमवार से शनिवार (प्रातः 10:00 से सायं 06:30)',
  'Email': 'ईमेल',
  'Send us a message': 'हमें संदेश भेजें',
  'All submissions are delivered directly to the Chamber administrative office.': 'सभी संदेश सीधे चैम्बर सचिवालय कार्यालय को प्रेषित किए जाते हैं।',
  'Message Received': 'संदेश प्राप्त हुआ',
  'Thank you! The ACCI Secretariat will review your inquiry and get back to you shortly.': 'धन्यवाद! एसीसीआई सचिवालय आपके संदेश की समीक्षा कर शीघ्र संपर्क करेगा।',
  'Send Another Message': 'दूसरा संदेश भेजें',
  'Your Full Name *': 'आपका पूरा नाम *',
  'Mobile / WhatsApp Number *': 'मोबाइल / व्हाट्सएप नंबर *',
  'Email Address *': 'ईमेल पता *',
  'Inquiry Subject': 'विषय',
  'Your Message / Query *': 'आपका संदेश / प्रश्न *',
  'Your Message': 'आपका संदेश',
  'Submit': 'सबमिट करें',
  'Sending...': 'भेजा जा रहा है...',

  // Membership & Registration
  'Enterprise Listing & Membership': 'प्रतिष्ठान पंजीकरण व सदस्यता',
  "Join Jabalpur's Largest Agrawal Commerce Portal": 'जबलपुर के सबसे बड़े अग्रवाल व्यापार पोर्टल से जुड़ें',
  'List your manufacturing plant, trading agency, retail showroom, or professional practice to get verified and gain community visibility.': 'अपने उद्योग, एजेंसी, शोरूम या व्यावसायिक सेवा को सूचीबद्ध करें और समुदाय में विश्वसनीयता व पहचान प्राप्त करें।',
  'Listing Form': 'पंजीकरण फॉर्म',
  'Completely Free Community Initiative': 'निःशुल्क सामुदायिक सेवा',
  'Business / Firm Name *': 'व्यापार / फर्म का नाम *',
  'Legal Entity Name': 'पंजीकृत विधिक नाम',
  'Proprietor / Managing Partner Name *': 'स्वामी / संचालक का नाम *',
  'Primary Category *': 'मुख्य श्रेणी *',
  'Industry Sector *': 'उद्योग क्षेत्र *',
  'Short Business Description *': 'संक्षिप्त व्यापार परिचय *',
  'Detailed Profile & Capabilities': 'विस्तृत विवरण व क्षमताएं',
  'Business Tagline / Motto': 'व्यापार का आदर्श वाक्य (टैगलाइन)',
  'Office / Shop Address *': 'कार्यालय / दुकान का पता *',
  'City': 'शहर',
  'PIN Code *': 'पिन कोड *',
  'Operating / Store Timings': 'प्रतिष्ठान खुलने का समय',
  'GSTIN (Optional)': 'जीएसटी नंबर (वैकल्पिक)',
  'Year of Establishment': 'स्थापना वर्ष',
  'Approx. Number of Employees': 'कर्मचारियों की अनुमानित संख्या',
  'Key Services Offered': 'प्रमुख सेवाएँ',
  'Key Products Manufactured / Sold': 'प्रमुख उत्पाद',
  'Enterprise Display Banner URL': 'प्रतिष्ठान बैनर इमेज यूआरएल',
  'Declaration & Consent': 'घोषणा व सहमति',
  'I solemnly affirm that the enterprise listed belongs to a member of the Agrawal community and all information provided is accurate and authentic.': 'मैं सत्यनिष्ठा से प्रमाणित करता हूँ कि यह प्रतिष्ठान अग्रवाल समुदाय के सदस्य का है और दी गई समस्त जानकारी पूर्णतः सत्य व प्रामाणिक है।',
  'Submit Application': 'आवेदन जमा करें',
  'Application Submitted Successfully!': 'आवेदन सफलतापूर्वक जमा हुआ!',
  'Your enterprise listing has been received by the ACCI Secretariat. After verification, your profile will be activated on the portal.': 'आपका आवेदन एसीसीआई सचिवालय को प्राप्त हो गया है। सत्यापन के पश्चात आपका प्रतिष्ठान पोर्टल पर सक्रिय हो जाएगा।',

  // Dashboard Page
  'Member Enterprise Dashboard': 'सदस्य प्रतिष्ठान डैशबोर्ड',
  'Manage your commercial enterprise profile, view inquiries, update banner, and review ratings.': 'अपने व्यापारिक प्रोफाइल का प्रबंधन करें, बैनर अपडेट करें और समीक्षाएं देखें।',
  'Enterprise Display Banner': 'प्रतिष्ठान डिस्प्ले बैनर',
  'Manage the wide showcase banner displayed on your public directory listing card and profile header.': 'अपनी निर्देशिका लिस्टिंग और प्रोफाइल पर दिखने वाले बैनर का प्रबंधन करें।',
  'Upload New Banner': 'नया बैनर अपलोड करें',
  'Upload Image File': 'इमेज फाइल अपलोड करें',
  'Or Enter Direct Image URL': 'अथवा इमेज यूआरएल दर्ज करें',
  'Save Banner': 'बैनर सहेजें',
  'Saving...': 'सहेजा जा रहा है...',
  'Reset to Default Industry Banner': 'डिफ़ॉल्ट उद्योग बैनर पर रीसेट करें',
  'Banner updated successfully!': 'बैनर सफलतापूर्वक अपडेट किया गया!',
  'Banner reset to default industry background.': 'बैनर डिफ़ॉल्ट उद्योग छवि पर रीसेट हो गया।',
  'Edit Profile': 'प्रोफाइल संपादित करें',
  'Current Status': 'वर्तमान स्थिति',
  'Total Views': 'कुल अवलोकन',
  'Inquiries Received': 'प्राप्त पूछताछ',
  'Average Rating': 'औसत रेटिंग',
  'Active Members': 'सक्रिय सदस्य',
  'Total Registered Enterprises': 'कुल पंजीकृत प्रतिष्ठान',

  // Login & Admin
  'Secretariat & Administrative Login': 'सचिवालय एवं प्रशासनिक लॉगिन',
  'Access executive records, approve directory listings, and manage chamber circulars.': 'प्रशासनिक रिकॉर्ड, नई सदस्य सूचियों का अनुमोदन एवं चैम्बर समाचार प्रबंधन।',
  'Chamber Admin Portal': 'चैम्बर प्रशासन पोर्टल',
  'Email Address': 'ईमेल पता',
  'Password': 'पासवर्ड',
  'Sign In to Secretariat': 'सचिवालय में साइन इन करें',
  'Quick Demo Admin Sign-In': 'त्वरित डेमो एडमिन लॉगिन',
  'Pending Approvals': 'लंबित अनुमोदन',
  'Active Member Directory': 'सक्रिय सदस्य निर्देशिका',
  'Approve': 'अनुमोदित करें',
  'Reject': 'अस्वीकार करें',
  'Delete': 'हटाएं',
  'Edit': 'संपादित करें',
  'Update': 'अद्यतन करें',
  'Manage Chamber News': 'चैम्बर समाचार प्रबंधन',
  'Add News Item': 'समाचार जोड़ें',
  'News Title': 'समाचार शीर्षक',
  'Publish Date': 'प्रकाशन तिथि',
  'Save Changes': 'परिवर्तन सहेजें',

  // Categories
  'Manufacturing': 'विनिर्माण',
  'Wholesale': 'थोक व्यापार',
  'Retail': 'खुदरा व्यापार',
  'Professional': 'पेशेवर सेवाएँ',
  'Service Provider': 'सेवा प्रदाता',
  'Distribution': 'वितरण एवं लॉजिस्टिक्स',
  'Import / Export': 'आयात / निर्यात',
  'Heavy industry, FMCG, packaging & fabrication': 'भारी उद्योग, एफएमसीजी, पैकेजिंग व फैब्रिकेशन',
  'B2B bulk trading, agricultural commodities & commodities': 'थोक व्यापार, कृषि जिंस व कमोडिटी',
  'Showrooms, jewellery, fashion, electronics & supermarkets': 'शोरूम, सराफा, परिधान, इलेक्ट्रॉनिक्स व सुपरमार्केट',
  'Chartered Accountants, legal advocates, tax & architects': 'चार्टर्ड एकाउंटेंट, विधि सलाहकार, टैक्स व वास्तुविद',
  'Healthcare, hospitals, IT, logistics, hospitality': 'स्वास्थ्य सेवा, अस्पताल, आईटी, लॉजिस्टिक्स व आतिथ्य',
  'Supply chain networks, FMCG distribution & dealerships': 'सप्लाई चेन, एफएमसीजी वितरण व डीलरशिप',
  'Cross-border trade, agri-exports & raw materials': 'अंतरराष्ट्रीय व्यापार, कृषि निर्यात व कच्चा माल',

  // Industries
  'Food Processing & FMCG': 'खाद्य प्रसंस्करण व एफएमसीजी',
  'Textile & Garments': 'वस्त्र व परिधान',
  'Jewellery & Precious Metals': 'आभूषण व बहुमूल्य धातु',
  'Agricultural Commodities': 'कृषि उपज व जिंस',
  'Hospitals & Healthcare': 'अस्पताल व स्वास्थ्य सेवा',
  'Hotels & Hospitality': 'होटल व आतिथ्य',
  'Transporters & Logistics': 'परिवहन व लॉजिस्टिक्स',
  'Chartered Accountants & Audit': 'चार्टर्ड एकाउंटेंट्स व ऑडिट',
  'Software Development & IT': 'सॉफ्टवेयर विकास व आईटी',
  'Advocates & Law Firms': 'अधिवक्ता व विधि फर्म',
  'Real Estate & Infrastructure': 'रियल एस्टेट व अवसंरचना',
  'Automobile Dealers & Parts': 'ऑटोमोबाइल व पुर्जे',
  'Steel & Hardware Trading': 'लोहा, इस्पात व हार्डवेयर',
  'Coaching & Higher Education': 'कोचिंग व उच्च शिक्षा',
  'Event Management & Media': 'इवेंट प्रबंधन व मीडिया',
  'Electronics & Home Appliances': 'इलेक्ट्रॉनिक्स व घरेलू उपकरण',

  // Additional Site UI Phrases & Labels
  'Search Directory': 'निर्देशिका में खोजें',
  'Search Full Directory': 'पूरी निर्देशिका में खोजें',
  'View Full Directory': 'पूरी निर्देशिका देखें',
  'Explore Verified Directory': 'सत्यापित निर्देशिका देखें',
  'Explore All Categories & Industries in Directory': 'निर्देशिका में सभी श्रेणियां व उद्योग देखें',
  'Explore All Photo Albums in Gallery': 'गैलरी में सभी फोटो एल्बम देखें',
  'View All Events Gallery': 'सभी कार्यक्रमों की गैलरी देखें',
  'View All Openings': 'सभी रिक्तियां देखें',
  'Back to Job Exchange': 'रोजगार मंच पर वापस',
  'Become a Member Now — Free': 'अभी सदस्य बनें — निःशुल्क',
  'List Your Business — Free': 'अपना व्यापार पंजीकृत करें — निःशुल्क',
  'Approve genuine customer reviews before they appear on public business cards.': 'सार्वजनिक व्यावसायिक कार्ड पर प्रदर्शित होने से पूर्व प्रामाणिक समीक्षाओं को स्वीकृत करें।',
  'Manage active employment vacancies across member firms.': 'सदस्य प्रतिष्ठानों की सक्रिय नौकरियों का प्रबंधन करें।',
  'Messages received from the contact page and partnership requests.': 'संपर्क पृष्ठ से प्राप्त संदेश एवं साझेदारी अनुरोध।',
  'Publish conclaves, symposiums, and delegate passes.': 'सम्मेलन, संगोष्ठियां एवं प्रतिनिधि पास प्रकाशित करें।',
  'Publish taxation advisories, gazettes, and press releases.': 'कराधान परामर्श, राजपत्र एवं प्रेस विज्ञप्तियां प्रकाशित करें।',
  'No approved reviews yet. Be the first to review!': 'अभी तक कोई समीक्षा स्वीकृत नहीं हुई है। पहली समीक्षा आप लिखें!',
  'No circulars published at the moment.': 'फिलहाल कोई परिपत्र प्रकाशित नहीं है।',
  'No inquiries received yet.': 'फिलहाल कोई पूछताछ प्राप्त नहीं हुई है।',
  'No vacancies matching this category.': 'इस श्रेणी में कोई रिक्तियां नहीं मिलीं।',
  'Checking Chamber Credentials…': 'चैम्बर प्रमाण-पत्रों की जांच जारी है…',
  'Loading Chamber Directory…': 'चैम्बर निर्देशिका लोड हो रही है…',
  'Loading Member Portal…': 'सदस्य पोर्टल लोड हो रहा है…',
  'Loading circulars…': 'परिपत्र लोड हो रहे हैं…',
  'Loading vacancies…': 'रिक्तियां लोड हो रही हैं…',
  'Loading verified businesses…': 'सत्यापित प्रतिष्ठान लोड हो रहे हैं…',
  'Redirecting to Committee & Leadership…': 'समिति व नेतृत्व पृष्ठ पर भेजा जा रहा है…',
  'Refresh Data': 'डेटा रीफ्रेश करें',
  'Quick Login as Chamber Admin (Demo)': 'चैम्बर एडमिन के रूप में त्वरित लॉगिन (डेमो)',
  'Read Circular': 'परिपत्र पढ़ें',
  'Reset to Industry Image': 'उद्योग छवि पर रीसेट करें',
  'Upload Banner File': 'बैनर फाइल अपलोड करें',
  'View Public Card in Directory': 'निर्देशिका में सार्वजनिक कार्ड देखें',
  'WhatsApp Inquiry': 'व्हाट्सएप पूछताछ',
  'WhatsApp Number': 'व्हाट्सएप नंबर',
  'Apply via WhatsApp': 'व्हाट्सएप द्वारा आवेदन करें',
  'Call Business': 'प्रतिष्ठान को कॉल करें',
  'Call': 'कॉल करें',
  'Business Name': 'व्यवसाय का नाम',
  'Company Name *': 'कंपनी का नाम *',
  'Full Name': 'पूरा नाम',
  'Full Content *': 'संपूर्ण सामग्री *',
  'Short Excerpt *': 'संक्षिप्त सारांश *',
  'Role Description *': 'पद का विवरण *',
  'Cover Image URL *': 'कवर इमेज यूआरएल *',
  'Date *': 'तिथि *',
  'Title *': 'शीर्षक *',
  'Location *': 'स्थान *',
  'Password *': 'पासवर्ड *',
  'Mobile Phone *': 'मोबाइल नंबर *',
  'Description *': 'विवरण *',
  'Your Message *': 'आपका संदेश *',
  'Your Feedback': 'आपकी प्रतिक्रिया',
  'Required Skills': 'आवश्यक योग्यता व कौशल',
  'Salary Range': 'वेतन सीमा',
  'Hiring Urgency': 'भर्ती प्राथमिकता',
  'Normal Hiring': 'सामान्य भर्ती',
  'Urgent Requirement': 'अति आवश्यक भर्ती',
  'All Job Categories': 'सभी रोजगार श्रेणियां',
  'Event Date': 'कार्यक्रम तिथि',
  'Event Title *': 'कार्यक्रम शीर्षक *',
  'Event Delegate Pass': 'कार्यक्रम प्रतिनिधि पास',
  'Delegate pass details for Chamber conclaves and symposiums.': 'चैम्बर सम्मेलनों एवं संगोष्ठियों के प्रतिनिधि पास विवरण।',
  'Award Ceremony': 'पुरस्कार समारोह',
  'Business Networking': 'व्यापारिक नेटवर्किंग',
  'Cultural & Trade': 'सांस्कृतिक व व्यापार',
  'Exhibition & Expo': 'प्रदर्शनी व एक्सपो',
  'Seminar / Workshop': 'संगोष्ठी / कार्यशाला',
  'Trade Summit': 'व्यापार सम्मेलन',
  'Trade Advisory': 'व्यापार परामर्श',
  'Trade Dispute Mediation': 'व्यापारिक विवाद मध्यस्थता',
  'Policy Delegation': 'नीतिगत प्रतिनिधिमंडल',
  'Community Achievement': 'सामुदायिक उपलब्धि',
  'Community Spotlight / Sponsorship': 'सामुदायिक मंच / प्रायोजन',
  'Youth Wing': 'युवा प्रकोष्ठ',
  'Actions': 'कार्यवाही',
  'Moderation': 'समीक्षा व नियंत्रण',
  'Member Name': 'सदस्य का नाम',
  'Membership ID': 'सदस्यता पहचान संख्या (आईडी)',
  'Membership Verification': 'सदस्यता सत्यापन',
  'Verified Businesses': 'सत्यापित व्यापारिक प्रतिष्ठान',
  'Verified Status: Active': 'सत्यापित स्थिति: सक्रिय',
  'Enrolment Date': 'पंजीकरण तिथि',
  'Registered City': 'पंजीकृत शहर',
  'Founder / Owner': 'संस्थापक / स्वामी',
  'Proprietor': 'स्वामी / प्रोपराइटर',
  'Patron / Member': 'संरक्षक / सदस्य',
  'Affiliated Chapter': 'संबद्ध शाखा',
  'Classification': 'वर्गीकरण',
  'Operating Timing': 'कार्य समय',
  'Phone Contact': 'दूरभाष संपर्क',
  'Contact telephone, WhatsApp number, and commercial email.': 'संपर्क दूरभाष, व्हाट्सएप नंबर एवं व्यापारिक ईमेल।',
  'Enterprise trade name, founder name, and business address.': 'प्रतिष्ठान का व्यापारिक नाम, संचालक का नाम एवं पता।',
  'Industry classification, GST details, and service/product catalogues.': 'उद्योग वर्गीकरण, जीएसटी विवरण एवं उत्पाद/सेवा सूची।',
  'Positions posted from your enterprise.': 'आपके प्रतिष्ठान द्वारा पोस्ट किए गए पद।',
  'Sign Out': 'साइन आउट',
  'Min. 6 characters': 'न्यूनतम 6 अक्षर',
  '+ Add Chamber Event': '+ नया चैम्बर कार्यक्रम जोड़ें',
  '+ Add Concluded Event Album': '+ संपन्न कार्यक्रम एल्बम जोड़ें',
  '+ Become a Member': '+ सदस्य बनें',
  '+ Post New Job': '+ नई नौकरी पोस्ट करें',
  '+ Post a Vacancy': '+ रिक्ति पोस्ट करें',
  '+ Publish Circular': '+ नया परिपत्र प्रकाशित करें',

  // Common UI words
  'Filter': 'फिल्टर',
  'Filters': 'फिल्टर',
  'All': 'सभी',
  'Loading…': 'लोड हो रहा है…',
  'Loading...': 'लोड हो रहा है...',
  'Save': 'सहेजें',
  'Cancel': 'रद्द करें',
  'Back': 'वापस',
  'Remove': 'हटाएं',
  'Add': 'जोड़ें',
  'New': 'नया',
  'Status': 'स्थिति',
  'Active': 'सक्रिय',
  'Pending': 'लंबित',
  'Approved': 'स्वीकृत',
  'Rejected': 'अस्वीकृत',
  'Phone': 'फोन',
  'Mobile': 'मोबाइल',
  'Address': 'पता',
  'State': 'राज्य',
  'Pincode': 'पिनकोड',
  'PIN Code': 'पिनकोड',
  'Website': 'वेबसाइट',
  'Name': 'नाम',
  'Owner': 'संचालक',
  'Description': 'विवरण',
  'Services': 'सेवाएँ',
  'Products': 'उत्पाद',
  'Rating': 'रेटिंग',
  'Ratings': 'रेटिंग्स',
  'Overview': 'अवलोकन',
  'Category': 'श्रेणी',
  'Industry': 'उद्योग',
  'Company': 'कंपनी',
  'Enterprise': 'प्रतिष्ठान',
  'Enterprises': 'प्रतिष्ठान',
  'Member': 'सदस्य',
  'Members': 'सदस्य',
  'Years': 'वर्ष',
  'Year': 'वर्ष',
  'Month': 'माह',
  'Day': 'दिन',
  'Monday': 'सोमवार',
  'Tuesday': 'मंगलवार',
  'Wednesday': 'बुधवार',
  'Thursday': 'गुरुवार',
  'Friday': 'शुक्रवार',
  'Saturday': 'शनिवार',
  'Sunday': 'रविवार',
  'Mon': 'सोम',
  'Tue': 'मंगल',
  'Wed': 'बुध',
  'Thu': 'गुरु',
  'Fri': 'शुक्र',
  'Sat': 'शनि',
  'Sun': 'रवि',
  'Jan': 'जनवरी',
  'Feb': 'फ़रवरी',
  'Mar': 'मार्च',
  'Apr': 'अप्रैल',
  'May': 'मई',
  'Jun': 'जून',
  'Jul': 'जुलाई',
  'Aug': 'अगस्त',
  'Sep': 'सितंबर',
  'Oct': 'अक्टूबर',
  'Nov': 'नवंबर',
  'Dec': 'दिसंबर',
  'Member since': 'सदस्यता वर्ष',
  'Link copied to clipboard!': 'लिंक कॉपी हो गया!',
  'Copied!': 'कॉपी हो गया!',
};

// Common individual words dictionary for fallback deep translation
const WORD_DICTIONARY: Record<string, string> = {
  'businesses': 'व्यवसाय',
  'business': 'व्यवसाय',
  'enterprises': 'प्रतिष्ठान',
  'enterprise': 'प्रतिष्ठान',
  'manufacturers': 'विनिर्माता',
  'manufacturer': 'विनिर्माता',
  'wholesalers': 'थोक व्यापारी',
  'wholesaler': 'थोक व्यापारी',
  'retailers': 'खुदरा विक्रेता',
  'retailer': 'खुदरा विक्रेता',
  'jewellers': 'सराफा व्यवसायी',
  'jeweller': 'सराफा व्यवसायी',
  'doctors': 'चिकित्सक',
  'doctor': 'चिकित्सक',
  'professionals': 'पेशेवर',
  'professional': 'पेशेवर',
  'industries': 'उद्योग',
  'industry': 'उद्योग',
  'categories': 'श्रेणियां',
  'category': 'श्रेणी',
  'verified': 'सत्यापित',
  'conclaves': 'सम्मेलन',
  'conclave': 'सम्मेलन',
  'events': 'कार्यक्रम',
  'event': 'कार्यक्रम',
  'gallery': 'गैलरी',
  'photos': 'तस्वीरें',
  'photo': 'फोटो',
  'pictures': 'चित्र',
  'picture': 'चित्र',
  'albums': 'एल्बम',
  'album': 'एल्बम',
  'opportunities': 'अवसर',
  'opportunity': 'अवसर',
  'jobs': 'रोजगार',
  'job': 'नौकरी',
  'committee': 'समिति',
  'secretariat': 'सचिवालय',
  'membership': 'सदस्यता',
  'contact': 'संपर्क',
  'search': 'खोजें',
  'filter': 'फिल्टर',
  'submit': 'सबमिट करें',
  'save': 'सहेजें',
  'cancel': 'रद्द करें',
  'close': 'बंद करें',
  'details': 'विवरण',
  'profile': 'प्रोफाइल',
  'reviews': 'समीक्षाएं',
  'review': 'समीक्षा',
  'rating': 'रेटिंग',
  'ratings': 'रेटिंग्स',
  'salary': 'वेतन',
  'location': 'स्थान',
  'address': 'पता',
  'city': 'शहर',
  'state': 'राज्य',
  'pincode': 'पिनकोड',
  'phone': 'फोन',
  'email': 'ईमेल',
  'website': 'वेबसाइट',
  'owner': 'स्वामी',
  'president': 'अध्यक्ष',
  'secretary': 'सचिव',
  'treasurer': 'कोषाध्यक्ष',
  'director': 'निदेशक',
  'manager': 'प्रबंधक',
  'founder': 'संस्थापक',
  'approved': 'स्वीकृत',
  'pending': 'लंबित',
  'rejected': 'अस्वीकृत',
  'active': 'सक्रिय',
  'upcoming': 'आगामी',
  'concluded': 'संपन्न',
  'recent': 'हालिया',
  'latest': 'नवीनतम',
  'view': 'देखें',
  'apply': 'आवेदन करें',
  'share': 'साझा करें',
  'connect': 'संपर्क करें',
  'call': 'कॉल करें',
  'message': 'संदेश',
  'help': 'सहायता',
  'desk': 'केंद्र',
  'portal': 'पोर्टल',
  'admin': 'प्रशासन',
  'user': 'उपयोगकर्ता',
  'dashboard': 'डैशबोर्ड',
  'logout': 'लॉगआउट',
  'login': 'लॉगिन',
  'free': 'निःशुल्क',
  'total': 'कुल',
  'years': 'वर्ष',
  'year': 'वर्ष',
  'months': 'माह',
  'month': 'माह',
  'days': 'दिन',
  'day': 'दिन',
  'hours': 'घंटे',
  'hour': 'घंटा',
};

// Sorted list of multi-word phrases (longest first) for substring replacements
const SORTED_PHRASES: string[] = Object.keys(MASTER_DICTIONARY)
  .filter((k) => k.length >= 3 && !k.startsWith('nav_') && !k.startsWith('btn_') && !k.startsWith('stat_') && !k.startsWith('hero_'))
  .sort((a, b) => b.length - a.length);

// ─────────────────────────────────────────────────────────────────────────────
// STRING TRANSLATION RESOLVER
// ─────────────────────────────────────────────────────────────────────────────
export function translateText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  // Do not alter pure numbers, phone numbers, emails, URLs, or GST codes
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (/^\+?[0-9\s-]{8,}$/.test(trimmed)) return text;
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return text;
  if (/^https?:\/\//i.test(trimmed)) return text;
  if (/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/i.test(trimmed)) return text;

  // Preserve leading and trailing whitespace
  const leadingWs = text.match(/^\s*/)?.[0] || '';
  const trailingWs = text.match(/\s*$/)?.[0] || '';

  // 1. Exact match in MASTER_DICTIONARY
  if (MASTER_DICTIONARY[trimmed]) {
    return leadingWs + MASTER_DICTIONARY[trimmed] + trailingWs;
  }

  // 1b. Case-insensitive exact match
  const lowerTrimmed = trimmed.toLowerCase();
  for (const key of Object.keys(MASTER_DICTIONARY)) {
    if (key.toLowerCase() === lowerTrimmed) {
      return leadingWs + MASTER_DICTIONARY[key] + trailingWs;
    }
  }

  // 2. Subphrase replacement for composite sentences
  let result = trimmed;
  for (const phrase of SORTED_PHRASES) {
    if (result.toLowerCase().includes(phrase.toLowerCase())) {
      // Escape special regex characters in phrase
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      result = result.replace(regex, MASTER_DICTIONARY[phrase]);
    }
  }

  // 3. Fallback word replacements on remaining Latin words
  for (const [enWord, hiWord] of Object.entries(WORD_DICTIONARY)) {
    const escaped = enWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    result = result.replace(regex, hiWord);
  }

  return leadingWs + result + trailingWs;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');
  const pathname = usePathname();

  // Storage for original English text nodes and placeholders
  const origTextNodes = useRef<WeakMap<Node, string>>(new WeakMap());
  const origPlaceholders = useRef<WeakMap<Element, string>>(new WeakMap());
  const origTitles = useRef<WeakMap<Element, string>>(new WeakMap());
  const isTranslating = useRef(false);

  // Initialize language from localStorage
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

  // Smart t() function
  const t = (keyOrPhrase: string, fallback?: string): string => {
    if (!keyOrPhrase) return '';
    if (lang === 'en') return fallback || keyOrPhrase;

    if (MASTER_DICTIONARY[keyOrPhrase]) {
      return MASTER_DICTIONARY[keyOrPhrase];
    }
    if (fallback && MASTER_DICTIONARY[fallback]) {
      return MASTER_DICTIONARY[fallback];
    }
    return translateText(fallback || keyOrPhrase);
  };

  // DOM Walkers for complete site translation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const translateDOMNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (!parent) return;
        const tag = parent.tagName.toUpperCase();
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(tag)) return;
        if (parent.closest('.notranslate, [translate="no"]')) return;

        const current = node.textContent || '';
        if (!current.trim()) return;

        if (!origTextNodes.current.has(node)) {
          origTextNodes.current.set(node, current);
        }

        const orig = origTextNodes.current.get(node) || current;
        const translated = translateText(orig);
        if (translated !== node.textContent) {
          node.textContent = translated;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.closest && el.closest('.notranslate, [translate="no"]')) return;

        // Placeholders in input and textarea
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          if (el.placeholder) {
            if (!origPlaceholders.current.has(el)) {
              origPlaceholders.current.set(el, el.placeholder);
            }
            const orig = origPlaceholders.current.get(el) || el.placeholder;
            const translated = translateText(orig);
            if (translated !== el.placeholder) {
              el.placeholder = translated;
            }
          }
        }

        // Title attributes
        if (el.title) {
          if (!origTitles.current.has(el)) {
            origTitles.current.set(el, el.title);
          }
          const orig = origTitles.current.get(el) || el.title;
          const translated = translateText(orig);
          if (translated !== el.title) {
            el.title = translated;
          }
        }

        // Traverse child nodes
        for (let i = 0; i < el.childNodes.length; i++) {
          translateDOMNode(el.childNodes[i]);
        }
      }
    };

    const restoreDOMNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (origTextNodes.current.has(node)) {
          const orig = origTextNodes.current.get(node)!;
          if (orig !== node.textContent) {
            node.textContent = orig;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          if (origPlaceholders.current.has(el)) {
            el.placeholder = origPlaceholders.current.get(el)!;
          }
        }
        if (origTitles.current.has(el)) {
          el.title = origTitles.current.get(el)!;
        }
        for (let i = 0; i < el.childNodes.length; i++) {
          restoreDOMNode(el.childNodes[i]);
        }
      }
    };

    // Apply or restore translation
    if (lang === 'hi') {
      isTranslating.current = true;
      translateDOMNode(document.body);
      isTranslating.current = false;

      // Mutation observer to handle dynamic updates (drawers, modals, search results, tabs)
      const observer = new MutationObserver((mutations) => {
        if (isTranslating.current) return;
        isTranslating.current = true;
        for (const mut of mutations) {
          if (mut.type === 'childList') {
            mut.addedNodes.forEach((n) => translateDOMNode(n));
          } else if (mut.type === 'characterData') {
            if (mut.target) translateDOMNode(mut.target);
          }
        }
        isTranslating.current = false;
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return () => {
        observer.disconnect();
      };
    } else {
      // English mode: restore original texts
      restoreDOMNode(document.body);
    }
  }, [lang, pathname]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
