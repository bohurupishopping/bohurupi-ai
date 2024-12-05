import { Card, CardContent, CardHeader, CardTitle } from "@/app/global/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'violet' | 'pink' | 'blue' | 'green';
}

export function MetricCard({
  title,
  value,
  icon,
  description,
  className,
  trend,
  color = 'violet'
}: MetricCardProps) {
  const colorStyles = {
    violet: 'from-violet-500/20 to-pink-500/20 hover:from-violet-500/30 hover:to-pink-500/30',
    pink: 'from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
    green: 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30',
  };

  return (
    <Card className={cn(
      "transition-all duration-300 ease-in-out hover:shadow-lg",
      "bg-gradient-to-br",
      colorStyles[color],
      "border-none backdrop-blur-sm",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium bg-gradient-to-r from-gray-900/80 to-gray-600/80 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-lg p-1.5",
          "bg-gradient-to-br shadow-inner",
          color === 'violet' && "from-violet-500 to-pink-500 text-white",
          color === 'pink' && "from-pink-500 to-rose-500 text-white",
          color === 'blue' && "from-blue-500 to-cyan-500 text-white",
          color === 'green' && "from-emerald-500 to-teal-500 text-white",
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {value}
        </div>
        {trend && (
          <p className="text-sm mt-2 flex items-center gap-1">
            <span className={cn(
              "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium",
              trend.positive 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
            )}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-600 dark:text-gray-400">vs last month</span>
          </p>
        )}
        {description && (
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
} 