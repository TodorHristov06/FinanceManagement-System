import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatPercentage } from "@/lib/utils";

const COLORS = ["#0066FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
    data?: {
        name: string;
        value: number;
    }[];
};

export const PieVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Legend/>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                >
                    {data?.map((_entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}