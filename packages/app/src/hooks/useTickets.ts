'use client'

import { GetParticipations } from "@/services/protocol"
import { useAccount, useNetwork } from "wagmi"
import { useQuery } from "@tanstack/react-query"

export function useTickets() {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const { data, isError, isPending } = useQuery({
        queryKey: ['tickets', address, chain?.id],
        queryFn: async () => await GetParticipations(address, chain?.id)
    })

    return {
        data,
        isPending,
        isError
    }
}