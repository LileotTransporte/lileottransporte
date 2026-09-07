import { Car, Users } from "lucide-react";

export type Persona = "passageiro" | "motorista";

export function PersonaSwitch({
  value,
  onChange,
  size = "md",
}: {
  value: Persona;
  onChange: (p: Persona) => void;
  size?: "md" | "sm";
}) {
  const itens: { chave: Persona; label: string; icon: React.ReactNode }[] = [
    { chave: "passageiro", label: "Passageiro", icon: <Users className="size-4" aria-hidden /> },
    { chave: "motorista", label: "Motorista", icon: <Car className="size-4" aria-hidden /> },
  ];

  return (
    <div
      role="tablist"
      aria-label="Escolha seu perfil"
      className="glass-soft relative grid grid-cols-2 rounded-full p-1"
    >
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-accent shadow-glow-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          value === "motorista" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {itens.map((item) => (
        <button
          key={item.chave}
          role="tab"
          aria-selected={value === item.chave}
          onClick={() => onChange(item.chave)}
          className={`tap relative z-10 flex items-center justify-center gap-2 rounded-full px-4 font-bold transition-colors duration-300 ${
            size === "sm" ? "py-2 text-xs" : "py-2.5 text-sm"
          } ${value === item.chave ? "text-accent-foreground" : "text-foreground/60"}`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
