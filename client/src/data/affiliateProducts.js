/**
 * affiliateProducts.js
 * Comprehensive product database for Amazon Associates integration (nextjobpost-21)
 * Categories:
 *  - books (dsa, java, python, aptitude, interview, resume, system-design)
 *  - work_essentials (laptop, keyboard, mouse, webcam, headphones, monitor, stand, hub)
 *  - student_essentials (backpack, powerbank, tablet, study-lamp, ssd, pendrive)
 */

export const AFFILIATE_DATA = {
  books: {
    title: "Recommended Study & Preparation Books",
    subtitle: "Topper-recommended study guides and reference material for cracking technical and non-technical rounds.",
    categories: {
      dsa: {
        label: "Data Structures & Algorithms",
        icon: "🌲",
        items: [
          {
            asin: "0984782850",
            title: "Cracking the Coding Interview",
            author: "Gayle Laakmann McDowell",
            desc: "189 programming questions and solutions, from binary trees to system design. The ultimate technical prep guide.",
            price: 1250,
            mrp: 1995,
            rating: 4.7,
            reviews: 22400,
            badge: "Must Buy",
            img: "https://m.media-amazon.com/images/I/41pMsKZBEeL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "B0GSMSPRGR",
            title: "Introduction to Algorithms (CLRS)",
            author: "Thomas H. Cormen, Charles E. Leiserson",
            desc: "The standard textbook reference for algorithms globally. Rigorous, comprehensive, and highly detailed.",
            price: 899,
            mrp: 1495,
            rating: 4.6,
            reviews: 8400,
            badge: "Reference",
            img: "https://images-eu.ssl-images-amazon.com/images/P/8120321413.01.LZZZZZZZ.jpg"
          },
          {
            asin: "8193245288",
            title: "Data Structures and Algorithms Made Easy",
            author: "Narasimha Karumanchi",
            desc: "Focuses on puzzle-based learning. Best for Indian campus placements and quick revisions before interviews.",
            price: 650,
            mrp: 999,
            rating: 4.4,
            reviews: 5800,
            badge: "Campus Favorite",
            img: "https://m.media-amazon.com/images/I/51VU3MFWJJL._SY344_BO1,204,203,200_.jpg"
          }
        ]
      },
      java: {
        label: "Java Programming",
        icon: "☕",
        items: [
          {
            asin: "B0CTTMGHW8",
            title: "Effective Java (3rd Edition)",
            author: "Joshua Bloch",
            desc: "Best practices and design patterns for modern Java developers. Crucial for senior engineer interview prep.",
            price: 649,
            mrp: 999,
            rating: 4.7,
            reviews: 4200,
            badge: "Expert Level",
            img: "https://images-eu.ssl-images-amazon.com/images/P/935306385X.01.LZZZZZZZ.jpg"
          },
          {
            asin: "1260463559",
            title: "Java: A Beginner's Guide (9th Edition)",
            author: "Herbert Schildt",
            desc: "Fully updated for Java 17. The most clear, step-by-step introduction to programming in Java.",
            price: 699,
            mrp: 999,
            rating: 4.5,
            reviews: 2100,
            badge: "Beginner Friendly",
            img: "https://images-eu.ssl-images-amazon.com/images/P/1260463559.01.LZZZZZZZ.jpg"
          },
          {
            asin: "9353066360",
            title: "Core Java Volume I — Fundamentals",
            author: "Cay S. Horstmann",
            desc: "An in-depth guide to Java fundamentals, standard libraries, and modern API implementations.",
            price: 890,
            mrp: 1495,
            rating: 4.6,
            reviews: 1300,
            badge: "In-Depth",
            img: "https://m.media-amazon.com/images/I/41vsMN5GNVL._SX331_BO1,204,203,200_.jpg"
          }
        ]
      },
      python: {
        label: "Python Programming",
        icon: "🐍",
        items: [
          {
            asin: "1718502702",
            title: "Python Crash Course (3rd Edition)",
            author: "Eric Matthes",
            desc: "The world's best-selling guide to Python programming. Highly project-based with clean, modern code examples.",
            price: 699,
            mrp: 1195,
            rating: 4.7,
            reviews: 12100,
            badge: "Bestseller",
            img: "https://images-eu.ssl-images-amazon.com/images/P/1718502702.01.LZZZZZZZ.jpg"
          },
          {
            asin: "9355422474",
            title: "Fluent Python",
            author: "Luciano Ramalho",
            desc: "Write idiomatic Python. Learn how to write clean, fast, and scalable code using modern language features.",
            price: 999,
            mrp: 1495,
            rating: 4.8,
            reviews: 2300,
            badge: "Advanced Python",
            img: "https://m.media-amazon.com/images/I/41RUj0YHSSL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "1718504500",
            title: "Automate the Boring Stuff with Python",
            author: "Al Sweigart",
            desc: "Practical programming for total beginners. Learn to write scripts that scrape data and automate tasks.",
            price: 520,
            mrp: 850,
            rating: 4.6,
            reviews: 6400,
            badge: "Practical",
            img: "https://images-eu.ssl-images-amazon.com/images/P/1718504500.01.LZZZZZZZ.jpg"
          }
        ]
      },
      aptitude: {
        label: "Aptitude & Reasoning",
        icon: "📐",
        items: [
          {
            asin: "8121908957",
            title: "Quantitative Aptitude for Competitive Examinations",
            author: "R.S. Aggarwal",
            desc: "The standard resource for quant preparation across SSC, Banking, Railways, and campus placements.",
            price: 430,
            mrp: 695,
            rating: 4.5,
            reviews: 28400,
            badge: "Bestseller",
            img: "https://m.media-amazon.com/images/I/51VU3MFWJJL._SY344_BO1,204,203,200_.jpg"
          },
          {
            asin: "B00Q43XKD6",
            title: "Verbal & Non-Verbal Reasoning",
            author: "R.S. Aggarwal",
            desc: "Comprehensive logic and reasoning questions, pattern matching, series, and puzzle solvers.",
            price: 560,
            mrp: 895,
            rating: 4.4,
            reviews: 18500,
            badge: "Topper Pick",
            img: "https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg"
          },
          {
            asin: "9352606337",
            title: "How to Prepare for Quantitative Aptitude for CAT",
            author: "Arun Sharma",
            desc: "Advanced levels of difficulty (LOD 1, 2, 3). Essential for elite product-company interviews.",
            price: 499,
            mrp: 799,
            rating: 4.4,
            reviews: 19100,
            badge: "High Difficulty",
            img: "https://m.media-amazon.com/images/I/51LVPKsTPqL._SX331_BO1,204,203,200_.jpg"
          }
        ]
      },
      interview: {
        label: "Interview Preparation",
        icon: "🤝",
        items: [
          {
            asin: "0984782850",
            title: "Cracking the Coding Interview",
            author: "Gayle Laakmann McDowell",
            desc: "The standard blueprint for coding rounds. Essential for FAANG and other tech companies.",
            price: 1250,
            mrp: 1995,
            rating: 4.7,
            reviews: 22400,
            badge: "Essential",
            img: "https://m.media-amazon.com/images/I/41pMsKZBEeL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "9368089043",
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
            desc: "The undisputed bible of system design. Master distributed computing, databases, and scale.",
            price: 799,
            mrp: 1299,
            rating: 4.8,
            reviews: 14500,
            badge: "System Design",
            img: "https://images-eu.ssl-images-amazon.com/images/P/9368089043.01.LZZZZZZZ.jpg"
          },
          {
            asin: "8126539119",
            title: "Programming Interviews Exposed",
            author: "John Mongan, Noah Kindler",
            desc: "Excellent guide on how to approach coding challenges and explain your thought process to the interviewer.",
            price: 450,
            mrp: 699,
            rating: 4.3,
            reviews: 2100,
            badge: "Communication",
            img: "https://m.media-amazon.com/images/I/41vsMN5GNVL._SX331_BO1,204,203,200_.jpg"
          }
        ]
      },
      resume: {
        label: "Resume & Career Guides",
        icon: "📄",
        items: [
          {
            asin: "9351031381",
            title: "Knock 'em Dead Resumes",
            author: "Martin Yate",
            desc: "Standard framework for drafting professional resumes that beat applicant tracking systems (ATS).",
            price: 499,
            mrp: 799,
            rating: 4.3,
            reviews: 4200,
            badge: "ATS Strategy",
            img: "https://m.media-amazon.com/images/I/41VBejAz6uL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "0470927623",
            title: "The Google Resume",
            author: "Gayle Laakmann McDowell",
            desc: "Step-by-step guidance on how to format resumes specifically for big-tech product firms.",
            price: 750,
            mrp: 1195,
            rating: 4.5,
            reviews: 8700,
            badge: "Tech Specific",
            img: "https://m.media-amazon.com/images/I/51LVPKsTPqL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "1984861204",
            title: "What Color Is Your Parachute? 2026",
            author: "Richard N. Bolles",
            desc: "The world's most popular guide for job-hunters. Full of practical tips on job landing and salary negotiations.",
            price: 680,
            mrp: 1050,
            rating: 4.4,
            reviews: 12500,
            badge: "Career Classic",
            img: "https://images-eu.ssl-images-amazon.com/images/P/1984861204.01.LZZZZZZZ.jpg"
          }
        ]
      },
      system_design: {
        label: "System Design",
        icon: "🏗️",
        items: [
          {
            asin: "9368089043",
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
            desc: "Best book for system design interviews. Explains storage systems, processing, and consistency guarantees.",
            price: 799,
            mrp: 1299,
            rating: 4.8,
            reviews: 14500,
            badge: "#1 Recommendation",
            img: "https://images-eu.ssl-images-amazon.com/images/P/9368089043.01.LZZZZZZZ.jpg"
          }
        ]
      }
    }
  },
  work_essentials: {
    title: "Work From Home Essentials",
    subtitle: "Create a highly productive and ergonomic study/workspace to power your remote job prep and work routines.",
    categories: {
      laptop: {
        label: "Premium Laptops",
        icon: "💻",
        items: [
          {
            asin: "B08N5N15KR",
            title: "Apple MacBook Air M1",
            author: "Apple India",
            desc: "Unbeatable battery life, silent fanless operation, and raw power for developers and professionals alike.",
            price: 69900,
            mrp: 92900,
            rating: 4.7,
            reviews: 18500,
            badge: "Developer Choice",
            img: "https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg"
          },
          {
            asin: "B0CFQDMTK8",
            title: "HP Laptop 15s (12th Gen Intel i5)",
            author: "HP India",
            desc: "16GB RAM, 512GB SSD, Intel Iris Xe Graphics. The reliable everyday workhorse for students and software professionals.",
            price: 49990,
            mrp: 68250,
            rating: 4.2,
            reviews: 4200,
            badge: "Best Value",
            img: "https://m.media-amazon.com/images/I/71+D+c7qFPL._SX679_.jpg"
          }
        ]
      },
      keyboard: {
        label: "Mechanical Keyboards",
        icon: "⌨️",
        items: [
          {
            asin: "B0892BPC32",
            title: "Redgear Shadow Blade Mechanical Keyboard",
            author: "Redgear",
            desc: "Clicky Blue switches with full LED backlight, control knob, and integrated wrist support.",
            price: 2499,
            mrp: 3999,
            rating: 4.3,
            reviews: 9400,
            badge: "Bestseller",
            img: "https://m.media-amazon.com/images/I/61m1N1ePqHL._SX679_.jpg"
          },
          {
            asin: "B089K81DGF",
            title: "Keychron K2 Wireless Keyboard",
            author: "Keychron",
            desc: "Premium Gateron switch keyboard with Bluetooth connection, fully compatible with macOS and Windows.",
            price: 7499,
            mrp: 9999,
            rating: 4.6,
            reviews: 3100,
            badge: "Premium Pick",
            img: "https://m.media-amazon.com/images/I/61u9ZqE-wQL._SX679_.jpg"
          }
        ]
      },
      mouse: {
        label: "Wireless Mice",
        icon: "🖱️",
        items: [
          {
            asin: "B0716ZFW98",
            title: "Logitech MX Master 3S Wireless Mouse",
            author: "Logitech",
            desc: "Ergonomic layout with MagSpeed smart scroll, silent click switches, and multi-device flow control.",
            price: 8995,
            mrp: 10995,
            rating: 4.7,
            reviews: 14500,
            badge: "Pro Productivity",
            img: "https://m.media-amazon.com/images/I/61ni3t1ryQL._SX679_.jpg"
          },
          {
            asin: "B00DR8LAE2",
            title: "Logitech B170 Wireless Mouse",
            author: "Logitech",
            desc: "Reliable 2.4Ghz wireless connection, comfortable symmetrical grip, and up to 12 months battery life.",
            price: 599,
            mrp: 895,
            rating: 4.4,
            reviews: 98000,
            badge: "Budget Friendly",
            img: "https://m.media-amazon.com/images/I/516mE8gE8kL._SX679_.jpg"
          }
        ]
      },
      webcam: {
        label: "Webcams",
        icon: "📷",
        items: [
          {
            asin: "B003L62T7W",
            title: "Logitech C270 HD Webcam",
            author: "Logitech",
            desc: "Sharp 720p HD calls with integrated noise-cancelling microphone and automatic light correction.",
            price: 1999,
            mrp: 2995,
            rating: 4.3,
            reviews: 38400,
            badge: "Standard Choice",
            img: "https://m.media-amazon.com/images/I/61yo4qRiO3L._SX679_.jpg"
          }
        ]
      },
      headphones: {
        label: "Headphones",
        icon: "🎧",
        items: [
          {
            asin: "B09GRL3V35",
            title: "Sony WH-CH520 Wireless Headphones",
            author: "Sony India",
            desc: "Up to 50 hours battery life with quick charging, custom equalizer, and multi-point pairing support.",
            price: 4490,
            mrp: 5990,
            rating: 4.4,
            reviews: 18500,
            badge: "Top Rated",
            img: "https://m.media-amazon.com/images/I/41Kx1g2t8KL._SX679_.jpg"
          }
        ]
      },
      monitor: {
        label: "External Monitors",
        icon: "🖥️",
        items: [
          {
            asin: "B08C5DQQ2S",
            title: "LG 24-inch Borderless IPS Monitor",
            author: "LG India",
            desc: "Full HD resolution, AMD FreeSync, 75Hz refresh rate, with HDMI and VGA ports. Ideal dual-screen setup.",
            price: 8499,
            mrp: 14000,
            rating: 4.4,
            reviews: 19400,
            badge: "Best Screen",
            img: "https://m.media-amazon.com/images/I/71P4q-3WNFL._SX679_.jpg"
          }
        ]
      },
      stand: {
        label: "Laptop Stands",
        icon: "🪜",
        items: [
          {
            asin: "B08C7K85J6",
            title: "Portronics My Buddy Hexa Laptop Stand",
            author: "Portronics",
            desc: "Ergonomic foldable stand with 7 adjustable angles and heat dissipation design for better cooling.",
            price: 599,
            mrp: 1299,
            rating: 4.2,
            reviews: 8700,
            badge: "Ergonomic",
            img: "https://m.media-amazon.com/images/I/61-d70-tP1L._SX679_.jpg"
          }
        ]
      },
      hub: {
        label: "USB Hubs",
        icon: "🔌",
        items: [
          {
            asin: "B00Y25XF7K",
            title: "TP-Link USB 3.0 4-Port Hub",
            author: "TP-Link",
            desc: "Ultra-fast data transfer speed up to 5Gbps. Plug-and-play with no drivers needed.",
            price: 999,
            mrp: 1499,
            rating: 4.4,
            reviews: 12100,
            badge: "Compact",
            img: "https://m.media-amazon.com/images/I/51wXpM4j3SL._SX679_.jpg"
          }
        ]
      }
    }
  },
  student_essentials: {
    title: "Essential Preparation Books",
    subtitle: "Highly recommended study guides, practice papers, and conceptual reference books for competitive exam candidates.",
    categories: {
      aptitude: {
        label: "Quantitative Aptitude",
        icon: "📐",
        items: [
          {
            asin: "8121908957",
            title: "Quantitative Aptitude for Competitive Examinations",
            author: "R.S. Aggarwal",
            desc: "The absolute standard for competitive math exams in India. Covers arithmetic, algebra, and geometry concepts.",
            price: 430,
            mrp: 695,
            rating: 4.5,
            reviews: 18200,
            badge: "🏆 Bestseller",
            img: "https://m.media-amazon.com/images/I/51VU3MFWJJL._SY344_BO1,204,203,200_.jpg"
          },
          {
            asin: "9352606337",
            title: "How to Prepare for Quantitative Aptitude",
            author: "Arun Sharma",
            desc: "Highly recommended for CAT, GMAT, and bank PO exams. Deep, logical approach to mathematical problem-solving.",
            price: 499,
            mrp: 799,
            rating: 4.4,
            reviews: 6300,
            badge: "🔥 Advanced Pick",
            img: "https://m.media-amazon.com/images/I/51LVPKsTPqL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "8190458825",
            title: "Magical Book on Quicker Maths",
            author: "M. Tyra",
            desc: "Focuses on speed arithmetic, shortcut tricks, and quick calculation methods to save time during exams.",
            price: 385,
            mrp: 595,
            rating: 4.3,
            reviews: 7900,
            badge: "⚡ Speed Tricks",
            img: "https://m.media-amazon.com/images/I/41UNvFRVFHL._SX331_BO1,204,203,200_.jpg"
          }
        ]
      },
      reasoning: {
        label: "Logical Reasoning",
        icon: "🧠",
        items: [
          {
            asin: "9352534034",
            title: "A Modern Approach to Verbal & Non-Verbal Reasoning",
            author: "R.S. Aggarwal",
            desc: "Comprehensive workbook covering logical reasoning, puzzles, analytical reasoning, and spatial tests.",
            price: 560,
            mrp: 895,
            rating: 4.6,
            reviews: 14500,
            badge: "🏆 Top Rated",
            img: "https://m.media-amazon.com/images/I/41pMsKZBEeL._SX331_BO1,204,203,200_.jpg"
          },
          {
            asin: "8190458884",
            title: "Analytical Reasoning",
            author: "M.K. Pandey",
            desc: "Focuses on logic rules, syllogisms, statements and assumptions, and logic puzzles for Bank PO and law exams.",
            price: 340,
            mrp: 525,
            rating: 4.4,
            reviews: 5800,
            badge: "💡 Analytical",
            img: "https://m.media-amazon.com/images/I/41bEIL7kz-L._SX331_BO1,204,203,200_.jpg"
          }
        ]
      },
      english: {
        label: "Objective English",
        icon: "🔤",
        items: [
          {
            asin: "0143424524",
            title: "Word Power Made Easy",
            author: "Norman Lewis",
            desc: "The world's standard vocabulary builder. Simple daily lessons that quickly build strong word power.",
            price: 150,
            mrp: 299,
            rating: 4.7,
            reviews: 42000,
            badge: "🔥 Essential",
            img: "https://m.media-amazon.com/images/I/51CRvXWvRvL._SY344_BO1,204,203,200_.jpg"
          },
          {
            asin: "8121900093",
            title: "High School English Grammar & Composition",
            author: "Wren & Martin",
            desc: "Classic reference book for grammar, sentence construction, composition, and correct usage.",
            price: 350,
            mrp: 550,
            rating: 4.5,
            reviews: 12800,
            badge: "📚 Classic",
            img: "https://m.media-amazon.com/images/I/51VU3MFWJJL._SY344_BO1,204,203,200_.jpg"
          },
          {
            asin: "8174826718",
            title: "Objective General English",
            author: "S.P. Bakshi",
            desc: "Workbook-oriented prep guide covering competitive english patterns, mock exercises, and exams.",
            price: 390,
            mrp: 595,
            rating: 4.4,
            reviews: 9100,
            badge: "📝 Practice Guide",
            img: "https://m.media-amazon.com/images/I/41RUj0YHSSL._SX331_BO1,204,203,200_.jpg"
          }
        ]
      },
      gk: {
        label: "GK & Awareness",
        icon: "🌍",
        items: [
          {
            asin: "8190086006",
            title: "Lucent's General Knowledge",
            author: "Lucent Publication",
            desc: "The definitive guide for history, science, geography, polity, and economy facts for all government exams.",
            price: 320,
            mrp: 495,
            rating: 4.6,
            reviews: 25800,
            badge: "🏆 Bestseller",
            img: "https://m.media-amazon.com/images/I/51CRvXWvRvL._SY344_BO1,204,203,200_.jpg"
          },
          {
            asin: "9390711373",
            title: "Static General Knowledge",
            author: "Disha Experts",
            desc: "Organized GK covering static concepts, international bodies, awards, history, and geographical landmarks.",
            price: 260,
            mrp: 400,
            rating: 4.3,
            reviews: 3200,
            badge: "📚 Static GK",
            img: "https://m.media-amazon.com/images/I/41bEIL7kz-L._SX331_BO1,204,203,200_.jpg"
          }
        ]
      }
    }
  }
};
