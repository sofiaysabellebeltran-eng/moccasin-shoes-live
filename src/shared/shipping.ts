export const FREE_SHIPPING_THRESHOLD_CENTAVOS = 250_000;

export const SHIPPING_RATES_CENTAVOS = {
  metroManila: 11_500,
  nearbyProvinces: 15_000,
  otherLuzon: 18_000,
  visayas: 20_000,
  mindanao: 22_000,
  remoteIslands: 28_000,
  unknown: 25_000,
};

export type ShippingZone = keyof typeof SHIPPING_RATES_CENTAVOS;

export const SHIPPING_ZONE_LABELS: Record<ShippingZone, string> = {
  metroManila: "Metro Manila",
  nearbyProvinces: "Bulacan, Cavite, Laguna or Rizal",
  otherLuzon: "Other Luzon",
  visayas: "Visayas",
  mindanao: "Mindanao",
  remoteIslands: "Remote islands",
  unknown: "Default / unknown",
};

export function calculateShipping(subtotalPhp: number, zone: ShippingZone): number {
  const subtotalCentavos = subtotalPhp * 100;
  if (subtotalCentavos >= FREE_SHIPPING_THRESHOLD_CENTAVOS) return 0;
  return SHIPPING_RATES_CENTAVOS[zone] / 100; // Return in PHP
}
