import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3 } from 'lucide-react';

const features = [
  {
    title: 'Practice Problems',
    description: 'Sharpen your skills with curated problems and real-time feedback.',
    icon: Code2,
  },
  {
    title: 'Mock Interviews',
    description: 'Simulate real interviews with timed sessions and video practice.',
    icon: Video,
  },
  {
    title: 'Track Progress',
    description: 'Monitor your growth with detailed analytics and milestones.',
    icon: BarChart3,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <section className="px-6 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Ace Your Placement
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
            Practice, assess, and prepare for your dream job
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </section>

        <section className="px-6 py-16 md:py-20 border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 border-t border-slate-200 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
}
