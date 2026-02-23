import { use, useCallback, useEffect, useRef, useState } from "react"
import dbConnected from "@/database"

import type { Wird, PrayedPrayer, PrayerType } from "@/types"

import "./LogPrayer.scss"

type Props = {
	wird: Wird
	prayers: PrayerType[]
	onLog?: (prayerPrayedId: PrayedPrayer["id"]) => void
	onCancel?: () => void
}

/** Display a log prayer form */
export default function LogPrayer({ wird, prayers, onLog, onCancel }: Props) {
	const db = use(dbConnected)

	const [prayer, setPrayer] = useState<PrayedPrayer["prayerType"]>(prayers[0])
	const [datePrayed, setdatePrayed] = useState<Date>(new Date(Date.now()))

	const handlePrayerOnInput = useCallback((event: React.InputEvent<HTMLSelectElement>) => {
		setPrayer(event.currentTarget.value as PrayedPrayer["prayerType"])
	}, [setPrayer])

	const handleDatePrayedOnInput = useCallback((event: React.InputEvent<HTMLInputElement>) => {
		setdatePrayed(new Date(event.currentTarget.value))
	}, [setdatePrayed])

	const handleLogPrayerOnClick = useCallback(() => {
		db.add("prayed-prayers", {
			prayerType: prayer,
			datePrayed: datePrayed,
			wirdId: wird.id,
		}).then(onLog)
	}, [prayer, datePrayed])

	return (
		<>
			{/* Prayer */}
			<label>
				Prayer:
				<select name="prayer" value={prayer} onInput={handlePrayerOnInput}>
					{prayers.includes("fajr") && <option value="fajr">Fajr</option>}
					{prayers.includes("dhuhr") && <option value="dhuhr">Dhuhr</option>}
					{prayers.includes("asr") && <option value="asr">Asr</option>}
					{prayers.includes("maghreb") && <option value="maghreb">Maghreb</option>}
					{prayers.includes("isha") && <option value="isha">Isha</option>}
				</select>
			</label>
			<br />

			{/* Date */}
			<label>
				Date prayed: <input type="date" name="date" value={datePrayed.toISOString().split("T")[0]} onInput={handleDatePrayedOnInput} />
			</label>
			<br />

			{/* Log or cancel */}
			<button type="button" onClick={handleLogPrayerOnClick}>Log</button>
			<button type="button" onClick={onCancel}>Cancel</button>
		</>
	)
}