# PUBG Mobile Tournament Registration - Design Guidelines

## Design Approach

**Selected Approach:** Gaming/Esports Reference-Based Design
**Inspiration:** Modern gaming platforms (Twitch, Discord, Valorant, League of Legends tournament sites)
**Rationale:** Tournament registration requires excitement and professionalism - dark theme with vibrant gaming accents creates trust while maintaining energy

**Core Design Principles:**
- High-contrast dark theme for gaming aesthetic
- Bold, impactful typography for tournament information
- Strategic use of gaming-inspired accent colors
- Professional yet energetic visual hierarchy
- Clear information architecture for complex registration process

## Color Palette

**Dark Mode (Primary):**
- Background Primary: 220 15% 8% (deep navy-black)
- Background Secondary: 220 15% 12% (elevated surfaces)
- Background Tertiary: 220 15% 16% (cards, form fields)

**Brand & Accent Colors:**
- Primary Brand: 25 95% 53% (vibrant orange-red, PUBG-inspired)
- Secondary Accent: 200 95% 55% (electric cyan for highlights)
- Success: 142 76% 36% (green for confirmed registrations)
- Warning: 45 93% 47% (gold for important notices)

**Text Colors:**
- Primary Text: 0 0% 98% (near-white)
- Secondary Text: 220 9% 65% (muted gray)
- Tertiary Text: 220 9% 46% (subtle gray)

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - clean, professional for body text and forms
- Display: 'Rajdhani' or 'Orbitron' (Google Fonts) - bold, gaming-inspired for headings and hero

**Type Scale:**
- Hero Headline: text-5xl/text-6xl font-bold (56-60px desktop)
- Section Headers: text-3xl/text-4xl font-bold (36-48px)
- Subsection Headers: text-xl/text-2xl font-semibold (24-30px)
- Body Text: text-base/text-lg (16-18px)
- Small Text: text-sm (14px)
- Micro Text: text-xs (12px)

**Font Weights:** 400 (regular), 600 (semibold), 700 (bold)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 20, 24 (e.g., p-4, gap-8, mb-12)

**Container Strategy:**
- Max Width: max-w-6xl for content sections
- Padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- Section Spacing: py-16 (mobile), py-20 (tablet), py-24 (desktop)

**Grid System:**
- Tournament Info: 2-column grid (lg:grid-cols-2) for details/prizes
- Form Sections: Single column with max-w-2xl for readability
- Team Display: 3-column grid (md:grid-cols-2 lg:grid-cols-3) for registered teams

## Component Library

**Navigation:**
- Sticky dark header with glass morphism effect (backdrop-blur-lg)
- Logo left, navigation links center, CTA button right
- Height: h-16 with border-b in subtle accent color

**Hero Section:**
- Full-width dark gradient background with PUBG-themed imagery
- Height: min-h-[600px] with centered content
- Headline + subheadline + dual CTAs (Register + Learn More)
- Countdown timer widget with glowing effect
- Slot counter badge (e.g., "15/25 Slots Filled")

**Tournament Details Cards:**
- Dark elevated cards (bg-secondary) with border accent on hover
- Icon + Title + Description layout
- Subtle shadow: shadow-xl with colored glow on hover
- Padding: p-6 with rounded-xl corners

**Registration Form:**
- Multi-section form with clear step indicators
- Dark input fields (bg-tertiary) with focus ring in primary color
- Floating labels or top-aligned labels with text-sm
- Upload area with drag-and-drop visual feedback
- Large submit button with gradient background

**Prize Pool Display:**
- Prominent cards with gold/silver/bronze accents
- Large prize amounts with currency symbol
- Podium-style layout (1st place centered and larger)

**Rules Section:**
- Accordion-style or numbered list with icons
- Each rule in a subtle card with left border accent
- Warning/important rules highlighted in warning color

**Team Roster Display:**
- Grid of team cards showing team name, leader, player count
- Status badge (Confirmed/Pending)
- Subtle hover lift effect

**Footer:**
- Dark with three columns: Contact, Quick Links, Social
- WhatsApp contact prominently displayed
- Tournament logo and tagline

## Animations

**Use Sparingly - Professional Only:**
- Hero: Fade-in on load (0.6s ease-out)
- Scroll Reveals: Slide-up with fade (0.4s ease-out) for sections as they enter viewport
- Cards: Subtle lift on hover (transform: translateY(-4px), 0.2s)
- Buttons: Scale on hover (scale-105, 0.2s) and active state (scale-95)
- Form Focus: Smooth border color transition (0.2s)
- Countdown Timer: Number flip animation when updating
- Slot Counter: Pulse effect when slots are filling up
- Success States: Checkmark scale-in animation on form submission

**No Animations For:**
- Background elements
- Navigation links (color transition only)
- Text content
- Static images

## Images

**Hero Section:**
- Large hero background image: PUBG Mobile gameplay scene or tournament battle scene
- Dimensions: 1920x1080 minimum
- Treatment: Dark overlay (opacity-60) with gradient from bottom
- Position: Cover entire hero section with center positioning
- Alternative: Use PUBG character silhouettes with action poses

**Tournament Prize Section:**
- Trophy/medal icons or illustrated graphics (not photos)
- 3D rendered trophies in gold/silver colors

**Rules Section:**
- Gaming icons (weapon icons, shield, target) from icon libraries
- No images, rely on iconography

**Team Roster:**
- Placeholder avatar icons or team logos if provided
- Default: Generic squad icon for teams without logos

**Payment Upload:**
- Visual representation of QR code placeholder or payment app icons
- Screenshot upload area with image preview

**Overall Image Strategy:**
The website features ONE large hero image establishing the gaming/tournament atmosphere. Remaining sections use icons, illustrations, and UI graphics rather than photographs to maintain the professional esports aesthetic.