import { Protected } from "@/components/Protected"
import { Overview } from "./components/Overview"

export default function TicketsPage() {
  return <>
    <Protected>
      <Overview />
    </Protected>
  </>
}
