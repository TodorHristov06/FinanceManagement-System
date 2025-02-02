import { format } from "date-fns";
import { Tooltip, XAxis, BarChart, Bar, ResponsiveContainer, CartesianGrid } from "recharts";
import { CustomTooltip } from "@/components/custom-tooltip";

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[]; // Data structure for income and expenses over time
};

export const BarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
                <Bar
                    dataKey="income"
                    fill="#3d82f6"
                    className="drop=shadow-sm"
                />
                <Bar
                    dataKey="expenses"
                    fill="#f43f5e"
                    className="drop=shadow-sm"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}