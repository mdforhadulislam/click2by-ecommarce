"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.phone, formData.password);
      } else {
        await register(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          data-testid="auth-modal-close-btn"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? 'Login to Bazaarfly' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4" data-testid="auth-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} data-testid="auth-form">
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="Your full name"
                data-testid="auth-name-input"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              placeholder="+8801XXXXXXXXX"
              data-testid="auth-phone-input"
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!isLogin}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                placeholder="your@email.com"
                data-testid="auth-email-input"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              placeholder="••••••••"
              data-testid="auth-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition disabled:opacity-50"
            data-testid="auth-submit-btn"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-black"
            data-testid="auth-toggle-btn"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
