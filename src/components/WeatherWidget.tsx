import { MapPin } from "lucide-react";

export type GeoInfo = { lat: number; lon: number; nome: string };

export function WeatherWidget({ texto }: { texto: string }) {
  return (
    <div className="glass-soft flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide text-foreground/90 sm:text-xs">
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      <MapPin className="size-3.5 shrink-0 text-accent" aria-hidden />
      <span className="truncate">{texto}</span>
    </div>
  );
}
