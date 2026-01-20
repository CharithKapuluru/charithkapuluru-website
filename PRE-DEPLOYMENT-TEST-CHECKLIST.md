# Pre-Deployment Testing Checklist

**Date:** January 15, 2026
**Website:** Charith Kapuluru Portfolio
**Test Environment:** http://localhost:3000

---

## ✅ Build Status
- [x] **Production build successful** - No TypeScript errors
- [x] **No build warnings** - Clean compilation
- [x] **Static export ready** - All pages pre-rendered

---

## 1. Authentication Testing

### Test 1.1: Google Sign-In
- [ ] Click "Sign in to save progress" button (top-right)
- [ ] Google Sign-In popup appears
- [ ] Select your Google account
- [ ] Successfully signed in (button shows your first name)
- [ ] **Expected:** No console errors

### Test 1.2: User Profile Dropdown
- [ ] Click on your name button (top-right)
- [ ] Dropdown shows:
  - Your full name
  - Your email address
  - Sync message
  - Sign Out button
- [ ] Click outside dropdown to close it
- [ ] **Expected:** Smooth dropdown animation

### Test 1.3: Sign Out
- [ ] Open dropdown
- [ ] Click "Sign Out"
- [ ] Button changes back to "Sign in to save progress"
- [ ] **Expected:** Logged out successfully

---

## 2. Progress Tracking Testing

### Test 2.1: Auto-Completion on Scroll
**Precondition:** Sign in first

- [ ] Open Progress Sidebar (on desktop, or click % button on mobile)
- [ ] Note: Phase 0 should be checked initially
- [ ] Scroll down to Phase 1 content
- [ ] **Expected:** Phase 0 automatically gets checked ✓
- [ ] Continue scrolling to Phase 2
- [ ] **Expected:** Phase 0 and 1 are both checked
- [ ] Scroll to Phase 3
- [ ] **Expected:** Phases 0, 1, 2 are all checked

### Test 2.2: Manual Checkbox Toggle
- [ ] Click the checkbox for Phase 4 manually
- [ ] **Expected:** Phase 4 gets checked
- [ ] Click it again
- [ ] **Expected:** Phase 4 gets unchecked

### Test 2.3: Progress Persistence (CRITICAL)
**This tests Firestore sync**

- [ ] While signed in, scroll to Phase 3 (should auto-check 0, 1, 2)
- [ ] Manually check Phase 5
- [ ] Note your progress percentage (e.g., 50%)
- [ ] Sign out
- [ ] Sign back in
- [ ] **CRITICAL TEST:** Progress should be EXACTLY the same
  - Phases 0, 1, 2, 5 should be checked
  - Progress percentage should match
  - [ ] ✅ Progress restored correctly
  - [ ] ❌ Progress reset to zero (FAIL - report this)

### Test 2.4: Progress Bar Visual
- [ ] Progress bar shows correct percentage
- [ ] Shows "X/8" completed count
- [ ] Bar fills from left to right
- [ ] Green color (#3A5A40)

---

## 3. Personal Notes Testing

### Test 3.1: Create Notes
**Precondition:** Sign in first

- [ ] Scroll to Phase 1
- [ ] Find "Personal Notes" section
- [ ] Type a note: "Test note for Phase 1"
- [ ] Click "Add Note"
- [ ] **Expected:** Note appears below with timestamp

### Test 3.2: Multiple Notes
- [ ] Add another note: "Second test note"
- [ ] **Expected:** Both notes visible
- [ ] Each has a delete (×) button

### Test 3.3: Delete Notes
- [ ] Click × on first note
- [ ] **Expected:** First note disappears
- [ ] Second note remains

### Test 3.4: Notes Persistence (CRITICAL)
**This tests Firestore sync**

- [ ] Add note: "This should persist across sessions"
- [ ] Sign out
- [ ] Sign back in
- [ ] Scroll to Phase 1
- [ ] **CRITICAL TEST:** Your note should still be there
  - [ ] ✅ Note restored correctly
  - [ ] ❌ Note disappeared (FAIL - report this)

### Test 3.5: Notes in Different Phases
- [ ] Add note in Phase 0
- [ ] Add note in Phase 2
- [ ] **Expected:** Each phase shows only its own notes

---

## 4. Bookmark Testing

### Test 4.1: Add Bookmarks
**Precondition:** Sign in first

- [ ] Scroll to Phase 2
- [ ] Click the bookmark icon (🔖)
- [ ] **Expected:** Icon fills/changes color
- [ ] Bookmark Phase 4 as well

### Test 4.2: Remove Bookmarks
- [ ] Click bookmark icon on Phase 2 again
- [ ] **Expected:** Bookmark removed (icon returns to outline)

### Test 4.3: Bookmark Persistence (CRITICAL)
**This tests Firestore sync**

- [ ] Bookmark Phase 1 and Phase 3
- [ ] Sign out
- [ ] Sign back in
- [ ] **CRITICAL TEST:** Phases 1 and 3 should still be bookmarked
  - [ ] ✅ Bookmarks restored correctly
  - [ ] ❌ Bookmarks disappeared (FAIL - report this)

---

## 5. Search Functionality Testing

### Test 5.1: Search Bar Access
- [ ] Find search button (top-left corner)
- [ ] Shows magnifying glass icon + "Search" text
- [ ] Press ⌘K (Mac) or Ctrl+K (Windows)
- [ ] **Expected:** Search modal opens

### Test 5.2: Search Content
- [ ] Type "docker"
- [ ] **Expected:** Results show phases mentioning Docker
- [ ] Click on a result
- [ ] **Expected:** Jumps to that phase

### Test 5.3: Search Close
- [ ] Press Escape
- [ ] **Expected:** Search modal closes
- [ ] Click search button again to reopen
- [ ] Click outside modal (on overlay)
- [ ] **Expected:** Modal closes

---

## 6. Quiz and Celebration Testing

### Test 6.1: Phase 0 Quiz
- [ ] Scroll to Phase 0 quiz section
- [ ] Answer all questions (try to get 80%+ correct)
- [ ] Click "Next" through questions
- [ ] Click "View Results"
- [ ] **Expected:** Score displayed

### Test 6.2: Celebration Trigger
**Must score 80% or higher**

- [ ] If score ≥ 80%, celebration should trigger
- [ ] **Expected:**
  - Confetti animation appears
  - Celebration message shows
  - Message says "🎉 Excellent work!"
- [ ] [ ] ✅ Celebration triggered
- [ ] [ ] ❌ No celebration (check score was ≥ 80%)

### Test 6.3: Quiz in Other Phases
- [ ] Try Phase 1 quiz
- [ ] **Expected:** Same functionality

---

## 7. Terminal Testing

### Test 7.1: Terminal Visibility
- [ ] Check that terminals appear in phases:
  - [ ] Phase 1
  - [ ] Phase 2
  - [ ] Phase 3
  - [ ] Phase 5
  - [ ] Phase 6
  - [ ] Phase 7

### Test 7.2: Terminal Interaction (Phase 1)
- [ ] Go to Phase 1 terminal
- [ ] Terminal shows "Click the Play button above to start!" message
- [ ] Click Play button (▶️) at top-right of terminal
- [ ] **Expected:** Commands execute line by line with typing animation
- [ ] Each command shows output
- [ ] Can see `git clone`, `cd`, etc.

### Test 7.3: Terminal Controls
- [ ] After playing, Pause button (⏸️) appears
- [ ] Click Pause
- [ ] **Expected:** Animation pauses
- [ ] Click Play again
- [ ] **Expected:** Animation resumes
- [ ] Click Restart button (↻)
- [ ] **Expected:** Animation starts from beginning

### Test 7.4: Terminal in All Phases
Repeat Test 7.2 for each phase with terminal:
- [ ] Phase 2 terminal works
- [ ] Phase 3 terminal works
- [ ] Phase 5 terminal works
- [ ] Phase 6 terminal works
- [ ] Phase 7 terminal works

---

## 8. Interactive Components Testing

### Test 8.1: Flashcards
- [ ] Find flashcard component (Phase 0)
- [ ] Click "Show Answer"
- [ ] **Expected:** Answer reveals
- [ ] Click "Next Card"
- [ ] **Expected:** Next question appears

### Test 8.2: Collapsibles
- [ ] Find a collapsible section
- [ ] Click to expand
- [ ] **Expected:** Content smoothly reveals
- [ ] Click to collapse
- [ ] **Expected:** Content smoothly hides

### Test 8.3: Tooltips
- [ ] Hover over tooltips (i) icons
- [ ] **Expected:** Tooltip text appears
- [ ] Move mouse away
- [ ] **Expected:** Tooltip disappears

### Test 8.4: Animated Diagrams
- [ ] Find CI/CD pipeline diagram (Phase 5)
- [ ] **Expected:** Steps animate sequentially
- [ ] Docker flow diagram works (Phase 4)

---

## 9. Responsive Design Testing

### Test 9.1: Desktop View (>1024px)
- [ ] Progress sidebar visible on right
- [ ] Login button top-right
- [ ] Search button top-left
- [ ] All content readable
- [ ] No horizontal scroll

### Test 9.2: Mobile View (<768px)
**Use browser DevTools to simulate**

- [ ] Progress sidebar hidden by default
- [ ] Floating % button appears (bottom-right)
- [ ] Click % button
- [ ] **Expected:** Progress sidebar slides in from right
- [ ] Click outside to close
- [ ] **Expected:** Sidebar slides out
- [ ] Login button still visible top-right
- [ ] All content stacks vertically
- [ ] No horizontal scroll

### Test 9.3: Tablet View (768px-1024px)
- [ ] Layout adapts appropriately
- [ ] Touch targets large enough
- [ ] Content readable

---

## 10. Console Error Testing

### Test 10.1: Check Browser Console
**Open DevTools > Console tab**

- [ ] Refresh page
- [ ] **Expected:** No red errors
- [ ] Sign in
- [ ] **Expected:** No authentication errors
- [ ] Scroll through all phases
- [ ] **Expected:** No Firestore permission errors
- [ ] Add notes, bookmarks
- [ ] **Expected:** No database errors

### Test 10.2: Network Tab
**Open DevTools > Network tab**

- [ ] Sign in
- [ ] Check for failed requests (red)
- [ ] **Expected:** All Firebase requests return 200 or 304
- [ ] No 401 (Unauthorized) errors
- [ ] No 403 (Forbidden) errors

---

## 11. Performance Testing

### Test 11.1: Page Load Speed
- [ ] Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
- [ ] **Expected:** Page loads in < 3 seconds
- [ ] Smooth scroll works immediately

### Test 11.2: Animation Performance
- [ ] Scroll quickly through all phases
- [ ] **Expected:** No lag or stuttering
- [ ] Animations are smooth (60fps)

---

## 12. Firestore Data Verification

### Test 12.1: Check Firebase Console
**Go to Firebase Console > Firestore Database**

- [ ] Navigate to `users` collection
- [ ] Find your user ID folder
- [ ] Should see 3 subcollections:
  - [ ] `notes` - Contains your notes
  - [ ] `bookmarks` - Contains your bookmarks
  - [ ] `progress` - Contains completedPhases document

### Test 12.2: Verify Data Structure
- [ ] Click on `progress/completedPhases`
- [ ] Should see:
  ```
  {
    phases: [0, 1, 2, ...] // Array of completed phase IDs
  }
  ```
- [ ] Array matches your progress in the app

---

## 13. Security Rules Testing

### Test 13.1: Unauthenticated Access
- [ ] Sign out completely
- [ ] Open DevTools > Console
- [ ] Try to navigate site
- [ ] **Expected:** No permission errors (using localStorage)
- [ ] Bookmarks and notes use local storage
- [ ] No Firestore access attempts

### Test 13.2: Cross-User Security
**⚠️ CRITICAL SECURITY TEST**

This verifies users can't access each other's data:
- [ ] Note your user ID from Firebase Console
- [ ] Copy another test user ID (or create fake UID)
- [ ] Try to manually access: `users/{OTHER_USER_ID}/notes`
- [ ] **Expected:** Access denied / Permission error

---

## 14. Edge Cases Testing

### Test 14.1: Rapid Actions
- [ ] Click bookmark icon rapidly 5 times
- [ ] **Expected:** No UI glitches
- [ ] Final state is correct (bookmarked or not)

### Test 14.2: Long Notes
- [ ] Create a very long note (500+ characters)
- [ ] **Expected:** Note displays correctly
- [ ] Scrollable if needed
- [ ] Saves to Firestore

### Test 14.3: Special Characters in Notes
- [ ] Add note with emojis: "Great content! 🚀✨"
- [ ] Add note with quotes: "This is a 'test' note"
- [ ] **Expected:** All characters display correctly

### Test 14.4: Network Offline
**Optional advanced test**

- [ ] Open DevTools > Network tab
- [ ] Set to "Offline"
- [ ] Try to add note
- [ ] **Expected:** Error or offline indicator
- [ ] Set back to "Online"
- [ ] **Expected:** Note syncs

---

## 15. Final Checklist Before Deployment

- [ ] All critical features tested and working
- [ ] No console errors
- [ ] Firestore sync working (progress, notes, bookmarks persist)
- [ ] Production build successful
- [ ] All interactive components responsive
- [ ] Mobile view works correctly
- [ ] Authentication flow complete
- [ ] Security rules deployed

---

## Known Issues (if any)

_Document any issues found during testing:_

1.
2.
3.

---

## Deployment Ready?

- [ ] **YES** - All tests passed, ready to deploy
- [ ] **NO** - Issues found (see Known Issues section)

---

## Post-Deployment Verification

After deploying to production:

1. [ ] Test the live URL
2. [ ] Verify Google Sign-In works on production domain
3. [ ] Check Firebase Console for authentication
4. [ ] Test one complete user flow (sign in → progress → sign out → sign in → verify persistence)
5. [ ] Monitor Firebase Console for any errors
6. [ ] Check Analytics (if configured)

---

**Tested by:** _Your name_
**Date:** _____________
**Production URL:** _____________
**Status:** 🟢 READY / 🟡 ISSUES FOUND / 🔴 NOT READY
