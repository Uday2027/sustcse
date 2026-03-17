export interface FacultyMember {
  id: string;
  slug: string;
  full_name: string;
  designation: string;
  category: 'head' | 'faculty' | 'retired';
  is_on_leave?: boolean;
  avatar_url: string;
  email?: string;
  phone?: string;
  office_room?: string;
  office_address?: string;
  biography?: string;
  research_areas: string[];
  active_research?: string[];
  previous_research?: string[];
  external_affiliations?: string[];
  qualifications: { degree: string; institution: string; year?: string }[];
  publications: { title: string; journal?: string; year?: string; url?: string }[];
  conferences?: { title: string; venue?: string; year?: string }[];
  teaching?: string[];
  awards?: string[];
  graduate_supervision?: string[];
  personal_website?: string;
  research_profile_links?: { title: string; url: string }[];
}

export const facultyData: FacultyMember[] = [
  {
    id: 'f1',
    slug: 'forhad-rabbi',
    full_name: 'Dr. Md Forhad Rabbi, SMIEEE',
    designation: 'Professor & Head',
    category: 'head',
    avatar_url: '/images/Faculty/Forhad_Rabbi.png',
    email: 'frabbi-cse@sust.edu',
    phone: '+8801844175805',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'Currently, I am a professor at Shahjalal University of Science and Technology (SUST), Bangladesh, in the computer science and engineering department. I am a professor who is involved in and overseeing a number of research projects in the fields of social computing, human-computer interaction, data mining, machine learning, big data, etc. At the moment, I\'m working on a number of projects related to the design and development of mobile applications for minority ethnic groups in Bangladesh, including a virtual reality (VR) app for children with autism spectrum disorder (ASD), an augmented reality (AR) app for the purchase of medication, a mobile app for Early Childhood Development in a developing country, and a VR app for students with ASD. I\'m also helping the digital Sylhet city project by consulting on the hospital\'s automation at Osmani Medical College. My appointment as Pipilika coordinator began in January of 2020 (1st Bangla search engine company in Bangladesh). I\'ve been given the responsibility of leading SUST\'s ICT Cell as of late.\n\nI was a PhD researcher at Australia\'s Curtin University before I started at SUST. Furthermore, I spent two years in Greece working on a European Commission project while on a Marie Curie grant. Throughout my career, I participated on a number of research and development teams centered around software. I recently evaluated the development and deployment of several mobile applications made for farmers and agriculture extension officers as part of my work as an HCI expert for the Consulting Service for Conducting ICT Impact Research of USAID\'s Agriculture Extension Support Activity Project (AESA).',
    research_areas: ['Human Computer Interaction', 'Software Engineering', 'Data Mining', 'ICT4D', 'Social Computing', 'E-Governance', 'Machine Learning'],
    active_research: [
      'Student\'s harassment in tertiary educational institutions: Explore the nature and awareness building through a ICT based platform',
      'Design a mobile application for Early Childhood Development in a developing country: Effectiveness and challenges',
      'A Conceptual & Implementational Approach to VR-based Learning Tools for the Autism Spectrum Disorder Affected Populace',
      'Designing and developing an augmented reality based smartphone application and investigate the behavior pattern of purchasing medicine without prescription',
      'Harnessing ICT for empowering farmers in rural areas of Bangladesh',
      'Expectations, Limits and Realities: Exploring the Empowerment of Women with Disabilities Focusing on the Gender Design Based ICT Interventions',
      'APA (Ancillary Pregnancy Assistant) Reducing the rate of C-section in delivery and raising awareness in pregnancy by ICT application',
      'Digital Sylhet City Project: Development of Health Service Management System for Sylhet M A G Osmani Medical College Hospital'
    ],
    previous_research: [
      'Consultancy Service for Conducting ICT Impact Study of USAID Agriculture Extension Support Activity Project (AESA), USAID Agricultural Extension Support Activity Project, DAM, 2018',
      'An Approach to Design and Develop UX/UI for Smartphone Applications of Minority Ethnic Group'
    ],
    external_affiliations: ['ACM', 'ACM SIGCHI', 'Senior Member IEEE', 'IEEE Computer Society', 'Cisco Networking Academy'],
    qualifications: [
      { degree: 'PhD in Computing', institution: 'Curtin University, Australia' },
      { degree: 'M.Sc in Software Engineering', institution: 'Blekinge Institute of Technology, Sweden' },
      { degree: 'B.Sc. in Computer Science and Information Technology', institution: 'Islamic University of Technology, Bangladesh' }
    ],
    publications: [
      { title: 'Capability Enhancement of Agricultural Extension Personnel Through ICT Interventions and Its Impact: A Case Study in Bangladesh', journal: 'ICCAMESS-2023, India', year: '2023' },
      { title: 'Digitally Mediated Parenting in Bangladesh: Reality, Dangers and Answers', journal: 'International Journal of Information Science and Computing, 9(2), 83-95', year: '2023' },
      { title: 'A cognitive behaviour data analysis on the use of social media in global south context focusing on Bangladesh', journal: 'Scientific Reports 13, no. 1: 4236', year: '2023' },
      { title: 'Child Engagement with Digital Devices During the COVID-19 Epidemic in the Global South', journal: 'Journal of Computer Science, 18(6), 509-519', year: '2022' },
      { title: 'Online Food Delivery (OFD) System: An Empirical Study During COVID-19 Pandemic', journal: 'Lecture Notes in Networks and Systems, vol 314, Springer', year: '2022' },
      { title: 'Estimating The Mode Of Delivery Through Cause Analysis: A Systematic Literature Review On Reducing Cesarean', journal: 'International Journal of Public Health Management and Ethics (IJPHME), 7(1)', year: '2022' },
      { title: 'Vulnerabilities to Internet of Things and Current State of the Art of Security Architecture', journal: 'International Journal of Recent Technology and Engineering (IJRTE), 8(4), SCOPUS Indexed', year: '2019' },
      { title: 'Explore the Impacts of Digital Technology on Home Confined Children During COVID-19 Isolation', journal: 'Journal of Engineering Research & Education (JERE), 3(1)', year: '2021' },
      { title: 'Agriculture Extension, Women Participation And Food Security Option', journal: 'Man and Culture, 5(1), 163-176', year: '2021' },
      { title: 'Design and Development of an ICT Intervention for Early Childhood Development in Minority Ethnic Communities in Bangladesh', journal: 'Computationally Intelligent Systems and their Applications, 950, p.153, Springer', year: '2021' },
      { title: 'Improving Joint Attention in Children with Autism: A VR-AR Enabled Game Approach', journal: 'International Journal of Engineering and Advanced Technology (IJEAT), 10(3)', year: '2021' },
      { title: 'Remote Patient Monitoring Via Blockchain: A Systematic Review', journal: 'Solid State Technology, 64(2), 4850-4862', year: '2021' },
      { title: 'A comparison study of temporal signature mining over traditional data mining techniques to detect network intrusion', journal: 'IEEE and Springer Indexed, India', year: '2018' },
      { title: 'A Review of Software Risk Management for Selection of Best Tools and Techniques', journal: 'European Journal of Advances in Engineering and Technology, 3(6): 1-7', year: '2016' },
      { title: 'WFR-TM: Wait-Free Readers without Sacrificing Speculation of Writers', journal: 'Journal of Parallel and Distributed Computing, Volume 96, Pages 134-151', year: '2016' }
    ],
    conferences: [
      { title: 'Exploring Optimal Placement of Head-Based Hierarchical Marking Menus on Smartphones', venue: 'MobiQuitous 2023, Springer', year: '2024' },
      { title: 'A Study on the Socioeconomic Standards of Parents and Its Correlation with the Online Safety of Their Children', venue: 'ICCAMESS-2023, India', year: '2023' },
      { title: 'Prevention is Better than Remedy When it Comes to the Digital Privacy of Children and Adolescents', venue: '2nd International Conference, Meghalaya, India', year: '2023' },
      { title: 'An Exploration of How Children Can Be Proactive for Their Own Digital Privacy & Security', venue: 'ICHCSC 2023, India', year: '2023' },
      { title: 'How True Is the Adage Concern Parents, Safer Children in terms of Children\'s Digital Privacy', venue: 'ICERIE, SUST 2023', year: '2023' },
      { title: 'Applying a machine learning model to forecast the risks to children\'s online privacy and security', venue: 'Assam University, India', year: '2023' },
      { title: 'Determining the Most Effective Machine Learning Techniques for Detecting Phishing Websites', venue: 'Springer, LNEE vol 925', year: '2022' },
      { title: 'Can Machine Learning Technique Predict the Prostate Cancer accurately?: The fact and remedy', venue: 'IEEE ICECIT 2021', year: '2021' },
      { title: 'Determining the Most Effective ML Techniques for Detecting Phishing Websites', venue: 'ICAAAIML-2021, India', year: '2021' },
      { title: 'Emergence of Polarization and Marginalization in Online Education System of Bangladesh Due to COVID-19', venue: 'HCII 2021, Springer', year: '2021' },
      { title: 'Explore the impacts of digital technology on home confined children during COVID-19 isolation', venue: 'ICERIE, SUST', year: '2021' },
      { title: 'An Approach to Design and Develop UX/UI for Smartphone Applications of Minority Ethnic Group', venue: 'IEEE TENCON 2019, India', year: '2019' },
      { title: 'Temporal Signature Mining of Network intrusion detection using TEMR', venue: 'IEEE and Springer Indexed, India', year: '2018' },
      { title: 'WFR-TM: Wait-Free Readers without Sacrificing Speculation of Writers', venue: 'OPODIS 2014, Italy', year: '2014' },
      { title: 'A Review of Software Risk Management for Selection of Best Tools and Techniques', venue: 'SNPD 2008, Thailand', year: '2008' },
      { title: '3-Tier Architecture of Data Server on Grid: Implemented Using Globus Toolkit', venue: 'Las Vegas, Nevada, USA', year: '2007' }
    ],
    teaching: ['Software Engineering', 'Big Data Analytics', 'Database Management System', 'Artificial Intelligence', 'Human Computer Interaction', 'E-Governance', 'Computer Network', 'Advance Software Quality', 'Cyber Security Operation (Cisco Netacad)', 'Cloud Computing (AWS Academy)'],
    awards: [
      'Marie Curie Fellowship for Early Stage Researcher (European Commission)',
      'IPRS for PhD (Australian Government)',
      'Erasmus Mundus Scholarship for M.Sc. (European Commission)'
    ],
    graduate_supervision: [
      'Ph.D. (Co-supervising): Rumel M.S. Pir — Designing a Cognitive and Conceptual Model for Ensuring Children\'s Digital Privacy and Security: The Global South Context (Continue)',
      'Ph.D. (Supervising): Safkat Kibria — Investigating the Accent Issues in LVCSR for Bangladeshi Bangla (Continue)',
      'B.Sc. (Supervising): Mozammal Hossain, Tarik Hasan — Synchronized, Spatially-Aware, Collaborative AR for annotating a 3D Map (Continue)',
      'B.Sc. (Supervising): Sabiha Tahsin Soha, Aritra Mazumder — Exploring head-based control for marking menu navigation (Continue)'
    ]




  },
  {
    id: 'f2',
    slug: 'shahidur-rahman',
    full_name: 'Mohammad Shahidur Rahman, PhD',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Shadidur_Rahman.jpg',
    email: 'rahmanms@sust.edu, rahmanms.bd@gmail.com',
    phone: '+8801914930807',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_profile_links: [
      { title: 'Google Scholar', url: '#' },
      { title: 'Scopus', url: '#' },
      { title: 'Web of Science', url: '#' },
      { title: 'ORCID', url: '#' },
      { title: 'ResearchGate', url: '#' }
    ],
    biography: 'M. Shahidur Rahman received his B.Sc. and M.Sc. degree in Electronics and Computer Science from Shahjalal University of Science and Technology, Sylhet, Bangladesh, in 1995 and 1997, respectively. In 1997, he joined Shahjalal University as a lecturer where he is currently serving as a professor. He received his Ph.D. degree in mathematical information systems in 2006 from Saitama University, Saitama, Japan. He was a JSPS postdoctoral research fellow from 2009 to 2011 in the same university at Saitama.',
    research_areas: ['Natural Language Processing', 'Speech analysis', 'Speech synthesis', 'Speech recognition', 'Enhancement of bone conducted speech', 'Digital signal processing'],
    active_research: [
      'Developing an Autonomous Vehicle Designed for Navigation on Bangladeshi Roads. Supported by: SUST Research Centre, SUST, Sylhet.',
      'Bangla-English Direct Speech-to-Speech Translation without using Text Data. Supported by: SUST Research Centre, SUST, Sylhet.',
      'Speech Recognition with Speaker Diarization in Bangla. Supported by: University Grants Commission of Bangladesh, Dhaka 1207, Bangladesh'
    ],
    previous_research: [
      'Development of Multi-Platform Speech and Language Processing Software for Bangla (Higher Education Quality Enhancement Project (HEQEP)), CP No: 3888); Implementation Period: 2015-2018; Financed by: University Grants Commission of Bangladesh Window 4 Innovation Fund',
      'Developing an Emotional Speech Corpus in Bangla and a Web Application; Implementation Period: 2019-2020; Supported by: SUST Research Centre, SUST, Sylhet.',
      'Securing Digital Services of SUST; Implementation Period: 2018-2019; Supported by: Research Centre, Shahjalal University of Science and Technology, Sylhet.',
      'Translating Bangla Text to Bangla Sign Language for Communication with Hearing Impaired People; Implementation Period: 2022-23; Supported by: Research Center, Shahjalal University of Science and Technology, Sylhet.'
    ],
    external_affiliations: [
      'Editor-in-Chief, Editorial Board, SUST Journal of Science and Technology',
      'Senior member, Institute of Electrical and Electronics Engineers (IEEE)',
      'Senior member, IEEE Signal Processing Society',
      'Life member, Bangladesh JSPS (Japan Society for the Promotion of Science) Alumni Association'
    ],
    qualifications: [
      { degree: 'Ph.D.', institution: 'Saitama University, Saitama, Japan', year: '2006' },
      { degree: 'M.Sc.', institution: 'Shahjalal University of Science and Tech., Sylhet, Bangladesh', year: '1996' },
      { degree: 'B.Sc.', institution: 'Shahjalal University of Science and Tech., Sylhet, Bangladesh', year: '1995' }
    ],
    publications: [
      { title: 'Kingfisher: A hybrid LLM-augmented Bangla text normalization for enhanced text-to-speech', journal: 'Natural Language Processing Journal', year: '2026' },
      { title: 'BanglaLem: A Transformer-based Bangla Lemmatizer with an Enhanced Dataset', journal: 'Systems and Soft Computing', year: '2025' },
      { title: 'Deep Learning-Based Bangla Text Normalization with Emotion Classification for Expressive Text-to-speech Synthesizer', journal: 'Applied Soft Computing', year: '2025' },
      { title: 'Mathematical analysis and prediction of future outbreak of dengue on time-varying contact rate using machine learning approach', journal: 'Computers in Biology and Medicine, 178', year: '2024' },
      { title: 'EmoBone: A Multinational Audio Dataset of Emotional Bone Conducted Speech', journal: 'IEEJ Transactions on Electrical and Electronic Engineering', year: '2024' },
      { title: 'Bangla Text Normalization for Text-to-speech Synthesizer Using Machine Learning Algorithms', journal: 'Journal of King Saud University-Computer and Information Sciences', year: '2024' },
      { title: 'BanSpeech: A Multi-domain Bangla Speech Recognition Benchmark Towards Robust Performance in Challenging Conditions', journal: 'IEEE Access', year: '2024' },
      { title: 'Acoustic feature analysis and optimization for Bangla speech emotion recognition', journal: 'Acoustical Science and Technology, 44(3)', year: '2023' },
      { title: 'Formant estimation of high-pitched noisy speech using homomorphic deconvolution of higher-order group delay spectrum', journal: 'Acoustical Science and Technology, 44(2)', year: '2023' },
      { title: 'Effect of pole/zero manipulation in estimating the group delay spectrum', journal: 'Acoustical Science and Technology, 43(4)', year: '2022' },
      { title: 'Bangladeshi Bangla Speech Corpus for Automatic Speech Recognition Research', journal: 'Speech Communication 136, 84–97', year: '2022' },
      { title: 'Bangla Speech Emotion Recognition and Cross-Lingual Study Using Deep CNN and BLSTM Networks', journal: 'IEEE Access, 10, 564-578', year: '2022' },
      { title: 'Recent advancement in speech recognition for bangla: A survey', journal: 'International Journal of Advanced Computer Science and Applications, 12(3)', year: '2021' },
      { title: 'SUST TTS Corpus: A phonetically-balanced corpus for Bangla text-to-speech synthesis', journal: 'Acoustical Science and Technology, 42(6)', year: '2021' },
      { title: 'Towards Developing Uniform Lexicon Based Sorting Algorithm for Three Prominent Indo-Aryan Languages', journal: 'Transactions on Asian and Low-Resource Language Information Processing, 21(3)', year: '2021' },
      { title: 'Deep learning based large vocabulary continuous speech recognition of an under-resourced language Bangladeshi Bangla', journal: 'Acoustical Science and Technology, 42(5)', year: '2021' },
      { title: 'SUST Bangla Emotional Speech Corpus (SUBESCO): An audio-only emotional speech corpus for Bangla', journal: 'Plos one, 16(4)', year: '2021' },
      { title: 'Formant estimation from speech signal using the magnitude spectrum modified with group delay spectrum', journal: 'Acoustical Science and Technology, Vol. 42, No. 2', year: '2021' },
      { title: 'Acoustic Analysis of the Speakers’ Variability for Regional Accent-Affected Pronunciation in Bangladeshi Bangla: A Study on Sylheti Accent', journal: 'IEEE Access, 8, 35200-35221', year: '2021' },
      { title: 'SuVashantor: English to Bangla Machine Translation Systems', journal: 'Journal of Computer Science, 1128-1138', year: '2020' },
      { title: 'Speech Signal Analysis in Phase Domain', journal: 'Journal of Computer Science, 1115-1127', year: '2020' },
      { title: 'Multisensory Speech Enhancement Using Lower Frequency Components From Bone Conducted speech', journal: 'IEEJ Transactions on Electrical and Electronic Engineering, Vol. 14 No. 11', year: '2020' },
      { title: 'Amplitude Variation of Bone Conducted Speech Compared to Air Conducted Speech', journal: 'Acoustical Science and Technology, Vol. 40, No. 5', year: '2020' },
      { title: 'An Encoder- Decoder Based Grapheme-to-Phoneme Converter for Bangla Speech Synthesis', journal: 'Acoustical Science and Technology, Vol. 40, No. 6', year: '2019' },
      { title: 'A dictionary-based text compression technique using quaternary code', journal: 'Iran Journal of Computer Science, 1-10', year: '2019' },
      { title: 'Huffman Based Code Generation Algorithms: Data Compression Perspectives', journal: 'Journal of Computer Science', year: '2018' },
      { title: 'Balancing decoding speed and memory usage for Huffman codes using quaternary tree', journal: 'Applied Informatics', year: '2017' },
      { title: 'A Comparative Study between Brightness Preserving Bi-histogram and Tri-histogram Equalization for Image Enhancement', journal: 'International Journal of Computer Applications, 140(2)', year: '2016' },
      { title: 'Pitch Determination from Bone Conducted Speech', journal: 'IEICE Tran. Information and Systems, Vol. E99-D, No.1', year: '2016' },
      { title: 'Fundamental Frequency Extraction of Noisy Speech Signals', journal: 'Rajshahi University Journal of Science and Engineering, Vol. 43', year: '2015' },
      { title: 'Windowless Autocorrelation Based Cepstrum Method for Pitch Extraction of Noisy Speech', journal: 'Journal of Signal Processing, Vol. 16, No. 3', year: '2012' },
      { title: 'High Performance Query Operations on Compressed Database', journal: 'International Journal of Database Theory and Application, Vol. 5, No. 3', year: '2012' },
      { title: 'Improved Optical Recognition of Bangla Characters', journal: 'SUST Studies, Vol. 12, No. 1', year: '2010' },
      { title: 'Text Normalization and Diphone Preparation for Bangla Speech Synthesis', journal: 'Journal of Multimedia, Vol. 5(6)', year: '2010' },
      { title: 'A Review and Prospects of Quantum Teleportation', journal: 'MASAUM Journal of Basic and Applied Sciences, Vol. 1, No. 2', year: '2009' },
      { title: 'A Bangla Spell Checking System', journal: 'SUST studies, Vol. 10, No.1', year: '2008' },
      { title: 'Learning object: an Effective e-learning Tool for Computer Program', journal: 'INTI Journal on Teaching and Learning', year: '2007' },
      { title: 'Identification of ARMA Speech Models Using an Effective Representation of Voice Source', journal: 'IEICE Tran. Information & Systems, Vol.E90-D, No.5', year: '2007' },
      { title: 'Linear Prediction Using Refined Autocorrelation Function', journal: 'EURASIP Journal on Audio, Speech, and Music Processing', year: '2007' },
      { title: 'Bangla Sorting Algorithm: A Linguistic Approach', journal: 'SUST studies, Vol. 8, No. 2', year: '2007' },
      { title: 'Speech Analysis Based on Modeling the Effective Voice Source', journal: 'IEICE Tran. Information & Systems, Vol.E89-D, No.3', year: '2006' },
      { title: 'Formant Frequency Estimation of High-Pitched Speech by Homomorphic Prediction', journal: 'Acoustical Science and Technology, Vol.26, No.6', year: '2005' },
      { title: 'Line Drawing Algorithm: A New Approach', journal: 'SUST studies, Vol. 4, No.1', year: '2002' }
    ],
    conferences: [
      { title: 'BengaliTaka: A Comparative Analysis of Transformer and CNNs on Bangladeshi Currency Recognition', venue: 'QPAIN, Rangpur, Bangladesh', year: '2025' },
      { title: 'WoNBias: A Dataset for Classifying Bias & Prejudice Against Women in Bengali Text', venue: 'GeBNLP, Vienna, Austria', year: '2025' },
      { title: 'Creating a Comprehensive Dataset for Older Bengali Speakers’ Voices', venue: 'ECCE, Chittagong, Bangladesh', year: '2025' },
      { title: 'Bangla Book Genre Classification: An Advanced Multi-Class Approach Using Transformer-Based Models', venue: 'ECCE, Chittagong, Bangladesh', year: '2025' },
      { title: 'Bangladeshi Venomous and Nonvenomous Snakes Classification Using Vision Transformer', venue: 'ECCE, Chittagong, Bangladesh', year: '2025' },
      { title: 'BangladeshiBirdsCall: A Comprehensive Dataset for Real-time Detection of Bangladeshi Birds', venue: 'ECCE, Chittagong, Bangladesh', year: '2025' },
      { title: 'Simplifying Student Queries: A Dialogflow-Based Conversational Chatbot', venue: 'ECCE, Chittagong, Bangladesh', year: '2025' },
      { title: 'Cross-Cultural Analysis of Emotional Expression in a Multinational Speaker Dataset', venue: 'Computing Advancements', year: '2024' },
      { title: 'Leveraging ML Algorithms and Sentinel-2 Satellite Imagery for Land Use Classification', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'A Deep Learning Approach to Automate Classification of Arsenic-Affected Skin', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Exploring the EmoBone Dataset with Bi-Directional LSTM and Attention for Emotion Recognition', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'BongoFashion: A Versatile Dataset for Real-time Detection of Bangladeshi Wearables', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Sentiment Analysis of Beauty Product Reviews: A Study Using Transformer-Based Models', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Multiclass Grade Prediction: Integrating Students’ Academic, Demographic, and Psychological Insights', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Relevancy classification in Bangla social media comments using Transformer architecture', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Transformers in Bangla Text: Advancing MCQ and Answer Generation Methods', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'ViTCoin: A Vision Transformer-based System for Bangladeshi Coin Detection', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'CricPose360: A Comprehensive Dataset for Real-Time Cricket Shot Classification', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Optimizing Multilingual Summarization: Advanced Corpus Creation and Filtering Approach', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Genre Classification from Bangla Music Lyrics: Dataset and Classifiers', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Efficient Zero-Shot Voice Cloning for Bengali Speech Synthesis', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Multi-label Image Classification of Protest Scenes in Bangladesh Using Vision Transformer', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'SafeWalkBD: A Roadside Object Detection Dataset for Visually Impaired Pedestrians', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2024' },
      { title: 'Bangladeshi Paper Currency Recognition with Improved Dataset Using Vision Transformer', venue: 'ICEEICT', year: '2024' },
      { title: 'Classifying Bangla Book’s Context: A Multi-Label Approach', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2023' },
      { title: 'A Comprehensive Sentiment Analysis on Beauty Product Usage Among Bangladeshi Consumers', venue: 'Electronics and Health Informatics, Springer', year: '2023' },
      { title: 'Road Object Detection for Visually Impaired People in Bangladesh', venue: 'Electronics and Health Informatics, Springer', year: '2023' },
      { title: 'BanglaBeats: A Comprehensive Dataset of Bengali Songs for Music Genre Classification', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2023' },
      { title: 'PakhiderChobi: A Comprehensive Dataset for Real-time Detection of Bangladeshi Birds', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2023' },
      { title: 'Bangla Protest News Categorization Using Deep Learning', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2023' },
      { title: 'Harnessing the Power of Pretrained Models for Scientific Paper Title Generation', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2023' },
      { title: 'Automatic Nostalgia Detection from Bengali Text', venue: 'ICCIT, Cox\'s Bazar, Bangladesh', year: '2023' },
      { title: 'A SAR-Based Approach to Recognize Text in Syloti Nagri', venue: 'IEEE EICT', year: '2023' },
      { title: 'Drowsiness and Lethargy Detection Using Machine Learning Techniques', venue: 'IEEE ECCE', year: '2023' },
      { title: 'End-to-end Bangla speech synthesis', venue: 'IEEE ICSCT', year: '2021' },
      { title: 'Dynamic Management of Identity Federations using Blockchain', venue: 'IEEE ICBC', year: '2021' },
      { title: 'Towards Lexicon-free Bangla Automatic Speech Recognition System', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2019' },
      { title: 'A Bangla Text-to-Speech System using Deep Neural Networks', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2019' },
      { title: 'A model of diphone duration for speech synthesis in Bangla', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2019' },
      { title: 'Topic Modelling: A Comparison of Performances of LDA and LDA2vec on Bangla Newspaper', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2019' },
      { title: 'Effects of Wave Function Penetration on Gate Capacitance of p-Channel Double Gate JLFET', venue: 'IEEE ICASERT', year: '2019' },
      { title: 'Multilingual Text Categorization of Indo - Aryan Languages', venue: 'ECCE', year: '2019' },
      { title: 'Continuous Bengali Speech Recognition Based On Deep Neural Network', venue: 'ECCE', year: '2019' },
      { title: 'Connected Component Analysis Based Two Zone Approach for Bangla Character Segmentation', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2018' },
      { title: 'Acoustic Analysis of Accent - Specific Pronunciation Effect on Bangladeshi Bangla', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2018' },
      { title: 'A Sequence - to - Sequence Pronunciation Model for Bangla Speech Synthesis', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2018' },
      { title: 'A Review of Statistical and Neural Network Based Hybrid Machine Translators', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2018' },
      { title: 'Bangla Speech Recognition for Voice Search', venue: 'ICBSLP, Sylhet, Bangladesh', year: '2018' },
      { title: 'Impact of Wave Function Penetration on Double Gate Junction Less Transistor', venue: 'Advancement in Electrical and Electronic Engineering', year: '2018' },
      { title: 'Towards Optimal CNN Parameters for Bengali Handwritten Numerals Recognition', venue: 'ICCIT, Dhaka', year: '2016' },
      { title: 'Towards Optimal Shallow ANN for Recognizing Isolated Handwritten Bengali Numerals', venue: 'ICCOE, Dhaka', year: '2016' },
      { title: 'Bangla word clustering based on N-gram language model', venue: 'IEEE ICEEICT', year: '2014' },
      { title: 'Transliteration Based Bengali Text Compression using Huffman principle', venue: 'ICIEV', year: '2014' },
      { title: 'A study on amplitude variation of bone conducted speech compared to air conducted speech', venue: 'IEEE APSIPA', year: '2013' },
      { title: 'Developing an Automated Bangla Parts Of Speech Tagged Dictionary', venue: 'ICCIT, Dhaka', year: '2013' },
      { title: 'Low-Frequency Band Noise Suppression Using Bone Conducted Speech', venue: 'IEEE PacRim, Victoria, Canada', year: '2011' },
      { title: 'Speech Enhancement Using Comb Filter Designed From Bone Conducted Speech', venue: 'ITC-CSCC, Gyeongju, Korea', year: '2011' },
      { title: 'Intelligibility Enhancement of Bone Conducted Speech by an Analysis-Synthesis Method', venue: 'IEEE MWSCAS, Seoul, Korea', year: '2011' },
      { title: 'Pitch Characteristics of Bone Conducted Speech', venue: 'EUSIPCO, Aalborg', year: '2010' },
      { title: 'Pitch Determination Using Autocorrelation Function in Spectral Domain', venue: 'Interspeech, Makuhari, Japan', year: '2010' },
      { title: 'Pitch Determination Using Windowless Autocorrelation Based Cepstrum Method', venue: 'APSIPA, Singapore', year: '2010' },
      { title: 'Concepts for Data-Security of Future Communication', venue: 'ICCAE, Bangkok', year: '2009' },
      { title: 'A Review and Prospects of Quantum Teleportation', venue: 'ICCAE, Bangkok', year: '2009' },
      { title: 'Diphone preparation for Bangla text to speech synthesis', venue: 'ICCIT, Dhaka', year: '2009' },
      { title: 'Proposal for an Efficient Quantum Key Distribution System Using Entanglement', venue: 'ICCIT, Khulna', year: '2008' },
      { title: 'E-Learning Approach for Distance Learning Program: BOU Perspective', venue: 'IT Towards Empowerment, Bangkok', year: '2007' },
      { title: 'Collaborative Content Development: Issues and Paradigm', venue: 'IT Towards Empowerment, Bangkok', year: '2007' },
      { title: 'Issues for Collaborative Development of Learning Objects to Support E-Learning', venue: 'UiTM UICEL, Putrajaya', year: '2007' },
      { title: 'Learning Object: An Effective e-Learning Tool', venue: 'ICTL, Putrajaya', year: '2007' },
      { title: 'Autoregressive Moving Average (ARMA) Analysis of Speech by Modeling Voice Source', venue: 'ICSES, Lodz', year: '2006' },
      { title: 'Pitch Determination using Aligned AMDF', venue: 'ICSLP, Pittsburgh', year: '2006' },
      { title: 'Voice Source Modeling for Accurate Speech Analysis', venue: 'Asilomar Conf. on Signals, Systems and Computers', year: '2005' },
      { title: 'Linear Prediction Using Homomorphic Deconvolution in the Autocorrelation Domain', venue: 'IEEE ISCAS, Kobe', year: '2005' },
      { title: 'Bitwise Sort: A New Way of Sorting', venue: 'ICCIT, Dhaka', year: '2002' },
      { title: 'An Algorithmic Approach for Voice Synthesis in Bangla', venue: 'ICCIT', year: '2002' },
      { title: 'Recognition of Spoken Letters in Bangla', venue: 'ICCIT, Dhaka', year: '2002' },
      { title: 'A Line Drawing Algorithm', venue: 'ICCIT, Dhaka', year: '2001' },
      { title: 'A Simplified Approach for Building a Real Time Speech Synthesizer in Bangla', venue: 'ICECE, Dhaka', year: '2001' },
      { title: 'A Bangla Spell Checking System', venue: 'ICCIT, Sylhet', year: '1999' },
      { title: 'Bangla Sorting Algorithm: A Linguistic Approach', venue: 'ICCIT, Dhaka', year: '1998' }
    ],
    teaching: ['Research Methodology (Masters in IT)', 'Deep Learning (Masters)'],
    awards: [
      'Dhaka Education Board Scholarship, Bangladesh, 1991-92',
      'Merit Scholarship, Shahjalal University of Science and Technology, 1993-1995',
      'MEXT Scholarship (Ministry of Education, Government of Japan), 2003-2006',
      'Post doctoral Fellowship, Japan Society for the Promotion of Science (JSPS), 2009-2011',
      'Dean\'s Award for Research Excellence at SUST, 2019',
      'Dean\'s Award for Research Excellence at SUST, 2022',
      '1st Prize in AI for Bangla 2.0, Organized by Bangladesh Computer Council',
      'Dean\'s Award for Research Excellence at SUST, 2023'
    ],
    graduate_supervision: [
      'PhD Thesis: A Dictionary Based Compression Technique Using Quaternary Code (2020)',
      'PhD Thesis: Emotion Recognition from Speech Signal in Bangla (2022)',
      'PhD Thesis: Synthesizing Natural Sounding Speech in Bangla (2023)',
      'PhD Thesis: Robust Large Vocabulary Continuous Speech Recognition in Bangla (2023)',
      { title: 'PhD Thesis: High Pitched Speech Analysis in Noisy Environment (2023)' } as any,
      'PhD Thesis: Bangla-English Direct Speech-to-Speech Translation using Sequence-to-Sequence Model (running)',
      'PhD Thesis: Enhancing Automated Speech Recognition by Integrating Lip Reading (running)'
    ]
  },
  {
    id: 'f3',
    slug: 'reza-selim',
    full_name: 'Dr Mohammad Reza Selim',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Reza_Selim.jpg',
    email: 'selim@sust.edu',
    phone: '+8801972357830',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Machine Translation', 'Natural Language Processing', 'Programming languages in Parallel Computing', 'Distributed P2P Systems', 'Reliability of Publish/Subscribe Systems'],
    previous_research: [
      'Development of Multi-Platform Speech and Language Processing Software for Bangla (Higher Education Quality Enhancement Project (HEQEP)), CP No: 3888); Implementation Period: 2015-2018; Financed by: University Grants Commission of Bangladesh, Window 4 Innovation Fund'
    ],
    qualifications: [
      { degree: 'Ph.D. in Information and Computer Sciences', institution: 'Saitama University, Saitama, Japan', year: '2008' },
      { degree: 'M.Sc. in Electronics and Computer Science', institution: 'Shahjalal University of Science and Tech., Sylhet, Bangladesh', year: '1996' },
      { degree: 'M.Sc. in Electronics and Computer Science', institution: 'Shahjalal University of Science and Tech., Sylhet, Bangladesh', year: '1995' }
    ],
    publications: [
      { title: 'Bangladeshi Bangla Speech Corpus for Automatic Speech Recognition Research', journal: 'Speech Communication 136, 84–97', year: '2022' },
      { title: 'Bangla Speech Emotion Recognition and Cross-Lingual Study Using Deep CNN and BLSTM Networks', journal: 'IEEE Access, 10, 564-578', year: '2021' },
      { title: 'SUST TTS Corpus: A phonetically-balanced corpus for Bangla text-to-speech synthesis', journal: 'Acoustical Science and Technology, 42(6), 326-332', year: '2021' },
      { title: 'SUST Bangla Emotional Speech Corpus (SUBESCO): An audio-only emotional speech corpus for Bangla', journal: 'Plos one, 16(4)', year: '2021' },
      { title: 'Acoustic Analysis of the Speakers’ Variability for Regional Accent-Affected Pronunciation in Bangladeshi Bangla: A Study on Sylheti Accent', journal: 'IEEE Access, 8, 35200-35221', year: '2020' },
      { title: 'SuVashantor: English to Bangla Machine Translation Systems', journal: 'Journal of Computer Science, 1128-1138', year: '2020' },
      { title: 'An Encoder- Decoder Based Grapheme-to-Phoneme Converter for Bangla Speech Synthesis', journal: 'Acoustical Science and Technology, Vol. 40, No. 6, pp. 374-381', year: '2019' },
      { title: 'English to Bangla Statistical Machine Translation using Neural Probabilistic Language Model', journal: 'Computer Science and Engineering Research Journal, Vol. 11', year: '2018' },
      { title: 'Extended Bangla Keyboard', journal: 'SUST Journal of Science and Technology, Vol. 21, No. 1', year: '2014' },
      { title: 'SUMono: A Representative Modern Bengali Corpus', journal: 'SUST Journal of Science and Technology, Vol. 21, No. 1', year: '2014' },
      { title: 'Carrying on the legacy of imperative languages in the future parallel computing era', journal: 'Parallel Computing, Volume 40, Issues 34, Pages 1-33', year: '2014' },
      { title: 'Overcoming the Language Divide between English and Bengali through EBTran System', journal: 'Journal of Emerging Trends in Computing and Information Sciences, Vol. 4, No. 1', year: '2013' },
      { title: 'SUPara: A Balanced English-Bengali Parallel Corpus', journal: 'SUST Studies, Vol. 16, No. 1', year: '2012' },
      { title: 'Transformational Generative Grammar for Various Types of Bengali Sentences', journal: 'SUST Studies, Vol. 12, No. 1', year: '2010' },
      { title: 'Mapping Bangla Unicode Text to Keyboard Layout Specific Keystrokes', journal: 'SUST Studies, Vol. 12, No. 1', year: '2010' },
      { title: 'A Low Cost and Resilient Message Queuing Middleware', journal: 'International Journal of Computer Science and Network Security, Vol. 8, No. 8, pp. 225-237', year: '2008' },
      { title: 'Improving Efficiency of Bijoy Keyboard Layout by Repositioning Characters', journal: 'SUST Journal of Science and Technology', year: '2016' }
    ],
    conferences: [
      { title: 'Acoustic Analysis of Accent-Specific Pronunciation Effect on Bangladeshi Bangla', venue: 'ICBSLP, Sylhet', year: '2018' },
      { title: 'A Sequence-to-Sequence Pronunciation Model for Bangla Speech Synthesis', venue: 'ICBSLP, Sylhet', year: '2018' },
      { title: 'A Review of Statistical and Neural Network Based Hybrid Machine Translators', venue: 'ICBSLP, Sylhet', year: '2018' },
      { title: 'Connected Component Analysis Based Two Zone Approach for Bangla Character Segmentation', venue: 'ICBSLP, Sylhet', year: '2018' },
      { title: 'Aligning Sentences in English-Bengali Corpora', venue: 'IC4ME2, Rajshahi', year: '2018' },
      { title: 'An Improvement of REM: A Replication Oriented Event-Based Middleware', venue: 'IEEE ARES, Fukuoka, Japan', year: '2009' },
      { title: 'Ensuring Reliability and Availability of Soft System Bus', venue: 'IEEE SSIRI 08, Yokohama, Japan', year: '2008' },
      { title: 'A Comparison between Soft System Bus and Enterprise Service Bus', venue: 'IPSJ SIGSE Winter Workshop, Naha, Japan', year: '2007' },
      { title: 'POP method: an approach to enhance the security and privacy of RFID systems', venue: 'ACM SAC, Seoul, Korea', year: '2007' },
      { title: 'Distributed Hash Table Based Design of Soft System Buses', venue: 'Scalable Information Systems, Suzhou, China', year: '2007' },
      { title: 'A Replication Oriented Approach to Event Based Middleware Over Structured Peer to Peer Networks', venue: 'ACM/IFIP/USENIX Middleware, Newport Beach, USA', year: '2007' },
      { title: 'An Implementation of Machine Translation between Bangla and English', venue: 'ICCIT, NSU, Dhaka', year: '2001' },
      { title: 'Extracting Semantic Information of Bengali Natural Language Sentences from Syntax Tree', venue: 'ICCIT, NSU, Dhaka', year: '2001' },
      { title: 'Syntax Analysis of Phrases and Different Types of Sentences in Bangla', venue: 'ICCIT, SUST, Sylhet, Bangladesh', year: '1999' },
      { title: 'A Comparative Study between Soft System Bus and Traditional Middlewares', venue: 'OTM Workshops', year: '2007' }
    ],
    awards: [
      'Post doctoral Fellowship, University of Malaya, Malaysia',
      'Monbukagakusho (Ministry of Education, Government of Japan) Scholarship',
      'Merit Scholarship, Shahjalal University of Science and Technology',
      'Dhaka Education Board Scholarship, Bangladesh'
    ],
    graduate_supervision: [
      '2 Ph.D. students'
    ]
  },
  {
    id: 'f4',
    slug: 'jahirul-islam',
    full_name: 'M. Jahirul Islam, PhD., PEng.',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Jahirul_Islam.jpg',
    email: 'jahir-cse@sust.edu',
    phone: '+8801770348185',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'M. Jahirul Islam received his PhD and MASc in Electrical and Computer Engineering (ECE) from University of Windsor, ON, Canada in 2010 and MASc. in ECE from Ryerson University, Toronto, ON, Canada in 2003 respectively. He did his BSc. (Hons\') and MSc. in Electronics and Computer Science (ECS) from Shahjalal University of Science and Technology (SUST), Sylhet, Bangladesh in 1995 and 1996 respectively. Since 1997, he has been with the Computer Science and Engineering Department of SUST (Professor since 2015). Prof. Islam has authored and co-authored 23 journals and 10 conference papers in the area of image processing, computer vision, pattern recognition and document image analysis. Currently, he is the Licensed Professional Engineer (PEng.- PEO) in the province of Ontario, Canada. He is also a member of IEEE and the International Association of Engineers (IAENG). Prof. Islam also worked in Umm Al Qura University (UQU), Makkah, KSA and University of South Alabama, Mobile, AL, USA as an Assistant Professor. He worked as a Postdoctoral Fellow at Ryerson University, Toronto, ON, Canada in Robotics, Mechatronics and Automation Laboratory (RMAL) and St. Michael Hospital, Toronto, ON, Canada. He received many prestigious awards and scholarships that includes but not limited to Ontario Graduate Scholarships (OGS), Casino Windsor Breast Cancer Research Scholarship and three technical paper awards.',
    research_areas: ['Natural Language Processing', 'Signal and Image Processing, Image Segmentation', 'Machine Learning and Computer Vision', 'Mammogram Analysis and Breast Cancer Detection'],
    active_research: [
      '(2022-2024): Construct a model for designing and development applications and tools and proposing best practices for the children considering their privacy and security in global south context.',
      '(2022-2023): Bornil: An open-sourced sign language data crowdsourcing platform and dataset for AI enabled dialect-agnostic communication.'
    ],
    previous_research: [
      '(2019-2021): Experimental Study on Solar Cell Fabrication Using Silicon Extracted by FFC Cambridge Process From Local Silica Sand.',
      '(2017-2019): English to Bangla Neural Machine Translation.',
      '(2016-2017): Automated Bengali license plate detection and recognition.',
      '(2014-2015): An image processing method for computer assisted and image-guided interventional technologies.',
      '(2007-2008): Image processing techniques for quality inspection of gelatin capsules in pharmaceutical applications.'
    ],
    external_affiliations: [
      '2009- Present: Professional Engineer’s Ontario (PEO), Canada',
      '2009- Present: International Association of Engineers (IAENG)',
      '2002- Present: Institute of Electrical and Electronics Engineers (IEEE)'
    ],
    qualifications: [
      { degree: 'PhD in Electrical and Computer Engineering', institution: 'University of Windsor, Windsor, ON, Canada', year: '2010' },
      { degree: 'MASc. in Electrical and Computer Engineering', institution: 'Ryerson University, Toronto, ON, Canada', year: '2003' },
      { degree: 'MSc in Electronics and Computer Science', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '1996' },
      { degree: 'BSc. (Hon\'s) in Electronics and Computer Science', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '1995' }
    ],
    publications: [
      { title: 'An Investigation of the Relationship Between Parents’ Socio-economic Standards and their Children’s Online Safety; Perspective: Bangladesh', journal: 'Economic Affairs, 68 (04): 1957-1967', year: '2023' },
      { title: 'Digitally Mediated Parenting in Bangladesh: Reality, Dangers and Answers', journal: 'International Journal of Information Science and Computing, 9(2), 83-95', year: '2022' },
      { title: 'Child Engagement with Digital Devices During the COVID-19 Epidemic in the Global South: Are our Parents and Children Equipped to Make the Best use of these?', journal: 'Journal of Computer Science, 18(6), 509-519', year: '2022' },
      { title: 'Explore the Impacts of Digital Technology on the Home Confined Children During COVID-19 Isolation: Is it Blessing or Curse?', journal: 'Journal of Engineering Research, Innovation and Education (JERIE), 3(1), 35-45', year: '2021' },
      { title: 'Bangla Sign Language Alphabet Recognition Using Hand Gesture: A Deep Learning Approach', journal: 'Journal of Engineering Research and Innovation (JERIE). 2 (1, 2), 11-20', year: '2020' },
      { title: 'A Dictionary-Based Text Compression Technique Using Quaternary Code', journal: 'Iran Journal of Computer Science, 3, 127-136', year: '2020' },
      { title: 'Neural-based Question Answering System on Bangla Wikipedia Dataset', journal: 'Journal of Computer Science and Engineering, 1, 73-81', year: '2019' },
      { title: 'Shu-torjoma: An English-Bangla Statistical Machine Translation System', journal: 'Journal of Computer Science, 15(7), 1022-1039', year: '2019' },
      { title: 'Neural Machine Translation for Low-resource English-Bangla', journal: 'Journal of Computer Science, 15(11), 1627-1637', year: '2019' },
      { title: 'Huffman Based Code Generation Algorithm: Data Compression Perspective', journal: 'Journal of Computer Science, 14(12), 1599-1610', year: '2018' },
      { title: 'Personal Identification Using Palmprint Images', journal: 'International Journal of Simulation Systems, Science and Technology (IJSSST), 18 (1), 12.1-12.6', year: '2017' },
      { title: 'Cloud computing security issues: surveys and possible solutions', journal: 'SUST Journal of Science and Technology, 11-21', year: '2016' },
      { title: 'A Segmentation based Automated System for Brain Tumor Detection', journal: 'International Journal of Computer Applications, 153(10), 41-49', year: '2016' },
      { title: 'Line Segmentation and Orientation Algorithm for Automatic Bengali License Plate Localization and Recognition', journal: 'International Journal of Computer Applications, 154(9), 21-28', year: '2016' },
      { title: 'Enhancement of microcalcification in digitized mammogram', journal: 'LAP LAMBERT Academic Publishing. (Book)', year: '2016' },
      { title: 'An automated Bengali sign language recognition system based on Fingertip Finder Algorithm', journal: 'International Journal of Electronics and Informatics (IJEI), 4(1). 1-10', year: '2015' },
      { title: 'Video to Animated Cartoon Conversion', journal: 'IOSR Journal of Computer Engineering (IOSR-JCE), 16(4-IV), 69-75', year: '2014' },
      { title: 'Five Quantum Algorithm Using Quipper', journal: 'Published in arXiv.org', year: '2014' },
      { title: 'Medical document classification from OHMUSED dataset', journal: 'International Journal of Computer Science and Network (IJCSN), 3(1), 215-219', year: '2014' },
      { title: 'Pectoral Muscle Elimination Using K-means Clustering Approach', journal: 'International Journal of Computer Vision and Signal Processing (IJCVSP), 4(1), 11-21', year: '2014' },
      { title: 'Texture Feature-based Automatic Breast Tissue Classification in Digitized Mammograms', journal: 'American Journal of Biomedical Engineering, 3(3), 70-76', year: '2013' },
      { title: 'Computer Vision-Based Quality Inspection System of Transparent Gelatin Capsules in Pharmaceutical Applications', journal: 'American Journal of Intelligent Systems, 2(1), 14-22', year: '2012' },
      { title: 'Survey over VANET Routing Protocols for Vehicle to Vehicle Communication', journal: 'IOSR Journal of Computer Engineering', year: '2012' },
      { title: 'Investigating the Performance of Naïve Bayes Classifiers And K- Nearest Neighbor Classifiers', journal: 'JCIT: Journal of Convergence Information Technology, 5(2), 133-137', year: '2010' },
      { title: 'An Efficient Automatic Mass Classification Method In Digitized Mammograms Using Artificial Neural Network', journal: 'International Journal of Artificial Intelligence & Applications', year: '2010' },
      { title: 'Optimal Parameters Selection Technique For A Neural Network Based Local Thresholding Method', journal: 'Journal of Pattern Recognition Research, 5(1), 69-94', year: '2010' },
      { title: 'Frequency Domain Approach To De-Noise The CN Tower Lightning Current Derivative Signal', journal: 'International Journal of Computer and Electrical Engineering', year: '2009' },
      { title: 'Neural Network Based Handwritten Digits Recognition- An Experiment And Analysis', journal: 'International Journal of Computer and Electrical Engineering, 1(2), 222-228', year: '2009' }
    ],
    conferences: [
      { title: 'An Exploration of How Children Can Be Proactive for Their Own Digital Privacy and Security', venue: 'ICHCSC 2023. Smart Innovation, Systems and Technologies, vol 376. Springer', year: '2024' },
      { title: 'Applying a machine learning model to forecast the risks to children’s online privacy', venue: 'Assam University, Silchar, India', year: '2023' },
      { title: 'Cyberbullying detection on teenage users Bangla comments from Facebook using machine learning', venue: 'ICERIE, 2023', year: '2023' },
      { title: 'A Study on Why do the Digital Application Developers in Bangladesh Believe that Prevention is Better than Remedy', venue: 'ICIMSTAS-2023, Meghalaya, India', year: '2023' },
      { title: 'Crime analysis through machine learning: Bangladesh perspective', venue: 'ICIMSTAS-2023, Meghalaya, India (Best Paper Award)', year: '2023' },
      { title: 'A Study on the Socioeconomic Standards of the Parents and its correlation with the Online Safety of their Children', venue: 'ICCAMEASS-2023', year: '2023' },
      { title: 'How True is the Adage Concern Parents, Safer Children in Terms of Children’s Digital Privacy', venue: 'ICERIE, Sylhet, 2023', year: '2023' },
      { title: 'Explore the Impacts of Digital Technology on the Home Confined Children During COVID-19 Isolation: Blessing or Curse?', venue: 'ICERIE, Sylhet, 2021', year: '2021' },
      { title: 'Human Activity Classification from Continuous Optical Flow Using CNN & Bidirectional LSTM', venue: 'ICERIE 2019', year: '2019' },
      { title: 'A Semi-Supervised Approach for Automated Bangla Keyword Extraction', venue: 'ICERIE 2019', year: '2019' },
      { title: 'Computer Vision-based Object Detection and Recognition System for Image Searching Issue', venue: 'ICERIE 2019', year: '2019' },
      { title: 'Brain Tumor Detection With Tumor Region Analysis Using Adaptive Thresholding', venue: 'iCEEiCT, Dhaka, Bangladesh', year: '2018' },
      { title: 'An automated system to detect and recognize license plates of Bangladesh', venue: 'ICCIT 2017, Dhaka, Bangladesh', year: '2017' },
      { title: 'HSV and Template Matching Based Bengali Road Sign Recognition Technique', venue: 'ICISET 2016', year: '2016' },
      { title: 'An efficient method of texture and shape based Content Based Image Retrieval', venue: 'ICERIE 2013, SUST, Sylhet, Bangladesh', year: '2013' },
      { title: 'Medical document classification from OHMUSED dataset', venue: '19th Conference of Islamic Academy of Sciences (IAS)', year: '2013' },
      { title: 'Capsule image segmentation in pharmaceutical applications using edge-based techniques', venue: 'IEEE EIT 2011, USA (Best paper award)', year: '2011' },
      { title: 'Computer-aided detection and classification of masses in digital mammogram using Artificial Neural Networks', venue: 'ICSI 2010, LNCS, Springer', year: '2010' },
      { title: 'Image processing techniques for quality inspection of gelatin capsules in pharmaceutical applications', venue: 'ICARCV 2008, Hanoi, Vietnam', year: '2008' },
      { title: 'Grey scale image segmentation using Minimum Error Thresholding techniques', venue: 'ICUE 2007, Canada (Best paper award)', year: '2007' },
      { title: 'A novel technique for de-Noising CN Tower lightning current signal by modifying its Fast Fourier transform', venue: 'ISPC 2003, Dallas, Texas, USA', year: '2003' },
      { title: 'Frequency analysis of CN Tower lightning current signals using Short Term Fourier Transform', venue: 'ICUE 2003, Canada (Best paper award)', year: '2003' },
      { title: 'De-noising CN Tower lightning current signals by modifying Its Fast Fourier transform', venue: 'CAGE Club Conference, 2002, Canada (Best paper award)', year: '2002' },
      { title: 'BER measurement of optical fiber', venue: 'ICCIT 2000, Dhaka', year: '2000' }
    ],
    teaching: ['Digital Image Processing and Computer Vision', 'Digital Signal Processing', 'Computer Graphics', 'Data Structure and Algorithm', 'Numerical Methods', 'Signals and Systems', 'Introduction to Computer Language', 'Circuit Analysis and Design', 'Digital Logic Design'],
    awards: [
      'Ontario Graduate Scholarship',
      'Casino Windsor Cares/Gail Rosenblum Memorial Breast Cancer Research Scholarships',
      'F. Wayne and Purita C. Bristow Award',
      'Technical Paper Award (4)'
    ],
    graduate_supervision: [
      'PhD (Current Student: 2, Graduated: 2)',
      'MS (Graduated: 7)'
    ]
  },
  {
    id: 'f5',
    slug: 'abdullah-al-mumin',
    full_name: 'Mohammad Abdullah Al Mumin, PhD',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Abdullah_Al_Mumin.jpg',
    email: 'mumin-cse@sust.edu, muminfcc35@gmail.com',
    phone: '+8801711445110',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    personal_website: 'https://www.banglasketch.org',
    biography: 'Mohammad Abdullah Al Mumin is a Professor at the Department of Computer Science and Engineering at the Shahjalal University of Science and Technology (SUST), Sylhet, Bangladesh.\n\nMumin explores research on machine translation, corpus linguistics, natural language processing, and deep learning. Mumin is the founder of Bangla computing lab,BanglaSketch, at SUST. He is the developer of the largest Bangla representative monolingual corpus, SUMono and the largest English-Bangla balanced parallel corpus, SUPara. Currently, Mumin has been working on two machine translation (MT) system projects: shu-torjoma and shu-anubad, which are based on statistical and neural MT approach, respectively.\n\nMumin received his B.Sc.(Engg.) degree in Electronics and Computer Science from SUST in 2000 and M.Sc.(Engg.) degree in Computer Science and Engineering from SUST in 2012. He is currently pursuing his Ph.D. degree in English-Bangla machine translation at the same university.\n\nMr. Mumin\'s awards and honors include the ongoing ICT Fellowship (Bangladesh ICT Division) from 2016, the Chancellor\'s Gold Medal Award in 2001, and Bangladesh Government Fellowship from 1995 to 2000.',
    research_areas: ['Corpus Linguistics', 'Neural Machine Translation', 'Statistical Machine Translation', 'Computational Linguistics', 'Natural Language Processing', 'Deep Learning'],
    active_research: [
      'SHU-ANUBAD : A Neural - based English - Bangla Machine Translation System.'
    ],
    previous_research: [
      'SHU-TARJOMA : A Statistical - based English - Bangla Machine Translation System.',
      'SUMono : A Representative Modern Bangla Corpus',
      'SUPara : A Balanced English - Bangla Parallel Corpus'
    ],
    qualifications: [
      { degree: 'PhD in Neural Machine Translation', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '2020' },
      { degree: 'M.Sc.(Thesis) in Computer Science & Engineering', institution: 'Shahjalal University of Science & Technology, Sylhet', year: '2012' },
      { degree: 'B.Sc.(Engg.) in Electronics & Computer Science', institution: 'Shahjalal University of Science & Technology, Sylhet', year: '1998' }
    ],
    publications: [
      { title: 'A Systematic Literature Review on English and Bangla Topic Modeling', journal: 'Journal of Computer Science, 17(1), 1-18', year: '2020' },
      { title: 'Neural Machine Translation for Low-resource English-Bangla', journal: 'Journal of Computer Science, Vol. 15(11), pp 1627-1637', year: '2019' },
      { title: 'shu-torjoma: EnglishBangla Statistical Machine Translation System', journal: 'Journal of Computer Science, Vol. 15(7), pp 1022-1039', year: '2019' },
      { title: 'English to Bangla Statistical Machine Translation using Factored Translation Model', journal: 'Journal of Computer Science and Engineering, Vol. 1, pp 1-13', year: '2019' },
      { title: 'Neural-based Question Answering System on Bangla Wikipedia Dataset', journal: 'Journal of Computer Science and Engineering, Vol. 1, pp 73-81', year: '2019' },
      { title: 'English to Bangla Statistical Machine Translation using Neural Probabilistic Language Model', journal: 'Computer Science and Engineering Research Journal, Vol. 11, pp 1-8', year: '2018' },
      { title: 'Keyword Extraction in Bangla Scientific Documents: A Hybrid Approach', journal: 'Computer Science and Engineering Research Journal, Vol. 11, pp 28-35', year: '2018' },
      { title: 'Improving Efficiency of Bijoy Keyboard Layout by Repositioning Characters', journal: 'SUST Journal of Science and Technology, Vol. 24, No. 1, pp 25-36', year: '2016' },
      { title: 'A Fine-Grained Tagset for Bengali Language', journal: 'SUST Journal of Science and Technology, Vol. 21, No. 1, pp 1-8', year: '2014' },
      { title: 'SUMono: A Representative Modern Bengali Corpus', journal: 'SUST Journal of Science and Technology, Vol. 21, No. 1, pp 77-85', year: '2014' },
      { title: 'SUPara: A Balanced English-Bengali Parallel Corpus', journal: 'SUST Journal of Science and Technology, Vol. 16, No. 2, pp 46-51', year: '2012' }
    ],
    conferences: [
      { title: 'Developing an Automated Bangla Parts of Speech Tagged Dictionary', venue: 'ICCIT, Khulna University, Khulna', year: '2014' },
      { title: 'Proposed Tagging Techniques for Bengali', venue: 'ICERIE, SUST, Sylhet', year: '2013' },
      { title: 'Small Office PBX Using Voice Over Internet Protocol (VOIP)', venue: 'Advanced Communication Technology, 9th International Conference', year: '2007' },
      { title: 'An Implementation of Machine Translation between Bangla and English', venue: 'ICCIT, NSU, Dhaka', year: '2001' }
    ],
    teaching: ['Natural Language Processing', 'Software Engineering', 'Machine Translation', 'Programmin Language - Python'],
    awards: [
      'ICT Scholarship, ICT Division, People Republic of Bangladesh',
      'Chancellors Gold Medal'
    ]
  },
  {
    id: 'f6',
    slug: 'md-masum',
    full_name: 'Md Masum',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/MD_Masum.jpg',
    email: 'masum-cse@sust.edu',
    phone: '+8801919736248',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Wireless Mesh Network Architecture, Routing, Security, QoS', 'Sensor Newtork – Routing, Scalibility, Data Privacy', 'Mobile Computing – Gaming, Location-Based Service', 'Computer Networking – Communicaton Protocol, Security, Management'],
    external_affiliations: [
      'Associate Member : Bangladesh Computer Society',
      'Honorary Member : Bangladesh Computer Graduate Association'
    ],
    qualifications: [
      { degree: 'M. Sc. (Engineering) in Computer Science & Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '2011' },
      { degree: 'B. Sc. (Engineering) in Computer Science & Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '1997' },
      { degree: 'Higher Secondary Certificate', institution: '', year: '1991' },
      { degree: 'Secondary School Certificate', institution: '', year: '1989' }
    ],
    publications: [
      { title: 'Design and Development of an E-Commerce System in a Rapid Organized Way', journal: 'International Journal of Science and Research (IJSR), Volume 9 Issue 3', year: '2020' },
      { title: 'A Multi Layer Perceptron Along with Memory Efficient Feature Extraction Approach for Bengali Document Categorization', journal: 'Journal of Computer Science, Volume 16 No. 3, pp 378-39', year: '2020' },
      { title: 'A Context Free Spell Correction Method using Supervised Machine Learning Algorithms', journal: 'International Journal of Computer Applications, Volume 176 – No. 27', year: '2020' },
      { title: 'Secured-DSR : Modification of Conventional DSR Protocol for Hierarchical Multitier Ad Hoc Town', journal: 'Accepted for SUST Journal of Science and Technology, Volume 21', year: '2015' },
      { title: 'Sensor-Based Automated River Monitoring System – Perspective to Bangladesh', journal: 'Accepted for SUST Journal of Science and Technology, Volume 21', year: '2015' },
      { title: 'Optimal Bangla Keypad Layout for Mobile Phone based on Ergonomics', journal: 'Accepted for SUST Journal of Science and Technology, Volume 21', year: '2015' }
    ],
    conferences: [
      { title: 'Design and Implementation of Microprocessor Based Electronic Voting System', venue: 'Proceedings of 11st International Conference on Computer and Information Technology (ICCIT), Khulna University of Engineering and Technology, Bangladesh', year: '2008' },
      { title: 'Mobile Location Service (MLS): An enormous market opportunity for mobile operators in Bangladesh', venue: 'Proceedings of Workshop on Prospects and Problems of Mobile and Land Phones in Bangladesh, Independent University, Bangladesh (IUB)', year: '2005' },
      { title: 'Comparative Study on Cluster on Programming Tools', venue: 'Proceedings of 6th International Conference on Communication and Information Technolgy (ICCIT), Jahangirnagar University, Bangladesh', year: '2003' },
      { title: 'A Dynamic Wavelength Assignment algorithm for the changing internodal traffic in all-optical ring network', venue: 'Proceedings of 2nd International Conference on Computer and Information Technology (ICCIT), Shahjalal University of Science and Technology, Bangladesh', year: '1999' }
    ]
  },
  {
    id: 'f7',
    slug: 'husne-ara-chowdhury',
    full_name: 'Dr. Husne Ara Chowdhury',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Husne_Ara_Chow.jpg',
    email: 'husna-cse@sust.edu',
    phone: '+8801558304163',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Speech recognition', 'Speech Analysis', 'Speaker Emotion Recognition', 'Sentiment analysis', 'Accent verification'],
    previous_research: [
      'Development of a Large Corpus of Spontaneous Speech for Improved Speech Recognition in Bangladeshi Bangla'
    ],
    external_affiliations: [
      'Cisco Networking Academy'
    ],
    qualifications: [
      { degree: 'PhD (Speech Signal Analysis)', institution: 'CSE, Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '' },
      { degree: 'B. Sc. (Engineering) in Computer Science & Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '' }
    ],
    publications: [
      { title: 'Improving the harmonic structure of speech spectrum for robust pitch estimation', journal: '', year: '2024' },
      { title: 'Reviews on Pitch Estimation Methods and Recent Improvements', journal: '', year: '2024' },
      { title: 'Group Delay Moment of Cepstrum for Formant Estimation of High-Pitched Noisy Speech', journal: '', year: '2023' },
      { title: 'Formant estimation of high-pitched noisy speech using homomorphic deconvolution of higher-order group delay spectrum', journal: '', year: '2023' },
      { title: 'Higher Order Statistical Analysis of Group Delay Spectrum for Formant Estimation of Noisy Speech Signal', journal: '', year: '2022' },
      { title: 'Effect of pole/zero manipulation in estimating the group delay spectrum', journal: '', year: '2022' },
      { title: 'Formant estimation from speech signal using the magnitude spectrum modified with group delay spectrum', journal: 'Acoust. Sci. & Tech., vol. 42, no. 2, pp. 93-102', year: '2021' },
      { title: 'Speech Signal Analysis in Phase Domain', journal: 'Journal of Computer Science, vol. 16, no. 8, pp. 1115-1127', year: '2020' }
    ],
    teaching: ['Computer Programming Language', 'Compiler Construction', 'Artificial Intelligence', 'Operating System', 'Database', 'Computer Architecture', 'Microprocessor', 'Digital Logic Design', 'Circuit Analysis', 'Semiconductor Devices', 'Data Structure', 'Python Programming'],
    awards: [
      'ICT Fellowship from Bangladesh Government'
    ]
  },
  {
    id: 'f8',
    slug: 'sadia-sultana',
    full_name: 'Dr. Sadia Sultana',
    designation: 'Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Sadia_Sultana.jpg',
    email: 'sadia-cse@sust.edu',
    phone: '+8801911089612',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Speech Analysis', 'Speech Recognition', 'Emotion Recognition', 'Image Processing', 'Deep Learning', 'Big Data'],
    active_research: [
      'Developing and Analyzing an EEG dataset (EmoEG) for the Bangladeshi Participants Using Emotiv EpocX Device for Brain Signal Analysis. Period: 2025-2026; Funded by: SUST Research Centre, SUST, Sylhet, Bangladesh. Responsibility: Principal Investigator'
    ],
    previous_research: [
      'Developing an Emotional Speech Corpus in Bangla and a Web Application; Implementation. Period: 2019-2020; Funded by: SUST Research Centre, SUST, Sylhet, Bangladesh. Responsibility: Co-Investigator',
      'Investigating Information Security Awareness: An Empirical Research among Students and Staffs in Shahjalal University of Science and Technology, Sylhet, Bangladesh. Period: 2019-2020; Funded by: SUST Research Centre, SUST, Sylhet, Bangladesh. Responsibility: Co-Investigator',
      'Developing a Bangladeshi Facial Expression Database: SUFEDB (SUST Facial Expression Database. Period: 2022-2023; Funded by: SUST Research Centre, SUST, Sylhet, Bangladesh. Responsibility: Principal Investigator',
      'Developing a Lip Reading dataset and a System in Bangla Period: 2023-2024; Funded by: SUST Research Centre, SUST, Sylhet, Bangladesh. Responsibility: Principal Investigator',
      'Developing an EEG Dataset (EmoEG) by Comparative Analysis of Brain Waves for Different Emotional States. Responsibility: Thesis Supervisor and project investigator. (2023)',
      'Enhance the Lip Reading Dataset for Developing an Automated Speech Recognition System in Bangla, Period: 2024-2025; Funded by: SUST Research Centre, SUST, Sylhet, Bangladesh. Responsibility: Co-Investigator'
    ],
    qualifications: [
      { degree: 'PhD', institution: 'Dept. of Computer Science and Engineering, Shahjalal University of Science and Technology, Sylhet', year: '' },
      { degree: 'MSc (Thesis)', institution: 'Dept. of Computer Science and Engineering, Shahjalal University of Science and Technology, Sylhet', year: '' },
      { degree: 'BSc. (Engg)', institution: 'Dept. of Computer Science and Engineering, Shahjalal University of Science and Technology, Sylhet', year: '' }
    ],
    publications: [
      { title: 'A Deep Learning Approach Toward Analyzing the Cross-Lingual Acoustic-Phonetic Similarities in Multilingual Speech Emotion Recognition', journal: '', year: '2025' },
      { title: 'An Efficient Ensemble Learning Model Integrating Multi‐ Branch Sub‐Networks for Facial Expression Recognition', journal: '', year: '2025' },
      { title: 'Acoustic feature analysis and optimization for Bangla speech emotion recognition', journal: '', year: '2023' },
      { title: 'A Review of the Advancement in Speech Emotion Recognition for Indo-Aryan and Dravidian Languages', journal: '', year: '2022' },
      { title: 'Highly sensitive double D-shaped channel photonic crystal fiber based plasmonic refractive index sensor', journal: '', year: '2022' },
      { title: 'Bangla Speech Emotion Recognition and Cross-lingual Study Using Deep CNN and BLSTM Networks', journal: '', year: '2022' },
      { title: 'SUST Bangla Emotional Speech Corpus (SUBESCO): An audio-only emotional speech corpus for Bangla', journal: '', year: '2021' },
      { title: 'Recent Advancement in Speech Recognition for Bangla: A Survey', journal: '', year: '2021' },
      { title: 'Security And Privacy Perceptions Among Female Online Social Media Users: A Case Study Of Bangladesh', journal: '', year: '2020' }
    ],
    conferences: [
      { title: 'ExMute: A Context-Enriched Multimodal Dataset for Hateful Memes', venue: '', year: '2025' },
      { title: 'Bengali Sign Language Recognition Using Deep Convolutional Neural Network', venue: '', year: '2018' },
      { title: 'Bengali Sign Language Recognition using dynamic skin calibration and geometric hashing', venue: '', year: '2017' },
      { title: 'An Efficient Method of Texture and Shape based Content-based Image Retrieval', venue: 'International Conference on Engineering Research, Innovation and Education 2013 (ICERIE 2013)', year: '2013' }
    ],
    teaching: [
      'Professor, Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST), Sylhet, Bangladesh. September 2025 - Present',
      'Associate Professor, Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST), Sylhet, Bangladesh. October 2021 - September 2025',
      'Assistant Professor, Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST), Sylhet, Bangladesh. June 2012 - October 2021',
      'Lecturer, Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST), Sylhet, Bangladesh. October 2009 - June 2012.',
      'Student Advisor, Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST), Sylhet, Bangladesh. January 2026-Present',
      'Student Advisor, Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST), Sylhet, Bangladesh. June 2021 - 2023',
      'Assistant Provost, Begum Fazilatunnesa Mujib Hall, March 2023-June 2024',
      'Lecturer, Department of Computer Science & Engineering, Leading University, Sylhet, Bangladesh. October 2008 - October 2009.'
    ],
    awards: [
      'Chancellor\'s Gold Medal:in recognition of the highest talent and achievement among all graduates of the university at the bachelor level of session 2022-2003.',
      'Vice Chancellor\'s Award: in recognition of the highest talent and achievement among all graduates of the school of Applied Science and Technology at the bachelor level of session 2022-2003.',
      'Dean\'s Award: For securing the highest CGPA with honors in the faculty.',
      'Undergraduate Merit Scholarship, UGC, 2003-2007',
      'Graduate Merit Scholarship, UGC, 2010-2011',
      'Dr. Khairullah Research Award received from CSE, SUST- 2022',
      'Dean\'s Award for Research Excellence - 2022',
      'Dean\'s Award for Research Excellence - 2023'
    ],
    graduate_supervision: [
      'Investigating the Impact of Cross-lingual Acoustic-Phonetic Similarities on Multilingual Speech Emotion Recognition (MSc)'
    ]
  },
  {
    id: 'f9',
    slug: 'mahruba-sharmin',
    full_name: 'Mahruba Sharmin Chowdhury',
    designation: 'Associate Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Mahruba_Sharmin.jpg',
    email: 'mahruba-cse@sust.edu, mahrubacse@gmail.com',
    phone: '+8801917566699',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'Mahruba Sharmin Chowdhury received her M.Sc(Thesis) degree in Computer Science and Engineering from Shahjalal University of Science and Technology,Sylhet Bangladesh. She has Completed her Honours degree in Computer Science and Engineering from Jahangirnagar University, Savar, Dhaka, Bangladesh.',
    research_areas: ['Deep Learning', 'Online Security', 'Machine Learning For Bangla Language Processing', 'Image Processing', 'Speech Recognition', 'Natural Language Processing', 'Computational Engineering', 'Robotics'],
    active_research: [
      'lip Reading',
      'Regional Sylheti to Bangla Neural Machine Translation, Using Transformer',
      'Bangla Character Extraction from Signboard',
      'Unraveling the web information: A comprehensive study of on Bangla misinformation, disinformation, satire and fake news.',
      'Face recognition using Deep learning',
      'Towards Secure and User-Centric Passport System: A self-sovereign Identity Perspective',
      'A corpus Studying Code-Switching in Bangla',
      'An efficient implementation and evaluation of Floyd Warshall APSP with OpenCL on FPGA'
    ],
    previous_research: [
      'English to Bangla Character Conversion',
      'Deformable Image Registration for Brain Images',
      'Optical Character Recognition of Bangla Characters',
      'Bangla Handwritten Character Recognition'
    ],
    qualifications: [
      { degree: 'Masters(Thesis)', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '' },
      { degree: 'Honors (CSE)', institution: 'Jahangirnagar University, Savar, Dhaka', year: '' }
    ],
    publications: [
      { title: 'A Systematic Literature Review on English and Bangla Topic Modeling', journal: 'Journal of Computer Science, 17(1), 1-18, 2021', year: '2021' },
      { title: 'Security And Privacy Perceptions Among Female Online Social Media Users: A Case Study Of Bangladesh', journal: 'International Journal of Security, Privacy and Trust Management (IJSPTM), ISSN 2277 – 5498', year: '2020' },
      { title: 'A Literature Review of Bangla Document Clustering', journal: 'International Journal of Computer Applications (0975 – 8887) Volume 175– No.19', year: '2020' }
    ],
    conferences: [
      { title: 'From Scarcity to Capability: Empowering Fake News Detection in Low Resource Languages with LLMs', venue: '31st International Conference on Computational Linguistics(In proceedings(PP.100=107;2025) of the First Workshop on NLP for Indo-Aryan and Dravidian Languages) in Abu Dhabi, UAE', year: '2025' }
    ],
    teaching: ['Theory of Computation', 'Logic Design', 'Computer language(C,Python,SQL)', 'Data Base', 'MIS', 'Computer Application', 'Microprocessor and Interfacing', 'Data Communication'],
    awards: [
      'Awarded as Principal-Investigator By SUST Research Centre, SUST, Sylhet, Bangladesh For The Project "Enhance the Lip Reading Dataset for Developing an Automated Speech Recognition System in Bangla", Period 2024-2025.',
      'Provost of 1st Ladies Hall (First Ladies Hall; From 4-9-14 to 31-8-15)',
      'Assistant Provost( Six Years’ experience of First Ladies Hall before getting Provostship; From 25-8-2008 to 3-9-14)',
      'Worked as Student Advisor (Two Times) selected by the highest authority of SUST.',
      'Conduct a workshop on office management for the staffs of all departments held in 2016.Also an author of such booklet.',
      'Six times act as a chairman of Chairman of the different Exam Committees',
      'Complete a Certified course on Machine learning in 2021(1month )from Eduxlab, India.'
    ]
  },
  {
    id: 'f10',
    slug: 'eamin-rahman',
    full_name: 'Md. Eamin Rahman',
    designation: 'Assistant Professor',
    category: 'faculty',
    avatar_url: '/images/Faculty/Eamin_Rahman.jpg',
    email: 'eamin-cse@sust.edu',
    phone: '+8801677014633',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Bioinformatics', 'Machine Translation', 'Natural Language Processing'],
    qualifications: [
      { degree: 'B.Sc. (Hons.) in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '2005' },
      { degree: 'HSC', institution: 'Dhaka College, Dhaka', year: '2005' },
      { degree: 'SSC', institution: 'Dhanmondi Govt. Boys’ High School, Dhanmondi, Dhaka', year: '2003' }
    ],
    publications: [
      { title: 'MiRANN: A reliable approach for improved classification of precursor microRNA using Artificial Neural Network model', journal: 'Genomics, Volume 99, Issue 4, Pages 189-194', year: '2012' }
    ],
    conferences: [
      { title: 'Enhanced Genetic Algorithm in Scheduling Problems', venue: 'Abstract published in Conference on Engineering Research, Innovation and Education', year: '2011' },
      { title: 'Visual-miR: Visualization system of precursor microRNA', venue: 'Published in Conference on Engineering Research, Innovation and Education', year: '2011' }
    ],
    teaching: ['Object Oriented Programming Language', 'Structured Programming Language', 'Database System', 'Bioinformatics', 'Compiler Construction', 'Introduction to Programming with Python'],
    awards: [
      'Merit Scholarship, Shahjalal University of Science and Technology'
    ]
  },
  {
    id: 'f11',
    slug: 'marium-e-jannat',
    full_name: 'Marium-E- Jannat',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Marium-E-Jannat.jpg',
    email: 'jannat-cse@sust.edu',
    phone: '+8801731650762',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'Marium-E-Jannat is an Assistant Professor in the Department of Computer Science and Engineering (CSE) at Shahjalal University of Science and Technology (SUST). She initially completed his bachelor degree from the Dept. of CSE at SUST, Sylhet, Bangladesh. She has authored 3 journal and 14 conference papers till the date. She also worked as Lecturer in Sylhet International University for about two and a half years.',
    research_areas: ['Human Computer Interaction', 'Image processing', 'Machine Learning', 'Natural Language Processing', 'Parallel Computing'],
    active_research: [
      'Fake News Detection in Social Media Using Machine Learning'
    ],
    previous_research: [
      'SUST Admission Chatbot: A conversational agent to answer all the admission related query.',
      'Automatic Access System using Biometric Recognition',
      'Automatic Bangladeshi License Plate Recognition'
    ],
    qualifications: [
      { degree: 'MSc. in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '2013' },
      { degree: 'BSc. Engg. in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh', year: '2011' }
    ],
    publications: [
      { title: 'Rating prediction for recommendation: Constructing user profiles and item characteristics using backpropagation', journal: 'Applied Soft Computing, Volume 75, Pages 310-322', year: '2019' },
      { title: 'A Probabilistic Machine Learning Approach for Eligible Candidate Selection', journal: 'International Journal of Computer Applications 144(10):1-4', year: '2016' },
      { title: 'Article: Performance Analysis of MPI (mpi4py) on Diskless Cluster Environment in Ubuntu', journal: 'International Journal of Computer Applications 60(14):40-46', year: '2012' }
    ],
    conferences: [
      { title: 'Bengali Abstractive News Summarization (BANS): A Neural Attention Approach', venue: 'International Conference on Trends in Computational and Cognitive Engineering', year: '2020' },
      { title: 'A Machine Learning Approach to Detect Diabetic Retinopathy Using Convolutional Neural Network', venue: 'International Joint Conference on Computational Intelligence', year: '2020' },
      { title: 'A Closer Look into Paintings’ Style Using Convolutional Neural Network with Transfer Learning', venue: 'International Joint Conference on Computational Intelligence', year: '2020' },
      { title: 'Authorship Attribution in Bangla literature using Character-level CNN', venue: '22nd International Conference on Computer and Information Technology (ICCIT)', year: '2019' },
      { title: 'Double Coated VGG16 Architecture: An Enhanced Approach for Genre Classification of Spectrographic Representation of Musical Pieces', venue: '22nd International Conference on Computer and Information Technology (ICCIT)', year: '2019' },
      { title: 'Detection and analysis of brain tumor from MRI by Integrated Thresholding and Morphological Process with Histogram based method', venue: 'International Conference on Computer, Communication, Chemical, Material and Electronic Engineering (IC4ME2)', year: '2018' },
      { title: 'Development of robotic voice conversion for RIBO using text-to-speech synthesis', venue: '4th Intl Conf on Electrical Engineering and Information & Communication Technology', year: '2018' },
      { title: 'A Deep CNN Model for Student Learning Pedagogy Detection Data Collection Using OCR', venue: 'International Conference on Bangla Speech and Language Processing (ICBSLP)', year: '2018' },
      { title: 'A Neural Network Approach for Bangla POS Tagger', venue: 'International Conference on Bangla Speech and Language Processing (ICBSLP)', year: '2018' },
      { title: 'Layered Representation of Bengali Texts in Reduced Dimension Using Deep Feedforward Neural Network for Categorization', venue: '21st International Conference of Computer and Information Technology (ICCIT)', year: '2018' },
      { title: 'An automated system to detect and recognize vehicle license plates of Bangladesh', venue: '20th International Conference of Computer and Information Technology (ICCIT)', year: '2017' },
      { title: 'Product recommendation: A deep learning factorization method using separate learners', venue: '20th International Conference of Computer and Information Technology (ICCIT)', year: '2017' },
      { title: 'A support vector machine mixed with statistical reasoning approach to predict movie success by analyzing public sentiments', venue: '20th International Conference of Computer and Information Technology (ICCIT)', year: '2017' }
    ],
    teaching: ['Computer Graphics and Image Processing', 'Artificial Intelligence', 'Structured Programming Language', 'Database Management Systems', 'Software Engineering', 'Microprocessors & Computer Interfacing', 'Computer Networking', 'Digital Logic Design'],
    graduate_supervision: [
      'BSc (Current Student: 6)'
    ]
  },
  {
    id: 'f12',
    slug: 'mahadi-hasan-nahid',
    full_name: 'Md Mahadi Hasan Nahid',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Mahadi_Hasan.jpg',
    email: 'nahid-cse@sust.edu, mnahid@ualberta.ca',
    phone: '+8801738150127',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    personal_website: 'https://sites.google.com/view/mhn-sust/home',
    biography: 'Mr. Md Mahadi Hasan Nahid is an Assistant Professor in the Department of Computer Science and Engineering (CSE) at Shahjalal University of Science and Technology (SUST) where he obtained his BSc.(Engg.) in Computer Science, with a focus on Natural Language Processing. His research interests include Natural Language Processing, Information Retrieval, and Machine Learning. Mr. Nahid is an active member of various professional organizations, including the SUST ACM Student Chapter, and is dedicated to teaching and mentoring the next generation of computer scientists. He has taught multiple undergraduate courses in Computer Science and has a passion for making a positive impact on society, collaborating with industry partners and non-profit organizations on various initiatives. Currently, Mr. Nahid is on study leave.',
    research_areas: ['Information Retrieval', 'Natural Language Processing', 'Large Language Models', 'Machine Learning', 'HCI'],
    previous_research: [
      'A New Approach for Bengali Document Summarization, SUST Research Center, 2020-21 (Co-Investigator)',
      'Design and development of a Virtual Reality (VR) based E-Learning application to train people with Autism and connect them to the society, SUST Research Center, 2019-20 (Principal Investigator)',
      'SUST Admission Chatbot: A conversational agent to answer all the admission related query, SUST Research Center, 2018-19 (Co-Investigator)',
      'Automatic Access System Using Biometric Recognition, SUST Research Center, 2017-18 (Co-Investigator)'
    ],
    external_affiliations: [
      'Member: Center for Research, Testing and Consultancy, CSE, SUST.'
    ],
    qualifications: [
      { degree: 'MSc (Thesis), Computing Science', institution: 'University of Alberta, AB, Canada', year: '' },
      { degree: 'BSc (Engineering), Computer Science and Engineering', institution: 'SUST', year: '' },
      { degree: 'HSC, GPA 5.0 (Science)', institution: '', year: '' },
      { degree: 'SSC, GPA 5.0 (Science)', institution: '', year: '' }
    ],
    publications: [
      { title: 'Improving Joint Attention in Children with Autism: A VR-AR Enabled Game Approach', journal: 'International Journal of Engineering and Advanced Technology (IJEAT)', year: '2021' },
      { title: 'Prediction and mathematical analysis of the outbreak of coronavirus (COVID-19) in Bangladesh.', journal: 'Results in Applied Mathematics', year: '2021' },
      { title: 'Comparison of VQ and GMM for Text Independent Speaker Identification System for The Bengali Language', journal: 'International Journal of Computer Applications', year: '2019' },
      { title: 'End-to-End Bengali Speech Recognition using DeepSpeech', journal: 'Journal of Engineering Research, Innovation and Education (JERIE)', year: '2019' },
      { title: 'Machine Learning Approaches for Bengali Automated Question Detection System', journal: 'International Journal of Computer Applications', year: '2019' },
      { title: 'Comprehending Real Numbers: Development of Bengali Real Number Speech Corpus', journal: '', year: '2018' }
    ],
    conferences: [
      { title: 'TabSQLify: Enhancing Reasoning Capabilities of LLMs Through Table Decomposition', venue: 'NAACL', year: '2024' },
      { title: 'NormTab: Improving Symbolic Reasoning in LLMs Through Tabular Data Normalization', venue: 'EMNLP', year: '2024' },
      { title: 'Bangla Handwritten Text Recognition: A Segmentation-based Approach to Recognize Bangla Numeral Using Deep CNN', venue: '7th International Conference on Engineering Research, Innovation and Education (ICERIE)', year: '2023' },
      { title: 'Zilla-64: A Bangla Handwritten Word Dataset Of 64 DistrictsName of Bangladesh and Recognition Using Holistic Approach', venue: 'ICSCT', year: '2021' },
      { title: 'Bangla-ExtraSum: Comparative Analysis of Different Methods in Automated Extractive Bengali Text Summarization', venue: 'ICEEICT', year: '2021' },
      { title: 'Word Completion and Sequence Prediction in Bangla Language Using Trie and a Hybrid Approach of Sequential LSTM and N-gram', venue: 'ICAICT', year: '2020' },
      { title: 'Bangla Handwritten Character Recognition Using Deep Convolutional Autoencoder Neural Network', venue: 'ICAICT (IEEE Honorable Mention Award)', year: '2020' },
      { title: 'Bengali Question Answering System for Factoid Questions: a statistical approach', venue: 'ICBSLP', year: '2019' },
      { title: 'Classification of Bengali Questions Towards a Factoid Question Answering System', venue: 'ICASERT', year: '2019' },
      { title: 'Performance Analysis of Different Word Embedding Models on Bangla Language', venue: 'ICBSLP', year: '2018' },
      { title: 'Improving Answer Extraction For Bangali Q/A System Using Anaphora-Cataphora Resolution', venue: 'ICIET', year: '2018' },
      { title: 'Bengali Speech Recognition: A Double Layered LSTM-RNN Approach', venue: 'ICCIT', year: '2017' },
      { title: 'A noble approach for recognizing Bangla real number automatically using CMU Sphinx4', venue: 'ICIEV', year: '2016' }
    ],
    teaching: ['Artificial Intelligence', 'Introduction To Computer Language', 'Digital Signal Processing'],
    awards: [
      'Bangladesh Government’s Ministry of Education Scholarship (HSC) 2011',
      '56th Position, ICPC World Final Contest,Beijing, China (Co-coach) 2018',
      'Vice Chancellor Award 2020',
      'Prime Minister Gold Medal 2016',
      'IEEE Honorable Mention Award, Awarded by CAICT Conference 2020',
      'Dr Md Khairullah Research Award 2021'
    ],
    graduate_supervision: [
      'Actively mentored 15 undergrad students on their final-year research projects.'
    ]
  },
  {
    id: 'f13',
    slug: 'enamul-hassan',
    full_name: 'Enamul Hassan',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Enamul_Hassan.jpg',
    email: 'enam-cse@sust.edu',
    phone: '+19406296731',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'Click here to know more about Enamul Hassan. Note that, I encourage students to get involved in MOOCs and other online courses besides the curricular journey. Currently, I have a good variety of data science courses available for free from DataCamp, and I think this a good opportunity. Feel free to reach me if you want to avail them.',
    research_areas: ['Large Language Models (LLMs)', 'Natural Language Processing (NLP)', 'Data Science (DS)', 'Machine Learning (ML)', 'Deep Learning (DL)'],
    previous_research: [
      'BATS: A Dataset for Bangla Automatic Text Summarization (Principal Investigator)',
      'BED: A Bangla Emotion Dataset for Emotion analysis of Bangla text (Principal Investigator)',
      'Design and Implementation of an Automated Assessment System for MCQ and Subjective Tests for SUST (Principal Investigator)'
    ],
    external_affiliations: [
      'PhD Student at State University of New York at Stony Brook (SBU), New York, United States'
    ],
    qualifications: [
      { degree: 'B. Sc. (Engg.) in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology', year: '' }
    ],
    publications: [
      { title: 'CovidExpert: A Triplet Siamese Neural Network framework for the detection of COVID-19', journal: 'Informatics in Medicine Unlocked', year: '2023' },
      { title: 'Depression Detection from Bangla Facebook Status using Machine Learning Approach', journal: 'International Journal of Computer Applications', year: '2019' },
      { title: 'Bangla Document Categorization using Term Graph', journal: 'International Journal of Computer Applications', year: '2019' }
    ],
    conferences: [
      { title: 'EmoNoBa: A Dataset for Analyzing Fine-Grained Emotions on Noisy Bangla Texts', venue: '2nd Conference of the Asia-Pacific Chapter of the Association for Computational Linguistics', year: '2022' }
    ],
    teaching: ['Advanced Database System', 'Web Engineering', 'Artificial Intelligence', 'Database Management System', 'Introduction to Computer Language (as Non-major)', 'Structured Programming Language', 'Machine Learning', 'Introduction to Programming with Python (as Non-major)', 'Introduction to Computing Application (as Non-major)', 'Data Structures', 'Cloud Computing'],
    graduate_supervision: [
      '(Undergraduate) Session 2013-14: 2, SEC: 5',
      '(Undergraduate) Session 2014-15: 4, SEC: 2',
      '(Undergraduate) Session 2015-16: 3, SEC: 2',
      '(Undergraduate) Session 2016-17: 4, SEC: 2',
      '(Undergraduate) Session 2017-18: 8, SEC: 5'
    ]
  },
  {
    id: 'f14',
    slug: 'moqsadur-rahman',
    full_name: 'MOQSADUR RAHMAN',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Moqsadur.jpg',
    email: 'moqsad-cse@sust.edu',
    phone: '+8801937012488',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Data Science', 'Natural Language Processing', 'Bioinformatics', 'Machine Learning', 'Computer Vision', 'Human-Computer Interaction'],
    active_research: [
      'Named Entity Recognition Using Pretrained Bangla Model'
    ],
    previous_research: [
      'Routine Generator'
    ],
    qualifications: [
      { degree: 'BSc Engineering, CSE', institution: 'SUST', year: '2012-2016' },
      { degree: 'HSC', institution: 'National Ideal College, Dhaka', year: '2011-2012' },
      { degree: 'SSC', institution: 'Khilgaon Govt. High School, Dhaka', year: '2009-2010' }
    ],
    publications: [
      { title: 'Different Machine Learning based Approaches of Baseline and Deep Learning Models for Bengali News Categorization', journal: '', year: '2020' },
      { title: 'Identifying and Categorizing Opinions Expressed in Bangla Sentences using Deep Learning Technique', journal: '', year: '2020' }
    ],
    conferences: [
      { title: 'Bengali Stop Word Detection Using Different Machine Learning Algorithms', venue: '', year: '2020' },
      { title: 'A system for recommending colleges to HSC appointees using slope one algorithm', venue: '', year: '2017' }
    ],
    teaching: ['Algorithm Design & Analysis', 'Object Oriented Programming Language', 'Bio-informatics', 'Data Structure', 'Project Work I', 'Introduction to Computer Language', 'Introduction to Computer Applications']
  },
  {
    id: 'f15',
    slug: 'summit-haque',
    full_name: 'Summit Haque',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Summit_Haque.jpg',
    email: 'summit-cse@sust.edu, summit.haque@gmail.com',
    phone: '+8801677311158',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'Completed secondary school education from Sylhet Govt. Pilot High School in the year 2010. Completed higher secondary education from Murari Chand College Sylhet in the year 2012 and got admitted in the department of CSE at SUST. Joined the department of CSE of Metropolitan University Sylhet as a lecturer after graduation and joined CSE SUST in 26th April 2018.',
    research_areas: ['Natural Language Processing', 'Data Science', 'Machine Learning', 'Computer Vision', 'Human Computer Interaction'],
    active_research: [
      'Named Entity Recognition Using Pretrained Bangla Model'
    ],
    previous_research: [
      'Fake News Detection in Social Media Using Machine Learning'
    ],
    qualifications: [
      { degree: 'BSc Engineering, CSE', institution: 'SUST', year: '2012-2016' },
      { degree: 'HSC', institution: 'Murari Chand College, Sylhet', year: '2011-2012' },
      { degree: 'SSC', institution: 'Govt Pilot High School, Sylhet', year: '2009-2010' }
    ],
    publications: [
      { title: 'Open Source Autonomous Bengali Corpus', journal: '', year: '2020' },
      { title: 'Identifying and Categorizing Opinions Expressed in Bangla Sentences using Deep Learning Technique', journal: '', year: '2020' }
    ],
    teaching: ['Introduction to Computer Language', 'Introduction to Computer Applications', 'Microprocessor', 'Computer Graphics', 'Management Information System', 'Numerical Analysis'],
    awards: [
      'Prime Minister Gold Medal Award 2018'
    ]
  },
  {
    id: 'f16',
    slug: 'arnab-sen-sharma',
    full_name: 'Arnab Sen Sharma',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Arnab_Sen.jpg',
    email: 'arnab-cse@sust.edu, arnab.api@gmail.com',
    phone: '+8801752833557',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    personal_website: 'https://arnab-api.github.io/',
    research_profile_links: [
      { title: 'Google Scholar', url: 'https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=8ihSLrwAAAAJ' }
    ],
    research_areas: ['Data Science and Information Retrieval', 'Computer Vision', 'Natural Language Processing'],
    active_research: [
      'Principal Investigator on the project entitled "A BiLSTM based Deep Learning Approach for Hate Speech Detection in Bangla Text and a Benchmark Dataset for Hate Speech in Bangla." (Project ID: AS/2020/1/26)'
    ],
    qualifications: [
      { degree: 'B.Sc. (Engg.) in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '' },
      { degree: 'HSC', institution: 'Notre Dame College, Dhaka', year: '2013' },
      { degree: 'SSC', institution: 'Moulvibazar Govt. High School', year: '2011' }
    ],
    publications: [
      { title: 'A Simple and Efficient Framework for Sentence Similarity Measurement in Bengali Language', journal: 'International Journal of Computer Applications 183(21):1-7', year: '2021' },
      { title: 'Presenting a Larger Up-to-Date Movie Dataset and Investigating the Effects of Pre-Released Attributes on Gross Revenue', journal: 'Journal of Computer Science, 17(10), 870-888', year: '2021' }
    ],
    conferences: [
      { title: 'Challenges in Tracking the Risk of COVID-19 in Bangladesh; Evaluation of A Novel Method', venue: 'KDD Workshop on Data-driven Humanitarian Mapping, 27th ACM SIGKDD Conference', year: '2021' },
      { title: 'A Deep CNN Model for Student Learning Pedagogy Detection Data Collection Using OCR', venue: 'International Conference on Bangla Speech and Language Processing (ICBSLP)', year: '2018' },
      { title: 'Automatic Detection of Satire in Bangla Documents: A CNN Approach Based on Hybrid Feature Extraction Model', venue: 'International Conference on Bangla Speech and Language Processing (ICBSLP)', year: '2019' }
    ],
    teaching: ['Software Engineering and Design Patterns (CSE 331-332)', 'Database Management Systems (CSE 333-334)', 'Web Technologies (CSE 446)', 'Introduction to Programming - Python (CSE 119_)', 'Introduction to Computing Applications (CSE 202_)'],
    awards: [
      'Best Paper Award, ICBSLP 2019 for the paper Automatic Detection of Satire in Bangla Documents: A CNN Approach Based on Hybrid Feature Extraction Model.',
      'Secured 3rd place in SAMSUNG Research ROBOT HACKATHON-2018 as part of the team SRBD_Hyperbola.'
    ]
  },
  {
    id: 'f17',
    slug: 'maruf-ahmed-mridul',
    full_name: 'Maruf Ahmed Mridul',
    designation: 'Assistant Professor',
    category: 'faculty',
    is_on_leave: true,
    avatar_url: '/images/Faculty/Maruf Ahmed Mridul.png',
    email: 'mridul-cse@sust.edu, mridul133@gmail.com',
    phone: '+8801837363289',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_profile_links: [
      { title: 'Google Scholar', url: 'https://scholar.google.com/citations?user=IjoVmpYAAAAJ&hl=en&oi=ao' }
    ],
    biography: 'Google Scholar : https://scholar.google.com/citations?user=IjoVmpYAAAAJ&hl=en&oi=ao',
    research_areas: ['Computer Vision', 'Natural Language Processing', 'Algorithm Development'],
    qualifications: [
      { degree: 'B.Sc. (Engg.) in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '2018' },
      { degree: 'HSC', institution: 'Notre Dame College, Dhaka', year: '2013' },
      { degree: 'SSC', institution: 'Bhairab K.B. Pilot High School, Bhairab, Kishoreganj', year: '2011' }
    ],
    publications: [
      { title: 'A Simple and Efficient Framework for Sentence Similarity Measurement in Bengali Language', journal: 'International Journal of Computer Applications 183(21):1-7', year: '2021' },
      { title: 'Presenting a Larger Up-to-Date Movie Dataset and Investigating the Effects of Pre-Released Attributes on Gross Revenue', journal: 'Journal of Computer Science, 17(10), 870-888', year: '2021' }
    ],
    conferences: [
      { title: 'Automatic Classification of Meter in Bangla Poems: A Machine Learning Approach', venue: '6th International Conference on Information Systems and Computer Networks (ISCON)', year: '2023' },
      { title: 'Automatic detection of satire in bangla documents: A cnn approach based on hybrid feature extraction model', venue: 'International Conference on Bangla Speech and Language Processing (ICBSLP) (Best Paper Award)', year: '2019' },
      { title: 'A Deep CNN Model for Student Learning Pedagogy Detection Data Collection Using OCR', venue: 'International Conference on Bangla Speech and Language Processing (ICBSLP)', year: '2018' }
    ],
    teaching: ['Advance Database System', 'Competitive Programming', 'Introduction to Computing Applications', 'Digital Signal Processing', 'Data Structure', 'Introduction to Programming Language', 'Computer Graphics', 'Database Systems', 'Software Project Management']
  },
  {
    id: 'f18',
    slug: 'fakhrul-hossain',
    full_name: 'A.K.M. Fakhrul Hossain',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/A.K.M. Fakhrul Hossain.jpg',
    email: 'fakhrul-cse@sust.edu, a.k.m.fakhrul.hossain@gmail.com',
    phone: '+8801521333411',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'A. K. M. Fakhrul Hossain received his BSc. degree in Computer Science and Engineering from Shahjalal University of Science and Technology, Sylhet (SUST) in 2020. He started his career as a Software Engineer in SAMSUNG R & D Institute, Bangladesh (SRBD) in April, 2020. He served there for two years and got recognized as an Advanced Software Engineer. He left SRBD and joined SUST as a lecturer in April, 2022 and is currently serving there. He is also playing a role as Assistant Provost, Second Student Hall, SUST since 2023.',
    research_profile_links: [
      { title: 'Google Scholar', url: '#' },
      { title: 'ICPC ID', url: '#' }
    ],
    research_areas: ['Security', 'Quantum Computing', 'Quantum and Post-Quantum Security'],
    active_research: [
      'Evaluation of Sea Bass (Lates calcarifer) Response to Environmental Variables for Supporting the Spatial Plan for Mariculture, Supported by SUST Research Center'
    ],
    previous_research: [
      'Quaternary Code Performs Better Than Binary Code in Terms of Decoding Speed, Supported by SUST Research Center',
      'Implementation of Health Service Management System for Sylhet Osmanl Medical College Hospital, under Digital Sylhet City Project, Supported by Bangladesh Computer Council'
    ],
    external_affiliations: [
      'Assistant Provost, Second Student Hall, SUST'
    ],
    qualifications: [
      { degree: 'BSc. in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '2020' },
      { degree: 'HSC', institution: 'Notre Dame College, Dhaka', year: '2015' },
      { degree: 'SSC', institution: 'Bangladesh Bank Adarsha High School, Faridabad, Dhaka', year: '2013' }
    ],
    conferences: [
      { title: 'Modelling Attacks in Blockchain Systems using Petri Nets', venue: '', year: '2020' }
    ],
    teaching: ['Introduction to Computer Security(CSE 2017, 2018, 2020)', 'Structured Programming Language (MAT 2020, 2021)', 'Data Structures (CSE 2022, MAT 2020, 2021)', 'Web Technologies Lab (2019, 2022)', 'Management Information System (2022, PGD, IICT)', 'Artificial Intelligence (CSE 2018, 2019)', 'Algorithm Design and Analysis (CSE 2022, MAT 2022)', 'Introduction to Python (IPE 2020, EDGE)', 'Smart Office: Introduction to Computer Applications (PAD 2022, EDGE)'],
    awards: [
      'Coach, SUST_Fanatics, ICPC Dhaka Site Regional 2025 Champion and World Finalist in ICPC World Finals 2025, Baku, Azerbaijan',
      'Coach, SUST_GuessForces, ICPC Asia West Continent Second Runner Up and World Finalist in ICPC World FInals 2024, Astana, Kazakhstan',
      'Co-coach, BerlekampMassey, ICPC World Finalist in ICPC World Finals 2021, Dhaka, Bangladesh',
      'Advanced Software Engineer Recognition in SAMSUNG R & D Institute, Bangladesh (2021)',
      '2nd in Sylhet Region, 11th National Undergraduate Mathematics Olympiad (2019)',
      '3rd in Sylhet Region, 10th National Undergraduate Mathematics Olympiad (2018)',
      '1st in Sylhet Region, 9th National Undergraduate Mathematics Olympiad (2017)',
      '2nd Runner Up, SUST Autonomous Grandprix Line Follower Robotics Competition V1.0 hosted by RoboSUST (2016)',
      '10th in Dhaka Region, National Physics Olympiad (2015)',
      '5th Nationally, National Chemistry Olympiad (2014)',
      '8th in Dhaka Region, National Science Olympiad (2014)',
      'Merit Based Scholarship, Notre Dame College, for being 5th out of 1750 students in Science Group (2014)',
      'Education Board Scholarship in HSC (2015, Dhaka), JSC (2010, Dhaka) and in Class V (2007) for being 1st in Sutrapur Thana, Dhaka'
    ],
    graduate_supervision: [
      'Abdulla Al Mahmud Mugdho, Mir Md. Tahmid Kabir: MediTrust: A Blockchain-Based Healthcare System Integrating Self-Sovereign Identity for Privacy and Selective Data Sharing (2024)',
      'Mustaq Mujahid Mim, Mubashshira Tasneem: Application Agnostic Performance Evaluation Framework for Self-Sovereign Identity-based Applications (2024)',
      'Kawchar Husain, Samia Preity: Calculating Low-energy State of HP Model Proteins by Variational Quantum Eigensolver (2023)',
      'Kazi Md Arif Shahriar, Md. Omar Ali Sultan: SSI Empowered Device-to-Device Communication (2023)',
      'Seemanta Bhattacharjee, MD Fuad: Classification of Financial Data Using Quantum Support Vector Machine (2022)',
      'Md. Isahaq Ali, Syed Sharfaraz Ahmed : A Framework for Agricultural Asset Tokenization and Ownership Management (2022)'
    ],
    publications: []
  },
  {
    id: 'f19',
    slug: 'shadmim-hasan-sifat',
    full_name: 'Md. Shadmim Hasan Sifat',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/Md. Shadmim Hasan Sifat.jpg',
    email: 'shadmim-cse@sust.edu',
    phone: '+8801571291835',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    biography: 'Shadmim Hasan Sifat finished his B.Sc. in Computer Science and Engineering from Bangladesh University of Engineering and Technology (BUET) in June 2023. With a keen enthusiasm and passion for serving in academia, he joined the Department of Computer Science and Engineering at Shahjalal University of Science and Technology (SUST) in November 2023.',
    research_areas: ['Bioinformatics', 'Deep Learning', 'Image Segmentation', 'Natural Language Processing'],
    qualifications: [
      { degree: 'BSc. in Computer Science and Engineering', institution: 'Bangladesh University of Engineering and Technology (BUET)', year: '2023' },
      { degree: 'HSC', institution: 'Notre Dame College, Dhaka', year: '2017' },
      { degree: 'SSC', institution: 'Thakurgaon Govt. Boys High School, Thakurgaon', year: '2015' }
    ],
    publications: [
      { title: 'DeepIndel: A ResNet-Based Method for Accurate Insertion and Deletion Detection from Long-Read Sequencing', journal: '', year: '2025' }
    ],
    conferences: [
      { title: 'Vision Transformer-Based Tea Leaf Disease Classification Using a Novel Dataset', venue: '', year: '2025' }
    ],
    teaching: ['Structured Programming Language (C) - Theory & Sessional (July - Dec 23)', 'IT Support for Office Management (ITS) - (July - Dec 23)', 'Introduction To Computer Language (C) - Theory & Sessional (July - Dec 23)', 'Introduction To Computer Security And Forensics - Theory & Sessional (Jan - June 23)', 'Introduction To Programming With Python - Theory & Sessional (Jan - June 23)', 'Project Work I (Structured Programming Language [C] Based) - Sessional (July - Dec 22)', 'Data Structure - Theory & Sessional (July - Dec 24)'],
    awards: [
      'Dean\'s List Award : For securing the GPA more than 3.75 in a semester. (8 times)',
      'University Merit Scholarship (41st out of around 12k candidates in BUET admission)',
      'University Stipend Scholarship',
      'Education Board Scholarship in SSC (Stood 3rd)',
      'Education Board Scholarship in HSC (Stood 4th)'
    ]
  },
  {
    id: 'f20',
    slug: 'mehedi-hasan',
    full_name: 'Md. Mehedi Hasan',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/Md. Mehedi Hasan.jpg',
    email: 'mehedi-cse@sust.edu, rumiswe@gmail.com',
    phone: '+8801932981532',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_profile_links: [
      { title: 'LinkedIn', url: '#' }
    ],
    research_areas: ['Cloud', 'Deep Learning', 'Software Engineering'],
    qualifications: [
      { degree: 'BSc in Software Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '2023' },
      { degree: 'HSC', institution: 'M.E.H Arif College', year: '2017' },
      { degree: 'SSC', institution: 'Mouchak Scout High School', year: '2015' }
    ],
    teaching: ['Cloud Computing', 'Computer Networking', 'Software Project Management', 'Introduction to Python programming', 'Discrete Mathematics', 'Numerical Analysis'],
    publications: []
  },
  {
    id: 'f21',
    slug: 'ishtiaque-zahid',
    full_name: 'Ishtiaque Zahid',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/Ishtiaque Zahid.jpg',
    email: 'ishtiaque-cse@sust.edu',
    phone: '+8801715572978',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: [],
    qualifications: [
      { degree: 'B.Sc. (Hons.) in Computer Science and Engineering', institution: 'University of Dhaka', year: '' }
    ],
    publications: []
  },
  {
    id: 'f22',
    slug: 'abdullah-al-thaki',
    full_name: 'Abdullah Al Thaki',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/Abdullah Al Thaki.jpg',
    email: 'toki-cse@sust.edu',
    phone: '01516178219',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: [],
    qualifications: [
      { degree: 'Master of Science in Computer Science and Engineering', institution: 'University of Dhaka', year: '' },
      { degree: 'Bachelor of Science with Honours in Computer Science and Engineering', institution: 'University of Dhaka', year: '' }
    ],
    publications: [
      { title: 'Graph Contrastive Learning: A Comprehensive Review of Methodologies, Applications, and Future Directions. (Under Review)', journal: 'IEEE Access', year: '2025' },
      { title: 'Addressing Node Integration Skewness in Graph Neural Networks Using Hop-Wise Attention', journal: 'PREPRINT available at Research Square', year: '2025' }
    ]
  },
  {
    id: 'f23',
    slug: 'shymon-islam',
    full_name: 'Md. Shymon Islam',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/Md. Shymon Islam.jpg',
    email: 'shymon-cse@sust.edu, shymum1702@cseku.ac.bd',
    phone: '+8801718550548',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_profile_links: [
      { title: 'LinkedIn', url: '#' },
      { title: 'GitHub', url: '#' },
      { title: 'Google Scholar', url: '#' },
      { title: 'ResearchGate', url: '#' }
    ],
    biography: 'Shymon was born and raised in Khulna, Bangladesh. With a deep passion for technology and innovation, he pursued both his Bachelor of Science (BSc) and Master of Science (MSc) in Computer Science and Engineering (CSE) at Khulna University, one of the country\'s leading public universities. An avid researcher, Shymon has cultivated diverse interests in computer science. Previously, he joined the Department of Computer Science and Engineering (CSE) at North Western University (NWU), Bangladesh, as a Lecturer on May 10, 2022. He resigned from the post of Lecturer in the NWU CSE department on June 14, 2025. Now he joined the Department of Computer Science and Engineering (CSE) at Shahjalal University of Science and Technology (SUST) on June 15, 2025, with a strong passion for teaching and research. In addition to his academic background, Shymon is dedicated to exploring the practical applications of their research, striving to bridge the gap between theoretical innovation and real-world impact.',
    research_areas: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Data Mining', 'Pattern Recognition', 'Artificial Intelligence'],
    qualifications: [
      { degree: 'M.Sc. (Engg.) in Computer Science and Engineering (CSE)', institution: 'Khulna University, Bangladesh', year: '2024' },
      { degree: 'B.Sc. (Engg.) in Computer Science and Engineering (CSE)', institution: 'Khulna University, Bangladesh', year: '2022' },
      { degree: 'HSC', institution: 'Govt. M. M. City College, Khulna', year: '2016' },
      { degree: 'SSC', institution: 'Saint Joseph\'s High School, Khulna', year: '2014' }
    ],
    publications: [
      { title: 'Sentiment analysis of Bangla language using a new comprehensive dataset BangDSA and the novel feature metric skipBangla-BERT', journal: 'Natural Language Processing Journal', year: '2024' },
      { title: 'A solution method to maximal covering location problem based on chemical reaction optimization (CRO) algorithm', journal: 'Soft Computing', year: '2023' },
      { title: 'Compilation, analysis and application of a comprehensive Bangla Corpus KUMono', journal: 'IEEE Access', year: '2022' },
      { title: 'Enhancing Task-Specific Stress Monitoring Using AI-Powered EEG Feature Selection', journal: 'Feature Fusion for Next-Generation AI: Building Intelligent Solutions from Medical Data', year: '2025' },
      { title: 'Solving Maximal Covering Location Problem Using Chemical Reaction Optimization', journal: 'Data Science and Computational Intelligence: Sixteenth International Conference on Information Processing', year: '2021' }
    ],
    conferences: [
      { title: 'HybridStack-BD: A Multilevel Stacking Ensemble Method with Hybrid Features for Bangla Drama Sentiment Analysis', venue: '2025 IEEE 7th International Conference on Sustainable Technologies For Industry 5.0 (STI)', year: '2025' },
      { title: 'A Majority Hard Voting Based Ensemble Approach to Predict Cardiovascular Disease', venue: '2025 International Conference on Electrical, Computer and Communication Engineering (ECCE)', year: '2025' },
      { title: 'Machine Learning Based Potential Customer Recommendation System for E-Commerce Using Feature Selection and XAI', venue: '2025 International Conference on Electrical, Computer and Communication Engineering (ECCE)', year: '2025' },
      { title: 'An Interpretable Sentiment Recognition Method from Political Bangla Texts Using Stacking Ensemble Model', venue: '2025 International Conference on Electrical, Computer and Communication Engineering (ECCE)', year: '2025' },
      { title: 'Predicting Depressive Behavior with Monitoring Activity Data Using Machine Learning and Feature Selection Approaches', venue: '2024 6th International Conference on Electrical Engineering and Information & Communication Technology (ICEEICT)', year: '2024' },
      { title: 'An Empirical Study on Developing Stacking Ensemble Model for Bangla Sports Sentiment Analysis', venue: '2024 15th International Conference on Computing Communication and Networking Technologies (ICCCNT)', year: '2024' },
      { title: 'Analyzing Bangla Drama and TV Series Reviews Using Stacking Method', venue: 'Proceedings of the 3rd International Conference on Computing Advancements', year: '2024' },
      { title: 'Analyzing Public Sentiments from Bangladeshi Tour and Travel Vlog Video Comments Using Machine Learning', venue: '2024 International Conference on Innovations in Science, Engineering and Technology (ICISET)', year: '2024' },
      { title: 'Alzheimers Disease Detection through LASSO and RFE based Feature Selection from EEG Data', venue: '2024 IEEE International Conference on Biomedical Engineering, Computer and Information Technology for Health (BECITHCON)', year: '2024' },
      { title: 'Stacked-KBR: An Ensemble Method for Analyzing YouTube Bangla Song Reviews Using a Novel Dataset', venue: '2024 27th International Conference on Computer and Information Technology (ICCIT)', year: '2024' },
      { title: 'Recognizing Emotions from Crime Video Comments Based on Pretrained Language Models and Explainable AI', venue: '2024 27th International Conference on Computer and Information Technology (ICCIT)', year: '2024' },
      { title: 'An empiric study on bangla sentiment analysis using hybrid feature extraction techniques', venue: '2023 14th International Conference on Computing Communication and Networking Technologies (ICCCNT)', year: '2023' },
      { title: 'Bangla document classification based on machine learning and explainable NLP', venue: '2023 6th International Conference on Electrical Information and Communication Technology (EICT)', year: '2023' },
      { title: 'Sentiment analysis on bangla food reviews using machine learning and explainable NLP', venue: '2023 26th International Conference on Computer and Information Technology (ICCIT)', year: '2023' },
      { title: 'Thyroid disease prediction based on feature selection and machine learning', venue: '2022 25th International Conference on Computer and Information Technology (ICCIT)', year: '2022' }
    ],
    awards: [
      'Best Paper Award: In International Conference on Information Processing (ICInPro) 2021 conference at Bengaluru, India.',
      'Dean\'s Award : For securing the CGPA more than 3.75 in both BSc. (Engg.) and MSc. (Engg.) programs',
      'University Merit Scholarship: Based on 1st, 2nd, 3rd, and 4th year academic results (TGPA) in undergraduate program',
      'University Research Scholarship: In MSc. (Engg.) program'
    ]
  },
  {
    id: 'f24',
    slug: 'fahimul-islam-fahim',
    full_name: 'MD Fahimul Islam Fahim',
    designation: 'Lecturer',
    category: 'faculty',
    avatar_url: '/images/Faculty/MD Fahimul Islam Fahim.jpg',
    email: 'fahim-cse@sust.edu, fahim26.sust@gmail.com',
    phone: '01893639181',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: [],
    qualifications: [],
    publications: []
  },
  // ===== Retired Faculty =====
  {
    id: 'f25',
    slug: 'mohammed-alamgir',
    full_name: 'Mr. Mohammed Alamgir',
    designation: 'Assistant Professor',
    category: 'retired',
    avatar_url: '/images/Faculty/Mr. Mohammed Alamgir.jpg',
    email: 'alamgir99@gmail.com',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: [],
    qualifications: [],
    publications: []
  },
  {
    id: 'f26',
    slug: 'muhammed-zafar-iqbal',
    full_name: 'Dr Muhammed Zafar Iqbal',
    designation: 'Professor',
    category: 'retired',
    avatar_url: '/images/Faculty/Dr Muhammed Zafar Iqbal.jpg',
    email: 'mzi@sust.edu',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Bangla OCR', 'Bangla Speech to Text', 'Bangla Natural Language Processing', 'WDM Network', 'Optical Communication', 'GPON', 'Non-Linear Optics', 'Robotics'],
    qualifications: [
      { degree: 'Ph.D in Experimental Physics', institution: 'University of Washington, Seattle, USA', year: '1982' },
      { degree: 'MSc in Theoretical Physics', institution: 'University of Dhaka', year: '1974' },
      { degree: "BSc (Hon's) in Physics", institution: 'University of Dhaka', year: '1973' }
    ],
    publications: [
      { title: 'Mitigation Motion Artifacts in FDK based 3D Cone-beam Brain Imaging System using Markers', journal: 'Central European Journal of Engineering', year: '2012' },
      { title: 'Transformational Generative Grammar for Various Types of Bengali Sentences', journal: 'SUST Studies', year: '2010' },
      { title: 'A Bangla Spell Checking System', journal: 'SUST Studies', year: '2008' },
      { title: 'Bangla Sorting Algorithm – A Linguistic Approach', journal: 'SUST Studies', year: '2007' },
      { title: 'Integrated Four-Wavelength DFB laser array with 10 Gb/s Speed and 5nm continuous Tuning Range', journal: 'IEEE Photon. Technol. Lett', year: '1992' },
      { title: 'New Limit on Neutrinoless Double Beta Decay in Xenon 136 with a time projection Chamber', journal: 'Phys. Rev. Lett.', year: '1991' },
      { title: 'Low Threshold and high speed 1.5um strained layer MQW four wavelength DFB laser arrays', journal: 'Elect. Lett.', year: '1991' },
      { title: 'Multigigabit/s operation of 16 wavelength VCSEL Array', journal: 'Photon. Tech. Lett.', year: '1991' },
      { title: 'Observation of Equivalent Rayleigh Scattering Mirrors in Lightwave systems with optical amplifiers', journal: 'IEEE Photonic Tech. Lett.', year: '1990' },
      { title: 'Performance of Directly Modulated DFB lasers in 10 Gb/s ASK, FSK and DPSK lightwave systems', journal: 'J. Lightwave Technol', year: '1990' },
      { title: 'Impact of Multiple Reflection Noise in Gbit/sec Lightwave Systems with Optical Fiber Amplifiers', journal: 'Elect. Lett.', year: '1989' },
      { title: 'Monte Carlo Simulation of Electron Trajectories in High Pressure Xenon', journal: 'Nucl. Inst. Meth.', year: '1987' },
      { title: 'Study of Prototype Xenon TPC', journal: 'Nucl. Inst. Meth.', year: '1986' },
      { title: 'A Technique for Measuring Parity non Conservation in Hydrogenic Atoms', journal: 'Nucl. Inst. Meth.', year: '1981' }
    ],
    conferences: [
      { title: '10 Gbits/s Direct DPSK Modulation and Direct Detection Experiment', venue: 'CLEO 90, Anaheim, California', year: '1990' },
      { title: 'A Time Projection Chamber for Double Beta Decay in Xe 136' },
      { title: 'Low threshold and high speed 1.5um strained layer MQW 4-wavelength DFB laser' },
      { title: 'A 94 km 11Gb/s NRZ transmission experiment using a 1540nm DFB laser' },
      { title: 'An 11 Gbit/sec 260 km Transmission Experiment Using Er-Doped Fiber Amplifiers' },
      { title: '10 Gbits/s DFB MODFET Transmitter OEICs for High Speed Transmission' }
    ],
    teaching: ['Discrete Mathematics', 'Fiber Optics', 'Digital Logic Design', 'Electrical Circuit', 'Electronics Devices', 'Numerical Analysis', 'Semi Conductor', 'Electromagnetic Fields and Wave'],
    awards: [
      'Bangla Academy Literary Award 2005',
      'Quazi Mahbubulla Zebunnesa Award 2002',
      'Sheltech Literary Award 2003',
      'Khalekdad Chowdhury Literary Award 1410',
      'American Alimony Association Award 2005',
      'Dhaka University Alimony Association Award 2005',
      'One of the 10 Living Eminent Bengali 2005'
    ]
  },
  {
    id: 'f27',
    slug: 'farida-chowdhury',
    full_name: 'Dr. Farida Chowdhury',
    designation: 'Professor',
    category: 'retired',
    avatar_url: '/images/Faculty/Dr. Farida Chowdhury.jpg',
    email: 'deeba.bd@gmail.com',
    phone: '+8801743018917',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Peer-to-Peer (P2P) Networking', 'Mobile Networks', 'Usable Security', 'Human Computer Interaction (HCI)'],
    qualifications: [
      { degree: 'PhD in Structured Peer-to-Peer Overlays for NATed Churn Intensive Networks', institution: 'University of Stirling, Scotland, UK' },
      { degree: 'MSc in Network and e-Business Centred Computing', institution: 'University of Reading, UK; Aristotle University, Greece; Universidad Carlos III, Spain' },
      { degree: 'BSc Engineering in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet, Bangladesh' }
    ],
    publications: [
      { title: 'A Systematic Literature Review on Wearable Health Data Publishing under Differential Privacy', journal: 'International Journal of Information Security, 21, 847-872', year: '2022' },
      { title: 'A Systematic Literature Review of Graphical Password Schemes', journal: 'International Journal of Computing Science and Engineering, 14(4), 163-185', year: '2021' },
      { title: 'Social Anchor: Privacy-friendly Attribute Aggregation from Social Networks', journal: 'IEEE Access, 8, 61844-61871', year: '2020' },
      { title: 'In Search of Self-sovereign Identity Leveraging Blockchain Technology', journal: 'IEEE Access, 7, 103059-103079', year: '2019' },
      { title: 'Modelling Cyber Attacks', journal: 'International Journal of Network Security & Its Applications (IJNSA)', year: '2017' },
      { title: 'Performance Analysis of R/KADEMLIA, Pastry and Bamboo Using Recursive Routing in Mobile Networks', journal: 'International Journal of Computer Networks & Communications, 9(5), 41-54', year: '2017' },
      { title: 'Performance analysis of structured peer-to-peer overlays for mobile networks', journal: 'International Journal of Parallel, Emergent and Distributed Systems, 32(5), 522-548', year: '2017' },
      { title: 'A Hybrid Model of Attribute Aggregation in Federated Identity Management', journal: 'Enterprise Security, Springer, 120-154', year: '2015' }
    ],
    conferences: [
      { title: 'Examining Usability Issues in Blockchain-Based Cryptocurrency Wallets', venue: 'International Conference on Cyber Security and Computer Science, Springer', year: '2020' },
      { title: 'Query Expansion for Bangla Search Engine Pipilika', venue: 'IEEE TENSYMP', year: '2020' },
      { title: 'A Study of Password Security Factors among Bangladeshi Government Websites', year: '2020' },
      { title: 'Measuring Vulnerabilities of Bangladeshi Websites', venue: 'IEEE ECCE 2019', year: '2019' },
      { title: 'End to End Parts of Speech Tagging and NER in Bangla', venue: 'IEEE ICBSLP 2019', year: '2019' },
      { title: 'Bengali Document Clustering Using Word Movers Distance', venue: 'IEEE ICBSLP 2018', year: '2018' },
      { title: 'Pipilika N-Gram viewer: an efficient large scale N-Gram model for Bengali', venue: 'IEEE ICBSLP 2018', year: '2018' },
      { title: 'CrowdsouRS: A Crowdsourced Reputation System for Identifying Deceptive Online Contents', venue: 'IEEE ICCIT 2017', year: '2017' },
      { title: 'An Evaluation of Epichord in Oversim', venue: 'Networks and Communications, NetCom, Springer', year: '2014' },
      { title: 'Performance Evaluation of EpiChord under High Churn', venue: '8th ACM workshop PM2HW2N 2013', year: '2013' },
      { title: 'Performance Evaluation of Structured P2P Overlays for Mobile Networks', venue: 'IEEE DeSe 2013', year: '2013' },
      { title: 'Identity federations: A new perspective for Bangladesh', venue: 'IEEE ICIEV 2012', year: '2012' },
      { title: 'A Survey of P2P Solutions in Mobile and Cellular Networks', venue: 'PGNet 2012', year: '2012' },
      { title: 'A Taxonomy of Attack Methods on Peer-to-Peer Network', venue: 'ICCIIS 2007', year: '2007' },
      { title: 'Middleware Distributed Approach to Synchronous Detection of ARP Cache Poisoning', venue: 'ICCIIS 2007', year: '2007' },
      { title: 'An Extended Algorithm to Enhance the Performance of the Current NAPT', venue: 'IEEE ICCIT 2007', year: '2007' },
      { title: 'Covert Channel Communication in RFID', venue: 'SIN 2007', year: '2007' }
    ],
    teaching: ['Communication Engineering', 'Computer Networking', 'Technical Writing and Presentation'],
    awards: [
      'Erasmus-Mundus MSc Scholarship for Network and e-Business Centred Computing (NeBCC)',
      'Google Anita Borg Memorial Scholarship (Europe, Middle East, Africa): FINALIST',
      'Scottish Informatics and Computer Science Alliance (SICSA) Studentship for PhD'
    ]
  },
  {
    id: 'f28',
    slug: 'ayesha-tasnim',
    full_name: 'Ayesha Tasnim',
    designation: 'Assistant Professor',
    category: 'retired',
    avatar_url: '/images/Faculty/Ayesha Tasnim.jpg',
    email: 'tasnim-cse@sust.edu',
    phone: '+8801713328269',
    office_address: 'Department of Computer Science & Engineering, Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh',
    research_areas: ['Machine Learning', 'Bioinformatics', 'Neuroscience'],
    qualifications: [
      { degree: 'MSc in Machine Learning', institution: 'KTH Royal Institute of Technology, Stockholm, Sweden', year: '2012' },
      { degree: 'BSc (Hons.) in Computer Science and Engineering', institution: 'Shahjalal University of Science and Technology, Sylhet', year: '2008' }
    ],
    publications: [
      { title: 'How to talk about protein-level false discovery rates in shotgun proteomics', journal: 'Proteomics, 16(18): 2461-2469', year: '2016' },
      { title: 'Basic Quantum Algorithms and Applications', journal: 'International Journal of Computer Applications (0975-8887) Volume 56-No.4', year: '2012' }
    ],
    teaching: ['Machine Learning', 'Bioinformatics', 'Data Structures and Algorithms', 'Structured Programming Language', 'Numerical Analysis', 'Database Management Systems'],
    awards: ['Swedish Institute Study Scholarship for MSc 2012']
  }
];
