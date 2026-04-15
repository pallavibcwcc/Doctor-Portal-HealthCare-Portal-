import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
                <p className="text-gray-600 mb-4">Manage your profile information and preferences</p>
                <Button>Edit Profile</Button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
                <p className="text-gray-600 mb-4">Manage your privacy settings and security options</p>
                <Button>View Settings</Button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                <p className="text-gray-600 mb-4">Configure notification preferences</p>
                <Button>Manage Notifications</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
