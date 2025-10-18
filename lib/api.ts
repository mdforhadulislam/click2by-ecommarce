// Complete API Configuration and Service Layer for Bazaarfly
// Backend: https://devforhad.pythonanywhere.com

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://devforhad.pythonanywhere.com';

interface ApiOptions extends RequestInit {
  token?: string;
}

export class ApiService {
  private static getHeaders(token?: string, isFormData?: boolean): HeadersInit {
    const headers: HeadersInit = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || error.detail || `Request failed with status ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as any;
  }

  static async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const isFormData = fetchOptions.body instanceof FormData;
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...fetchOptions,
      headers: this.getHeaders(token, isFormData),
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }

  // ==================== 1. ACCOUNTS/AUTH APIs ====================
  static auth = {
    // Register a new user
    register: (data: any) => 
      ApiService.request('/api/v1/auth/register/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // Login
    login: (data: any) => 
      ApiService.request('/api/v1/auth/login/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // Logout
    logout: (token: string) => 
      ApiService.request('/api/v1/auth/logout/', {
        method: 'POST',
        token,
      }),
    
    // Forgot Password
    forgotPassword: (data: { email: string }) => 
      ApiService.request('/api/v1/auth/forgot-password/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // Reset Password
    resetPassword: (data: { email: string; otp: string; new_password: string }) => 
      ApiService.request('/api/v1/auth/reset-password/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // Get Profile
    getProfile: (token: string) => 
      ApiService.request('/api/v1/auth/profile/', {
        method: 'GET',
        token,
      }),
    
    // Update Profile
    updateProfile: (data: any, token: string) => 
      ApiService.request('/api/v1/auth/profile/update/', {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    
    // Verify Email
    verifyEmail: (data: { email: string; otp: string }) => 
      ApiService.request('/api/v1/auth/verify-email/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // Upload Photo (Profile Picture or NID)
    uploadPhoto: (formData: FormData, token: string) => 
      ApiService.request('/api/v1/auth/upload-photo/', {
        method: 'POST',
        body: formData,
        token,
      }),
  };

  // ==================== 2. PRODUCTS APIs ====================
  
  // Public Product APIs
  static products = {
    // Get all active products (with search and filter)
    getAll: (params?: string) => 
      ApiService.request(`/api/v1/products/${params || ''}`),
    
    // Get product details by slug
    getBySlug: (slug: string) => 
      ApiService.request(`/api/v1/products/${slug}/`),
    
    // Admin Product APIs
    admin: {
      // List all products
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/products/', { token }),
      
      // Create a new product
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/products/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      // Get product by ID
      getById: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/products/${id}/`, { token }),
      
      // Update product
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/products/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      // Delete product
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/products/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // ==================== 3. CATEGORIES APIs ====================
  static categories = {
    // Get all categories
    getAll: () => 
      ApiService.request('/api/v1/categories/'),
    
    // Get products by category slug
    getProducts: (slug: string) => 
      ApiService.request(`/api/v1/categories/${slug}/products/`),
    
    // Admin Category APIs
    admin: {
      // List all categories
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/categories/', { token }),
      
      // Create category
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/categories/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      // Get category by ID
      getById: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/categories/${id}/`, { token }),
      
      // Update category
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/categories/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      // Delete category
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/categories/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // ==================== 4. PRODUCT VARIATIONS APIs ====================
  static variations = {
    // Color Variations
    colors: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/variations/colors/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/variations/colors/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/variations/colors/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/variations/colors/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
    
    // Size Variations
    sizes: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/variations/sizes/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/variations/sizes/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/variations/sizes/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/variations/sizes/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
    
    // Quantity Variations
    quantities: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/variations/quantities/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/variations/quantities/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/variations/quantities/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/variations/quantities/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
    
    // Quality Variations
    qualities: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/variations/qualities/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/variations/qualities/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/variations/qualities/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/variations/qualities/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
    
    // Tag Variations
    tags: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/variations/tags/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/variations/tags/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/variations/tags/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/variations/tags/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // ==================== 5. PRODUCT IMAGES APIs ====================
  static productImages = {
    getAll: (token: string) => 
      ApiService.request('/api/v1/admin/images/', { token }),
    
    create: (formData: FormData, token: string) => 
      ApiService.request('/api/v1/admin/images/', {
        method: 'POST',
        body: formData,
        token,
      }),
    
    update: (id: string, formData: FormData, token: string) => 
      ApiService.request(`/api/v1/admin/images/${id}/`, {
        method: 'PUT',
        body: formData,
        token,
      }),
    
    delete: (id: string, token: string) => 
      ApiService.request(`/api/v1/admin/images/${id}/`, {
        method: 'DELETE',
        token,
      }),
  };

  // ==================== 6. ORDERS APIs ====================
  static orders = {
    // User Order APIs
    getMy: (token: string) => 
      ApiService.request('/api/v1/my-orders/', { token }),
    
    getMyDetail: (id: string, token: string) => 
      ApiService.request(`/api/v1/my-orders/${id}/`, { token }),
    
    // Admin Order APIs
    admin: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/orders/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/orders/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      getDetail: (id: string, token: string) => 
        ApiService.request(`/api/v1/orders/${id}/`, { token }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/orders/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/orders/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // ==================== 7. ORDER ITEMS APIs ====================
  static orderItems = {
    getAll: (token: string) => 
      ApiService.request('/api/v1/order-items/', { token }),
    
    create: (data: any, token: string) => 
      ApiService.request('/api/v1/order-items/', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    
    getDetail: (id: string, token: string) => 
      ApiService.request(`/api/v1/order-items/${id}/`, { token }),
    
    update: (id: string, data: any, token: string) => 
      ApiService.request(`/api/v1/order-items/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    
    delete: (id: string, token: string) => 
      ApiService.request(`/api/v1/order-items/${id}/`, {
        method: 'DELETE',
        token,
      }),
  };

  // ==================== 8. PAYMENTS APIs ====================
  static payments = {
    // User Payment APIs
    getMy: (token: string) => 
      ApiService.request('/api/v1/my-payments/', { token }),
    
    getMyDetail: (id: string, token: string) => 
      ApiService.request(`/api/v1/my-payments/${id}/`, { token }),
    
    // Admin Payment APIs
    admin: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/payments/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/payments/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      getDetail: (id: string, token: string) => 
        ApiService.request(`/api/v1/payments/${id}/`, { token }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/payments/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/payments/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // ==================== 9. AFFILIATE APIs ====================
  static affiliate = {
    // Register as affiliate
    register: (data: any, token: string) => 
      ApiService.request('/api/v1/affiliate/register/', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    
    // Get affiliate profile
    getProfile: (token: string) => 
      ApiService.request('/api/v1/affiliate/profile/', { token }),
    
    // Update affiliate profile
    updateProfile: (data: any, token: string) => 
      ApiService.request('/api/v1/affiliate/profile/', {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    
    // Get affiliate links
    getLinks: (token: string) => 
      ApiService.request('/api/v1/affiliate/links/', { token }),
    
    // Create affiliate link
    createLink: (data: any, token: string) => 
      ApiService.request('/api/v1/affiliate/links/', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    
    // Get commissions
    getCommissions: (token: string) => 
      ApiService.request('/api/v1/affiliate/commissions/', { token }),
    
    // Get wallet
    getWallet: (token: string) => 
      ApiService.request('/api/v1/affiliate/wallet/', { token }),
  };

  // ==================== 10. NOTIFICATIONS APIs ====================
  static notifications = {
    // Get my notifications
    getMy: (token: string) => 
      ApiService.request('/api/v1/notifications/my/', { token }),
    
    // Get notification detail
    getDetail: (id: string, token: string) => 
      ApiService.request(`/api/v1/notifications/${id}/`, { token }),
    
    // Mark as read
    markAsRead: (id: string, token: string) => 
      ApiService.request(`/api/v1/notifications/${id}/read/`, {
        method: 'PATCH',
        token,
      }),
    
    // Mark as unread
    markAsUnread: (id: string, token: string) => 
      ApiService.request(`/api/v1/notifications/${id}/unread/`, {
        method: 'PATCH',
        token,
      }),
    
    // Mark all as read
    markAllAsRead: (token: string) => 
      ApiService.request('/api/v1/notifications/mark-all-read/', {
        method: 'PATCH',
        token,
      }),
    
    // Get unread count
    getUnreadCount: (token: string) => 
      ApiService.request('/api/v1/notifications/unread-count/', { token }),
    
    // Admin Notification APIs
    admin: {
      // Create notification for specific user
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/notifications/admin/create/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      // Broadcast notification to all users
      broadcast: (data: any, token: string) => 
        ApiService.request('/api/v1/notifications/admin/broadcast/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
    },
  };

  // ==================== 11. ADMIN PANEL APIs ====================
  static adminPanel = {
    // Dashboard Statistics
    getStats: (token: string) => 
      ApiService.request('/api/v1/admin/dashboard/stats/', { token }),
    
    // Banners
    banners: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/banners/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/banners/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      getById: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/banners/${id}/`, { token }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/banners/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/banners/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
    
    // Promotions
    promotions: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/promotions/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/promotions/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      getById: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/promotions/${id}/`, { token }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/promotions/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/promotions/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
    
    // Support Tickets
    supportTickets: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/support-tickets/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/support-tickets/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      getById: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/support-tickets/${id}/`, { token }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/support-tickets/${id}/`, {
          method: 'PATCH',
          body: JSON.stringify(data),
          token,
        }),
      
      // Replies
      getReplies: (ticketId: string, token: string) => 
        ApiService.request(`/api/v1/admin/support-tickets/${ticketId}/replies/`, { token }),
      
      createReply: (ticketId: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/support-tickets/${ticketId}/replies/`, {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
    },
    
    // Reports
    reports: {
      // Sales Report
      sales: (token: string, params?: string) => 
        ApiService.request(`/api/v1/admin/reports/sales/${params || ''}`, { token }),
      
      // Product Performance
      productPerformance: (token: string, params?: string) => 
        ApiService.request(`/api/v1/admin/reports/product-performance/${params || ''}`, { token }),
      
      // Customer Analytics
      customerAnalytics: (token: string, params?: string) => 
        ApiService.request(`/api/v1/admin/reports/customer-analytics/${params || ''}`, { token }),
    },
  };
}

export default ApiService;
