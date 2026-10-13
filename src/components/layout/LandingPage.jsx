import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  Code2,
  Folder,
  GitBranch,
  GitMerge,
  Layers,
  LayoutDashboard,
  Lock,
  Menu,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";

/* ───────────────────────── DATA ───────────────────────── */

const features = [
  { icon: Users, title: "Team Collaboration", description: "Bring developers, managers, and startup teams together in one unified workspace." },
  { icon: Code2, title: "Development Workspace", description: "Manage projects, tasks, repositories, environments, and development workflows." },
  { icon: MessageSquare, title: "Real-time Communication", description: "Communicate through channels, direct messages, meetings, and discussions." },
  { icon: GitBranch, title: "Project Management", description: "Organize software projects, track progress, assign tasks, and keep everyone aligned." },
  { icon: Rocket, title: "Easy Deployment", description: "Move from development to deployment with an integrated, streamlined workflow." },
  { icon: ShieldCheck, title: "Secure Workspace", description: "Keep projects and team data organized with workspace-based access and security." },
];

const heroFeatures = [
  { icon: Users, title: "Collaboration", text: "Work together, better." },
  { icon: LayoutDashboard, title: "Project Management", text: "Stay on track." },
  { icon: MessageSquare, title: "Team Communication", text: "No more missed updates." },
  { icon: Box, title: "Build Products", text: "Turn ideas into reality." },
];

const stats = [
  { to: 1, label: "Unified Workspace" },
  { inf: true, label: "Possibilities" },
  { to: 24, suf: "/7", label: "Team Collaboration" },
  { to: 100, suf: "%", label: "Focused on Teams" },
];

const rotating = ["entire team.", "developers.", "managers.", "startup."];

const marqueeItems = [
  "Projects", "Channels", "Meetings", "Repositories", "Tasks", "Deployments",
  "Direct Messages", "Roles & Access", "Environments", "Reviews",
];

const steps = [
  { title: "Create your workspace", description: "Set up a workspace for your company, startup, or software team." },
  { title: "Build your project", description: "Create projects, invite your team, assign tasks, and organize your workflow." },
  { title: "Collaborate & deploy", description: "Communicate, develop, review, and deploy without leaving your workspace." },
];

const feedEvents = [
  { icon: GitMerge, text: "Ali merged “auth-flow” into main", tone: "text-emerald-500" },
  { icon: MessageSquare, text: "New message in #backend", tone: "text-blue-500" },
  { icon: Rocket, text: "Staging deploy finished", tone: "text-sky-500" },
  { icon: Users, text: "Sara joined the workspace", tone: "text-amber-500" },
  { icon: Check, text: "Task “API docs” marked done", tone: "text-emerald-500" },
  { icon: Video, text: "Standup starts in 5 minutes", tone: "text-indigo-500" },
];

/* ───────────────────────── HOOKS ───────────────────────── */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function useTween(target, duration = 1200, start = false) {
  const [val, setVal] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReduced()) {
      setVal(target);
      return;
    }
    const a = from.current;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const v = a + (target - a) * eased;
      setVal(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

/* ───────────────────────── SMALL COMPONENTS ───────────────────────── */

function Reveal({ as: Tag = "div", delay = 0, y = 40, className = "", children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : `translateY(${y}px) scale(0.98)`,
        filter: seen ? "none" : "blur(8px)",
        transition: `opacity .9s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${delay}ms, filter .9s ease ${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const move = (e) => {
    if (prefersReduced()) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => (ref.current.style.transform = "translate(0,0)");
  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className="inline-block"
      style={{ transition: "transform .35s cubic-bezier(.2,.8,.2,1)" }}
    >
      {children}
    </span>
  );
}

function Tilt({ children, max = 8, className = "" }) {
  const ref = useRef(null);
  const move = (e) => {
    if (prefersReduced()) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(1200px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale3d(1.015,1.015,1.015)`;
    ref.current.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    ref.current.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const leave = () => {
    ref.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`uc-tilt ${className}`}
      style={{ transition: "transform .25s ease-out", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

function SpotlightCard({ children, className = "" }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={move} className={`uc-spot group relative overflow-hidden ${className}`}>
      <div className="uc-spot-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Counter({ stat }) {
  const [ref, seen] = useInView(0.4);
  const v = useTween(stat.to || 0, 1600, seen && !stat.inf);
  return (
    <span ref={ref}>
      {stat.inf ? <span className="uc-infinity inline-block">∞</span> : <>{Math.round(v)}{stat.suf || ""}</>}
    </span>
  );
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, raf, nodes = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        const dxm = a.x - mouse.x, dym = a.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 140) { a.x += (dxm / dm) * 1.2; a.y += (dym / dm) * 1.2; }
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37,99,235,.55)";
        ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 130) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (dm < 180) {
          ctx.strokeStyle = `rgba(14,165,233,${(1 - dm / 180) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      if (!prefersReduced()) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize(); draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReduced()) return;
    const t = setInterval(() => setI((p) => (p + 1) % rotating.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-grid align-bottom">
      {rotating.map((w, idx) => (
        <span
          key={w}
          className="uc-grad-text col-start-1 row-start-1 whitespace-nowrap"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: idx === i ? "translateY(0) rotateX(0)" : "translateY(60%) rotateX(-60deg)",
            filter: idx === i ? "blur(0)" : "blur(8px)",
            transition: "all .7s cubic-bezier(.2,.8,.2,1)",
          }}
          aria-hidden={idx !== i}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

function SplitWords({ text, base = 0 }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="uc-word inline-block" style={{ animationDelay: `${base + i * 110}ms` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </>
  );
}

/* ───────────────────────── PAGE ───────────────────────── */

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const progressRef = useRef(null);
  const dashRef = useRef(null);
  const heroRef = useRef(null);
  const [dashRef2, dashSeen] = useInView(0.25);
  const [feed, setFeed] = useState([feedEvents[0], feedEvents[1], feedEvents[2]]);
  const feedIdx = useRef(3);
  const [active, setActive] = useState(0);
  const [wfRef, wfSeen] = useInView(0.2);

  const scrollToId = useCallback((id) => {
    setMenu(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* scroll: progress bar, header, dashboard 3D unfold, hero parallax */
  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        setScrolled(y > 20);
        if (heroRef.current && !prefersReduced()) {
          heroRef.current.style.setProperty("--py", `${Math.min(y, 800) * 0.18}px`);
        }
        const d = dashRef.current;
        if (d && !prefersReduced()) {
          const r = d.getBoundingClientRect();
          const p = Math.min(Math.max(1 - r.top / (window.innerHeight * 0.95), 0), 1);
          d.style.transform = `perspective(1400px) rotateX(${(1 - p) * 22}deg) scale(${0.9 + p * 0.1}) translateY(${(1 - p) * 40}px)`;
          d.style.opacity = 0.35 + p * 0.65;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* live activity feed */
  useEffect(() => {
    if (prefersReduced()) return;
    const t = setInterval(() => {
      const ev = feedEvents[feedIdx.current % feedEvents.length];
      feedIdx.current += 1;
      setFeed((f) => [{ ...ev, id: feedIdx.current }, ...f].slice(0, 3));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  /* workflow autoplay */
  useEffect(() => {
    if (!wfSeen || prefersReduced()) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 4200);
    return () => clearInterval(t);
  }, [wfSeen]);

  const progressTarget = [22, 58, 100][active];
  const progress = useTween(progressTarget, 1100, wfSeen);
  const tasks = [
    ["Workspace setup", 8],
    ["Frontend", 30],
    ["Backend API", 62],
    ["Deployment", 94],
  ].map(([name, thr]) => [
    name,
    progress >= thr + 6 ? "Completed" : progress >= thr - 24 ? "In Progress" : "Pending",
  ]);

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-900">
      <style>{css}</style>

      {/* scroll progress */}
      <div className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-transparent">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-slate-200/70 bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,.06)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 lg:px-8 ${scrolled ? "h-16" : "h-20"}`}>
          <a href="#" className="flex items-center gap-3" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <img src="/ucollyx.png" alt="UCollyx" className="w-36 transition hover:scale-105" />
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {[["features", "Features"], ["how-it-works", "How It Works"], ["about", "About"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToId(id)}
                className="uc-link relative px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Log in
            </button>
            <Magnetic strength={0.25}>
              <button
                onClick={() => navigate("/register")}
                className="uc-shimmer relative overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                Get Started
              </button>
            </Magnetic>
          </div>

          <button
            className="rounded-lg p-2 text-slate-700 md:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-label="Toggle menu"
          >
            {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={`overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
            menu ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {[["features", "Features"], ["how-it-works", "How It Works"], ["about", "About"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollToId(id)} className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
                {label}
              </button>
            ))}
            <div className="mt-2 flex gap-3">
              <button onClick={() => navigate("/login")} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold">Log in</button>
              <button onClick={() => navigate("/register")} className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section ref={heroRef} className="relative isolate overflow-hidden pt-24">
          {/* background layers */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="uc-grid absolute inset-0" />
            <ParticleField />
            <div className="uc-blob absolute left-[18%] top-10 h-[520px] w-[720px] rounded-full bg-blue-200/50 blur-3xl" />
            <div className="uc-blob-2 absolute right-[-120px] top-24 h-[560px] w-[560px] rounded-full bg-sky-200/70 blur-3xl" />
            <div
              className="uc-blob-3 absolute -right-[260px] top-[230px] h-[620px] w-[850px] rounded-[50%] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-90"
              style={{ transform: "translateY(calc(var(--py,0px) * -0.6))" }}
            />
            <div className="uc-blob absolute -left-[300px] bottom-[-260px] h-[450px] w-[720px] rounded-[50%] bg-gradient-to-r from-blue-600 to-sky-300 opacity-80" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid min-h-[680px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              {/* LEFT */}
              <div className="relative z-10 pb-10 pt-10 lg:pb-24">
                <div className="uc-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur" style={{ animationDelay: "50ms" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  </span>
                  Built for modern software teams
                </div>

                <h1 className="max-w-2xl text-5xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[68px]">
                  <SplitWords text="One workspace." base={150} />
                  <br />
                  <span className="inline-block overflow-hidden pb-[0.1em]">
                    <span className="uc-word inline-block" style={{ animationDelay: "480ms" }}>
                      Your <RotatingWord />
                    </span>
                  </span>
                </h1>

                <p className="uc-fade-up mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg" style={{ animationDelay: "750ms" }}>
                  UCollyx is a unified workspace for software teams and tech startups to
                  collaborate, manage projects, communicate, and build products together.
                </p>

                <div className="uc-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "900ms" }}>
                  <Magnetic>
                    <button
                      onClick={() => navigate("/register")}
                      className="uc-shimmer group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition duration-300 hover:bg-blue-700"
                    >
                      Get Started Free
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1.5" />
                    </button>
                  </Magnetic>
                  <Magnetic>
                    <button
                      onClick={() => scrollToId("features")}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-200 bg-white/90 px-8 py-4 text-base font-bold text-blue-600 shadow-sm backdrop-blur transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      Explore Workspace
                    </button>
                  </Magnetic>
                </div>

                <div className="uc-fade-up mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500" style={{ animationDelay: "1050ms" }}>
                  {["No complicated setup", "Built for teams", "Everything connected"].map((t) => (
                    <span key={t} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT / LAPTOP */}
              <div className="uc-fade-up relative z-10 flex items-center justify-center lg:justify-end" style={{ animationDelay: "500ms" }}>
                <div className="absolute bottom-[-25px] right-[3%] h-20 w-[88%] rounded-full bg-blue-900/25 blur-3xl" />

                {/* floating chips */}
                <div className="uc-float absolute -left-2 top-10 z-20 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 text-xs font-semibold shadow-xl shadow-blue-900/10 backdrop-blur sm:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><GitMerge className="h-4 w-4" /></span>
                  PR merged
                </div>
                <div className="uc-float-2 absolute -right-2 top-28 z-20 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 text-xs font-semibold shadow-xl shadow-blue-900/10 backdrop-blur sm:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><MessageSquare className="h-4 w-4" /></span>
                  3 new messages
                </div>
                <div className="uc-float-3 absolute -bottom-2 left-6 z-20 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 text-xs font-semibold shadow-xl shadow-blue-900/10 backdrop-blur sm:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600"><Rocket className="h-4 w-4" /></span>
                  Deployed to production
                </div>

                <Tilt max={7} className="w-full max-w-[730px]">
                  <div className="relative overflow-hidden rounded-[26px] border-[8px] border-slate-900 bg-slate-900 shadow-2xl shadow-blue-900/30">
                    <div className="uc-glare pointer-events-none absolute inset-0 z-10" />
                    <div className="bg-white">
                      <div className="flex h-10 items-center gap-2 border-b border-slate-100 px-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                        <div className="mx-auto flex h-5 w-48 items-center justify-center gap-1 rounded-md bg-slate-50 text-[8px] text-slate-400">
                          <Lock className="h-2.5 w-2.5" /> app.ucollyx.com
                        </div>
                      </div>

                      <div className="min-h-[360px] bg-gradient-to-br from-white via-blue-50/60 to-sky-50 px-5 py-6 sm:min-h-[430px] sm:px-10">
                        <div className="flex items-center justify-between">
                          <img src="/ucollyx.png" alt="UCollyx" className="mb-8 w-24 object-contain" />
                          <div className="hidden items-center gap-5 text-[9px] font-medium text-slate-500 sm:flex">
                            <span>Features</span>
                            <span>How It Works</span>
                            <span>About</span>
                            <span>Log in</span>
                            <span className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white">Get Started</span>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <div className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 py-1 text-[8px] font-semibold text-blue-600 shadow-sm">
                            <Zap className="h-3 w-3" />
                            Built for modern software teams
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>

                        <div className="mx-auto mt-5 max-w-lg text-center">
                          <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
                            One workspace.
                            <br />
                            <span className="text-blue-600">Your entire team.</span>
                          </h2>
                          <p className="mx-auto mt-3 max-w-md text-[10px] leading-4 text-slate-500 sm:text-xs">
                            A unified workspace for software teams and tech startups to collaborate, manage projects, communicate, and build products together.
                          </p>
                          <div className="mt-5 flex justify-center gap-2">
                            <div className="rounded-lg bg-blue-600 px-4 py-2 text-[9px] font-bold text-white shadow-md">Get Started Free →</div>
                            <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[9px] font-bold text-slate-700">Explore Workspace</div>
                          </div>
                          <div className="mt-4 flex justify-center gap-4 text-[7px] text-slate-400">
                            <span>✓ No complicated setup</span>
                            <span>✓ Built for teams</span>
                            <span>✓ Everything connected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto h-4 w-[92%] rounded-b-2xl bg-gradient-to-b from-slate-500 to-slate-300 shadow-xl" />
                  <div className="mx-auto h-2 w-[45%] rounded-b-xl bg-slate-400" />
                </Tilt>
              </div>
            </div>

            {/* FEATURE STRIP */}
            <Reveal className="relative z-20 mb-12 overflow-hidden rounded-[30px] border border-slate-100 bg-white/90 shadow-xl shadow-blue-900/5 backdrop-blur-xl" delay={100}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {heroFeatures.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`group flex items-center gap-4 px-6 py-7 transition hover:bg-blue-50/50 ${
                        index !== heroFeatures.length - 1 ? "border-b border-slate-100 lg:border-b-0 lg:border-r" : ""
                      }`}
                    >
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-blue-600">
                        <Icon className="h-6 w-6 text-blue-600 transition group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= MARQUEE ================= */}
        <section className="relative border-y border-slate-100 bg-white py-6">
          <div className="uc-marquee-mask overflow-hidden">
            <div className="uc-marquee flex w-max gap-4">
              {[...marqueeItems, ...marqueeItems].map((m, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-600"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================= DASHBOARD PREVIEW ================= */}
        <section className="relative bg-gradient-to-b from-white to-slate-50 px-6 pb-24 pt-24 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Your whole organization, at a glance.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Users, roles, projects, and approvals live in one control panel.
            </p>
          </Reveal>

          <div ref={dashRef2} className="relative mx-auto mt-16 max-w-6xl" style={{ perspective: "1400px" }}>
            <div className="uc-pulse-glow absolute inset-x-20 -bottom-10 h-32 rounded-full bg-blue-500/30 blur-3xl" />

            <div
              ref={dashRef}
              className="relative origin-top overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/15 will-change-transform"
              style={{ transform: "perspective(1400px) rotateX(22deg) scale(.9)", opacity: 0.35 }}
            >
              <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-5">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-300" />
                  <div className="h-3 w-3 rounded-full bg-amber-300" />
                  <div className="h-3 w-3 rounded-full bg-emerald-300" />
                </div>
                <div className="hidden h-7 w-80 rounded-md border border-slate-200 bg-white shadow-sm sm:block" />
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-3 py-1 text-white shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Org Admin</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold">A</div>
                </div>
              </div>

              <div className="flex min-h-[500px] bg-slate-50">
                <aside className="hidden w-16 flex-col items-center gap-4 border-r border-slate-200 bg-white py-4 sm:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">A</div>
                  <div className="my-1 w-8 border-t border-slate-100" />
                  {[LayoutDashboard, Folder, Users, MessageSquare, Video, Lock].map((Ic, i) => (
                    <div
                      key={i}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition hover:scale-110 ${
                        i === 0 ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50 hover:text-blue-500"
                      }`}
                    >
                      <Ic className="h-4 w-4" />
                    </div>
                  ))}
                </aside>

                <div className="flex-1 space-y-5 p-5 sm:p-6">
                  <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Ecosystem Hub</span>
                        <span className="text-slate-300">/</span>
                        <span>Control Panel</span>
                      </div>
                      <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Devsloop</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Live routing status updates and key infrastructure metrics dashboard.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                        Pending Gates
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-3">
                    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Users & Access Index</h4>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-400">Active operators and telemetry pipelines</p>
                        </div>
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">IDX</span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                          <p className="text-xs text-slate-500">Total Users Assigned</p>
                          <p className="mt-1 text-3xl font-extrabold text-slate-900"><DashNum to={7} on={dashSeen} /></p>
                          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 shadow-sm">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" /> Live Node
                          </div>
                        </div>
                        <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                          <p className="text-xs text-slate-500">Pending Approvals</p>
                          <p className="mt-1 text-3xl font-extrabold text-amber-500"><DashNum to={0} on={dashSeen} /></p>
                          <div className="absolute right-4 top-4 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">INSPECT GATE</div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role Allocation Shares</p>
                        {[
                          { label: "Developers", n: 3, w: 60, bar: "from-blue-400 to-cyan-400", mark: <span className="font-mono text-blue-500">›_</span> },
                          { label: "System Managers", n: 2, w: 40, bar: "from-amber-300 to-amber-400", mark: <span className="text-amber-500">⚡</span> },
                          { label: "Quality Engineers", n: 1, w: 25, bar: "from-emerald-400 to-emerald-500", mark: <span className="text-emerald-500">🛡️</span> },
                        ].map((r, i) => (
                          <div key={r.label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="flex items-center gap-1.5 font-medium text-slate-700">{r.mark} {r.label}</span>
                              <span className="font-bold text-slate-900">{r.n}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${r.bar}`}
                                style={{ width: dashSeen ? `${r.w}%` : "0%", transition: `width 1.4s cubic-bezier(.2,.8,.2,1) ${400 + i * 200}ms` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* live feed */}
                      <div className="border-t border-slate-100 pt-4">
                        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live activity
                        </p>
                        <div className="space-y-2">
                          {feed.map((ev, i) => {
                            const Ic = ev.icon;
                            return (
                              <div
                                key={(ev.id || "s") + ev.text}
                                className="uc-feed flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"
                                style={{ opacity: 1 - i * 0.25 }}
                              >
                                <Ic className={`h-3.5 w-3.5 ${ev.tone}`} />
                                {ev.text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-blue-600" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Directories</h4>
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-400">Repositories & scope clusters</p>
                          </div>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">DIR</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Active Code Clusters</p>
                              <p className="text-[10px] text-slate-400">Active</p>
                            </div>
                            <span className="text-lg font-bold text-slate-900"><DashNum to={5} on={dashSeen} /></span>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Unassigned Scopes</p>
                              <span className="mt-0.5 inline-block animate-pulse rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600">Action Needed</span>
                            </div>
                            <span className="text-lg font-bold text-slate-900"><DashNum to={1} on={dashSeen} /></span>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Archived Nodes</p>
                              <p className="text-[10px] text-slate-400">Cold Storage</p>
                            </div>
                            <span className="text-lg font-bold text-slate-900"><DashNum to={1} on={dashSeen} /></span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <span className="group flex cursor-pointer items-center justify-between text-xs font-semibold text-blue-600">
                          Review Active Directories
                          <span className="text-sm transition group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="border-y border-slate-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 120} className="text-center">
                  <div className="uc-grad-text text-4xl font-black sm:text-5xl">
                    <Counter stat={stat} />
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{stat.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="relative py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Everything your team needs</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Replace scattered tools and disconnected workflows with one centralized workspace designed for modern software teams.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.title} delay={(i % 3) * 120} y={60}>
                    <Tilt max={6} className="h-full">
                      <SpotlightCard className="h-full rounded-2xl border border-slate-200 bg-white p-7 transition-colors duration-300 hover:border-blue-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-blue-600">
                          <Icon className="h-6 w-6 text-blue-600 transition group-hover:text-white" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold text-slate-900">{feature.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                        <button className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600">
                          Learn more
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1.5" />
                        </button>
                      </SpotlightCard>
                    </Tilt>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS (dark) ================= */}
        <section id="how-it-works" ref={wfRef} className="relative overflow-hidden bg-slate-950 py-28 text-white">
          <div className="uc-grid-dark pointer-events-none absolute inset-0" />
          <div className="uc-blob pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/30 blur-3xl" />
          <div className="uc-blob-2 pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <Reveal>
                  <h2 className="text-4xl font-black tracking-tight sm:text-5xl">From idea to deployment in one place.</h2>
                  <p className="mt-6 text-lg leading-8 text-slate-400">
                    UCollyx connects your team's complete development lifecycle, helping everyone stay focused, informed, and productive.
                  </p>
                </Reveal>

                <div className="mt-10 space-y-3">
                  {steps.map((step, i) => {
                    const on = active === i;
                    return (
                      <Reveal key={step.title} delay={i * 130}>
                        <button
                          onClick={() => setActive(i)}
                          className={`relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 ${
                            on ? "border-blue-500/50 bg-white/[0.06] shadow-lg shadow-blue-600/10" : "border-white/10 bg-transparent hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex gap-5">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-500 ${
                                on ? "scale-110 bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "bg-white/10 text-slate-400"
                              }`}
                            >
                              {i + 1}
                            </div>
                            <div>
                              <h3 className="font-bold">{step.title}</h3>
                              <div
                                className="grid transition-all duration-500"
                                style={{ gridTemplateRows: on ? "1fr" : "0.6fr", opacity: on ? 1 : 0.6 }}
                              >
                                <p className="mt-1 overflow-hidden text-sm leading-6 text-slate-400">{step.description}</p>
                              </div>
                            </div>
                          </div>
                          {on && <span key={active} className="uc-fill absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-sky-300" />}
                        </button>
                      </Reveal>
                    );
                  })}
                </div>
              </div>

              <Reveal delay={200}>
                <div className="relative">
                  <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blue-500/30 to-sky-400/10 blur-2xl" />
                  <Tilt max={6}>
                    <div className="uc-border-spin relative rounded-3xl p-[1.5px]">
                      <div className="relative rounded-3xl bg-slate-900 p-6">
                        <div className="rounded-2xl bg-slate-800/60 p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-slate-400">Project</p>
                              <h3 className="font-bold">UCollyx Platform</h3>
                            </div>
                            <span className="flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                              {progress >= 99 ? "Live" : "Active"}
                            </span>
                          </div>

                          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-700">
                            <div
                              className="uc-bar h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-slate-400">
                            <span>Project progress</span>
                            <span className="font-mono text-slate-200">{Math.round(progress)}%</span>
                          </div>

                          <div className="mt-7 space-y-3">
                            {tasks.map(([name, status]) => (
                              <div key={name} className="flex items-center justify-between rounded-xl bg-slate-900/80 p-4 transition">
                                <span className="text-sm font-medium">{name}</span>
                                <span
                                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors duration-500 ${
                                    status === "Completed" ? "text-emerald-400" : status === "In Progress" ? "text-sky-300" : "text-slate-500"
                                  }`}
                                >
                                  {status === "Completed" && <Check className="h-3.5 w-3.5" />}
                                  {status === "In Progress" && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-sky-300" />}
                                  {status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="relative py-28">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <Reveal>
              <div className="uc-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-xl shadow-blue-600/30">
                U
              </div>
              <h2 className="mt-7 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Built to bring teams together.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                UCollyx provides a single digital workspace where software developers, project managers, and tech startups can collaborate seamlessly from planning to production.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 pb-24 lg:px-8">
          <Reveal>
            <div className="uc-cta relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-8 py-20 text-center shadow-2xl shadow-blue-600/30 sm:px-16">
              <div className="uc-blob absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
              <div className="uc-blob-2 absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
              <div className="uc-grid-dark absolute inset-0 opacity-60" />

              <div className="relative">
                <h2 className="text-3xl font-black text-white sm:text-5xl">Ready to build better together?</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                  Bring your projects, people, and development workflow into one powerful workspace.
                </p>
                <div className="mt-9">
                  <Magnetic strength={0.35}>
                    <button
                      onClick={() => navigate("/register")}
                      className="uc-shimmer group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-4 font-bold text-blue-600 shadow-xl transition hover:bg-blue-50"
                    >
                      Start Building with UCollyx
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1.5" />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <img src="/ucollyx.png" alt="UCollyx" className="w-32" />
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} UCollyx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function DashNum({ to, on }) {
  const v = useTween(to, 1400, on);
  return <>{Math.round(v)}</>;
}

/* ───────────────────────── CSS (keyframes & helpers) ───────────────────────── */

const css = `
html { scroll-behavior: smooth; }

.uc-grad-text {
  background: linear-gradient(90deg,#1d4ed8,#2563eb,#38bdf8,#2563eb,#1d4ed8);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: ucGradMove 6s linear infinite;
}
@keyframes ucGradMove { to { background-position: 250% 0; } }

.uc-word { transform: translateY(110%) rotate(4deg); opacity: 0; filter: blur(10px);
  animation: ucWord .9s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes ucWord { to { transform: translateY(0) rotate(0); opacity: 1; filter: blur(0); } }

.uc-fade-up { opacity: 0; transform: translateY(28px); animation: ucFadeUp .9s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes ucFadeUp { to { opacity: 1; transform: none; } }

.uc-blob   { animation: ucBlob 14s ease-in-out infinite; }
.uc-blob-2 { animation: ucBlob 18s ease-in-out infinite reverse; }
.uc-blob-3 { animation: ucBlob3 20s ease-in-out infinite; }
@keyframes ucBlob  { 0%,100% { translate: 0 0; scale: 1; } 50% { translate: 40px -30px; scale: 1.08; } }
@keyframes ucBlob3 { 0%,100% { rotate: 0deg; } 50% { rotate: 6deg; } }

.uc-float   { animation: ucFloat 5s ease-in-out infinite; }
.uc-float-2 { animation: ucFloat 6s ease-in-out infinite .8s; }
.uc-float-3 { animation: ucFloat 5.5s ease-in-out infinite 1.6s; }
@keyframes ucFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }

.uc-grid {
  background-image: linear-gradient(rgba(37,99,235,.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(37,99,235,.06) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse at 40% 30%, #000 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 40% 30%, #000 20%, transparent 70%);
}
.uc-grid-dark {
  background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse at 50% 40%, #000 25%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 25%, transparent 75%);
}

.uc-shimmer::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.45) 50%, transparent 70%);
  transform: translateX(-120%); animation: ucShimmer 3.2s ease-in-out infinite; pointer-events: none;
}
@keyframes ucShimmer { 0%,55% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }

.uc-link::after {
  content: ""; position: absolute; left: 16px; right: 16px; bottom: 4px; height: 2px; border-radius: 2px;
  background: #2563eb; transform: scaleX(0); transform-origin: left; transition: transform .35s ease;
}
.uc-link:hover::after { transform: scaleX(1); }

.uc-marquee { animation: ucMarquee 32s linear infinite; }
.uc-marquee:hover { animation-play-state: paused; }
@keyframes ucMarquee { to { transform: translateX(-50%); } }
.uc-marquee-mask { mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }

.uc-spot-glow { background: radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(37,99,235,.14), transparent 45%); }

.uc-glare { background: radial-gradient(500px circle at var(--gx,50%) var(--gy,0%), rgba(255,255,255,.22), transparent 55%); mix-blend-mode: overlay; }

.uc-infinity { animation: ucInf 3s ease-in-out infinite; }
@keyframes ucInf { 0%,100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.18) rotate(-6deg); } }

.uc-pulse-glow { animation: ucPulse 4s ease-in-out infinite; }
@keyframes ucPulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }

.uc-feed { animation: ucFeed .55s cubic-bezier(.2,.8,.2,1); }
@keyframes ucFeed { from { opacity: 0; transform: translateY(-12px) scale(.98); } }

.uc-fill { animation: ucFill 4.2s linear forwards; width: 0; }
@keyframes ucFill { to { width: 100%; } }

.uc-border-spin { background: conic-gradient(from var(--a,0deg), rgba(59,130,246,.0), rgba(59,130,246,.9), rgba(56,189,248,.0) 40%, rgba(59,130,246,.0)); animation: ucSpin 6s linear infinite; }
@property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes ucSpin { to { --a: 360deg; } }

.uc-bar { box-shadow: 0 0 18px rgba(56,189,248,.6); }

.uc-cta { background: linear-gradient(120deg,#1d4ed8,#2563eb,#0ea5e9,#2563eb,#1d4ed8); background-size: 300% 100%; animation: ucCta 10s ease-in-out infinite; }
@keyframes ucCta { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .uc-word, .uc-fade-up { opacity: 1 !important; transform: none !important; filter: none !important; }
}
`;

export default LandingPage;