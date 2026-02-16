import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../components/ui/ShadcnCard';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const READINESS_SCORE = 72;
const READINESS_MAX = 100;
const circumference = 2 * Math.PI * 45;
const strokeDashOffset = circumference - (READINESS_SCORE / READINESS_MAX) * circumference;

const skillData = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
];

const weekDays = [
  { label: 'Mon', active: true },
  { label: 'Tue', active: true },
  { label: 'Wed', active: false },
  { label: 'Thu', active: true },
  { label: 'Fri', active: true },
  { label: 'Sat', active: false },
  { label: 'Sun', active: false },
];

const assessments = [
  { title: 'DSA Mock Test', when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', when: 'Friday, 11:00 AM' },
];

function OverallReadiness() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-primary"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashOffset,
                animation: 'readiness-fill 0.8s ease-out forwards',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">
              {READINESS_SCORE}/{READINESS_MAX}
            </span>
            <span className="text-sm text-slate-500 mt-0.5">Readiness Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ContinuePractice() {
  const completed = 3;
  const total = 10;
  const pct = (completed / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
        <p className="text-sm text-slate-500">Last topic</p>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-slate-900">Dynamic Programming</p>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {completed}/{total} completed
        </p>
      </CardContent>
      <CardFooter>
        <Link
          to="/dashboard/practice"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Continue
        </Link>
      </CardFooter>
    </Card>
  );
}

function WeeklyGoals() {
  const solved = 12;
  const target = 20;
  const pct = (solved / target) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-600">
            Problems Solved: <span className="font-semibold text-slate-900">{solved}/{target}</span> this week
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          {weekDays.map(({ label, active }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1"
              title={active ? 'Activity' : 'No activity'}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  active
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {label.slice(0, 1)}
              </div>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {assessments.map(({ title, when }) => (
            <li
              key={title}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-4 last:pb-0 border-b border-slate-100 last:border-0"
            >
              <span className="font-medium text-slate-900">{title}</span>
              <span className="text-sm text-slate-500">{when}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-slate-600">Your placement readiness at a glance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallReadiness />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
        <div className="lg:col-span-2">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  );
}
