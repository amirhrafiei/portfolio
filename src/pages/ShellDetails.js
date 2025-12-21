import React from 'react';
import {Link} from 'react-router-dom';
// import '../styles/global.css';
// import '../styles/projects.css';

const ShellDetails =() =>{
    
    return(
            <section id="shell-details" className="project-detail-page">
                    <div className="container">
                        <Link to="/" className="btn secondary-btn back-btn">
                            ← Back to All Projects
                        </Link>
                    <h2 className="detail-title"> Custom UNIX Shell (C++)</h2>
                    <p className="subtitle">A deep dive into process control, inter-process communication (IPC), and environment management on Linux.</p>
                    <div className="tags-list">
                        <span>C++17</span>
                        <span>UNIX</span>
                        <span>IPC (pipes)</span>
                        <span>Process Control</span>

                    </div>
                    <hr />
                    ### Architectural Overview
                    <p>This project functions as a custom command-line interpreter (CLI), replicating the core functionality of Bash/Zsh. The primary challenge was correctly handling execution context based on command type (built-in vs. external) and managing asynchronous child processes.</p>

                #### 1. Core Execution Loop
                <p>The shell continuously reads input using the `readline` library for history and completion. After parsing, a central dispatcher determines if the command is a **built-in** (executed in the parent process) or an **external executable** (executed via *forking*).</p>

                #### 2. Process Management & External Commands
                <p>All external commands (e.g., `ls`, `grep`) are executed by the following sequence:
                   <ol>
                    <li>**`fork()`**: Creates a child process.</li>
                    <li>**Redirection Setup**: If redirection ({`>`}, {`2>`}, etc.) is present, file descriptors are manipulated using `dup2()` in the child process.</li>
                    <li>**`execvp()`**: Replaces the child process image with the new program.</li>
                    <li>**`waitpid()`**: The parent process waits for the child to complete, preventing zombie processes.</li>
                   </ol>
                    </p>
                    #### 3. Inter-Process Communication (Piping)
                <p>Multi-stage pipelines (e.g., `cmd1 | cmd2 | cmd3`) required the most complex handling. A separate **pipe** (`pipe()`) is established between each pair of commands. In the child process executing `cmd1`, its standard output (`STDOUT_FILENO`) is redirected to the pipe's write end (`pipefd[1]`). The child executing `cmd2` redirects its standard input (`STDIN_FILENO`) to the pipe's read end (`pipefd[0]`). All unused pipe ends are rigorously closed to prevent deadlock.</p>

                #### 4. Built-in Commands vs. State
                <p>Commands that alter the shell's state (e.g., **`cd`** or **`history -w`**) are **MUST** be executed directly in the parent process. If they were executed in a child process, the changes (like changing the current working directory) would be lost when the child exits, leaving the parent shell unchanged.</p>

                <hr />

                ### Resources
                <div className="card-actions">
                    <a href="https://github.com" className="btn primary-btn" target="_blank" rel="noopener noreferrer">
                        Browse Source Code on Github
                    </a>
                    <a href="https://github.com" className="btn secondary-btn" target="_blank" rel="noopener noreferrer">
                        Live Demo
                    </a>
                </div>
             </div>

            </section>
    );
};

export default ShellDetails;