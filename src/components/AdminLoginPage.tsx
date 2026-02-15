import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
  onAdminLogin: (adminData: any) => void;
}

export function AdminLoginPage({ onNavigate, onAdminLogin }: AdminLoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Try to login via API
        const response = await api.login({
          email: formData.email,
          password: formData.password
        });
        
        // Check if user has admin role
        if (response.role === 'admin' || response.role === 'superadmin') {
          // Store token in authStorage for API calls
          authStorage.setToken(response.token);
          authStorage.setUser(response);
          
          const adminData = {
            _id: response._id,
            email: response.email,
            username: response.username,
            name: response.name,
            role: response.role
          };
          localStorage.setItem('diy_admin_user', JSON.stringify(adminData));
          toast.success(`Selamat datang, ${response.username}!`);
          onAdminLogin(adminData);
          onNavigate('admin-dashboard');
        } else {
          setErrors({ password: 'Anda tidak memiliki akses admin' });
          toast.error('Login gagal. Akun ini tidak memiliki akses admin.');
        }
      } catch (error: any) {
        console.error('Admin login error:', error);
        setErrors({ password: 'Email atau password admin salah' });
        toast.error('Login gagal. Periksa kembali kredensial admin Anda.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-red-600 p-3 rounded-full">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Login sebagai administrator sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password Admin</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password admin"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Login sebagai Admin
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-sm text-gray-500 hover:underline"
              >
                Kembali ke Beranda
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
