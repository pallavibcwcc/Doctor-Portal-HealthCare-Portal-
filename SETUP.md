# Doctor Portal - Setup Documentation

A complete doctor management portal with authentication, routing, and collapsible sidebar built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

✅ **Authentication System**
- Login page with mock authentication (accepts any credentials)
- Signup page with password validation
- Protected routes with automatic redirection
- Session persistence with localStorage
- Logout functionality

✅ **Doctor Dashboard**
- Welcome page with quick stats
- Responsive layout with navbar and sidebar
- Stats cards for patients, appointments, consultations

✅ **Navigation**
- Sticky navbar with user info and logout button
- Collapsible/expandable sidebar (toggle button)
- Active route highlighting in sidebar
- Fully responsive design (mobile, tablet, desktop)

✅ **Pages Created**
- 📊 Dashboard - Main overview page
- 👥 Patients - Patient management
- 📅 Appointments - Appointment scheduling
- 📈 Reports - Analytics and reports
- ⚙️ Settings - Portal settings
- 🔐 Login/Signup - Authentication pages

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx              # shadcn Button component
│   │   ├── card.tsx                # shadcn Card component
│   │   ├── input.tsx               # shadcn Input component
│   │
│   ├── Navbar.tsx                  # Top navigation bar with user menu
│   ├── Sidebar.tsx                 # Collapsible sidebar with menu
│   └── ProtectedRoute.tsx           # Route guard component
│
├── contexts/
│   └── AuthContext.tsx             # Authentication context & hooks
│
├── pages/
│   ├── LoginPage.tsx               # Doctor login
│   ├── SignupPage.tsx              # Account creation
│   ├── DashboardPage.tsx           # Main dashboard
│   ├── PatientsPage.tsx            # Patients management
│   ├── AppointmentsPage.tsx        # Appointments management
│   ├── ReportsPage.tsx             # Reports & analytics
│   ├── SettingsPage.tsx            # Settings
│   └── NotFoundPage.tsx            # 404 page
│
├── routes/
│   └── index.tsx                   # All routes configuration
│
├── lib/
│   └── utils.ts                    # cn() utility for classnames
│
├── App.tsx                         # Main component
├── main.tsx                        # React entry
└── index.css                       # Global styles
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.0.0 |
| **Language** | TypeScript 5.7 |
| **Build** | Vite 6.4.1 |
| **Styling** | Tailwind CSS 4.2 |
| **UI Components** | shadcn/ui (Radix UI) |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **State** | Context API |

## 📦 Installed Dependencies

### Core
- react: ^19.0.0
- react-dom: ^19.0.0
- react-router-dom: ^7.14.0
- typescript: ~5.7.2

### UI & Styling
- tailwindcss: ^4.2.2
- @tailwindcss/vite: ^4.2.2
- lucide-react: (icons)
- class-variance-authority: (component variants)
- clsx: (classname utility)
- tailwind-merge: (Tailwind merge)

### Components (shadcn/ui)
- @radix-ui/react-slot
- @radix-ui/react-dropdown-menu
- @radix-ui/react-dialog

### Build Tools
- @vitejs/plugin-react: ^4.3.4
- vite: ^6.3.1

### Development
- eslint: ^9.22.0
- @types/react: ^19.0.10
- @types/react-dom: ^19.0.4

## 🔐 Authentication Flow

### Login
```
User enters credentials → Mock auth (accepts any) → Token stored → 
Redirect to dashboard → ProtectedRoute checks auth → Access granted
```

### Signup
```
Fill form → Validate password → Create account → 
Auto-login → Redirect to dashboard
```

### Protected Routes
```
ProtectedRoute checks isAuthenticated → 
Yes: Render component → 
No: Redirect to /login
```

### Session
```
Data stored in localStorage['doctorUser']
Persists on page refresh
Cleared on logout
```

## 🗺️ Routes Map

| Path | Type | Component | Purpose |
|------|------|-----------|---------|
| `/` | Public | Redirect | Redirects to `/dashboard` |
| `/login` | Public | LoginPage | Doctor login |
| `/signup` | Public | SignupPage | Create new account |
| `/dashboard` | Protected | DashboardPage | Dashboard & overview |
| `/patients` | Protected | PatientsPage | Patient list & management |
| `/appointments` | Protected | AppointmentsPage | Appointments |
| `/reports` | Protected | ReportsPage | Analytics & reports |
| `/settings` | Protected | SettingsPage | Doctor settings |
| `*` | Any | NotFoundPage | 404 page |

## 🎯 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Opens at `http://localhost:5174/` (or next available port)

### 3. Test Login
1. Go to `/login`
2. Enter any email: `doctor@example.com`
3. Enter any password: `password123`
4. Click Login
5. Redirected to Dashboard

### 4. Test Signup
1. Go to `/signup`
2. Fill in details
3. Passwords must match and be 6+ characters
4. Auto-logged in to dashboard

### 5. Test Sidebar
- Click menu icon in navbar
- Sidebar collapses/expands
- Responsive on mobile
- Routes highlight active page

## 🎨 UI Components (shadcn/ui Style)

All components use modern shadcn/ui patterns with Radix UI + Tailwind:

### Button
```tsx
<Button variant="default" size="lg">Click me</Button>
// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Input
```tsx
<Input 
  type="email" 
  placeholder="Email" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

## 🔧 Key Configuration

### TypeScript Path Alias (@)
```typescript
// tsconfig.app.json
"paths": {
  "@/*": ["src/*"]
}

// vite.config.ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}

// Usage
import { Button } from '@/components/ui/button'
```

### Tailwind CSS
- Config: `tailwind.config.ts`
- Imported in: `src/index.css`
- Using Tailwind container queries
- Responsive utilities: sm, md, lg, xl, 2xl

## 🎮 Component Examples

### Using ProtectedRoute
```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Using useAuth Hook
```tsx
const { user, login, logout, isAuthenticated } = useAuth()
```

### Creating New Pages
```tsx
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'

export function MyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main>Your content</main>
      </div>
    </div>
  )
}
```

## 📱 Design Features

✅ **Responsive Layout**
- Mobile: Sidebar hidden by default, toggle via menu
- Tablet: Sidebar togglable
- Desktop: Full sidebar visible

✅ **Color Scheme**
- Primary: Blue (indigo-600, indigo-900)
- Text: Slate gray (gray-900, gray-700)
- Backgrounds: White, gray-50

✅ **Spacing & Typography**
- Consistent Tailwind spacing (4px, 8px, 12px...)
- Font sizes: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
- Weight: font-medium, font-semibold, font-bold

## 🔄 State Management

### AuthContext
- Provides: `user`, `isAuthenticated`, `login()`, `signup()`, `logout()`
- Storage: localStorage with `doctorUser` key
- Hooks: `useAuth()`

### Component State
- Page-level: `useState` for sidebar toggle, form inputs
- Form validation: Local state

## 🚀 Build & Deployment

### Build
```bash
npm run build
```
Outputs to `dist/` folder

### Preview
```bash
npm run preview
```
Shows production build locally

### Deploy
- Vercel: `vercel deploy`
- Netlify: Drag & drop `dist/` folder
- GitHub Pages: Build & upload `dist/`
- Any static host: Upload `dist/` contents

## 🐛 Troubleshooting

### Port Already in Use
Dev server auto-selects next port (5173→5174→5175...)

### Build Fails
```bash
# Clear and reinstall
rm -rf node_modules
npm install
npm run build
```

### Sidebar Not Toggling
Ensure `useState` for sidebar state is in same component level

### Routes Not Working
Check `<BrowserRouter>` wraps all routes in `src/routes/index.tsx`

## 📝 Styling Guide

### Tailwind Best Practices
1. Use utility classes directly: `className="p-4 bg-white rounded"`
2. Use `cn()` for conditional classes: `cn("px-4", isActive && "bg-blue")`
3. Responsive: `md:px-6 lg:px-8`
4. Dark mode: `dark:bg-slate-900` (if enabled)

### Color System
- Primary action: `bg-blue-600`
- Secondary action: `bg-gray-200`
- Borders: `border-gray-300`
- Text: `text-gray-900` (dark), `text-gray-600` (light)

## 🎯 Next Steps

1. **Add Real Authentication:** Connect to backend API
2. **Database Integration:** Add patient/appointment data
3. **Forms:** Build data entry forms
4. **Notifications:** Add toast/alert system
5. **Printing:** Add report printing functionality
6. **Export:** CSV/PDF export features
7. **Search:** Patient/appointment search
8. **Filters:** Advanced filtering options

---

**Setup Complete! Ready to extend your Doctor Portal 🏥**
