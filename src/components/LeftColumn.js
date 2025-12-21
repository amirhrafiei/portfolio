import React from "react";
import Header from "./Header";
const HeroSection = () =>(
    <section className="hero-section">
        <div className="container">
            <h2>Statistics student at UC Berkeley</h2>
            <p>Driven to use modern computing to solve real problems</p>

        </div>
    </section>
);

const SkillsSection = ()=>(
    <section id="skills" className="skills-section">
        <div className="container">
            <h3>Skills</h3>
            <ul className="skills-list">
                <li>**Languages: C++, Python, Javascript</li>
                <li>**Systems:** Linux, UNIX Process Management, IPC, Concurrency</li>
                <li>**Tools:** Git/GitHub, Docker, CMake, Valgrind</li>
            </ul>
        </div>

    </section>
);

const LeftColumn = () =>(
     <div className="hidden lg:block lg:w-1/3 bg-slate-900 p-8 border-r border-gray-800 h-full overflow-y-auto">
        <Header />
        <HeroSection />
        <SkillsSection />
    </div>
);

export default LeftColumn;