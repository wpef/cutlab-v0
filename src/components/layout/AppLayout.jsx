import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <TopNav />
      <main className="app-layout-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
