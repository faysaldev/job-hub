import { useMemo } from "react";
import { City } from "country-state-city";

// Computed once at module level — never recomputes across renders or re-mounts
let _cityOptions: { value: string; label: string }[] | null = null;

function getCityOptions() {
  if (!_cityOptions) {
    _cityOptions = City.getAllCities().map((city) => ({
      value: `${city.name}, ${city.countryCode}`,
      label: `${city.name}, ${city.countryCode}`,
    }));
  }
  return _cityOptions;
}

export function useCityOptions() {
  // useMemo here as a safety net; real work is done once at module scope
  return useMemo(() => getCityOptions(), []);
}
