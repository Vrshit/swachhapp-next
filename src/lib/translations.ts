import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from './types';

// Storage key
const LANG_STORAGE_KEY = 'wm_lang';

export const TRANSLATIONS = {
  en: {
    // Brand & Common
    brandName: 'SwachhApp',
    tagline: 'Clean Green Future Mission',
    sihBadge: 'Smart India Hackathon 2026',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    submit: 'Submit',
    viewAll: 'View All',
    search: 'Search...',
    status: 'Status',
    date: 'Date',
    category: 'Category',
    severity: 'Severity',
    action: 'Action',
    verified: 'Verified',
    pending: 'Pending',
    reviewed: 'Reviewed',
    resolved: 'Resolved',

    // Navigation
    navDashboard: 'Dashboard',
    navReport: 'Report Dump',
    navFacilities: 'Facilities',
    navAdmin: 'Admin',
    navLogin: 'Login',
    navLogout: 'Logout',
    controlCenter: 'Control Center',
    welcomeBack: 'Welcome back',

    // Landing Page
    heroBadge: 'Smart Municipal Cleanliness Network',
    heroTitlePart1: 'Empowering Citizens,',
    heroTitlePart2: 'Transforming Cities with',
    heroTitleHighlight: 'Spatial AI & Clean Energy',
    heroDesc:
      'A human-centric spatial platform empowering citizens, sanitation workers, and municipal councils to achieve 100% source segregation, live GPS geo-tagged reporting, and closed-loop bio-energy conversion.',
    heroCtaDashboard: 'Enter Control Center',
    heroCtaGetStarted: 'Get Started',
    heroCtaFacilities: 'Explore 3D Facilities',

    // Landing - AI Segregator "Which Bin?"
    whichBinTitle: 'AI Source Segregation Guide — Which Bin?',
    whichBinSubtitle: 'Instant visual guidelines, decomposition timeline, and bin color coding.',
    whichBinPlaceholder: 'Search any item (e.g. coconut, milk pouch, battery, pizza box)...',
    disposalGuide: 'Disposal Guide',
    decompositionClock: 'Decomposition Clock',
    recyclabilityRate: 'Recyclability Rate',
    binColor: 'Designated Bin',

    // Landing - Features Section
    featuresHeading: 'Engineered for Real Municipal Impact',
    featuresSubheading: 'Built on grassroots lessons from the Yadgir Model and Swachh Bharat Mission 2.0',
    feature1Title: 'Live GPS Geo-Tagged Photo Reporting',
    feature1Desc: 'Capture illegal blackspots with live location grasping and AI computer vision validation.',
    feature2Title: 'Facility & Grid Proximity Locator',
    feature2Desc: 'Locate nearby biomethanisation plants, dry waste recycling centers, and scrap buyers.',
    feature3Title: 'Swachh Ward Leaderboards',
    feature3Desc: 'Track Ward Cleanliness Index (WCI), resolution rates, and municipal tipper turnaround SLA.',
    feature4Title: 'Green Rewards Marketplace',
    feature4Desc: 'Redeem verified civic points for municipal property tax rebates, free compost, and transit passes.',

    // Landing - Circular Economy
    pipelineBadge: 'Circular Economy Closed Loop',
    pipelineTitle: 'Zero-Landfill Municipal Pipeline',
    pipelineDesc: 'How SwachhApp synchronizes citizen inputs directly into renewable grid generation.',
    pipelineStep1: 'Source Segregation',
    pipelineStep1Desc: 'Green, Blue, and Red bins partitioned right at homes and commercial units.',
    pipelineStep2: 'Smart GIS Pickup',
    pipelineStep2Desc: 'Solar electric tippers dispatched via real-time citizen dump reports.',
    pipelineStep3: 'Biomethanisation',
    pipelineStep3Desc: 'Organic wet waste converted to compressed bio-gas (CBG) and nutrient manure.',
    pipelineStep4: 'Grid Power Generation',
    pipelineStep4Desc: 'Dry combustibles converted to electricity in state Waste-to-Energy turbines.',

    // Landing - Call to Action
    ctaHeading: "Ready to Champion India's Clean Revolution?",
    ctaSubheading: 'Report illegal dumping, earn green rewards, and help your municipal ward reach #1 ranking.',
    ctaButton: 'Create Free Account',

    // Report Page
    reportPageTitle: 'Report Illegal Dump Site',
    reportPageSubtitle: 'AI-validated geo-tagged reporting with real-time sanitation tipper dispatch.',
    step1Photo: '1. Dump Site Photo *',
    takePhoto: 'Take / Upload Photo',
    reuploadPhoto: 'Retake / Change Photo',
    aiAnalyzing: '🔍 AI Waste Validator Analyzing...',
    aiAnalyzingDesc: 'Running MobileNetV2 vision model to verify this is actual waste',
    aiRejectedTitle: '⚠️ Image Rejected — Not Waste',
    aiRejectedDesc: 'Our AI vision model determined this image does not contain waste material. Only photos of actual waste, garbage dumps, or illegal dumping sites are accepted.',
    aiRejectedBtn: 'Upload a Different Photo',
    step2Category: '2. Waste Classification *',
    step3Severity: '3. Severity & Volume Level *',
    step4Location: '4. Location Grasper (Live GPS) *',
    step5VoiceNote: '5. Voice Note / Audio Landmark (Optional)',
    step6Description: '6. Site Landmark & Description *',
    descPlaceholder: 'Provide exact landmark (e.g. Behind Metro Pillar 42, near community park corner)...',
    submittingReport: 'Dispatching Tipper to Coordinates...',
    submitReportBtn: 'Submit Incident to Municipal Control',

    // Location Grasper
    locationGrasperTitle: 'Live GPS Location Grasper',
    graspLocationBtn: 'Grasp Live GPS Location',
    graspingGps: 'Grasping Precision Satellite Coordinates...',
    gpsAccuracy: 'GPS Precision',
    gpsCoords: 'Coordinates',
    geocodedAddress: 'Resolved Address',
    reGraspBtn: 'Re-Grasp GPS',
    gpsLocked: 'GPS Coordinate Lock Acquired',
    gpsSimulated: 'Using simulated coordinates (enable device GPS for meter-accurate lock).',
    continuousTracking: 'Continuous GPS Tracking',

    // Voice Note
    voiceNoteTitle: 'Audio Landmark Voice Note',
    startRecording: 'Tap to Record Voice Note',
    stopRecording: 'Stop Recording',
    recordingInProgress: 'Recording audio directions...',
    audioRecorded: 'Audio Landmark Recorded',
    deleteAudio: 'Delete Audio',

    // Report Confirmation
    reportSubmittedTitle: 'Incident Dispatched Successfully! 🎉',
    reportSubmittedSubtitle: 'Your report has been verified by AI and dispatched to the municipal sanitation fleet.',
    assignedTipper: 'Assigned Municipal Tipper',
    tipperDriver: 'Driver / Operator',
    tipperEta: 'Dynamic Estimated Arrival (ETA)',
    tipperRoute: 'Route Status',
    viewInDashboard: 'View in Civic Dashboard',
    reportAnother: 'Report Another Site',

    // Dashboard
    civicImpactPortal: 'Civic Impact Portal • Live Active',
    welcomeUser: 'Welcome',
    civicStreak: '7-Day Active Citizen Cleanliness Streak',
    reportIllegalDumpBtn: 'Report Illegal Dump',
    locatePlantsBtn: 'Locate Plants',
    metricMyReports: 'My Dump Reports',
    metricMyReportsDesc: 'Dispatched to sanitation team',
    metricResolved: 'Resolved & Cleared',
    metricResolvedDesc: 'Sites completely cleaned',
    metricCivicPoints: 'Civic Points Balance',
    metricCivicPointsDesc: 'Redeemable for tax rebates & compost',
    metricChampionRank: 'Champion Rank',
    greenRewardsTitle: 'Green Rewards & Vouchers',
    greenRewardsSubtitle: 'Convert your civic points into municipal incentives',
    redeemBtn: 'Redeem',
    wardLeaderboardTitle: 'Swachh Survekshan Ward Leaderboard',
    wardLeaderboardSubtitle: 'Live Ward Cleanliness Index (WCI) and Tipper SLA tracking',
    wardRank: 'Rank',
    wardName: 'Municipal Ward',
    wardZone: 'Zone',
    wardWci: 'Cleanliness Index (WCI)',
    wardCleanupRate: 'Resolution Rate',
    wardSla: 'Avg Cleanup SLA',
    wardChampions: 'Active Champions',
    wasteDistTitle: 'Municipal Waste Category Distribution',
    totalReportsRegistered: 'Total Registered Reports',
    myRecentReportsTitle: 'My Recent Submissions',
    noReportsYet: 'No reports submitted yet.',
    reportFirstDump: 'Report Your First Dump',

    // Facilities
    facilitiesTitle: 'GIS Waste Processing Grid & Fleet Tracker',
    facilitiesSubtitle: 'Locate decentralized biomethanisation plants, dry waste aggregators, and live municipal tippers.',
    scrapRatesTitle: 'Daily Scrap Buyback Rates (Yadgir Market Index)',
    scrapRatesSubtitle: 'Official municipal baseline buyback rates for segregated clean recyclables.',
    liveFleetTitle: 'Live Municipal Electric Tipper Fleet Telematics',
    liveFleetSubtitle: 'Real-time telemetry and battery status for electric collection vehicles.',
    allFacilities: 'All Facilities',
    biomethanisationTab: 'Biomethanisation',
    dryWasteTab: 'Dry Waste / MRF',
    hazardousTab: 'Hazardous / PPE',
    wasteToEnergyTab: 'Waste-to-Energy',
    scrapBuyersTab: 'Scrap Aggregators',
    plantCapacity: 'Plant Capacity',
    operatingHours: 'Operating Hours',
    acceptedWaste: 'Accepted Waste',
    contactDesk: 'Contact Desk',
    getDirections: 'Get Directions',

    // Admin
    adminTitle: 'Swachh Bharat Municipal Administration',
    adminSubtitle: 'Real-time triage, verification, tipper dispatch, and official compliance audit reporting.',
    exportCsvBtn: 'Export Swachh Bharat Audit CSV',
    totalIncidents: 'Total Incidents',
    awaitingReview: 'Awaiting Action',
    resolvedVerified: 'Resolved & Verified',
    avgTurnaround: 'Avg Turnaround SLA',
    incidentManagement: 'Incident Management & Before/After Verification',
    officerDesk: 'Ward Officer Desk',
    verifyCleanupBtn: 'Verify Cleanup (Before / After)',
    beforeCleanup: 'Before Cleanup (Citizen Report)',
    afterCleanup: 'After Cleanup Proof (Sanitation Officer)',
    uploadAfterPhoto: 'Upload After-Cleanup Verification Photo',
    markAsResolved: 'Mark Incident Verified & Cleared',

    // Waste Categories
    catWetOrganic: 'Wet / Organic',
    catWetOrganicDesc: 'Food scraps, kitchen waste, garden trimmings',
    catDryRecyclable: 'Dry / Recyclable',
    catDryRecyclableDesc: 'Plastic bottles, cardboard, paper, aluminum, glass',
    catHazardous: 'Hazardous / Bio-Medical',
    catHazardousDesc: 'Batteries, syringes, chemicals, contaminated PPE',
    catEWaste: 'E-Waste',
    catEWasteDesc: 'Cables, broken chargers, electronics, bulbs',
    catConstruction: 'Construction Debris',
    catConstructionDesc: 'Cement, plaster, broken tiles, sand heaps',
    catMixed: 'Mixed / Unsorted Blackspot',
    catMixedDesc: 'Unsorted street garbage dumps requiring immediate segregation',
  },

  hi: {
    // Brand & Common
    brandName: 'स्वच्छऐप',
    tagline: 'स्वच्छ एवं हरित भविष्य अभियान',
    sihBadge: 'स्मार्ट इंडिया हैकाथॉन 2026',
    loading: 'लोड हो रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    back: 'पीछे जाएं',
    submit: 'जमा करें',
    viewAll: 'सभी देखें',
    search: 'खोजें...',
    status: 'स्थिति',
    date: 'तारीख',
    category: 'श्रेणी',
    severity: 'गंभीरता',
    action: 'कार्रवाई',
    verified: 'सत्यापित',
    pending: 'लंबित',
    reviewed: 'समीक्षित',
    resolved: 'समाधानित',

    // Navigation
    navDashboard: 'डैशबोर्ड',
    navReport: 'कचरा रिपोर्ट करें',
    navFacilities: 'सुविधाएं व केंद्र',
    navAdmin: 'प्रशासन पोर्टल',
    navLogin: 'लॉगिन',
    navLogout: 'लॉगआउट',
    controlCenter: 'नियंत्रण कक्ष',
    welcomeBack: 'पुनः स्वागत है',

    // Landing Page
    heroBadge: 'स्मार्ट नगरपालिका स्वच्छता नेटवर्क',
    heroTitlePart1: 'नागरिक सशक्तिकरण,',
    heroTitlePart2: 'शहरों का कायाकल्प',
    heroTitleHighlight: 'स्थानिक AI और स्वच्छ ऊर्जा से',
    heroDesc:
      'एक मानव-केंद्रित स्थानिक मंच जो नागरिकों, स्वच्छता कर्मियों और नगर पालिकाओं को 100% स्रोत पृथक्करण, लाइव जीपीएस भू-टैग रिपोर्टिंग और चक्रीय जैव-ऊर्जा रूपांतरण प्राप्त करने में सक्षम बनाता है।',
    heroCtaDashboard: 'नियंत्रण केंद्र में जाएं',
    heroCtaGetStarted: 'शुरू करें',
    heroCtaFacilities: '3D सुविधाएं देखें',

    // Landing - AI Segregator "Which Bin?"
    whichBinTitle: 'AI स्रोत पृथक्करण मार्गदर्शिका — किस डस्टबिन में डालें?',
    whichBinSubtitle: 'तुरंत दृश्य दिशानिर्देश, अपघटन समयरेखा और डिब्बे के रंग कोडिंग।',
    whichBinPlaceholder: 'किसी भी वस्तु को खोजें (उदा. नारियल का छिलका, दूध की थैली, बैटरी, पिज्जा बॉक्स)...',
    disposalGuide: 'निपटान दिशानिर्देश',
    decompositionClock: 'अपघटन समय',
    recyclabilityRate: 'पुनर्चक्रण दर',
    binColor: 'निर्धारित डस्टबिन',

    // Landing - Features Section
    featuresHeading: 'वास्तविक नगरपालिका प्रभाव के लिए निर्मित',
    featuresSubheading: 'यादगीर मॉडल और स्वच्छ भारत मिशन 2.0 के ज़मीनी अनुभवों पर आधारित',
    feature1Title: 'लाइव जीपीएस भू-टैग फोटो रिपोर्टिंग',
    feature1Desc: 'लाइव लोकेशन ग्रैस्पर और AI कंप्यूटर विज़न सत्यापन के साथ अवैध कचरा डंप की रिपोर्ट करें।',
    feature2Title: 'सुविधा और ग्रिड निकटता लोकेटर',
    feature2Desc: 'निकटतम बायोमेथेनेशन प्लांट, सूखा कचरा पुनर्चक्रण केंद्र और कबाड़ खरीदारों को खोजें।',
    feature3Title: 'स्वच्छ सर्वेक्षण वार्ड रैंकिंग',
    feature3Desc: 'वार्ड स्वच्छता सूचकांक (WCI), समाधान दर और नगरपालिका टिपर प्रतिक्रिया समय को ट्रैक करें।',
    feature4Title: 'हरित पुरस्कार और प्रोत्साहन बाज़ार',
    feature4Desc: 'संपत्ति कर छूट, मुफ्त कंपोस्ट खाद और मेट्रो पास के लिए अपने नागरिक अंकों को भुनाएं।',

    // Landing - Circular Economy
    pipelineBadge: 'चक्रीय अर्थव्यवस्था (सर्कुलर इकोनॉमी)',
    pipelineTitle: 'शून्य-लैंडफिल नगरपालिका पाइपलाइन',
    pipelineDesc: 'स्वच्छऐप नागरिक इनपुट को सीधे नवीकरणीय ग्रिड उत्पादन में कैसे परिवर्तित करता है।',
    pipelineStep1: 'स्रोत पर कचरा पृथक्करण',
    pipelineStep1Desc: 'घरों और दुकानों में गीले (हरा), सूखे (नीला) और खतरनाक (लाल) कचरे का विभाजन।',
    pipelineStep2: 'स्मार्ट GIS आधारित संग्रहण',
    pipelineStep2Desc: 'नागरिकों की लाइव डंप रिपोर्ट के आधार पर सोलर इलेक्ट्रिक टिपर की तत्काल रवानगी।',
    pipelineStep3: 'बायोमेथेनेशन प्रक्रिया',
    pipelineStep3Desc: 'गीले कचरे से कंप्रेस्ड बायो-गैस (CBG) और उच्च गुणवत्ता वाली जैविक खाद का निर्माण।',
    pipelineStep4: 'ग्रिड विद्युत उत्पादन',
    pipelineStep4Desc: 'सूखे अपशिष्ट को वेस्ट-टू-एनर्जी संयंत्रों में टरबाइन के माध्यम से बिजली में बदलना।',

    // Landing - Call to Action
    ctaHeading: 'क्या आप भारत की स्वच्छता क्रांति का नेतृत्व करने के लिए तैयार हैं?',
    ctaSubheading: 'अवैध कचरे की रिपोर्ट करें, हरित पुरस्कार अर्जित करें और अपने वार्ड को #1 बनाएं।',
    ctaButton: 'निःशुल्क खाता बनाएं',

    // Report Page
    reportPageTitle: 'अवैध कचरा डंप की रिपोर्ट करें',
    reportPageSubtitle: 'AI-सत्यापित भू-टैग्ड रिपोर्टिंग और वास्तविक समय स्वच्छता टिपर रवानगी।',
    step1Photo: '1. डंप स्थल की फोटो *',
    takePhoto: 'फोटो खींचें / अपलोड करें',
    reuploadPhoto: 'फोटो बदलें / पुनः खींचें',
    aiAnalyzing: '🔍 AI कचरा सत्यापनकर्ता विश्लेषण कर रहा है...',
    aiAnalyzingDesc: 'यह सुनिश्चित करने के लिए MobileNetV2 मॉडल चल रहा है कि यह वास्तविक कचरा है',
    aiRejectedTitle: '⚠️ फोटो अस्वीकृत — कचरा नहीं पाया गया',
    aiRejectedDesc: 'हमारे AI विज़न मॉडल ने निर्धारित किया है कि इस छवि में कचरा सामग्री नहीं है। केवल वास्तविक कचरा, गंदगी के ढेर या अवैध डंपिंग साइट की तस्वीरें ही स्वीकार की जाती हैं।',
    aiRejectedBtn: 'दूसरी फोटो अपलोड करें',
    step2Category: '2. कचरा वर्गीकरण *',
    step3Severity: '3. गंभीरता एवं कचरे की मात्रा *',
    step4Location: '4. लाइव लोकेशन ग्रैस्पर (सटीक जीपीएस) *',
    step5VoiceNote: '5. वॉयस नोट / ऑडियो लैंडमार्क (वैकल्पिक)',
    step6Description: '6. स्थल विवरण एवं पहचान चिन्ह *',
    descPlaceholder: 'सटीक पहचान चिन्ह बताएं (उदा. मेट्रो पिलर 42 के पीछे, पार्क के कोने के पास)...',
    submittingReport: 'स्थान पर टिपर रवाना किया जा रहा है...',
    submitReportBtn: 'नगरपालिका नियंत्रण कक्ष को रिपोर्ट भेजें',

    // Location Grasper
    locationGrasperTitle: 'लाइव जीपीएस लोकेशन ग्रैस्पर',
    graspLocationBtn: 'लाइव जीपीएस लोकेशन प्राप्त करें',
    graspingGps: 'सटीक उपग्रह निर्देशांक प्राप्त किए जा रहे हैं...',
    gpsAccuracy: 'जीपीएस सटीकता',
    gpsCoords: 'निर्देशांक (Coordinates)',
    geocodedAddress: 'खोजा गया पता',
    reGraspBtn: 'पुनः लोकेशन प्राप्त करें',
    gpsLocked: 'सटीक जीपीएस लॉक प्राप्त हुआ',
    gpsSimulated: 'अनुकरण निर्देशांक का उपयोग हो रहा है (सटीक लॉक के लिए जीपीएस अनुमति दें)।',
    continuousTracking: 'निरंतर जीपीएस ट्रैकिंग',

    // Voice Note
    voiceNoteTitle: 'ऑडियो लैंडमार्क वॉयस नोट',
    startRecording: 'वॉयस नोट रिकॉर्ड करने के लिए दबाएं',
    stopRecording: 'रिकॉर्डिंग समाप्त करें',
    recordingInProgress: 'आवाज़ में दिशा-निर्देश रिकॉर्ड हो रहे हैं...',
    audioRecorded: 'ऑडियो लैंडमार्क रिकॉर्ड हो गया',
    deleteAudio: 'ऑडियो हटाएं',

    // Report Confirmation
    reportSubmittedTitle: 'घटना सफलतापूर्वक दर्ज और टिपर रवाना! 🎉',
    reportSubmittedSubtitle: 'आपकी रिपोर्ट AI द्वारा सत्यापित कर दी गई है और नगरपालिका स्वच्छता बेड़े को सौंप दी गई है।',
    assignedTipper: 'आवंटित नगरपालिका टिपर',
    tipperDriver: 'चालक / स्वच्छता कर्मी',
    tipperEta: 'अनुमानित आगमन समय (ETA)',
    tipperRoute: 'मार्ग स्थिति',
    viewInDashboard: 'नागरिक डैशबोर्ड में देखें',
    reportAnother: 'एक और डंप रिपोर्ट करें',

    // Dashboard
    civicImpactPortal: 'नागरिक प्रभाव पोर्टल • लाइव सक्रिय',
    welcomeUser: 'नमस्ते',
    civicStreak: '🔥 7-दिवसीय सक्रिय नागरिक स्वच्छता स्ट्रीक',
    reportIllegalDumpBtn: 'अवैध डंप रिपोर्ट करें',
    locatePlantsBtn: 'संयंत्र खोजें',
    metricMyReports: 'मेरी डंप रिपोर्टें',
    metricMyReportsDesc: 'स्वच्छता टीम को प्रेषित',
    metricResolved: 'सफाई पूर्ण एवं सत्यापित',
    metricResolvedDesc: 'पूरी तरह साफ किए गए स्थल',
    metricCivicPoints: 'नागरिक अंक शेष',
    metricCivicPointsDesc: 'टैक्स छूट और खाद के लिए भुनाने योग्य',
    metricChampionRank: 'चैंपियन स्तर',
    greenRewardsTitle: 'हरित पुरस्कार एवं वाउचर',
    greenRewardsSubtitle: 'अपने नागरिक अंकों को नगरपालिका प्रोत्साहनों में बदलें',
    redeemBtn: 'भुनाएं',
    wardLeaderboardTitle: 'स्वच्छ सर्वेक्षण वार्ड रैंकिंग',
    wardLeaderboardSubtitle: 'लाइव वार्ड स्वच्छता सूचकांक (WCI) और टिपर प्रतिक्रिया समय',
    wardRank: 'रैंक',
    wardName: 'नगरपालिका वार्ड',
    wardZone: 'ज़ोन',
    wardWci: 'स्वच्छता सूचकांक (WCI)',
    wardCleanupRate: 'समाधान दर',
    wardSla: 'औसत प्रतिक्रिया समय',
    wardChampions: 'सक्रिय नागरिक',
    wasteDistTitle: 'नगरपालिका अपशिष्ट श्रेणी वितरण',
    totalReportsRegistered: 'कुल पंजीकृत रिपोर्टें',
    myRecentReportsTitle: 'मेरी हालिया रिपोर्टें',
    noReportsYet: 'अभी तक कोई रिपोर्ट दर्ज नहीं की गई है।',
    reportFirstDump: 'अपनी पहली रिपोर्ट दर्ज करें',

    // Facilities
    facilitiesTitle: 'GIS अपशिष्ट प्रसंस्करण ग्रिड और फ्लीट ट्रैकर',
    facilitiesSubtitle: 'विकेंद्रीकृत बायोमेथेनेशन संयंत्र, सूखा कचरा केंद्र और लाइव टिपर खोजें।',
    scrapRatesTitle: 'दैनिक कबाड़ खरीद दरें (यादगीर मार्केट इंडेक्स)',
    scrapRatesSubtitle: 'साफ पृथक्कृत पुनर्चक्रण योग्य कचरे के लिए आधिकारिक नगरपालिका दरें।',
    liveFleetTitle: 'लाइव नगरपालिका इलेक्ट्रिक टिपर फ्लीट टेलीमैटिक्स',
    liveFleetSubtitle: 'इलेक्ट्रिक संग्रहण वाहनों की वास्तविक समय स्थिति और बैटरी स्तर।',
    allFacilities: 'सभी सुविधाएं',
    biomethanisationTab: 'बायोमेथेनेशन',
    dryWasteTab: 'सूखा कचरा / MRF',
    hazardousTab: 'खतरनाक / PPE',
    wasteToEnergyTab: 'वेस्ट-टू-एनर्जी',
    scrapBuyersTab: 'कबाड़ खरीदार',
    plantCapacity: 'संयंत्र क्षमता',
    operatingHours: 'कार्य समय',
    acceptedWaste: 'स्वीकार्य कचरा',
    contactDesk: 'संपर्क डेस्क',
    getDirections: 'दिशा-निर्देश प्राप्त करें',

    // Admin
    adminTitle: 'स्वच्छ भारत नगरपालिका प्रशासन',
    adminSubtitle: 'वास्तविक समय समीक्षा, सत्यापन, टिपर प्रेषण और आधिकारिक ऑडिट रिपोर्टिंग।',
    exportCsvBtn: 'स्वच्छ भारत दैनिक ऑडिट CSV डाउनलोड करें',
    totalIncidents: 'कुल घटनाएं',
    awaitingReview: 'कार्रवाई हेतु लंबित',
    resolvedVerified: 'समाधानित एवं सत्यापित',
    avgTurnaround: 'औसत समाधान समय (SLA)',
    incidentManagement: 'घटना प्रबंधन एवं सफाई पूर्व/पश्चात सत्यापन',
    officerDesk: 'वार्ड अधिकारी डेस्क',
    verifyCleanupBtn: 'सफाई सत्यापित करें (पहले / बाद में)',
    beforeCleanup: 'सफाई से पहले (नागरिक रिपोर्ट)',
    afterCleanup: 'सफाई के बाद का प्रमाण (स्वच्छता अधिकारी)',
    uploadAfterPhoto: 'सफाई के बाद की सत्यापन फोटो अपलोड करें',
    markAsResolved: 'घटना को सत्यापित एवं पूर्ण घोषित करें',

    // Waste Categories
    catWetOrganic: 'गीला / जैविक कचरा',
    catWetOrganicDesc: 'रसोई का कचरा, फलों-सब्जियों के छिलके, बगीचे की पत्तियां',
    catDryRecyclable: 'सूखा / पुनर्चक्रण योग्य',
    catDryRecyclableDesc: 'प्लास्टिक की बोतलें, गत्ते, कागज, डिब्बे, कांच',
    catHazardous: 'खतरनाक / जैव-चिकित्सीय',
    catHazardousDesc: 'बैटरी, सीरिंज, रसायन, संक्रमित मास्क व दस्ताने',
    catEWaste: 'ई-अपशिष्ट',
    catEWasteDesc: 'केबल, पुराने चार्जर, इलेक्ट्रॉनिक्स, बल्ब',
    catConstruction: 'निर्माण एवं विध्वंस मलबा',
    catConstructionDesc: 'सीमेंट, प्लास्टर, टूटी टाइलें, रेत का ढेर',
    catMixed: 'मिश्रित / अवर्गीकृत कचरा',
    catMixedDesc: 'सड़क पर पड़ा मिश्रित कचरा जिसका तत्काल पृथक्करण आवश्यक है',
  },
};

type Translations = typeof TRANSLATIONS.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'hi') {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    }
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
