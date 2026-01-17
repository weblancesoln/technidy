# Setup Instructions

Follow these steps to get your blogging website up and running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here-change-this"
```

**Important**: Generate a random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

## 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

## 4. Seed Database (Create Admin User and Categories)

```bash
npm run seed
```

This will create:
- Admin user: `admin@blog.com` / `admin123`
- Default categories: Technology, News, Entertainment, Sports, Business

**⚠️ Security Note**: Change the default admin password immediately after first login!

## 5. Create Uploads Directory

The uploads directory will be created automatically when you upload your first image, but you can create it manually:

```bash
mkdir -p public/uploads
```

## 6. Start Development Server

```bash
npm run dev
```

## 7. Access the Website

- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Email: `admin@blog.com`
  - Password: `admin123`

## Next Steps

1. **Change Admin Password**: Log in and update your password (you'll need to do this manually via Prisma Studio or create a password change feature)
2. **Create Your First Post**: Go to Admin Dashboard → Create New Post
3. **Customize**: Update the site name, colors, and branding in the components

## Troubleshooting

### Database Issues
If you encounter database errors:
```bash
rm prisma/dev.db
npx prisma db push
npm run seed
```

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port.

### Image Upload Issues
Make sure the `public/uploads` directory exists and has write permissions.

## Production Deployment

For production:
1. Use PostgreSQL instead of SQLite
2. Update `DATABASE_URL` to your PostgreSQL connection string
3. Set secure `NEXTAUTH_SECRET`
4. Consider using cloud storage (AWS S3, Cloudinary) for images
5. Run `npm run build` and deploy

