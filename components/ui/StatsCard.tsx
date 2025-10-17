import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  testId?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-purple-600',
  gradient = 'from-purple-500 to-pink-500',
  trend,
  testId,
}: StatsCardProps) {
  return (
    <div
      className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
      data-testid={testId}
    >
      {/* Background Gradient */}
      <div className={cn('absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full transition-all duration-500 group-hover:scale-150', gradient)} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          </div>
          <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', gradient)}>
            <Icon className="text-white" size={24} />
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'text-sm font-semibold',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
