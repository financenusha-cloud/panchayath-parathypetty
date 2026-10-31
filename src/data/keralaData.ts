import { KeralaDistrict, AuthorityOfficer } from '@/types/grievance';

export const KERALA_DISTRICTS: KeralaDistrict[] = [
  {
    id: 'TVM',
    nameEn: 'Thiruvananthapuram',
    nameMl: 'തിരുവനന്തപുരം',
    panchayats: [
      { id: 'venganoor', nameEn: 'Venganoor Grama Panchayat', nameMl: 'വെങ്ങാനൂർ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 20 },
      { id: 'kalliyoor', nameEn: 'Kalliyoor Grama Panchayat', nameMl: 'കള്ളിക്കാട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'pothencode', nameEn: 'Pothencode Grama Panchayat', nameMl: 'പോത്തൻകോട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 19 },
      { id: 'kattakada', nameEn: 'Kattakada Grama Panchayat', nameMl: 'കാട്ടാക്കട ഗ്രാമപഞ്ചായത്ത്', wardsCount: 21 },
    ],
  },
  {
    id: 'KLM',
    nameEn: 'Kollam',
    nameMl: 'കൊല്ലം',
    panchayats: [
      { id: 'an实行chal', nameEn: 'Anchal Grama Panchayat', nameMl: 'അഞ്ചൽ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 19 },
      { id: 'kundara', nameEn: 'Kundara Grama Panchayat', nameMl: 'കുണ്ടറ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 20 },
      { id: 'mayyanad', nameEn: 'Mayyanad Grama Panchayat', nameMl: 'മയ്യനാട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
    ],
  },
  {
    id: 'ALP',
    nameEn: 'Alappuzha',
    nameMl: 'ആലപ്പുഴ',
    panchayats: [
      { id: 'mararikulam-north', nameEn: 'Mararikulam North Grama Panchayat', nameMl: 'മാരാരിക്കുളം വടക്ക് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'kavalam', nameEn: 'Kavalam Grama Panchayat', nameMl: 'കാവാലം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
      { id: 'champakulam', nameEn: 'Champakulam Grama Panchayat', nameMl: 'ചമ്പക്കുളം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 17 },
      { id: 'muhamma', nameEn: 'Muhamma Grama Panchayat', nameMl: 'മുഹമ്മ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
    ],
  },
  {
    id: 'KTM',
    nameEn: 'Kottayam',
    nameMl: 'കോട്ടയം',
    panchayats: [
      { id: 'kumarakom', nameEn: 'Kumarakom Grama Panchayat', nameMl: 'കുമരകം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
      { id: 'ayarkunnam', nameEn: 'Ayarkunnam Grama Panchayat', nameMl: 'അയർക്കുന്നം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'athirampuzha', nameEn: 'Athirampuzha Grama Panchayat', nameMl: 'അതിരമ്പുഴ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 22 },
    ],
  },
  {
    id: 'EKM',
    nameEn: 'Ernakulam',
    nameMl: 'എറണാകുളം',
    panchayats: [
      { id: 'cheranalloor', nameEn: 'Cheranalloor Grama Panchayat', nameMl: 'ചേരാനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 17 },
      { id: 'kumbalangi', nameEn: 'Kumbalangi Model Tourism Grama Panchayat', nameMl: 'കുമ്പളങ്ങി മാതൃകാ വിനോദസഞ്ചാര ഗ്രാമപഞ്ചായത്ത്', wardsCount: 17 },
      { id: 'vazhakulam', nameEn: 'Vazhakulam Grama Panchayat', nameMl: 'വാഴക്കുളം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 20 },
      { id: 'mulanthuruthy', nameEn: 'Mulanthuruthy Grama Panchayat', nameMl: 'മുളന്തുരുത്തി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
    ],
  },
  {
    id: 'TSR',
    nameEn: 'Thrissur',
    nameMl: 'തൃശ്ശൂർ',
    panchayats: [
      { id: 'anthikad', nameEn: 'Anthikad Grama Panchayat', nameMl: 'അന്തിക്കാട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
      { id: 'cherpu', nameEn: 'Cherpu Grama Panchayat', nameMl: 'ചേർപ്പ് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 19 },
      { id: 'wadakkanchery', nameEn: 'Thekkumkara Grama Panchayat', nameMl: 'തെക്കുംകര ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
    ],
  },
  {
    id: 'PLK',
    nameEn: 'Palakkad',
    nameMl: 'പാലക്കാട്',
    panchayats: [
      { id: 'kollengode', nameEn: 'Kollengode Grama Panchayat', nameMl: 'കൊല്ലങ്കോട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'agali', nameEn: 'Agali Attappady Grama Panchayat', nameMl: 'അഗളി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 21 },
      { id: 'alathur', nameEn: 'Alathur Grama Panchayat', nameMl: 'ആലത്തൂർ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 19 },
    ],
  },
  {
    id: 'MLP',
    nameEn: 'Malappuram',
    nameMl: 'മലപ്പുറം',
    panchayats: [
      { id: 'edavanna', nameEn: 'Edavanna Grama Panchayat', nameMl: 'എടവണ്ണ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 22 },
      { id: 'kondotty', nameEn: 'Kondotty Grama Panchayat', nameMl: 'കൊണ്ടോട്ടി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 21 },
      { id: 'nilambur_gp', nameEn: 'Chungathara Grama Panchayat', nameMl: 'ചുങ്കത്തറ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 20 },
    ],
  },
  {
    id: 'KKD',
    nameEn: 'Kozhikode',
    nameMl: 'കോഴിക്കോട്',
    panchayats: [
      { id: 'kunnamangalam', nameEn: 'Kunnamangalam Grama Panchayat', nameMl: 'കുന്നമംഗലം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 23 },
      { id: 'balusseri', nameEn: 'Balusseri Grama Panchayat', nameMl: 'ബാലുശ്ശേരി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 19 },
      { id: 'olavanna', nameEn: 'Olavanna Grama Panchayat', nameMl: 'ഒളവണ്ണ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 23 },
    ],
  },
  {
    id: 'WYD',
    nameEn: 'Wayanad',
    nameMl: 'വയനാട്',
    panchayats: [
      { id: 'meppadi', nameEn: 'Meppadi Grama Panchayat', nameMl: 'മേപ്പാടി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 22 },
      { id: 'vythiri', nameEn: 'Vythiri Grama Panchayat', nameMl: 'വൈത്തിരി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 15 },
      { id: 'panamaram', nameEn: 'Panamaram Grama Panchayat', nameMl: 'പനമരം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 21 },
    ],
  },
  {
    id: 'KNR',
    nameEn: 'Kannur',
    nameMl: 'കണ്ണൂർ',
    panchayats: [
      { id: 'mayyil', nameEn: 'Mayyil Grama Panchayat', nameMl: 'മയ്യിൽ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'dharmadam', nameEn: 'Dharmadam Grama Panchayat', nameMl: 'ധർമ്മടം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 17 },
      { id: 'pinayi', nameEn: 'Pinarayi Grama Panchayat', nameMl: 'പിണറായി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 19 },
    ],
  },
  {
    id: 'KSD',
    nameEn: 'Kasaragod',
    nameMl: 'കാസർഗോഡ്',
    panchayats: [
      { id: 'madhur', nameEn: 'Madhur Grama Panchayat', nameMl: 'മധൂർ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 20 },
      { id: 'chemnad', nameEn: 'Chemnad Grama Panchayat', nameMl: 'ചെമ്മനാട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 23 },
      { id: 'udma', nameEn: 'Udma Grama Panchayat', nameMl: 'ഉദുമ ഗ്രാമപഞ്ചായത്ത്', wardsCount: 21 },
    ],
  },
  {
    id: 'IDK',
    nameEn: 'Idukki',
    nameMl: 'ഇടുക്കി',
    panchayats: [
      { id: 'kattappana', nameEn: 'Vandanmedu Grama Panchayat', nameMl: 'വണ്ടൻമേട് ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'munnar', nameEn: 'Devikulam Grama Panchayat', nameMl: 'ദേവികുളം ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
      { id: 'adimali', nameEn: 'Adimali Grama Panchayat', nameMl: 'അടിമാലി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 21 },
    ],
  },
  {
    id: 'PTA',
    nameEn: 'Pathanamthitta',
    nameMl: 'പത്തനംതിട്ട',
    panchayats: [
      { id: 'konni', nameEn: 'Konni Grama Panchayat', nameMl: 'കോന്നി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'aranmula', nameEn: 'Aranmula Heritage Grama Panchayat', nameMl: 'ആറന്മുള ഗ്രാമപഞ്ചായത്ത്', wardsCount: 18 },
      { id: 'ranni', nameEn: 'Ranni Grama Panchayat', nameMl: 'റാന്നി ഗ്രാമപഞ്ചായത്ത്', wardsCount: 16 },
    ],
  },
];

export const AUTHORITY_ROLES: {
  role: AuthorityOfficer['role'];
  nameEn: string;
  nameMl: string;
  descriptionEn: string;
  descriptionMl: string;
  defaultOfficialEn: string;
  defaultOfficialMl: string;
  jurisdiction: string;
}[] = [
  {
    role: 'PRESIDENT',
    nameEn: 'Grama Panchayat President',
    nameMl: 'ഗ്രാമപഞ്ചായത്ത് പ്രസിഡന്റ്',
    descriptionEn: 'Elected head of the Panchayat for major policy issues, road connectivity, disaster relief & general governance.',
    descriptionMl: 'പഞ്ചായത്തിന്റെ ഭരണത്തലവൻ. പ്രധാന നയപരമായ പ്രശ്നങ്ങൾ, ദുരിതാശ്വാസം, പൊതു വികസനം.',
    defaultOfficialEn: 'Adv. S. K. Radhakrishnan',
    defaultOfficialMl: 'അഡ്വ. എസ്. കെ. രാധാകൃഷ്ണൻ',
    jurisdiction: 'Entire Panchayat (ഭരണ സമതി)',
  },
  {
    role: 'SECRETARY',
    nameEn: 'Panchayat Secretary (Executive Officer)',
    nameMl: 'പഞ്ചായത്ത് സെക്രട്ടറി (എക്സിക്യൂട്ടീവ് ഓഫീസർ)',
    descriptionEn: 'Chief Executive Officer of LSGD for administrative orders, official certificates, license issues, and legal notices.',
    descriptionMl: 'പഞ്ചായത്ത് ഭരണനിർവ്വഹണ ഉദ്യോഗസ്ഥൻ. സർട്ടിഫിക്കറ്റുകൾ, ലൈസൻസുകൾ, നിയമപരമായ കാര്യങ്ങൾ.',
    defaultOfficialEn: 'Smt. K. Sunitha Devi, LSGD Exec. Cadre',
    defaultOfficialMl: 'ശ്രീമതി കെ. സുനിതാ ദേവി, LSGD',
    jurisdiction: 'Office of the Grama Panchayat',
  },
  {
    role: 'WARD_MEMBER',
    nameEn: 'Respective Ward Member',
    nameMl: 'വാർഡ് മെമ്പർ (ജനപ്രതിനിധി)',
    descriptionEn: 'Your directly elected local representative for neighborhood roads, drainage, streetlights, and local disputes.',
    descriptionMl: 'വാർഡിലെ ജനപ്രതിനിധി. ഇടവഴികൾ, സ്ട്രീറ്റ് ലൈറ്റുകൾ, കലുങ്കുകൾ, പ്രാദേശിക പ്രശ്നങ്ങൾ.',
    defaultOfficialEn: 'Sri. M. Jayakumar (Ward Representative)',
    defaultOfficialMl: 'ശ്രീ. എം. ജയകുമാർ (വാർഡ് മെമ്പർ)',
    jurisdiction: 'Citizen’s Specific Ward (വാർഡ് തലം)',
  },
  {
    role: 'ASSISTANT_ENGINEER',
    nameEn: 'Assistant Engineer (LSGD Engineering Wing)',
    nameMl: 'അസിസ്റ്റന്റ് എഞ്ചിനീയർ (തദ്ദേശ സ്വയംഭരണ എഞ്ചിനീയറിംഗ് വിഭാഗം)',
    descriptionEn: 'In charge of Panchayat roads, culverts, building permits, public bridges, water pipe leak repair coordination.',
    descriptionMl: 'പഞ്ചായത്ത് റോഡുകൾ, ഓടകൾ, പാലങ്ങൾ, കട്ടിംഗുകൾ, കെട്ടിട നിർമ്മാണ പെർമിറ്റ്.',
    defaultOfficialEn: 'Er. Thomas V. Mathew, B.Tech Civil',
    defaultOfficialMl: 'എൻജി. തോമസ് വി. മാത്യു',
    jurisdiction: 'Engineering & Public Works Wing',
  },
  {
    role: 'HEALTH_INSPECTOR',
    nameEn: 'Health Inspector / JHI',
    nameMl: 'ഹെൽത്ത് ഇൻസ്പെക്ടർ / ജെ.എച്ച്.ഐ',
    descriptionEn: 'In charge of solid waste dumping, Haritha Karma Sena coordination, infectious diseases, water contamination & public nuisance.',
    descriptionMl: 'മാലിന്യ സംസ്കരണം, ഹരിത കർമ്മസേന, പകർച്ചവ്യാധി നിയന്ത്രണം, ശുചിത്വ പ്രശ്നങ്ങൾ.',
    defaultOfficialEn: 'Sri. Rajesh Kumar K., Health Dept',
    defaultOfficialMl: 'ശ്രീ. രാജേഷ് കുമാർ കെ. (ആരോഗ്യ വിഭാഗം)',
    jurisdiction: 'Public Health & Sanitation Wing',
  },
  {
    role: 'VILLAGE_EXTENSION_OFFICER',
    nameEn: 'Village Extension Officer (VEO)',
    nameMl: 'വില്ലേജ് എക്സ്റ്റൻഷൻ ഓഫീസർ (VEO)',
    descriptionEn: 'Officer for Life Mission Housing scheme, welfare pensions, BPL subsidies, Ayyankali Urban/Rural Employment guarantee.',
    descriptionMl: 'ലൈഫ് മിഷൻ വീടുകൾ, ക്ഷേമ പെൻഷനുകൾ, തൊഴിലുറപ്പ് പദ്ധതി, സബ്സിഡികൾ.',
    defaultOfficialEn: 'Smt. Priya Chandran, VEO Grade-I',
    defaultOfficialMl: 'ശ്രീമതി പ്രിയാ ചന്ദ്രൻ, VEO',
    jurisdiction: 'Rural Development & Social Welfare',
  },
  {
    role: 'AGRICULTURAL_OFFICER',
    nameEn: 'Agricultural Officer (Krishi Bhavan)',
    nameMl: 'കൃഷി ഓഫീസർ (കൃഷിഭവൻ)',
    descriptionEn: 'Officer for crop damage compensation, paddy wetland issues, seed/fertilizer subsidies, pest attack containment.',
    descriptionMl: 'വിളനാശ നഷ്ടപരിഹാരം, കൃഷി സഹായങ്ങൾ, വിത്ത്-വളം സബ്സിഡി, കൃഷിഭവൻ ആനുകൂല്യങ്ങൾ.',
    defaultOfficialEn: 'Dr. Ananya Mohan, B.Sc (Agri)',
    defaultOfficialMl: 'ഡോ. അനന്യ മോഹൻ, കൃഷിഭവൻ',
    jurisdiction: 'Krishi Bhavan Office',
  },
  {
    role: 'KUDUMBASHREE_CDS',
    nameEn: 'CDS Chairperson (Kudumbashree)',
    nameMl: 'സി.ഡി.എസ് ചെയർപേഴ്സൺ (കുടുംബശ്രീ)',
    descriptionEn: 'Community Development Society head for women neighborhood groups (NHG/ADS), micro-enterprises & elderly care.',
    descriptionMl: 'കുടുംബശ്രീ അയൽക്കൂട്ടങ്ങൾ, വായ്പാ സഹായങ്ങൾ, വനിതാ സംരംഭങ്ങൾ, വയോജന സഹായം.',
    defaultOfficialEn: 'Smt. Lathika Sasidharan, CDS Chairperson',
    defaultOfficialMl: 'ശ്രീമതി ലതിക ശശിധരൻ',
    jurisdiction: 'Kudumbashree CDS Office',
  },
];

export const GRIEVANCE_CATEGORIES = [
  {
    id: 'roads_infrastructure',
    titleEn: 'Roads, Bridges & Public Works',
    titleMl: 'റോഡുകൾ, കലുങ്കുകൾ & പൊതുമരാമത്ത്',
    defaultRole: 'ASSISTANT_ENGINEER' as const,
    icon: 'Hammer',
  },
  {
    id: 'sanitation_waste',
    titleEn: 'Sanitation, Waste Dumping & Public Nuisance',
    titleMl: 'മാലിന്യ നിർമ്മാർജ്ജനം & ശുചിത്വം',
    defaultRole: 'HEALTH_INSPECTOR' as const,
    icon: 'Trash2',
  },
  {
    id: 'streetlights_water',
    titleEn: 'Street Lights & Drinking Water Supply',
    titleMl: 'തെരുവ് വിളക്കുകൾ & കുടിവെള്ള വിതരണം',
    defaultRole: 'WARD_MEMBER' as const,
    icon: 'Lightbulb',
  },
  {
    id: 'life_mission_housing',
    titleEn: 'Life Mission Housing & Welfare Schemes',
    titleMl: 'ലൈഫ് മിഷൻ വീട് & ക്ഷേമ പദ്ധതികൾ',
    defaultRole: 'VILLAGE_EXTENSION_OFFICER' as const,
    icon: 'Home',
  },
  {
    id: 'agriculture_compensation',
    titleEn: 'Crop Loss, Flood Damage & Krishi Bhavan',
    titleMl: 'വിളനാശം, കൃഷിഭവൻ സഹായങ്ങൾ & ദുരിതാശ്വാസം',
    defaultRole: 'AGRICULTURAL_OFFICER' as const,
    icon: 'Sprout',
  },
  {
    id: 'licensing_certificates',
    titleEn: 'Certificates, Trade Licenses & Legal Orders',
    titleMl: 'സർട്ടിഫിക്കറ്റുകൾ, വ്യാപാര ലൈസൻസ് & പെർമിറ്റുകൾ',
    defaultRole: 'SECRETARY' as const,
    icon: 'FileText',
  },
  {
    id: 'women_elderly_welfare',
    titleEn: 'Kudumbashree & Elderly/Child Welfare',
    titleMl: 'കുടുംബശ്രീ & വനിതാ-ശിശു-വയോജന ക്ഷേമം',
    defaultRole: 'KUDUMBASHREE_CDS' as const,
    icon: 'Users',
  },
  {
    id: 'policy_emergency_relief',
    titleEn: 'Presidential Redressal & Emergency Interventions',
    titleMl: 'പ്രസിഡന്റിന്റെ അടിയന്തര ഇടപെടൽ & പൊതു പ്രശ്നങ്ങൾ',
    defaultRole: 'PRESIDENT' as const,
    icon: 'Award',
  },
];
