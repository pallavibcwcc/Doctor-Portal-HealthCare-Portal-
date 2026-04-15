import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useState } from 'react'

export function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Welcome to Doctor Portal</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">12</div>
                <p className="text-slate-600">Total Patients</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-slate-600">Appointments Today</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">8</div>
                <p className="text-slate-600">Consultations</p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li className="text-slate-700">📋 View all patients</li>
                <li className="text-slate-700">📅 Schedule appointments</li>
                <li className="text-slate-700">📊 View reports</li>
                <li className="text-slate-700">⚙️ Settings</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
