const booksData = [
    {
        id: 1,
        title: "Prolog Fundamentals",
        author: "Sam Key",
        category: "Programming",
        description: "Introduces Prolog concepts including facts, rules, and queries. A great starting point for logic programming beginners.",
        image: "Prolog Fundamentals.jpg",
        available: true
    },
    {
        id: 2,
        title: "AI Basics",
        author: "Tom Taulli",
        category: "AI",
        description: "Explains AI fundamentals including machine learning, neural networks, and real-world applications of artificial intelligence.",
        image: "AI Basics.jpg",
        available: true
    },
    {
        id: 3,
        title: "Web Development 101",
        author: "Josie S. Major",
        category: "Programming",
        description: "Introduction to HTML, CSS, and JavaScript for building modern, responsive websites from scratch.",
        image: "Web Development 101.jpg",
        available: true
    },
    {
        id: 4,
        title: "Data Science Essentials",
        author: "Amar Sahay",
        category: "Data Science",
        description: "Covers data analysis, visualization, statistics, and machine learning basics using Python.",
        image: "Data Science Essentials.jpg",
        available: true
    },
    {
        id: 5,
        title: "Machine Learning",
        author: "Ryan Turner",
        category: "AI",
        description: "Explains ML algorithms and real-world applications.",
        image: "Machine Learning.jpg",
        available: true
    },
    {
        id: 6,
        title: "Database Management Systems",
        author: "Sotirios Zygiaris",
        category: "Database",
        description: "Explains database design and SQL concepts.",
        image: "Database Management Systems.jpg",
        available: true
    },
    {
        id: 7,
        title: "Networking Fundamentals",
        author: "Crystal Panek",
        category: "Networking",
        description: "Introduces networking devices and protocols.",
        image: "Networking Fundamentals.png",
        available: true
    },
    {
        id: 8,
        title: "Cybersecurity Basics",
        author: "Pete Michaels",
        category: "Security",
        description: "This book explains the importance of cybersecurity and methods used to protect systems and networks.",
        image: "Cybersecurity Basics.jpg",
        available: true
    },
    {
        id: 9,
        title: "Java Programming",
        author: "Joyce Farrell",
        category: "Programming",
        description: "Teaches Java fundamentals and OOP concepts.",
        image: "Java Programming.jpg",
        available: true
    },
    {
        id: 10,
        title: "Cloud Computing Concepts",
        author: "Thomas Erl",
        category: "Cloud Computing",
        description: "This book explains cloud computing architecture, services and modern cloud technologies.",
        image: "Cloud Computing Concepts.png",
        available: true
    }
];

// Load into localStorage only if not already there
if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify(booksData));
}
