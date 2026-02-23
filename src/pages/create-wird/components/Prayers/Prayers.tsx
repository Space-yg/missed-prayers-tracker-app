import { useCallback } from "react"

import type { Updater } from "use-immer"
import type { PrayerType } from "@/types"

import "./Prayers.scss"

type Props = {
	prayers: PrayerType[]
	setPrayers: Updater<PrayerType[]>
}

/** Displays a list of prayers */
export default function Prayers({ prayers, setPrayers }: Props) {
	const handlePrayerOnChange = useCallback((prayer: PrayerType) => {
		setPrayers(draft => {
			if (draft.includes(prayer)) return draft.filter(prayerType => prayerType !== prayer)
			else draft.push(prayer)
		})
	}, [setPrayers])

	return (
		<fieldset>
			<legend>Prayers</legend>

			<label><input type="checkbox" name="prayer" onChange={e => handlePrayerOnChange(e.currentTarget.value as PrayerType)} checked={prayers.includes("fajr")} value="fajr" /> Fajr</label><br />
			<label><input type="checkbox" name="prayer" onChange={e => handlePrayerOnChange(e.currentTarget.value as PrayerType)} checked={prayers.includes("dhuhr")} value="dhuhr" /> Dhuhr</label><br />
			<label><input type="checkbox" name="prayer" onChange={e => handlePrayerOnChange(e.currentTarget.value as PrayerType)} checked={prayers.includes("asr")} value="asr" /> Asr</label><br />
			<label><input type="checkbox" name="prayer" onChange={e => handlePrayerOnChange(e.currentTarget.value as PrayerType)} checked={prayers.includes("maghreb")} value="maghreb" /> Maghreb</label><br />
			<label><input type="checkbox" name="prayer" onChange={e => handlePrayerOnChange(e.currentTarget.value as PrayerType)} checked={prayers.includes("isha")} value="isha" /> Isha</label><br />
		</fieldset>
	)
}