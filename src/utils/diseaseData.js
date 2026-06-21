const diseaseData = {
  "Apple___Apple_scab": {
    description: {
      en: "A common fungal disease that causes dark, scabby lesions on leaves and fruit.",
      hi: "एक सामान्य कवक रोग जो पत्तियों और फलों पर काले, पपड़ीदार घाव पैदा करता है।"
    },
    severity: "Medium",
    treatment: {
      recommended: {
        en: ["Remove and destroy fallen leaves", "Apply fungicides during early spring"],
        hi: ["गिरी हुई पत्तियों को हटा दें और नष्ट कर दें", "शुरुआती वसंत के दौरान कवकनाशी का प्रयोग करें"]
      },
      pesticides: {
        en: ["Captan", "Mancozeb", "Sulfur"],
        hi: ["कैप्टन", "मैन्कोजेब", "सल्फर"]
      },
      preventive: {
        en: ["Plant resistant varieties", "Improve air circulation through pruning"],
        hi: ["प्रतिरोधी किस्में लगाएं", "छंटाई के माध्यम से हवा के संचार में सुधार करें"]
      }
    }
  },
  "Apple___Black_rot": {
    description: {
      en: "A fungal disease causing dark spots on leaves, cankers on limbs, and rot on fruit.",
      hi: "एक कवक रोग जो पत्तियों पर काले धब्बे, शाखाओं पर घाव और फलों पर सड़न पैदा करता है।"
    },
    severity: "High",
    treatment: {
      recommended: {
        en: ["Prune out dead wood and cankers", "Remove mummified fruit"],
        hi: ["सूखी लकड़ी और घावों को काट कर निकाल दें", "ममीकृत फलों को हटा दें"]
      },
      pesticides: {
        en: ["Copper-based fungicides", "Captan"],
        hi: ["कॉपर आधारित कवकनाशी", "कैप्टन"]
      },
      preventive: {
        en: ["Proper orchard sanitation", "Minimize bird damage to fruit"],
        hi: ["बाग की उचित स्वच्छता", "फलों को पक्षियों से होने वाले नुकसान को कम करें"]
      }
    }
  },
  "Corn_(maize)___Common_rust": {
    description: {
      en: "Characterized by reddish-brown pustules on both upper and lower leaf surfaces.",
      hi: "पत्तियों की ऊपरी और निचली दोनों सतहों पर लाल-भूरे रंग के दानों द्वारा पहचाना जाता है।"
    },
    severity: "Low",
    treatment: {
      recommended: {
        en: ["None usually required for backyard gardens", "Monitor crop regularly"],
        hi: ["पिछवाड़े बागानों के लिए आमतौर पर किसी की आवश्यकता नहीं होती", "नियमित रूप से फसल की निगरानी करें"]
      },
      pesticides: {
        en: ["Strobilurins", "Triazoles (if severe)"],
        hi: ["स्ट्रोबिलुरिन", "ट्राईज़ोल (यदि गंभीर हो)"]
      },
      preventive: {
        en: ["Plant resistant hybrids", "Early planting to avoid peak rust season"],
        hi: ["प्रतिरोधी संकर किस्में लगाएं", "पीक जंग के मौसम से बचने के लिए जल्दी बुवाई करें"]
      }
    }
  },
  "Tomato___Early_blight": {
    description: {
      en: "Produces dark spots with concentric rings on lower leaves first.",
      hi: "सबसे पहले निचली पत्तियों पर संकेंद्रित छल्लों के साथ काले धब्बे पैदा करता है।"
    },
    severity: "Medium",
    treatment: {
      recommended: {
        en: ["Remove infected lower leaves", "Mulch around plants to prevent soil splash"],
        hi: ["संक्रमित निचली पत्तियों को हटा दें", "मिट्टी के छींटों को रोकने के लिए पौधों के चारों ओर मल्च लगाएं"]
      },
      pesticides: {
        en: ["Chlorothalonil", "Copper Fungicide"],
        hi: ["क्लोरोथालोनिल", "कॉपर कवकनाशी"]
      },
      preventive: {
        en: ["Crop rotation", "Use drip irrigation instead of overhead watering"],
        hi: ["फसल चक्र", "ऊपर से पानी देने के बजाय ड्रिप सिंचाई का उपयोग करें"]
      }
    }
  },
  "Tomato___Late_blight": {
    description: {
      en: "A fast-moving and destructive disease that causes dark, water-soaked patches on leaves.",
      hi: "एक तेजी से फैलने वाला और विनाशकारी रोग जो पत्तियों पर काले, पानी से लथपथ धब्बे पैदा करता है।"
    },
    severity: "High",
    treatment: {
      recommended: {
        en: ["Remove and destroy entire plant immediately", "Do not compost infected material"],
        hi: ["पूरे पौधे को तुरंत हटा दें और नष्ट कर दें", "संक्रमित सामग्री को कम्पोस्ट न करें"]
      },
      pesticides: {
        en: ["Copper-based fungicides (mostly preventative)"],
        hi: ["कॉपर आधारित कवकनाशी (ज्यादातर निवारक)"]
      },
      preventive: {
        en: ["Avoid planting where potatoes were grown", "Ensure good spacing"],
        hi: ["जहाँ आलू उगाए गए थे वहाँ रोपण से बचें", "अच्छी दूरी सुनिश्चित करें"]
      }
    }
  },
  "Healthy": {
    description: {
      en: "The plant appears to be in good health with no visible signs of disease.",
      hi: "पौधा रोग के कोई दृश्य लक्षण न होने के साथ अच्छे स्वास्थ्य में दिखाई देता है।"
    },
    severity: "Low",
    treatment: {
      recommended: {
        en: ["Continue regular watering and fertilization"],
        hi: ["नियमित सिंचाई और उर्वरीकरण जारी रखें"]
      },
      pesticides: {
        en: ["None needed"],
        hi: ["किसी की जरूरत नहीं"]
      },
      preventive: {
        en: ["Maintain good soil nutrition", "Monitor regularly"],
        hi: ["मिट्टी का अच्छा पोषण बनाए रखें", "नियमित निगरानी करें"]
      }
    }
  }
};

export default diseaseData;
