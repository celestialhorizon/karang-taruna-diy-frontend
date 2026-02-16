import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Hammer, Search, LogOut, Video, Wrench, Paintbrush, Lightbulb, Droplet, Menu, GraduationCap, ShieldCheck, Clock } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Footer } from './Footer';
import { BuntingDecoration } from './BuntingDecoration';
import { ThemeToggle } from './ui/theme-toggle';
import logo from '../assets/logo.png';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';

interface Tutorial {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  imageUrl: string;
  videoUrl?: string;
  author: string;
  createdAt?: string;
}

interface HomePageProps {
  user: any | null;
  onNavigate: (page: string, tutorialId?: string) => void;
  onLogout: () => void;
}


const categories = [
  { name: 'Semua', icon: Hammer },
  { name: 'Pertukangan Kayu', icon: Wrench },
  { name: 'Pengecatan', icon: Paintbrush },
  { name: 'Listrik', icon: Lightbulb },
  { name: 'Plambing', icon: Droplet },
  { name: 'Perawatan', icon: GraduationCap }
];

export function HomePage({ user, onNavigate, onLogout }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showCategories, setShowCategories] = useState(false);
  const [progressFilter, setProgressFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTutorials();
    if (user) {
      loadUserProgress();
    }
  }, [selectedCategory, difficultyFilter]);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      if (selectedCategory !== 'Semua') filters.category = selectedCategory;
      if (difficultyFilter !== 'all') filters.difficulty = difficultyFilter;
      
      const tutorialsData = await api.getTutorials(filters);
      setTutorials(tutorialsData);
    } catch (error: any) {
      console.error('Failed to load tutorials:', error);
      setError('Sedang ada gangguan ke Server, silakan coba lagi nanti.');
      setTutorials([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const token = authStorage.getToken();
      if (token) {
        const progressData = await api.getUserProgress(token);
        setUserProgress(progressData);
      }
    } catch (error: any) {
      console.error('Failed to load user progress:', error);
    }
  };

  // Get user progress for a tutorial
  const getUserProgressForTutorial = (tutorialId: string) => {
    return userProgress.find(p => p.tutorial._id === tutorialId);
  };

  // Check if tutorial is completed
  const isTutorialCompleted = (tutorialId: string) => {
    const progress = getUserProgressForTutorial(tutorialId);
    return progress?.isCompleted || false;
  };

  // Check if tutorial is in progress
  const isTutorialInProgress = (tutorialId: string) => {
    const progress = getUserProgressForTutorial(tutorialId);
    return progress && !progress.isCompleted && progress.completedSteps.length > 0;
  };

  
  // Filter and sort tutorials
  const getFilteredAndSortedTutorials = () => {
    let filtered = tutorials.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || tutorial.category === selectedCategory;
      
      // Progress filter (only for logged in users)
      let matchesProgress = true;
      if (user && progressFilter !== 'all') {
        if (progressFilter === 'not-started') {
          matchesProgress = !isTutorialInProgress(tutorial._id) && !isTutorialCompleted(tutorial._id);
        } else if (progressFilter === 'in-progress') {
          matchesProgress = isTutorialInProgress(tutorial._id);
        } else if (progressFilter === 'completed') {
          matchesProgress = isTutorialCompleted(tutorial._id);
        }
      }

      // Difficulty filter
      const matchesDifficulty = difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesProgress && matchesDifficulty;
    });

    // Sort
    if (sortBy === 'duration-asc') {
      filtered.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'duration-desc') {
      filtered.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'created-asc') {
      filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === 'created-desc') {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return filtered;
  };

  const filteredTutorials = getFilteredAndSortedTutorials();

  const handleViewDetail = (tutorialId: string) => {
    if (!user) {
      // Jika belum login, arahkan ke halaman login
      onNavigate('login', tutorialId);
    } else {
      // Jika sudah login, langsung ke detail
      onNavigate('detail', tutorialId);
    }
  };

  // Remove full loading screen - header should always be visible

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First */}
      <header className="bg-white border-b sticky top-0 z-10 relative" style={{ boxShadow: 'rgb(0 0 0 / 25%) 0px 7px 5px 2px' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">Karang Taruna DIY</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Platform Tutorial Pertukangan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('my-learning')} 
                    className="text-xs sm:text-sm"
                  >
                    <GraduationCap className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Pembelajaran Saya</span>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onNavigate('admin-tutorials')} 
                      className="text-xs sm:text-sm text-purple-600"
                    >
                      <ShieldCheck className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Admin</span>
                    </Button>
                  )}
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-500">Selamat datang,</p>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={onLogout} className="text-xs sm:text-sm">
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Keluar</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onNavigate('login')} 
                    className="text-xs sm:text-sm"
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onNavigate('register')} 
                    className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                  >
                    Daftar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Bunting Decoration */}
        <BuntingDecoration />
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Welcome Message - Mobile */}
        {user && (
          <div className="mb-4 md:hidden">
            <p className="text-sm text-gray-600">Halo, <span className="font-medium text-gray-900">{user.name}</span></p>
          </div>
        )}

        {/* Guest Welcome Message */}
        {!user && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Selamat datang! Anda dapat menjelajahi tutorial kami. 
              <button 
                onClick={() => onNavigate('login')} 
                className="text-red-600 font-medium ml-1 hover:underline"
              >
                Login
              </button> atau 
              <button 
                onClick={() => onNavigate('register')} 
                className="text-red-600 font-medium ml-1 hover:underline"
              >
                Daftar
              </button> untuk mengakses konten lengkap.
            </p>
          </div>
        )}

        {/* Search, Filter and Sort - All in One Row - Mobile First */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari tutorial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm h-10"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {/* Progress Filter - Only for logged in users */}
              {user && (
                <Select value={progressFilter} onValueChange={setProgressFilter}>
                  <SelectTrigger className="text-sm h-10 w-full sm:w-[160px]">
                    <SelectValue placeholder="Progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="not-started">Belum Mulai</SelectItem>
                    <SelectItem value="in-progress">Berlangsung</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Difficulty Filter */}
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="text-sm h-10 w-full sm:w-[140px]">
                  <SelectValue placeholder="Kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tingkat</SelectItem>
                  <SelectItem value="Pemula">Pemula</SelectItem>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Lanjutan">Lanjutan</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="text-sm h-10 w-full sm:w-[160px]">
                  <SelectValue placeholder="Urutan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Default</SelectItem>
                  <SelectItem value="duration-asc">Terpendek</SelectItem>
                  <SelectItem value="duration-desc">Terpanjang</SelectItem>
                  <SelectItem value="created-desc">Terbaru</SelectItem>
                  <SelectItem value="created-asc">Terlama</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              {(progressFilter !== 'all' || difficultyFilter !== 'all' || sortBy !== 'none') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProgressFilter('all');
                    setDifficultyFilter('all');
                    setSortBy('none');
                  }}
                  className="h-10 text-sm whitespace-nowrap"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Categories - Mobile First */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-semibold">Kategori</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCategories(!showCategories)}
              className="md:hidden text-sm"
            >
              <Menu className="w-4 h-4 mr-1" />
              {showCategories ? 'Sembunyikan' : 'Tampilkan'}
            </Button>
          </div>
          <div className={`${showCategories ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  size="sm"
                  className={`text-xs sm:text-sm ${selectedCategory === category.name ? "bg-red-600 hover:bg-red-700" : ""}`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tutorial Grid - Mobile First */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">
              {selectedCategory === 'Semua' ? 'Semua Tutorial' : `Tutorial ${selectedCategory}`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">{filteredTutorials.length} tutorial</p>
          </div>
          
          {loading && (
            // Loading skeletons with better design
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-40 sm:h-48 bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            // Error state - better positioning
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
                <p className="text-red-600 mb-4 max-w-md mx-auto">{error}</p>
                <Button onClick={loadTutorials} className="bg-red-600 hover:bg-red-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && filteredTutorials.length === 0 && (
            // Empty state - better design
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-md w-full">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak Ada Tutorial</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Tidak ada tutorial yang ditemukan untuk kategori "{selectedCategory === 'Semua' ? 'Semua Kategori' : selectedCategory}".
                </p>
                <Button onClick={() => setSelectedCategory('Semua')} variant="outline">
                  Lihat Semua Tutorial
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && filteredTutorials.length > 0 && (
            // Normal state - tutorial cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTutorials.map((tutorial) => (
                <Card key={tutorial._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40 sm:h-48">
                    <ImageWithFallback
                      src={tutorial.imageUrl}
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <Badge className="bg-white text-gray-900 text-xs">
                        <><Video className="w-3 h-3 mr-1" /> Video</>
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">{tutorial.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <Badge variant="outline" className="text-xs">{tutorial.category}</Badge>
                      <Badge variant="outline" className="text-xs">{tutorial.difficulty}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {tutorial.duration} menit
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                        onClick={() => handleViewDetail(tutorial._id)}
                      >
                        {user ? 'Lihat Detail' : 'Login untuk Akses'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}