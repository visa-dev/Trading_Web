# Trading Performance Showcase Platform

A comprehensive Next.js 14 application for showcasing trading performance with detailed metrics, reviews, and user interactions.

## 🚀 Features

### Public Features (No Login Required)
- Browse trading performance posts with metrics
- View profit/loss charts and statistics
- Watch embedded trading performance videos
- See all reviews and ratings (read-only)

### Protected Features (Login Required)
- ⭐ **Review System:** Rate & comment on posts/videos (1-5 stars)
- 💬 **Chat System:** Message trader directly
- 👤 **User Profile:** Manage account and review history

### Trader Admin Features
- Create/edit performance posts with metrics
- Upload trade screenshots and charts
- Embed YouTube trading videos
- Manage user reviews and responses
- Chat inbox with all users

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 19, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS
- **Authentication:** NextAuth.js with Google OAuth
- **Database:** MySQL with Prisma ORM
- **File Storage:** Vercel Blob
- **Deployment:** Vercel

## 📊 Database Schema

```sql
users (id, email, username, role['USER','TRADER'], createdAt)
performance_posts (id, title, description, profit_loss, win_rate, drawdown, risk_reward, image_url, video_url, published, createdAt)
trading_videos (id, title, youtube_url, description, performance_metrics, createdAt)
reviews (id, userId, postId, videoId, rating, comment, type['POST','VIDEO'], status, createdAt)
conversations (id, userId, traderId, lastMessage, unreadCount, updatedAt)
messages (id, conversationId, senderId, content, read, createdAt)
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- MySQL database
- Google OAuth credentials (optional)

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <repository-url>
cd trading-performance
npm install
\`\`\`

### 2. Environment Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/trading_performance"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Vercel Blob (Optional)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
\`\`\`

### 3. Database Setup

\`\`\`bash
# Push the database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
\`\`\`

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 👥 Demo Credentials

### Trader Account
- **Email:** trader@performance.com
- **Password:** Trader123!
- **Access:** Full admin dashboard, post management, review moderation

### Test User Account
- **Email:** user@test.com
- **Password:** User123!
- **Access:** Review posts/videos, chat with trader

### Google OAuth
- Both accounts support Google OAuth login (if configured)

## 🎨 UI/UX Features

- **Primary Color:** #f59e0b (Amber)
- **Responsive Design:** Mobile-first approach
- **Modern Components:** shadcn/ui component library
- **Smooth Animations:** Tailwind CSS transitions
- **Accessibility:** WCAG compliant components

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage with featured posts
- `/posts` - All performance posts
- `/posts/[id]` - Individual post details
- `/videos` - Trading performance videos
- `/videos/[id]` - Video player and details

### Protected Routes
- `/auth/signin` - Authentication page
- `/chat` - User-trader messaging
- `/dashboard` - Trader admin panel (TRADER only)
- `/reviews` - User review management

## 🔐 Authentication & Authorization

- **NextAuth.js** for authentication
- **Google OAuth** integration
- **Role-based access control** (USER/TRADER)
- **Protected routes** with middleware
- **Session management** with JWT

## 💬 Chat System

- Real-time messaging between users and trader
- Conversation management
- Unread message tracking
- Message history and timestamps

## ⭐ Review System

- 1-5 star rating system
- Comment functionality
- Review moderation (trader approval)
- Separate reviews for posts and videos

## 📊 Performance Metrics

- Profit/Loss tracking
- Win rate calculations
- Drawdown analysis
- Risk/reward ratios
- Visual charts and graphs

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

\`\`\`env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js 14 and modern web technologies**