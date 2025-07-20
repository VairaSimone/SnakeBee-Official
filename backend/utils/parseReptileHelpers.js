export function parseDateOrNull(value) {
  if (!value || value === 'null') return null;
  return new Date(value);
}

export function parseNumberOrNull(value) {
  if (!value || value === 'null') return null;
  return Number(value);
}

export function parseGrowthRecords(growthRecords) {
  return Array.isArray(growthRecords)
    ? growthRecords.map(record => ({
        date: parseDateOrNull(record.date),
        weight: parseNumberOrNull(record.weight),
        length: parseNumberOrNull(record.length),
      }))
    : [];
}

export function parseHealthRecords(healthRecords) {
  return Array.isArray(healthRecords)
    ? healthRecords.map(record => ({
        date: parseDateOrNull(record.date),
        vetVisit: parseDateOrNull(record.vetVisit),
        note: record.note || '',
      }))
    : [];
}
