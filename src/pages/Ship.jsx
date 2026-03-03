import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { allTestsPassed } from '@/lib/testChecklistStorage.js'
import { Lock, Ship as ShipIcon, ArrowRight } from 'lucide-react'

export default function ShipPage() {
  const unlocked = allTestsPassed()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {!unlocked ? (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Lock className="w-5 h-5 text-amber-600" />
                Ship locked
              </CardTitle>
              <CardDescription>
                Complete all tests on the Test Checklist before shipping.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">
                Go to the Test Checklist, run each test, and check all 10 items. Then return here to ship.
              </p>
              <Link
                to="/prp/07-test"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
              >
                Open test checklist <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShipIcon className="w-5 h-5 text-primary" />
                Ready to ship
              </CardTitle>
              <CardDescription>
                All tests passed. You can ship the Placement Readiness Platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                The test checklist is complete. Proceed with your release process.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
