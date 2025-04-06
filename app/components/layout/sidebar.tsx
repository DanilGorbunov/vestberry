import Link from "next/link"
import { 
  BarChart2, 
  Briefcase, 
  FileText, 
  FolderOpen, 
  GitBranch, 
  HelpCircle, 
  History, 
  PieChart,
  Settings,
  Table
} from "lucide-react"

const navigationItems = [
  {
    title: "Fund Overview",
    icon: PieChart,
    href: "/",
  },
  {
    title: "Portfolio",
    icon: Briefcase,
    href: "/portfolio",
    subItems: [
      { title: "Investments", href: "/portfolio/investments" },
      { title: "Summary", href: "/portfolio/summary" },
      { title: "KPI Overview", href: "/portfolio/kpi-overview" },
    ],
  },
  {
    title: "Fund Management",
    icon: Settings,
    href: "/fund-management",
  },
  {
    title: "Forecasting",
    icon: BarChart2,
    href: "/forecasting",
  },
  {
    title: "Registry",
    icon: Table,
    href: "/registry",
    subItems: [
      { title: "FX Rates", href: "/registry/fx-rates" },
      { title: "Files", href: "/registry/files" },
    ],
  },
  {
    title: "Fund Analytics",
    icon: GitBranch,
    href: "/fund-analytics",
  },
  {
    title: "Audit Trail",
    icon: History,
    href: "/audit-trail",
  },
  {
    title: "Knowledge Hub",
    icon: HelpCircle,
    href: "/knowledge-hub",
  },
  {
    title: "Excel add-in",
    icon: FileText,
    href: "/excel-add-in",
  },
  {
    title: "Release notes",
    icon: FolderOpen,
    href: "/release-notes",
  },
]

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#2A2F3C] text-white flex-shrink-0">
      <div className="p-4 sticky top-0">
        <div className="text-xl font-bold mb-8">VESTBERRY</div>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <div key={item.title} className="mb-2">
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </Link>
              {item.subItems && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="block py-1 text-sm text-gray-400 hover:text-white"
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
} 