// Small helpers shared by the clinic tour (ClinicCameraTour, ClinicPhotoList).

export const pad = (n: number) => String(n).padStart(2, "0");

/** Slow start, fast middle, slow stop — for the scrubbed camera moves */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
