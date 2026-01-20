# Quick Deployment Guide

**Ready to deploy in 5 minutes!** ⚡

---

## 🎯 Choose Your Deployment Method

### ⭐ Option 1: Firebase Hosting (RECOMMENDED)

**Why Firebase?**
- You're already using Firebase for auth + database
- Free hosting included
- Automatic SSL certificate
- Global CDN
- Easy rollbacks

**Deploy Now:**

```bash
# Step 1: Build
npm run build

# Step 2: Deploy
firebase deploy --only hosting

# Step 3: Done! 🎉
# Your site is live at: https://charith-c014a.web.app
```

**Custom Domain Setup:**

```bash
# Add your custom domain
firebase hosting:sites:create yourdomain.com

# Follow the prompts to verify ownership
# Firebase will provide DNS records to add
```

---

### Option 2: Vercel (Fast Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, done!
```

---

### Option 3: Netlify

```bash
# Build
npm run build

# Install Netlify
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

---

## ⚠️ CRITICAL: Before First Deploy

### 1. Add Production Domain to Firebase

**Firebase Console** → **Authentication** → **Settings** → **Authorized domains**

Add your domain:
- `yourdomain.com`
- `www.yourdomain.com`

### 2. Update Google OAuth Settings

**Google Cloud Console** → **APIs & Services** → **Credentials**

Under OAuth 2.0 Client IDs, add:
- **Authorized JavaScript origins:**
  - `https://yourdomain.com`
  - `https://www.yourdomain.com`
- **Authorized redirect URIs:**
  - `https://yourdomain.com/__/auth/handler`

---

## 🧪 Quick Test After Deploy

1. Visit your production URL
2. Click "Sign in to save progress"
3. Sign in with Google
4. Scroll to Phase 2
5. Add a note
6. Sign out → Sign back in
7. **Check:** Note is still there ✅

If YES → You're good! 🎉
If NO → Check console errors, verify Firebase config

---

## 🔧 Troubleshooting

### "Sign-in not working"
→ Check authorized domains in Firebase Console

### "Permission denied" errors
→ Run: `firebase deploy --only firestore:rules`

### "Build failed"
→ Run: `rm -rf .next && npm run build`

---

## 📊 Monitor Your Site

After deployment, check:

1. **Firebase Console** → **Hosting** → See deployment history
2. **Firebase Console** → **Authentication** → See user sign-ins
3. **Firebase Console** → **Firestore** → See data being saved

---

## 🎉 You're Live!

Your portfolio with:
- ✅ Google authentication
- ✅ Real-time data sync
- ✅ 20+ interactive features
- ✅ Fully responsive design

**Share your site:**
- LinkedIn: https://www.linkedin.com/in/charith-kapuluru-159456329/
- GitHub: https://github.com/CharithKapuluru

---

**Need detailed testing?** → See `PRE-DEPLOYMENT-TEST-CHECKLIST.md`

**Need full info?** → See `DEPLOYMENT-SUMMARY.md`
