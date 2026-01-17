# Professional Blogging Website

A full-featured blogging platform built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Features

### Public Features
- **Homepage** with latest blog posts
- **Category pages** for filtering posts by category
- **Individual post pages** with SEO optimization
- **Responsive design** for all devices
- **Modern UI** with Tailwind CSS

### Admin Features
- **Authentication** with NextAuth.js
- **Create, Edit, Delete** blog posts
- **Rich text editor** with React Quill
- **Image upload** for featured images
- **Category management**
- **Publish/Draft** status control
- **Admin dashboard** with post management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Rich Text Editor**: React Quill
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL="file:./dev.db"`
- `NEXTAUTH_URL="http://localhost:3000"`
- `NEXTAUTH_SECRET` (generate a random string)

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Create an admin user:

You'll need to create an admin user manually. You can do this by running a script or using Prisma Studio:

```bash
npx prisma studio
```

Or create a seed script to add a default admin user.

5. Create default categories:

You can create categories through the admin panel or via Prisma Studio. Common categories:
- Technology
- News
- Entertainment
- Sports
- Business

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Access the dashboard at `/admin`

## Project Structure

```
├── app/
│   ├── admin/          # Admin pages
│   ├── api/            # API routes
│   ├── category/       # Category pages
│   ├── post/           # Post pages
│   └── page.tsx        # Homepage
├── components/         # React components
├── lib/                # Utility functions
├── prisma/             # Database schema
└── public/             # Static files
```

## Database Schema

- **User**: Admin users
- **Category**: Blog categories
- **Post**: Blog posts with content, images, and metadata

## Features in Detail

### Post Management
- Create posts with rich text editor
- Upload featured images
- Set excerpt/description
- Choose category
- Publish or save as draft
- Edit existing posts
- Delete posts

### Image Upload
- Images are stored in `public/uploads/`
- Automatic unique filename generation
- File type and size validation

### Rich Text Editor
- Formatting options (bold, italic, headers)
- Lists (ordered and unordered)
- Links and images
- Text alignment

## Production Deployment

1. Update environment variables for production
2. Use a production database (PostgreSQL recommended)
3. Set secure `NEXTAUTH_SECRET`
4. Configure image storage (consider cloud storage for production)
5. Build and deploy:
```bash
npm run build
npm start
```

## License

MIT

