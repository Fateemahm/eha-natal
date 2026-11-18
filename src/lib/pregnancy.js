const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function calculateCurrentTrimester(estimatedDueDate, conceptionDate) {
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const conception = parseDateOnly(conceptionDate);
  const dueDate = parseDateOnly(estimatedDueDate);

  let gestationalDays;

  if (conception) {
    const daysSinceConception = Math.floor(
      (todayUtc - conception.getTime()) / DAY_IN_MS
    );

    if (daysSinceConception < 0) return null;
    gestationalDays = daysSinceConception + 14;
  } else if (dueDate) {
    gestationalDays = 280 - Math.floor(
      (dueDate.getTime() - todayUtc) / DAY_IN_MS
    );
  } else {
    return null;
  }

  if (gestationalDays < 0) return null;
  if (gestationalDays < 98) return 1;
  if (gestationalDays < 196) return 2;
  return 3;
}
