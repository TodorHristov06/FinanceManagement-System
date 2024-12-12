import { format } from "date-fns";
import { Tooltip, XAxis, LineChart, Line, ResponsiveContainer, CartesianGrid } from "recharts";
import { CustomTooltip } from "@/components/custom-tooltip";

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

export const LineVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => {
                        const date = new Date(value); // Ensure the value is parsed as a Date object
                        return isNaN(date.getTime()) ? "Invalid Date" : format(date, "dd MMM");
                    }}
                    style={{ fontSize: 12 }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomTooltip />}/>
                <Line
                    dot={false}
                    dataKey="income"
                    stroke="#3d82f6"
                    strokeWidth={2}
                    className="drop=shadow-sm"
                />
                <Line
                    dot={false}
                    dataKey="expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    className="drop=shadow-sm"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}