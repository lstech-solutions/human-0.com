export async function GET() {
  // TODO: Replace this placeholder with a real data source (database, on-chain, etc.)
  const verifiedHumans = 1234;

  // Scrape total world population from Worldometers (best-effort, with safe fallback)
  let totalHumans = 8_260_837_082;
  let netChangePerSecond = 2.5; // fallback: approximate historical net increase per second
  let baselineYear: number | null = null;

  try {
    const worldBankBaseUrl =
      "https://api.worldbank.org/v2/country/WLD/indicator";

    const [popRes, birthRes, deathRes] = await Promise.all([
      fetch(`${worldBankBaseUrl}/SP.POP.TOTL?format=json&per_page=1`),
      fetch(`${worldBankBaseUrl}/SP.DYN.CBRT.IN?format=json&per_page=1`),
      fetch(`${worldBankBaseUrl}/SP.DYN.CDRT.IN?format=json&per_page=1`),
    ]);

    const parseLatest = async (res: Response) => {
      if (!res.ok) return null as any;
      const json = await res.json();
      const latest =
        Array.isArray(json) && Array.isArray(json[1]) ? json[1][0] : null;
      return latest;
    };

    const [popLatest, birthLatest, deathLatest] = await Promise.all([
      parseLatest(popRes),
      parseLatest(birthRes),
      parseLatest(deathRes),
    ]);

    if (popLatest && typeof popLatest.value === "number") {
      totalHumans = popLatest.value;
      if (typeof popLatest.date === "string") {
        const year = Number(popLatest.date);
        if (Number.isFinite(year)) {
          baselineYear = year;
        }
      }
    }

    const birthRatePerThousand =
      birthLatest && typeof birthLatest.value === "number"
        ? birthLatest.value
        : null;
    const deathRatePerThousand =
      deathLatest && typeof deathLatest.value === "number"
        ? deathLatest.value
        : null;

    if (birthRatePerThousand !== null && deathRatePerThousand !== null) {
      const secondsPerYear = 365.25 * 24 * 60 * 60;
      const birthsPerYear = (birthRatePerThousand / 1000) * totalHumans;
      const deathsPerYear = (deathRatePerThousand / 1000) * totalHumans;
      const netPerYear = birthsPerYear - deathsPerYear;
      netChangePerSecond = netPerYear / secondsPerYear;
    }
  } catch {
    // Keep placeholder values when the public APIs are unavailable
  }

  const baselineTimestamp = new Date().toISOString();

  const sources = [
    {
      name: "World Bank - World Development Indicators",
      url: "https://data.worldbank.org/indicator/SP.POP.TOTL?locations=1W",
      indicator: "SP.POP.TOTL",
    },
    {
      name: "World Bank - Crude birth rate (per 1,000 people)",
      url: "https://data.worldbank.org/indicator/SP.DYN.CBRT.IN?locations=1W",
      indicator: "SP.DYN.CBRT.IN",
    },
    {
      name: "World Bank - Crude death rate (per 1,000 people)",
      url: "https://data.worldbank.org/indicator/SP.DYN.CDRT.IN?locations=1W",
      indicator: "SP.DYN.CDRT.IN",
    },
  ];

  const body = JSON.stringify({
    verifiedHumans,
    totalHumans,
    baselinePopulation: totalHumans,
    baselineTimestamp,
    netChangePerSecond,
    baselineYear,
    sources,
  });

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
