import { CourseTrack } from '@/types';

export const TRACKS: CourseTrack[] = [
  // --- TECH TRACKS (6) ---
  {
    id: 'software-engineering',
    title: 'Software Engineering & Web Development',
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
    id: 'data-ai-essentials',
    title: 'Data Analysis & AI Essentials',
    category: 'Tech',
    tagline: 'Turn raw datasets into strategic intelligence and leverage AI workflows.',
    description:
      'Learn data wrangling, SQL queries, interactive dashboards in PowerBI, Python analytics libraries, and prompt engineering with modern generative AI tooling.',
    durationWeeks: 12,
    skills: ['Data Cleaning', 'SQL Querying', 'Data Visualization', 'Business Intelligence', 'AI Prompt Engineering'],
    toolsCovered: ['Excel Advanced', 'PowerBI', 'SQL', 'Python (Pandas/Matplotlib)', 'Claude & GPT APIs'],
    careerRoles: ['Data Analyst', 'BI Associate', 'Operations Analyst'],
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
    tagline: 'Protect digital assets, analyze vulnerabilities, and secure networks.',
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
    id: 'digital-marketing',
    title: 'Digital Marketing & Growth',
    category: 'Tech',
    tagline: 'Drive customer acquisition through search, social advertising, and content.',
    description:
      'Execute paid performance marketing (Meta & Google Ads), SEO, content funnels, email automation, analytics attribution, and brand storytelling.',
    durationWeeks: 8,
    skills: ['Performance Marketing', 'SEO & Copywriting', 'Social Media Strategy', 'Email Marketing Automations', 'Ad Analytics'],
    toolsCovered: ['Meta Ads Manager', 'Google Analytics 4', 'Mailchimp', 'Canva', 'SEMrush'],
    careerRoles: ['Digital Marketer', 'Growth Specialist', 'Social Media Strategist'],
    prerequisites: 'Passion for communication, creativity, and brand building.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      border: 'border-orange-500',
    },
  },
  {
    id: 'product-management',
    title: 'Product Management & Tech Operations',
    category: 'Tech',
    tagline: 'Lead products from ideation to launch using Agile & Scrum workflows.',
    description:
      'Develop roadmaps, define PRDs (Product Requirement Documents), coordinate cross-functional engineering and design teams, and optimize product-market fit.',
    durationWeeks: 10,
    skills: ['Agile & Scrum Methodologies', 'Product Roadmapping', 'User Story Mapping', 'Stakeholder Management', 'Go-To-Market Strategy'],
    toolsCovered: ['Jira', 'Trello', 'Miro', 'Mixpanel', 'Slack & Notion'],
    careerRoles: ['Associate Product Manager', 'Product Owner', 'Scrum Master'],
    prerequisites: 'Strong organizational skills and verbal/written communication.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      border: 'border-teal-500',
    },
  },

  // --- VOCATIONAL TRACKS (6) ---
  {
    id: 'solar-energy',
    title: 'Solar Energy & Inverter Systems',
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
    id: 'electrical-wiring',
    title: 'Electrical Wiring & Building Automation',
    category: 'Vocational',
    tagline: 'Safe electrical conduit wiring, distribution boards, and smart home controls.',
    description:
      'Practical training in domestic and industrial wiring standards, circuit breakers, conduit piping, earthing systems, smart switches, and electrical safety codes.',
    durationWeeks: 8,
    skills: ['Single & 3-Phase Wiring', 'Distribution Board (DB) Dressing', 'Smart Switch & IoT Relays', 'Circuit Protection', 'Fault Tracing'],
    toolsCovered: ['Insulated Pliers', 'Voltage Testers', 'Conduit Benders', 'Wire Strippers', 'Meggers'],
    careerRoles: ['Certified Electrician', 'Building Wiring Contractor', 'Smart Automation Installer'],
    prerequisites: 'Safety-first mindset and attention to detail.',
    colorScheme: {
      accent: '#0C4A60',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      border: 'border-blue-500',
    },
  },
  {
    id: 'cctv-iot',
    title: 'CCTV, IoT & Smart Security Systems',
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
  {
    id: 'fashion-design',
    title: 'Fashion Design & Creative Apparel',
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
  },
  {
    id: 'media-production',
    title: 'Media Production & Visual Graphics',
    category: 'Vocational',
    tagline: 'Camera operation, video editing, branding graphics, and motion design.',
    description:
      'Practical training in camera cinematography, three-point lighting, audio recording, Adobe Premiere / DaVinci Resolve editing, thumbnail and branding design.',
    durationWeeks: 8,
    skills: ['Camera & Lighting Setup', 'Audio Recording & Lav Mics', 'Video Color Grading & Montage', 'Brand Graphic Design', 'Social Video Formatting'],
    toolsCovered: ['Premiere Pro', 'DaVinci Resolve', 'Photoshop', 'Gimbal Stabilizers', 'Wireless Microphones'],
    careerRoles: ['Video Editor', 'Content Videographer', 'Media Director'],
    prerequisites: 'Visual curiosity and passion for storytelling.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      border: 'border-orange-500',
    },
  },
  {
    id: 'catering-craft',
    title: 'Professional Catering & Confectionery Craft',
    category: 'Vocational',
    tagline: 'Commercial baking, pastry production, event catering, and food business setup.',
    description:
      'Learn gourmet pastry baking, cake decoration, finger foods & small chops, healthy culinary meals, food sanitation standards, costing, and catering event management.',
    durationWeeks: 8,
    skills: ['Pastry & Bread Baking', 'Cake Artistry & Fondant', 'Finger Foods (Small Chops)', 'Kitchen Hygiene & Food Safety', 'Menu Costing & Catering Logistics'],
    toolsCovered: ['Commercial Mixers', 'Baking Ovens', 'Piping Sets', 'Chafing Dishes', 'Digital Scales'],
    careerRoles: ['Professional Baker', 'Event Caterer', 'Culinary Entrepreneur'],
    prerequisites: 'Love for cooking/baking and strict adherence to cleanliness.',
    colorScheme: {
      accent: '#FF5E14',
      badgeBg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      border: 'border-yellow-500',
    },
  },
];

export const ANNOUNCEMENTS: import('@/types').AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Cohort 1.0 Registration Officially Open!',
    category: 'Cohort Update',
    date: 'Current Session',
    summary:
      'Registration for Switch 1.0 is currently live. Secure your slot in any of the 12 Tech & Vocational tracks with the subsidized token fee of ₦5,000.',
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
    title: 'Partner Empowerment Subsidy Confirmation',
    category: 'General',
    date: 'Active',
    summary:
      'Through partnerships with GOFAMINT Youth Fellowship (GYF) and technical stakeholders, 90% of your training cost is fully subsidized, leaving only the ₦5,000 token fee.',
  },
];
