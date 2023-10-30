'use client'

import { GetRecord } from "@/services/protocol"
import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "wagmi"

interface Props {
    id: string
}

export function useEvent(props: Props) {
    const { chain } = useNetwork()
    const { data, isError, isPending } = useQuery({
        queryKey: ['events', props.id, chain?.id],
        queryFn: () => GetRecord(props.id, chain?.id)
    })

    return {
        data,
        isPending,
        isError
    }
}