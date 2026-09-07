import { MapPin } from "lucide-react";

export type GeoInfo = { lat: number; lon: number; nome: string };

export function WeatherWidget({ texto }: { texto: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-medium text-primary-foreground sm:text-sm">
      <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
      <span className="truncate">{texto}</span>
    </div>
  );
}
