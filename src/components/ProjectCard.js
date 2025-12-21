import React from "react";
import {Link} from 'react-router-dom';
import '../styles/projects.css';

const ProjectCard= ({project}) =>{
    const {title, description, tags, linkDetail, linkCode}= project;
    return(
        <article className="project-card">
            <h4>{title}</h4>
            <div className="tags">
                {tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                ))}
            </div>
            <p>{description}</p>
            <div className="card-actions">
                <Link to={linkDetail} className="btn primary-btn">
                    Technical Deep Dive
                </Link>
                <a 
                    href={linkCode}
                    className="btn secondary-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                        View Code
                </a>

            </div>
        </article>
    );
};

export default ProjectCard;