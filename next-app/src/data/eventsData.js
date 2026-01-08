// Hardcoded events data matching database structure
export const eventsData = [
    {
        "_id": { "$oid": "694ce9c4297836cde768247f" },
        "eventId": "EVNT01",
        "eventName": "QuestX",
        "category": "Non Technical",
        "oneLineDescription": "Fun and challenging activities to boost creativity, analytical skills, and teamwork",
        "description": "QuestX is a non-technical event designed to engage participants through fun yet challenging activities that enhance creativity, analytical thinking, teamwork, and problem-solving skills in an interactive environment.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cb" },
        "rounds": [
            {
                "title": "Creative & Fun Challenges",
                "tagline": "Unleash creativity, think fast, and have fun as a team.",
                "description": "Includes Limbo, Memory Game, Grid Game with mini dares, Pictionary, Emoji Decoding, Connections, and Meme Creation to encourage innovation, humour, observation skills, and collaboration.",
                "_id": { "$oid": "694ce9c4297836cde7682480" }
            },
            {
                "title": "Escape Room Challenge",
                "tagline": "Solve together, escape together, beat the clock.",
                "description": "Participants use personal belongings to solve puzzles and unlock clues, testing teamwork, strategic thinking, and problem-solving under pressure.",
                "_id": { "$oid": "694ce9c4297836cde7682481" }
            }
        ],
        "contacts": [
            { "name": "Neelesh Padmanabh", "mobile": "8148401083", "_id": { "$oid": "694ce9c4297836cde7682482" } },
            { "name": "Atul Vasanthakrishnan", "mobile": "9345722948", "_id": { "$oid": "694ce9c4297836cde7682483" } }
        ],
        "hall": "Q Block Classroom",
        "eventRules": "Participants must follow organiser instructions and maintain sportsmanship throughout the event.",
        "teamSize": 4,
        "prizePool": "₹5,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "To be announced",
        "scheduleStart": "10:30",
        "scheduleEnd": "16:00",
        "scheduleDay": "day1",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:37:40.909Z" },
        "updatedAt": { "$date": "2025-12-25T07:37:40.909Z" },
        "__v": 0,
        "image": "/images/events/paper_presentation.png"
    },

    {
        "_id": { "$oid": "694ce9d2297836cde7682488" },
        "eventId": "EVNT02",
        "eventName": "neXus",
        "category": "Technical",
        "oneLineDescription": "Marvel-themed beginner-friendly cybersecurity CTF with mission-based challenges",
        "description": "neXus is a Marvel-themed Capture The Flag (CTF) event consisting of six mission-based cybersecurity challenges designed to build foundational technical skills, teamwork, and confidence through hands-on learning.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cb" },
        "rounds": [
            {
                "title": "Infinity Stone Missions",
                "tagline": "Capture the flags and restore balance to the system.",
                "description": "Six beginner-friendly cybersecurity challenges covering cryptography, DNS lookup, log analysis, steganography, timestamp conversion, and web inspection. Participants capture flags and document solutions with screenshots.",
                "_id": { "$oid": "694ce9d2297836cde7682489" }
            }
        ],
        "contacts": [
            { "name": "Karthick J S", "mobile": "9042480747", "_id": { "$oid": "694ce9d2297836cde768248a" } },
            { "name": "Pravith", "mobile": "9843243610", "_id": { "$oid": "694ce9d2297836cde768248b" } }
        ],
        "hall": "AIR Lab",
        "eventRules": "Time limit is 2 hours. Participants must follow organiser instructions. Any cheating leads to disqualification. Points are awarded based on accuracy, creativity, and timely completion. Organisers' decisions are final.",
        "teamSize": 3,
        "prizePool": "₹3,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "2 Hours",
        "scheduleStart": "09:00",
        "scheduleEnd": "15:00",
        "scheduleDay": "day2",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:37:54.049Z" },
        "updatedAt": { "$date": "2025-12-25T07:37:54.049Z" },
        "__v": 0,
        "image": "/images/events/paper_presentation.png"
    },

    {
        "_id": { "$oid": "694cec9c297836cde7682490" },
        "eventId": "EVNT03",
        "eventName": "Git Wars",
        "category": "Non Technical",
        "oneLineDescription": "Clone. Commit. Conquer",
        "description": "Git Wars is a two-round interactive event that blends creativity, communication, strategy, and basic technical thinking. With a Star Wars theme, participants compete as teams in progressive rounds where early performance directly impacts later advantages, fostering teamwork, improvisation, and decision-making in a fun and competitive environment.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cf" },
        "rounds": [
            {
                "title": "Round 1 – Code Charades (The Droid's Transmission)",
                "tagline": "Act fast, decode signals, earn your advantage.",
                "description": "Participants act out computer science-related terms using gestures only, with added constraints from Bug Cards. Points earned convert into strategic advantages for the next round.",
                "_id": { "$oid": "694cec9c297836cde7682491" }
            },
            {
                "title": "Round 2 – Deal or No Deal: CS Edition (The Asteroid Field)",
                "tagline": "Choose wisely or crash into uncertainty.",
                "description": "Teams answer a mix of technical and non-technical questions and use advantages earned in Round 1 to select cups containing hidden points, introducing risk-taking and strategy.",
                "_id": { "$oid": "694cec9c297836cde7682492" }
            }
        ],
        "contacts": [
            { "name": "Srimathikalpana T", "mobile": "8122966128", "_id": { "$oid": "694cec9c297836cde7682493" } },
            { "name": "Suryaprakash B", "mobile": "7339143171", "_id": { "$oid": "694cec9c297836cde7682494" } }
        ],
        "hall": "G Block Classroom",
        "eventRules": "Teams must follow organiser instructions. Judging is based on accuracy, time, creativity, team synergy, and effective use of advantages. Organisers' decisions are final.",
        "teamSize": 4,
        "prizePool": "₹4,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "To be announced",
        "scheduleStart": "09:00",
        "scheduleEnd": "14:00",
        "scheduleDay": "day2",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:49:48.371Z" },
        "updatedAt": { "$date": "2025-12-25T07:49:48.371Z" },
        "__v": 0,
        "image": "/images/events/paper_presentation.png"
    },

    {
        "_id": { "$oid": "694ceca6297836cde7682499" },
        "eventId": "EVNT04",
        "eventName": "ForceCoders",
        "category": "Technical",
        "oneLineDescription": "Code like Tourist. Hack like a Grandmaster.",
        "description": "ForceCoders is a high-intensity competitive coding event focused on core computer science fundamentals such as data structures, algorithms, and system logic. The event follows a progressive two-round format that tests implementation speed, algorithmic depth, debugging ability, and adversarial thinking.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cf" },
        "rounds": [
            {
                "title": "Round 1 – Coding Phase",
                "tagline": "Solve fast, code clean, survive the leaderboard.",
                "description": "Participants solve 5–6 competitive programming problems ranging from easy to hard on a standard CP platform. Performance is judged on correctness, time taken, and penalties.",
                "_id": { "$oid": "694ceca6297836cde768249a" }
            },
            {
                "title": "Round 2 – Hacking Phase",
                "tagline": "Exploit weaknesses and defend your logic.",
                "description": "Participants attempt to break other contestants' accepted solutions by identifying edge cases and submitting failing test inputs. Points are awarded for successful hacks and deducted for failed ones.",
                "_id": { "$oid": "694ceca6297836cde768249b" }
            }
        ],
        "contacts": [
            { "name": "Dhaarun Abhimanyu S", "mobile": "9790313358", "_id": { "$oid": "694ceca6297836cde768249c" } },
            { "name": "A T Abbilaash", "mobile": "8667093591", "_id": { "$oid": "694ceca6297836cde768249d" } }
        ],
        "hall": "AIR Lab",
        "eventRules": "Cheating is prohibited. Points are awarded for successful hacks and reduced for failed hacks or broken defenses. Final scores are calculated using aggregate performance across both rounds. Organisers' decisions are final.",
        "teamSize": 2,
        "prizePool": "₹10,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "To be announced",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:49:58.495Z" },
        "updatedAt": { "$date": "2025-12-25T07:49:58.495Z" },
        "__v": 0,
        "image": "/images/events/paper_presentation.png"
    },

    {
        "_id": { "$oid": "694ced34297836cde76824a3" },
        "eventId": "EVNT05",
        "eventName": "Open Quiz",
        "category": "Quiz",
        "oneLineDescription": "Prompt Engineer Battle, Stock Market Quiz, Phygital Escape Quiz",
        "description": "Open Quiz is a multi-round interactive quiz event combining AI creativity, strategic thinking, and immersive problem-solving.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cd" },
        "rounds": [
            {
                "title": "Round 1 – Prompt Engineer Battle",
                "tagline": "Craft the perfect prompt to beat the AI.",
                "description": "Teams reverse-engineer AI-generated images by writing prompts that recreate them.",
                "_id": { "$oid": "694ced34297836cde76824a4" }
            },
            {
                "title": "Round 2 – Stock Market Quiz",
                "tagline": "Risk, reward, and rapid decisions.",
                "description": "Teams wager virtual coins on question categories before seeing the question.",
                "_id": { "$oid": "694ced34297836cde76824a5" }
            },
            {
                "title": "Round 3 – Phygital Escape Quiz",
                "tagline": "Solve clues across worlds to break free.",
                "description": "Participants solve a series of physical and digital puzzles using QR codes, AR objects, and hidden clues.",
                "_id": { "$oid": "694ced34297836cde76824a6" }
            }
        ],
        "contacts": [
            { "name": "Quiz Coordinator", "mobile": "9876543210", "_id": { "$oid": "694ced34297836cde76824a7" } }
        ],
        "hall": "Main Auditorium",
        "eventRules": "Follow organiser instructions. Maintain integrity. Organisers' decisions are final.",
        "teamSize": 3,
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "To be announced",
        "prizePool": "₹6,000",
        "image": "/images/events/paper_presentation.png"
    },

    {
        "_id": { "$oid": "695a38a48baa56af3270686f" },
        "eventId": "EVNT06",
        "eventName": "CodeMania",
        "category": "Technical",
        "oneLineDescription": "Beat the clock in code, beat the rivals in bids.",
        "description": "CodeMania is a competitive technical event that tests participants on both algorithmic optimization and strategic decision-making.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cd" },
        "rounds": [
            {
                "title": "Round 1: The Optimization Arena",
                "tagline": "Turn slow code into lightning-fast solutions.",
                "description": "Participants receive 3–5 source code files using brute-force approaches.",
                "_id": { "$oid": "695a38a48baa56af32706870" }
            },
            {
                "title": "Round 2: Strategic Bidding Challenge",
                "tagline": "Bid smart, code smarter.",
                "description": "Qualified teams receive virtual currency and bid on questions of varying difficulty.",
                "_id": { "$oid": "695a38a48baa56af32706871" }
            }
        ],
        "contacts": [
            { "name": "Tech Lead", "mobile": "9876543211", "_id": { "$oid": "695a38a48baa56af32706872" } }
        ],
        "hall": "Computer Lab",
        "eventRules": "Individual participation only. Follow coding standards. Organisers' decisions are final.",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "3 Hours",
        "prizePool": "₹8,000",
        "teamSize": 1,
        "image": "/images/events/paper_presentation.png"
    },

    {
        "_id": { "$oid": "695a3d878baa56af3270688b" },
        "eventId": "EVNT07",
        "eventName": "Thooral Hackathon",
        "category": "Technical",
        "oneLineDescription": "From idea to impact—design, document, build, and present innovative solutions.",
        "description": "Thooral Hackathon is a 2-day technical event designed to simulate a real-world software engineering lifecycle.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cd" },
        "rounds": [
            {
                "title": "Ideation & Pitching",
                "tagline": "Strong ideas set the foundation.",
                "description": "Teams analyze the problem statement and present innovative solutions through a structured PPT pitch.",
                "_id": { "$oid": "695a3d878baa56af3270688c" }
            },
            {
                "title": "Documentation & System Design",
                "tagline": "Plan it well before you build it.",
                "description": "Participants prepare essential software artifacts including SRS documents and UML diagrams.",
                "_id": { "$oid": "695a3d878baa56af3270688d" }
            },
            {
                "title": "Implementation Phase",
                "tagline": "Transform ideas into working systems.",
                "description": "Teams develop working prototypes or applications.",
                "_id": { "$oid": "695a3d878baa56af3270688e" }
            },
            {
                "title": "Final Presentation",
                "tagline": "Present impact, innovation, and execution.",
                "description": "Teams demonstrate their solution and present before judges.",
                "_id": { "$oid": "695a3d878baa56af3270688f" }
            }
        ],
        "contacts": [
            { "name": "Hackathon Organizer", "mobile": "9876543212", "_id": { "$oid": "695a3d878baa56af32706890" } }
        ],
        "hall": "Innovation Lab",
        "eventRules": "Follow all guidelines. Plagiarism leads to disqualification. Organisers' decisions are final.",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "2 Days",
        "prizePool": "₹25,000",
        "teamSize": 4,
        "image": "/images/events/paper_presentation.png"
    }
]


// Hardcoded workshops data
export const workshopsData = [
    {
        "workshopId": "WS01",
        "alteredFee": 400,
        "actualFee": 500,
        "club_id": {
            "$oid": "69495a6a719d1b3bd5a9e7cd"
        },
        "workshopName": "Introduction to Machine Learning",
        "date": {
            "$date": "2026-03-15T00:00:00.000Z"
        },
        "tagline": "Learn ML fundamentals hands-on",
        "hall": "Computer Lab 1",
        "time": "2:00 PM - 5:00 PM",
        "contacts": [
            {
                "name": "John Doe",
                "mobile": "9876543210",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689b"
                }
            },
            {
                "name": "Jane Smith",
                "mobile": "9123456780",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689c"
                }
            }
        ],
        "maxCount": 50,
        "description": "A comprehensive workshop covering the basics of Machine Learning, including supervised and unsupervised learning, neural networks, and practical implementations using Python.",
        "agenda": [
            {
                "time": "2:00 PM - 2:30 PM",
                "description": "Introduction to ML concepts",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689d"
                }
            },
            {
                "time": "2:30 PM - 3:30 PM",
                "description": "Hands-on: Linear Regression",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689e"
                }
            },
            {
                "time": "3:30 PM - 4:30 PM",
                "description": "Neural Networks basics",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689f"
                }
            },
            {
                "time": "4:30 PM - 5:00 PM",
                "description": "Q&A and Closing",
                "_id": {
                    "$oid": "695a4c2a8baa56af327068a0"
                }
            }
        ],
        "earlyBirdActive": true,
        "closed": false,
        "prerequisites": "Basic Python knowledge, Laptop with Python 3.8+ installed",
        "youtubeUrl": "https://youtube.com/watch?v=example",
        "createdAt": {
            "$date": "2026-01-04T11:16:58.576Z"
        },
        "updatedAt": {
            "$date": "2026-01-04T11:16:58.576Z"
        },
        "__v": 0,
        "image": "/images/circadian-algorithm.jpg"
    }
];

// Hardcoded papers data
export const papersData = [
    {
        "paperId": "PRP03",
        "eventName": "AI and Machine Learning Research Symposium",
        "contacts": [
            {
                "name": "Dr. John Smith",
                "mobile": "9876543210",
                "_id": {
                    "$oid": "695a5069f567faee30248bfe"
                }
            },
            {
                "name": "Dr. Sarah Johnson",
                "mobile": "9876543211",
                "_id": {
                    "$oid": "695a5069f567faee30248bff"
                }
            }
        ],
        "eventMail": "ai.symposium@psgtech.ac.in",
        "theme": "Artificial Intelligence",
        "tagline": "Explore the Future of AI and ML",
        "topic": "Recent advances in deep learning, neural networks, and AI applications in real-world scenarios",
        "rules": "1. Each team must submit an abstract by the deadline\n2. Maximum team size is 3 members\n3. Presentation duration: 15 minutes\n4. Q&A session: 5 minutes",
        "date": {
            "$date": "2026-02-15T00:00:00.000Z"
        },
        "time": "10:00 AM - 5:00 PM",
        "deadline": {
            "$date": "2026-02-01T00:00:00.000Z"
        },
        "teamSize": 3,
        "hall": "Seminar Hall A",
        "closed": false,
        "youtubeUrl": "https://www.youtube.com/watch?v=example",
        "club_id": {
            "$oid": "69495a6a719d1b3bd5a9e7cd"
        },
        "createdAt": {
            "$date": "2026-01-04T11:35:05.079Z"
        },
        "updatedAt": {
            "$date": "2026-01-04T11:35:05.079Z"
        },
        "__v": 0,
        "image": "/images/events/paper_presentation.png"
    }
];


// Group events by category
export const getEventsByCategory = () => {
    const categories = {};
    eventsData.forEach(event => {
        if (!categories[event.category]) {
            categories[event.category] = [];
        }
        categories[event.category].push(event);
    });
    return categories;
};

// Get all unique categories
export const getCategories = () => {
    return [...new Set(eventsData.map(event => event.category))];
};

// Get event by ID
export const getEventById = (id) => {
    return eventsData.find(event => event.eventId === id);
};
