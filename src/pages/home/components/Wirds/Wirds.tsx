import { } from "react"
import Wird from "!/components/Wird"

import type { Wird as WirdType } from "@/types"

import "./Wirds.scss"

type Props = {
	wirds: WirdType[]
}

/** Display a list of wirds */
export default function Wirds({ wirds }: Props) {
	return (
		<div className="wirds">
			{wirds.map((wird, i) => <Wird key={i} wird={wird} />)}
		</div>
	)
}