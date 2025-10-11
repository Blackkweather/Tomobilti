# 🚀 ShareWheelz Chat Support Deployment Script (PowerShell)
# This script helps verify and deploy the chat support fixes

Write-Host "🚀 ShareWheelz Chat Support Deployment Script" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json - in correct directory" -ForegroundColor Green

# Check if critical files exist
Write-Host ""
Write-Host "🔍 Checking critical files..." -ForegroundColor Yellow

if (Test-Path "server/messaging.ts") {
    Write-Host "✅ server/messaging.ts exists" -ForegroundColor Green
} else {
    Write-Host "❌ server/messaging.ts missing" -ForegroundColor Red
    exit 1
}

if (Test-Path "server/services/notifications.ts") {
    Write-Host "✅ server/services/notifications.ts exists" -ForegroundColor Green
} else {
    Write-Host "❌ server/services/notifications.ts missing" -ForegroundColor Red
    exit 1
}

if (Test-Path "client/src/components/SupportChat.tsx") {
    Write-Host "✅ SupportChat component exists" -ForegroundColor Green
} else {
    Write-Host "❌ SupportChat component missing" -ForegroundColor Red
    exit 1
}

# Check for CORS fixes in messaging.ts
Write-Host ""
Write-Host "🔍 Verifying CORS fixes..." -ForegroundColor Yellow

if ((Get-Content "server/messaging.ts" -Raw) -match "https://sharewheelz.uk") {
    Write-Host "✅ CORS fix found in messaging.ts" -ForegroundColor Green
} else {
    Write-Host "❌ CORS fix missing in messaging.ts" -ForegroundColor Red
    Write-Host "   Please ensure the CORS configuration includes sharewheelz.uk" -ForegroundColor Red
    exit 1
}

if ((Get-Content "server/services/notifications.ts" -Raw) -match "https://sharewheelz.uk") {
    Write-Host "✅ CORS fix found in notifications.ts" -ForegroundColor Green
} else {
    Write-Host "❌ CORS fix missing in notifications.ts" -ForegroundColor Red
    Write-Host "   Please ensure the CORS configuration includes sharewheelz.uk" -ForegroundColor Red
    exit 1
}

# Check TypeScript compilation
Write-Host ""
Write-Host "🔍 Checking TypeScript compilation..." -ForegroundColor Yellow

try {
    Write-Host "Running TypeScript check..."
    $tscResult = & npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
    } else {
        Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
        Write-Host "   Please fix TypeScript errors before deploying" -ForegroundColor Red
        Write-Host $tscResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "⚠️  TypeScript not found, skipping compilation check" -ForegroundColor Yellow
}

# Check if build works
Write-Host ""
Write-Host "🔍 Testing build process..." -ForegroundColor Yellow

try {
    $buildResult = & npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        Write-Host "   Please fix build errors before deploying" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Build command failed" -ForegroundColor Red
    exit 1
}

# Environment variables checklist
Write-Host ""
Write-Host "📋 Environment Variables Checklist for Render.com:" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Required Variables:" -ForegroundColor White
Write-Host "  ✅ NODE_ENV=production" -ForegroundColor Green
Write-Host "  ✅ FRONTEND_URL=https://sharewheelz.uk" -ForegroundColor Green
Write-Host ""
Write-Host "Optional Variables:" -ForegroundColor White
Write-Host "  ⚠️  OPENAI_API_KEY=sk-... (for AI responses)" -ForegroundColor Yellow
Write-Host "  ⚠️  DATABASE_URL=postgresql://... (if not already set)" -ForegroundColor Yellow
Write-Host "  ⚠️  JWT_SECRET=your-secret-key (if not already set)" -ForegroundColor Yellow
Write-Host ""

# Test instructions
Write-Host "🧪 Testing Instructions:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After deployment, test the chat support:" -ForegroundColor White
Write-Host ""
Write-Host "1. Visit https://sharewheelz.uk" -ForegroundColor White
Write-Host "2. Look for blue chat button (bottom-right corner)" -ForegroundColor White
Write-Host "3. Click to open chat" -ForegroundColor White
Write-Host "4. Send test message: 'What cars do you have in Manchester?'" -ForegroundColor White
Write-Host "5. Should receive response mentioning Jaguar F-Type" -ForegroundColor White
Write-Host ""
Write-Host "Expected responses:" -ForegroundColor White
Write-Host "  - Location queries: Specific cars in each city" -ForegroundColor White
Write-Host "  - Price queries: Actual prices (£75-£5500)" -ForegroundColor White
Write-Host "  - Car type queries: Luxury, sports, SUV, electric" -ForegroundColor White
Write-Host "  - Booking queries: Step-by-step process" -ForegroundColor White
Write-Host ""

# Browser console check
Write-Host "🔍 Browser Console Check:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open DevTools (F12) and check for:" -ForegroundColor White
Write-Host "  ✅ No WebSocket connection errors" -ForegroundColor Green
Write-Host "  ✅ No CORS errors" -ForegroundColor Green
Write-Host "  ✅ No 404 errors for /api/chatgpt/chat" -ForegroundColor Green
Write-Host "  ✅ Successful API calls in Network tab" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "🎉 Deployment Ready!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""
Write-Host "Your chat support fixes are ready for deployment." -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Commit your changes: git add . && git commit -m 'Fix chat support CORS'" -ForegroundColor White
Write-Host "2. Push to repository: git push origin main" -ForegroundColor White
Write-Host "3. Set environment variables on Render.com (see RENDER_ENVIRONMENT_SETUP.md)" -ForegroundColor White
Write-Host "4. Wait for automatic deployment" -ForegroundColor White
Write-Host "5. Test chat support on https://sharewheelz.uk" -ForegroundColor White
Write-Host ""
Write-Host "If you encounter issues, check:" -ForegroundColor White
Write-Host "  - Render deployment logs" -ForegroundColor White
Write-Host "  - Browser console errors" -ForegroundColor White
Write-Host "  - Environment variables are set correctly" -ForegroundColor White
Write-Host ""
Write-Host "Chat support should now work perfectly! 🚀" -ForegroundColor Green
