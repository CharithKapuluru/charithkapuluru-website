# Apple-Style Website Setup Guide

Your website has been transformed with Apple-inspired animations and video backgrounds! 🎥✨

## What's New

### 1. **Video Slideshow Hero Section**
- Auto-playing slideshow with 3 video backgrounds
- Smooth crossfade transitions (7 seconds each)
- Navigation arrows and dot indicators
- Smooth scroll indicator animation
- Apple-style typography and layout

### 2. **Sticky Video Sections**
- Pin/sticky scroll effects (like Apple product pages)
- Video stays in view while content animates
- Scale and opacity transforms on scroll
- Feature cards with glass-morphism effects

### 3. **Parallax Sections**
- Video backgrounds that move at different speeds
- Fade-in animations on scroll
- Apple-style motion design
- Optimized performance

### 4. **Smooth Animations**
- Intersection Observer for scroll triggers
- Framer Motion for buttery smooth animations
- Apple-style easing curves
- Responsive and performant

## Project Structure

```
charithkapuluru-website/
├── src/
│   ├── components/
│   │   ├── effects/
│   │   │   ├── VideoBackground.tsx       # Video background component
│   │   │   └── useScrollAnimation.tsx    # Scroll animation hooks
│   │   └── sections/
│   │       ├── VideoSlideshow.tsx        # Main hero slideshow
│   │       ├── StickyVideoSection.tsx    # Sticky scroll sections
│   │       ├── ParallaxSection.tsx       # Parallax backgrounds
│   │       └── [existing sections...]
│   └── app/
│       └── page.tsx                      # Updated main page
└── public/
    ├── videos/                           # Place your videos here
    │   ├── slide1.mp4
    │   ├── slide2.mp4
    │   ├── slide3.mp4
    │   ├── work.mp4
    │   ├── about.mp4
    │   └── projects.mp4
    └── images/                           # Optional poster images
        ├── slide1-poster.jpg
        ├── work-poster.jpg
        └── ...
```

## Getting Started

### Step 1: Add Your Videos

You need **6 video files** total:

1. **Slideshow videos** (3):
   - `slide1.mp4` - Innovation theme
   - `slide2.mp4` - Design theme
   - `slide3.mp4` - Technology theme

2. **Background videos** (3):
   - `work.mp4` - Portfolio showcase
   - `about.mp4` - About section
   - `projects.mp4` - Projects section

**Video Requirements:**
- Format: MP4 (H.264)
- Resolution: 1920x1080 (Full HD) recommended
- Duration: 10-30 seconds (will loop)
- File size: Under 10MB each (compressed)
- No audio needed (will be muted)

**Where to get videos:**
- Generate with AI: Runway ML, Pika Labs, Stable Video
- Free stock: Pexels, Pixabay, Coverr
- Create your own: After Effects, Blender, DaVinci Resolve

See `/public/videos/README.md` for detailed video specifications.

### Step 2: Run the Development Server

```bash
cd charithkapuluru-website
npm run dev
```

Open http://localhost:3000 to see your site!

### Step 3: Customize Content

Edit the slideshow content in `src/components/sections/VideoSlideshow.tsx`:

```typescript
const slides: Slide[] = [
  {
    title: 'Your Title',
    subtitle: 'Your Subtitle',
    description: 'Your description...',
    videoSrc: '/videos/slide1.mp4',
    poster: '/images/slide1-poster.jpg',
  },
  // Add more slides...
];
```

Edit sticky section in `src/app/page.tsx`:

```typescript
<StickyVideoSection
  videoSrc="/videos/work.mp4"
  title="Your Custom Title"
  description="Your description..."
  features={[
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]}
/>
```

## Features Breakdown

### VideoSlideshow Component
- **Auto-play**: 7-second intervals
- **Manual controls**: Arrow buttons and dot indicators
- **Animations**:
  - Crossfade transitions (1.2s duration)
  - Text fade-in with stagger effect
  - Scroll indicator pulse animation
- **Responsive**: Mobile-friendly layout

### StickyVideoSection Component
- **Scroll behavior**: Sticks for 300vh of scroll
- **Animations**:
  - Scale transform (1 → 0.95 → 1)
  - Opacity fade (smooth transitions)
  - Text parallax movement
- **Glass-morphism cards**: Backdrop blur effects

### ParallaxSection Component
- **Parallax speed**: Customizable (default 0.5)
- **Fade effects**: Based on scroll position
- **Supports**: Video or image backgrounds
- **Gradients**: Automatic dark overlays

### Scroll Animation Hooks
- `useScrollAnimation`: Intersection Observer wrapper
- `useScrollProgress`: Global scroll percentage
- `useParallax`: Custom parallax effects

## Customization Tips

### Change Animation Speed

In `VideoSlideshow.tsx`:
```typescript
const interval = setInterval(() => {
  setCurrentSlide((prev) => (prev + 1) % slides.length);
}, 7000); // Change to 5000 for 5 seconds, etc.
```

### Adjust Parallax Speed

In `page.tsx`:
```typescript
<ParallaxSection speed={0.3}> // 0.3 = slower, 0.7 = faster
```

### Modify Transition Duration

In `VideoSlideshow.tsx`:
```typescript
transition={{ duration: 1.2 }} // Change to 0.8 for faster, 1.5 for slower
```

### Change Overlay Opacity

```typescript
<VideoBackground overlayOpacity={0.3}> // 0-1 range
```

## Performance Optimization

### Video Compression
Keep videos under 10MB:
```bash
ffmpeg -i input.mp4 -vcodec h264 -crf 28 -preset slow output.mp4
```

### Poster Images
Add poster images for faster perceived loading:
```typescript
poster="/images/slide1-poster.jpg"
```

### Lazy Loading
Videos only play when in viewport (automatic)

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase
```bash
firebase deploy
```

Your site is already configured for Firebase Hosting!

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Troubleshooting

### Videos not playing?
1. Check video files are in `/public/videos/`
2. Ensure MP4 format (H.264 codec)
3. Check browser console for errors
4. Try different video (test if specific file is corrupt)

### Animations choppy?
1. Compress videos to smaller file size
2. Reduce video resolution to 1920x1080
3. Check Chrome DevTools Performance tab
4. Disable Parallax on low-end devices

### Slideshow not advancing?
1. Check browser console for errors
2. Verify all video sources exist
3. Test with placeholder videos first

## What You Can Customize

✏️ **Easy to change:**
- Slide titles and descriptions
- Feature card content
- Colors and gradients
- Animation speeds
- Number of slides

🔧 **Moderate:**
- Section order
- Add new parallax sections
- Custom scroll triggers
- Layout modifications

⚙️ **Advanced:**
- Custom scroll animations
- New animation patterns
- Performance optimizations
- Mobile-specific behaviors

## Next Steps

1. **Add your videos** to `/public/videos/`
2. **Customize text content** in components
3. **Test on mobile** devices
4. **Optimize video sizes** for faster loading
5. **Deploy to Firebase** when ready!

## Need Help?

- Check `/public/videos/README.md` for video specs
- Review component files for customization options
- Test with dev server: `npm run dev`

---

**Pro Tips:**
- Start with low-res placeholder videos while developing
- Use poster images for better UX
- Test scroll performance on various devices
- Compress videos before final deployment
- Consider adding loading states for videos

Enjoy your new Apple-style website! 🚀
