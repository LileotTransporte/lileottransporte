import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Award,
  Car,
  Facebook,
  Gift,
  Handshake,
  Instagram,
  MapPinned,
  Medal,
  MessageCircle,
  Play,
  Smartphone,
  Star,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  Youtube,
} from "lucide-react";
import { CoverageMap } from "@/components/CoverageMap";
import { WeatherWidget, type GeoInfo } from "@/components/WeatherWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lileot — Transporte por Aplicativo em Amparo e Região" },
      {
        name: "description",
        content:
          "Peça sua corrida em Amparo e no Circuito das Águas com a Lileot: motoristas capacitados, atendimento humanizado, prêmios e programa Indique e Ganhe.",
      },
      { property: "og:title", content: "Lileot — Transporte por Aplicativo em Amparo" },
      {
        property: "og:description",
        content:
          "Viaje com conforto e segurança em Amparo e região. Baixe o app ou peça pelo WhatsApp (19) 98954-8149.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WA_PASSAGEIRO = "https://wa.me/19989548149";
const WA_MOTORISTA = "https://wa.me/19997376030";
const APP_PASSAGEIRO =
  "https://play.google.com/store/apps/details?id=br.com.lileot.passenger.drivermachine";
const APP_MOTORISTA =
  "https://play.google.com/store/apps/details?id=br.com.lileot.taxi.drivermachine";

const btnBase =
  "tap-target inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base";

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 text-center">
      <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-accent-soft text-primary">
        {icon}
      </div>
      <h2 className="text-balance text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function Index() {
  const [aba, setAba] = useState<"passageiro" | "motorista">("passageiro");
  const [local, setLocal] = useState<GeoInfo | null>(null);
  const [clima, setClima] = useState("Obtendo localização...");

  useEffect(() => {
    let ativo = true;

    async function temperatura(lat: number, lon: number) {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      );
      const data = await res.json();
      return Math.round(data.current_weather.temperature);
    }

    async function padrao() {
      const lat = -22.7011;
      const lon = -46.7642;
      try {
        const temp = await temperatura(lat, lon);
        if (ativo) setClima(`Amparo: ${temp}°C`);
      } catch {
        if (ativo) setClima("Amparo e região");
      }
      if (ativo) setLocal({ lat, lon, nome: "Amparo (Central)" });
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          try {
            const temp = await temperatura(lat, lon);
            const resGeo = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            );
            const dataGeo = await resGeo.json();
            const cidade =
              dataGeo.address?.city ||
              dataGeo.address?.town ||
              dataGeo.address?.village ||
              "Sua região";
            if (!ativo) return;
            setClima(`${cidade}: ${temp}°C`);
            setLocal({ lat, lon, nome: cidade });
          } catch {
            padrao();
          }
        },
        () => padrao(),
      );
    } else {
      padrao();
    }

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="min-h-screen pb-24 sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary-dark/40 bg-primary/95 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
              <Car className="size-5" aria-hidden />
            </div>
            <span className="truncate text-lg font-extrabold tracking-[0.12em] text-primary-foreground">
              LILEOT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <WeatherWidget texto={clima} />
            </div>
            <a
              href={WA_PASSAGEIRO}
              target="_blank"
              rel="noreferrer"
              className={`${btnBase} bg-accent px-4 text-accent-foreground hover:bg-primary-foreground`}
            >
              <MessageCircle className="size-4" aria-hidden />
              <span className="hidden sm:inline">(19) 98954-8149</span>
              <span className="sm:hidden">Chamar</span>
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3 sm:hidden">
          <WeatherWidget texto={clima} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        {/* Abas (desktop/tablet) */}
        <nav
          aria-label="Escolha seu perfil"
          className="mx-auto mb-6 hidden max-w-md rounded-full border border-border bg-card p-1.5 shadow-soft sm:flex"
        >
          {(["passageiro", "motorista"] as const).map((chave) => (
            <button
              key={chave}
              onClick={() => setAba(chave)}
              aria-pressed={aba === chave}
              className={`tap-target flex-1 rounded-full px-4 py-2.5 text-sm font-bold capitalize transition-colors ${
                aba === chave
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {chave}
            </button>
          ))}
        </nav>

        {aba === "passageiro" ? (
          <section aria-labelledby="titulo-passageiro" className="space-y-10">
            {/* Hero */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-primary-foreground shadow-lift sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
                <Star className="size-4" aria-hidden /> O App Nº 1 de Amparo
              </span>
              <h1
                id="titulo-passageiro"
                className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
              >
                Sua viagem com conforto, segurança e prêmios!
              </h1>
              <p className="mt-3 max-w-2xl text-pretty text-sm text-primary-foreground/85 sm:text-base">
                Na <strong>Lileot</strong>, transportar você com pontualidade e respeito é nossa
                prioridade. Atuamos em Amparo e região oferecendo um atendimento humanizado e
                motoristas capacitados.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={APP_PASSAGEIRO}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnBase} bg-accent text-accent-foreground hover:brightness-105`}
                >
                  <Play className="size-4" aria-hidden /> Baixar App Passageiro
                </a>
                <a
                  href={WA_PASSAGEIRO}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnBase} bg-whatsapp text-whatsapp-foreground hover:brightness-105`}
                >
                  <MessageCircle className="size-4" aria-hidden /> Pedir pelo WhatsApp
                </a>
              </div>
            </div>

            {/* Mapa */}
            <div>
              <SectionTitle
                icon={<MapPinned className="size-6" aria-hidden />}
                title="Área de Cobertura"
                subtitle="Atendemos em Amparo e em toda a região do Circuito das Águas."
              />
              <div className="surface-card overflow-hidden">
                <CoverageMap local={local} />
              </div>
            </div>

            {/* Promoções */}
            <div>
              <SectionTitle
                icon={<Trophy className="size-6" aria-hidden />}
                title="Festival de Prêmios — 3 Anos Lileot"
                subtitle="Em janeiro a Lileot faz 3 anos! Já distribuímos mais de R$ 12 mil em prêmios em Amparo."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="surface-card p-5">
                  <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-primary">
                    Corridas via App
                  </span>
                  <h3 className="mt-3 flex items-center gap-2 text-base font-extrabold text-primary sm:text-lg">
                    <Smartphone className="size-5 shrink-0" aria-hidden /> Maior Número de Corridas
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {[
                      { icon: <Trophy className="size-4 text-gold" aria-hidden />, pos: "1º Lugar:", v: "R$ 600,00" },
                      { icon: <Medal className="size-4 text-silver" aria-hidden />, pos: "2º Lugar:", v: "R$ 500,00" },
                      { icon: <Medal className="size-4 text-bronze" aria-hidden />, pos: "3º Lugar:", v: "R$ 400,00" },
                      { icon: <Award className="size-4 text-muted-foreground" aria-hidden />, pos: "4º Lugar:", v: "R$ 300,00" },
                    ].map((p) => (
                      <li
                        key={p.pos}
                        className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-3 py-2.5"
                      >
                        <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                          {p.icon}
                          <span className="truncate">{p.pos}</span>
                        </span>
                        <strong className="shrink-0 text-sm text-primary sm:text-base">{p.v}</strong>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="surface-card p-5">
                  <span className="inline-block rounded-full bg-whatsapp/15 px-3 py-1 text-xs font-bold text-primary">
                    Corridas via Central
                  </span>
                  <h3 className="mt-3 flex items-center gap-2 text-base font-extrabold text-primary sm:text-lg">
                    <MessageCircle className="size-5 shrink-0" aria-hidden /> Sorteio WhatsApp
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Chame pelo: <strong className="text-foreground">(19) 98954-8149</strong>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      ["1º Lugar:", "R$ 300,00"],
                      ["2º Lugar:", "R$ 250,00"],
                      ["3º Lugar:", "R$ 200,00"],
                      ["4º Lugar:", "R$ 150,00"],
                      ["5º, 6º e 7º Lugar:", "R$ 100,00 cada"],
                    ].map(([pos, v]) => (
                      <li
                        key={pos}
                        className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-3 py-2.5"
                      >
                        <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                          <Ticket className="size-4 shrink-0 text-accent" aria-hidden />
                          <span className="truncate">{pos}</span>
                        </span>
                        <strong className="shrink-0 text-sm text-primary sm:text-base">{v}</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="mt-4 flex items-start gap-4 rounded-3xl border border-accent bg-accent-soft p-5">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <Gift className="size-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-extrabold text-primary">
                    Indique Amigos e Ganhe R$ 20,00!
                  </h4>
                  <p className="mt-1 text-sm text-foreground/80">
                    Valendo para passageiros e motoristas: ganhe <strong>R$ 20,00</strong> por cada
                    novo cliente indicado que realizar 20 corridas!
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section aria-labelledby="titulo-motorista" className="space-y-10">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark to-primary p-6 text-primary-foreground shadow-lift sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-bold text-accent">
                <Handshake className="size-4" aria-hidden /> Seja nosso parceiro
              </span>
              <h1
                id="titulo-motorista"
                className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
              >
                Dirija com a Lileot e fature mais!
              </h1>
              <p className="mt-3 max-w-2xl text-pretty text-sm text-primary-foreground/85 sm:text-base">
                Junte-se ao time que mais cresce em Amparo e região! Oferecemos suporte humanizado,
                taxas justas e total liberdade de horário.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Baixe o App do Motorista e cadastre-se.",
                  "Valide e ative seu cadastro via WhatsApp.",
                ].map((texto, i) => (
                  <div
                    key={texto}
                    className="flex items-center gap-3 rounded-2xl bg-primary-foreground/10 p-3"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-accent-foreground">
                      {i + 1}
                    </span>
                    <p className="text-sm">{texto}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={APP_MOTORISTA}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnBase} bg-accent text-accent-foreground hover:brightness-105`}
                >
                  <Play className="size-4" aria-hidden /> Baixar App Motorista
                </a>
                <a
                  href={WA_MOTORISTA}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnBase} bg-whatsapp text-whatsapp-foreground hover:brightness-105`}
                >
                  <MessageCircle className="size-4" aria-hidden /> Validar Cadastro
                </a>
              </div>
            </div>

            <div>
              <SectionTitle
                icon={<Handshake className="size-6" aria-hidden />}
                title="Programa Indique e Ganhe"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="surface-card p-5">
                  <div className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-primary">
                    <UserPlus className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-primary sm:text-lg">
                    Indique outro Motorista
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ganhe <strong className="text-primary">R$ 100,00 em créditos</strong> no app
                    assim que o motorista indicado completar 100 corridas!
                  </p>
                </article>
                <article className="surface-card p-5">
                  <div className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-primary">
                    <Users className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-primary sm:text-lg">
                    Indique Clientes
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ganhe <strong className="text-primary">R$ 20,00 em créditos</strong> por cada
                    novo cliente indicado que fizer 20 corridas.
                  </p>
                </article>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* WhatsApp flutuante */}
      <a
        href={WA_PASSAGEIRO}
        target="_blank"
        rel="noreferrer"
        title="Pedir Corrida pelo WhatsApp"
        className="fixed bottom-24 right-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift transition-transform hover:scale-105 sm:bottom-6"
      >
        <MessageCircle className="size-7" aria-hidden />
        <span className="sr-only">Pedir corrida pelo WhatsApp</span>
      </a>

      {/* Rodapé */}
      <footer className="border-t border-border bg-primary py-8 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-base font-extrabold">Lileot — O App Número Um de Amparo</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              { href: "https://instagram.com/lileotlileot", label: "Instagram", icon: <Instagram className="size-5" /> },
              { href: "https://facebook.com/lileotapp", label: "Facebook", icon: <Facebook className="size-5" /> },
              { href: WA_PASSAGEIRO, label: "WhatsApp Central", icon: <MessageCircle className="size-5" /> },
              { href: APP_PASSAGEIRO, label: "Play Store", icon: <Play className="size-5" /> },
              { href: "https://www.youtube.com/@LileotTransporte", label: "YouTube", icon: <Youtube className="size-5" /> },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                className="tap-target grid place-items-center rounded-2xl bg-primary-foreground/10 p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {s.icon}
                <span className="sr-only">{s.label}</span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-primary-foreground/70">
            © 2026 Lileot. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Navegação inferior (mobile) */}
      <nav
        aria-label="Escolha seu perfil"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur sm:hidden"
      >
        <div className="grid grid-cols-2 gap-2 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {([
            { chave: "passageiro", label: "Passageiro", icon: <Users className="size-5" aria-hidden /> },
            { chave: "motorista", label: "Motorista", icon: <Car className="size-5" aria-hidden /> },
          ] as const).map((item) => (
            <button
              key={item.chave}
              onClick={() => {
                setAba(item.chave);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-pressed={aba === item.chave}
              className={`tap-target flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-bold transition-colors ${
                aba === item.chave
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
