import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
    account: string; // Account name to display
    accountId: string; // Account ID for opening details
};

export const AccountColumn = ({ 
    account, 
    accountId
}: Props) => {
    const { onOpen: onOpenAccount } = useOpenAccount(); // Hook to open account details
    const onClick = () => {
        onOpenAccount(accountId) // Open account details on click
    }
    return (
        <div 
        onClick={onClick}
        className="flex items-center cursor-pointer hover:underline" // Clickable text styling
        >
            {account}
        </div>
    )
}