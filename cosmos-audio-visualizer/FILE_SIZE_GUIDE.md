# File Size Guide - Quick Reference

## TL;DR - What You Need to Know

### ✅ Best Formats for Mobile
1. **MP3** (128-320kbps) - 3-7 MB per 3 minutes
2. **M4A/AAC** - 4-5 MB per 3 minutes
3. **OGG Vorbis** - 3-6 MB per 3 minutes

### ❌ Avoid on Mobile
1. **WAV** - 30 MB per 3 minutes (too large!)
2. **FLAC** - 20 MB per 3 minutes (at the limit)
3. **AIFF** - 30 MB per 3 minutes (too large!)

---

## File Size Limits

| Device | Maximum Size | What This Means |
|--------|--------------|----------------|
| **iPhone/iPad** | 20 MB | About 3-6 minutes of MP3 |
| **Android** | 20 MB | About 3-6 minutes of MP3 |
| **Desktop** | 100 MB | About 15-30 minutes of MP3 |

---

## Real-World Examples

### 3-Minute Song File Sizes

| Format | Bitrate | File Size | Mobile? | Desktop? |
|--------|---------|-----------|---------|----------|
| MP3 | 128kbps | ~3 MB | ✅ Perfect | ✅ Perfect |
| MP3 | 192kbps | ~4.5 MB | ✅ Great | ✅ Great |
| MP3 | 320kbps | ~7 MB | ✅ Good | ✅ Great |
| M4A/AAC | 256kbps | ~5 MB | ✅ Great | ✅ Great |
| OGG | 192kbps | ~4 MB | ✅ Great | ✅ Great |
| **WAV** | 1411kbps | **~30 MB** | ❌ **Too Large** | ✅ OK |
| **FLAC** | Variable | **~20 MB** | ⚠️ **At Limit** | ✅ Good |
| **AIFF** | 1411kbps | **~30 MB** | ❌ **Too Large** | ✅ OK |

---

## Why WAV Files Are Too Large

### The Math
- **WAV**: Uncompressed (stores every sample as-is)
- **Sample Rate**: 44,100 Hz (44,100 samples per second)
- **Bit Depth**: 16 bits per sample
- **Stereo**: 2 channels

**Calculation for 1 minute:**
```
44,100 samples/sec × 16 bits × 2 channels × 60 seconds
= 84,672,000 bits per minute
= 10.6 MB per minute
= ~32 MB for 3 minutes
```

### Compare to MP3
MP3 compresses this by removing inaudible frequencies:
- **MP3 (192kbps)**: 1.44 MB per minute = ~4.3 MB for 3 minutes
- **Compression ratio**: ~90% smaller than WAV!

---

## What Happens If File Is Too Large?

### On Mobile (>20 MB)
1. Alert message appears: "File too large: XX MB"
2. Maximum size shown: "Maximum size on this device: 20 MB"
3. Helpful tips provided
4. File is NOT loaded (prevents crash)

### Message You'll See
```
File too large: 35.2 MB

Maximum size on this device: 20 MB

Tips:
• Use MP3 instead of WAV (much smaller)
• Compress/convert your audio file
• Try a shorter clip
```

---

## How to Convert WAV to MP3

### Option 1: Free Online Converters
- **CloudConvert**: https://cloudconvert.com/wav-to-mp3
- **Online-Convert**: https://audio.online-convert.com/convert-to-mp3
- **FreeConvert**: https://www.freeconvert.com/wav-to-mp3

**Steps:**
1. Upload your WAV file
2. Select MP3 as output format
3. Choose bitrate (192kbps recommended)
4. Download converted file

### Option 2: On iPhone
**Using GarageBand (Free):**
1. Open GarageBand
2. Create new project
3. Import your WAV file
4. Tap Share → Song
5. Choose "Audio Only"
6. Select quality (Medium = 192kbps)
7. Export and save

### Option 3: Desktop Software

**Audacity (Free, Cross-Platform):**
1. Download from https://www.audacityteam.org/
2. Open WAV file
3. File → Export → Export as MP3
4. Choose bitrate (192kbps recommended)
5. Save

**iTunes/Apple Music (Mac):**
1. Import WAV file to library
2. Select the file
3. File → Convert → Create MP3 Version
4. Find converted file in library

**Windows Media Player (Windows):**
1. Insert or open WAV file
2. Rip settings → Format → MP3
3. Rip CD or convert file

---

## Recommended Settings for Conversion

### For Best Quality (still mobile-friendly)
- **Format**: MP3
- **Bitrate**: 192-256 kbps
- **Sample Rate**: 44.1 kHz
- **Result**: ~4-5 MB per 3 minutes

### For Smallest File (acceptable quality)
- **Format**: MP3 or AAC
- **Bitrate**: 128 kbps
- **Sample Rate**: 44.1 kHz
- **Result**: ~3 MB per 3 minutes

### For Maximum Quality (desktop only)
- **Format**: MP3
- **Bitrate**: 320 kbps
- **Sample Rate**: 44.1 kHz
- **Result**: ~7 MB per 3 minutes

---

## File Size Calculator

### Quick Formula
**MP3 File Size (MB) = (Bitrate in kbps × Duration in seconds) / 8192**

**Examples:**
- 128 kbps × 180 seconds (3 min) / 8192 = **2.8 MB**
- 192 kbps × 180 seconds / 8192 = **4.2 MB**
- 320 kbps × 180 seconds / 8192 = **7.0 MB**

### WAV File Size
**WAV File Size (MB) = Duration in minutes × 10.6**

**Examples:**
- 3 minutes × 10.6 = **31.8 MB** ❌ Too large for mobile
- 5 minutes × 10.6 = **53 MB** ❌ Too large for mobile
- 1 minute × 10.6 = **10.6 MB** ✅ OK for mobile

---

## FAQ

### Q: Why is my WAV file rejected on mobile but works on desktop?
**A:** Mobile browsers have memory limits. Desktop browsers can handle larger files. A 3-minute WAV (~30 MB) exceeds mobile's 20 MB limit.

### Q: Will converting to MP3 affect the visualization?
**A:** Not noticeably! MP3 at 192kbps preserves all audible frequencies. The visualizer works great with compressed audio.

### Q: Can I upload FLAC files?
**A:** Yes, but they're often 20+ MB. This is at the mobile limit. MP3 is safer.

### Q: What's the best format for iPhone?
**A:** M4A/AAC (Apple's native format) or MP3 at 192kbps. Both work perfectly and stay under 5 MB.

### Q: My file is 25 MB on desktop. Will it work?
**A:** Yes! Desktop limit is 100 MB. Only mobile is limited to 20 MB.

### Q: How can I reduce file size without converting?
**A:** Trim the audio to only the part you want to visualize. A 1-minute clip will be ~1/3 the size of a 3-minute song.

### Q: Does bitrate affect visualization quality?
**A:** No! The visualizer analyzes frequencies. Even 128kbps MP3 has enough frequency data for great visualization.

---

## Summary Table

| Your Goal | Recommended Format | Bitrate | File Size (3 min) | Mobile | Desktop |
|-----------|-------------------|---------|-------------------|--------|---------|
| Best quality for mobile | MP3 | 192-256kbps | 4-5 MB | ✅ | ✅ |
| Smallest file | MP3 | 128kbps | 3 MB | ✅ | ✅ |
| Best for iPhone | M4A/AAC | 192-256kbps | 4-5 MB | ✅ | ✅ |
| Maximum quality | MP3 | 320kbps | 7 MB | ✅ | ✅ |
| Desktop only | WAV | Uncompressed | 30 MB | ❌ | ✅ |
| Lossless | FLAC | Variable | 20 MB | ⚠️ | ✅ |

---

**Pro Tip:** For the best mobile experience, convert all WAV files to MP3 at 192kbps. You'll get excellent quality at ~4 MB per 3 minutes!
