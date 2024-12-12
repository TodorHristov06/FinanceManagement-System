type Props = {
    data?: {
        data: string;
        income: number;
        expenses: number;
    }[];
};

export const Chart = ({ data = [] }: Props) => {
    return (
        <div>
            Chart
        </div>
    )
}