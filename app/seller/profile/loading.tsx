import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 animate-pulse" />
      </div>

      {/* En-tête du profil skeleton */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-muted rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-6 bg-muted rounded w-20 animate-pulse" />
              <div className="h-6 bg-muted rounded w-24 animate-pulse" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    </div>
  )
}
