import type { Config } from "tailwindcss";
import tailwindcssAnimate from 'tailwindcss-animate';
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        back: {
          one: {
            DEFAULT: 'var(--back-one)',
            one: 'var(--back-one-one)',
            two: 'var(--back-one-two)',
            three: 'var(--back-one-three)',
          },
          two: {
            DEFAULT: 'var(--back-two)',
            one: 'var(--back-two-one)',
            two: 'var(--back-two-two)',
            three: 'var(--back-two-three)',
          },
          three: {
            DEFAULT: 'var(--back-three)',
            one: 'var(--back-three-one)',
            two: 'var(--back-three-two)',
            three: 'var(--back-three-three)',
          },
          four: 'var(--back-four)',
        },
        text: {
          DEFAULT: 'var(--milky-white)',
          hovered: 'var(--hovered-text)',
          clicked: 'var(--clicked-text)',
          muted: 'var(--muted-text)',
          description: 'var(--description-text)',
          highlighted: 'var(--highlighted-text)',
          selected: 'var(--selected-text)',
          disabled: 'var(--disabled-text)',
          error: 'var(--error-text)',
          success: 'var(--success-text)',
          link: 'var(--link-text)',
          userStatus: 'var(--user-status-text)',
        },
        divider: 'var(--back-one)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'var(--back-two)',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      spacing: {
        nav: 'calc(50px)',
        sidebar: 'calc(270px)',
        miniSidebar: 'calc(75px)',
      },
      fontSize: {
        title: '2rem',
        description: '1rem',
        'card-title': '1.25rem',
        'card-description': '0.875rem',
        heading: '1.5rem',
        subheading: '1.125rem',
        body: '1rem',
        muted: '0.875rem',
        small: '0.75rem',
        'message-username': '1.15rem',
        'message-time': '0.75rem',
        'message-user': '1rem',
        'message-system': '0.875rem',
        'divider-text': '0.75rem',
      }
    }
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
