# 🚀 ShareWheelz Render MCP Integration Guide

## 📋 **Official Render MCP Server Setup**

Based on the [Render MCP Server documentation](https://render.com/docs/mcp-server), here's how to properly integrate with Render's official MCP server:

---

## 🔧 **Option 1: Hosted MCP Server (Recommended)**

### **Setup:**
1. **Create API Key:**
   - Go to [Render Dashboard](https://render.com/dashboard)
   - Click Profile → Account Settings → API Keys
   - Generate new API key

2. **Configure Cursor:**
   Add to `~/.cursor/mcp.json`:
   ```json
   {
     "mcpServers": {
       "render": {
         "url": "https://mcp.render.com/mcp",
         "headers": {
           "Authorization": "Bearer rnd_cDC8pUcD1fxvbaOoFkW3FHd28FcK"
         }
       }
     }
   }
   ```

3. **Set Workspace:**
   In Cursor, prompt: `Set my Render workspace to [WORKSPACE_NAME]`

---

## 🎯 **Available MCP Actions**

The official Render MCP server supports these actions:

### **Workspaces**
- List all workspaces
- Set current workspace
- Fetch workspace details

### **Services**
- Create new web service or static site
- List all services
- Get service details
- Update environment variables

### **Deploys**
- List deploy history
- Get deploy details

### **Logs**
- List logs with filters
- List log label values

### **Metrics**
- CPU/memory usage
- Instance count
- Response times
- Bandwidth usage

### **Databases**
- Create Postgres database
- List databases
- Get database details
- Run SQL queries

### **Key Value Stores**
- List Key Value instances
- Get instance details
- Create new instance

---

## 🚀 **Example Prompts for ShareWheelz**

Once configured, you can use natural language prompts like:

### **Service Management:**
```
List my Render services
Show me details for tomobilti-platform service
What's the status of my ShareWheelz deployment?
```

### **Database Operations:**
```
Query my database for all cars with is_available = true
Show me the user count in my database
Check if the membership_tier column exists
```

### **Logs & Monitoring:**
```
Show me recent error logs for tomobilti-platform
What were the busiest traffic days this month?
Pull the most recent deployment logs
```

### **Troubleshooting:**
```
Why isn't my site at tomobilti-platform.onrender.com working?
Check the health status of my service
Show me deployment failures from the last week
```

---

## 🔧 **Option 2: Local MCP Server**

If you prefer to run locally:

### **Docker Setup:**
```json
{
  "mcpServers": {
    "render": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "RENDER_API_KEY",
        "-v",
        "render-mcp-server-config:/config",
        "ghcr.io/render-oss/render-mcp-server"
      ],
      "env": {
        "RENDER_API_KEY": "rnd_cDC8pUcD1fxvbaOoFkW3FHd28FcK"
      }
    }
  }
}
```

### **Local Executable:**
```bash
# Install
curl -fsSL https://raw.githubusercontent.com/render-oss/render-mcp-server/refs/heads/main/bin/install.sh | sh

# Configure
{
  "mcpServers": {
    "render": {
      "command": "/path/to/render-mcp-server-executable",
      "env": {
        "RENDER_API_KEY": "rnd_cDC8pUcD1fxvbaOoFkW3FHd28FcK"
      }
    }
  }
}
```

---

## 🎯 **Quick Start Commands**

### **Check Current Status:**
```
List my Render services
Show me details for tomobilti-platform
```

### **Monitor Deployment:**
```
Show me recent logs for tomobilti-platform
What's the current status of my deployment?
```

### **Database Operations:**
```
Query my database: SELECT COUNT(*) FROM cars WHERE is_available = true
Show me all users in my database
```

### **Troubleshooting:**
```
Why is my service not responding?
Show me error logs from the last deployment
Check the health of my database connection
```

---

## 📊 **Expected Results**

With the official MCP server, you can:

✅ **Manage Services:** Create, list, and monitor services
✅ **Query Databases:** Run SQL queries directly
✅ **Monitor Logs:** Access real-time logs and metrics
✅ **Troubleshoot Issues:** Get detailed error information
✅ **Track Deployments:** Monitor deployment history and status

---

## 🎉 **Next Steps**

1. **Configure MCP Server** using your API key
2. **Set your workspace** in Cursor
3. **Test with simple prompts** like "List my services"
4. **Use natural language** to manage your ShareWheelz deployment

**The official Render MCP server provides much more functionality than our custom script!** 🚀

---

## 🔗 **References**

- [Render MCP Server Documentation](https://render.com/docs/mcp-server)
- [Render MCP Server GitHub](https://github.com/render-oss/render-mcp-server)
- [Cursor MCP Documentation](https://cursor.sh/docs/mcp)
