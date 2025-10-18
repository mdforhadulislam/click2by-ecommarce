// API Configuration and Service Layer

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://devforhad.pythonanywhere.com';

interface ApiOptions extends RequestInit {
  token?: string;
}

export class ApiService {
  private static getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || error.detail || 'Request failed');
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
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...fetchOptions,
      headers: this.getHeaders(token),
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }

  // Auth APIs
  static auth = {
    register: (data: any) => 
      ApiService.request('/api/v1/auth/register/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    login: (data: any) => 
      ApiService.request('/api/v1/auth/login/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    logout: (token: string) => 
      ApiService.request('/api/v1/auth/logout/', {
        method: 'POST',
        token,
      }),
    
    getProfile: (token: string) => 
      ApiService.request('/api/v1/auth/profile/', {
        method: 'GET',
        token,
      }),
    
    updateProfile: (data: any, token: string) => 
      ApiService.request('/api/v1/auth/profile/update/', {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
  };

  // Products APIs
  static products = {
    getAll: (params?: string) => 
      ApiService.request(`/api/v1/products/${params || ''}`),
    
    getBySlug: (slug: string) => 
      ApiService.request(`/api/v1/products/${slug}/`),
    
    // Admin endpoints
    admin: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/products/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/products/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/products/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/products/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // Categories APIs
  static categories = {
    getAll: () => 
      ApiService.request('/api/v1/categories/'),
    
    getProducts: (slug: string) => 
      ApiService.request(`/api/v1/categories/${slug}/products/`),
    
    admin: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/admin/categories/', { token }),
      
      create: (data: any, token: string) => 
        ApiService.request('/api/v1/admin/categories/', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/admin/categories/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
      
      delete: (id: string, token: string) => 
        ApiService.request(`/api/v1/admin/categories/${id}/`, {
          method: 'DELETE',
          token,
        }),
    },
  };

  // Orders APIs
  static orders = {
    getMy: (token: string) => 
      ApiService.request('/api/v1/my-orders/', { token }),
    
    getMyDetail: (id: string, token: string) => 
      ApiService.request(`/api/v1/my-orders/${id}/`, { token }),
    
    admin: {
      getAll: (token: string) => 
        ApiService.request('/api/v1/orders/', { token }),
      
      getDetail: (id: string, token: string) => 
        ApiService.request(`/api/v1/orders/${id}/`, { token }),
      
      update: (id: string, data: any, token: string) => 
        ApiService.request(`/api/v1/orders/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        }),
    },
  };

  // Affiliate APIs
  static affiliate = {
    register: (data: any) => 
      ApiService.request('/api/v1/affiliate/register/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getProfile: (token: string) => 
      ApiService.request('/api/v1/affiliate/profile/', { token }),
    
    getLinks: (token: string) => 
      ApiService.request('/api/v1/affiliate/links/', { token }),
    
    getCommissions: (token: string) => 
      ApiService.request('/api/v1/affiliate/commissions/', { token }),
    
    getWallet: (token: string) => 
      ApiService.request('/api/v1/affiliate/wallet/', { token }),
  };

  // Notifications APIs
  static notifications = {
    getMy: (token: string) => 
      ApiService.request('/api/v1/notifications/my/', { token }),
    
    getUnreadCount: (token: string) => 
      ApiService.request('/api/v1/notifications/unread-count/', { token }),
    
    markAsRead: (id: string, token: string) => 
      ApiService.request(`/api/v1/notifications/${id}/read/`, {
        method: 'POST',
        token,
      }),
    
    markAllAsRead: (token: string) => 
      ApiService.request('/api/v1/notifications/mark-all-read/', {
        method: 'POST',
        token,
      }),
  };
}

export default ApiService;
