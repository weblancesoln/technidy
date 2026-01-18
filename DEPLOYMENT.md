# Deploying Technidy to cPanel - Complete Guide

This guide will help you deploy your Next.js Technidy application to cPanel without errors.

> [!IMPORTANT]
> **Prerequisites:**
> - cPanel account with Node.js support (version 18.x or higher)
> - SSH access to your hosting account
> - Domain or subdomain configured in cPanel
> - At least 1GB of available disk space

---

## Step 1: Verify cPanel Node.js Support

1. Log into your cPanel dashboard
2. Look for "**Setup Node.js App**" under the Software section
3. If you don't see it, contact your hosting provider to enable Node.js support

> [!WARNING]
> Not all cPanel hosts support Node.js. If your host doesn't have this feature, you'll need to either:
> - Upgrade your hosting plan
> - Switch to a VPS/cloud hosting (Vercel, Railway, DigitalOcean)
> - Use a Node.js-friendly host

---

## Step 2: Prepare Your Application for Production

### 2.1 Update Environment Variables

Create a production `.env.production` file locally (don't commit this to Git):

```bash
# Database - Use PostgreSQL or MySQL instead of SQLite for production
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-here-generate-a-long-random-string"

# Upload directory (if needed)
UPLOAD_DIR="/home/username/public_html/uploads"
```

> [!TIP]
> Generate a secure `NEXTAUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

### 2.2 Update Database Configuration

**Important:** SQLite doesn't work well on shared hosting. Update your Prisma schema to use MySQL or PostgreSQL:

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"  // Change from "sqlite" to "mysql"
  url      = env("DATABASE_URL")
}
```

### 2.3 Install Production Dependencies

Make sure your `package.json` has all required scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p $PORT",
    "prisma:generate": "prisma generate",
    "prisma:deploy": "prisma db push"
  }
}
```

---

## Step 3: Upload Files to cPanel

### Option A: Using Git (Recommended)

1. **Enable SSH Access** in cPanel (Contact your host if not available)

2. **Connect via SSH:**
   ```bash
   ssh username@yourdomain.com
   ```

3. **Navigate to your domain directory:**
   ```bash
   cd ~/public_html
   # or for subdomain: cd ~/public_html/subdomain
   ```

4. **Clone your repository:**
   ```bash
   git clone https://github.com/weblancesoln/technidy.git .
   ```

5. **Install dependencies:**
   ```bash
   npm install --production
   ```

### Option B: Using File Manager

1. Go to **File Manager** in cPanel
2. Navigate to `public_html` (or your domain folder)
3. Click **Upload** and upload your entire project as a `.zip` file
4. Extract the zip file
5. Delete the zip file after extraction

---

## Step 4: Setup Node.js Application in cPanel

1. **Open "Setup Node.js App"** in cPanel

2. **Click "Create Application"**

3. **Configure the application:**
   - **Node.js version:** Select `18.x` or higher
   - **Application mode:** `Production`
   - **Application root:** `public_html` (or `public_html/technidy` if in subfolder)
   - **Application URL:** Your domain (e.g., `technidy.com`)
   - **Application startup file:** `server.js` (we'll create this next)
   - **Port:** Leave empty or use auto-assigned port

4. **Click "Create"**

---

## Step 5: Create Server Startup File

You need to create a `server.js` file in your application root:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

Upload this file to your application root via File Manager or SSH.

---

## Step 6: Configure Environment Variables in cPanel

1. In the **Setup Node.js App** section, find your application
2. Click **Edit** or **Open** the application
3. Scroll to **Environment Variables**
4. Add each variable from your `.env.production` file:
   - Key: `DATABASE_URL`
   - Value: `mysql://user:pass@localhost:3306/dbname`
   - Click **Add**
   
   Repeat for:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NODE_ENV` = `production`

5. **Save** changes

---

## Step 7: Setup Database

### 7.1 Create MySQL Database in cPanel

1. Go to **MySQL Databases** in cPanel
2. Create a new database: `username_technidy`
3. Create a database user with a strong password
4. Add the user to the database with **ALL PRIVILEGES**
5. Note down the database name, username, and password

### 7.2 Update DATABASE_URL

Update the `DATABASE_URL` environment variable in your Node.js app settings with the correct credentials.

### 7.3 Run Prisma Migrations

Via SSH:
```bash
cd ~/public_html
source /home/username/nodevenv/public_html/18/bin/activate
npx prisma generate
npx prisma db push
```

---

## Step 8: Build the Application

1. **Via cPanel Node.js App interface:**
   - Click on your application
   - Click **Run NPM Install**
   - Wait for completion

2. **Via SSH (Recommended):**
   ```bash
   cd ~/public_html
   source /home/username/nodevenv/public_html/18/bin/activate
   npm install
   npx prisma generate
   npm run build
   ```

> [!CAUTION]
> The build process may take 5-10 minutes and use significant resources. If it fails with memory errors, contact your host about increasing memory limits.

---

## Step 9: Configure .htaccess for Reverse Proxy

Create/edit `.htaccess` in your `public_html` folder:

```apache
# BEGIN Node.js Proxy
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:YOUR_PORT/$1 [P,L]
# END Node.js Proxy
```

Replace `YOUR_PORT` with the port number assigned by cPanel (shown in the Node.js App interface).

---

## Step 10: Start the Application

1. In **Setup Node.js App**, find your application
2. Click **Start App** or **Restart App**
3. Wait for the status to show **Running**

---

## Step 11: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check if the homepage loads correctly
3. Test login at `/admin/login`
4. Verify database connectivity

---

## Step 12: Setup Uploads Directory

1. Create an `uploads` folder in `public_html`:
   ```bash
   mkdir -p ~/public_html/uploads
   chmod 755 ~/public_html/uploads
   ```

2. Update your upload paths in the code if needed

---

## Troubleshooting Common Issues

### Issue 1: "Application failed to start"

**Solutions:**
- Check error logs in cPanel Node.js App interface
- Verify `server.js` exists and is correct
- Ensure all environment variables are set
- Check Node.js version compatibility

### Issue 2: "502 Bad Gateway"

**Solutions:**
- Application might not be running - restart it
- Check `.htaccess` has correct port number
- Verify the port isn't blocked by firewall

### Issue 3: "Database connection failed"

**Solutions:**
- Verify `DATABASE_URL` is correct
- Check database user has proper permissions
- Ensure Prisma schema matches database type
- Run `npx prisma generate` and `npx prisma db push`

### Issue 4: "Module not found" errors

**Solutions:**
```bash
cd ~/public_html
source /home/username/nodevenv/public_html/18/bin/activate
npm install
npm run build
```

### Issue 5: Build fails with memory error

**Solutions:**
- Contact hosting provider to increase memory limit
- Build locally and upload the `.next` folder
- Consider upgrading to VPS hosting

### Issue 6: Images/Uploads not working

**Solutions:**
- Check folder permissions (755 for directories, 644 for files)
- Verify upload path in environment variables
- Ensure uploads folder is accessible via web

---

## Alternative: Build Locally, Deploy Built Files

If building on cPanel fails due to resource limits:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload these folders/files to cPanel:**
   - `.next/` folder
   - `public/` folder
   - `node_modules/` folder (or run `npm install --production` on server)
   - `package.json`
   - `server.js`
   - `prisma/` folder

3. **Run only production start:**
   ```bash
   npm start
   ```

---

## Post-Deployment Checklist

- [ ] Application is running and accessible
- [ ] Database is connected and migrations applied
- [ ] Admin login works
- [ ] Image uploads work
- [ ] All pages load correctly
- [ ] SSL certificate is active (HTTPS)
- [ ] Environment variables are set correctly
- [ ] Performance is acceptable
- [ ] Error monitoring is setup

---

## Important Notes

> [!WARNING]
> **cPanel Limitations:**
> - Not ideal for Next.js applications
> - Resource limits may cause issues
> - May require frequent restarts
> - Limited scalability

> [!TIP]
> **Better Hosting Options:**
> - **Vercel** - Built for Next.js (recommended)
> - **Railway** - Easy deployment
> - **DigitalOcean App Platform**
> - **AWS Amplify**
> - **Netlify**

These platforms offer better performance, automatic deployments, and are specifically designed for Next.js applications.

---

## Maintenance

### Updating Your Application

1. **Pull latest changes:**
   ```bash
   cd ~/public_html
   git pull origin main
   ```

2. **Install dependencies:**
   ```bash
   source /home/username/nodevenv/public_html/18/bin/activate
   npm install
   ```

3. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Rebuild:**
   ```bash
   npm run build
   ```

5. **Restart app** in cPanel Node.js App interface

### Monitoring

- Regularly check application logs in cPanel
- Monitor disk space usage
- Check for security updates
- Backup database regularly

---

## Need Help?

If you encounter issues:
1. Check cPanel error logs
2. Review application logs
3. Contact your hosting provider's support
4. Consider professional deployment services

Good luck with your deployment! 🚀
