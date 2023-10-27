'use client'

import { GetParticipations } from "@/services/protocol"
import { useAccount, useNetwork } from "wagmi"
import useSWR from "swr"

export function useTickets() {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const { data, error, isLoading } = useSWR(['participations', address, chain?.id], async () => await GetParticipations(address, chain?.id))

    return {
        data,
        isLoading,
        error
    }
}