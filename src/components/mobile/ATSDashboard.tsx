import React, { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Clock, Users, Eye, Edit, Trash2, Briefcase, BarChart3, Settings, LayoutDashboard, FileText, X } from 'lucide-react';
import svgPaths from '../../imports/svg-7czz0xzc3o';

// ─── Data ───
interface JobProfile {
  id: string;
  title: string;
  description: string;
  experience: string;
  activeMatches: number;
  requiredSkills: string[];
  preferredSkills: string[];
}

const initialJobs: JobProfile[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    description: 'Full stack web developer with modern JavaScript technologies',
    experience: '3+ years',
    activeMatches: 8,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
    preferredSkills: ['Python', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    description: 'Frontend developer focused on user interface development',
    experience: '2+ years',
    activeMatches: 17,
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
    preferredSkills: ['TypeScript', 'Vue.js', 'Sass', 'Figma'],
  },
  {
    id: '3',
    title: 'Backend Developer',
    description: 'Backend developer for server-side applications',
    experience: '3+ years',
    activeMatches: 24,
    requiredSkills: ['Python', 'Node.js', 'SQL', 'API Development'],
    preferredSkills: ['Django', 'FastAPI', 'Redis', 'Docker'],
  },
  {
    id: '4',
    title: 'Data Scientist',
    description: 'Data scientist with machine learning expertise',
    experience: '2+ years',
    activeMatches: 13,
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'R', 'Spark'],
  },
];

type NavItem = 'dashboard' | 'resume' | 'candidates' | 'jobs' | 'analytics' | 'settings';

// ─── Sidebar Icon using imported SVGs ───
function SidebarBrandIcon() {
  return (
    <div
      className="shrink-0 size-[35px] rounded-xl flex items-center justify-center"
      style={{ backgroundImage: 'linear-gradient(135deg, rgb(173, 70, 255) 0%, rgb(0, 187, 167) 100%)' }}
    >
      <svg className="size-[21px]" fill="none" viewBox="0 0 21 21">
        <path d={svgPaths.p1aee1180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d={svgPaths.p9629200} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d={svgPaths.p324c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d={svgPaths.p18f06198} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d={svgPaths.p2e4706c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d="M10.5 11.375H14" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d={svgPaths.p3ba4f740} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d="M10.5 7H17.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      </svg>
    </div>
  );
}

function CardBriefcaseIcon() {
  return (
    <div
      className="shrink-0 size-[42px] rounded-xl flex items-center justify-center"
      style={{ backgroundImage: 'linear-gradient(135deg, rgb(173, 70, 255) 0%, rgb(0, 187, 167) 100%)' }}
    >
      <svg className="size-[21px]" fill="none" viewBox="0 0 21 21">
        <path d={svgPaths.pdd94c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        <path d={svgPaths.p2d3e9100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      </svg>
    </div>
  );
}

// ─── Sidebar ───
function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }: {
  activeNav: NavItem;
  setActiveNav: (n: NavItem) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'resume', label: 'Resume Analyzer', icon: <FileText size={17} /> },
    { id: 'candidates', label: 'Candidates', icon: <Users size={17} /> },
    { id: 'jobs', label: 'Job Postings', icon: <Briefcase size={17} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static z-50 top-0 left-0 h-full w-[224px] 
        bg-[rgba(255,255,255,0.15)] border-r border-[rgba(255,255,255,0.3)]
        shadow-[0px_12px_40px_0px_rgba(31,38,135,0.2)]
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-5 pt-5 pb-4 border-b border-[rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-3">
            <SidebarBrandIcon />
            <div>
              <p className="text-[15px] font-semibold text-[#1e2939] dark:text-white leading-tight">ATS Analyzer</p>
              <p className="text-[10px] text-[#4a5565] dark:text-white/60 leading-tight">AI-Powered Recruitment</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-gradient-to-r from-[#ad46ff] to-[#00bba7] text-white shadow-lg'
                    : 'text-[#364153] dark:text-white/80 hover:bg-[rgba(255,255,255,0.15)]'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Demo badge */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-2 bg-[#dbeafe] dark:bg-[rgba(255,215,0,0.15)] border border-[#bedbff] dark:border-[rgba(255,215,0,0.3)] rounded-lg px-3 py-2">
            <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
              <path d={svgPaths.pc012c00} stroke="#1447E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.167" />
              <path d="M7 9.333V7" stroke="#1447E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.167" />
              <path d="M7 4.667H7.006" stroke="#1447E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.167" />
            </svg>
            <span className="text-xs text-[#1447e6] dark:text-[#FFD700] font-medium">Demo Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Job Card ───
function JobCard({ job, onDelete }: { job: JobProfile; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const maxShow = 4;

  return (
    <div className="bg-[rgba(255,255,255,0.10)] dark:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.2)] rounded-2xl p-5 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.15)] flex flex-col gap-3.5 relative group hover:border-[rgba(255,255,255,0.35)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <CardBriefcaseIcon />
          <div>
            <h3 className="text-[15px] font-semibold text-[#1e2939] dark:text-white">{job.title}</h3>
            <p className="text-[12px] text-[#4a5565] dark:text-white/60">Job Profile</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.15)] transition"
          >
            <MoreVertical size={16} className="text-[#4a5565] dark:text-white/50" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white dark:bg-[#3B5BFE] border border-[rgba(255,255,255,0.2)] rounded-xl shadow-xl z-10 py-1 min-w-[120px]">
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.1)] flex items-center gap-2 text-[#364153] dark:text-white">
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => { onDelete(job.id); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 text-red-600"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#364153] dark:text-white/80 line-clamp-1">{job.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={13} className="text-[#4a5565] dark:text-white/50" />
            <span className="text-[11px] text-[#4a5565] dark:text-white/50">Experience</span>
          </div>
          <p className="text-sm font-medium text-[#1e2939] dark:text-white">{job.experience}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={13} className="text-[#4a5565] dark:text-white/50" />
            <span className="text-[11px] text-[#4a5565] dark:text-white/50">Active Matches</span>
          </div>
          <p className="text-sm font-medium text-[#1e2939] dark:text-white">{job.activeMatches}</p>
        </div>
      </div>

      {/* Required Skills */}
      <div>
        <p className="text-[11px] text-[#4a5565] dark:text-white/50 mb-1.5">Required Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {job.requiredSkills.slice(0, maxShow).map(s => (
            <span key={s} className="bg-[#f3e8ff] dark:bg-purple-500/20 text-[#8200db] dark:text-purple-300 text-[10px] px-2 py-1 rounded-lg font-medium">{s}</span>
          ))}
          {job.requiredSkills.length > maxShow && (
            <span className="bg-[#f3f4f6] dark:bg-white/10 text-[#4a5565] dark:text-white/50 text-[10px] px-2 py-1 rounded-lg">+{job.requiredSkills.length - maxShow} more</span>
          )}
        </div>
      </div>

      {/* Preferred Skills */}
      <div>
        <p className="text-[11px] text-[#4a5565] dark:text-white/50 mb-1.5">Preferred Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {job.preferredSkills.slice(0, 3).map(s => (
            <span key={s} className="bg-[#cbfbf1] dark:bg-teal-500/20 text-[#00786f] dark:text-teal-300 text-[10px] px-2 py-1 rounded-lg font-medium">{s}</span>
          ))}
          {job.preferredSkills.length > 3 && (
            <span className="bg-[#f3f4f6] dark:bg-white/10 text-[#4a5565] dark:text-white/50 text-[10px] px-2 py-1 rounded-lg">+{job.preferredSkills.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        <button className="flex-1 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] border border-transparent rounded-lg py-2 text-sm text-[#364153] dark:text-white/80 flex items-center justify-center gap-1.5 transition">
          <Eye size={14} />
          View Matches
        </button>
        <button className="flex-1 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] border border-transparent rounded-lg py-2 text-sm text-[#364153] dark:text-white/80 flex items-center justify-center gap-1.5 transition">
          <Edit size={14} />
          Edit
        </button>
      </div>
    </div>
  );
}

// ─── Create Modal ───
function CreateJobModal({ open, onClose, onSave }: {
  open: boolean;
  onClose: () => void;
  onSave: (job: JobProfile) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || `${title} position`,
      experience: experience.trim() || '1+ years',
      activeMatches: Math.floor(Math.random() * 30) + 1,
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setTitle(''); setDescription(''); setExperience(''); setRequiredSkills(''); setPreferredSkills('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-[rgba(20,30,100,0.70)] z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#3B5BFE] border border-[rgba(255,255,255,0.2)] rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.15)]">
          <h2 className="text-lg font-bold text-[#1e2939] dark:text-white">Create Job Profile</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition">
            <X size={20} className="text-[#4a5565] dark:text-white/60" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#364153] dark:text-white/80 mb-1">Job Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior React Developer"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#1e2939] dark:text-white placeholder:text-[#6a7282] dark:placeholder:text-white/40 focus:outline-none focus:border-[rgba(173,70,255,0.5)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#364153] dark:text-white/80 mb-1">Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the role"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#1e2939] dark:text-white placeholder:text-[#6a7282] dark:placeholder:text-white/40 focus:outline-none focus:border-[rgba(173,70,255,0.5)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#364153] dark:text-white/80 mb-1">Experience</label>
            <input
              value={experience}
              onChange={e => setExperience(e.target.value)}
              placeholder="e.g. 3+ years"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#1e2939] dark:text-white placeholder:text-[#6a7282] dark:placeholder:text-white/40 focus:outline-none focus:border-[rgba(173,70,255,0.5)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#364153] dark:text-white/80 mb-1">Required Skills (comma separated)</label>
            <input
              value={requiredSkills}
              onChange={e => setRequiredSkills(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#1e2939] dark:text-white placeholder:text-[#6a7282] dark:placeholder:text-white/40 focus:outline-none focus:border-[rgba(173,70,255,0.5)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#364153] dark:text-white/80 mb-1">Preferred Skills (comma separated)</label>
            <input
              value={preferredSkills}
              onChange={e => setPreferredSkills(e.target.value)}
              placeholder="e.g. TypeScript, Docker, AWS"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#1e2939] dark:text-white placeholder:text-[#6a7282] dark:placeholder:text-white/40 focus:outline-none focus:border-[rgba(173,70,255,0.5)]"
            />
          </div>
        </div>

        <div className="p-5 border-t border-[rgba(255,255,255,0.15)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#364153] dark:text-white/80 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#ad46ff] to-[#00bba7] hover:shadow-lg disabled:opacity-50 transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───
export default function ATSDashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>('jobs');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<JobProfile[]>(initialJobs);
  const [showCreate, setShowCreate] = useState(false);

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
      j.preferredSkills.some(s => s.toLowerCase().includes(q))
    );
  }, [jobs, search]);

  const handleDelete = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleCreate = (job: JobProfile) => {
    setJobs(prev => [job, ...prev]);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(148deg, rgb(250,245,255) 0%, rgb(239,246,255) 50%, rgb(240,253,250) 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-45px] left-[13px] w-[268px] h-[268px] bg-[#dab2ff] rounded-full blur-[80px] opacity-30 pointer-events-none" />
      <div className="absolute top-[-30px] right-[-50px] w-[264px] h-[264px] bg-[#46ecd5] rounded-full blur-[80px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[0px] left-[-2px] w-[245px] h-[245px] bg-[#8ec5ff] rounded-full blur-[80px] opacity-30 pointer-events-none" />

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 p-2 rounded-xl bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, rgb(152,16,250) 0%, rgb(0,150,137) 100%)' }}
              >
                Job Postings
              </h1>
              <p className="text-sm text-[#4a5565] dark:text-white/60 mt-1">
                Manage job profiles and requirements for resume analysis.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#ad46ff] to-[#00bba7] hover:shadow-lg hover:shadow-purple-500/20 transition-all shrink-0"
            >
              <Plus size={17} />
              Create Job Profile
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.2)] rounded-2xl p-5 mb-6 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.15)]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99a1af] dark:text-white/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search job profiles..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.3)] text-[#1e2939] dark:text-white placeholder:text-[#6a7282] dark:placeholder:text-white/40 focus:outline-none focus:border-[rgba(173,70,255,0.5)] transition"
              />
            </div>
          </div>

          {/* Job Cards Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.2)] rounded-2xl p-12 text-center shadow-[0px_8px_32px_0px_rgba(31,38,135,0.15)]">
              <Briefcase size={48} className="mx-auto text-[#4a5565] dark:text-white/30 mb-4" />
              <p className="text-lg font-medium text-[#1e2939] dark:text-white mb-2">No job profiles found</p>
              <p className="text-sm text-[#4a5565] dark:text-white/50">
                {search ? 'Try a different search term.' : 'Create your first job profile to get started.'}
              </p>
            </div>
          )}

          {/* Stats footer */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.15)] rounded-xl px-4 py-3 flex items-center gap-2">
              <Briefcase size={16} className="text-[#ad46ff]" />
              <span className="text-sm text-[#364153] dark:text-white/80">
                <span className="font-semibold">{jobs.length}</span> Job Profiles
              </span>
            </div>
            <div className="bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.15)] rounded-xl px-4 py-3 flex items-center gap-2">
              <Users size={16} className="text-[#00bba7]" />
              <span className="text-sm text-[#364153] dark:text-white/80">
                <span className="font-semibold">{jobs.reduce((sum, j) => sum + j.activeMatches, 0)}</span> Total Matches
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Create Modal */}
      <CreateJobModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
