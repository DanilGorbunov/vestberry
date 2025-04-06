import Link from "next/link"
import { Search, Clock, Bell, User } from "lucide-react"

const tabs = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Investment", href: "/investment" },
  { name: "Company Profile", href: "/company-profile" },
  { name: "Live KPIs", href: "/live-kpis" },
  { name: "Notes", href: "/notes" },
  { name: "Files", href: "/files" },
  { name: "Analysis", href: "/analysis" },
  { name: "Suite Spot", href: "/suite-spot" },
]

const subTabs = [
  { name: "Securities", href: "/securities" },
  { name: "Stakeholders", href: "/stakeholders" },
  { name: "Rounds & Positions", href: "/rounds-positions" },
  { name: "Ledger", href: "/ledger" },
  { name: "Cap Table", href: "/cap-table" },
  { name: "Waterfall", href: "/waterfall", current: true },
]

export function Header() {
  return (
    <div className="border-b">
      <header className="h-14 bg-white flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <nav className="flex items-center space-x-1">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              HERMES Fund I
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/investments" className="text-sm text-gray-600 hover:text-gray-900">
              Investments
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-900">Slavo - initial v follow-on</span>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Clock className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <User className="w-5 h-5" />
            <span className="text-sm">Clark</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="bg-white px-4">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="bg-gray-50 px-4">
        <nav className="flex space-x-8">
          {subTabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${
                tab.current
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 