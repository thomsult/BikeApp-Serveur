import type { ThemeConfig } from "tailwindcss/plugin";
import { colors } from "../../components/colors";

const radius = {
  none: 0,
  sm: 12,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 99999,
};
const elevation = {
  sm: "elevation-sm",
  md: "elevation-md",
  lg: "elevation-lg",
  xl: "elevation-xl",
  "2xl": "elevation-2xl",
  none: "elevation-none",
} as const;
const THEME = {
  light: {
    background: colors.neutral[100],
    foreground: colors.charcoal[900],
    card: colors.white,
    cardForeground: colors.neutral[50],
    popover: colors.white,
    popoverForeground: colors.charcoal[900],
    primary: colors.primary[500],
    primaryForeground: colors.charcoal[100],
    secondary: colors.charcoal[100],
    secondaryForeground: colors.charcoal[900],
    muted: colors.charcoal[100],
    mutedForeground: colors.charcoal[400],
    accent: colors.charcoal[100],
    accentForeground: colors.charcoal[900],
    destructive: colors.danger[500],
    border: colors.charcoal[100],
    input: colors.charcoal[200],
    ring: colors.charcoal[400],
    radius: radius.md,
    chart1: colors.primary[500],
    chart2: colors.primary[400],
    chart3: colors.primary[300],
    chart4: colors.primary[200],
    chart5: colors.primary[100],
    shadowColor: colors.black,
    success: colors.success[600],
    error: colors.danger[600],
    warning: colors.warning[600],
    info: colors.primary[600],
  },
  dark: {
    background: colors.neutral[900],
    foreground: colors.white,
    card: colors.charcoal[950],
    cardForeground: colors.charcoal[900],
    popover: colors.charcoal[950],
    popoverForeground: colors.white,
    primary: colors.primary[500],
    primaryForeground: colors.charcoal[900],
    secondary: colors.charcoal[950],
    secondaryForeground: colors.white,
    muted: colors.charcoal[900],
    mutedForeground: colors.charcoal[400],
    accent: colors.charcoal[900],
    accentForeground: colors.white,
    destructive: colors.danger[500],
    border: colors.charcoal[900],
    input: colors.charcoal[900],
    ring: colors.charcoal[500],
    radius: radius.md,
    chart1: colors.primary[500],
    chart2: colors.primary[400],
    chart3: colors.primary[300],
    chart4: colors.primary[200],
    chart5: colors.primary[500],
    shadowColor: colors.black,
    success: colors.success[600],
    error: colors.danger[600],
    warning: colors.warning[600],
    info: colors.primary[600],
  },
};

type tabBarTheme = {
  activeTintColor: string;
  inactiveTintColor: string;
};

export const NAV_THEME: Record<
  "light" | "dark",
  ThemeConfig & { tabBar: tabBarTheme; standardColor: typeof colors } & {
    colors: typeof THEME.light & {
      textLight: string;
      shadow: string;
    };
    radius: typeof radius;
    elevation: typeof elevation;
  }
> = {
  light: {
    // ...DefaultTheme,
    colors: {
      // notification: THEME.light.destructive,
      // text: THEME.light.foreground,
      textLight: THEME.light.mutedForeground,
      shadow: THEME.light.shadowColor,
      ...THEME.light,
    },
    tabBar: {
      activeTintColor: THEME.light.primary,
      inactiveTintColor: THEME.light.mutedForeground,
    },
    standardColor: colors,
    radius: radius,
    elevation: elevation,
  },
  dark: {
    // ...DarkTheme,
    colors: {
      // notification: THEME.dark.destructive,
      // text: THEME.dark.foreground,
      textLight: THEME.dark.mutedForeground,
      shadow: THEME.dark.shadowColor,
      ...THEME.dark,
    },
    tabBar: {
      activeTintColor: THEME.dark.primary,
      inactiveTintColor: THEME.dark.mutedForeground,
    },
    standardColor: colors,
    radius: radius,
    elevation: elevation,
  },
};
