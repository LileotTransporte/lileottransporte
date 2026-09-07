import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
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
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  Youtube,
} from "lucide-react";
import { CoverageMap } from "@/components/CoverageMap";
import { WeatherWidget, type GeoInfo } from "@/components/WeatherWidget";
import { PersonaSwitch, type Persona } from "@/components/PersonaSwitch";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lileot — Transporte por Aplicativo em Amparo e Região" },
      {
        name: "description",
        content:
          "Peça sua corrida em Amparo e no Circuito das Águas com a Lileot: motoristas capacitados, atendimento humanizado, festival de prêmios e programa Indique e Ganhe.",
      },
      { property: "og:title", content: "Lileot — O App Nº 1 de Amparo" },
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

const btn =
  "tap group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold tracking-tight transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base";

function Eyebrow({ icon, texto }: { icon: React.ReactNode; texto: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
      {icon}
      {texto}
    </span>
  );
}

function SectionHead({
  eyebrow,
  titulo,
  descricao,
}: {
  eyebrow: React.ReactNode;
  titulo: string;
  descricao?: string;
}) {
  return (
    <div className="mb-7 max-w-2xl">
      {eyebrow}
      <h2 className="mt-4 text-balance text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">
        {titulo}
      </h2>
      {descricao ? (
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {descricao}
        </p>
      ) : null}
    </div>
  );
}

function PrizeRow({
  icon,
  pos,
  valor,
}: {
  icon: React.ReactNode;
  pos: string;
  valor: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/70 py-3 last:border-0">
      <span className="flex min-w-0 items-center gap-2.5 text-sm text-foreground/80">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/40">
          {icon}
        </span>
        <span className="truncate font-medium">{pos}</span>
      </span>
      <strong className="shrink-0 font-mono text-sm font-extrabold tabular-nums text-accent sm:text-base">
        {valor}
      </strong>
    </li>
  );
}

function Index() {
  const [aba, setAba] = useState<Persona>("passageiro");
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
        if (ativo) setClima(`Amparo · ${temp}°C`);
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
            setClima(`${cidade} · ${temp}°C`);
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

  const ehPassageiro = aba === "passageiro";

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-32 sm:pb-10">
      {/* Header flutuante */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pl-2.5 pr-2.5">
          <a href="#topo" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow-accent">
              <Car className="size-4.5" aria-hidden />
            </span>
            <span className="truncate text-base font-extrabold tracking-[0.18em]">LILEOT</span>
          </a>

          <div className="hidden md:block">
            <WeatherWidget texto={clima} />
          </div>

          <a
            href={WA_PASSAGEIRO}
            target="_blank"
            rel="noreferrer"
            className="tap inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-extrabold text-accent-foreground shadow-glow-accent transition-transform duration-300 hover:scale-[1.03] sm:text-sm"
          >
            <MessageCircle className="size-4" aria-hidden />
            <span className="hidden sm:inline">(19) 98954-8149</span>
            <span className="sm:hidden">Corrida</span>
          </a>
        </div>
      </header>

      <main id="topo" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ---------- HERO ---------- */}
        <section className="aurora grid-lines relative pb-14 pt-28 sm:pt-36">
          <div className="md:hidden">
            <WeatherWidget texto={clima} />
          </div>

          <div className="mt-5 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div className="animate-rise">
              <Eyebrow
                icon={<Star className="size-3.5" aria-hidden />}
                texto={ehPassageiro ? "O App Nº 1 de Amparo" : "Seja nosso parceiro"}
              />

              <h1 className="mt-5 text-balance text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                {ehPassageiro ? (
                  <>
                    Sua viagem com{" "}
                    <span className="text-gradient">conforto, segurança</span> e prêmios!
                  </>
                ) : (
                  <>
                    Dirija com a Lileot e <span className="text-gradient">fature mais!</span>
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-muted-foreground sm:text-lg">
                {ehPassageiro ? (
                  <>
                    Na <strong className="text-foreground">Lileot</strong>, transportar você com
                    pontualidade e respeito é nossa prioridade. Atuamos em Amparo e região
                    oferecendo um atendimento humanizado e motoristas capacitados.
                  </>
                ) : (
                  <>
                    Junte-se ao time que mais cresce em Amparo e região! Oferecemos suporte
                    humanizado, taxas justas e total liberdade de horário.
                  </>
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={ehPassageiro ? APP_PASSAGEIRO : APP_MOTORISTA}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btn} bg-accent text-accent-foreground shadow-glow-accent hover:scale-[1.02]`}
                >
                  <Play className="size-4" aria-hidden />
                  {ehPassageiro ? "Baixar App Passageiro" : "Baixar App Motorista"}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={ehPassageiro ? WA_PASSAGEIRO : WA_MOTORISTA}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btn} bg-whatsapp text-whatsapp-foreground shadow-glow-wa hover:scale-[1.02]`}
                >
                  <MessageCircle className="size-4" aria-hidden />
                  {ehPassageiro ? "Pedir pelo WhatsApp" : "Validar Cadastro"}
                </a>
              </div>

              {/* Seletor de perfil */}
              <div className="mt-8 max-w-sm">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Você é
                </p>
                <PersonaSwitch value={aba} onChange={setAba} />
              </div>
            </div>

            {/* Painel lateral / stats */}
            <div className="animate-rise [animation-delay:120ms]">
              <div className="glass overflow-hidden rounded-3xl p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    <Sparkles className="size-4" aria-hidden /> 3 anos de estrada
                  </div>
                  <span className="glass-soft rounded-full px-3 py-1 text-[11px] font-semibold text-foreground/70">
                    Amparo · SP
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { valor: "R$ 12 mil", label: "em prêmios" },
                    { valor: "Nº 1", label: "app de Amparo" },
                    { valor: "24h", label: "pelo WhatsApp" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="glass-soft rounded-2xl px-3 py-4 text-center"
                    >
                      <p className="text-base font-extrabold leading-none tracking-tight text-accent sm:text-xl">
                        {s.valor}
                      </p>
                      <p className="mt-1.5 text-[11px] leading-tight text-muted-foreground">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2.5">
                  {[
                    { icon: <ShieldCheck className="size-4" />, t: "Motoristas capacitados e atendimento humanizado" },
                    { icon: <MapPinned className="size-4" />, t: "Cobertura em todo o Circuito das Águas" },
                    { icon: <Gift className="size-4" />, t: "Indique e ganhe créditos todo mês" },
                  ].map((f) => (
                    <div key={f.t} className="flex items-start gap-3 text-sm text-foreground/85">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                        {f.icon}
                      </span>
                      <p className="min-w-0">{f.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa deslizante */}
        <div className="relative overflow-hidden rounded-full border border-border py-3">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.25em] text-foreground/45">
            {Array.from({ length: 2 }).map((_, bloco) => (
              <span key={bloco} className="flex gap-8">
                {[
                  "Amparo",
                  "Circuito das Águas",
                  "Pontualidade",
                  "Respeito",
                  "Conforto",
                  "Segurança",
                  "Prêmios",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-8">
                    {t} <span className="text-accent">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- CONTEÚDO POR PERFIL ---------- */}
        {ehPassageiro ? (
          <>
            {/* Mapa */}
            <section className="py-14 sm:py-20">
              <Reveal>
                <SectionHead
                  eyebrow={
                    <Eyebrow
                      icon={<MapPinned className="size-3.5" aria-hidden />}
                      texto="Área de cobertura"
                    />
                  }
                  titulo="Onde você estiver na região, a Lileot chega."
                  descricao="Atendemos em Amparo e em toda a região do Circuito das Águas."
                />
              </Reveal>

              <Reveal delay={80}>
                <div className="glass relative overflow-hidden rounded-3xl p-2">
                  <div className="overflow-hidden rounded-[1.4rem]">
                    <CoverageMap local={local} />
                  </div>
                  <div className="pointer-events-none absolute left-5 top-5 z-[500]">
                    <span className="glass-soft flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold">
                      <span className="size-2 animate-pulse rounded-full bg-accent" />
                      {local ? local.nome : "Localizando..."}
                    </span>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* Prêmios */}
            <section className="pb-14 sm:pb-20">
              <Reveal>
                <SectionHead
                  eyebrow={
                    <Eyebrow icon={<Trophy className="size-3.5" aria-hidden />} texto="Promoções" />
                  }
                  titulo="Festival de Prêmios — 3 Anos Lileot"
                  descricao="Em janeiro a Lileot faz 3 anos! Já distribuímos mais de R$ 12 mil em prêmios em Amparo."
                />
              </Reveal>

              <div className="grid gap-4 md:grid-cols-2">
                <Reveal>
                  <article className="glass h-full rounded-3xl p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                        Corridas via App
                      </span>
                      <Smartphone className="size-5 text-foreground/40" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold tracking-tight">
                      Maior Número de Corridas
                    </h3>
                    <ul className="mt-3">
                      <PrizeRow
                        icon={<Trophy className="size-4 text-gold" aria-hidden />}
                        pos="1º Lugar:"
                        valor="R$ 600,00"
                      />
                      <PrizeRow
                        icon={<Medal className="size-4 text-silver" aria-hidden />}
                        pos="2º Lugar:"
                        valor="R$ 500,00"
                      />
                      <PrizeRow
                        icon={<Medal className="size-4 text-bronze" aria-hidden />}
                        pos="3º Lugar:"
                        valor="R$ 400,00"
                      />
                      <PrizeRow
                        icon={<Award className="size-4 text-foreground/60" aria-hidden />}
                        pos="4º Lugar:"
                        valor="R$ 300,00"
                      />
                    </ul>
                  </article>
                </Reveal>

                <Reveal delay={90}>
                  <article className="glass h-full rounded-3xl p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-whatsapp/18 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-whatsapp">
                        Corridas via Central
                      </span>
                      <MessageCircle className="size-5 text-foreground/40" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold tracking-tight">Sorteio WhatsApp</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Chame pelo:{" "}
                      <a
                        href={WA_PASSAGEIRO}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-foreground underline decoration-accent underline-offset-4"
                      >
                        (19) 98954-8149
                      </a>
                    </p>
                    <ul className="mt-3">
                      {([
                        ["1º Lugar:", "R$ 300,00"],
                        ["2º Lugar:", "R$ 250,00"],
                        ["3º Lugar:", "R$ 200,00"],
                        ["4º Lugar:", "R$ 150,00"],
                        ["5º, 6º e 7º Lugar:", "R$ 100,00 cada"],
                      ].map(([pos, valor]) => (
                        <PrizeRow
                          key={pos}
                          icon={<Ticket className="size-4 text-accent" aria-hidden />}
                          pos={pos}
                          valor={valor}
                        />
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </div>

              <Reveal delay={120}>
                <div className="relative mt-4 overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/20 via-primary/30 to-transparent p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-glow-accent">
                        <Gift className="size-6" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-lg font-extrabold tracking-tight sm:text-xl">
                          Indique Amigos e Ganhe R$ 20,00!
                        </h4>
                        <p className="mt-1 text-sm text-foreground/80">
                          Valendo para passageiros e motoristas: ganhe{" "}
                          <strong className="text-accent">R$ 20,00</strong> por cada novo cliente
                          indicado que realizar 20 corridas!
                        </p>
                      </div>
                    </div>
                    <a
                      href={WA_PASSAGEIRO}
                      target="_blank"
                      rel="noreferrer"
                      className={`${btn} shrink-0 bg-foreground text-ink hover:scale-[1.02]`}
                    >
                      Quero indicar <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            </section>
          </>
        ) : (
          <>
            {/* Passo a passo motorista */}
            <section className="py-14 sm:py-20">
              <Reveal>
                <SectionHead
                  eyebrow={
                    <Eyebrow
                      icon={<Handshake className="size-3.5" aria-hidden />}
                      texto="Como começar"
                    />
                  }
                  titulo="Dois passos para rodar com a gente."
                />
              </Reveal>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    texto: "Baixe o App do Motorista e cadastre-se.",
                    icon: <Play className="size-5" aria-hidden />,
                    href: APP_MOTORISTA,
                    cta: "Baixar App Motorista",
                  },
                  {
                    texto: "Valide e ative seu cadastro via WhatsApp.",
                    icon: <MessageCircle className="size-5" aria-hidden />,
                    href: WA_MOTORISTA,
                    cta: "Validar Cadastro",
                  },
                ].map((p, i) => (
                  <Reveal key={p.texto} delay={i * 90}>
                    <article className="glass flex h-full flex-col justify-between gap-5 rounded-3xl p-6">
                      <div>
                        <span className="font-mono text-5xl font-extrabold leading-none text-accent/35">
                          0{i + 1}
                        </span>
                        <p className="mt-4 text-lg font-bold tracking-tight">{p.texto}</p>
                      </div>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="tap inline-flex items-center gap-2 self-start rounded-full border border-accent/40 px-5 py-2.5 text-sm font-extrabold text-accent transition-colors duration-300 hover:bg-accent hover:text-accent-foreground"
                      >
                        {p.icon} {p.cta}
                      </a>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Indique e ganhe motorista */}
            <section className="pb-14 sm:pb-20">
              <Reveal>
                <SectionHead
                  eyebrow={
                    <Eyebrow icon={<Gift className="size-3.5" aria-hidden />} texto="Vantagens" />
                  }
                  titulo="Programa Indique e Ganhe"
                />
              </Reveal>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    icon: <UserPlus className="size-6" aria-hidden />,
                    titulo: "Indique outro Motorista",
                    valor: "R$ 100,00 em créditos",
                    resto:
                      "no app assim que o motorista indicado completar 100 corridas!",
                  },
                  {
                    icon: <Users className="size-6" aria-hidden />,
                    titulo: "Indique Clientes",
                    valor: "R$ 20,00 em créditos",
                    resto: "por cada novo cliente indicado que fizer 20 corridas.",
                  },
                ].map((c, i) => (
                  <Reveal key={c.titulo} delay={i * 90}>
                    <article className="glass h-full rounded-3xl p-6 sm:p-7">
                      <span className="grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                        {c.icon}
                      </span>
                      <h3 className="mt-4 text-xl font-extrabold tracking-tight">{c.titulo}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Ganhe <strong className="text-accent">{c.valor}</strong> {c.resto}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ---------- RODAPÉ ---------- */}
        <footer className="glass mb-6 rounded-3xl px-6 py-9 text-center sm:px-10">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow-accent">
            <Car className="size-6" aria-hidden />
          </span>
          <p className="mt-4 text-balance text-xl font-extrabold tracking-tight sm:text-2xl">
            Lileot — O App Número Um de Amparo
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {[
              {
                href: "https://instagram.com/lileotlileot",
                label: "Instagram",
                icon: <Instagram className="size-5" />,
              },
              {
                href: "https://facebook.com/lileotapp",
                label: "Facebook",
                icon: <Facebook className="size-5" />,
              },
              {
                href: WA_PASSAGEIRO,
                label: "WhatsApp Central",
                icon: <MessageCircle className="size-5" />,
              },
              { href: APP_PASSAGEIRO, label: "Play Store", icon: <Play className="size-5" /> },
              {
                href: "https://www.youtube.com/@LileotTransporte",
                label: "YouTube",
                icon: <Youtube className="size-5" />,
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                className="tap glass-soft grid place-items-center rounded-2xl p-3 text-foreground/80 transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                {s.icon}
                <span className="sr-only">{s.label}</span>
              </a>
            ))}
          </div>

          <p className="mt-7 text-xs text-muted-foreground">
            © 2026 Lileot. Todos os direitos reservados.
          </p>
        </footer>
      </main>

      {/* Dock inferior (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="glass flex items-center gap-2 rounded-full p-1.5">
          <div className="min-w-0 flex-1">
            <PersonaSwitch value={aba} onChange={setAba} size="sm" />
          </div>
          <a
            href={ehPassageiro ? WA_PASSAGEIRO : WA_MOTORISTA}
            target="_blank"
            rel="noreferrer"
            title="Pedir corrida pelo WhatsApp"
            className="tap animate-pulse-ring grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground"
          >
            <MessageCircle className="size-6" aria-hidden />
            <span className="sr-only">Falar no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Botão flutuante (desktop) */}
      <a
        href={WA_PASSAGEIRO}
        target="_blank"
        rel="noreferrer"
        title="Pedir Corrida pelo WhatsApp"
        className="fixed bottom-8 right-8 z-50 hidden size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-glow-wa transition-transform duration-300 hover:scale-110 sm:grid"
      >
        <MessageCircle className="size-7" aria-hidden />
        <span className="sr-only">Pedir corrida pelo WhatsApp</span>
      </a>
    </div>
  );
}
