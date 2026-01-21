export type RegionEntry = {
  province: string;
  cities: Array<{ name: string; postalCodeRanges: Array<[number, number]> }>; // inclusive ranges
};

// Small curated sample of provinces/cities and postal-code ranges for validation/demo.
export const REGIONS: RegionEntry[] = [
  {
    province: 'DKI Jakarta',
    cities: [
      { name: 'Jakarta Selatan', postalCodeRanges: [[12110, 12240]] },
      { name: 'Jakarta Pusat', postalCodeRanges: [[10110, 10660]] },
    ],
  },
  {
    province: 'Jawa Barat',
    cities: [
      { name: 'Bandung', postalCodeRanges: [[40111, 40292]] },
      { name: 'Bekasi', postalCodeRanges: [[17111, 17611]] },
    ],
  },
  {
    province: 'Jawa Timur',
    cities: [
      { name: 'Surabaya', postalCodeRanges: [[60111, 60299]] },
    ],
  },
];

export function findRegionByPostalCode(postalCode: string) {
  const pc = parseInt(postalCode, 10);
  if (Number.isNaN(pc)) return null;
  for (const prov of REGIONS) {
    for (const city of prov.cities) {
      for (const [from, to] of city.postalCodeRanges) {
        if (pc >= from && pc <= to) return { province: prov.province, city: city.name };
      }
    }
  }
  return null;
}
