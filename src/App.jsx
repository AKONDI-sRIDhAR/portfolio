// src/App.jsx

import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  profilePhoto,
  nptelCertificates,
  otherCertificates,
  linkedinCertificates, // Kept from feat/portfolio-fixes
  achievementCertificates,
  quickhealCertificates,
  canvaDesigns, // Kept from main
  internCertificates, // Kept from main
} from "./constants/images.js";

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars = [];
    const numStars = 500;
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
      }));
    }

    function drawStars() {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      stars.forEach((star) => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
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

  return (
    <canvas
      ref={canvasRef}
      className="starfield"
      style={{ display: "block" }}
    ></canvas>
  );
}

function TermuxBanner() {
  return (
    <div className="termux-banner">
      <pre className="termux-ascii gradient-text">{`
  ███████╗██████╗ ██╗██████╗ ██╗  ██╗ █████╗ ██████╗ 
  ██╔════╝██╔══██╗██║██╔══██╗██║  ██║██╔══██╗██╔══██╗
  ███████╗██████╔╝██║██║  ██║███████║███████║██████╔╝
  ╚════██║██╔══██╗██║██║  ██║██╔══██║██╔══██║██╔══██╗
  ███████║██║  ██║██║██████╔╝██║  ██║██║  ██║██║  ██║
  ╚══════╝╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
      `}</pre>
      <div className="termux-info">
        Welcome to <span className="sridhar-text">SRIDHAR</span>'s Terminal
        Portfolio v1.0
      </div>
      <div className="termux-help">
        Type 'help' to see available commands: ls, whoami, cat [filename],
        clear
      </div>
    </div>
  );
}

// Merged CertificateScroller function with onImageClick from 'main'
function CertificateScroller({ images, title, onImageClick }) {
  const scrollerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const container = containerRef.current;
    if (!scroller || !container) return;

    let animationFrame;
    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;
      
      if (position < -scroller.scrollWidth / 2) {
        position = 0;
      }

      scroller.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="certificate-scroller-container" ref={containerRef}>
      <h3>{title}</h3>
      <div className="certificate-scroller-wrapper">
        <div className="certificate-scroller" ref={scrollerRef}>
          {images.map((image, i) => (
            <div key={i} className="certificate-item">
              <div className="certificate-image">
                <img
                  src={image}
                  alt={`${title} Certificate ${i + 1}`}
                  onClick={() => onImageClick(image)} // Retained onClick
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="certificate-fallback">
                  {title} {i + 1}
                </div>
              </div>
            </div>
          ))}
          {images.map((image, i) => (
            <div key={`dup-${i}`} className="certificate-item">
              <div className="certificate-image">
                <img
                  src={image}
                  alt={`${title} Certificate ${i + 1}`}
                  onClick={() => onImageClick(image)} // Retained onClick
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="certificate-fallback">
                  {title} {i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TerminalSimulation() {
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const commandResponses = {
    ls: "aboutme.txt alma_matter.txt internships.txt skills.txt projects.txt contact.txt achievements.txt certificates.txt languages.txt softskills.txt",
    whoami: "akondi_sridhar",
    "cat aboutme.txt":
      "Cyber Security Analyst and software developer with a passion for ethical hacking and innovative projects. Leading teams and building IoT and security tools while studying B.Tech CSE at Manav Rachna University.",
    "cat alma_matter.txt":
      "Final-year B.Tech CSE student at Manav Rachna University, CGPA 8.2/10.0 (6 semester avg), and 7th-12th class graduate from Sri Chaitanya School (2017-2022).",
    "cat internships.txt":
      "1. Engineers World Pvt Limited – Cyber Security Analyst (11/2024 - 07/2025)\n2. Luxe By Kan – Shopify Web Design & Development Intern (07/2025 - 08/2025)\n3. Blue Planet Solutions Pvt Limited – CSR Intern (05/2024 - 06/2024)\n4. Intrainz – Cyber Security Trainee (10/2023 - 12/2023)",
    "cat skills.txt":
      "Pentesting & Security Tools: Burp Suite, Metasploit, ZAP, Wireshark, OWASP ZAP, OSINT tools, VAPT, Phishing Analysis\nForensics & Analysis: Autopsy, FTK Imager, Volatility\nLanguages: Java, Python, C, SQL, HTML\nEnvironments: Kali Linux, Parrot OS, Windows\nOther: Canva (video/photo editing), Shopify, Tinkercad, Data Entry",
    "cat achievements.txt":
      "- Served as Vice-President and ISR Coordinator at Dr. OP Bhalla Foundation\n- Balanced 8.2 CGPA with multiple internships and leadership roles\n- Received LOA from Dr. OP Bhalla Foundation\n- Completed 4 internships\n- Received ₹37,000 from university to develop an IoT project\n- Participated in NASA Space Settlement Contest",
    "cat projects.txt":
      "- Smart Parking with Route Mapping (Prototype)\n- Phishing Awareness App (Ongoing)\n- FortiCheck\n- Email Header Analyzer\n- Phish Detector\n- Attendance Management System",
    "cat contact.txt":
      "Email: akondisridhar@gmail.com\nLinkedIn: https://www.linkedin.com/in/akondi-sridhar-43b85a250\nGitHub: https://github.com/AKONDI-sRIDhAR/",
    "cat certificates.txt":
      "1. LinkedIn Certifications\n2. NPTEL Swayam\n3. Google Coursera\n4. Infosys Springboard\n5. Cisco Networking\n6. Quick Heal Certification",
    "cat languages.txt": "Telugu - Native\nEnglish - Fluent\nHindi - Intermediate\nSpanish - Basic",
    "cat softskills.txt":
      "Leadership\nTeamwork and Collaboration\nProblem-Solving\nAdaptability\nTime Management",
    help: "Available commands:\n- ls: List files\n- whoami: Display current user\n- cat [filename]: Display file contents\n- clear: Clear terminal\n- help: Show this help message\n- nmap sridhar: Scan for open roles\n- uname -a: Display system details\n- ifconfig: Network interface information\n- ping: Check connectivity\n- whois sridhar: Get registrar information\n- history: Show command history",
    "nmap sridhar": `Starting Nmap 7.94 ( https://nmap.org ) at 2025-09-17 12:00 IST
Nmap scan report for sridhar (127.0.0.1)
Host is up (0.00021s latency).
Not shown: 991 closed tcp ports (reset)
PORT      STATE SERVICE      VERSION
22/tcp    open  ssh          OpenSSH 8.9p1 (Penetration Tester)
53/tcp    open  domain       DNS (Security Analyst)
80/tcp    open  http         nginx 1.18.0 (Shopify / Ai Web designer)
443/tcp   open  ssl/https    nginx 1.18.0 (Secure Developer)
8080/tcp  open  http-proxy   nginx 1.18.0 (Associate Software Engineer)
9000/tcp  open  cslistener   Canva Designer(photo/video)
25/tcp    open  smtp         Postfix SMTP (Email Analyst)
139/tcp   open  netbios-ssn  Samba (Network Administrator)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.15 seconds`,
    "uname -a":
      "Kali Sridhar 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.1.46-1 (2023-10-13) x86_64 GNU/Linux",
    ifconfig: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.108  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 ae80::b00:27cf:de4e:26a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 128766  bytes 169382491 (161.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 75216  bytes 5772597 (5.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 245  bytes 20428 (19.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 245  bytes 20428 (19.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`,
    ipconfig: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.108  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 ae80::b00:27cf:de4e:26a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 128766  bytes 169382491 (161.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 75216  bytes 5772597 (5.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 245  bytes 20428 (19.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 245  bytes 20428 (19.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`,
    "ping -c 4 google.com": `PING google.com (142.251.42.206) 56(84) bytes of data.
64 bytes from bom12s18-in-f14.1e100.net (142.251.42.206): icmp_seq=1 ttl=116 time=12.8 ms
64 bytes from bom12s18-in-f14.1e100.net (142.251.42.206): icmp_seq=2 ttl=116 time=13.2 ms
64 bytes from bom12s18-in-f14.1e100.net (142.251.42.206): icmp_seq=3 ttl=116 time=12.9 ms
64 bytes from bom12s18-in-f14.1e100.net (142.251.42.206): icmp_seq=4 ttl=116 time=13.5 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
rtt min/avg/max/mdev = 12.837/13.127/13.542/0.277 ms`,
    "whois sridhar": `[Querying whois.verisign-grs.com]
[Redirected to whois.publicinterestregistry.org]
[Querying whois.publicinterestregistry.org]
[whois.publicinterestregistry.org]

Domain Name: SRIDHAR
Registry Domain ID: D12345-PIR
Registrar WHOIS Server: whois.godaddy.com
Registrar URL: http://www.godaddy.com
Updated Date: 2023-05-17T10:15:23Z
Creation Date: 2004-10-17T18:25:43Z
Registry Expiry Date: 2030-10-17T18:25:43Z
Registrar: GoDaddy.com, LLC

Registrant Name: Akondi Naga Sri Sai Datta Sridhar
Registrant Organization: DontknowDontCare


Name Server: NS1.SRIDHARSECURITY.COM
Name Server: NS2.SRIDHARSECURITY.COM

DNSSEC: unsigned

>>> Last update of WHOIS database: 2025-09-17T12:05:23Z <<<`,
    history: `    1  ls
    2  whoami
    3  cat aboutme.txt
    4  nmap sridhar
    5  uname -a
    6  ifconfig
    7  ping -c 4 google.com
    8  whois sridhar
    9  history`,
    clear: "",
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newCommand = inputValue.trim();
    let response = "Command not found. Type 'help' for available commands.";

    if (commandResponses[newCommand] !== undefined) {
      response = commandResponses[newCommand];

      if (newCommand === "clear") {
        setCommandHistory([]);
        setInputValue("");
        setShowBanner(true);
        return;
      }
    }

    setCommandHistory((prev) => [...prev, { command: newCommand, response }]);
    setInputValue("");
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">sridhar@kali: ~</div>
      </div>
      <div className="terminal-content" ref={terminalRef} onClick={focusInput}>
        {showBanner && <TermuxBanner />}

        {commandHistory.map((cmd, index) => (
          <div key={index} className="command-block">
            <div className="command-line">
              <span className="prompt">sridhar@kali:~$ </span>
              <span className="command">{cmd.command}</span>
            </div>
            {cmd.response && (
              <div className="command-output">{cmd.response}</div>
            )}
          </div>
        ))}

        <div className="command-block">
          <div className="command-line">
            <span className="prompt">sridhar@kali:~$ </span>
            <form onSubmit={handleCommandSubmit} className="command-form">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="command-input"
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  // Updated resume redirect link
  const resumeLink = "https://drive.google.com/drive/u/0/folders/12Xg1wutDKQDCJDBgLMgCBXhYlRYbCSvO";

  return (
    <section id="contact" className="content-section">
      <h2>Contact Me</h2>
      <div className="contact-grid">
        <a href="mailto:akondisridhar@gmail.com" className="contact-card card">
          <div className="contact-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#00ffae">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <h3>Email</h3>
          <p>akondisridhar@gmail.com</p>
        </a>

        <a
          href="https://github.com/AKONDI-sRIDhAR"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card card"
        >
          <div className="contact-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#00ffae">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <h3>GitHub</h3>
          <p>AKONDI-sRIDhAR</p>
        </a>

        <a
          href="https://www.linkedin.com/in/akondi-sridhar-43b85a250"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card card"
        >
          <div className="contact-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#00ffae">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <h3>LinkedIn</h3>
          <p>akondi-sridhar</p>
        </a>

        <a
          href="https://x.com/Sridhar_akondi"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card card"
        >
          <div className="contact-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#00ffae">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <h3>Twitter / X</h3>
          <p>@Sridhar_akondi</p>
        </a>

        <a
          href={resumeLink} 
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card card"
        >
          <div className="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <h3>Resume</h3>
          <p>Download</p>
        </a>
      </div>
    </section>
  );
}

// Merged Footer function (using the cleaner 'main' version)
function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-text">
          <span className="copyright">© 2025 श्रीdhaर् Akondi. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

// ImageModal function from 'main' (essential for certificate viewing)
function ImageModal({ imageSrc, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageSrc) {
      setImageLoaded(false);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Re-enable body scrolling when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [imageSrc]);

  if (!imageSrc) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.error('Failed to load image:', imageSrc);
    // You could set a state to show an error message
  };

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>
          &times;
        </button>
        {!imageLoaded && (
          <div style={{
            color: '#00ffae', 
            padding: '20px', 
            textAlign: 'center'
          }}>
            Loading image...
          </div>
        )}
        <img 
          src={imageSrc} 
          alt="Full-size view" 
          className="modal-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
}

function App() {
  const [hoverText, setHoverText] = useState(false);
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State for modal

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Internship data with corresponding certificate images (from main)
  const internships = [
    {
      title: "Engineers World Pvt Limited (11/2024 - 07/2025)",
      description:
        "Cyber Security Analyst, conducting vulnerability assessments and penetration tests, identifying issues, and leading the EW CTF project while mentoring juniors.",
      certificate: internCertificates[0], // EW.png
      alt: "Engineers World Certificate",
    },
    {
      title: "Luxe By Kan (07/2025 - 08/2025)",
      description:
        "Shopify Web Design & Development Intern, improved UI/UX with animations and achieved a 100 in Search Engine Optimization.",
      certificate: internCertificates[1], // lbk.png
      alt: "Luxe By Kan Certificate",
    },
    {
      title: "Blue Planet Solutions Pvt Limited (05/2024 - 06/2024)",
      description:
        "CSR Intern, supported social responsibility initiatives with AICTE and assisted in developing the CJN collaboration platform.",
      certificate: internCertificates[2], // blue.png
      alt: "Blue Planet Solutions Certificate",
    },
    {
      title: "Intrainz (10/2023 - 12/2023)",
      description:
        "Cyber Security Trainee, gained foundational experience with tools like Nmap and Tor, completing introductory labs and documentation tasks.",
      certificate: internCertificates[3], // intrainz.png
      alt: "Intrainz Certificate",
    },
  ];

  return (
    <React.Fragment>
      <Starfield />

      <header
        className={`main-header ${isScrolled ? "scrolled" : ""}`}
        ref={headerRef}
      >
        <div className="header-line"></div>
        <nav className="header-nav">
          <a href="#terminal">Terminal</a>
          <a href="#about">About</a>
          <a href="#internships">Internships</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#achievements">Achievements</a>
          <a href="#certifications">Certifications</a>
          <a href="#canva-designs">Canva Designs</a> {/* Added from main */}
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div className="container">
        <section id="terminal" className="content-section">
          <TerminalSimulation />
        </section>

        <section id="about" className="content-section">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Yo! I'm Akondi Naga Sri Sai Datta Sridhar, a cybersecurity buff
                and coder who loves hacking threats and building cool tech! A
                B.Tech CSE champ at Manav Rachna University (8.4 CGPA), I've
                rocked 4 internships, served as Vice President at Dr. OP Bhalla
                Foundation Student Council, and geek out as an AI enthusiast and
                fitness buff—using AI to streamline my daily grind!
              </p>
            </div>
            <div className="profile-photo">
              <div
                className="photo-placeholder"
                onMouseEnter={() => setHoverText(true)}
                onMouseLeave={() => setHoverText(false)}
              >
                <img
                  src={profilePhoto}
                  alt="Sridhar"
                  className="profile-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="profile-fallback">
                  <span>SR</span>
                </div>
                {hoverText && (
                  <div className="hover-text">
                    You will call me <span className="gradient-text">SRIDHAR</span>!
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="internships" className="content-section">
          <h2>Internships</h2>
          <div className="internships-grid">
            {/* Merged internships rendering logic (using the data array from main) */}
            {internships.map((internship, index) => (
              <div key={index} className="internship-item">
                <h3>{internship.title}</h3>
                <p>{internship.description}</p>
                {/* Image overlay with click handler from main */}
                <div className="certificate-image-overlay">
                  <img
                    src={internship.certificate}
                    alt={internship.alt}
                    onClick={() => handleImageClick(internship.certificate)}
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="certificate-fallback">
                    {internship.alt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="content-section">
          <h2>Projects</h2>
          <div className="projects-grid">
            {/* 1. Crisp Talent Spotter (UPDATED) */}
            <div className="project-card card">
              <h3>Crisp Talent Spotter</h3>
              <p>
                AI Technical Interview Platform CRISP (Candidate Research & Intelligent Screening Platform) is a modern web application designed to revolutionize the technical hiring process.
                <a href="https://github.com/AKONDI-sRIDhAR/crisp-talent-spotter" target="_blank" rel="noopener noreferrer"> View on GitHub</a>
              </p>
            </div>
            {/* 2. Email Header Analyzer (KEPT SAME) */}
            <div className="project-card card">
              <h3>Email Header Analyzer</h3>
              <p>
                A Java tool analyzing .eml files for SPF, DKIM, and DMARC to
                ensure email authenticity.
              </p>
            </div>
            {/* 3. Pyscreener (UPDATED) */}
            <div className="project-card card">
              <h3>Pyscreener</h3>
              <p>
                This uses Mediapipe for hand tracking and a Tkinter overlay for visual feedback. Key features include: Open Hand: Activates the snipping tool.
                <a href="https://github.com/AKONDI-sRIDhAR/pyscreener" target="_blank" rel="noopener noreferrer"> View on GitHub</a>
              </p>
            </div>
            {/* 4. Lets get you into bed (UPDATED) */}
            <div className="project-card card">
              <h3>Lets get you into bed</h3>
              <p>
                Let's Get You Into Bed 🌙 A cozy bedtime stories site with daily AI-generated tales for kids (4-10). Features witty Akbar-Birbal or Tenali Ramakrishna stories, automated via n8n and updated daily.
                <a href="https://lets-get-you-into-bed.vercel.app/" target="_blank" rel="noopener noreferrer"> View Live</a>
              </p>
            </div>
            {/* 5. Smart Parking with Route Mapping (KEPT SAME) */}
            <div className="project-card card">
              <h3>Smart Parking with Route Mapping (Prototype)</h3>
              <p>
                Developed an IoT-enabled parking optimization system with ₹37,000
                funding from the university.
              </p>
            </div>
            {/* 6. Phish Detector (KEPT SAME) */}
            <div className="project-card card">
              <h3>Phish Detector</h3>
              <p>
                A dataset-driven classifier for detecting spam and phishing
                emails using machine learning.
              </p>
            </div>
            {/* Retained FortiCheck and Personal Portfolio as they were not explicitly removed */}
            <div className="project-card card">
              <h3>Personal Portfolio</h3>
              <p>The site you're exploring right now, showcasing my skills and projects with a terminal-inspired design.</p>
            </div>
            <div className="project-card card">
                 <h3>FortiCheck</h3>
                 <p>A Java-based tool for user authentication, AES encryption, and file integrity verification.</p>
            </div>
          </div>
        </section>

        <section id="skills" className="content-section">
          <h2>Skills</h2>
          {/* Skills section structure is identical, no merge needed here. */}
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Soft Skills</h3>
              <p>
                • Leadership • Communication
                <br />
                • Teamwork & Collaboration <br />• Problem-Solving <br />• Time
                Management <br />• Attention to Detail
              </p>
            </div>
            <div className="skill-category">
              <h3>Programming Languages</h3>
              <p>
                • Java
                <br /> • C<br /> • Python<br /> • SQL<br /> • HTML<br />{" "}
              </p>
            </div>
            <div className="skill-category">
              <h3>Tools & Environments</h3>
              <p>
                • Windows • Linux <br />• Git/GitHub • Canva<br /> • Shopify •
                Tinkercad <br />• Ai tools <br />• Lovable, Gemini, Grok, etc
              </p>
            </div>
            <div className="skill-category full-width">
              <h3>Cybersecurity</h3>
              <p>
                • Burp Suite • Metasploit • Wireshark • OWASP ZAP • OSINT tools
                • VAPT • Autopsy
                <br />
                • FTK Imager • Volatility • Malware Analysis • Threat
                Intelligence • Incident Response <br />• Regulatory Compliance
                (GDPR, HIPAA) • Computer Networks • DBMS • Operating Systems
              </p>
            </div>
          </div>
        </section>

        <section id="achievements" className="content-section">
          <h2>Achievements</h2>
          {/* Achievements section structure is identical, no merge needed here. */}
          <div className="achievements-grid">
            <div className="achievement-card card">
              <h3>Academics</h3>
              <p>
                Balanced 8.2 CGPA with multiple internships and leadership roles
              </p>
            </div>
            <div className="achievement-card card">
              <h3>Recognition</h3>
              <p>
                Served as Vice-President and ISR Coordinator & Received LOA from
                Dr. OP Bhalla Foundation
              </p>
            </div>
            <div className="achievement-card card">
              <h3>Project Funding</h3>
              <p>
                Received ₹37,000 from university to develop an IoT project
              </p>
            </div>
            <div className="achievement-card card">
              <h3>International Participation</h3>
              <p>Participated in NASA Space Settlement Contest</p>
            </div>
          </div>
        </section>

        <section id="certifications" className="content-section">
          <h2>Certifications</h2>
          <div className="nptel-certificates">
            <h3>NPTEL Certificates</h3>
            <div className="nptel-grid">
              {nptelCertificates.map((image, i) => (
                <div key={i} className="nptel-item">
                  <div className="certificate-image">
                    <img
                      src={image}
                      alt={`NPTEL Certificate ${i + 1}`}
                      onClick={() => handleImageClick(image)} // Added click handler
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="certificate-fallback">
                      NPTEL {i + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Merged CertificateScrollers (Kept LinkedIn from feat/portfolio-fixes) */}
          <CertificateScroller
            images={otherCertificates}
            title="Other Certificates"
            onImageClick={handleImageClick}
          />
          <CertificateScroller 
            images={linkedinCertificates} 
            title="LinkedIn Certificates" 
            onImageClick={handleImageClick}
          />
          <CertificateScroller
            images={achievementCertificates}
            title="Achievement Certificates"
            onImageClick={handleImageClick}
          />
          <CertificateScroller
            images={quickhealCertificates}
            title="Quick Heal Certificates"
            onImageClick={handleImageClick}
          />
        </section>

        {/* Added Canva Designs section from main */}
        <section id="canva-designs" className="content-section">
          <CertificateScroller
            images={canvaDesigns}
            title="Canva Designs"
            onImageClick={handleImageClick}
          />
        </section>
        
        <ContactSection />
      </div>

      <Footer />
      {/* Added ImageModal component from main for viewing certificates */}
      <ImageModal imageSrc={selectedImage} onClose={handleCloseModal} />
    </React.Fragment>
  );
}

export default App;