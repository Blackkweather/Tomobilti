# Quick Fix for Email Capture

## The Problem
The `/api/email-leads` endpoint returns HTML (404) because the server hasn't picked up the new route.

## Quick Solution

### Option 1: Force Kill and Restart Server
```bash
# Windows
taskkill /F /IM node.exe
npm run dev

# Or just Ctrl+C multiple times until it stops, then:
npm run dev
```

### Option 2: Test if Server Restarted
Open browser console and run:
```javascript
fetch('/api/email-leads', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'test@test.com', source: 'welcome_popup'})
}).then(r => r.json()).then(console.log)
```

If you see `{discountCode: "WELCOMEXXXXX"}` → ✅ Working!
If you see HTML → ❌ Server not restarted

### Option 3: Check Server Console
Look for this message when server starts:
```
Storage instance created successfully
```

If you don't see it, the server didn't restart properly.

## After Server Restarts

1. Close membership popup
2. Wait 2 seconds
3. Email capture appears in bottom-left
4. Enter email
5. Get discount code!

## View Captured Emails
```bash
node scripts\view-email-leads.cjs
```

## Common Issues

### "Unexpected token '<'" Error
- Server is returning HTML (404)
- Route not registered
- **Solution**: Fully restart server

### Server Won't Stop
```bash
# Windows - Force kill all Node processes
taskkill /F /IM node.exe

# Then restart
npm run dev
```

### Still Not Working?
Check if port 5000 is in use:
```bash
netstat -ano | findstr :5000
```

If something else is using port 5000, change PORT in `.env` to 5001 and restart.
