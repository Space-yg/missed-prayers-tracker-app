import { use, useState, useEffect } from "react"
import { Link } from "react-router"
import dbConnected from "@/database"
import Wirds from "!/components/Wirds"

import type { Wird } from "@/types"

import "./App.scss"

type Props = {}

export default function App({ }: Props) {
	const db = use(dbConnected)
	const [wirds, setWirds] = useState<Wird[]>([])

	useEffect(() => {
		db.getAll("wirds").then(ws => setWirds(ws))
	}, [])

	return (
		<>
			<h2>Wirds</h2>
			{/* Display all wirds */}
			{wirds.length === 0 ?
				<p>No Wirds has been created.</p> :
				<Wirds wirds={wirds} />
			}

			<Link to="/create/wird">Create a new wird</Link>
		</>
	)
}