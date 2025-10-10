import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface TrendData {
    date: string;
    day: string;
    short_date: string;
    messages: number;
}

interface BookingTrendsChartProps {
    data: TrendData[];
    loading?: boolean;
}

export function BookingTrendsChart({ data, loading }: BookingTrendsChartProps) {
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-muted-foreground">
                    Loading chart...
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-muted-foreground">
                    No data available
                </div>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient
                        id="colorMessages"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="#f53003"
                            stopOpacity={0.3}
                        />
                        <stop
                            offset="95%"
                            stopColor="#f53003"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                    dataKey="short_date"
                    className="text-xs text-muted-foreground"
                    tick={{ fill: 'currentColor' }}
                    tickLine={false}
                />
                <YAxis
                    className="text-xs text-muted-foreground"
                    tick={{ fill: 'currentColor' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--card-foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#f53003"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMessages)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
