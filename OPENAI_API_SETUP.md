# 🔐 OpenAI API Key Configuration for ShareWheelz.uk

## ✅ **API Key Received**

Your OpenAI API key has been provided and is ready for configuration.

**Key Format**: `sk-proj-...` (your actual API key)

---

## 🚀 **How to Configure on Render.com**

### **Step 1: Access Render Dashboard**
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Find your ShareWheelz service
3. Click on the service name

### **Step 2: Add Environment Variable**
1. Click on the **"Environment"** tab
2. Scroll to **"Environment Variables"** section
3. Click **"Add Environment Variable"**

### **Step 3: Configure OpenAI Key**
- **Key**: `OPENAI_API_KEY`
- **Value**: `sk-proj-...` (your actual API key)
- **Description**: OpenAI API key for AI-powered chat responses

### **Step 4: Save and Deploy**
1. Click **"Save Changes"**
2. Render will automatically redeploy your service
3. Wait for deployment to complete (2-5 minutes)

---

## 🔍 **Verification Steps**

### **Check Deployment Logs**
After deployment, check the logs for:
```
OpenAI API Key found: Yes (length: 123)
✅ OpenAI service initialized successfully
```

### **Test AI Chat**
1. Visit https://sharewheelz.uk
2. Open the chat (blue button, bottom-right)
3. Send message: "What cars do you have in Manchester?"
4. Should receive AI-powered response mentioning Jaguar F-Type

---

## 💰 **Cost Management**

### **Expected Usage & Costs**
- **Typical Usage**: 100-500 requests/day
- **Cost per Request**: ~$0.001-0.002
- **Monthly Cost**: $3-15 (very affordable)

### **Cost Optimization Tips**
1. **Rate Limiting**: Already implemented in the code
2. **Response Length**: Limited to 150 tokens (cost-effective)
3. **Fallback System**: Uses pre-programmed responses when AI fails
4. **Caching**: Responses can be cached for repeated questions

---

## 🛡️ **Security Best Practices**

### **API Key Security**
- ✅ Never commit API keys to git
- ✅ Use environment variables only
- ✅ Rotate keys periodically
- ✅ Monitor usage for unusual activity

### **Rate Limiting**
The system already includes:
- Request rate limiting
- Token usage limits
- Fallback responses
- Error handling

---

## 🎯 **Expected AI Behavior**

With the API key configured, users will experience:

### **Enhanced Responses**
- **Dynamic**: Responses adapt to user questions
- **Contextual**: References actual car data
- **Natural**: More conversational language
- **Accurate**: Real-time information from database

### **Example Interactions**
```
User: "What's the cheapest car?"
AI: "Hi! I'm Alanna from ShareWheelz Support. Our most affordable option is the Range Rover Sport in Liverpool for £75/day - a luxury SUV with excellent value! The Jaguar F-Pace Sport in Birmingham is £85/day. Both offer great features at competitive prices. What's your budget range?"

User: "Show me luxury cars in London"
AI: "Hi! I'm Alanna from ShareWheelz Support. In London, we have amazing luxury cars! We have the classic Porsche 911 F (1973) for £120/day - perfect for enthusiasts who love automotive heritage. We also have the incredible Ferrari La Ferrari for £5500/day - a hybrid hypercar with 963 horsepower! Both are located in London. Which one interests you?"
```

---

## 🔧 **Troubleshooting**

### **If AI Responses Don't Work**

1. **Check Environment Variable**:
   - Verify `OPENAI_API_KEY` is set correctly
   - Check for typos or extra spaces

2. **Check Deployment Logs**:
   - Look for "OpenAI service initialized successfully"
   - Check for any API key errors

3. **Test API Key**:
   - Visit [platform.openai.com](https://platform.openai.com)
   - Check if key is active and has credits

4. **Fallback System**:
   - Even if AI fails, chat will still work
   - Users will get pre-programmed responses
   - System is designed to be resilient

### **Common Issues**

| Issue | Symptom | Solution |
|-------|---------|----------|
| Generic Responses | No AI responses | Check API key is set correctly |
| API Errors | Chat fails completely | Verify key has credits |
| Slow Responses | Delayed replies | Normal for AI processing |
| Rate Limits | Temporary failures | System will retry automatically |

---

## 📊 **Monitoring Usage**

### **OpenAI Dashboard**
- Visit [platform.openai.com/usage](https://platform.openai.com/usage)
- Monitor daily usage and costs
- Set up billing alerts if needed

### **Application Logs**
The system logs AI usage:
```
Generating ChatGPT response for: What cars do you have in Manchester?
✅ OpenAI service initialized successfully
```

---

## 🎉 **Success Indicators**

Your AI chat is working correctly when:

- [ ] Deployment logs show "OpenAI service initialized successfully"
- [ ] Chat responses are dynamic and contextual
- [ ] Responses mention specific cars and prices
- [ ] Responses adapt to different question types
- [ ] No API errors in browser console
- [ ] Response time is reasonable (1-3 seconds)

---

## 🚀 **Next Steps**

1. **Set the environment variable** on Render.com
2. **Wait for deployment** to complete
3. **Test the chat** on sharewheelz.uk
4. **Monitor usage** for the first few days
5. **Adjust settings** if needed based on usage patterns

---

## ✅ **Configuration Complete**

Once you've set the `OPENAI_API_KEY` environment variable on Render.com, your ShareWheelz chat support will be powered by AI, providing users with:

- 🤖 **Intelligent responses**
- 🚗 **Real-time car data**
- 💬 **Natural conversations**
- 🎯 **Accurate information**
- ⚡ **Fast responses**

**Your chat support will now be significantly more powerful and user-friendly!** 🎉
