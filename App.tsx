import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  ExternalLink,
  Code2,
  Terminal,
  Sparkles,
  Copy,
  Check,
  Rocket,
  Layers,
  User,
  FolderGit2,
  ChevronRight,
  Settings2,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Star
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: 'Web' | 'Fullstack' | 'UI/UX';
  githubUrl: string;
  demoUrl: string;
  stars: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'projects' | 'github-guide' | 'editor'>('portfolio');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: 'Radha Krishna Raj',
    role: 'Full Stack Web Developer',
    bio: 'Passionate developer building fast, modern, and beautiful single-page web applications.',
    githubUsername: 'radhakrishnaraj',
    email: 'radhakrishnaraj0012@gmail.com',
    skills: [
      { name: 'React 19', category: 'Frontend' },
      { name: 'TypeScript', category: 'Language' },
      { name: 'Tailwind CSS v4', category: 'Styling' },
      { name: 'Vite', category: 'Build Tool' },
      { name: 'Git & GitHub Pages', category: 'DevOps' },
    ]
  });

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Minimalist Web Application',
      description: 'Ultra-lightweight single-page web app optimized for instant loading and GitHub Pages deployment.',
      tags: ['React', 'Tailwind', 'TypeScript', 'Vite'],
      category: 'Web',
      githubUrl: 'https://github.com/radhakrishnaraj',
      demoUrl: '#',
      stars: 12
    },
    {
      id: '2',
      title: 'Fullstack Express Engine',
      description: 'High-performance Node server with server-side AI integration and lightweight client bundle.',
      tags: ['Express', 'Node.js', 'React'],
      category: 'Fullstack',
      githubUrl: 'https://github.com/radhakrishnaraj',
      demoUrl: '#',
      stars: 8
    }
  ]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tags: 'React, Tailwind',
    category: 'Web' as 'Web' | 'Fullstack' | 'UI/UX',
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com'
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      category: newProject.category,
      githubUrl: newProject.githubUrl,
      demoUrl: newProject.demoUrl,
      stars: 1
    };
    setProjects([project, ...projects]);
    setNewProject({
      title: '',
      description: '',
      tags: 'React, Tailwind',
      category: 'Web',
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com'
    });
    setActiveTab('projects');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 leading-tight text-base sm:text-lg">{profile.name}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live single-page project
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'portfolio', label: 'Overview', icon: User },
              { id: 'projects', label: 'Projects', icon: FolderGit2 },
              { id: 'github-guide', label: 'GitHub Live', icon: Rocket },
              { id: 'editor', label: 'Customize', icon: Settings2 },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'portfolio' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Minimum Files • GitHub Pages Ready
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{profile.name}</span>
                </h2>
                <p className="text-lg text-indigo-200/90 font-medium">{profile.role}</p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{profile.bio}</p>
                <div className="flex gap-3 pt-2">
                  <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-medium text-xs sm:text-sm border border-slate-700">
                    <Github className="w-4 h-4" /> GitHub Profile
                  </a>
                  <button onClick={() => setActiveTab('github-guide')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs sm:text-sm">
                    <Rocket className="w-4 h-4" /> How to Publish
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" /> Technical Stack
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {profile.skills.map((skill, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-xs text-indigo-400 font-medium">{skill.category}</div>
                      <div className="text-sm font-semibold text-slate-200">{skill.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['All', 'Web', 'Fullstack', 'UI/UX'].map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 rounded-lg text-xs ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProjects.map((p) => (
                  <div key={p.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400">{p.category}</span>
                      <button onClick={() => handleDeleteProject(p.id)} className="text-slate-500 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-sm text-slate-300">{p.description}</p>
                    <div className="flex gap-2 pt-2">
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex-1 py-2 text-center rounded-xl bg-slate-800 text-xs text-slate-200">
                        Source Code
                      </a>
                      <a href={p.demoUrl} target="_blank" rel="noreferrer" className="flex-1 py-2 text-center rounded-xl bg-indigo-600 text-xs text-white">
                        Live Demo
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'github-guide' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-400" /> GitHub par Live Karne ke Command:
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-indigo-300 relative">
                  <pre>{`git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main`}</pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white">Customize Profile</h3>
              <div className="space-y-3">
                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white" placeholder="Name" />
                <input type="text" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white" placeholder="Role" />
                <button onClick={() => setActiveTab('portfolio')} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl">
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {profile.name} • Clean GitHub Web Application
      </footer>
    </div>
  );
}
