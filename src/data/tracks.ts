import { CourseTrack } from '@/types';

export const TRACK_ID_ALIASES: Record<string, string> = {
  'software-engineering': 'web-development',
  'solar-energy': 'solar-technology',
  'data-ai-essentials': 'data-analyses',
};

export function findTrackById(id?: string): CourseTrack | undefined {
  if (!id) return undefined;
  const resolvedId = TRACK_ID_ALIASES[id] || id;
  return TRACKS.find((t) => t.id === resolvedId);
}

export const TRACKS: CourseTrack[] = [
  // --- TECH TRACKS (7) ---
  {
    id: 'web-development',
    title: 'Web Development',
    category: 'Tech',
    tagline: 'Build scalable modern web applications and APIs from ground up.',
    description:
      'Master front-end and back-end development with HTML5, CSS3, modern JavaScript/TypeScript, React, Next.js, and Node.js. Build production-grade apps, integrate databases, and deploy live.',
    durationWeeks: 12,
    skills: ['Frontend Architecture', 'Backend REST APIs', 'Database Modeling', 'Git & CI/CD', 'Authentication Systems'],
    toolsCovered: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git & GitHub'],
    careerRoles: ['Frontend Developer', 'Fullstack Engineer', 'Junior Software Engineer'],
    prerequisites: 'Basic computer literacy and a laptop (Windows/Mac/Linux).',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      border: 'border-teal-500',
    },
    featured: true,
  },
  {
    id: 'uiux-design',
    title: 'UI/UX & Product Design',
    category: 'Tech',
    tagline: 'Design intuitive, high-converting digital interfaces and user experiences.',
    description:
      'Understand human-computer interaction, user research, wireframing, interactive prototyping, and design systems in Figma. Graduate with a multi-case-study portfolio.',
    durationWeeks: 10,
    skills: ['User Research', 'Information Architecture', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing'],
    toolsCovered: ['Figma', 'FigJam', 'Whimsical', 'Notion', 'Adobe Illustrator Essentials'],
    careerRoles: ['UI Designer', 'UX Researcher', 'Product Designer'],
    prerequisites: 'Creativity, keen attention to detail, and a computer with internet access.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      border: 'border-orange-500',
    },
    featured: true,
  },
  {
    id: 'cloud-ai-engineering',
    title: 'Cloud Computing & AI Engineering',
    category: 'Tech',
    tagline: 'Architect scalable cloud infrastructure and build generative AI-powered applications.',
    description:
      'Master cloud foundations (AWS/Azure), containerization with Docker, serverless architectures, and modern generative AI engineering. Learn to integrate LLM APIs, build RAG pipelines, and deploy resilient cloud services.',
    durationWeeks: 12,
    skills: ['Cloud Infrastructure', 'Docker & Containers', 'Generative AI & LLM APIs', 'Serverless Architecture', 'CI/CD & DevOps Basics'],
    toolsCovered: ['AWS / Azure', 'Docker', 'Python', 'OpenAI & Claude APIs', 'LangChain', 'Terraform Basics'],
    careerRoles: ['Cloud Support Associate', 'AI Solutions Engineer', 'Junior DevOps Specialist', 'Cloud Systems Admin'],
    prerequisites: 'Basic programming concepts and a laptop with stable internet connection.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      border: 'border-sky-500',
    },
    featured: true,
  },
  {
    id: 'data-analyses',
    title: 'Data Analyses',
    category: 'Tech',
    tagline: 'Turn raw datasets into strategic intelligence and automated business dashboards.',
    description:
      'Learn end-to-end data processing: data wrangling in Advanced Excel, database querying with SQL, interactive dashboards in PowerBI, Python analytics (Pandas, Matplotlib), and modern predictive analytics.',
    durationWeeks: 12,
    skills: ['Data Cleaning & ETL', 'SQL Querying', 'Interactive Dashboards', 'Business Intelligence', 'Predictive Modeling'],
    toolsCovered: ['Excel Advanced', 'PowerBI', 'SQL (PostgreSQL)', 'Python (Pandas/Matplotlib)', 'Tableau Essentials'],
    careerRoles: ['Data Analyst', 'Business Intelligence Associate', 'Operations Analyst', 'Reporting Specialist'],
    prerequisites: 'Basic math and logic; willingness to work with numbers.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      border: 'border-teal-500',
    },
    featured: true,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Network Defense',
    category: 'Tech',
    tagline: 'Protect digital assets, analyze vulnerabilities, and secure enterprise networks.',
    description:
      'Gain hands-on knowledge in networking fundamentals, Linux commands, ethical hacking principles, threat modeling, vulnerability scanning, and security compliance.',
    durationWeeks: 12,
    skills: ['Network Security', 'Vulnerability Assessment', 'Linux Administration', 'Incident Response', 'Identity & Access Management'],
    toolsCovered: ['Wireshark', 'Nmap', 'Kali Linux', 'Burp Suite Community', 'Snort'],
    careerRoles: ['Junior SOC Analyst', 'Cybersecurity Specialist', 'Network Security Associate'],
    prerequisites: 'Curiosity about security and fundamental computing principles.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      border: 'border-slate-700',
    },
    featured: true,
  },
  {
    id: 'cisco-networking',
    title: 'Cisco Networking Academic Training',
    category: 'Tech',
    tagline: 'Configure enterprise routers, switches, IP routing protocols, and prepare for CCNA.',
    description:
      'Comprehensive Cisco Academy-aligned curriculum covering IPv4/IPv6 addressing, routing protocols (OSPF, EIGRP), VLAN segmentation, access control lists (ACLs), switch security, and enterprise network troubleshooting.',
    durationWeeks: 12,
    skills: ['IPv4/IPv6 Subnetting', 'Routing Protocols (OSPF/EIGRP)', 'VLAN & Trunking Protocols', 'Switch Port Security & ACLs', 'Network Diagnostics & Packet Analysis'],
    toolsCovered: ['Cisco Packet Tracer', 'GNS3', 'Wireshark', 'Cisco IOS CLI', 'Putty / Terminal'],
    careerRoles: ['Network Support Engineer', 'Cisco Network Administrator', 'NOC Associate', 'IT Infrastructure Specialist'],
    prerequisites: 'Basic computer literacy and interest in telecommunications & networks.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      border: 'border-blue-500',
    },
    featured: false,
  },
  {
    id: 'robotics',
    title: 'Robotics',
    category: 'Tech',
    tagline: 'Design, program, and build intelligent robots, microcontrollers, and automated systems.',
    description:
      'Practical hardware and embedded software engineering: microcontroller programming (Arduino, ESP32, Raspberry Pi), sensor integration, motor actuation, circuit prototyping, and autonomous robotic control logic.',
    durationWeeks: 10,
    skills: ['Microcontroller Programming', 'Sensor Interfacing & Telemetry', 'Motor Drivers & Actuators', 'Circuit Prototyping & Soldering', 'Autonomous Control Algorithms'],
    toolsCovered: ['Arduino IDE', 'Raspberry Pi / ESP32', 'Tinkercad', 'Soldering Stations', 'Digital Multimeters', 'Servo Motors'],
    careerRoles: ['Robotics Technician', 'Embedded Systems Associate', 'Automation Specialist', 'Hardware Prototyper'],
    prerequisites: 'Analytical curiosity, interest in hardware and software synergy, and a laptop.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      border: 'border-indigo-500',
    },
    featured: false,
  },

  // --- VOCATIONAL TRACKS (5) ---
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    category: 'Vocational',
    tagline: 'Master brand identity, commercial visual graphics, typography, and advertising media.',
    description:
      'Learn commercial design principles: logo creation, brand identity systems, typography, vector illustration, commercial advertising materials, social media graphics, and print production techniques.',
    durationWeeks: 8,
    skills: ['Brand Identity & Logo Design', 'Typography & Visual Hierarchy', 'Vector Art & Illustration', 'Social Media & Ad Creative Design', 'Print Prepress & Production'],
    toolsCovered: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva Pro', 'InDesign Essentials', 'Figma for Graphics'],
    careerRoles: ['Graphic Designer', 'Brand Identity Specialist', 'Creative Visual Designer', 'Freelance Commercial Artist'],
    prerequisites: 'Visual curiosity, eye for aesthetics, and a computer with graphic capabilities.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      border: 'border-orange-500',
    },
    featured: false,
  },
  {
    id: 'fashion-design',
    title: 'Fashion Design and Creative Apparel',
    category: 'Vocational',
    tagline: 'Pattern drafting, couture tailoring, garment construction, and apparel branding.',
    description:
      'From sketching concepts to pattern drafting, cutting, precision stitching, dart manipulation, zipper insertion, and commercial clothing production for men & women.',
    durationWeeks: 12,
    skills: ['Pattern Drafting & Cutting', 'Industrial Sewing Machine Operation', 'Garment Assembly & Finishing', 'Fabric Selection', 'Fashion Entrepreneurship'],
    toolsCovered: ['Industrial Straight Stitch Machines', 'Overlocking/Sergers', 'French Curves', 'Measuring Tapes', 'Steam Irons'],
    careerRoles: ['Fashion Designer', 'Custom Tailor', 'Apparel Brand Owner'],
    prerequisites: 'Creativity, eye for style, and dedication to hands-on craftsmanship.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      border: 'border-rose-200',
    },
    featured: true,
  },
  {
    id: 'solar-technology',
    title: 'Solar and Inverter Technology',
    category: 'Vocational',
    tagline: 'Design, size, install, and maintain commercial & residential solar power.',
    description:
      'Master PV panel technology, lithium and tubular battery sizing, inverter configurations, charge controllers, earthing, load audits, and troubleshooting.',
    durationWeeks: 8,
    skills: ['Load Calculation & Energy Audits', 'Inverter Sizing & Installation', 'Battery Bank Wiring', 'Roof Mount Structuring', 'System Diagnostics'],
    toolsCovered: ['Digital Multimeters', 'Crimping Tools', 'Solar Meters', 'Angle Grinders', 'Drilling Equipment'],
    careerRoles: ['Solar Installation Technician', 'Renewable Energy Consultant', 'Inverter Maintenance Specialist'],
    prerequisites: 'Physical fitness and passion for green renewable energy.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      border: 'border-amber-500',
    },
    featured: true,
  },
  {
    id: 'agriculture-hydroponics',
    title: 'Agriculture and Hydroponics',
    category: 'Vocational',
    tagline: 'Modern soilless farming, nutrient film hydroponic systems, greenhouse setups, and agribusiness.',
    description:
      'Master sustainable modern farming: hydroponic systems (NFT, DWC, Dutch buckets), nutrient solution formulation, pH/EC monitoring, climate-controlled greenhouse setups, crop propagation, and commercial agribusiness marketing.',
    durationWeeks: 8,
    skills: ['Hydroponic System Construction', 'Nutrient Solution & pH/EC Balancing', 'Greenhouse & Drip Irrigation Setup', 'Seedling Propagation & Soilless Media', 'Agribusiness Financial Modeling & Produce Sales'],
    toolsCovered: ['Digital pH & EC Pens', 'Submersible Pumps & PVC Systems', 'Grow Media (Coco Coir/Perlite)', 'Water Test Kits', 'Greenhouse Netting'],
    careerRoles: ['Hydroponic Farm Manager', 'Modern Agribusiness Entrepreneur', 'Urban Farm Specialist', 'Greenhouse Project Lead'],
    prerequisites: 'Passion for farming innovation, sustainable food security, and hands-on outdoor/greenhouse learning.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      border: 'border-emerald-500',
    },
    featured: true,
  },
  {
    id: 'cctv-iot',
    title: 'CCTV, IOT & Smart Security Systems',
    category: 'Vocational',
    tagline: 'Install IP/Analogue surveillance, biometrics, alarms, and access control.',
    description:
      'Learn IP camera networking, NVR/DVR setup, coaxial and Cat6 crimping, remote phone viewing setups, smart biometric time attendance, and perimeter alarm sensors.',
    durationWeeks: 6,
    skills: ['IP Camera Configuration', 'DVR/NVR Networking', 'Remote Monitoring Setup', 'Biometric Access Control', 'Intruder Alarm Wiring'],
    toolsCovered: ['RJ45 Crimpers', 'Cable Testers', 'Drills', 'BNC Connectors', 'POE Switches'],
    careerRoles: ['Security System Installer', 'CCTV Field Engineer', 'Smart Automation Technician'],
    prerequisites: 'Basic tech familiarity and practical hand-tool interest.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      border: 'border-teal-500',
    },
    featured: true,
  },
];

export const ANNOUNCEMENTS: import('@/types').AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Cohort 1.0 Registration Officially Open!',
    category: 'Cohort Update',
    date: 'Current Session',
    summary:
      'Registration for Switch 1.0 is currently live. Secure your slot in any of the 12 Tech & Vocational tracks.',
    actionLabel: 'Register Now',
    actionUrl: '/register',
    isUrgent: true,
  },
  {
    id: 'ann-2',
    title: 'Physical & Online Centers Allocation Notice',
    category: 'Venue & Timetable',
    date: 'Upcoming',
    summary:
      'Center allocations and specific lecture venue schedules will be published directly in the Student Portal before the orientation date. Keep your registration details safe.',
  },
  {
    id: 'ann-3',
    title: 'Empowerment Partnership Confirmation',
    category: 'General',
    date: 'Active',
    summary:
      'Switch 1.0 is organized in strategic partnership with GOFAMINT Youth Fellowship (GYF) and technical stakeholders to empower youth with high-income skills.',
  },
];
