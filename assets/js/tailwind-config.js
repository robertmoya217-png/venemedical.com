/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — Configuración Tailwind Centralizada
   Se incluye UNA SOLA VEZ desde cada página HTML via <script src="...">
   ════════════════════════════════════════════════════════════════════ */
try {
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          /* Primarios */
          "primary":                    "#003f87",
          "primary-container":          "#0056b3",
          "primary-fixed":              "#d7e2ff",
          "primary-fixed-dim":          "#acc7ff",
          "on-primary":                 "#ffffff",
          "on-primary-fixed":           "#001a40",
          "on-primary-fixed-variant":   "#004491",
          "on-primary-container":       "#bbd0ff",
          "inverse-primary":            "#acc7ff",
          /* Secundarios */
          "secondary":                  "#006877",
          "secondary-container":        "#75e7fe",
          "secondary-fixed":            "#a4eeff",
          "secondary-fixed-dim":        "#62d6ed",
          "on-secondary":               "#ffffff",
          "on-secondary-fixed":         "#001f25",
          "on-secondary-fixed-variant": "#004e5a",
          "on-secondary-container":     "#006776",
          /* Terciarios */
          "tertiary":                   "#004c17",
          "tertiary-container":         "#006722",
          "tertiary-fixed":             "#83fc8e",
          "tertiary-fixed-dim":         "#66df75",
          "on-tertiary":                "#ffffff",
          "on-tertiary-fixed":          "#002106",
          "on-tertiary-fixed-variant":  "#00531a",
          "on-tertiary-container":      "#6fe87c",
          /* Superficies */
          "background":                 "#f8f9fa",
          "surface":                    "#f8f9fa",
          "surface-pure":               "#ffffff",
          "surface-bright":             "#f8f9fa",
          "surface-dim":                "#d9dadb",
          "surface-variant":            "#e1e3e4",
          "surface-tint":               "#115cb9",
          "surface-container-lowest":   "#ffffff",
          "surface-container-low":      "#f3f4f5",
          "surface-container":          "#edeeef",
          "surface-container-high":     "#e7e8e9",
          "surface-container-highest":  "#e1e3e4",
          "inverse-surface":            "#2e3132",
          "inverse-on-surface":         "#f0f1f2",
          /* Texto */
          "on-surface":                 "#191c1d",
          "on-surface-variant":         "#424752",
          "on-background":              "#191c1d",
          "text-main":                  "#1A1D21",
          "text-muted":                 "#6C757D",
          /* Bordes */
          "outline":                    "#727784",
          "outline-variant":            "#c2c6d4",
          "border-subtle":              "#E9ECEF",
          /* Error */
          "error":                      "#ba1a1a",
          "error-container":            "#ffdad6",
          "on-error":                   "#ffffff",
          "on-error-container":         "#93000a"
        },
        borderRadius: {
          "DEFAULT": "0.25rem",
          "lg":      "0.5rem",
          "xl":      "0.75rem",
          "full":    "9999px"
        },
        spacing: {
          "base":            "8px",
          "gutter":          "24px",
          "section-padding": "80px",
          "margin-mobile":   "16px",
          "container-max":   "1200px"
        },
        fontFamily: {
          "body-md":             ["Inter", "system-ui", "sans-serif"],
          "body-lg":             ["Inter", "system-ui", "sans-serif"],
          "label-sm":            ["Inter", "system-ui", "sans-serif"],
          "label-md":            ["Inter", "system-ui", "sans-serif"],
          "headline-md":         ["Inter", "system-ui", "sans-serif"],
          "headline-lg":         ["Inter", "system-ui", "sans-serif"],
          "headline-xl":         ["Inter", "system-ui", "sans-serif"],
          "headline-xl-mobile":  ["Inter", "system-ui", "sans-serif"]
        },
        fontSize: {
          "body-md":            ["16px", { lineHeight: "24px", fontWeight: "400" }],
          "body-lg":            ["18px", { lineHeight: "28px", fontWeight: "400" }],
          "label-sm":           ["12px", { lineHeight: "16px", fontWeight: "600" }],
          "label-md":           ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
          "headline-md":        ["24px", { lineHeight: "32px", fontWeight: "600" }],
          "headline-lg":        ["32px", { lineHeight: "40px", fontWeight: "600" }],
          "headline-xl":        ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
          "headline-xl-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }]
        }
      }
    }
  };
} catch (_e) {
  console.warn('[Venemedical] Tailwind config error:', _e);
}
