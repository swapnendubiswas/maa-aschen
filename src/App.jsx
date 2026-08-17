import { useEffect, useRef, useState } from "react";
import pujaData from "./data/pujaData";


const pujaParticles = [
  "🌸", "✿", "🌺", "🪷", "🪔", "🌸", "✦", "🌺",
  "🪔", "✿", "🌸", "🪷", "🌺", "✦", "🪔", "🌸",
  "✿", "🌺", "🪔", "🌸", "🪷", "✦"
];

function App() {
  const targetDate = new Date("2026-10-10T00:00:00");

  const calculateCountdown = () => {
    const difference = targetDate - new Date();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [time, setTime] = useState(calculateCountdown());
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const dhakAudioRef = useRef(null);

  const playDhak = () => {
    const audio = dhakAudioRef.current;

    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 0.65;

    audio.play().catch(() => {
      // Browser audio requires a user gesture.
    });
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => {
      revealObserver.observe(section);
      activeObserver.observe(section);
    });

    // Safety fallback for hash navigation / delayed browser rendering.
    const revealVisibleSections = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (
          rect.top < window.innerHeight &&
          rect.bottom > 0
        ) {
          section.classList.add("is-visible");
        }
      });
    };

    requestAnimationFrame(revealVisibleSections);
    const revealFallback = setTimeout(
      revealVisibleSections,
      250
    );

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
      clearTimeout(revealFallback);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-mark">
            <div className="loading-symbol">ॐ</div>
            <div className="loading-glow"></div>
          </div>

          <h1>মা আসছেন</h1>
          <p>শারদীয়া দুর্গোৎসব</p>

          <div className="loading-line">
            <span></span>
          </div>
        </div>
      )}

      <main className="home">

      <div className="puja-rain" aria-hidden="true">
        {pujaParticles.map((particle, index) => (
          <span
            className="puja-particle"
            key={`${particle}-${index}`}
            style={{
              "--fall-left": `${(index * 17 + 4) % 96}%`,
              "--fall-delay": `${(index % 8) * -1.1}s`,
              "--fall-duration": `${8 + (index % 5)}s`,
              "--fall-size": `${12 + (index % 4) * 3}px`,
              "--fall-drift": `${index % 2 === 0 ? 1 : -1}`,
            }}
          >
            {particle}
          </span>
        ))}
      </div>

      <div className="puja-float puja-float-one" aria-hidden="true">✦</div>
      <div className="puja-float puja-float-two" aria-hidden="true">🪔</div>
      <div className="puja-float puja-float-three" aria-hidden="true">✦</div>
      <div className="puja-float-four" aria-hidden="true">✿</div>
      <div className="puja-float-five" aria-hidden="true">✦</div>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">

          <div className="logo-symbol">
            ॐ
          </div>

          <div>
            <h2>মা আসছেন</h2>
            <p>শারদীয়া দুর্গোৎসব</p>
          </div>

        </div>


        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="মেনু খুলুন"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>

          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            হোম
          </a>

          <a
            href="#calendar"
            className={activeSection === "calendar" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            দিনপঞ্জী
          </a>

          <a
            href="#about"
            className={activeSection === "about" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            পুজোর কথা
          </a>

          <a
            href="#facts"
            className={activeSection === "facts" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            জানেন কি?
          </a>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section
        className="hero reveal-section"
        id="home"
      >

        <div className="hero-content">

          <p className="festival-year">
            ✦ শারদীয়া দুর্গোৎসব ১৪৩৩ ✦
          </p>


          <h1>
            মা <span>আসছেন</span>
          </h1>


          <p className="subtitle">
            মায়ের আগমনের অপেক্ষায়...
          </p>


          <div className="gold-line">
            ───────── ◆ ─────────
          </div>


          <p className="countdown-title">
            মহালয়া আসতে বাকি
          </p>


          <div className="countdown">

            <TimeBox
              value={time.days}
              label="দিন"
            />

            <span className="separator">
              :
            </span>

            <TimeBox
              value={time.hours}
              label="ঘণ্টা"
            />

            <span className="separator">
              :
            </span>

            <TimeBox
              value={time.minutes}
              label="মিনিট"
            />

            <span className="separator">
              :
            </span>

            <TimeBox
              value={time.seconds}
              label="সেকেন্ড"
            />

          </div>


          <button className="reminder">
            🔔 পুজোর কথা মনে করিয়ে দিন
          </button>

          <button
            className="dhak-button"
            onClick={playDhak}
            aria-label="ঢাকের শব্দ শুনুন"
            title="ঢাক বাজান"
          >
            🥁 <span>ঢাক বাজুক</span>
          </button>

          <audio
            ref={dhakAudioRef}
            src="/audio/dhak.mp3"
            preload="auto"
          />

        </div>

      </section>


      {/* ================= PUJA CALENDAR ================= */}

      <section
        className="calendar-section reveal-section"
        id="calendar"
      >

        <div className="section-heading">

          <span>
            ✦
          </span>

          <h2>
            পুজোর দিনপঞ্জী
          </h2>

          <p>
            প্রতিটি দিনের বিশেষ আচার ও গুরুত্বপূর্ণ তথ্য জানতে কার্ডে ক্লিক করুন
          </p>

        </div>


        <div className="festival-grid">

          {pujaData.map((puja, index) => (
            <FestivalCard
              key={puja.id}
              {...puja}
              featured={index === 3}
            />
          ))}

        </div>

      </section>


      {/* ================= PUJOR KOTHA ================= */}

      <section
        className="about-section reveal-section"
        id="about"
      >

        <div className="about-glow"></div>

        <div className="about-content">

          <span className="about-label">
            ✦ শারদীয়া অনুভূতি ✦
          </span>


          <h2>
            শিউলির গন্ধে,
            <br />

            <span>
              কাশফুলের দোলায়...
            </span>

          </h2>


          <div className="about-divider">
            ◆
          </div>


          <p className="about-quote">
            “ঢাকের তালে, ধূপের গন্ধে,
            শরতের নীল আকাশে—
            আবারও ফিরছে সেই চেনা আনন্দ।”
          </p>


          <p className="about-text">
            বছর ঘুরে আবার এসেছে সেই অপেক্ষার সময়।
            চারপাশে কাশফুল, ভোরের শিউলি আর
            দূর থেকে ভেসে আসা ঢাকের আওয়াজ—
            সবকিছু যেন একটাই কথা বলে,
          </p>


          <h3>
            মা আসছেন... 🪔
          </h3>

        </div>

      </section>


      {/* ================= JANE KI ================= */}

      <section
        className="facts-section reveal-section"
        id="facts"
      >

        <div className="section-heading">

          <span>
            ✦
          </span>

          <h2>
            জানেন কি?
          </h2>

          <p>
            দুর্গাপূজার কিছু গল্প, ঐতিহ্য ও অজানা তথ্য
          </p>

        </div>


        <div className="facts-grid">

          {pujaFacts.map((fact) => (
            <FactCard
              key={fact.id}
              {...fact}
            />
          ))}

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">

          <div className="footer-symbol">
            ॐ
          </div>


          <div>

            <strong>
              মা আসছেন
            </strong>

            <small>
              শারদীয়া দুর্গোৎসব ২০২৬
            </small>

          </div>

        </div>


        <div className="footer-divider">
          ✦ <span>শুভ শারদীয়া</span> ✦
        </div>

        <p className="footer-message">
          মায়ের আশীর্বাদে ভরে উঠুক প্রতিটি ঘর।
        </p>

        <span className="copyright">
          © ২০২৬ · স্বপ্নেন্দু
        </span>

      </footer>

    </main>
    </>
  );
}


/* ================= COUNTDOWN BOX ================= */

function TimeBox({ value, label }) {

  return (
    <div className="time-box">

      <strong>
        {String(value).padStart(2, "0")}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}


/* ================= FLIP FESTIVAL CARD ================= */

function FestivalCard({
  icon,
  title,
  date,
  description,
  special,
  timing,
  featured = false,
}) {

  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setFlipped((current) => !current);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 780);
  };

  return (
    <div
      className={`festival-card-wrapper ${
        flipped ? "is-flipped" : ""
      } ${isAnimating ? "is-animating" : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} বিস্তারিত দেখুন`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >

      <div className="festival-card-inner">


        {/* ================= FRONT ================= */}

        <div
          className={`festival-card festival-card-front ${
            featured ? "featured" : ""
          }`}
        >

          <div className="festival-icon">
            {icon}
          </div>


          <h3>
            {title}
          </h3>


          <div className="festival-date">
            {date}
          </div>


          <p>
            {description}
          </p>


          <div className="card-line"></div>


          <span className="flip-hint">
            বিস্তারিত দেখতে ক্লিক করুন ↻
          </span>

        </div>


        {/* ================= BACK ================= */}

        <div className="festival-card festival-card-back">

          <div className="back-icon">
            {icon}
          </div>


          <h3>
            {title}
          </h3>


          <div className="back-date">
            {date}
          </div>


          <div className="details-title">
            ✦ বিশেষ আচার
          </div>


          <ul>

            {special.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}

          </ul>


          <div className="puja-time">

            <span>
              🕐
            </span>

            {timing}

          </div>


          <span className="flip-hint">
            আবার দেখতে ক্লিক করুন ↻
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   PUJA FACTS
========================================================= */

const pujaFacts = [

  {
    id: "mahalaya",

    icon: "🪔",

    title: "মহালয়া",

    short:
      "পিতৃপক্ষের সমাপ্তি ও দেবীপক্ষের সূচনার দিন।",

    details: [
      "মহালয়ার মাধ্যমে পিতৃপক্ষের সমাপ্তি এবং দেবীপক্ষের সূচনা হয়।",

      "এই দিনে বহু মানুষ পূর্বপুরুষদের উদ্দেশ্যে তর্পণ করেন।",

      "ভোরে চণ্ডীপাঠ ও মহিষাসুরমর্দিনীর বাণী শোনার সঙ্গে বাঙালির মহালয়ার একটি বিশেষ সাংস্কৃতিক যোগ রয়েছে।",

      "মহালয়া থেকেই অনেকের মনে দুর্গাপূজার আনুষ্ঠানিক অপেক্ষা শুরু হয়ে যায়।",
    ],
  },


  {
    id: "shashthi",

    icon: "🌺",

    title: "ষষ্ঠী",

    short:
      "মায়ের বোধন, আমন্ত্রণ ও অধিবাসের গুরুত্বপূর্ণ দিন।",

    details: [
      "ষষ্ঠীর সঙ্গে দুর্গাপূজার মূল উৎসবের আনুষ্ঠানিক সূচনা জড়িয়ে আছে।",

      "বোধনের মাধ্যমে দেবীকে জাগ্রত ও আহ্বান করার আচার পালিত হয়।",

      "আমন্ত্রণ ও অধিবাসের মাধ্যমে পূজার আচার আরও সম্পূর্ণ রূপ পায়।",

      "২০২৬ সালে ষষ্ঠীর গুরুত্বপূর্ণ আচার ১৬ ও ১৭ অক্টোবরের মধ্যে বিস্তৃত।",
    ],
  },


  {
    id: "nabapatrika",

    icon: "🌿",

    title: "নবপত্রিকা",

    short:
      "নয়টি উদ্ভিদকে একত্র করে তৈরি হয় নবপত্রিকা।",

    details: [
      "নবপত্রিকায় নয়টি উদ্ভিদ একত্র করা হয়।",

      "প্রচলিতভাবে এগুলিকে নয়টি দেবীর প্রতীকী রূপ হিসেবে বিবেচনা করা হয়।",

      "নবপত্রিকাকে সাদা-লাল পাড়ের শাড়ি পরিয়ে বধূরূপ দেওয়ার প্রথা রয়েছে।",

      "বাংলায় নবপত্রিকাকে অনেক সময় 'কলাবউ' নামেও ডাকা হয়।",
    ],

    plants: [
      ["কদলী / কলা", "ব্রহ্মাণী"],
      ["কচু", "কালিকা"],
      ["হরিদ্রা / হলুদ", "উমা"],
      ["জয়ন্তী", "কার্তিকী"],
      ["বিল্ব / বেল", "শিবা"],
      ["দাড়িম / ডালিম", "রক্তদন্তিকা"],
      ["অশোক", "শোকরহিতা"],
      ["মানকচু", "চামুণ্ডা"],
      ["ধান", "লক্ষ্মী"],
    ],
  },


  {
    id: "ashtami",

    icon: "🪷",

    title: "অষ্টমী",

    short:
      "মহাষ্টমী, অঞ্জলি ও সন্ধিপূজার জন্য বিশেষ গুরুত্বপূর্ণ।",

    details: [
      "মহাষ্টমী দুর্গাপূজার অন্যতম গুরুত্বপূর্ণ দিন।",

      "এই দিনে পুষ্পাঞ্জলি দেওয়া বাঙালির দুর্গাপূজার অন্যতম পরিচিত ঐতিহ্য।",

      "অনেক পূজায় কুমারী পূজাও অষ্টমীর সঙ্গে যুক্ত থাকে।",

      "অষ্টমী ও নবমীর সন্ধিক্ষণে সন্ধিপূজা অনুষ্ঠিত হয়।",

      "সন্ধিপূজার প্রচলিত সময়কাল ৪৮ মিনিট।",
    ],
  },


  {
    id: "navami",

    icon: "🥁",

    title: "নবমী",

    short:
      "মহানবমী, পূজা, হোম ও আরতির অন্যতম গুরুত্বপূর্ণ দিন।",

    details: [
      "মহানবমী দুর্গাপূজার শেষ পূর্ণাঙ্গ পূজার দিন হিসেবে বিশেষ গুরুত্ব বহন করে।",

      "এই দিনে বিশেষ পূজা ও আরতি অনুষ্ঠিত হয়।",

      "অনেক পূজায় নবমীর সঙ্গে হোম বা যজ্ঞের আচার যুক্ত থাকে।",

      "নবমীর পরেই আসে বিজয়া দশমীর আবেগঘন বিদায়ের সময়।",
    ],
  },


  {
    id: "dashami",

    icon: "🌹",

    title: "বিজয়া দশমী",

    short:
      "সিঁদুর খেলা, বিজয়ার শুভেচ্ছা ও বিসর্জনের দিন।",

    details: [
      "বিজয়া দশমী দুর্গাপূজার সমাপ্তির দিন।",

      "বাঙালি সমাজে সিঁদুর খেলা একটি পরিচিত ঐতিহ্য।",

      "এরপর দেবীর বিসর্জনের মাধ্যমে মায়ের বিদায় সম্পন্ন হয়।",

      "বিসর্জনের সময় উচ্চারিত 'আসছে বছর আবার হবে' কথাটির মধ্যে পরের বছরের অপেক্ষার আবেগ জড়িয়ে থাকে।",

      "বিজয়ার দিনে পরিবার ও প্রিয়জনদের শুভেচ্ছা জানানোও বাঙালি সংস্কৃতির একটি গুরুত্বপূর্ণ অংশ।",
    ],
  },

];


/* =========================================================
   FACT CARD
========================================================= */

function FactCard({
  icon,
  title,
  short,
  details,
  plants,
}) {

  const [open, setOpen] = useState(false);

  return (
    <article
      className={`fact-card ${
        open ? "fact-open" : ""
      }`}
    >

      <button
        className="fact-card-top"
        onClick={() => setOpen(!open)}
      >

        <div className="fact-icon">
          {icon}
        </div>


        <div className="fact-title-area">

          <span>
            ✦ জানেন কি?
          </span>

          <h3>
            {title}
          </h3>

        </div>


        <div className="fact-arrow">
          {open ? "−" : "+"}
        </div>

      </button>


      <div className="fact-short">
        {short}
      </div>


      {open && (

        <div className="fact-details">

          {details.map((text, index) => (
            <p key={index}>
              <span>✦</span>
              {text}
            </p>
          ))}


          {/* ================= NAVAPATRIKA ================= */}

          {plants && (

            <div className="plants-box">

              <h4>
                🌿 নবপত্রিকার ৯টি উদ্ভিদ
              </h4>


              <div className="plants-list">

                {plants.map(
                  ([plant, goddess], index) => (

                    <div
                      className="plant-item"
                      key={index}
                    >

                      <div className="plant-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>


                      <div className="plant-info">

                        <strong>
                          {plant}
                        </strong>

                        <span>
                          দেবীর রূপ — {goddess}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      )}


      <button
        className="fact-more"
        onClick={() => setOpen(!open)}
      >
        {open
          ? "সংক্ষেপে দেখুন ↑"
          : "বিস্তারিত জানুন ↓"}
      </button>

    </article>
  );
}


export default App;