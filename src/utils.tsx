import type { DurationCategory } from "@/types"

/**
 * Format the duration and duration category into a string
 * @param duration The duration
 * @param durationCategory The duration category
 * @returns A formatted duration
 */
export function formatDuration(duration: number, durationCategory: DurationCategory): string {
	return `${duration} ${duration === 1 ? durationCategory.slice(0, -1) : durationCategory}`
}

/**
 * Convert an array to a human readable list
 * @param arr The array to make human readable
 * @param type The type of linking
 * @returns A human readable list
 */
export function humanReadableArray(arr: any[], type: Intl.ListFormatType) {
	return new Intl.ListFormat("en-GB", {
		style: "long",
		type,
	}).format(arr)
}