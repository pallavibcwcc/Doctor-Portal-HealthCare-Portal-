import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useState } from 'react'

export function PatientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Patients</h1>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <p className="text-gray-600">No patients added yet. Create your first patient record.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
