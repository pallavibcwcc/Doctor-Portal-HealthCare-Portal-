import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, LayoutDashboard, Users, Calendar, BarChart3, Settings, Stethoscope, HeartHandshake, ClipboardList, Baby } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Patients', href: '/patients' },
  { icon: Calendar, label: 'Appointments', href: '/appointments' },
  { icon: HeartHandshake, label: 'Gyn. Visits', href: '/gynecological-visits' },
  { icon: Baby, label: 'Obstetric History', href: '/obstetric-history' },
  { icon: ClipboardList, label: 'Diagnosis', href: '/diagnosis-management' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-indigo-900 text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-800">
          {isOpen && (
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6" />
              <span className="font-bold text-lg">DocPortal</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-indigo-800 rounded-lg transition-colors ml-auto"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-indigo-600 hover:bg-indigo-600",
                    !isActive && "text-indigo-100 hover:text-white hover:bg-indigo-800"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="p-4 border-t border-indigo-800 text-xs text-indigo-200">
            <p>© 2024 Doctor Portal</p>
            <p>v1.0.0</p>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}
    </>
  )
}
