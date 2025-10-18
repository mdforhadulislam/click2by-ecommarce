# Bazaarfly - Complete Role-Based Access Control

## 🎯 User Roles & Access Control

The Bazaarfly e-commerce platform supports **three user roles** with distinct permissions and access levels:

1. **Customer** (Regular User)
2. **Affiliate** (Referral Partner)
3. **Admin** (Administrator)

---

## 👤 CUSTOMER ACCESS (Regular Users)

When a **customer logs in**, they have access to:

### 📊 Dashboard (`/dashboard`)
- Welcome message with personalized greeting
- Quick stats overview:
  - Total orders count
  - Cart items count
  - Total money spent
  - Profile quick access
- Recent orders display (latest 5)
- Quick action buttons to browse products, track orders, and manage profile

### 📦 Orders (`/orders`)
- View all personal orders
- Order details including:
  - Order ID and date
  - Order status (pending, processing, shipped, delivered)
  - Total amount
  - Order items with images
- Order tracking information
- **API**: `ApiService.orders.getMy(token)`

### 🛒 Cart (`/cart`)
- View all cart items
- Update item quantities
- Remove items from cart
- See real-time total price
- Proceed to checkout
- Cart persists in localStorage

### 💳 Payments (`/payments`)
- View complete payment history
- Payment details:
  - Transaction ID
  - Payment method (Cash on Delivery, Card, Mobile Banking)
  - Payment status (pending, completed, failed)
  - Amount and date
- **API**: `ApiService.payments.getMy(token)`

### 👤 Profile (`/profile`)
- View and edit personal information:
  - Full name
  - Email address
  - Phone number
  - Shipping address
- Upload profile picture
- Update password
- **API**: `ApiService.auth.updateProfile(data, token)`

---

## 💼 AFFILIATE ACCESS (Referral Partners)

When an **affiliate logs in**, they have access to everything a Customer has, **PLUS**:

### 🎯 Affiliate Dashboard (`/affiliate/dashboard`)
- Comprehensive earnings overview:
  - Total commissions earned
  - Pending commissions
  - Wallet balance
  - Total conversions
- Performance metrics
- Quick action links
- **API**: `ApiService.affiliate.getWallet(token)` & `ApiService.affiliate.getCommissions(token)`

### 🔗 Generate Links (`/affiliate/links`)
- Create unique affiliate links for products
- Copy and share affiliate URLs
- Track link performance:
  - Clicks count
  - Conversions count
  - Conversion rate
- Manage existing affiliate links
- **API**: `ApiService.affiliate.createLink(data, token)` & `ApiService.affiliate.getLinks(token)`

### 📈 Track Orders (`/affiliate/commissions`)
- View all orders generated from affiliate links
- Commission details per order:
  - Order ID and customer info
  - Product details
  - Commission amount
  - Commission status (pending, approved, paid)
- Filter by date range
- Total earnings summary
- **API**: `ApiService.affiliate.getCommissions(token)`

### 💰 Wallet (`/affiliate/wallet`)
- Available balance display
- Total earnings history
- Pending balance
- Monthly earnings
- Total withdrawn amount
- Transaction history
- Withdrawal request functionality
- **API**: `ApiService.affiliate.getWallet(token)`

### 💵 Commissions (`/affiliate/commissions`)
- Detailed commission breakdown
- Commission rate per product
- Payment status tracking
- Commission approval workflow
- Export commission reports
- **API**: `ApiService.affiliate.getCommissions(token)`

---

## 👨‍💼 ADMIN ACCESS (Administrators)

When an **admin logs in**, they have access to everything (Customer + Affiliate features), **PLUS**:

### 📊 Admin Dashboard (`/admin`)
- Complete business overview:
  - Total products count
  - Total orders count
  - Total revenue
  - Pending orders count
- Recent activity feed
- Quick access to all admin functions
- **API**: `ApiService.adminPanel.getStats(token)`

### 📦 Products Management (`/admin/products`)
- **View all products** with search and filters
- **Create new products**:
  - Name, description, SKU
  - Base price and discount price
  - Categories, tags
  - Product images
  - Stock management
- **Edit existing products**
- **Delete products**
- **Manage product variations**:
  - Colors
  - Sizes
  - Quantities
  - Qualities
- **API**: 
  - `ApiService.products.admin.getAll(token)`
  - `ApiService.products.admin.create(data, token)`
  - `ApiService.products.admin.update(id, data, token)`
  - `ApiService.products.admin.delete(id, token)`

### 🏷️ Categories Management (`/admin/categories`)
- **View all categories** (with subcategories)
- **Create new categories**
- **Edit category details**
- **Delete categories**
- Category hierarchy management
- **API**:
  - `ApiService.categories.admin.getAll(token)`
  - `ApiService.categories.admin.create(data, token)`
  - `ApiService.categories.admin.update(id, data, token)`
  - `ApiService.categories.admin.delete(id, token)`

### 🏷️ Tags Management (`/admin/tags`)
- **View all product tags**
- **Create new tags**
- **Edit tags**
- **Delete tags**
- Tag color customization
- **API**:
  - `ApiService.variations.tags.getAll(token)`
  - `ApiService.variations.tags.create(data, token)`
  - `ApiService.variations.tags.update(id, data, token)`
  - `ApiService.variations.tags.delete(id, token)`

### 📋 Orders Management (`/admin/orders`)
- **View all customer orders**
- **Update order status**:
  - Pending → Processing → Shipped → Delivered
  - Cancel orders
- **View order details**:
  - Customer information
  - Ordered items
  - Payment status
  - Shipping address
- **Process refunds**
- **Print invoices**
- **API**:
  - `ApiService.orders.admin.getAll(token)`
  - `ApiService.orders.admin.update(id, data, token)`
  - `ApiService.orders.admin.getDetail(id, token)`

### 💳 Payments Management (`/admin/payments`)
- View all payment transactions
- Verify payments
- Update payment status
- Process refunds
- Payment analytics
- **API**:
  - `ApiService.payments.admin.getAll(token)`
  - `ApiService.payments.admin.update(id, data, token)`

### 👥 Users Management (`/admin/users`)
- **View all registered users**
- **Search users** by name or email
- **User details**:
  - Name, email, phone
  - Role (Customer, Affiliate, Admin)
  - Account status (Active/Inactive)
  - Registration date
- **Manage user roles**:
  - Promote to Affiliate
  - Promote to Admin
  - Demote users
- **Deactivate/Activate accounts**
- **Delete users**

### 🔔 Notifications Management (`/admin/notifications`)
- **View all notifications**
- **Send notifications to specific users**
- **Broadcast notifications to all users**
- Notification types:
  - Order updates
  - Promotional messages
  - System alerts
- **API**:
  - `ApiService.notifications.admin.create(data, token)`
  - `ApiService.notifications.admin.broadcast(data, token)`

### 📈 Reports & Analytics (`/admin/reports`)
- **Sales Reports**:
  - Total revenue
  - Revenue by period (daily, weekly, monthly)
  - Order trends
  - Average order value
  - Growth rate
- **Product Performance**:
  - Best-selling products
  - Low stock alerts
  - Product views and conversions
- **Customer Analytics**:
  - New customers
  - Customer lifetime value
  - Demographics
  - Buying patterns
- **Export reports** (CSV, PDF)
- **API**:
  - `ApiService.adminPanel.reports.sales(token)`
  - `ApiService.adminPanel.reports.productPerformance(token)`
  - `ApiService.adminPanel.reports.customerAnalytics(token)`

### 🎧 Support Tickets (`/admin/support`)
- **View all support tickets**
- **Ticket details**:
  - Customer name
  - Subject and message
  - Status (Open, Pending, Resolved, Closed)
  - Priority level
- **Reply to tickets**
- **Mark tickets as resolved**
- **Close tickets**
- **API**:
  - `ApiService.adminPanel.supportTickets.getAll(token)`
  - `ApiService.adminPanel.supportTickets.getById(id, token)`
  - `ApiService.adminPanel.supportTickets.createReply(ticketId, data, token)`
  - `ApiService.adminPanel.supportTickets.update(id, data, token)`

### 🎨 Content Management
- **Banners Management**:
  - Create promotional banners
  - Upload banner images
  - Set banner links and visibility
  - Schedule banner display
  - **API**: `ApiService.adminPanel.banners.*`

- **Promotions Management**:
  - Create discount codes
  - Set promotion rules
  - Schedule promotions
  - Track promotion usage
  - **API**: `ApiService.adminPanel.promotions.*`

### 💼 Affiliate Management (Admin View)
- **View all affiliates**
- **Approve affiliate registrations**
- **Set commission rates**
- **Generate links** for affiliates
- **Track orders** from affiliate links
- **Manage affiliate wallets**
- **Process commission payments**
- **API**:
  - `ApiService.affiliate.getLinks(token)`
  - `ApiService.affiliate.getCommissions(token)`
  - `ApiService.affiliate.getWallet(token)`

---

## 🔐 Role-Based Access Implementation

### Authentication Check
```typescript
const { user, token, isAuthenticated, isAdmin, isAffiliate } = useAuth();
```

### Protected Routes
All role-specific pages are wrapped with `ProtectedRoute` component:

```typescript
// Customer only
<ProtectedRoute>
  {children}
</ProtectedRoute>

// Affiliate only
<ProtectedRoute requireAffiliate={true}>
  {children}
</ProtectedRoute>

// Admin only
<ProtectedRoute requireAdmin={true}>
  {children}
</ProtectedRoute>
```

### Role Detection
User roles are determined from the backend API response and stored in AuthContext:

- `user.role === 'customer'` → Regular Customer
- `user.role === 'affiliate'` → Affiliate Partner
- `user.role === 'admin'` → Administrator

---

## 🗺️ Complete Route Map

### Public Routes (No Login Required)
- `/` - Homepage
- `/products` - Product listing
- `/products/[slug]` - Product details
- `/about` - About page
- `/contact` - Contact page

### Customer Routes (Login Required)
- `/dashboard` - User dashboard
- `/orders` - View orders
- `/cart` - Shopping cart
- `/payments` - Payment history
- `/profile` - User profile

### Affiliate Routes (Affiliate Login Required)
- `/affiliate` - Affiliate page
- `/affiliate/dashboard` - Affiliate dashboard
- `/affiliate/links` - Generate & manage links
- `/affiliate/commissions` - View commissions
- `/affiliate/wallet` - Manage wallet

### Admin Routes (Admin Login Required)
- `/admin` - Admin dashboard
- `/admin/products` - Products management
- `/admin/categories` - Categories management
- `/admin/tags` - Tags management
- `/admin/orders` - Orders management
- `/admin/payments` - Payments management
- `/admin/users` - Users management
- `/admin/notifications` - Notifications
- `/admin/reports` - Reports & analytics
- `/admin/support` - Support tickets

---

## 🔄 User Workflow Examples

### Customer Journey
1. Register/Login → `/dashboard`
2. Browse products → `/products`
3. Add to cart → `/cart`
4. Checkout → Order placed
5. Track order → `/orders`
6. View payment → `/payments`

### Affiliate Journey
1. Register as affiliate → `/affiliate/register`
2. Login → `/affiliate/dashboard`
3. Generate affiliate link → `/affiliate/links`
4. Share link with customers
5. Track conversions → `/affiliate/commissions`
6. Check earnings → `/affiliate/wallet`
7. Request withdrawal

### Admin Journey
1. Login as admin → `/admin`
2. Add products → `/admin/products`
3. Manage categories → `/admin/categories`
4. Process orders → `/admin/orders`
5. View reports → `/admin/reports`
6. Handle support → `/admin/support`
7. Send notifications → `/admin/notifications`

---

## 📱 API Endpoints Used

All role-based features use the comprehensive API service layer located at `/app/lib/api.ts`.

### Customer APIs
- Orders: `ApiService.orders.getMy(token)`
- Payments: `ApiService.payments.getMy(token)`
- Profile: `ApiService.auth.getProfile(token)`

### Affiliate APIs
- Dashboard: `ApiService.affiliate.getWallet(token)` + `ApiService.affiliate.getCommissions(token)`
- Links: `ApiService.affiliate.getLinks(token)` + `ApiService.affiliate.createLink(data, token)`
- Commissions: `ApiService.affiliate.getCommissions(token)`
- Wallet: `ApiService.affiliate.getWallet(token)`

### Admin APIs
- Products: `ApiService.products.admin.*`
- Categories: `ApiService.categories.admin.*`
- Tags: `ApiService.variations.tags.*`
- Orders: `ApiService.orders.admin.*`
- Payments: `ApiService.payments.admin.*`
- Notifications: `ApiService.notifications.admin.*`
- Reports: `ApiService.adminPanel.reports.*`
- Support: `ApiService.adminPanel.supportTickets.*`

---

## ✅ Security Features

1. **JWT Token Authentication** - All API calls require valid token
2. **Role-Based Access Control (RBAC)** - Routes protected based on user role
3. **Server-Side Validation** - Backend validates user permissions
4. **Automatic Token Refresh** - Tokens refreshed every 14 minutes
5. **Session Management** - Tokens stored securely in localStorage
6. **Protected Routes** - Client-side route guards with ProtectedRoute component

---

## 🚀 Getting Started

### For Customers:
1. Visit homepage
2. Click "Sign Up"
3. Complete registration
4. Login and start shopping

### For Affiliates:
1. Register as customer first
2. Navigate to `/affiliate`
3. Click "Become an Affiliate"
4. Complete affiliate registration
5. Access affiliate dashboard

### For Admins:
1. Admin accounts created by super admin
2. Login with admin credentials
3. Access admin dashboard at `/admin`

---

**Last Updated**: January 2025
**Version**: 2.0.0
