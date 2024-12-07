"use client"; // This ensures the component is rendered on the client side

import { Button } from "@/components/ui/button"; // Importing the Button component
import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts"; // Importing the custom hook for opening a new account form

export default function Home() {
  const { onOpen } = useNewAccounts(); // Destructuring the onOpen function from the useNewAccounts hook
  return (
      <div>
        <Button onClick={onOpen}> {/* Button that triggers the onOpen function when clicked */}
            Add an account
        </Button>
      </div>
  );
};
