export function toBanglaNumber(value: number | string) {
  return Number(value).toLocaleString("bn-BD");
}

export function toBanglaUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    gram: "গ্রাম",
    piece: "টি",
    pieces: "টি",
    pcs: "টি",
    dozen: "ডজন",
  };

  return units[unit.toLowerCase()] || unit;
}

