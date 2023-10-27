'use client'

import { GetRecords } from "@/services/protocol"
import { useNetwork } from "wagmi"
import useSWR from "swr"
import { Status } from "@/utils/types"

export function useEvents() {
    const { chain } = useNetwork()
    const { data, error, isLoading } = useSWR(['events', chain?.id],
        async () => await GetRecords({ status: Status.Active }, chain?.id))

    return {
        data,
        isLoading,
        error
    }
}