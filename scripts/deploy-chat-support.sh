#!/bin/bash

# 🚀 ShareWheelz Chat Support Deployment Script
# This script helps verify and deploy the chat support fixes

echo "🚀 ShareWheelz Chat Support Deployment Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Found package.json - in correct directory"

# Check if critical files exist
echo ""
echo "🔍 Checking critical files..."

if [ -f "server/messaging.ts" ]; then
    echo "✅ server/messaging.ts exists"
else
    echo "❌ server/messaging.ts missing"
    exit 1
fi

if [ -f "server/services/notifications.ts" ]; then
    echo "✅ server/services/notifications.ts exists"
else
    echo "❌ server/services/notifications.ts missing"
    exit 1
fi

if [ -f "client/src/components/SupportChat.tsx" ]; then
    echo "✅ SupportChat component exists"
else
    echo "❌ SupportChat component missing"
    exit 1
fi

# Check for CORS fixes in messaging.ts
echo ""
echo "🔍 Verifying CORS fixes..."

if grep -q "https://sharewheelz.uk" server/messaging.ts; then
    echo "✅ CORS fix found in messaging.ts"
else
    echo "❌ CORS fix missing in messaging.ts"
    echo "   Please ensure the CORS configuration includes sharewheelz.uk"
    exit 1
fi

if grep -q "https://sharewheelz.uk" server/services/notifications.ts; then
    echo "✅ CORS fix found in notifications.ts"
else
    echo "❌ CORS fix missing in notifications.ts"
    echo "   Please ensure the CORS configuration includes sharewheelz.uk"
    exit 1
fi

# Check TypeScript compilation
echo ""
echo "🔍 Checking TypeScript compilation..."

if command -v tsc &> /dev/null; then
    echo "Running TypeScript check..."
    if npx tsc --noEmit; then
        echo "✅ TypeScript compilation successful"
    else
        echo "❌ TypeScript compilation failed"
        echo "   Please fix TypeScript errors before deploying"
        exit 1
    fi
else
    echo "⚠️  TypeScript not found, skipping compilation check"
fi

# Check if build works
echo ""
echo "🔍 Testing build process..."

if npm run build 2>/dev/null; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    echo "   Please fix build errors before deploying"
    exit 1
fi

# Environment variables checklist
echo ""
echo "📋 Environment Variables Checklist for Render.com:"
echo "=================================================="
echo ""
echo "Required Variables:"
echo "  ✅ NODE_ENV=production"
echo "  ✅ FRONTEND_URL=https://sharewheelz.uk"
echo ""
echo "Optional Variables:"
echo "  ⚠️  OPENAI_API_KEY=sk-... (for AI responses)"
echo "  ⚠️  DATABASE_URL=postgresql://... (if not already set)"
echo "  ⚠️  JWT_SECRET=your-secret-key (if not already set)"
echo ""

# Test instructions
echo "🧪 Testing Instructions:"
echo "========================"
echo ""
echo "After deployment, test the chat support:"
echo ""
echo "1. Visit https://sharewheelz.uk"
echo "2. Look for blue chat button (bottom-right corner)"
echo "3. Click to open chat"
echo "4. Send test message: 'What cars do you have in Manchester?'"
echo "5. Should receive response mentioning Jaguar F-Type"
echo ""
echo "Expected responses:"
echo "  - Location queries: Specific cars in each city"
echo "  - Price queries: Actual prices (£75-£5500)"
echo "  - Car type queries: Luxury, sports, SUV, electric"
echo "  - Booking queries: Step-by-step process"
echo ""

# Browser console check
echo "🔍 Browser Console Check:"
echo "========================="
echo ""
echo "Open DevTools (F12) and check for:"
echo "  ✅ No WebSocket connection errors"
echo "  ✅ No CORS errors"
echo "  ✅ No 404 errors for /api/chatgpt/chat"
echo "  ✅ Successful API calls in Network tab"
echo ""

# Success message
echo "🎉 Deployment Ready!"
echo "===================="
echo ""
echo "Your chat support fixes are ready for deployment."
echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Fix chat support CORS'"
echo "2. Push to repository: git push origin main"
echo "3. Set environment variables on Render.com (see RENDER_ENVIRONMENT_SETUP.md)"
echo "4. Wait for automatic deployment"
echo "5. Test chat support on https://sharewheelz.uk"
echo ""
echo "If you encounter issues, check:"
echo "  - Render deployment logs"
echo "  - Browser console errors"
echo "  - Environment variables are set correctly"
echo ""
echo "Chat support should now work perfectly! 🚀"
