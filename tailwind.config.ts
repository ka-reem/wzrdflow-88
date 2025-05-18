import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
			fontFamily: {
				serif: ['Cinzel', 'serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'glow-purple-md': '0 0 15px rgba(147, 51, 234, 0.5), 0 0 25px rgba(147, 51, 234, 0.2)',
				'glow-blue-md': '0 0 15px rgba(47, 123, 188, 0.5), 0 0 25px rgba(47, 123, 188, 0.2)',
			},
			transitionDuration: {
				'std': '300ms',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(147, 51, 234, 0.3), 0 0 10px rgba(147, 51, 234, 0.1)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 30px rgba(147, 51, 234, 0.2)' 
					}
				},
				'text-glow-pulse': {
					'0%, 100%': { 
						textShadow: '0 0 5px rgba(255, 182, 40, 0.3), 0 0 10px rgba(255, 182, 40, 0.1)' 
					},
					'50%': { 
						textShadow: '0 0 8px rgba(255, 182, 40, 0.5), 0 0 15px rgba(255, 182, 40, 0.2)' 
					}
				},
				'noise-animation': {
					'0%': { transform: 'translate(0, 0)' },
					'10%': { transform: 'translate(-5%, -5%)' },
					'20%': { transform: 'translate(-10%, 5%)' },
					'30%': { transform: 'translate(5%, -10%)' },
					'40%': { transform: 'translate(-5%, 15%)' },
					'50%': { transform: 'translate(-10%, 5%)' },
					'60%': { transform: 'translate(15%, 0)' },
					'70%': { transform: 'translate(0, 10%)' },
					'80%': { transform: 'translate(-15%, 0)' },
					'90%': { transform: 'translate(10%, 5%)' },
					'100%': { transform: 'translate(0, 0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'text-glow-pulse': 'text-glow-pulse 3s ease-in-out infinite',
				'noise': 'noise-animation 0.2s infinite'
			},
			backgroundImage: {
				'noise': 'url("/noise.png")',
				'gradient-dark': 'radial-gradient(ellipse at bottom, hsl(224, 71%, 10%) 0%, hsl(224, 71%, 4%) 100%)',
				'gradient-hero': 'linear-gradient(135deg, rgba(76, 29, 149, 0.5) 0%, rgba(124, 58, 237, 0.5) 35%, rgba(139, 92, 246, 0.5) 75%, rgba(167, 139, 250, 0.3) 100%)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			}
		},
		transformStyle: {
			'3d': 'preserve-3d',
			'flat': 'flat',
		},
		perspective: {
			'none': 'none',
			'500': '500px',
			'1000': '1000px',
			'2000': '2000px',
		},
		backfaceVisibility: {
			'visible': 'visible',
			'hidden': 'hidden',
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.transform-style-3d': {
					'transform-style': 'preserve-3d',
				},
				'.transform-style-flat': {
					'transform-style': 'flat',
				},
				'.perspective-none': {
					'perspective': 'none',
				},
				'.perspective-500': {
					'perspective': '500px',
				},
				'.perspective-1000': {
					'perspective': '1000px',
				},
				'.perspective-2000': {
					'perspective': '2000px',
				},
				'.backface-visible': {
					'backface-visibility': 'visible',
				},
				'.backface-hidden': {
					'backface-visibility': 'hidden',
				},
				'.transition-all-std': {
					'transition': 'all 300ms ease-out',
				},
				'.transition-all-fast': {
					'transition': 'all 200ms ease-out',
				},
				'.glass-panel': {
					'background-color': 'rgba(10, 13, 22, 0.8)',
					'backdrop-filter': 'blur(12px)',
					'border-color': 'rgba(255, 255, 255, 0.1)',
				},
				'.glass-card': {
					'background-color': 'rgba(24, 24, 27, 0.6)',
					'backdrop-filter': 'blur(8px)',
					'border-color': 'rgba(255, 255, 255, 0.1)',
				},
				'.glass-input': {
					'background-color': 'rgba(0, 0, 0, 0.3)',
					'backdrop-filter': 'blur(4px)',
					'border-color': 'rgba(255, 255, 255, 0.1)',
				},
			};
			addUtilities(newUtilities);
		}
	],
} satisfies Config;
