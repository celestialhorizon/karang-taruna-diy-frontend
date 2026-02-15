import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShieldCheck, LogOut, Users, BookOpen, BarChart3, Home } from 'lucide-react';
import { TutorialManagement } from './admin/TutorialManagement';
import { UserManagement } from './admin/UserManagement';
import { ThemeToggle } from './ui/theme-toggle';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';

interface AdminDashboardProps {
  admin: any;
  onNavigate: (page: string) => void;
  onAdminLogout: () => void;
  defaultTab?: string;
}

export function AdminDashboard({ admin, onAdminLogout, defaultTab = "tutorials" }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutorials: 6,
    totalProgress: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = authStorage.getToken();
      if (token) {
        // Get users count
        const users = await api.getUsers(token);
        
        // Get tutorials count
        const tutorials = await api.getTutorials();
        
        // Get all users progress (simplified - just count total progress entries)
        let totalProgress = 0;
        try {
          // For now, we'll estimate progress count
          // In a real implementation, you might want a dedicated admin endpoint
          const allProgress = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorials/user/progress`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (allProgress.ok) {
            const progressData = await allProgress.json();
            totalProgress = progressData.length || 0;
          }
        } catch {
          // If we can't get progress, just show 0
        }
        
        setStats({
          totalUsers: users.length,
          totalTutorials: tutorials.length,
          totalProgress
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-red-100">Karang Taruna DIY Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="bg-white text-red-600 hover:bg-red-50">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-red-100">Login sebagai</p>
                <p className="font-medium">{admin.name}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onAdminLogout} className="bg-white text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pengguna</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tutorial</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTutorials}</p>
                </div>
                <BookOpen className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProgress}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Sistem</CardTitle>
            <CardDescription>Kelola konten tutorial dan data pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value: string) => {
              navigate(`/admin/${value}`);
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="tutorials">Manajemen Tutorial</TabsTrigger>
                <TabsTrigger value="users">Manajemen Pengguna</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tutorials">
                <TutorialManagement />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
