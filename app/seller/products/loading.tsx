export default function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>

        {/* Search skeleton */}
        <div className="h-20 bg-gray-200 rounded"></div>

        {/* Products grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
