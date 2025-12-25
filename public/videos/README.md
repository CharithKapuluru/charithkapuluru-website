# Video Files for Your Website

This folder should contain the following video files for your Apple-style website:

## Required Videos

### Main Slideshow (3 videos)
1. **slide1.mp4** - First hero slide video
2. **slide2.mp4** - Second hero slide video
3. **slide3.mp4** - Third hero slide video

### Section Background Videos
4. **work.mp4** - Portfolio/Work showcase section
5. **about.mp4** - About section background
6. **projects.mp4** - Projects section background

## Video Specifications

For best performance and quality, follow these guidelines:

### Format & Codec
- **Format**: MP4 (H.264)
- **Codec**: H.264/AVC
- **Container**: MP4

### Resolution & Size
- **Resolution**: 1920x1080 (Full HD) or 3840x2160 (4K)
- **Aspect Ratio**: 16:9
- **File Size**: Keep under 10MB per video (compress if needed)

### Settings
- **Frame Rate**: 24-30 fps
- **Duration**: 10-30 seconds (looping videos)
- **Audio**: None (videos will be muted)
- **Bitrate**: 5-8 Mbps for Full HD, 15-25 Mbps for 4K

## How to Generate Videos

### Option 1: AI Video Generation Tools
- **Runway ML** (https://runwayml.com) - Text/Image to video
- **Pika Labs** (https://pika.art) - AI video creation
- **Stable Video Diffusion** - Open source option
- **Kaiber** (https://kaiber.ai) - Music & motion videos

### Option 2: Stock Video Sites
- **Pexels Videos** (https://pexels.com/videos) - Free
- **Pixabay** (https://pixabay.com/videos) - Free
- **Coverr** (https://coverr.co) - Free
- **Artgrid** (https://artgrid.io) - Premium

### Option 3: Create Your Own
Use tools like:
- **After Effects** - Professional motion graphics
- **DaVinci Resolve** - Free video editing
- **Blender** - 3D animations

## Video Ideas by Section

### Slideshow Videos (slide1-3.mp4)
- Futuristic tech animations
- Abstract motion graphics
- Coding/development visuals
- Digital particles and networks
- Minimalist geometric animations

### Work Video (work.mp4)
- Computer screens with code
- Design tools in action
- Project showcases
- Creative process clips

### About Video (about.mp4)
- Workspace/office environment
- Technology and innovation
- Learning and development
- Professional atmosphere

### Projects Video (projects.mp4)
- Product demos
- User interface animations
- App/website interactions
- Development workflow

## Compression Tips

To keep file sizes small:

```bash
# Using FFmpeg (if you have it installed)
ffmpeg -i input.mp4 -vcodec h264 -acodec none -crf 28 -preset slow output.mp4
```

Or use online tools:
- **HandBrake** (https://handbrake.fr) - Free compression
- **Clipchamp** - Online video compressor
- **CloudConvert** - Online converter

## Poster Images (Optional but Recommended)

Create poster images (JPG/PNG) for better loading:
- Place in `/public/images/`
- Name: `slide1-poster.jpg`, `work-poster.jpg`, etc.
- Same dimensions as videos
- Used while video loads

## Quick Start

1. Generate or download your videos
2. Name them according to the list above
3. Place them in this folder
4. Optionally create poster images
5. Run `npm run dev` to see them in action!

## Need Help?

If you want me to generate placeholder videos or need specific video recommendations, just let me know what style you're looking for!
