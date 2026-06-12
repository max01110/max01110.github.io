# Maxime Michet - Academic Portfolio Website

A modern, animated academic portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean academic styling with creative UI elements
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Responsive**: Fully responsive design for all devices
- **Interactive Components**: 
  - Orbiting emojis around profile photo
  - Expandable experience timeline
  - Project filtering by category
  - Animated publication cards
  - Terminal-style bio section
- **Fast Performance**: Built with Vite for optimal loading speed

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vite** - Build tool
- **Lucide React** - Icons

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd academic-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
academic-site/
├── public/
│   └── images/           # Project images and profile photo
├── src/
│   ├── components/       # React components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Publications.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── content.ts    # All content data (edit this!)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css         # Global styles + Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## ✏️ Customization

### Content
Edit `src/data/content.ts` to update:
- Personal information
- Publications
- Projects
- Experience
- Skills

### Styling
- Colors and fonts are defined in `tailwind.config.js`
- Global styles are in `src/index.css`

### Images
1. Add your profile photo to `public/images/profile.png`
2. Add project images to `public/images/projects/`

## 🌐 Deploying to GitHub Pages

1. Update the `homepage` in `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io"
   ```

2. For a repo-specific page (github.io/repo-name), also update `vite.config.ts`:
   ```ts
   base: '/your-repo-name/'
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Alternative: Deploy to Vercel/Netlify

Simply connect your GitHub repository - no configuration needed!

## 📄 Adding Your CV

Place your CV PDF at `public/cv.pdf` and it will be accessible via the CV button in the navigation.

## 🎨 Design Philosophy

This website balances the clean, professional aesthetic expected of academic websites with modern UI elements:

- **Typography**: Elegant Playfair Display for headings, readable Source Sans 3 for body text
- **Colors**: Warm paper-like tones with strategic accent colors
- **Animations**: Subtle motion that enhances UX without distraction
- **Fun Elements**: Orbiting emojis, terminal-style bio, gradient effects

## 📝 License

MIT License - feel free to use this template for your own portfolio!

---

Made with ❤️ by Maxime Michet

