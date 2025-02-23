import { AccountFilter } from "@/components/account-filter"
import { DateFilter } from "@/components/date-filter"

// The Filters component combines the AccountFilter and DateFilter components
// to allow the user to filter data based on account and date range
export const Filters = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
            <AccountFilter/>
            <DateFilter/>
        </div>
    )
}