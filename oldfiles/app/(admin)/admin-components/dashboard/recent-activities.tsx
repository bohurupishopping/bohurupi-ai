import { Card, CardContent, CardHeader, CardTitle } from "@/app/global/ui/card";
import { ScrollArea } from "@/app/global/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/global/ui/avatar";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  className?: string;
}

export function RecentActivities({ activities, className }: RecentActivitiesProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>
                    {activity.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 