import { use, useCallback, useEffect, useRef, useState, useMemo } from "react"
import { formatDuration } from "@/utils"
import dbConnected from "@/database"
import LogPrayer from "!/components/LogPrayer"

import type { Wird as WirdType, PrayedPrayer, PrayerType } from "@/types"

import "./Wird.scss"

type Props = {
	wird: WirdType
}

/**
 * Counts each prayer prayed and categorizes them based on the type of prayer
 * @param prayedPrayers The prayed prayers
 * @returns An object making the type of prayer to the number of that prayer that has been prayed
 */
function getPrayerTypeCount(prayedPrayers: PrayedPrayer[]): Partial<Record<PrayerType, number>> {
	const prayerTypeCount: Partial<Record<PrayerType, number>> = {}

	prayedPrayers.forEach(prayedPrayer => {
		if (typeof prayerTypeCount[prayedPrayer.prayerType] === "undefined") prayerTypeCount[prayedPrayer.prayerType] = 0
		prayerTypeCount[prayedPrayer.prayerType]!++
	})

	return prayerTypeCount
}

function calculateRemainingPrayers(wird: WirdType): number {
	switch (wird.durationCategory) {
		case "days":
			return wird.duration
		case "weeks":
			return wird.duration * 7
		case "months":
			return wird.duration * 31
		case "years":
			return wird.duration * 365
	}
}

/** Display a single wird */
export default function Wird({ wird }: Props) {
	const db = use(dbConnected)
	const dialog = useRef<HTMLDialogElement>(null)

	const [prayedPrayers, setPrayedPrayers] = useState<PrayedPrayer[]>([])
	const prayerTypeCount = getPrayerTypeCount(prayedPrayers)
	const remainingPrayers = useMemo(() => calculateRemainingPrayers(wird), [wird])

	useEffect(() => {
		db.filter("prayed-prayers", "wirdId", wird.id).then(pps => setPrayedPrayers(pps))
	}, [wird.id])

	const handleLogPrayerOnClick = useCallback(() => {
		dialog.current?.showModal()
	}, [])

	const closeDialog = useCallback(() => {
		dialog.current?.close()
	}, [])

	return (
		<div className="wird">
			<h3 className="label">{wird.label}</h3>

			<button onClick={handleLogPrayerOnClick} className="log-prayer-button">Log Prayer</button>

			<dialog ref={dialog}>
				<LogPrayer wird={wird} onLog={closeDialog} onCancel={closeDialog} prayers={wird.prayerTypes.filter(prayerType => !prayerTypeCount[prayerType])} />
			</dialog>

			<p className="prayers">Prayers: {wird.prayerTypes.map((prayerType, i) => <span key={i} className="prayer-type">{prayerType[0].toUpperCase() + prayerType.slice(1)}</span>)}</p>
			<p>Started on {wird.startDate.toLocaleDateString("en-GB")}</p>
			<p>Duration: {formatDuration(wird.duration, wird.durationCategory)}</p>
			<p>Remaining number of prayers:</p>
			<ul>
				{wird.prayerTypes.map((prayerType, idx) => <li key={idx}>{prayerType}: {remainingPrayers - (typeof prayerTypeCount[prayerType] === "undefined" ? 0 : prayerTypeCount[prayerType])}</li>)}
			</ul>
		</div>
	)
}