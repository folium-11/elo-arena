import Arena from '@/components/Arena'
import AdminPanel from '@/components/AdminPanel'
import SuperAdminPanel from '@/components/SuperAdminPanel'
import Contributions from '@/components/Contributions'
import SignInGate from '@/components/SignInGate'

export default function Page() {
  return (
    <div className="space-y-6">
      <SignInGate />
      <Arena />
      <AdminPanel />
      <SuperAdminPanel />
      <Contributions />
    </div>
  )
}
