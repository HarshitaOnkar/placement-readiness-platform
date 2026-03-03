import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import Assessments from './pages/Assessments'
import Resources from './pages/Resources'
import Profile from './pages/Profile'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import History from './pages/History'
import TestChecklist from './pages/TestChecklist'
import ShipPage from './pages/Ship'
import Proof from './pages/Proof'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/prp/07-test" element={<TestChecklist />} />
      <Route path="/prp/08-ship" element={<ShipPage />} />
      <Route path="/prp/proof" element={<Proof />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="practice" element={<Practice />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="results" element={<Results />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  )
}
