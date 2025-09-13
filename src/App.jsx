import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars = [];
    const numStars = 300;
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.8 + 0.2,
      }));
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    drawStars();
    window.addEventListener("resize", resizeCanvas);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield"></canvas>;
}

function TypingText({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className="typing">{displayed}</span>;
}

function App() {
  const summaryText = `I build tools and solutions around cybersecurity — phishing detectors, email header analyzers, and VAPT tooling. Passionate about ethical hacking, threat analysis, and mentoring peers. Outside of tech, I love hitting the gym, biking, and community projects.`;

  return (
    <>
      <Starfield />
      <div className="container">
        <header className="main-header">
          <div className="header-left">
            <h1 className="name">Akondi Naga Sri Sai Datta Sridhar</h1>
            <p className="subtitle">Pentester / Aspiring Software Developer</p>
            <p className="summary-text">
              <TypingText text={summaryText} />
            </p>
          </div>
          <div className="header-right">
            <div className="profile-photo-placeholder">
              {/* Replace with your actual image */}
              <span>Profile Photo</span>
            </div>
            <div className="contacts">
              <a href="mailto:your@email.com">📧 your@email.com</a>
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer">🔗 LinkedIn</a>
              <a href="https://github.com/yourgithub" target="_blank" rel="noreferrer">💻 GitHub</a>
              <span>📱 +91-XXXXXXXXXX</span>
            </div>
          </div>
        </header>

        <div className="cards-grid">
          <section className="card">
            <h2>Technical Skills</h2>
            <p>Java • Python • C • SQL • VAPT • Penetration Testing • Threat Analysis</p>
          </section>

          <section className="card">
            <h2>Experience & Internships</h2>
            <p>
              Worked on cybersecurity projects including VAPT assessments and phishing detection tools. 
              Collaborated with teams on building secure applications and analyzing threats.
            </p>
          </section>

          <section className="card">
            <h2>Projects</h2>
            <p>Phishing app, Smart Parking prototype, FortiCheck, and more.</p>
          </section>

          <section className="card">
            <h2>Achievements</h2>
            <p>Awarded for ethical hacking challenge, certified in cybersecurity fundamentals.</p>
          </section>
        </div>

        <section className="contact-card card">
          <h2>Contact Me</h2>
          <div className="contact-details">
            <a href="mailto:your@email.com">📧 your@email.com</a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer">🔗 LinkedIn</a>
            <a href="https://github.com/yourgithub" target="_blank" rel="noreferrer">💻 GitHub</a>
            <span>📱 +91-XXXXXXXXXX</span>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;