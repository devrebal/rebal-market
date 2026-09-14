import { CreateWizard } from '@/components/create-wizard'

export const metadata = { title: 'Create Portfolio — REBAL' }

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <CreateWizard />
    </div>
  )
}
