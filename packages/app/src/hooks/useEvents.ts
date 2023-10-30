'use client'

import { GetRecords, GetRecordsWhere } from "@/services/protocol"
import { useQuery } from "@tanstack/react-query"
import { Status } from "@/utils/types"
import { useNetwork } from "wagmi"

export function useEvents(params: GetRecordsWhere = { status: Status.Active }) {
    const { chain } = useNetwork()
    const { data, isError, isPending } = useQuery({
        queryKey: ['events', chain?.id],
        queryFn: () => GetRecords(params, chain?.id)
    })

    return {
        data,
        isPending,
        isError
    }
}