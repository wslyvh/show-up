import { Record } from "@/utils/types"
import { QRCodeSVG } from 'qrcode.react';

interface Props {
    record: Record
}

export function Ticket(props: Props) {
    return (
        <div>
            <article className="w-full flex-grow flex items-center">
                <div className="flex w-full text-zinc-900 h-64">
                    <div className="h-full bg-white flex items-center justify-center px-12 rounded-xl">
                        <QRCodeSVG value="https://showup.events/" level="Q" />
                    </div>

                    {/* <div className='relative h-full flex flex-col items-center py-2'>
                        <div className="h-full border border-2 border-dashed bg-white border-base-100"></div>
                    </div> */}

                    <div className='relative h-full flex flex-col items-center border-dashed justify-between border-2 bg-white border-base-100'>
                        <div className="absolute rounded-full w-8 h-8 bg-base-100 -top-6"></div>
                        <div className="absolute rounded-full w-8 h-8 bg-base-100 -bottom-6"></div>
                    </div>

                    <div className="h-full py-8 px-10 bg-white flex-grow rounded-xl flex flex-col">
                        <div className="w-full">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="flex-grow text-4xl font-bold text-primary">Show Up Event</span>
                                    <span className="badge badge-info badge-outline">Paid</span>
                                    <span className="badge badge-success badge-outline">Settled</span>
                                    <span className="badge badge-error badge-outline">Cancelled</span>
                                </div>
                                <span className="text-zinc-500 text-sm">Devconnect, Istanbul</span>
                            </div>
                        </div>
                        <div className="flex w-full h-full flex-col flex-grow justify-end gap-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-neutral-400">Date</span>
                                <span className="font-mono">09/06/2023</span>
                            </div>
                            <div className="flex flex-row gap-4 justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-400">Address</span>
                                    <span className="font-mono">wslyvh.eth</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-neutral-400">Deposit</span>
                                    <span className="font-mono">0.02 Eth</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}