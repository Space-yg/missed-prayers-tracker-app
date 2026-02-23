/** A type of prayer */
export type PrayerType = "fajr" | "dhuhr" | "asr" | "maghreb" | "isha"

/** A duration category */
export type DurationCategory = "days" | "weeks" | "months" | "years"

/** A wird that represents what missed prayer needs to be prayed and how long */
export type Wird = {
	/** The ID of this wird */
	id: number

	/** The label used to identify this wird. It is used primary in the UI. This is not guaranteed unique. */
	label: string

	/** The types of prayers that was missed */
	prayerTypes: PrayerType[]

	/** The date and time this wird was started */
	startDate: Date

	/** The number of the `durationCategory` these prayers were missed */
	duration: number

	/** The duration of category to be combined with the duration to get the total amount of missed prayers */
	durationCategory: DurationCategory
}

/** A prayer that was prayed */
export type PrayedPrayer = {
	/** The ID of this prayer that was prayed */
	id: number

	/** The wird this prayer that was prayed belongs to */
	wirdId: Wird["id"]

	/** The date the prayer was prayed */
	datePrayed: Date

	/** The type of prayer that was prayed */
	prayerType: PrayerType
}