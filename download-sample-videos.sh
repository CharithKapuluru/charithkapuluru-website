#!/bin/bash

# Sample Video Downloader for Apple-Style Website
# This script downloads free sample videos from Pexels to get you started

echo "🎥 Apple-Style Website - Sample Video Downloader"
echo "================================================"
echo ""
echo "This script will download 6 sample videos from Pexels (free, no attribution required)"
echo "Videos will be placed in public/videos/"
echo ""
echo "Press ENTER to continue or Ctrl+C to cancel..."
read

# Create videos directory if it doesn't exist
mkdir -p public/videos

echo ""
echo "📥 Downloading sample videos..."
echo ""

# Note: These are direct Pexels video URLs for free stock footage
# You can replace these URLs with any other free stock videos you prefer

# Slide 1 - Tech/Particles
echo "1/6 Downloading slide1.mp4 (Technology particles)..."
curl -L "https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4" -o "public/videos/slide1.mp4" --progress-bar

# Slide 2 - Abstract/Gradient
echo "2/6 Downloading slide2.mp4 (Abstract gradient)..."
curl -L "https://videos.pexels.com/video-files/8716790/8716790-uhd_2560_1440_25fps.mp4" -o "public/videos/slide2.mp4" --progress-bar

# Slide 3 - Digital/Code
echo "3/6 Downloading slide3.mp4 (Digital elements)..."
curl -L "https://videos.pexels.com/video-files/2620043/2620043-uhd_2560_1440_30fps.mp4" -o "public/videos/slide3.mp4" --progress-bar

# Work video - Workspace
echo "4/6 Downloading work.mp4 (Workspace)..."
curl -L "https://videos.pexels.com/video-files/6774207/6774207-uhd_2560_1440_25fps.mp4" -o "public/videos/work.mp4" --progress-bar

# About video - Office/Professional
echo "5/6 Downloading about.mp4 (Professional setting)..."
curl -L "https://videos.pexels.com/video-files/7688349/7688349-uhd_2560_1440_24fps.mp4" -o "public/videos/about.mp4" --progress-bar

# Projects video - Coding/Development
echo "6/6 Downloading projects.mp4 (Development)..."
curl -L "https://videos.pexels.com/video-files/4792282/4792282-uhd_2560_1440_24fps.mp4" -o "public/videos/projects.mp4" --progress-bar

echo ""
echo "✅ Download complete!"
echo ""
echo "📊 Checking file sizes..."
echo ""

# Check if files were downloaded and show sizes
for file in public/videos/*.mp4; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "  ✓ $file - $size"
    fi
done

echo ""
echo "⚠️  WARNING: These sample videos may be large (10-50MB each)"
echo "   Consider compressing them before deployment for better performance."
echo ""
echo "To compress videos, you can use:"
echo "  - HandBrake (https://handbrake.fr) - Free GUI tool"
echo "  - FFmpeg: ffmpeg -i input.mp4 -vcodec h264 -crf 28 output.mp4"
echo "  - Online tools: CloudConvert, Clipchamp"
echo ""
echo "🎉 Ready to go! Run: npm run dev"
echo ""
