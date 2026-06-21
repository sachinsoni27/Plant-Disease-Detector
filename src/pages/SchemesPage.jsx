import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Banknote, 
  ShieldCheck, 
  Droplets, 
  ArrowRight, 
  ExternalLink,
  Info,
  BadgePercent,
  X,
  Languages,
  ChevronDown
} from 'lucide-react';
import LiveIcon from '../components/LiveIcon';
import { useLanguage } from '../context/LanguageContext';

// Import scheme images
import pmKisanImg from '../assets/schemes/pm-kisan.png';
import fasalBimaImg from '../assets/schemes/fasal-bima.png';
import krishiSinchaiImg from '../assets/schemes/krishi-sinchai.png';
import mechanizationImg from '../assets/schemes/mechanization.png';

const schemeDetails = {
  "PM-Kisan Samman Nidhi": {
    hindi: `
पीएम किसान सम्मान निधि – पूरी जानकारी 

1. 📌 यह योजना क्या है? 
PM-Kisan Samman Nidhi भारत सरकार की एक योजना है, जो किसानों को आर्थिक सहायता देने के लिए बनाई गई है। 
• हर किसान को ₹6000 प्रति वर्ष मिलते हैं  
• यह पैसा 3 बराबर किस्तों (₹2000-₹2000) में दिया जाता है  
• पैसा सीधे बैंक खाते में ट्रांसफर होता है (DBT – Direct Benefit Transfer)  

2. 👨‍🌾 कौन आवेदन कर सकता है? (पात्रता) 
✔ पात्र किसान: 
• भारत के छोटे और सीमांत किसान  
• जिनके पास खेती योग्य जमीन है  
• जमीन किसान के नाम पर होनी चाहिए  

❌ अपात्र: 
• सरकारी कर्मचारी (Group A और B)  
• आयकर (Income Tax) देने वाले लोग  
• डॉक्टर, इंजीनियर, वकील जैसे पेशेवर  
• ₹10,000 से ज्यादा पेंशन पाने वाले  

3. 💰 पैसा कैसे मिलता है? 
कुल ₹6000 साल में 3 किस्तों में मिलता है: 
• अप्रैल – जुलाई → ₹2000  
• अगस्त – नवंबर → ₹2000  
• दिसंबर – मार्च → ₹2000  
✅ पैसा सीधे बैंक खाते में आता है (कोई बिचौलिया नहीं) 

4. 📝 आवेदन कैसे करें? 
⌨️ ऑनलाइन तरीका: 
• PM-Kisan की आधिकारिक वेबसाइट पर जाएं  
• “New Farmer Registration” पर क्लिक करें  
• आधार नंबर और जरूरी जानकारी भरें  

🏠 ऑफलाइन तरीका: 
• नजदीकी CSC (Common Service Center) पर जाएं  
• या पटवारी / कृषि कार्यालय से संपर्क करें  

5. 📄 जरूरी दस्तावेज 
आवेदन के लिए ये दस्तावेज चाहिए: 
• आधार कार्ड  
• बैंक खाता विवरण  
• जमीन के कागजात (खसरा / खतौनी)  
• मोबाइल नंबर  

6. 🔍 स्टेटस कैसे चेक करें? 
• आधिकारिक वेबसाइट पर जाएं  
• “Beneficiary Status” पर क्लिक करें  
• आधार या मोबाइल नंबर डालकर चेक करें  

7. ⚠️ जरूरी बातें 
• आधार लिंक होना जरूरी है  
• बैंक खाता सक्रिय होना चाहिए  
• गलत जानकारी देने पर लाभ बंद हो सकता है  
• हर किस्त से पहले वेरिफिकेशन होता है  

8. 🎯 योजना का उद्देश्य 
• किसानों को आर्थिक सहायता देना  
• खेती के खर्च में मदद करना  
• ग्रामीण अर्थव्यवस्था को मजबूत बनाना  

9. 👍 फायदे (Benefits) 
• पैसा सीधे खाते में  
• कोई बिचौलिया नहीं  
• आवेदन प्रक्रिया आसान  
• हर साल निश्चित सहायता 

10. 🌐 आधिकारिक वेबसाइट
• https://pmkisan.gov.in/
    `,
    eng: `
PM-Kisan Samman Nidhi – Full Details

1. 📌 What is this scheme? 
PM-Kisan Samman Nidhi is a Government of India scheme created to provide financial support to farmers. 
• Farmers get ₹6000 per year  
• The money is given in 3 equal installments (₹2000 each)  
• It is directly transferred to the bank account (DBT – Direct Benefit Transfer)  

2. 👨‍🌾 Who can apply? (Eligibility) 
✔ Eligible: 
• Small and marginal farmers in India  
• Farmers who own agricultural land  
• Land must be registered in the farmer’s name  

❌ Not eligible: 
• Government employees (Group A & B)  
• Income tax payers  
• Professionals like doctors, engineers, lawyers  
• Pensioners with pension above ₹10,000 per month  

3. 💰 How is the money given? 
Total ₹6000 is given yearly in 3 installments: 
• April – July → ₹2000  
• August – November → ₹2000  
• December – March → ₹2000  
✅ Money is directly sent to the bank account (no middlemen) 

4. 📝 How to apply? 
⌨️ Online method: 
• Visit the PM-Kisan official website  
• Click on “New Farmer Registration”  
• Enter Aadhaar number and required details  

🏠 Offline method: 
• Visit CSC (Common Service Center)  
• Or contact local Patwari / agriculture office  

5. 📄 Required documents 
You need the following documents: 
• Aadhaar Card  
• Bank account details  
• Land records (Khasra / Khatauni)  
• Mobile number  

6. 🔍 How to check beneficiary status? 
• Go to the official website  
• Click on “Beneficiary Status”  
• Enter Aadhaar or mobile number to check  

7. ⚠️ Important points 
• Aadhaar linking is mandatory  
• Bank account must be active  
• Wrong information can cancel your benefits  
• Verification is done before each installment  

8. 🎯 Main objective of the scheme 
• To provide financial support to farmers  
• To help with farming expenses  
• To strengthen the rural economy  

9. 👍 Benefits summary 
• Direct money transfer  
• No middlemen involved  
• Easy application process  
• Fixed yearly financial support

10. 🌐 Official Website
• https://pmkisan.gov.in/
    `
  },
  "Pradhan Mantri Fasal Bima Yojana": {
    hindi: `
प्रधानमंत्री फसल बीमा योजना (PMFBY) – पूरी जानकारी

1. 📌 यह योजना क्या है?
प्रधानमंत्री फसल बीमा योजना (PMFBY) एक सरकारी फसल बीमा योजना है जो प्राकृतिक आपदाओं, कीटों और रोगों के कारण फसलों के नुकसान की स्थिति में किसानों को बीमा कवरेज और वित्तीय सहायता प्रदान करती है।

2. 👨‍🌾 कौन आवेदन कर सकता है? (पात्रता)
✔ पात्र:
• अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान।
• बटाईदार और काश्तकार किसान भी पात्र हैं।
• संस्थागत ऋण लेने वाले किसानों के लिए यह अनिवार्य है (हालाँकि अब इसे स्वैच्छिक बनाने के प्रयास किए जा रहे हैं)।

3. 💰 फायदे (Benefits)
• ओलावृष्टि, भूस्खलन, बाढ़, सूखा और बेमौसम बारिश जैसे प्राकृतिक जोखिमों के खिलाफ सुरक्षा।
• बहुत कम प्रीमियम (खरीफ के लिए 2%, रबी के लिए 1.5%, और वाणिज्यिक फसलों के लिए 5%)।
• कटाई के बाद के नुकसान के लिए भी सुरक्षा उपलब्ध है।

4. 📝 आवेदन कैसे करें?
⌨️ ऑनलाइन तरीका:
• PMFBY की आधिकारिक वेबसाइट (pmfby.gov.in) पर जाएं।
• 'Farmer Corner' पर क्लिक करें और पंजीकरण करें।
• फसल और जमीन का विवरण भरकर प्रीमियम का भुगतान करें।

5. 📄 जरूरी दस्तावेज
• आधार कार्ड
• बैंक पासबुक (IFSC कोड के साथ)
• जमीन के कागजात (खसरा/खतौनी)
• बुवाई प्रमाण पत्र (Sowing Certificate)
• रद्द किया गया चेक (Cancelled Check)

6. 🌐 आधिकारिक वेबसाइट
• https://pmfby.gov.in/
    `,
    eng: `
Pradhan Mantri Fasal Bima Yojana (PMFBY) – Full Details

1. 📌 What is this scheme?
PMFBY is a government-sponsored crop insurance scheme that provides financial support and insurance coverage to farmers in case of crop failure due to natural calamities, pests, and diseases.

2. 👨‍🌾 Who can apply? (Eligibility)
✔ Eligible:
• All farmers growing notified crops in notified areas are eligible.
• This includes sharecroppers and tenant farmers.
• Mandatory for farmers who have taken institutional loans (though evolving towards voluntary).

3. 💰 Benefits
• Coverage against non-preventable natural risks such as drought, flood, pests, and storms.
• Very low premium rates for farmers (2% for Kharif, 1.5% for Rabi, and 5% for commercial crops).
• Post-harvest losses are also covered in specific conditions.

4. 📝 How to apply?
⌨️ Online method:
• Visit the official PMFBY website (pmfby.gov.in).
• Click on 'Farmer Corner' and login/register.
• Fill in crop/land details and pay the premium online.

5. 📄 Required documents
• Aadhaar Card
• Bank Passbook (with IFSC)
• Land Records (Khasra / Khatauni)
• Sowing Certificate or proof of crop sown
• Identity Proof

6. 🌐 Official Website
• https://pmfby.gov.in/
    `
  },
  "PM Krishi Sinchai Yojana": {
    hindi: `
प्रधानमंत्री कृषि सिंचाई योजना (PMKSY) – पूरी जानकारी

1. 📌 यह योजना क्या है?
PMKSY का उद्देश्य "हर खेत को पानी" और "प्रति बूंद अधिक फसल" के लक्ष्य के साथ सिंचाई नेटवर्क का विस्तार करना और पानी के उपयोग की दक्षता में सुधार करना है।

2. 👨‍🌾 फायदे (Benefits)
• ड्रिप और स्प्रिंकलर (बूंद-बूंद और फुहार) सिंचाई प्रणालियों के लिए भारी सब्सिडी।
• जल स्रोतों का विकास और सुदृढ़ीकरण।
• खेती योग्य क्षेत्र का विस्तार और मृदा स्वास्थ्य में सुधार।
• पानी की बर्बादी में कमी और उच्च फसल पैदावार।

3. 📝 आवेदन कैसे करें?
⌨️ ऑनलाइन तरीका:
• PMKSY पोर्टल या अपने राज्य के कृषि विभाग की आधिकारिक वेबसाइट पर जाएँ।
• सूक्ष्म सिंचाई योजना (Micro Irrigation Scheme) के लिए आवेदन करें।

4. 📄 जरूरी दस्तावेज
• आधार कार्ड
• बैंक खाता विवरण
• भूमि स्वामित्व के दस्तावेज
• पासपोर्ट साइज फोटो
• सिंचाई प्रणाली के लिए कोटेशन (अनुमोदित विक्रेता से)

5. 🌐 आधिकारिक वेबसाइट
• https://pmksy.gov.in/
    `,
    eng: `
Pradhan Mantri Krishi Sinchai Yojana (PMKSY) – Full Details

1. 📌 What is this scheme?
PMKSY is a national mission to improve farm productivity and ensure better utilization of water resources. Its mottos are "Har Khet Ko Pani" (Water for every field) and "Per Drop More Crop".

2. 👨‍🌾 Benefits
• Subsidies for Drip and Sprinkler irrigation systems to save water.
• Development of local water sources and renovation of traditional water bodies.
• Improvement in water use efficiency at the farm level.
• Higher crop yields through precise water management.

3. 📝 How to apply?
⌨️ Online method:
• Visit the official PMKSY portal or your state's agriculture department website.
• Register as a beneficiary and apply for the Micro Irrigation component.

4. 📄 Required documents
• Aadhaar Card
• Bank account details
• Land ownership records
• Passport size photographs
• Quotation for the irrigation system from an authorized dealer

5. 🌐 Official Website
• https://pmksy.gov.in/
    `
  },
  "Agricultural Mechanization Subsidies": {
    hindi: `
कृषि यंत्रीकरण पर उप-मिशन (SMAM) – पूरी जानकारी

1. 📌 यह योजना क्या है?
इस योजना का उद्देश्य किसानों को आधुनिक कृषि मशीनरी खरीदने के लिए वित्तीय सहायता (सब्सिडी) प्रदान करके खेती के काम को आसान और अधिक उत्पादक बनाना है।

2. 👨‍🌾 फायदे (Benefits)
• ट्रैक्टर, पावर टिलर, रोटावेटर, स्प्रेयर और अन्य मशीनों पर 40% से 50% तक की सब्सिडी।
• कस्टम हायरिंग सेंटर (CHC) की स्थापना के लिए विशेष सहायता।
• महिला किसानों और छोटे/सीमांत किसानों के लिए अतिरिक्त लाभ।
• खेती की लागत में कमी और समय की बचत।

3. 📝 आवेदन कैसे करें?
⌨️ ऑनलाइन तरीका:
• कृषि यंत्रीकरण पोर्टल (agrimachinery.nic.in) पर जाएँ।
• 'Registration' बटन पर क्लिक करें और 'Farmer' चुनें।
• विवरण भरकर आवश्यक मशीनरी के लिए सब्सिडी का अनुरोध करें।

4. 📄 जरूरी दस्तावेज
• आधार कार्ड
• पैन कार्ड (यदि आवश्यक हो)
• बैंक पासबुक
• भूमि विवरण (खतौनी)
• जाति प्रमाण पत्र (आरक्षित वर्ग के लिए)

5. 🌐 आधिकारिक वेबसाइट
• https://agrimachinery.nic.in/
    `,
    eng: `
Sub-Mission on Agricultural Mechanization (SMAM) – Full Details

1. 📌 What is this scheme?
The scheme provides financial assistance (subsidies) to farmers for purchasing modern agricultural machinery, making farming operations more efficient and less labor-intensive.

2. 👨‍🌾 Benefits
• 40% to 50% subsidy on equipment like Tractors, Tillers, Rotavators, and Sprayers.
• Support for establishing Custom Hiring Centers (CHCs) to help marginal farmers.
• Special focus on empowering women farmers and small-scale landholders.
• Significant reduction in time and production costs.

3. 📝 How to apply?
⌨️ Online method:
• Visit the official agrimachinery.nic.in portal.
• Click on 'Registration' and select the 'Farmer' category.
• Fill in your details and apply for specific machinery subsidy.

4. 📄 Required documents
• Aadhaar Card
• PAN Card (if applicable)
• Bank Passbook
• Land possession documents (Khatauni)
• Category certificate (for SC/ST/OBC subsidies)

5. 🌐 Official Website
• https://agrimachinery.nic.in/
    `
  }
};

const schemes = [
  {
    id: "PM-Kisan Samman Nidhi",
    titleKey: "pmKisanTitle",
    descKey: "pmKisanDesc",
    categoryKey: "financialAid",
    icon: Banknote,
    image: pmKisanImg,
    imagePosition: "object-top",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    link: "https://pmkisan.gov.in/"
  },
  {
    id: "Pradhan Mantri Fasal Bima Yojana",
    titleKey: "fasalBimaTitle",
    descKey: "fasalBimaDesc",
    categoryKey: "insurance",
    icon: ShieldCheck,
    image: fasalBimaImg,
    imagePosition: "object-center",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    link: "https://pmfby.gov.in/"
  },
  {
    id: "PM Krishi Sinchai Yojana",
    titleKey: "krishiSinchaiTitle",
    descKey: "krishiSinchaiDesc",
    categoryKey: "irrigation",
    icon: Droplets,
    image: krishiSinchaiImg,
    imagePosition: "object-top",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    link: "https://pmksy.gov.in/"
  },
  {
    id: "Agricultural Mechanization Subsidies",
    titleKey: "mechanizationTitle",
    descKey: "mechanizationDesc",
    categoryKey: "subsidy",
    icon: BadgePercent,
    image: mechanizationImg,
    imagePosition: "object-top",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    link: "https://agrimachinery.nic.in/"
  }
];

export default function SchemesPage() {
  const { language, setLanguage, t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDetails, setActiveDetails] = useState(null);
  const [activeTitle, setActiveTitle] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which scheme's dropdown is open

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  const openDetails = (title) => {
    setActiveTitle(title);
    setActiveDetails(schemeDetails[title]);
    setModalOpen(true);
    setDropdownOpen(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-500/20">
                {t('officialUpdates')}
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {t('newSchemesAdded')}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('govtFarmerSchemes')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl leading-relaxed">
              {t('empoweringAgri')}
            </p>
          </motion.div>
          
          <div className="hidden md:flex flex-col items-end">
            <Landmark size={48} className="text-slate-200 dark:text-slate-800 opacity-50" />
          </div>
        </section>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card group overflow-hidden border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-500 relative flex flex-col h-full"
            >
              {/* Scheme Image Header "Frame" */}
              <div className="relative p-3 pb-0 group-hover:p-2.5 transition-all duration-500">
                <div className="relative h-64 overflow-hidden rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
                  <img 
                    src={scheme.image} 
                    alt={t(scheme.titleKey)} 
                    className={`w-full h-full object-cover ${scheme.imagePosition || 'object-top'} transform group-hover:scale-110 transition-transform duration-700 ease-out`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent" />
                  
                  {/* Category Badge on Image */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md border border-white/20 shadow-xl ${scheme.bg} ${scheme.color}`}>
                      {t(scheme.categoryKey)}
                    </span>
                  </div>
                </div>

                {/* Floating Icon - Now outside overflow-hidden for proper visibility */}
                <div className={`absolute -bottom-8 left-10 w-16 h-16 ${scheme.bg} rounded-2xl flex items-center justify-center ${scheme.color} shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] ring-4 ring-white dark:ring-slate-900 z-20 transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-110 group-hover:shadow-emerald-500/20`}>
                  <LiveIcon icon={scheme.icon} type="pulse" size={32} />
                </div>
              </div>

              <div className="p-8 pt-12 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t(scheme.titleKey)}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                  {t(scheme.descKey)}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-auto border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <a 
                       href={scheme.link}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      {t('applyNow')} <ExternalLink size={16} />
                    </a>
                    
                    {/* Full Details Button */}
                    <div className="relative">
                      <button 
                        onClick={() => openDetails(scheme.id)}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white transition-all shadow-lg active:scale-95"
                      >
                        {t('fullDetails')} <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openDetails(scheme.id)}
                    className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    <Info size={20} />
                  </button>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.02] dark:opacity-[0.05] group-hover:opacity-10 transition-all duration-500 transform group-hover:-rotate-12 group-hover:scale-150">
                <scheme.icon size={160} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {modalOpen && (
            <>
              {/* Dimmed Background */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[1001]"
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-2 md:inset-6 lg:inset-10 glass-card z-[1002] overflow-hidden flex flex-col shadow-2xl border-white/20"
              >
                {/* Modal Header - Clean and Text-focused */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0 relative overflow-hidden">
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/10">
                      <Info size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t(schemes.find(s => s.id === activeTitle)?.titleKey || activeTitle)}
                      </h2>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mt-1">
                        {t('informationPortal')}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setModalOpen(false)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 relative z-10"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/30 dark:bg-slate-950/30 custom-scrollbar">
                  <div className="max-w-3xl mx-auto">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 tracking-tight">
                        {activeDetails ? activeDetails[language === 'en' ? 'eng' : 'hindi'] : (language === 'hi' ? 'हिन्दी' : 'English')}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                      <button 
                        onClick={() => setLanguage('hi')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                        हिन्दी
                      </button>
                      <button 
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                        ENGLISH
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:opacity-90 transition-all active:scale-95"
                  >
                    {t('closePortal')}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-white/5 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-black mb-4">{t('needHelp')}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                {t('expertHelpDesc')}
              </p>
            </div>
            <button className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-100 transition-all active:scale-95 whitespace-nowrap">
              {t('connectExpert')} <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
