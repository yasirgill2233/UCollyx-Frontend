import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Forward,
  ArrowRightIcon,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router";

const MainDashboard = () => {
  // --- 1. STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [severityFilter, setSeverityFilter] = useState("All Severities");

  const navigate = useNavigate();

  const [allBugs] = useState([
    {
      id: "BUG-1247",
      title: "Payment gateway timeout on checkout",
      project: "E-Commerce",
      module: "Checkout",
      time: "2h ago",
      severity: "CRITICAL",
      status: "OPEN",
      assigned: "Ahmed Raza",
      // Individual Details for Verification
      steps: [
        "Add items worth > $500",
        "Use International Credit Card",
        "Click 'Pay Now' during peak traffic hours",
      ],
      expected: "Payment should process within 5 seconds without timeout.",
      actual: "Gateway returns 504 Gateway Timeout after 30 seconds.",
      summary:
        "API connection pool increased and timeout value adjusted to 45s.",
      commit: "fc-8821-pay",
      sprint: "Sprint 24",
    },
    {
      id: "BUG-1248",
      title: "Database connection pool exhausted",
      project: "CRM",
      module: "Backend",
      time: "5h ago",
      severity: "MEDIUM",
      status: "OPEN",
      assigned: "Sarah Khan",
      steps: [
        "Run 50 simultaneous report generation queries",
        "Check DB metrics in Admin Panel",
      ],
      expected: "Connections should be released back to the pool immediately.",
      actual: "DB hangs after 20 concurrent connections.",
      summary: "Fixed memory leak in Sequelize connection handler.",
      commit: "db-fix-001",
      sprint: "Sprint 24",
    },
    {
      id: "BUG-1249",
      title: "Cart total calculation incorrect",
      project: "E-Commerce",
      module: "Cart",
      time: "1d ago",
      severity: "HIGH",
      status: "AWAITING FIX",
      assigned: "Fatima Ali",
      steps: [
        "Add 3 items with different tax rates",
        "Apply a 10% discount coupon",
      ],
      expected: "Subtotal - Discount + Tax should equal Total.",
      actual: "Discount is being applied after tax calculation.",
      summary: "Order of operations corrected in pricing engine.",
      commit: "cart-math-v2",
      sprint: "Sprint 24",
    },
    {
      id: "BUG-1250",
      title: "Login redirect fixed and verified",
      project: "Mobile App",
      module: "Auth",
      time: "1h ago",
      severity: "MEDIUM",
      status: "RESOLVED",
      assigned: "You",
      retested: true,
      testStatus: "PASSED",
      steps: [
        "Login from an expired session link",
        "Verify if redirected to Home instead of 404",
      ],
      expected:
        "User should be redirected to Dashboard after successful login.",
      actual: "User was staying on the Login page with a blank screen.",
      summary: "Auth guard route fixed to handle deep links.",
      commit: "auth-red-99",
      sprint: "Sprint 23",
    },
    {
      id: "BUG-1251",
      title: "Security vulnerability in user auth",
      project: "CRM",
      module: "Security",
      time: "3h ago",
      severity: "CRITICAL",
      status: "OPEN",
      assigned: "Zain Ahmed",
      steps: [
        "Inject script tag in username field",
        "Try to bypass login with SQL injection",
      ],
      expected: "Input should be sanitized; script should not execute.",
      actual: "Alert box appeared on the profile page (XSS).",
      summary:
        "Added DOMPurify for frontend and sanitized SQL inputs on backend.",
      commit: "sec-patch-v1",
      sprint: "Sprint 25",
    },
    {
      id: "BUG-1252",
      title: "Image upload fails on iOS",
      project: "E-Commerce",
      module: "Profile",
      time: "2h ago",
      severity: "LOW",
      status: "RESOLVED",
      assigned: "You",
      retested: true,
      testStatus: "FAILED",
      steps: [
        "Open app on iPhone 15 Pro",
        "Select HEIC format image from gallery",
      ],
      expected: "Image should upload and convert to JPG/WebP.",
      actual: "Upload gets stuck at 0% for HEIC files.",
      summary: "Added HEIC support library to mobile core.",
      commit: "ios-img-99",
      sprint: "Sprint 24",
    },
    {
      id: "BUG-1254",
      title: "Email notification delay > 5mins",
      project: "CRM",
      module: "Notifications",
      time: "6h ago",
      severity: "MEDIUM",
      status: "AWAITING FIX",
      assigned: "Maria Khan",
      steps: [
        "Trigger password reset request",
        "Measure time for email arrival",
      ],
      expected: "Email should arrive within 30 seconds.",
      actual: "Email queue processing takes up to 7 minutes.",
      summary: "Optimized Redis queue for SMTP relay.",
      commit: "mail-fast-02",
      sprint: "Sprint 24",
    },
    {
      id: "BUG-1255",
      title: "Dashboard charts rendering lag",
      project: "Mobile App",
      module: "Analytics",
      time: "8h ago",
      severity: "HIGH",
      status: "AWAITING FIX",
      assigned: "Usman Sheikh",
      steps: ["Open Analytics tab", "Select 'Last 12 Months' data view"],
      expected: "Charts should render within 1.5 seconds.",
      actual: "UI freezes for 4 seconds while fetching data.",
      summary: "Implemented data memoization and lazy loading for Recharts.",
      commit: "chart-opt-v5",
      sprint: "Sprint 24",
    },
  ]);

  // --- 2. MULTI-FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return allBugs.filter((bug) => {
      const matchesSearch =
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject =
        projectFilter === "All Projects" || bug.project === projectFilter;
      const matchesSeverity =
        severityFilter === "All Severities" || bug.severity === severityFilter;
      return matchesSearch && matchesProject && matchesSeverity;
    });
  }, [searchTerm, projectFilter, severityFilter, allBugs]);

  // --- 3. CATEGORIZED DATA ---
  const openBugsFeed = filteredData.filter((b) => b.status === "OPEN");
  const awaitingFixList = filteredData.filter(
    (b) => b.status === "AWAITING FIX",
  );

  const stats = {
    critical: openBugsFeed.filter((b) => b.severity === "CRITICAL").length,
    high: openBugsFeed.filter((b) => b.severity === "HIGH").length,
    medium: openBugsFeed.filter((b) => b.severity === "MEDIUM").length,
    low: openBugsFeed.filter((b) => b.severity === "LOW").length,
  };

  // --- NAVIGATION HANDLERS ---
  // In functions ke zariye hum filtered data next page ko pass kar rahe hain
  const handleViewPriorityFeed = () => {
    navigate("/red-card-alerts", {
      state: {
        title: "Priority Activity Feed",
        bugs: openBugsFeed, // Sirf Open status waale bugs
      },
    });
  };

  const handleViewAwaitingFix = () => {
    navigate("/red-card-alerts", {
      state: {
        title: "Awaiting Fix Queue",
        bugs: awaitingFixList, // Sirf Awaiting Fix status waale bugs
      },
    });
  };

  const handleViewVerification = () => {
    navigate("/verification", {
      state: {
        title: "Verification Report",
        bugs: filteredData.filter(
          (b) => b.status === "RESOLVED" || b.status === "AWAITING FIX",
        ), // Sirf retested bugs
      },
    });
  };

  return (
    <div className="flex-1 bg-[#F9FBFF] p-6 md:p-10 min-h-screen font-sans selection:bg-blue-100">
      {/* Header & Functional Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            System <span className="text-slate-400 font-medium">Insights</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">
            Tuesday, 20 March 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => navigate("/report-bug-form")}
            className="
  group flex items-center gap-2 
  bg-blue-600 hover:bg-rose-600 
  text-white px-5 py-1.5 
  rounded-xl text-[10px] font-black uppercase tracking-widest 
  transition-all duration-500 
  shadow-lg shadow-blue-100 hover:shadow-rose-100
  active:scale-95
"
          >
            {/* Icon ka color default mein light blue hoga, hover par white */}
            <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <AlertCircle
                size={14}
                strokeWidth={3}
                className="text-blue-200 group-hover:text-white"
              />
            </div>
            <span>Report Bug</span>
          </button>

        </div>
      </div>

      <div className="flex justify-between mb-8 p-4 border rounded-lg border-gray-200 bg-white">
          <div className="relative flex-1 lg:flex-none w-[30%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 w-full py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
            />
          </div> 
          <div className="flex gap-2">

        <FilterSelect
            value={projectFilter}
            onChange={setProjectFilter}
            options={["All Projects", "E-Commerce", "CRM", "Mobile App"]}
            />
          <FilterSelect
            value={severityFilter}
            onChange={setSeverityFilter}
            options={["All Severities", "CRITICAL", "HIGH", "MEDIUM", "LOW"]}
            />
            </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Open Bugs Distribution */}
        <SectionCard
          title="Open Bugs Distribution"
          subTitle="Current active load by severity"
        >
          <div className="flex flex-col justify-between h-[80%]">
            <div className="grid grid-cols-2 gap-4">
              <SeverityStat
                label="CRITICAL"
                count={stats.critical}
                color="red"
              />
              <SeverityStat label="HIGH" count={stats.high} color="orange" />
              <SeverityStat
                label="MEDIUM"
                count={stats.medium}
                color="yellow"
              />
              <SeverityStat label="LOW" count={stats.low} color="cyan" />
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Open: {openBugsFeed.length}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Card 2: Priority Activity Feed (Now showing ALL severities) */}
        <SectionCard
          title="Priority Activity Feed"
          subTitle="Latest open issues across all levels"
        >
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {openBugsFeed.length > 0 ? (
              openBugsFeed.map((bug) => <BugFeedItem key={bug.id} bug={bug} />)
            ) : (
              <EmptyState />
            )}
          </div>
          <div
            onClick={handleViewPriorityFeed}
            className="text-sm text-blue-600 mt-4 flex justify-end items-center gap-2 hover:cursor-pointer group"
          >
            View Details
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 group-hover:duration-400"
            />
          </div>
        </SectionCard>

        {/* Card 3: Awaiting Fix (More Data) */}
        <SectionCard
          title="Awaiting Fix"
          subTitle="Bugs currently in developer queue"
          count={awaitingFixList.length}
        >
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {awaitingFixList.length > 0 ? (
              awaitingFixList.map((bug) => (
                <AwaitingFixRow key={bug.id} bug={bug} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
          <div
            onClick={handleViewAwaitingFix}
            className="text-sm text-blue-600 mt-4 flex justify-end items-center gap-2 hover:cursor-pointer group"
          >
            View Queue
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 group-hover:duration-400"
            />
          </div>
        </SectionCard>

        {/* Card 4: Retest Quality Report */}
        <SectionCard
          title="Retest Verification"
          subTitle="Today's verification summary"
        >
          <div className="flex gap-4 mb-6">
            <ResultBox
              label="Passed"
              count={
                filteredData.filter((b) => b.testStatus === "PASSED").length
              }
              color="emerald"
            />
            <ResultBox
              label="Failed"
              count={
                filteredData.filter((b) => b.testStatus === "FAILED").length
              }
              color="red"
            />
          </div>
          <div className="space-y-3 overflow-hidden">
            {filteredData
              .filter((b) => b.retested)
              .map((bug) => (
                <RetestRow key={bug.id} bug={bug} />
              ))}
          </div>
          <div
            onClick={handleViewVerification}
            className="text-sm text-blue-600 mt-4 flex justify-end items-center gap-2 hover:cursor-pointer group"
          >
            Full Report
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 group-hover:duration-400"
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const SectionCard = ({ title, subTitle, children, count }) => (
  <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all">
    <div className="flex justify-between items-start mb-8">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            {title}
          </h3>
          {count > 0 && (
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
          {subTitle}
        </p>
      </div>
      <button className="text-slate-300 p-2 hover:bg-slate-50 rounded-lg transition-colors">
        <Layers size={16} />
      </button>
    </div>
    {children}
  </div>
);

const SeverityStat = ({ label, count, color }) => {
  const colors = {
    red: "bg-red-50 text-red-600 border-red-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  };
  return (
    <div className={`${colors[color]} border p-5 rounded-3xl`}>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">
        {label}
      </p>
      <p className="text-3xl font-black">{count}</p>
    </div>
  );
};

// --- Updated Feed Item showing different Severities ---
const BugFeedItem = ({ bug }) => {
  const sevColor =
    bug.severity === "CRITICAL"
      ? "bg-red-500 shadow-red-100"
      : bug.severity === "HIGH"
        ? "bg-orange-500 shadow-orange-100"
        : bug.severity === "MEDIUM"
          ? "bg-yellow-500 shadow-yellow-100"
          : "bg-cyan-500 shadow-cyan-100";

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl hover:border-slate-200 transition-all shadow-sm group">
      <div className="flex items-center gap-4">
        <div className={`${sevColor} p-2.5 rounded-xl text-white shadow-lg`}>
          <AlertCircle size={16} />
        </div>
        <div>
          <h4 className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
            {bug.title}
          </h4>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
            {bug.project} • {bug.assigned}
          </p>
        </div>
      </div>
      <span
        className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${
          bug.severity === "CRITICAL"
            ? "text-red-500 border-red-100 bg-red-50"
            : bug.severity === "HIGH"
              ? "text-orange-500 border-orange-100 bg-orange-50"
              : "text-slate-400 border-slate-100 bg-slate-50"
        }`}
      >
        {bug.severity}
      </span>
    </div>
  );
};

const AwaitingFixRow = ({ bug }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-blue-500 transition-colors">
        {bug.id.split("-")[1]}
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-slate-800 leading-tight">
          {bug.title}
        </h4>
        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
          Owner: <span className="text-slate-700">{bug.assigned}</span> •{" "}
          {bug.time}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-black text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-lg">
        IN QUEUE
      </span>
      <Clock size={12} className="text-slate-300" />
    </div>
  </div>
);

const ResultBox = ({ label, count, color }) => (
  <div
    className={`flex-1 p-5 rounded-3xl border text-center ${color === "emerald" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"}`}
  >
    <h2 className="text-3xl font-black">{count}</h2>
    <p className="text-[10px] font-black uppercase tracking-widest mt-1">
      {label}
    </p>
  </div>
);

const RetestRow = ({ bug }) => (
  <div className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-lg">
    <div className="flex items-center gap-3">
      <CheckCircle2
        size={14}
        className={
          bug.testStatus === "PASSED" ? "text-emerald-500" : "text-red-400"
        }
      />
      <h4 className="text-[11px] font-bold text-slate-700">{bug.title}</h4>
    </div>
    <span
      className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${bug.testStatus === "PASSED" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
    >
      {bug.testStatus}
    </span>
  </div>
);

const FilterSelect = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      size={12}
    />
  </div>
);

const EmptyState = () => (
  <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
      No matching results found
    </p>
  </div>
);

export default MainDashboard;
