# 📱 ATG Workout App - Installation Guide

## PWA Installation (Recommended)
The ATG Workout app can be installed as a Progressive Web App (PWA) on your phone, making it feel like a native app with an icon on your home screen.

### 📱 iPhone/iPad Installation
1. Open **Safari** and navigate to the workout app
2. Tap the **Share button** (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired, then tap **"Add"**
5. The app icon will appear on your home screen!

### 🤖 Android Installation
1. Open **Chrome** and navigate to the workout app
2. Tap the **menu** (three dots in top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Add"** to confirm
5. The app icon will appear on your home screen!

## ✨ PWA Benefits
- **Works offline** - No internet needed once installed
- **Fast loading** - Cached for instant startup
- **Home screen icon** - Just like a real app
- **No app store** - Install directly from browser
- **Auto-updates** - Always gets latest version

## 🌐 Web Deployment
Simply upload these files to any web host:
- `index.html` (main app)
- `manifest.json` (PWA configuration)
- `sw.js` (service worker for offline)
- `icon-192.png` (small app icon)
- `icon-512.png` (large app icon)

Popular hosting options:
- **Surge.sh**: `surge` (super simple)
- **Netlify**: Drag & drop deployment
- **GitHub Pages**: Free hosting from repo
- **Vercel**: Zero-config deployment

## 🔧 Technical Features
- **Session persistence** - Saves progress automatically
- **Sticky header** - Always see progress and timer
- **Auto-scroll** - Smooth navigation between exercises
- **Mobile optimized** - Perfect for phone workouts
- **Offline ready** - Works without internet

---
*Built as a single HTML file for maximum simplicity and portability*