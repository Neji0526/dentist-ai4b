/**
 * Illustrated hero artwork.
 *
 * The page headers are designed around a photograph. Until the practice
 * supplies its own photography (set `hero_image_url` in the CMS, or pass
 * `media` to PageHeader), these flat vector scenes stand in — drawn from the
 * brand palette so an un-photographed site still looks finished rather than
 * broken.
 *
 * Each scene fills a 800×520 box and is safe to crop with object-cover.
 */
export type SceneName =
  | "operatory"
  | "reception"
  | "tooth-model"
  | "hygiene"
  | "team";

type Props = {
  scene: SceneName;
  className?: string;
  title: string;
};

const C = {
  wall: "#eef4fb",
  wallDeep: "#dfeaf7",
  floor: "#e4ecf3",
  white: "#ffffff",
  offWhite: "#f7fafc",
  line: "rgba(13,31,45,0.10)",
  blue: "#1466cd",
  blueMid: "#2582ef",
  blueLight: "#bcdcff",
  blueDeep: "#154684",
  mint: "#43be8c",
  mintLight: "#d5f5e3",
  ink: "#16303f",
  leaf: "#2f8f6a",
  leafDark: "#1f6b4f",
  pot: "#cbd8e3",
  gum: "#f0b3b3",
  skin1: "#f0c9a8",
  skin2: "#8d5a3b",
  skin3: "#dda57e",
  skin4: "#f5d6bb",
  hair1: "#e8c56a",
  hair2: "#2a2a2e",
  hair3: "#3a2b25",
  hair4: "#9aa4ad",
  scrub: "#1f3b63",
  scrubDark: "#162c4b",
};

function Plant({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 0c-2-16-12-27-24-32 10-2 20 2 26 10-1-14 4-25 13-32 6 10 6 23 1 33 8-8 19-11 29-8-11 6-19 17-21 29z"
        fill={C.leaf}
      />
      <path
        d="M4 2c6-10 16-16 27-16-8 7-13 16-14 26z"
        fill={C.leafDark}
        opacity="0.55"
      />
      <path d="M-16 2h34l-4 30a6 6 0 0 1-6 5h-14a6 6 0 0 1-6-5z" fill={C.pot} />
      <path d="M-16 2h34l-1 8h-32z" fill="#b6c6d4" />
    </g>
  );
}

function Operatory() {
  return (
    <>
      <rect width="800" height="520" fill={C.wall} />
      {/* window with blinds */}
      <rect x="48" y="52" width="196" height="176" rx="8" fill={C.offWhite} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x="56"
          y={64 + i * 19}
          width="180"
          height="9"
          rx="4"
          fill={C.wallDeep}
        />
      ))}
      <rect
        x="48"
        y="52"
        width="196"
        height="176"
        rx="8"
        fill="none"
        stroke={C.line}
        strokeWidth="2"
      />

      {/* back counter */}
      <rect x="520" y="236" width="256" height="150" rx="10" fill={C.white} />
      <path d="M520 236h256v12H520z" fill={C.wallDeep} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="536"
            y={266 + i * 40}
            width="224"
            height="30"
            rx="6"
            fill={C.offWhite}
            stroke={C.line}
          />
          <rect x="628" y={278 + i * 40} width="40" height="5" rx="2.5" fill={C.pot} />
        </g>
      ))}
      {/* bottles on the counter */}
      <rect x="556" y="204" width="18" height="32" rx="5" fill={C.blueLight} />
      <rect x="582" y="196" width="14" height="40" rx="5" fill={C.mintLight} />
      <rect x="604" y="210" width="20" height="26" rx="5" fill={C.white} stroke={C.line} />

      {/* floor */}
      <path d="M0 386h800v134H0z" fill={C.floor} />
      <path d="M0 386h800v4H0z" fill={C.line} />

      {/* monitor arm + screen showing an x-ray */}
      <path
        d="M330 150v-52h150"
        fill="none"
        stroke={C.pot}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="392" y="86" width="150" height="104" rx="9" fill={C.ink} />
      <rect x="402" y="96" width="130" height="84" rx="5" fill="#0d2233" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} opacity="0.75">
          <rect
            x={410 + i * 21}
            y={112 + (i % 2) * 6}
            width="14"
            height="26"
            rx="6"
            fill="#7fa7c9"
          />
          <path
            d={`M${412 + i * 21} ${138 + (i % 2) * 6}h10l-2 18h-6z`}
            fill="#5d87ab"
          />
        </g>
      ))}

      {/* overhead lamp */}
      <path
        d="M300 60v34c0 26 26 22 26 46"
        fill="none"
        stroke={C.pot}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="292" y="132" width="76" height="34" rx="12" fill={C.white} stroke={C.line} />
      <rect x="306" y="166" width="48" height="10" rx="5" fill="#fff4c9" />
      <path d="M306 176h48l40 74h-128z" fill="#fff8dd" opacity="0.5" />

      {/* dental chair */}
      <path d="M236 366h150v20a8 8 0 0 1-8 8h-134a8 8 0 0 1-8-8z" fill={C.pot} />
      <rect x="288" y="300" width="44" height="70" fill="#b6c6d4" />
      <path
        d="M212 286h190a16 16 0 0 1 16 16v22a14 14 0 0 1-14 14H212a16 16 0 0 1-16-16v-20a16 16 0 0 1 16-16z"
        fill={C.blue}
      />
      <path
        d="M196 300h222v10H196z"
        fill={C.blueDeep}
        opacity="0.35"
      />
      <path
        d="M356 176h34a18 18 0 0 1 18 18v96h-70v-96a18 18 0 0 1 18-18z"
        fill={C.blueMid}
      />
      <path
        d="M338 194c0-10 8-18 18-18h34c10 0 18 8 18 18v18h-70z"
        fill={C.blue}
      />
      <rect x="352" y="132" width="58" height="42" rx="14" fill={C.blue} />
      <rect x="418" y="212" width="16" height="70" rx="8" fill={C.blueDeep} />

      <Plant x={124} y={352} scale={1.15} />
    </>
  );
}

function Reception() {
  return (
    <>
      <rect width="800" height="520" fill={C.wall} />
      <path d="M0 372h800v148H0z" fill={C.floor} />
      <path d="M0 372h800v4H0z" fill={C.line} />

      {/* pendant lights */}
      {[300, 470].map((x) => (
        <g key={x}>
          <path d={`M${x} 0v58`} stroke={C.pot} strokeWidth="3" />
          <path d={`M${x - 26} 96c0-16 12-30 26-30s26 14 26 30z`} fill={C.white} stroke={C.line} />
          <ellipse cx={x} cy="96" rx="26" ry="5" fill="#fff4c9" />
        </g>
      ))}

      {/* wall sign */}
      <g transform="translate(340 128)">
        <rect x="0" y="0" width="34" height="34" rx="10" fill={C.blue} />
        <path
          d="M17 8c-2 0-3 1-5 1-1 0-2-1-3 0-2 1-3 4-2 7 0 2 1 3 2 6 0 2 0 4 1 6 0 2 1 3 2 3 1 0 2-2 2-4 0-2 1-4 3-4s2 2 3 4c0 2 1 4 2 4 1 0 2-1 2-3 1-2 0-4 1-6 0-3 1-4 2-6 0-3-1-6-2-7-1-1-2 0-3 0-2 0-3-1-5-1z"
          fill={C.white}
        />
        <text x="46" y="15" fontFamily="system-ui" fontSize="15" fontWeight="700" fill={C.ink}>
          Brightsmile
        </text>
        <text
          x="46"
          y="30"
          fontFamily="system-ui"
          fontSize="9"
          fontWeight="600"
          letterSpacing="2.2"
          fill={C.blue}
        >
          DENTAL STUDIO
        </text>
      </g>

      {/* framed art */}
      <rect x="596" y="120" width="112" height="88" rx="6" fill={C.white} stroke={C.line} strokeWidth="3" />
      <path d="M614 186c14-32 30-32 40-14 6 10 16 12 36-4v18z" fill={C.blueLight} />
      <circle cx="632" cy="146" r="10" fill={C.mintLight} />

      {/* waiting chairs */}
      {[600, 690].map((x) => (
        <g key={x}>
          <rect x={x} y="286" width="72" height="20" rx="8" fill={C.scrub} />
          <rect x={x + 4} y="240" width="64" height="50" rx="12" fill={C.ink} opacity="0.85" />
          <path d={`M${x + 8} 306v40M${x + 60} 306v40`} stroke={C.pot} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}

      {/* curved reception desk */}
      <path
        d="M120 300h420c26 0 46 20 46 44v72H74v-72c0-24 20-44 46-44z"
        fill={C.white}
      />
      <path
        d="M120 300h420c26 0 46 20 46 44H74c0-24 20-44 46-44z"
        fill={C.offWhite}
      />
      <path d="M74 356h512v6H74z" fill={C.line} />
      <path
        d="M120 300h420c26 0 46 20 46 44v72H74v-72c0-24 20-44 46-44z"
        fill="none"
        stroke={C.line}
        strokeWidth="2"
      />
      {/* monitors behind the desk */}
      <rect x="196" y="252" width="86" height="52" rx="6" fill={C.ink} />
      <rect x="204" y="260" width="70" height="36" rx="3" fill={C.blueLight} />
      <rect x="372" y="256" width="78" height="48" rx="6" fill={C.ink} />
      <rect x="379" y="263" width="64" height="33" rx="3" fill={C.mintLight} />

      <Plant x={92} y={352} scale={1.35} />
      <Plant x={742} y={356} scale={1.2} />
    </>
  );
}

function ToothModel() {
  return (
    <>
      <rect width="800" height="520" fill={C.wall} />
      <circle cx="150" cy="120" r="130" fill={C.blueLight} opacity="0.4" />
      <circle cx="660" cy="400" r="150" fill={C.mintLight} opacity="0.5" />
      <path d="M0 400h800v120H0z" fill={C.offWhite} />
      <path d="M0 400h800v3H0z" fill={C.line} />

      {/* blurred chair silhouette */}
      <g opacity="0.18">
        <rect x="596" y="180" width="130" height="120" rx="24" fill={C.blue} />
        <rect x="636" y="120" width="60" height="64" rx="18" fill={C.blue} />
      </g>

      {/* tray */}
      <ellipse cx="400" cy="400" rx="150" ry="26" fill={C.white} />
      <ellipse cx="400" cy="394" rx="150" ry="26" fill={C.offWhite} stroke={C.line} strokeWidth="2" />
      <ellipse cx="400" cy="404" rx="112" ry="14" fill="rgba(13,31,45,0.07)" />

      {/* big tooth */}
      <path
        d="M400 118c-26 0-40 12-62 12-16 0-29-8-44-3-24 9-38 42-32 83 4 29 15 46 22 75 7 27 6 51 12 84 5 24 14 42 24 42 19 0 22-27 28-59 5-29 8-55 34-55s29 26 34 55c6 32 9 59 28 59 10 0 19-18 24-42 6-33 5-57 12-84 7-29 18-46 22-75 6-41-8-74-32-83-15-5-28 3-44 3-22 0-36-12-62-12z"
        fill={C.white}
      />
      <path
        d="M400 118c-26 0-40 12-62 12-16 0-29-8-44-3-24 9-38 42-32 83 4 29 15 46 22 75 7 27 6 51 12 84 5 24 14 42 24 42 19 0 22-27 28-59 5-29 8-55 34-55s29 26 34 55c6 32 9 59 28 59 10 0 19-18 24-42 6-33 5-57 12-84 7-29 18-46 22-75 6-41-8-74-32-83-15-5-28 3-44 3-22 0-36-12-62-12z"
        fill="none"
        stroke={C.line}
        strokeWidth="3"
      />
      <path
        d="M336 150c-18 6-28 30-24 58 3 20 11 32 15 52"
        stroke={C.wallDeep}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <circle cx="470" cy="190" r="20" fill={C.mintLight} opacity="0.8" />

      <Plant x={214} y={396} scale={1.25} />
      <g transform="translate(560 380)">
        <rect x="-34" y="-46" width="68" height="46" rx="10" fill={C.white} stroke={C.line} strokeWidth="2" />
        <path d="M-20 -46v-10a20 20 0 0 1 40 0v10" fill="none" stroke={C.blue} strokeWidth="5" />
      </g>
    </>
  );
}

function Hygiene() {
  return (
    <>
      <rect width="800" height="520" fill={C.wall} />
      <circle cx="120" cy="90" r="110" fill={C.mintLight} opacity="0.55" />
      <circle cx="700" cy="150" r="120" fill={C.blueLight} opacity="0.35" />

      {/* back wall tiles */}
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={20 + c * 88}
            y={20 + r * 62}
            width="80"
            height="54"
            rx="6"
            fill={C.offWhite}
            opacity="0.5"
          />
        )),
      )}

      {/* tap */}
      <g opacity="0.5">
        <rect x="640" y="196" width="16" height="110" rx="8" fill={C.pot} />
        <path d="M648 196c0-30 26-44 54-44v18" stroke={C.pot} strokeWidth="15" fill="none" strokeLinecap="round" />
      </g>

      {/* counter */}
      <path d="M0 372h800v148H0z" fill={C.white} />
      <path d="M0 372h800v8H0z" fill={C.wallDeep} />
      <ellipse cx="300" cy="384" rx="150" ry="12" fill="rgba(13,31,45,0.06)" />

      {/* cup with toothbrushes */}
      <g>
        <path d="M264 214c14-6 26-2 30 6l-2 22-26-4z" fill={C.blueLight} />
        <path d="M300 190c12-10 26-10 32-2l-6 22-24 4z" fill={C.mintLight} />
        <path d="M334 210c14-4 26 2 28 10l-8 20-24-8z" fill={C.white} stroke={C.line} strokeWidth="2" />
        <path d="M276 236l18-2 12 130h-16z" fill="#e0c39a" />
        <path d="M310 214l22 4-6 148h-16z" fill="#d8b689" />
        <path d="M342 232l20 6-16 128h-14z" fill="#e6cba6" />
        <path d="M232 268h146l-12 96a16 16 0 0 1-16 14h-90a16 16 0 0 1-16-14z" fill={C.white} />
        <path d="M232 268h146l-3 22H235z" fill={C.offWhite} />
        <path
          d="M232 268h146l-12 96a16 16 0 0 1-16 14h-90a16 16 0 0 1-16-14z"
          fill="none"
          stroke={C.line}
          strokeWidth="2.5"
        />
      </g>

      {/* dentures model */}
      <g transform="translate(500 288)">
        <path
          d="M0 0c0-40 40-64 84-64s84 24 84 64c-6 44-32 62-52 62-16 0-24-14-32-14s-16 14-32 14c-20 0-46-18-52-62z"
          fill={C.gum}
        />
        <path
          d="M14 4c0-30 32-48 70-48s70 18 70 48c-4 22-14 34-24 40l-6-34-14 30-12-34-14 34-12-30-14 32c-12-6-20-18-24-38z"
          fill={C.white}
        />
        {Array.from({ length: 7 }, (_, i) => (
          <rect
            key={i}
            x={26 + i * 20}
            y={-40 + (i % 2) * 3}
            width="16"
            height="34"
            rx="6"
            fill={C.white}
            stroke={C.line}
            strokeWidth="1.5"
          />
        ))}
      </g>

      <Plant x={132} y={360} scale={1.1} />
    </>
  );
}

function Person({
  x,
  skin,
  hair,
  hairPath,
  height = 0,
}: {
  x: number;
  skin: string;
  hair: string;
  hairPath: string;
  height?: number;
}) {
  return (
    <g transform={`translate(${x} ${-height})`}>
      {/* body */}
      <path
        d="M-58 200c0-46 26-78 58-78s58 32 58 78v130h-116z"
        fill={C.scrub}
      />
      <path d="M-14 124h28l-14 34z" fill={C.white} opacity="0.9" />
      <path
        d="M-58 200c0-46 26-78 58-78 6 0 12 1 17 3-24 10-41 38-41 75v130h-34z"
        fill={C.scrubDark}
        opacity="0.5"
      />
      {/* neck + head */}
      <rect x="-14" y="98" width="28" height="34" rx="12" fill={skin} />
      <ellipse cx="0" cy="72" rx="42" ry="46" fill={skin} />
      <path d={hairPath} fill={hair} />
      <circle cx="-14" cy="72" r="3.4" fill={C.ink} />
      <circle cx="14" cy="72" r="3.4" fill={C.ink} />
      <path d="M-13 90c8 8 18 8 26 0" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Team() {
  return (
    <>
      <rect width="800" height="520" fill={C.wall} />
      <circle cx="120" cy="130" r="140" fill={C.blueLight} opacity="0.35" />
      <circle cx="690" cy="300" r="160" fill={C.mintLight} opacity="0.4" />
      <path d="M0 430h800v90H0z" fill={C.floor} opacity="0.7" />

      {/* blurred clinic hints */}
      <g opacity="0.25">
        <rect x="40" y="60" width="150" height="110" rx="10" fill={C.white} />
        <rect x="620" y="80" width="140" height="96" rx="10" fill={C.white} />
      </g>

      <g transform="translate(0 88)">
        <Person
          x={150}
          skin={C.skin1}
          hair={C.hair1}
          hairPath="M-44 66c-2-34 18-54 44-54s46 20 44 54c-6-16-14-22-22-24-10 14-40 16-52 4-6 4-11 10-14 20z"
        />
        <Person
          x={330}
          skin={C.skin2}
          hair={C.hair2}
          hairPath="M-43 62c0-32 20-50 43-50s43 18 43 50c-10-18-26-24-43-24s-33 6-43 24z"
          height={18}
        />
        <Person
          x={490}
          skin={C.skin3}
          hair={C.hair3}
          hairPath="M-45 70c-4-38 18-58 45-58s49 20 45 58c-4-20-10-28-18-32 4 40-8 56-8 56l-10-44c-14 8-34 6-44-4-4 6-8 12-10 24z"
        />
        <Person
          x={660}
          skin={C.skin4}
          hair={C.hair4}
          hairPath="M-42 60c0-30 19-48 42-48s42 18 42 48c-12-16-26-22-42-22s-30 6-42 22z"
          height={10}
        />
      </g>
    </>
  );
}

const SCENES: Record<SceneName, () => React.ReactElement> = {
  operatory: Operatory,
  reception: Reception,
  "tooth-model": ToothModel,
  hygiene: Hygiene,
  team: Team,
};

export function ClinicScene({ scene, className = "", title }: Props) {
  const Scene = SCENES[scene] ?? Operatory;

  return (
    <svg
      viewBox="0 0 800 520"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title}
    >
      <Scene />
    </svg>
  );
}
