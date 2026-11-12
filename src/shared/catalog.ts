export type ProductAudience = "Men" | "Women";
export type Colorway = "saddle" | "clay" | "olive" | "ink";

export type StoreProduct = {
  id: string;
  name: string;
  series: string;
  audience: ProductAudience;
  productCode: string;
  availableSizes: readonly string[];
  pricePhp: number;
  description: string;
  colorway: Colorway;
  imageUrl: string;
};

export const PRODUCT_CATALOG: readonly StoreProduct[] = [
  { id: "makabayan-series-agila", name: "Agila", series: "Makabayan Series", audience: "Men", productCode: "MC001", pricePhp: 2499, availableSizes: ["7","7.5","8","8.5","9","10.5","11.5"], description: "Agila takes its cue from a confident, open stride, with comfort at the center of its easy profile.", colorway: "saddle", imageUrl: "/products/makabayan-series-agila.jpg" },
  { id: "makabayan-series-arnis", name: "Arnis", series: "Makabayan Series", audience: "Men", productCode: "MC001", pricePhp: 2499, availableSizes: ["7","7.5","8","8.5","9","10.5","11.5"], description: "Arnis brings a composed, purposeful character to an easy-to-wear moccasin.", colorway: "ink", imageUrl: "/products/makabayan-series-arnis.jpg" },
  { id: "makabayan-series-mangga", name: "Mangga", series: "Makabayan Series", audience: "Men", productCode: "MC001", pricePhp: 2499, availableSizes: ["7","7.5","8","8.5","9","10.5","11.5"], description: "Mangga carries a warm, familiar spirit into a versatile everyday design.", colorway: "clay", imageUrl: "/products/makabayan-series-mangga.jpg" },
  { id: "makabayan-series-narra", name: "Narra", series: "Makabayan Series", audience: "Men", productCode: "MC001", pricePhp: 2499, availableSizes: ["7","7.5","8","8.5","9","10.5","11.5"], description: "Narra is grounded in a steady, enduring character and a comfortable feel for long days.", colorway: "olive", imageUrl: "/products/makabayan-series-narra.jpg" },
  { id: "makabayan-series-tamarraw", name: "Tamarraw", series: "Makabayan Series", audience: "Men", productCode: "MC001", pricePhp: 2499, availableSizes: ["7","7.5","8","8.5","9","10.5","11.5"], description: "Tamarraw brings a bold, resilient note to an easy everyday silhouette.", colorway: "saddle", imageUrl: "/products/makabayan-series-tamarraw.jpg" },
  
  { id: "bayani-habi-series-a-luna", name: "A Luna", series: "Bayani Habi Series", audience: "Men", productCode: "MC002", pricePhp: 2599, availableSizes: ["7","7.5","8","8.5","9","9.5","10","11"], description: "A Luna pairs a thoughtful, artistic spirit with a comfortable profile for everyday wear.", colorway: "clay", imageUrl: "/products/bayani-habi-series-a-luna.jpg" },
  { id: "bayani-habi-series-bonifacio", name: "Bonifacio", series: "Bayani Habi Series", audience: "Men", productCode: "MC002", pricePhp: 2599, availableSizes: ["7","7.5","8","8.5","9","9.5","10","11"], description: "Bonifacio brings a resolute, grounded character to a versatile daily moccasin.", colorway: "ink", imageUrl: "/products/bayani-habi-series-bonifacio.jpg" },
  { id: "bayani-habi-series-silang", name: "Silang", series: "Bayani Habi Series", audience: "Men", productCode: "MC002", pricePhp: 2599, availableSizes: ["7","7.5","8","8.5","9","9.5","10","11"], description: "Silang carries a confident, independent spirit in a comfortable design.", colorway: "saddle", imageUrl: "/products/bayani-habi-series-silang.jpg" },
  { id: "bayani-habi-series-del-pilar", name: "Del Pilar", series: "Bayani Habi Series", audience: "Men", productCode: "MC002", pricePhp: 2599, availableSizes: ["7","7.5","8","8.5","9","9.5","10","11"], description: "Del Pilar balances a considered look with comfort built for daily plans.", colorway: "olive", imageUrl: "/products/bayani-habi-series-del-pilar.jpg" },

  { id: "bayani-tutos-series-aguinaldo", name: "Aguinaldo", series: "Bayani Tutos Series", audience: "Men", productCode: "MC003", pricePhp: 2799, availableSizes: ["7","7.5","8","8.5","9","9.5","10"], description: "Aguinaldo brings a strong, distinctive presence to an easy everyday profile.", colorway: "saddle", imageUrl: "/products/bayani-tutos-series-aguinaldo.jpg" },
  { id: "bayani-tutos-series-f-dagohoy", name: "F Dagohoy", series: "Bayani Tutos Series", audience: "Men", productCode: "MC003", pricePhp: 2799, availableSizes: ["7","7.5","8","8.5","9","9.5","10"], description: "F Dagohoy is made for a steady stride, with comfort suited to full days on your feet.", colorway: "ink", imageUrl: "/products/bayani-tutos-series-f-dagohoy.jpg" },
  { id: "bayani-tutos-series-j-luna", name: "J Luna", series: "Bayani Tutos Series", audience: "Men", productCode: "MC003", pricePhp: 2799, availableSizes: ["7","7.5","8","8.5","9","9.5","10"], description: "J Luna offers a creative, confident note in a comfortable silhouette.", colorway: "clay", imageUrl: "/products/bayani-tutos-series-j-luna.jpg" },
  { id: "bayani-tutos-series-mabini", name: "Mabini", series: "Bayani Tutos Series", audience: "Men", productCode: "MC003", pricePhp: 2799, availableSizes: ["7","7.5","8","8.5","9","9.5","10"], description: "Mabini pairs a thoughtful, understated look with a comfortable everyday feel.", colorway: "olive", imageUrl: "/products/bayani-tutos-series-mabini.jpg" },
  { id: "bayani-tutos-series-rizal", name: "Rizal", series: "Bayani Tutos Series", audience: "Men", productCode: "MC003", pricePhp: 2799, availableSizes: ["7","7.5","8","8.5","9","9.5","10"], description: "Rizal brings a timeless, composed spirit to a comfortable daily moccasin.", colorway: "saddle", imageUrl: "/products/bayani-tutos-series-rizal.jpg" },

  { id: "moxies-lite-marikit", name: "Marikit", series: "Moxies Lite", audience: "Women", productCode: "MC004", pricePhp: 2050, availableSizes: ["6","6.5","7","7.5","8","10"], description: "Marikit brings a graceful everyday look together with a comfortable feel for long days.", colorway: "clay", imageUrl: "/products/moxies-lite-marikit.jpg" },
  { id: "moxies-lite-mayumi", name: "Mayumi", series: "Moxies Lite", audience: "Women", productCode: "MC004", pricePhp: 2050, availableSizes: ["6","6.5","7","7.5","8","10"], description: "Mayumi pairs a gentle, polished profile with comfort made for the rhythm of daily life.", colorway: "saddle", imageUrl: "/products/moxies-lite-mayumi.jpg" },
  { id: "moxies-lite-mutya", name: "Mutya", series: "Moxies Lite", audience: "Women", productCode: "MC005", pricePhp: 1949, availableSizes: ["6","6.5","7","7.5","8","9"], description: "Mutya is a little keepsake for everyday dressing, with a comfortable feel.", colorway: "olive", imageUrl: "/products/moxies-lite-mutya.jpg" },
  { id: "moxies-lite-dilag", name: "Dilag", series: "Moxies Lite", audience: "Women", productCode: "MC005", pricePhp: 1949, availableSizes: ["6","6.5","7","7.5","8","9"], description: "Dilag brings a bright, graceful note to a versatile everyday silhouette.", colorway: "clay", imageUrl: "/products/moxies-lite-dilag.jpg" },
  { id: "moxies-lite-amore", name: "Amore", series: "Moxies Lite", audience: "Women", productCode: "MC006", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9"], description: "Amore adds a warm, easygoing touch to a day-to-day favorite.", colorway: "saddle", imageUrl: "/products/moxies-lite-amore.jpg" },
  { id: "moxies-lite-hiyas", name: "Hiyas", series: "Moxies Lite", audience: "Women", productCode: "MC006", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9"], description: "Hiyas is designed to feel like a small treasure you can wear on ordinary days.", colorway: "olive", imageUrl: "/products/moxies-lite-hiyas.jpg" },
  { id: "moxies-lite-hiraya", name: "Hiraya", series: "Moxies Lite", audience: "Women", productCode: "MC006", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9"], description: "Hiraya carries a thoughtful, optimistic spirit into an easy everyday design.", colorway: "ink", imageUrl: "/products/moxies-lite-hiraya.jpg" },
  { id: "moxies-lite-makisig", name: "Makisig", series: "Moxies Lite", audience: "Women", productCode: "MC007", pricePhp: 2149, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Makisig brings confident character to a comfortable, versatile profile.", colorway: "saddle", imageUrl: "/products/moxies-lite-makisig.jpg" },
  { id: "moxies-lite-dalisay", name: "Dalisay", series: "Moxies Lite", audience: "Women", productCode: "MC007", pricePhp: 2149, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Dalisay keeps its look clean and its feel comfortable for everyday wear.", colorway: "clay", imageUrl: "/products/moxies-lite-dalisay.jpg" },
  { id: "moxies-lite-malakas", name: "Malakas", series: "Moxies Lite", audience: "Women", productCode: "MC008", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Malakas gives everyday dressing a bold, grounded note without losing an easy feel.", colorway: "ink", imageUrl: "/products/moxies-lite-malakas.jpg" },
  { id: "moxies-lite-maginoo", name: "Maginoo", series: "Moxies Lite", audience: "Women", productCode: "MC008", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Maginoo brings a composed, timeless character to a comfortable daily pair.", colorway: "saddle", imageUrl: "/products/moxies-lite-maginoo.jpg" },
  { id: "moxies-lite-magiliw", name: "Magiliw", series: "Moxies Lite", audience: "Women", productCode: "MC009", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Magiliw is made for the warmth of everyday moments, with comfort at the heart of its easy profile.", colorway: "olive", imageUrl: "/products/moxies-lite-magiliw.jpg" },
  { id: "moxies-lite-maliksi", name: "Maliksi", series: "Moxies Lite", audience: "Women", productCode: "MC009", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Maliksi keeps pace with busy days in a light, comfortable everyday feel.", colorway: "clay", imageUrl: "/products/moxies-lite-maliksi.jpg" },
  { id: "moxies-lite-dakila", name: "Dakila", series: "Moxies Lite", audience: "Women", productCode: "MC009", pricePhp: 2249, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Dakila makes a confident statement through a calm, versatile silhouette.", colorway: "ink", imageUrl: "/products/moxies-lite-dakila.jpg" },
  { id: "moxies-lite-matipuno", name: "Matipuno", series: "Moxies Lite", audience: "Women", productCode: "MC010", pricePhp: 1949, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Matipuno balances a sturdy, grounded character with comfortable everyday wear.", colorway: "saddle", imageUrl: "/products/moxies-lite-matipuno.jpg" },
  { id: "moxies-lite-matalino", name: "Matalino", series: "Moxies Lite", audience: "Women", productCode: "MC010", pricePhp: 1949, availableSizes: ["6","6.5","7","7.5","8","9","10","11"], description: "Matalino keeps everyday style thoughtful, versatile and comfortable.", colorway: "olive", imageUrl: "/products/moxies-lite-matalino.jpg" },
];

export function getProductById(id: string): StoreProduct | undefined {
  return PRODUCT_CATALOG.find(p => p.id === id);
}
export function getSeriesList(): string[] {
  return Array.from(new Set(PRODUCT_CATALOG.map(p => p.series)));
}
export function formatPHP(amountPhp: number): string {
  return "\u20B1" + new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 }).format(amountPhp);
}
