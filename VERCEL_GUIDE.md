# 🚀 Vercel Deployment Guide

## Quick Deploy Commands

Just mention me in Discord with these commands:

### Deploy Current Project
```
@talking-epstein deploy
```
Creates a preview deployment of the current workspace.

### Deploy to Production
```
@talking-epstein deploy production
```
Deploys to your production URL.

### Deploy Specific Project
```
@talking-epstein deploy [project-path]
```
Deploy a specific folder or project.

### Check Deployment Status
```
@talking-epstein vercel status
```
Shows recent deployments and their status.

---

## 📋 Available Projects

You have 10 projects in your Vercel account:

1. **diaspora-scan** - https://diaspora-scan.vercel.app
2. **talking-werner** - https://www.wernerterminal.com
3. **black-history-month** - https://black-history-month-gamma.vercel.app
4. **talking-jeff** - https://talking-jeff.vercel.app
5. **pressure-washing-and-lawn-care** - https://pressure-washing-and-lawn-care.vercel.app
6. **engineering-nicaragua** - https://engineering-nicaragua.vercel.app
7. **car-booking-system** - https://car-booking-system-seven.vercel.app
8. **jack-and-dil-mvp-site** - https://jack-and-dil-mvp-site.vercel.app
9. **my-port** - https://www.jwebdesign.co.uk
10. **eastside-truck-transport** - https://eastside-truck-transport.vercel.app

---

## 🛠️ Manual Deployment

You can also use the PowerShell script directly:

```powershell
# Preview deployment
.\deploy.ps1

# Production deployment
.\deploy.ps1 -Environment production

# Deploy specific path
.\deploy.ps1 -ProjectPath "C:\path\to\project"
```

---

## 🔐 Security

- Your Vercel token is stored in `.env` (not committed to git)
- `.gitignore` is configured to protect credentials
- Token is passed securely to Vercel CLI

---

## 💡 Tips

- **Preview first**: Always test with preview deployments before going to production
- **Check builds**: Ask me for deployment status to monitor build progress
- **Environment variables**: Set them in Vercel dashboard for production secrets
- **Custom domains**: Manage domains through Vercel dashboard or ask me to help

---

## 🤖 What I Can Do

Just ask me in natural language:
- "Deploy this to Vercel"
- "Check my latest deployment"
- "Show me my Vercel projects"
- "Deploy to production"
- "Create a preview deployment"
- "What's the status of my last build?"

I'll handle the rest! 🚀
