import { GetRecords, GetRecordsWhere } from "@/services/protocol"
import { useQuery } from "@tanstack/react-query"
import { Status } from "@/utils/types"
import { CONFIG } from "@/utils/config"

export function useEvents(params: GetRecordsWhere = { status: Status.Active }) {
    const { data, isError, isPending } = useQuery({
        queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID],
        queryFn: () => GetRecords(params, CONFIG.DEFAULT_CHAIN_ID)
    })

    return {
        data,
        isPending,
        isError
    }
}