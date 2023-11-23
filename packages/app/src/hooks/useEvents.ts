import { GetRecords } from "@/services/protocol"
import { useQuery } from "@tanstack/react-query"
import { Status } from "@/utils/types"
import { CONFIG } from "@/utils/config"

export function useEvents() {
    const { data, isError, isPending } = useQuery({
        queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID, 'upcoming'],
        queryFn: () => GetRecords({ status: Status.Active, past: false }, CONFIG.DEFAULT_CHAIN_ID)
    })

    return {
        data,
        isPending,
        isError
    }
}

export function useMyEvents(address: string) {
    const { data, isError, isPending } = useQuery({
        queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID, address],
        queryFn: () => GetRecords({ createdBy: address }, CONFIG.DEFAULT_CHAIN_ID)
    })

    return {
        data,
        isPending,
        isError
    }
}