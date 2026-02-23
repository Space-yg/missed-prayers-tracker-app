import { use, useState, useCallback } from "react"
import { useImmer } from "use-immer"
import { useNavigate } from "react-router"
import dbConnected from "@/database"
import { formatDuration, humanReadableArray } from "@/utils"
import Prayers from "!/components/Prayers"

import type { DurationCategory, PrayerType } from "@/types"

import "./App.scss"

type Props = {}

/** Create a new wird app */
export default function App({ }: Props) {
	const navigate = useNavigate()
	const db = use(dbConnected)

	const [label, setLabel] = useState<string>("")
	const [prayers, setPrayers] = useImmer<PrayerType[]>(["fajr", "dhuhr", "asr", "maghreb", "isha"])
	const [startDate, setStartDate] = useState<number>(Date.now())
	const [duration, setDuration] = useState<number>(1)
	const [durationCategory, setDurationCategory] = useState<DurationCategory>("days")

	const handleLabelOnInput = useCallback((event: React.InputEvent<HTMLInputElement>) => {
		setLabel(event.currentTarget.value)
	}, [setLabel])

	const handleStartDateOnInput = useCallback((event: React.InputEvent<HTMLInputElement>) => {
		setStartDate(event.currentTarget.valueAsNumber)
	}, [setStartDate])

	const handleDurationOnInput = useCallback((event: React.InputEvent<HTMLInputElement>) => {
		setDuration(event.currentTarget.valueAsNumber)
	}, [setDuration])

	const handleDurationCategoryOnInput = useCallback((event: React.InputEvent<HTMLSelectElement>) => {
		setDurationCategory(event.currentTarget.value as DurationCategory)
	}, [setDurationCategory])

	const handleCreateWirdOnClick = useCallback(() => {
		const l = label.trim() === "" ?
			`Missed ${humanReadableArray(prayers.map(prayer => prayer[0].toUpperCase() + prayer.slice(1)), "conjunction")} for ${formatDuration(duration, durationCategory)}` :
			label.trim()

		db.add("wirds", {
			label: l,
			prayerTypes: prayers,
			startDate: new Date(startDate),
			duration: duration,
			durationCategory: durationCategory,
		})

		// Go back to home page
		navigate("/")
	}, [label, prayers, startDate, duration, durationCategory])

	return (
		<>
			{/* Label */}
			<label>
				Label: <input type="text" value={label} onInput={handleLabelOnInput} name="label" />
			</label>
			<br />

			{/* Prayers that need to be prayed */}
			<Prayers prayers={prayers} setPrayers={setPrayers} />
			<br />

			{/* Start date */}
			<label>
				Start Date: <input type="date" value={new Date(startDate).toISOString().split("T")[0]} onInput={handleStartDateOnInput} name="start-date" />
			</label>
			<br />

			{/* Duration */}
			<label>
				Duration <input type="number" value={duration} onInput={handleDurationOnInput} name="duration" min="1" />
				<select name="duration-category" value={durationCategory} onInput={handleDurationCategoryOnInput}>
					<option value="days">days</option>
					<option value="weeks">weeks</option>
					<option value="months">months</option>
					<option value="years">years</option>
				</select>
			</label>
			<br />

			{/* Create wird */}
			<button onClick={handleCreateWirdOnClick} type="button">Create wird</button>
		</>
	)
}