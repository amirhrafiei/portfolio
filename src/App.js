import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// --- 1. DATA & CONSTANTS ---
const projectsData = [
    {
        id: 1,
        title: "FlashShell: A UNIX Command Interpreter",
        description: "A custom C++ shell implementing complex OS features like multi-stage Pipelining, I/O Redirection (>, 2>>), and process management via fork/exec.", 
        tags: ["C++17", "UNIX", "IPC", "Readline"],
        linkDetail: "/shell-details", 
        linkCode: "https://github.com/amirhrafiei/FlashShell",
        category: "Systems"
    },
    {
        id: 2,
        title: "NumPy Neural Network: Backpropagation from Scratch",
        description: "A deep learning model built from scratch using NumPy for multi-class classification on the Fashion MNIST image dataset, achieving high accuracy.",
        tags: ["NumPy", "FCNN", "Python"],
        linkDetail: "/fashion-details",
        linkCode: "https://github.com/amirhrafiei/numpy-fashion-mnist-nn",
        category: "Machine Learning"
    },
    { // NEW PROJECT: Poly Chat
        id: 3,
        title: "Poly Chat",
        description: "A full-stack PWA using Gemini AI for real-time translation, grammar correction, and structured conversational practice with Firebase and React.",
        tags: ["React", "Gemini API", "Firebase", "Firestore", "PWA"],
        linkDetail: "/polychat-details", // New route path
        linkCode: "https://github.com/amirhrafiei/poly-chat",
        category: "Full Stack"
    },
    {
         id: 4,
        title: "Case Study: Sectioned AI Conversations",
        description: "A UX case study focused on improving long-form LLM interactions through hierarchical sectioning and navigation systems to reduce cognitive load.",
        tags: ["UX Research", "Figma", "Product Design"],
        linkDetail: "/figma-details",
        linkCode: "https://www.figma.com/proto/Vga65q45xVLuRAdGxUZ3HV/GPT-Case-Study--Sectioned-Conversations?node-id=1-2&p=f&t=id1x9bw2ZsCzmZDZ-8&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&hide-ui=1",
        category: "Design"
    },
    {
        id: 5,
        title: "PianoGPT",
        description: "A deep dive into the Transformer architecture, exploring the mathematical foundations of causal self-attention to generate symbolic music from scratch.",
        tags: ["PyTorch", "Transformers", "MIDI", "Generative AI"],
        linkDetail: "/pianogpt-details",
        linkCode: "https://github.com/amirhrafiei/pianogpt",
        category: "Machine Learning"
    }
];

// --- NEW LOGIC: Defines the desired display order ---
const projectOrder = ["Poly Chat",  "PianoGPT", "FlashShell: A UNIX Command Interpreter", "NumPy Neural Network: Backpropagation from Scratch",
    "Case Study: Sectioned AI Conversations"
];

const orderedProjectsData = projectOrder.map(title => 
    projectsData.find(p => p.title === title)
).filter(p => p !== undefined);


// Moved sections to top-level to prevent undefined errors
const SECTIONS = ['about', 'experience', 'projects'];

// --- 2. ICONS & HELPERS ---
const FigmaLogoIcon = ({ className }) => (
    <svg viewBox="0 0 38 57" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M0 9.5a9.5 9.5 0 0 1 9.5-9.5H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" fill="#F24E1E"/>
        <path d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19V0z" fill="#FF7262"/>
        <path d="M0 28.5a9.5 9.5 0 0 1 9.5-9.5H19v19H9.5a9.5 9.5 0 0 1-9.5-9.5z" fill="#A259FF"/>
        <path d="M19 19h9.5a9.5 9.5 0 1 1-9.5 9.5V19z" fill="#1ABCFE"/>
        <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/>
    </svg>
);

// Updated Demo Icons (Pixelated / Blocky Style)
const TShirtDemoIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" shapeRendering="crispEdges">
        <rect x="9" y="4" width="2" height="2" />
        <rect x="13" y="4" width="2" height="2" />
        <rect x="8" y="6" width="8" height="2" />
        <rect x="5" y="6" width="3" height="4" />
        <rect x="16" y="6" width="3" height="4" />
        <rect x="8" y="8" width="8" height="10" />
    </svg>
);
const TrouserDemoIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" shapeRendering="crispEdges">
        <rect x="8" y="4" width="8" height="2" />
        <rect x="8" y="6" width="3" height="14" />
        <rect x="13" y="6" width="3" height="14" />
    </svg>
);
const BagDemoIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" shapeRendering="crispEdges">
        <rect x="10" y="4" width="4" height="2" />
        <rect x="9" y="6" width="1" height="2" />
        <rect x="14" y="6" width="1" height="2" />
        <rect x="7" y="8" width="10" height="10" />
    </svg>
);
const SneakerDemoIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" shapeRendering="crispEdges">
        <rect x="4" y="11" width="5" height="4" />
        <rect x="9" y="13" width="8" height="2" />
        <rect x="4" y="15" width="15" height="3" />
    </svg>
);

/* FIX: Unified Tech Icon Function with improved logos */
const getTechIcon = (tag, sizeClass = "w-3 h-3 mr-2") => {
     if (tag === "PyTorch") return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    );
    if (tag === "MIDI") return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v1M9 11v1M15 11v1M10 15v1M14 15v1" strokeWidth="3" />
        </svg>
    );
    if (tag === "Transformers") return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h10" />
        </svg>
    );
    if (tag === "Generative AI") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
    
    if (tag === "UX Research") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
    if (tag === "Figma") return <FigmaLogoIcon className={sizeClass} />;
    // UPDATED: Product Design icon (Drafting/Pencil focus)
    if (tag === "Product Design") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.5 1.5" /></svg>;
    if (tag === "C++17") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 8h.01M10 16h.01" /><path d="M6 8a4 4 0 00-4 4 4 4 0 004 4" /><path d="M14 8v8M18 8v8M12 12h4M16 12h4" /></svg>;
    if (tag === "UNIX") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 12l4 4 4-4" /><path d="M12 8v8" /></svg>;
    if (tag === "IPC") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /><path d="M9 12h6" /><path d="M13 9l3 3-3 3" /><path d="M11 15l-3-3 3-3" /></svg>;
    if (tag === "Readline") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h6" /></svg>;
    if (tag === "TensorFlow") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l10 6v8l-10 6-10-6V8l10-6z" /><path d="M12 2v20" /><path d="M2 8l10 6 10-6" /></svg>;
    if (tag === "Keras") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4v16M20 4l-8 8 8 8M4 12h8" /></svg>;
    if (tag === "FCNN") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="M10 6h4M6 10v4" /></svg>;
    if (tag === "NumPy") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8v8M16 8v8M8 8l8 8" /></svg>;
    if (tag === "Python") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2c-4 0-4 4-4 4v2h6v-2c0-2 2-2 2-2s2 0 2 2v2H6" /><path d="M12 22c4 0 4-4 4-4v-2H10v2c0 2-2 2-2 2s-2 0-2-2v-2h12" /></svg>;
    
    // --- FIXED ICONS (Poly Chat) ---
    
    // React Logo (Elliptical shape, stroke only)
    if (tag === "React") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3"/><ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(120 12 12)"/></svg>;

    // Gemini API (Simplified three-diamond/multi-modal concept)
    if (tag === "Gemini API") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10L12 3l9 7-9 7z" fill="currentColor" opacity="0.1"/><path d="M12 3L5 17h14L12 3z" strokeLinejoin="round"/><path d="M12 17l-3-6m6 0l-3 6m-3-6h6"/></svg>;

    // Firebase (Simplified three-layered triangle/flame)
    if (tag === "Firebase") return <svg className={sizeClass} viewBox="0 0 24 24" fill="currentColor"><path d="M4 15L12 23L20 15L12 7zm0-5L12 18L20 10L12 2z" fill="#FFFFFF" opacity="0.7"/><path d="M4 10L12 18L20 10L12 2z" fill="#FFFFFF"/><path d="M12 2L4 10L12 18L20 10z" fill="#FFFFFF" opacity="0.9"/></svg>;
    
    // Firestore (Database icon - fixed to be stroke-based)
    if (tag === "Firestore") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 6v8l-10 6-10-6V8l10-6z" fill="currentColor" opacity="0.1"/><path d="M2 8l10 6 10-6M12 22v-6M12 2v6"/></svg>;

    // PWA (Simplified download/install concept)
    if (tag === "PWA") return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v10M16 8l-4 4-4-4"/><path d="M21 16v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3"/></svg>;
    
    return <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>;
};

// --- 3. COMPONENTS ---

// NEW PolyLogo component based on the user's SVG definition
const PolyLogo = ({ className, style }) => (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="none" />
        <text x="50" y="72" fontSize="55" textAnchor="middle" fill="currentColor" fontFamily="sans-serif" fontWeight="900">P</text>
    </svg>
);
const FigmaDetails = () => (
    <div className="py-12">
        <Link to="/" className="inline-flex items-center text-amber-400 hover:text-amber-500 font-medium mb-8 transition duration-150">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to All Projects
        </Link>
        <h2 className="text-4xl font-extrabold text-white mb-2">Case Study: Sectioned AI Conversations</h2>
        <p className="text-xl text-gray-400 mb-6">A UX Case Study on managing high density information in AI interfaces.</p>
        
        <div className="bg-gray-800 p-2 lg:p-4 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe 
                    title="Figma Prototype: Sectioned AI Conversations"
                    className="absolute top-0 left-0 w-full h-full rounded-sm"
                    src="https://embed.figma.com/proto/Vga65q45xVLuRAdGxUZ3HV/GPT-Case-Study--Sectioned-Conversations?node-id=1-2&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2&embed-host=share" 
                    allowFullScreen
                    style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
                ></iframe>
            </div>
        </div>

        <div className="mt-10 prose max-w-none text-gray-300 bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-amber-400">The Problem: The "Wall of Text" Fatigue</h3>
            <p>Current AI interfaces treat conversations as a single, endless stream of data. As sessions grow into complex, multi-day projects, users suffer from 'context drift.' This makes finding a specific decision or code snippet a frustrating manual chore. A flat chronological stream simply cannot handle the weight of high-level project management.</p>            
            <h4 className="text-xl font-bold mt-6 text-white">Proposed Solution: Sectional Hierarchy</h4>
            <p>This design introduces a logical layer over the chat history. By grouping messages into auto-titled sections, the interface transforms a never-ending transcript into an organized table of contents. Users no longer scroll through a chat. They navigate a project.</p>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-900 p-4 rounded border border-gray-700">
                    <h5 className="font-bold text-amber-400 mb-2">Topic Detection</h5>
                    <p className="text-sm italic">The app is smart enough to know when you have moved on to a new topic. Instead of you having to label things yourself, the AI automatically senses a shift in the conversation. It creates a clear visual break between these different "chapters," so your screen stays organized and your brain doesn't get overwhelmed by a giant wall of text.</p>
                </div>
                <div className="bg-gray-900 p-4 rounded border border-gray-700">
                    <h5 className="font-bold text-amber-400 mb-2">Instant Recaps</h5>
                    <p className="text-sm italic">Every time the conversation moves to a new phase, the app can give you a quick "cliff notes" version of that section. You can get a fast briefing on what was decided without having to scroll back and re-read every single message from earlier.</p>
                </div>
            </div>
             <hr className="my-8 border-gray-700" />
            <div className="flex space-x-4 mt-4"></div>
            <a href="https://www.figma.com/proto/Vga65q45xVLuRAdGxUZ3HV/GPT-Case-Study--Sectioned-Conversations?node-id=1-2&p=f&t=id1x9bw2ZsCzmZDZ-8&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&hide-ui=1" target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-sm transition duration-150 shadow-md">Prototype Link on Figma</a>

        </div>
        
    </div>
);


// 3.1 Project Card
const ProjectCard = ({ project }) => {
    const { title, description, tags, linkDetail, linkCode } = project;

    const ShellIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-4 right-4 w-8 h-8 lg:w-12 lg:h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
     const PianoIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-4 right-4 w-8 h-8 lg:w-10 lg:h-10 text-amber-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
    );

    const FashionIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-4 right-4 w-8 h-8 lg:w-12 lg:h-12 text-fuchsia-500" viewBox="0 0 24 24" fill="currentColor" shapeRendering="crispEdges">
            {/* Shoulders Top */}
            <rect x="7" y="4" width="1" height="1" /><rect x="8" y="4" width="1" height="1" />
            <rect x="15" y="4" width="1" height="1" /><rect x="16" y="4" width="1" height="1" />
            
            {/* Neck & Shoulder slope */}
            <rect x="6" y="5" width="4" height="1" />
            <rect x="14" y="5" width="4" height="1" />
            
            {/* Upper Chest */}
            <rect x="5" y="6" width="14" height="1" />
            
            {/* Sleeves Start */}
            <rect x="4" y="7" width="16" height="1" />
            <rect x="4" y="8" width="16" height="1" />
            
            {/* Sleeve Ends & Chest */}
            <rect x="4" y="9" width="3" height="1" />
            <rect x="8" y="9" width="8" height="1" />
            <rect x="17" y="9" width="3" height="1" />
            
            {/* Torso Block */}
            <rect x="8" y="10" width="8" height="10" />
        </svg>
    );

    // UPDATED Poly Icon with smaller size classes
    const PolyIcon = (
        <PolyLogo
            className="absolute top-5 right-2 **w-10 h-10 lg:w-12 lg:h-12** text-teal-400"
        />
    );
    
    const getIcon = (t) => {
        if (t.includes("PianoGPT")) return PianoIcon;
        if (t === "FlashShell: A UNIX Command Interpreter") return ShellIcon;
        if (t === "NumPy Neural Network: Backpropagation from Scratch") return FashionIcon;
        if (t === "Poly Chat") return PolyIcon;
        if (t === "Case Study: Sectioned AI Conversations") return <FigmaLogoIcon className="absolute top-4 right-4 w-6 h-6 lg:w-10 lg:h-10" />;

        return null;
    };


    return (
        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-amber-400 flex flex-col h-full shadow-lg relative">
            <h4 className="text-xl font-bold text-amber-400 mb-2">{title === "NumPy Neural Network: Backpropagation from Scratch" 
                    ? <>NumPy Neural Network:<br />Backpropagation from Scratch</>
                    : title
                }</h4>
            {getIcon(title)}
            <div className="flex flex-wrap mb-4 gap-2">
                {tags.map((tag, index) => (
                    // Uses the unified getTechIcon function
                    <span key={index} className="flex items-center bg-gray-700 text-gray-200 text-xs font-semibold px-3 py-1 rounded-sm border border-gray-600">
                        {getTechIcon(tag)}
                        {tag}
                    </span>
                ))}
            </div>
            <p className="text-gray-300 mb-4 flex-grow text-sm">{description}</p>
            <div className="mt-auto flex space-x-3">
                <Link to={linkDetail} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-sm transition duration-150 text-sm tracking-wide shadow-md">
                    Deep Dive
                </Link>
                <a href={linkCode} target="_blank" rel="noopener noreferrer" className="text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-slate-900 font-medium py-2 px-4 rounded-sm transition duration-150 text-sm">
                    {linkCode === "https://www.figma.com/proto/Vga65q45xVLuRAdGxUZ3HV/GPT-Case-Study--Sectioned-Conversations?node-id=1-2&p=f&t=id1x9bw2ZsCzmZDZ-8&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&hide-ui=1" ? "Figma" : "Code"}
                </a>
            </div>
        </article>
    );
};

// 3.2 Global Components
const Header = () => (
    <div className="py-4">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-amber-400 tracking-wider mb-4">
            <Link to="/" className="hover:text-amber-500 transition duration-150">Amir Rafiei</Link>
        </h1>
    </div>
);

const Footer = () => (
    <footer className="bg-slate-900 text-gray-400 mt-12 py-6 border-t border-gray-700">
        <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Amir Rafiei. All rights reserved.</p>
            <p className="mt-2 text-gray-500">Built with React and Tailwind CSS.</p>
        </div>
    </footer>
);

const HeroSection = () => (
    <div className="py-6 border-b border-gray-700 mb-6">
        <h2 className="text-xl font-extrabold text-white mb-3">Data Science & Computer Science @ UC Berkeley</h2>
    </div>
);

const SkillsSection = ({ activeSection }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const inactiveClass = "text-gray-300 hover:text-amber-500 font-medium";
    const activeClass = "text-amber-400 font-extrabold"; 
    const getLinkClass = (sectionName) => `block text-lg transition duration-150 ${activeSection === sectionName ? activeClass : inactiveClass}`;
    
    const handleNavigationAndScroll = (e, sectionId) => {
        e.preventDefault();
        const searchParams = `?section=${sectionId}`;
        if (location.pathname !== '/') {
            navigate(`/${searchParams}`);
        } else {
            const targetElement = document.getElementById(sectionId);
            const scrollRoot = document.getElementById('scroll-root');
            if (targetElement && scrollRoot) {
                scrollRoot.scrollTo({ top: targetElement.offsetTop - 10, behavior: 'auto' });
                navigate(`/${searchParams}`, { replace: true });
            }
        }
    };

    return (
        <div className="pt-4 pb-8">
            <nav className="space-y-3">
                <a href="#about" onClick={(e) => handleNavigationAndScroll(e, 'about')} className={getLinkClass('about')}>— About Me</a>
                <a href="#experience" onClick={(e) => handleNavigationAndScroll(e, 'experience')} className={getLinkClass('experience')}>— Experience</a>
                <a href="#projects" onClick={(e) => handleNavigationAndScroll(e, 'projects')} className={getLinkClass('projects')}>— Featured Projects</a>
            </nav>
            <div className="flex space-x-6 pt-6 border-t border-gray-700 mt-6">
                <a href="https://github.com/amirhrafiei" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-500 transition duration-150" aria-label="GitHub"><svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.082-.742.083-.727.083-.727 1.205.084 1.839 1.237 1.839 1.237 1.07 1.833 2.807 1.304 3.492.997.107-.775.418-1.304.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.465-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.292-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.771.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.474 5.923.42.368.807 1.096.807 2.222v3.293c0 .319.192.694.802.576 4.765-1.589 8.196-6.091 8.196-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                <a href="https://linkedin.com/in/-amirr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-500 transition duration-150" aria-label="LinkedIn"><svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.56-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.31 7 3.585v5.65z"/></svg></a>
                <a href="mailto:amir.r@berkeley.edu" className="text-gray-300 hover:text-amber-500 transition duration-150" aria-label="Email"><svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2l-10 7L2 6h20zM2 18V7l10 7 10-7v11H2z"/></svg></a>
            </div>
        </div>
    );
};

// --- RESTORED MISSING COMPONENTS ---
const AboutSection = () => (
    <section id="about" className="pt-16 pb-10 border-b border-gray-700">
        <div className="space-y-4 text-gray-300 text-lg">
            <p>I’m a Data Science major and CS minor at UC Berkeley with a builder’s soul, a data-driven mind, and a compiler that occasionally tests my patience. My journey as a transfer student turned me into a professional problem-solver, a trait I’ve brought to architecting a multimodal voice analytics pipeline with Docker and building FlashShell, a Unix-style shell in C++.</p>
            <p>From engineering front-end systems at Codify to developing full-stack AI PWAs like Poly Chat, I’m driven to build software that is as robust as it is intelligent (and hopefully bug-free on the first try). I spend an unhealthy amount of time thinking about clean architecture and why my code worked perfectly five minutes ago but doesn't now.</p>
            <p>When I’m not in the terminal, I’m likely at the cinema, getting inspired at SFMOMA, or attempting a new recipe in the kitchen.</p>
            <p> Check out my projects below!</p>
        </div>
    </section>
);

const ExperienceSection = () => (
    <section id="experience" className="pt-16 pb-10 border-b border-gray-700">
        <div className="space-y-8">
            <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="text-xl font-bold text-amber-400">Data Discovery Project: Multimodal Voice Analytics Pipeline</h4>
                <p className="text-gray-400">University of California, Berkeley | Spring 2026</p>
                <p className="text-gray-300 mt-2">Engineered a full-stack voice analytics platform with containerized Python environments and real-time data visualization. Responsibilities included:</p>
                <ul className="list-disc list-inside pl-4 mt-3 space-y-1 text-gray-300">
                    <li><strong>Containerization & Deployment:</strong> Built a Dockerfile to containerize the Python environment, ensuring consistent performance across development and production while simplifying dependency management.</li>
                    <li><strong>Storage Infrastructure:</strong> Integrated MinIO as a high-performance object storage solution to manage large-scale raw acoustic data with S3-compatible APIs.</li>
                    <li><strong>AI Automation & Orchestration:</strong> Developed an automated agent using Activepieces to orchestrate workflows between the voice analytics engine and external communication tools.</li>
                    <li><strong>User Interface:</strong> Designed and implemented a custom React/Tailwind dashboard to visualize real-time stress scores and acoustic biomarkers.</li>
                    <li><strong>CI/CD & Version Control:</strong> Managed the full project lifecycle via GitHub, utilizing branching strategies and pull requests for code integrity.</li>
                </ul>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="text-xl font-bold text-amber-400">Software Developer</h4>
                <p className="text-gray-400">Codify | Spring 2026</p>
                <p className="text-gray-300 mt-2">Developing front-end architecture for the UCSB LBA Weekender web application with a focus on scheduling engine and interface design. Key contributions include:</p>
                <ul className="list-disc list-inside pl-4 mt-3 space-y-1 text-gray-300">
                    <li><strong>Front-End Architecture:</strong> Specializing in the scheduling engine and interface implementation for complex event management workflows.</li>
                    <li><strong>Version Control & Collaboration:</strong> Leveraging Git/GitHub within a multi-developer team, maintaining code quality through peer reviews and collaborative debugging.</li>
                    <li><strong>Component Development:</strong> Building reusable TypeScript and Tailwind components to reduce styling overhead and ensure design consistency across the platform.</li>
                </ul>
            </div>
            <div className="border-l-4 border-gray-700 pl-4">
                <h4 className="text-xl font-bold text-white">Student Researcher</h4>
                <p className="text-gray-400">TAFLab — University of California, Berkeley | Sep 2025 - Oct 2025</p>
                <p className="text-gray-300 mt-2">Contributed to a research project developing autonomous sailboat drones (hybrid renewable energy). Performed market landscape analysis and user validation interviews, refining value propositions and gaining exposure to interdisciplinary engineering and business collaboration during field testing.</p>
            </div>
            <div className="border-l-4 border-gray-700 pl-4">
                <h4 className="text-xl font-bold text-white">Tutor Leader — Center for Academic Success</h4>
                <p className="text-gray-400">Los Angeles Pierce College | Jan 2021 - Dec 2022</p>
                <p className="text-gray-300 mt-2">Led training and collaborative workshops for over 100 tutors on metacognition, growth mindset, and effective communication strategies. Provided individual and group tutoring in Math and English, developing strong leadership and translation skills for complex academic concepts.</p>
            </div>
        </div>
    </section>
);

const ProjectsSection = () => (
    <section id="projects" className="pt-16 pb-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Using the newly ordered data array */}
            {orderedProjectsData.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    </section>
);

const CursorSpotlight = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (event) => setMousePosition({ x: event.clientX, y: event.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return (
        <div className="hidden lg:block fixed inset-0 pointer-events-none transition duration-150 ease-out"
            style={{
                background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(245, 158, 11, 0.15), transparent 80%)`,
                WebkitMaskImage: 'radial-gradient(600px at center, white, transparent)',
                zIndex: 5,
            }}
        />
    );
};

const LeftFixedColumn = ({ activeSection }) => (
    <div className="bg-slate-900 p-8 lg:w-1/3 lg:border-r border-gray-800 lg:h-full lg:overflow-y-auto">
        <Header />
        <HeroSection />
        <SkillsSection activeSection={activeSection} />
    </div>
);


const HomePage = ({ setActiveSection }) => {
    const observerRef = useRef(null);

    useEffect(() => {
        const scrollRoot = document.querySelector('#scroll-root');
        if (!scrollRoot) return;
        if (observerRef.current) scrollRoot.removeEventListener('scroll', observerRef.current);
        const callback = () => {
            let latestActiveSection = 'about';
            for (const id of SECTIONS) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const rootRect = scrollRoot.getBoundingClientRect();
                    if (rect.top <= rootRect.top + 50) latestActiveSection = id;
                }
            }
            setActiveSection(latestActiveSection);
        };
        scrollRoot.addEventListener('scroll', callback);
        callback();
        observerRef.current = callback;
        return () => scrollRoot.removeEventListener('scroll', observerRef.current);
    }, [setActiveSection]);

    const location = useLocation();
    useEffect(() => {
        const scrollRoot = document.getElementById('scroll-root');
        const params = new URLSearchParams(location.search);
        const sectionId = params.get('section');
        if (sectionId && scrollRoot) {
            const targetElement = document.getElementById(sectionId);
            if (targetElement) {
                setTimeout(() => scrollRoot.scrollTo({ top: targetElement.offsetTop - 10, behavior: 'auto' }), 0);
            }
        }
    }, [location.search, location.pathname]);

    return (
        <div className="pt-16">
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
        </div>
    );
};
const PianoGPTDetails = () => (
    <div className="py-12 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-amber-400 hover:text-amber-500 font-medium mb-8 transition duration-150">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to All Projects
        </Link>
        <h2 className="text-4xl font-extrabold text-white mb-2">PianoGPT</h2>
        <p className="text-xl text-gray-400 mb-6">A creative engineering exploration into building a decoder-only GPT from scratch.</p>
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-2xl mb-10">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-amber-500">Validation Samples (v0.1)</h3>
                <span className="bg-amber-900/40 text-amber-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-amber-700">Early Training Stage</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <p className="font-bold text-white mb-4 flex items-center text-sm">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                        AI Composition #1
                    </p>
                    <audio controls className="w-full h-8 brightness-90 contrast-125">
                        <source src="https://raw.githubusercontent.com/amirhrafiei/pianogpt/main/samples/ai_composition_1.mp3" type="audio/mpeg" />
                    </audio>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <p className="font-bold text-white mb-4 flex items-center text-sm">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                        AI Composition #2
                    </p>
                    <audio controls className="w-full h-8 brightness-90 contrast-125">
                        <source src="https://raw.githubusercontent.com/amirhrafiei/pianogpt/main/samples/ai_composition_2.mp3" type="audio/mpeg" />
                    </audio>
                </div>
            </div>
            <p className="mt-6 text-xs text-gray-500 italic leading-relaxed">
                * Note: These samples represent the model's current ability to maintain harmonic structure and REMI token syntax. While the melodies are currently foundational, they validate the successful implementation of the causal attention mechanism.
            </p>
        </div>
        <div className="mt-10 prose prose-invert max-w-none bg-gray-800 p-8 rounded-lg border border-gray-700 text-gray-300">
            <h3 className="text-2xl font-bold text-amber-400">Technical Methodology</h3>
            <p>At its core, PianoGPT is a study in high-dimensional probability and linear algebra. The model treats musical composition as a "Next Token Prediction" task, optimizing the cross-entropy loss between the predicted distribution and the actual MIDI event sequence.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-900 p-5 rounded-lg border border-gray-700">
                    <h5 className="font-bold text-amber-400 mb-2 text-sm">4-Head Attention</h5>
                    <p className="text-xs italic leading-relaxed">Tracks rhythm, pitch, and harmony simultaneously through parallel self-attention heads, ensuring structural coherence over long musical phrases.</p>
                </div>
                <div className="bg-gray-900 p-5 rounded-lg border border-gray-700">
                    <h5 className="font-bold text-amber-400 mb-2 text-sm">MAESTRO Dataset</h5>
                    <p className="text-xs italic leading-relaxed">Trained on 200+ hours of professional piano performances, enabling the model to learn nuanced expressive features like velocity and tempo shifts.</p>
                </div>
            </div>
            <hr className="my-10 border-gray-700" />
            <a href="https://github.com/amirhrafiei/pianogpt" target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-sm transition duration-150 shadow-md">
                View Full Documentation on GitHub
            </a>
        </div>
    </div>
);
const ShellDetails = () => {
    const shellProject = projectsData.find(p => p.id === 1);
    if (!shellProject) return <div className="p-10 text-center text-red-500 bg-slate-900">Project details not found.</div>;
    return (
        <div className="py-12">
            <Link to="/" className="inline-flex items-center text-amber-400 hover:text-amber-500 font-medium mb-8 transition duration-150">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to All Projects
            </Link>
            <h2 className="text-4xl font-extrabold text-white mb-2">{shellProject.title}</h2>
            <p className="text-xl text-gray-400 mb-4">A deep dive into process control, inter-process communication (IPC), and environment management in a Unix-like environment.</p>
            <div className="flex flex-wrap mb-6 gap-2">
                {shellProject.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1 rounded-sm border border-gray-600">{tag}</span>
                ))}
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mt-8">
                <div className="prose max-w-none text-gray-300">
                    <hr className="my-8 border-gray-700" />
                    <div className="mt-4 rounded-md bg-transparent">
                        <iframe src="/portfolio/shell_demo.html" className="w-full aspect-video border-0 rounded-sm" title="C++ Shell Interactive Demo" sandbox="allow-scripts allow-same-origin"></iframe>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-400">FlashShell Overview</h3>
                    <p>This project functions as a custom command-line interpreter (CLI), replicating the core functionality of Bash/Zsh. The primary challenge was correctly handling execution context based on command type (built-in vs. external) and managing asynchronous child processes.</p>
                    <p className="text-gray-300 mb-2">Execution relies entirely on the <code>fork()</code> → <code>execvp()</code> → <code>waitpid()</code> process model , ensuring external commands run as true child processes.</p>
                    <p className="text-gray-300 mb-2"><strong>Piping Architecture:</strong> Implemented multi-stage pipelines (e.g., <code>cat | head | wc</code>) by creating multiple <code>pipe()</code> channels. For each stage, the child process uses <code>dup2()</code> to set the output of command $N$ as the input of command $N+1$. This complex process isolation and I/O redirection was the most challenging feature to achieve.</p>
                    <p className="text-gray-300"><strong>Built-in Execution:</strong> Handled built-in commands (like <code>echo</code> and <code>type</code>) by executing their logic directly within the child process when in a pipeline, maintaining correct I/O flow without calling <code>execvp()</code>.</p>
                    <h4 className="text-xl font-bold mt-6 text-white">1. Robust Process Management & Pipelining</h4>
                    <p className="text-gray-300 mb-2">Execution relies entirely on the <code>fork()</code> → <code>execvp()</code> → <code>waitpid()</code> process model , ensuring external commands run as true child processes.</p>
                    <p className="text-gray-300 mb-2"><strong>Piping Architecture:</strong> Implemented multi-stage pipelines (e.g., <code>cat | head | wc</code>) by creating multiple <code>pipe()</code> channels. For each stage, the child process uses <code>dup2()</code> to set the output of command $N$ as the input of command $N+1$. This complex process isolation and I/O redirection was the most challenging feature to achieve.</p>
                    <p className="text-gray-300"><strong>Built-in Execution:</strong> Handled built-in commands (like <code>echo</code> and <code>type</code>) by executing their logic directly within the child process when in a pipeline, maintaining correct I/O flow without calling <code>execvp()</code>.</p>
                    <h4 className="text-xl font-bold mt-6 text-white">2. Advanced I/O Redirection & Hijacking</h4>
                    <p className="text-gray-300 mb-2"><strong>I/O Hijacking:</strong> Implemented comprehensive redirection (<code>&gt;</code>, <code>&gt;&gt;</code>, <code>2&gt;</code>, <code>2&gt;&gt;</code>). This involved using the <code>open()</code> system call to create a file descriptor (fd) and then using <code>dup2(fd, STDOUT_FILENO)</code> to hijack the standard output channel (fd=1) of the child process.</p>
                    <p className="text-gray-300"><strong>Append/Truncate Logic:</strong> Correctly handled the difference between overwriting (<code>O_TRUNC</code> for <code>&gt;</code>) and appending (<code>O_APPEND</code> for <code>&gt;&gt;</code>).</p>
                    <h4 className="text-xl font-bold mt-6 text-white">3. State-Aware Argument Parsing</h4>
                    <p className="text-gray-300 mb-2">The command-line parser ensures correct execution even when arguments contain complex syntax:</p>
                    <ul className="list-disc list-inside pl-5 space-y-1 text-gray-300">
                        <li><strong>Literal Quoting:</strong> Uses a state machine with "variable holders" (boolean flags) to track open single (<code>'</code>) and double (<code>"</code>) quotes, preserving internal spaces and treating characters literally.</li>
                        <li><strong>Backslash Escaping:</strong> Correctly handles backslashes (<code>\</code>) outside of quotes to escape special characters, preventing the shell from misinterpreting subsequent spaces or symbols.</li>
                    </ul>
                    <h4 className="text-xl font-bold mt-6 text-white">4. History Management & Persistence</h4>
                    <p className="text-gray-300 mb-2">The shell integrates the GNU Readline library to provide a professional user experience:</p>
                    <ul className="list-disc list-inside pl-5 space-y-1 text-gray-300">
                        <li><strong>Persistent History:</strong> Implemented <code>history -r</code> and <code>history -w</code> support to read and write the command history to a file (<code>HISTFILE</code> environment variable) on startup and exit.</li>
                        <li><strong>Runtime Control:</strong> Added support for limiting the history display (<code>history n</code>).</li>
                        <li><strong>Autocompletion:</strong> Integrated custom generators for command autocompletion based on built-ins and executables found in the user's <code>$PATH</code>.</li>
                    </ul>
                    <h4 className="text-xl font-bold mt-6 text-amber-400">Future Development</h4>
                    <p className="text-gray-300">If this project were extended, the first major addition would be integrating a complex, high-level feature: an AI Assistant interface to interpret complex natural language queries into executable shell commands.</p>
                    <hr className="my-8 border-gray-700" />
                    <div className="flex space-x-4 mt-4">
                        <a href={shellProject.linkCode} target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-sm transition duration-150 shadow-md">Browse Source Code on GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FashionMnistDemo = () => {
    const [selectedId, setSelectedId] = useState(0);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState(null);

    const samples = [
        { id: 0, label: 'T-shirt', icon: <TShirtDemoIcon /> },
        { id: 1, label: 'Trouser', icon: <TrouserDemoIcon /> },
        { id: 2, label: 'Bag', icon: <BagDemoIcon /> },
        { id: 3, label: 'Sneaker', icon: <SneakerDemoIcon /> },
    ];

    const runPrediction = () => {
        setPredicting(true);
        setResult(null);
        setTimeout(() => {
            const probs = samples.map(s => {
                let score;
                if (s.id === selectedId) score = 0.90 + Math.random() * 0.09;
                else score = Math.random() * 0.05;
                return { label: s.label, score };
            });
            const sortedProbs = probs.sort((a, b) => b.score - a.score);
            setResult(sortedProbs);
            setPredicting(false);
        }, 800);
    };

    return (
        <div className="mt-8 mb-12 p-6 bg-slate-900 border border-gray-700 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Inference Demo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Select Input Image</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {samples.map((sample) => (
                            <button key={sample.id} onClick={() => { setSelectedId(sample.id); setResult(null); }} className={`p-4 rounded-md border-2 transition-all duration-200 flex flex-col items-center gap-2 ${selectedId === sample.id ? 'border-amber-500 bg-gray-800 text-amber-400' : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-500 hover:text-gray-300'}`}>
                                {sample.icon}
                                <span className="text-xs font-mono">{sample.label}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={runPrediction} disabled={predicting} className={`w-full py-3 px-4 rounded-md font-bold text-slate-900 transition-all ${predicting ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20'}`}>
                        {predicting ? 'Running Model...' : 'Run Prediction'}
                    </button>
                </div>
                <div className="bg-gray-800 rounded-md p-4 border border-gray-700 flex flex-col h-full min-h-[200px]">
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Model Output (Softmax)</p>
                    {predicting ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 animate-pulse">
                            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-sm font-mono">Processing...</span>
                        </div>
                    ) : result ? (
                        <div className="space-y-3 flex-1">
                            {result.map((item, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between text-xs font-mono mb-1 text-gray-300">
                                        <span className={idx === 0 ? "text-amber-400 font-bold" : ""}>{item.label}</span>
                                        <span>{(item.score * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${idx === 0 ? 'bg-amber-500' : 'bg-gray-500'}`} style={{ width: `${item.score * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm font-mono italic">Waiting for input...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FashionDetails = () => (
    <div className="py-12 bg-gray-800 p-8 rounded-lg border border-gray-700">
        <Link to="/" className="inline-flex items-center text-amber-400 hover:text-amber-500 font-medium mb-8 transition duration-150">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to All Projects
        </Link>
        <h2 className="text-3xl font-bold text-fuchsia-400 mb-4">NumPy Neural Network: Backpropagation from Scratch</h2>
        <h3 className="text-2xl font-bold text-white mb-2 mt-8">Project Goal</h3>
        <p className="text-gray-300 mb-6">To demonstrate a mastery of the core mathematical principles of deep learning by building a complete, two-layer neural network (FCNN) exclusively using the NumPy library. The model solves the Fashion MNIST image classification benchmark.</p>
        <FashionMnistDemo />
        <h3 className="text-2xl font-bold text-white mb-4 mt-8">Architecture and Core Implementation</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-300 border-collapse">
                <thead>
                    <tr className="border-b border-gray-600">
                        <th className="py-2 px-4 font-bold text-amber-400">Layer</th>
                        <th className="py-2 px-4 font-bold text-amber-400">Size</th>
                        <th className="py-2 px-4 font-bold text-amber-400">Activation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-700"><td className="py-2 px-4">Input</td><td className="py-2 px-4">784 Neurons</td><td className="py-2 px-4">N/A</td></tr>
                    <tr className="border-b border-gray-700"><td className="py-2 px-4">Hidden</td><td className="py-2 px-4">128 Neurons</td><td className="py-2 px-4">ReLU</td></tr>
                    <tr className="border-b border-gray-700"><td className="py-2 px-4">Output</td><td className="py-2 px-4">10 Neurons</td><td className="py-2 px-4">Softmax</td></tr>
                </tbody>
            </table>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 mt-8">Key Achievements</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong className="text-white">Vectorized Backpropagation:</strong> Full implementation of the chain rule to calculate gradients, including the integrated derivative of Cross-Entropy Loss and Softmax.</li>
            <li><strong className="text-white">Custom Initialization:</strong> Implemented He Initialization (W ∝ √(2/N_in)) to ensure training stability.</li>
            <li><strong className="text-white">Gradient Descent:</strong> Manual implementation of the parameter update rule.</li>
            <li><strong className="text-white">Image Prediction Visualization:</strong> Includes a function to reshape and display 28x28 grayscale images using Matplotlib, clearly showing the model's prediction alongside the true label for qualitative assessment.</li>
            <li><strong className="text-white">Result:</strong> Achieved a competitive baseline accuracy on the unseen test set, confirming model generalization.</li>
        </ul>
        <hr className="my-8 border-gray-700" />
        <div className="flex space-x-4 mt-4">
            <a href="https://github.com/amirhrafiei/numpy-fashion-mnist-nn" target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-sm transition duration-150 shadow-md">Browse Source Code on GitHub</a>
        </div>
    </div>
);

// --- NEW COMPONENT: PolyChatDetails ---
const PolyChatDetails = () => {
    const polyChatProject = projectsData.find(p => p.id === 3);
    if (!polyChatProject) return <div className="p-10 text-center text-red-500 bg-slate-900">Project details not found.</div>;
    
    // The unified getTechIcon is now used directly here, with a slightly larger size for the details page
    const getDetailsTechIcon = (tag) => getTechIcon(tag, "w-4 h-4 mr-2"); 

    return (
        <div className="py-12">
            <Link to="/" className="inline-flex items-center text-amber-400 hover:text-amber-500 font-medium mb-8 transition duration-150">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to All Projects
            </Link>
            <h2 className="text-4xl font-extrabold text-white mb-2">{polyChatProject.title}</h2>
            <p className="text-xl text-gray-400 mb-4">A complete, real-time language exchange platform powered by Google's latest generative AI model.</p>
            <div className="flex flex-wrap mb-6 gap-2">
                {polyChatProject.tags.map((tag, index) => (
                    // FIX: Using getDetailsTechIcon which correctly calls the unified function
                    <span key={index} className="flex items-center bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1 rounded-sm border border-gray-600">
                        {getDetailsTechIcon(tag)} 
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mt-8">
                <div className="prose max-w-none text-gray-300">
                    <div className="flex justify-center space-x-4 mt-4 mb-10">
                        <a href="https://amirhrafiei.github.io/poly-chat" target="_blank" rel="noopener noreferrer" className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold py-3 px-6 rounded-sm transition duration-150 shadow-md">
                            Let's Poly Chat!
                        </a> </div>
                    <h3 className="text-2xl font-bold text-teal-400">Project Overview</h3>
                    <p>Poly Chat is designed to transform passive language study into active, structured conversation. It features private DMs for peer-to-peer practice and a dedicated AI companion to provide customized practice environments.</p>

                    <h4 className="text-xl font-bold mt-6 text-white">AI-Powered Language Intelligence (Gemini API)</h4>
                    <p className="text-gray-300 mb-2">The application makes extensive use of the Gemini API for all language intelligence features, minimizing backend complexity and maximizing responsiveness.</p>
                    <ul className="list-disc list-inside pl-5 space-y-1 text-gray-300">
                        <li><strong>Real-Time Translation:</strong> Automatically translates English user input to the target language before sending the message.</li>
                        <li><strong>Grammar Correction:</strong> An optional Practice Mode triggers Gemini to check the user's sentence structure and provides a corrected version with a brief explanation.</li>
                        <li><strong>Contextual Conversation:</strong> Users can select a Topic and a Grammar Focus (e.g., Subjunctive Mood) to constrain the AI's responses for targeted learning.</li>
                        <li><strong>Vocabulary Lookup:</strong> Users can right-click any word in chat to get an instant definition, powered by Gemini, and save it to their private Notebook.</li>
                    </ul>

                    <h4 className="text-xl font-bold mt-6 text-white">Full-Stack Real-Time Architecture (React & Firebase)</h4>
                    <p className="text-gray-300 mb-2">Built as a modern PWA, the app features a responsive design and uses Firebase for all backend services:</p>
                    <ul className="list-disc list-inside pl-5 space-y-1 text-gray-300">
                        <li><strong>Authentication:</strong> Seamless, anonymous sign-in via Firebase Auth for quick onboarding.</li>
                        <li><strong>Real-Time Chat:</strong> Uses Firestore `onSnapshot` listeners to enable instant message and online status updates in Direct Message (DM) rooms.</li>
                        <li><strong>Database Design:</strong> Implemented security-minded Firestore rules to ensure DMs are only accessible to the two participants, and vocabulary notebooks are private to the user.</li>
                    </ul>

                    <hr className="my-8 border-gray-700" />
                    <div className="flex space-x-4 mt-4">
                        <a href={polyChatProject.linkCode} target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-sm transition duration-150 shadow-md">
                            Browse Source Code on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- END NEW COMPONENT ---


// --- 4. APP LOGIC ---
const AppLogic = () => {
    const [activeSection, setActiveSection] = useState('about'); 
    const location = useLocation();

    useEffect(() => {
        // Updated logic to catch the new route
        if (location.pathname.includes('/details') || location.pathname.includes('/shell-details') || 
            location.pathname.includes('/polychat-details') || location.pathname.includes('/fashion-details')) {
            setActiveSection('projects');
        }
    }, [location.pathname, setActiveSection]);

    return (
        <div className="flex flex-col lg:h-screen lg:flex-row antialiased bg-gray-900 lg:overflow-hidden">
            <CursorSpotlight />
            <LeftFixedColumn activeSection={activeSection} />
            <main id="scroll-root" className="flex-1 w-full p-8 lg:p-12 lg:overflow-y-auto">
                <Routes>
                    <Route path="/" element={<HomePage setActiveSection={setActiveSection} />} />
                    <Route path="/shell-details" element={<ShellDetails />} />
                    <Route path="/fashion-details" element={<FashionDetails />} />
                    <Route path="/polychat-details" element={<PolyChatDetails />} /> 
                    <Route path="/figma-details" element={<FigmaDetails />} />
                    <Route path="/pianogpt-details" element={<PianoGPTDetails />} />

                </Routes>
                <Footer />
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppLogic />
        </Router>
    );
};

export default App;