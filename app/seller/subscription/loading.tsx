import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function SubscriptionLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 animate-pulse" />
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    </div>
  )
}
