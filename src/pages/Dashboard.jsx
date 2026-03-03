import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { Link } from 'react-router-dom'

const READINESS_SCORE = 72
const READINESS_MAX = 100
const CIRCLE_R = 40
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R
const DASH_OFFSET = CIRCLE_CIRCUMFERENCE * (1 - READINESS_SCORE / 100)

const skillData = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
]

const WEEK_DAYS = [
  { label: 'Mon', active: true },
  { label: 'Tue', active: true },
  { label: 'Wed', active: true },
  { label: 'Thu', active: true },
  { label: 'Fri', active: false },
  { label: 'Sat', active: false },
  { label: 'Sun', active: false },
]

const upcomingAssessments = [
  { title: 'DSA Mock Test', when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', when: 'Friday, 11:00 AM' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600 text-sm">Your placement readiness at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
            <CardDescription>Your current readiness score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <svg
                className="w-full h-full -rotate-90"
                viewBox={`0 0 ${CIRCLE_R * 2 + 10} ${CIRCLE_R * 2 + 10}`}
              >
                <circle
                  cx={CIRCLE_R + 5}
                  cy={CIRCLE_R + 5}
                  r={CIRCLE_R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200"
                />
                <circle
                  cx={CIRCLE_R + 5}
                  cy={CIRCLE_R + 5}
                  r={CIRCLE_R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  strokeDashoffset={DASH_OFFSET}
                  className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {READINESS_SCORE}/{READINESS_MAX}
                </span>
                <span className="text-sm text-gray-500 mt-0.5">Readiness Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Scores across key areas (0–100)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#8B0000"
                    fill="#8B0000"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-gray-900">Dynamic Programming</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Progress</span>
                <span>3/10 completed</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: '30%' }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              to="/dashboard/practice"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Continue
            </Link>
          </CardFooter>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>This week&apos;s activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Problems Solved</span>
                <span className="font-medium text-gray-900">12/20 this week</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-1">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${
                      day.active ? 'bg-primary' : 'border-2 border-gray-200 bg-transparent'
                    }`}
                  />
                  <span className="text-xs text-gray-500">{day.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments - full width on 2-col grid */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Scheduled tests and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {upcomingAssessments.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
