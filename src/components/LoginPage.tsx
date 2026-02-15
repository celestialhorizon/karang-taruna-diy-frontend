import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import logo from 'assets/logo';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (userData: any) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
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
        const response = await api.login(formData);
        authStorage.setToken(response.token);
        const { token, ...userData } = response;
        authStorage.setUser(userData);
        toast.success(`Selamat datang, ${response.name || response.username}!`);
        onLogin(response);
      } catch (error: any) {
        setErrors({ password: error.message });
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="Karang Taruna Logo" className="w-20 h-20" />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masuk untuk mengakses konten lengkap tutorial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Login
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-gray-300 hover:bg-gray-50"
              onClick={async () => {
                try {
                  const response = await api.login({ email: 'user@karangtaruna.com', password: 'user123' });
                  authStorage.setToken(response.token);
                  const { token: t, ...userData } = response;
                  authStorage.setUser(userData);
                  toast.success(`Selamat datang, ${response.name || response.username}!`);
                  onLogin(response);
                } catch (error: any) {
                  toast.error(error.message);
                }
              }}
            >
              Login dengan Akun Test
            </Button>

            <div className="text-center text-sm">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-red-600 hover:underline font-medium"
              >
                Daftar di sini
              </button>
            </div>

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