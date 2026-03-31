import React from"react";
import ProjectCard from '../components/ProjectCard.js';
import projectsData from '../data/projects';
import '../styles/projects.css';
import '../styles/global.css';

const HeroSection = () =>(
    <section className="hero-section">
        <div className="container">
            <h2>Data Science & Computer Science student at UC Berkeley</h2>
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

const HomePage=()=>{
    const projects= projectsData;
        
    return (
        <>
            <HeroSection />
            <hr />
            <section id="projects" className="projects-grid-section">
                <div className="container">
                    <h3> Featured Projects</h3>
                    <div className="project-grid">
                        {projects.map(project=>(
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </section>
            <hr />
            <SkillsSection />
        </>
    );
};

export default HomePage;
