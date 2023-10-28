'use client'

import { GetRecords } from "@/services/protocol"
import { useQuery } from "@tanstack/react-query"
import { Status } from "@/utils/types"
import { useNetwork } from "wagmi"

export function useEvents() {
    const { chain } = useNetwork()
    const { data, isError, isPending } = useQuery({
        queryKey: ['events', chain?.id],
        queryFn: async () => await GetRecords({ status: Status.Active }, chain?.id)
    })

    return {
        data,
        isPending,
        isError
    }
}