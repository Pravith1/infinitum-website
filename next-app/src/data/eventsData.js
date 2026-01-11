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
        "hall": "Q Block Classrooms",
        "eventRules": "Participants must follow organiser instructions and maintain sportsmanship throughout the event.",
        "teamSize": 4,
        "prizePool": "₹5,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "dateAndTime": "Feb 13, 10:00 AM – 3:00 PM",
        "scheduleStart": "10:00",
        "scheduleEnd": "15:00",
        "scheduleDay": "day1",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:37:40.909Z" },
        "updatedAt": { "$date": "2025-12-25T07:37:40.909Z" },
        "__v": 0,
        "image": "/images/events/questx.png"
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
        "hall": "3AI and CSP Labs",
        "eventRules": "Time limit is 2 hours. Participants must follow organiser instructions. Any cheating leads to disqualification. Points are awarded based on accuracy, creativity, and timely completion. Organisers' decisions are final.",
        "teamSize": 3,
        "prizePool": "₹3,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "dateAndTime": "Feb 14, 9:00 AM – 2:00 PM",
        "scheduleStart": "09:00",
        "scheduleEnd": "15:00",
        "scheduleDay": "day2",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:37:54.049Z" },
        "updatedAt": { "$date": "2025-12-25T07:37:54.049Z" },
        "__v": 0,
        "image": "/images/events/nexus.png"
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
                "title": "Code Charades",
                "tagline": "Act fast, decode signals, earn your advantage.",
                "description": "Teams must enact and guess technical terms using only gestures and non-verbal cues. Speed is the key to victory, as points are awarded based on how quickly the team can identify the correct terms to climb the leaderboard.",
                "_id": { "$oid": "694cec9c297836cde7682491" }
            },
            {
                "title": "Flash Memory",
                "tagline": "Choose wisely or crash into uncertainty.",
                "description": "Teams answer questions to earn the right to choose a mystery cup containing hidden points. The twist is that the cup values flash on the screen for mere seconds. This round combines quick thinking with sharp observation to maximize the final score.",
                "_id": { "$oid": "694cec9c297836cde7682492" }
            }
        ],
        "contacts": [
            { "name": "Srimathikalpana T", "mobile": "8122966128", "_id": { "$oid": "694cec9c297836cde7682493" } },
            { "name": "Suryaprakash B", "mobile": "7339143171", "_id": { "$oid": "694cec9c297836cde7682494" } }
        ],
        "hall": "G Block Classrooms",
        "eventRules": "Teams must follow organiser instructions. Judging is based on accuracy, time, creativity, team synergy, and effective use of advantages. Organisers' decisions are final.",
        "teamSize": 3,
        "prizePool": "₹4,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "dateAndTime": "Feb 14, 9:00 AM – 2:00 PM",
        "scheduleStart": "09:00",
        "scheduleEnd": "14:00",
        "scheduleDay": "day2",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:49:48.371Z" },
        "updatedAt": { "$date": "2025-12-25T07:49:48.371Z" },
        "__v": 0,
        "image": "/images/events/gitwars.png"
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
                "title": "Coding Phase",
                "tagline": "Solve fast, code clean, survive the leaderboard.",
                "description": "Participants solve 5–6 competitive programming problems ranging from easy to hard on a standard CP platform. Performance is judged on correctness, time taken, and penalties.",
                "_id": { "$oid": "694ceca6297836cde768249a" }
            },
            {
                "title": "Hacking Phase",
                "tagline": "Exploit weaknesses and defend your logic.",
                "description": "Participants attempt to break other contestants' accepted solutions by identifying edge cases and submitting failing test inputs. Points are awarded for successful hacks and deducted for failed ones.",
                "_id": { "$oid": "694ceca6297836cde768249b" }
            }
        ],
        "contacts": [
            { "name": "Dhaarun Abhimanyu S", "mobile": "9790313358", "_id": { "$oid": "694ceca6297836cde768249c" } },
            { "name": "A T Abbilaash", "mobile": "8667093591", "_id": { "$oid": "694ceca6297836cde768249d" } }
        ],
        "hall": "3AI and AIR Labs",
        "eventRules": "Cheating is prohibited. Points are awarded for successful hacks and reduced for failed hacks or broken defenses. Final scores are calculated using aggregate performance across both rounds. Organisers' decisions are final.",
        "teamSize": 1,
        "prizePool": "₹10,000",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "dateAndTime": "Feb 13, 10:00 AM – 1:00 PM",
        "scheduleStart": "10:00",
        "scheduleEnd": "16:00",
        "scheduleDay": "day1",
        "youtubeUrl": "",
        "createdAt": { "$date": "2025-12-25T07:49:58.495Z" },
        "updatedAt": { "$date": "2025-12-25T07:49:58.495Z" },
        "__v": 0,
        "image": "/images/events/forcecoders.png"
    },

    {
        "_id": { "$oid": "694ced34297836cde76824a3" },
        "eventId": "EVNT05",
        "eventName": "Open Quiz",
        "category": "Quiz",
        "oneLineDescription": "Tech in Movies, Wheel of Tech, Code Auction",
        "description": "INFINITUM – Open Quiz is a multi-round technical quiz event designed to test participants’ technology awareness, core computer science knowledge, and strategic decision-making through engaging quiz-based rounds.",
        "club_id": { "$oid": "69495a6a719d1b3bd5a9e7cd" },
        "rounds": [
            {
                "title": "Tech Spectrum",
                "tagline": "Spot the tech. Spin the wheel. Stay in the game.",
                "description": "Round 1 consists of two games conducted sequentially. Game 1: Tech in Movies – Teams watch short movie clips and identify technologies, computer science concepts, or futuristic ideas shown. Game 2: Wheel of Tech – Teams spin a wheel to answer questions from various computer science domains and difficulty levels. Scores from both games are combined, and the top teams qualify for the final round.",
                "_id": { "$oid": "694ced34297836cde76824a4" }
            },
            {
                "title": "BidRush",
                "tagline": "Bid smart. Predict right. Win big.",
                "description": "Qualified teams compete in the Code Auction (Bidding Round). Teams analyze code snippets, place bids based on confidence, and predict outputs or correct behavior. Correct answers earn bid points, while incorrect answers result in point deductions. The team with the highest final score is declared the winner, with a rapid-fire tie-breaker in case of a tie.",
                "_id": { "$oid": "694ced34297836cde76824a5" }
            }
        ],
        "contacts": [
            {
                "name": "Shelvaaathithyan VK",
                "mobile": "6381466406",
                "_id": { "$oid": "694ced34297836cde76824a7" }
            },
            {
                "name": "Logini TS",
                "mobile": "9842330146",
                "_id": { "$oid": "694ced34297836cde76824a8" }
            }
        ],
        "hall": "D Block",
        "eventRules": "Participants must follow organiser instructions at all times. Fair play and integrity are mandatory. Organisers’ decisions are final.",
        "teamSize": 3,
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "dateAndTime": "Feb 13, 1:45 PM – 4:00 PM",

        "image": "/images/events/infinitumopenquiz.png"
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
                "title": "The Optimization Arena",
                "tagline": "Turn slow code into lightning-fast solutions.",
                "description": "Participants receive 3–5 source code files using brute-force approaches.",
                "_id": { "$oid": "695a38a48baa56af32706870" }
            },
            {
                "title": "Strategic Bidding Challenge",
                "tagline": "Bid smart, code smarter.",
                "description": "Qualified teams receive virtual currency and bid on questions of varying difficulty.",
                "_id": { "$oid": "695a38a48baa56af32706871" }
            }
        ],
        "contacts": [
            {
                "name": "Harini P",
                "mobile": "6366203232",
                "_id": {
                    "$oid": "695a38a48baa56af32706872"
                }
            },
            {
                "name": "Revanth P",
                "mobile": "7904316372",
                "_id": {
                    "$oid": "695a38a48baa56af32706873"
                }
            }
        ],
        "hall": "GRD and Programming Labs",
        "eventRules": "Individual participation only. Follow coding standards. Organisers' decisions are final.",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "timing": "Feb 14, 9:00 AM – 3:00 PM",
        "scheduleStart": "09:00",
        "scheduleEnd": "15:00",
        "scheduleDay": "day2",
        "prizePool": "₹8,000",
        "teamSize": 1,
        "image": "/images/events/codemania.png"
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
        "hall": "CC Lab",
        "eventRules": "Follow all guidelines. Plagiarism leads to disqualification. Organisers' decisions are final.",
        "date": { "$date": "2026-02-01T09:00:00.000Z" },
        "closed": false,
        "dateAndTime": "Feb 13, 10:00 AM – 4:30 PM | Feb 14, 9:00 AM – 3:00 PM",
        "scheduleStart": "10:00",
        "scheduleEnd": "16:30",
        "scheduleDay": "day1",
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
        "workshopName": "AI Infrastructure: From Big Picture to Everyday Reality",
        "date": {
            "$date": "2026-03-15T00:00:00.000Z"
        },
        "tagline": "Understanding AI Infrastructure - From Big Picture to Everyday Reality",
        "hall": "Computer Lab 1",
        "time": "2:00 PM - 5:00 PM",
        "contacts": [
            {
                "name": "Supriya Rajamanickam",
                "designation": "Senior Technical Leader, Cisco Systems",
                "mobile": "9876543210",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689b"
                }
            },
            {
                "name": "Balasankar Raman",
                "designation": "Principal Engineer, Cisco Systems",
                "mobile": "9123456780",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689c"
                }
            },
            {
                "name": "Shankar Gopalkrishnan",
                "designation": "Principal Engineer, Cisco Systems",
                "mobile": "9876543211",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689d"
                }
            }
        ],
        "maxCount": 50,
        "description": "A comprehensive workshop on AI Infrastructure featuring expert speakers from Cisco Systems. Learn about the infrastructure requirements for AI, including QoS, Load-Balancing, Security, and real-world AI implementations.",
        "agenda": [
            {
                "time": "Topic 1",
                "description": "What infra does AI need - The big picture!",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689d"
                }
            },
            {
                "time": "Topic 2",
                "description": "AI-Infra: Nuts and bolts - QoS, Load-Balancing, Security et al.",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689e"
                }
            },
            {
                "time": "Topic 3",
                "description": "Day by day with AI",
                "_id": {
                    "$oid": "695a4c2a8baa56af3270689f"
                }
            }
        ],
        "earlyBirdActive": true,
        "closed": false,
        "prerequisites": "Basic understanding of AI concepts, Laptop",
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
