import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NotificationSettingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-px w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
