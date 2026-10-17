export const THEME_COLOR_ADD_POOL = [
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#4B0082",
  "#EE82EE",
];

export const MAX_THEME_COLORS = 20;
export const MAX_RIM_BORDER_COLORS = 10;

type ThemeLibraryPreset = {
  value: string[];
  popular?: boolean;
};

/** Same list as the site Customize Theme Library. */
const THEME_LIBRARY_PRESETS: ThemeLibraryPreset[] = [
  { value: ["#0057b8", "#ffd700"], popular: true },
  { value: ["#f42a41", "#006a4e"] },
  { value: ["#d80621", "#ffffff"] },
  { value: ["#ee1c25", "#ffff00"] },
  { value: ["#002f6c", "#ffffff"] },
  { value: ["#001489", "#d80621"] },
  { value: ["#ffff00", "#fe9b00"] },
  { value: ["#00aec7", "#f6e500"] },
  { value: ["#009639", "#ffffff"] },
  { value: ["#2d2926", "#ffcd00", "#c8102e"] },
  { value: ["#ef3340", "#ffcd00", "#009739"] },
  { value: ["#002395", "#ffffff", "#ed2939"] },
  { value: ["#000000", "#dd0000", "#ffce00"], popular: true },
  { value: ["#008c45", "#f4f5f0", "#cd212a"] },
  { value: ["#ffffff", "#f9423a", "#00843d"] },
  { value: ["#d60270", "#9b4f96", "#0038a8"] },
  { value: ["#ff1c8d", "#ffd700", "#1ab3ff"] },
  { value: ["#b57fdd", "#ffffff", "#49821e"] },
  { value: ["#3369e8", "#d50f25", "#eeb211", "#009925"], popular: true },
  { value: ["#f16323", "#f2f3f4", "#ffd021", "#e34427"], popular: true },
  { value: ["#01a8ca", "#32d1ec", "#f1f1f1", "#afdff3"] },
  { value: ["#278df0", "#ffef93", "#ff96e1", "#9b78fc"] },
  { value: ["#383159", "#656da6", "#c5e1f2", "#52734f"] },
  { value: ["#000000", "#a4a4a4", "#ffffff", "#810081"] },
  { value: ["#000000", "#ffffff", "#6e0071", "#d3d3d3"] },
  { value: ["#000000", "#bababa", "#ffffff", "#baf484"] },
  { value: ["#fcd116", "#0038a8", "#ce1126", "#ffffff"] },
  {
    value: ["#fad381", "#d79f62", "#2e4647", "#518d6a", "#9bc692"],
    popular: true,
  },
  { value: ["#f0ece1", "#edcf8f", "#c97f4e", "#6f4a38", "#977359"] },
  { value: ["#312f2e", "#94908d", "#dad9d7", "#f0f0f0", "#c3c2be"] },
  { value: ["#b7b8f9", "#3a1f8a", "#2c1357", "#462867", "#593b6a"] },
  { value: ["#9fe2bf", "#ffe5c6", "#efcdb4", "#4bc7cf", "#5cf5ff"] },
  { value: ["#ffffff", "#ffe484", "#ffcc33", "#fc9601", "#d14009"] },
  { value: ["#4f42b5", "#82e1e3", "#d4f1f9", "#e3fffa", "#4cc395"] },
  { value: ["#23644d", "#d3f1f3", "#ffffff", "#e22a45", "#c7102e"] },
  { value: ["#775e56", "#e4e1af", "#ff9263", "#ff6455", "#7c687d"] },
  { value: ["#de7373", "#f0dc9f", "#debb89", "#7787ae", "#43487b"] },
  {
    value: ["#e0bbe4", "#957dad", "#d291bc", "#fec8d8", "#ffdfd3"],
    popular: true,
  },
  { value: ["#010101", "#011926", "#003e5c", "#016293", "#007bb8"] },
  { value: ["#dc7c00", "#ff9705", "#feb20a", "#ffcb00", "#fedf05"] },
  { value: ["#3ba740", "#a8d47a", "#ffffff", "#ababab", "#000000"] },
  { value: ["#078d70", "#98e8c1", "#ffffff", "#7bade2", "#3d1a78"] },
  { value: ["#d62800", "#ff9b56", "#ffffff", "#d462a6", "#a40062"] },
  { value: ["#fe76a2", "#ffffff", "#bf12d7", "#000000", "#303cbe"] },
  {
    value: [
      "#f4d3c4",
      "#f2aebb",
      "#d895da",
      "#a091d6",
      "#696fc7",
      "#a7aae1",
    ],
    popular: true,
  },
  {
    value: [
      "#3c47c6",
      "#656cde",
      "#de6cc8",
      "#f8a091",
      "#f7e392",
      "#f7a55d",
    ],
  },
  {
    value: [
      "#001f38",
      "#526079",
      "#9a7e8e",
      "#e3757f",
      "#fd997f",
      "#ffd0aa",
    ],
  },
  {
    value: [
      "#84a013",
      "#a8bb2e",
      "#d4da5e",
      "#ebef90",
      "#fbfdbc",
      "#fac703",
    ],
  },
  {
    value: [
      "#e9692c",
      "#ed9121",
      "#ffc324",
      "#fff000",
      "#66b447",
      "#8ee53f",
    ],
  },
  {
    value: [
      "#3ea1b6",
      "#0e6b8c",
      "#133855",
      "#6b669e",
      "#bb90c8",
      "#efd8ec",
    ],
  },
  {
    value: [
      "#135e46",
      "#478966",
      "#73a788",
      "#e3c6ad",
      "#d09d7b",
      "#b67b65",
    ],
  },
  {
    value: [
      "#5e02e9",
      "#3c70ef",
      "#30d800",
      "#e7e200",
      "#fd8b00",
      "#f20800",
    ],
    popular: true,
  },
  {
    value: [
      "#99857a",
      "#c67b5c",
      "#e27b58",
      "#ff9d6f",
      "#663926",
      "#8e6a5a",
    ],
  },
  {
    value: [
      "#761000",
      "#c10900",
      "#e92100",
      "#ffdb53",
      "#ffa93d",
      "#ff7a29",
    ],
  },
  {
    value: [
      "#bf221c",
      "#e8681f",
      "#fbc44f",
      "#ffe67f",
      "#fdffd2",
      "#f9f500",
    ],
  },
  {
    value: [
      "#0198f1",
      "#49c2ff",
      "#a9eeff",
      "#0067d4",
      "#e999de",
      "#7c62c4",
    ],
  },
  {
    value: [
      "#2377a4",
      "#50a3c6",
      "#79c0d7",
      "#f8f8f8",
      "#dddfdf",
      "#c2c2c2",
    ],
  },
  {
    value: [
      "#7c7c7c",
      "#0e1317",
      "#acdef8",
      "#344a78",
      "#fdfafc",
      "#d6d6d6",
    ],
  },
  {
    value: [
      "#9dc3ca",
      "#b7d4c6",
      "#b7d4c6",
      "#efece1",
      "#edd5c8",
      "#f2c0c5",
    ],
  },
  {
    value: [
      "#529106",
      "#61a307",
      "#86b71b",
      "#b9bd00",
      "#8ea202",
      "#799203",
    ],
  },
  {
    value: [
      "#ba4634",
      "#d85c4e",
      "#eaa250",
      "#f5dd8b",
      "#cec218",
      "#5f7818",
    ],
  },
  {
    value: [
      "#a05a48",
      "#563633",
      "#6d463c",
      "#d6bd9d",
      "#d19e6d",
      "#c57d56",
    ],
  },
  {
    value: [
      "#891180",
      "#ea27a2",
      "#fb9390",
      "#f6c892",
      "#fff5bd",
      "#fdffde",
    ],
  },
  {
    value: [
      "#c09be3",
      "#f6e0c7",
      "#f0c589",
      "#ea9a5d",
      "#ea6d63",
      "#e33f64",
    ],
  },
  {
    value: [
      "#c75589",
      "#e369a4",
      "#f5cc22",
      "#f6ef2d",
      "#b2e792",
      "#82d07b",
    ],
    popular: true,
  },
  {
    value: [
      "#00feef",
      "#09ebee",
      "#19ceeb",
      "#28acea",
      "#388ee9",
      "#3d76e0",
    ],
  },
  {
    value: [
      "#448036",
      "#5c9550",
      "#fbb837",
      "#ee6ba4",
      "#f192b5",
      "#f4b0c7",
    ],
  },
  {
    value: [
      "#d12229",
      "#f68a1e",
      "#fde01a",
      "#007940",
      "#24408e",
      "#732982",
    ],
  },
  {
    value: [
      "#FF0000",
      "#FFA500",
      "#FFFF00",
      "#008000",
      "#0000FF",
      "#4B0082",
      "#EE82EE",
    ],
    popular: true,
  },
];

export const THEME_LIBRARY: readonly string[][] = THEME_LIBRARY_PRESETS.map(
  ({ value }) => value,
);

export const FEATURED_THEME_LIBRARY: readonly string[][] =
  THEME_LIBRARY_PRESETS.filter(({ popular }) => popular).map(({ value }) => value);
