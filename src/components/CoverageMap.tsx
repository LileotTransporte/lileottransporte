import { useEffect, useRef } from "react";
import type { GeoInfo } from "./WeatherWidget";

const AMPARO: GeoInfo = { lat: -22.7011, lon: -46.7642, nome: "Amparo (Central)" };

export function CoverageMap({ local }: { local: GeoInfo | null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;
      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
        [AMPARO.lat, AMPARO.lon],
        12,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !local) return;
    map.setView([local.lat, local.lon], 13);
    if (markerRef.current) map.removeLayer(markerRef.current);
    const icon = L.divIcon({
      className: "",
      html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:oklch(0.799 0.086 355);border:3px solid oklch(0.401 0.083 251.5);box-shadow:0 0 0 6px oklch(0.401 0.083 251.5 / 0.2)"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    markerRef.current = L.marker([local.lat, local.lon], { icon })
      .addTo(map)
      .bindPopup(`<b>Sua Localização:</b> ${local.nome}<br>A Lileot atende aqui!`)
      .openPopup();
  }, [local]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Mapa da área de cobertura da Lileot"
      className="h-[280px] w-full sm:h-[380px]"
    />
  );
}
