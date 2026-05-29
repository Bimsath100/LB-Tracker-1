import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const syllabusData = [
  // ET Division
  { id: 1, subject: 'ET', name: 'Development of Engineering Technology and daily needs (7 periods)' },
  { id: 2, subject: 'ET', name: 'Drawing plans for engineering work (Engineering Drawing) (40 periods)' },
  { id: 3, subject: 'ET', name: 'Building a safe and healthy work environment (10 periods)' },
  { id: 4, subject: 'ET', name: 'Scientific methods in building construction work (49 periods)' },
  { id: 5, subject: 'ET', name: 'Studying how machine movements and mechanisms work (36 periods)' },
  { id: 6, subject: 'ET', name: 'Maintaining main parts and systems of motor vehicles (Automotive) (58 periods)' },
  { id: 7, subject: 'ET', name: 'Using electrical power for everyday tasks (46 periods)' },
  { id: 8, subject: 'ET', name: 'Selecting materials and methods for production work (36 periods)' },
  { id: 9, subject: 'ET', name: 'Standard measurements and measuring tools used in technology (18 periods)' },
  { id: 10, subject: 'ET', name: 'Using engineering standards and specifications in work (10 periods)' },
  { id: 11, subject: 'ET', name: 'Generation, transmission, distribution, and use of electricity (44 periods)' },
  { id: 12, subject: 'ET', name: 'Electronic technology and how it is used daily (Electronics) (74 periods)' },
  { id: 13, subject: 'ET', name: 'Using fluid-powered machines (Hydraulics & Pneumatics) (39 periods)' },
  { id: 14, subject: 'ET', name: 'Principles of land surveying and levelling (52 periods)' },
  { id: 15, subject: 'ET', name: 'Domestic water supply and waste management (37 periods)' },
  { id: 16, subject: 'ET', name: 'Preparing Bills of Quantities (BOQ) and calculating costs (26 periods)' },
  { id: 17, subject: 'ET', name: 'Skills needed for production and business development (18 periods)' },

  // SFT Division
  { id: 18, subject: 'SFT', name: 'Area and Volume (12 periods)' },
  { id: 19, subject: 'SFT', name: 'Measuring Units and Measuring Instruments (12 periods)' },
  { id: 20, subject: 'SFT', name: 'Pythagoras Relationship (12 periods)' },
  { id: 21, subject: 'SFT', name: 'Organisms with Cellular Organization (Introduction to Cells) (12 periods)' },
  { id: 22, subject: 'SFT', name: 'Plant Tissues (12 periods)' },
  { id: 23, subject: 'SFT', name: 'Classification of Organisms (12 periods)' },
  { id: 24, subject: 'SFT', name: 'Microorganisms (12 periods)' },
  { id: 25, subject: 'SFT', name: 'Industries related to Microorganisms (12 periods)' },
  { id: 26, subject: 'SFT', name: 'Tissue Culture (12 periods)' },
  { id: 27, subject: 'SFT', name: 'Plant Classification (12 periods)' },
  { id: 28, subject: 'SFT', name: 'Natural Forests (12 periods)' },
  { id: 29, subject: 'SFT', name: 'Vertebrates and Invertebrates (12 periods)' },
  { id: 30, subject: 'SFT', name: 'Force (12 periods)' },
  { id: 31, subject: 'SFT', name: 'Work, Energy, and Power (12 periods)' },
  { id: 32, subject: 'SFT', name: 'Trigonometric Ratios (12 periods)' },
  { id: 33, subject: 'SFT', name: 'Rotational Motion (12 periods)' },
  { id: 34, subject: 'SFT', name: 'Electricity (12 periods)' },
  { id: 35, subject: 'SFT', name: 'Heat (12 periods)' },
  { id: 36, subject: 'SFT', name: 'Thermochemistry (12 periods)' },
  { id: 37, subject: 'SFT', name: 'Chemical Kinetics (12 periods)' },
  { id: 38, subject: 'SFT', name: 'Biomolecules (12 periods)' },
  { id: 39, subject: 'SFT', name: 'Polymers (13 periods)' },
  { id: 40, subject: 'SFT', name: 'Mechanical Properties of Matter (13 periods)' },
  { id: 41, subject: 'SFT', name: 'Fluids (13 periods)' },
  { id: 42, subject: 'SFT', name: 'Chemical Industries (13 periods)' },
  { id: 43, subject: 'SFT', name: 'Natural Products (13 periods)' },
  { id: 44, subject: 'SFT', name: 'Coordinate Geometry - Linear and Quadratic Functions (13 periods)' },
  { id: 45, subject: 'SFT', name: 'Statistics (13 periods)' },
  { id: 46, subject: 'SFT', name: 'Computer System and Components (13 periods)' },
  { id: 47, subject: 'SFT', name: 'Operating Systems (OS) (13 periods)' },
  { id: 48, subject: 'SFT', name: 'Application Software (13 periods)' },
  { id: 49, subject: 'SFT', name: 'Internet (13 periods)' },
  { id: 50, subject: 'SFT', name: 'Environmental Equilibrium (13 periods)' },

  // ICT Division
  { id: 51, subject: 'ICT', name: 'Concept of ICT (28 periods)' },
  { id: 52, subject: 'ICT', name: 'Introduction to Computer (22 periods)' },
  { id: 53, subject: 'ICT', name: 'Data Representation (Number Systems) (18 periods)' },
  { id: 54, subject: 'ICT', name: 'Fundamental of Digital Circuits (Logic Gates) (26 periods)' },
  { id: 55, subject: 'ICT', name: 'Computer Operating System (22 periods)' },
  { id: 56, subject: 'ICT', name: 'Data Communication and Networking (50 periods)' },
  { id: 57, subject: 'ICT', name: 'System Analysis and Design (68 periods)' },
  { id: 58, subject: 'ICT', name: 'Database Management (SQL & ER Diagrams) (50 periods)' },
  { id: 59, subject: 'ICT', name: 'Programming (Python, Flowcharts, Pseudo-code) (74 periods)' },
  { id: 60, subject: 'ICT', name: 'Web Development (HTML, CSS, PHP) (60 periods)' },
  { id: 61, subject: 'ICT', name: 'Internet of Things (IoT) (15 periods)' },
  { id: 62, subject: 'ICT', name: 'ICT in Business (12 periods)' },
  { id: 63, subject: 'ICT', name: 'New trends and Future Directions of ICT (12 periods)' },
  { id: 64, subject: 'ICT', name: 'Project Work (30 periods)' }
];

export default function SyllabusPenetrationMatrix({ userEmail }) {
  const adminEmail = "lomithabimsath51@gmail.com";
  const [activeTab, setActiveTab] = useState('ET');
  const [completedLessons, setCompletedLessons] = useState([]);

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`spm_completed_${adminEmail}`);
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved lessons", e);
      }
    }
  }, []);

  const toggleLesson = (id) => {
    let newCompleted;
    if (completedLessons.includes(id)) {
      newCompleted = completedLessons.filter(lessonId => lessonId !== id);
    } else {
      newCompleted = [...completedLessons, id];
    }
    setCompletedLessons(newCompleted);
    localStorage.setItem(`spm_completed_${adminEmail}`, JSON.stringify(newCompleted));
  };

  // SECURITY GUARD: Level-01 Auth Check
  if (userEmail !== adminEmail) {
    return (
      <div className="min-h-screen bg-[#070514] flex flex-col items-center justify-center p-4 font-mono select-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="border border-red-500/30 bg-[#14112c] p-8 md:p-12 rounded-xl text-center max-w-lg w-full relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 flex justify-center"
          >
            <svg className="w-20 h-20 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-3 tracking-[0.2em] uppercase text-shadow">ACCESS RESTRICTED</h2>
          <p className="text-red-400/80 text-sm tracking-widest uppercase">// LEVEL-01 AUTH REQUIRED</p>
          
          <div className="mt-10 border-t border-red-500/20 pt-6">
            <p className="text-xs text-neutral-500 tracking-wider">USER_ID: {userEmail || "UNKNOWN_ENTITY"}</p>
            <p className="text-xs text-red-400/60 mt-2 tracking-wider">STATUS: UNAUTHORIZED ATTEMPT LOGGED</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authorized Dashboard
  const currentLessons = syllabusData.filter(item => item.subject === activeTab);
  const tabs = ['ET', 'SFT', 'ICT'];

  return (
    <div className="min-h-screen bg-[#070514] text-white p-4 sm:p-6 md:p-10 relative overflow-hidden" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Dynamic Background Glows matching current theme (#9d5cff / purple) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#9d5cff]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#9d5cff]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-10 border-b border-[#9d5cff]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white drop-shadow-[0_0_15px_rgba(157,92,255,0.4)] uppercase">
              Syllabus Matrix
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
              </span>
              <p className="text-[#94a3b8] font-mono text-sm tracking-widest uppercase">
                // Admin Sync: {userEmail}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-[#14112c] rounded-lg border border-[#9d5cff]/10">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 text-lg font-bold tracking-widest transition-colors rounded-md overflow-hidden ${
                  activeTab === tab ? 'text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#9d5cff]/10'
                }`}
              >
                <span className="relative z-10">{tab}</span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-[#9d5cff]/20 border-b-2 border-[#9d5cff]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Content Matrix Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {currentLessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              
              return (
                <motion.div
                  key={lesson.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.04,
                    type: "spring",
                    stiffness: 100 
                  }}
                  onClick={() => toggleLesson(lesson.id)}
                  className={`group relative p-6 rounded-xl cursor-pointer transition-all duration-300 border overflow-hidden min-h-[160px] flex flex-col justify-between ${
                    isCompleted 
                      ? 'bg-[#14112c] border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                      : 'bg-[#14112c] border-[#9d5cff]/20 hover:border-[#9d5cff]/60 hover:shadow-[0_0_25px_rgba(157,92,255,0.15)] hover:-translate-y-1'
                  }`}
                >
                  {/* Neon completion pulse background */}
                  {isCompleted && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.05, 0.15, 0.05] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-[#10B981] pointer-events-none"
                    />
                  )}

                  {/* Card Header (ID & Status) */}
                  <div className="relative z-10 flex justify-between items-start gap-2 mb-4">
                    <span className={`font-mono text-xs font-bold tracking-wider transition-colors ${
                      isCompleted ? 'text-[#10B981]/70' : 'text-[#9d5cff]/70'
                    }`}>
                      IDX-{lesson.id.toString().padStart(3, '0')}
                    </span>
                    
                    {isCompleted && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[10px] font-bold text-[#10B981] px-2 py-1 bg-[#10B981]/10 rounded border border-[#10B981]/30 tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      >
                        // TERMINATED
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Card Title */}
                  <div className="relative z-10">
                    <h3 className={`text-lg font-medium leading-snug transition-all duration-300 ${
                      isCompleted 
                        ? 'text-neutral-500 line-through decoration-neutral-600/50' 
                        : 'text-white group-hover:text-[#9d5cff]'
                    }`}>
                      {lesson.name}
                    </h3>
                  </div>

                  {/* Hover interactive border glow line for incomplete cards */}
                  {!isCompleted && (
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#9d5cff] transition-all duration-500 group-hover:w-full" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
