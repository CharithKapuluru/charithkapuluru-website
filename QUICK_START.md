# Quick Start Guide

## Option 1: Start with Gradients (No Videos Needed)

If you want to see the Apple-style animations RIGHT NOW without videos:

1. **Edit** `src/app/page.tsx`
2. **Replace** the import:
```typescript
// Change this:
import VideoSlideshow from "@/components/sections/VideoSlideshow";

// To this:
import GradientHero from "@/components/sections/GradientHero";
```

3. **Replace** the component:
```typescript
// Change this:
<VideoSlideshow />

// To this:
<GradientHero />
```

4. **Run** the dev server:
```bash
npm run dev
```

5. **Open** http://localhost:3000

You'll see the full Apple-style experience with animated gradients!

## Option 2: Use Videos (Full Effect)

### Step 1: Get Videos

**Fastest Option - Free Stock Videos:**

1. Go to [Pexels Videos](https://pexels.com/videos)
2. Search for these terms:
   - "abstract particles" → save as `slide1.mp4`
   - "purple gradient" → save as `slide2.mp4`
   - "technology" → save as `slide3.mp4`
   - "workspace" → save as `work.mp4`
   - "office desk" → save as `about.mp4`
   - "coding" → save as `projects.mp4`

3. Download in **1920x1080** resolution
4. Place all in `/public/videos/` folder

**Alternative - AI Generated:**
- See `VIDEO_GENERATION_PROMPTS.md` for AI tool prompts
- Use Runway ML, Pika Labs, or similar
- Generate custom videos matching your brand

### Step 2: Run Dev Server

```bash
cd charithkapuluru-website
npm run dev
```

Open http://localhost:3000 - videos will play automatically!

## File Structure Quick Reference

```
charithkapuluru-website/
├── src/
│   ├── app/
│   │   └── page.tsx              ← Main page (edit here)
│   └── components/
│       ├── sections/
│       │   ├── VideoSlideshow.tsx     ← Hero with videos
│       │   ├── GradientHero.tsx       ← Hero with gradients
│       │   ├── StickyVideoSection.tsx ← Sticky scroll effect
│       │   └── ParallaxSection.tsx    ← Parallax backgrounds
│       └── effects/
│           ├── VideoBackground.tsx    ← Video wrapper
│           └── useScrollAnimation.tsx ← Scroll hooks
└── public/
    └── videos/              ← Put videos here
        ├── slide1.mp4
        ├── slide2.mp4
        ├── slide3.mp4
        ├── work.mp4
        ├── about.mp4
        └── projects.mp4
```

## Customize Content

### Change Slideshow Text

Edit `src/components/sections/VideoSlideshow.tsx` (or `GradientHero.tsx`):

```typescript
const slides = [
  {
    title: 'Your Title Here',           // Big text
    subtitle: 'Your Subtitle',          // Small text above
    description: 'Your description...',  // Paragraph below
    videoSrc: '/videos/slide1.mp4',
  },
  // ... more slides
];
```

### Change Section Content

Edit `src/app/page.tsx`:

```typescript
<StickyVideoSection
  videoSrc="/videos/work.mp4"
  title="Your Custom Title"
  description="Your description here..."
  features={[
    "Your Feature 1",
    "Your Feature 2",
    "Your Feature 3"
  ]}
/>
```

## Testing Checklist

- [ ] Homepage loads without errors
- [ ] Slideshow auto-advances every 7 seconds
- [ ] Arrow buttons work (left/right)
- [ ] Dot indicators work (click to jump)
- [ ] Scroll down to see sticky section
- [ ] Parallax sections move at different speeds
- [ ] All animations are smooth (60fps)
- [ ] Mobile responsive (test on phone)

## Common Issues

### "Cannot find module 'VideoSlideshow'"
**Fix**: Make sure you're importing the right component name

### Videos not showing
**Fix**:
1. Check files are in `/public/videos/`
2. Check filenames match exactly (case-sensitive)
3. Use gradient version first to test

### Animations choppy
**Fix**:
1. Compress videos (under 10MB each)
2. Lower resolution to 1920x1080
3. Close other apps using GPU

### Build errors
**Fix**:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Production Build

When ready to deploy:

```bash
# Build static site
npm run build

# Test production build locally
npm run start

# Deploy to Firebase
firebase deploy
```

## What's Next?

1. ✅ Get the site running (gradients or videos)
2. ✅ Customize text content
3. ✅ Add your own videos
4. ✅ Update About/Projects sections
5. ✅ Test on mobile devices
6. ✅ Deploy to production

## Need More Help?

- **Full setup guide**: See `APPLE_STYLE_SETUP.md`
- **Video help**: See `VIDEO_GENERATION_PROMPTS.md`
- **Video specs**: See `public/videos/README.md`

## Pro Tips

💡 **Start with gradients** - See the animations immediately
💡 **Use stock videos first** - Faster than AI generation
💡 **Compress videos** - Keep under 10MB for fast loading
💡 **Test mobile early** - Scroll animations behave differently
💡 **Add poster images** - Better loading experience

---

**Ready to go?** Run `npm run dev` and open http://localhost:3000! 🚀
