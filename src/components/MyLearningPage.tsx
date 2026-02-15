import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Play } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { ThemeToggle } from './ui/theme-toggle';
import logo from '../assets/logo.png';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';

interface MyLearningPageProps {
  user: any;
  onNavigate: (page: string, tutorialId?: string) => void;
  onLogout: () => void;
}

export function MyLearningPage({ user, onNavigate }: MyLearningPageProps) {
  const [learningList, setLearningList] = useState<any[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const token = authStorage.getToken();
        if (token) {
          const progressData = await api.getUserProgress(token);
          setLearningList(progressData);
        }
      } catch (error: any) {
        console.error('Failed to load progress:', error);
      }
    };
    loadProgress();
  }, [user]);

  const inProgressTutorials = learningList.filter(item => !item.isCompleted);
  const completedTutorials = learningList.filter(item => item.isCompleted);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const TutorialCard = ({ progress }: { progress: any }) => {
    const tutorial = progress.tutorial;
    if (!tutorial) return null;

    const totalSteps = tutorial.steps?.length || 1;
    const completedSteps = progress.completedSteps?.length || 0;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-40 sm:h-48">
          <ImageWithFallback
            src={tutorial.imageUrl || ''}
            alt={tutorial.title}
            className="w-full h-full object-cover"
          />
          {progress.isCompleted && (
            <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-2">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">{tutorial.category}</Badge>
            <span className="text-xs text-gray-500">
              {progress.updatedAt ? formatDate(progress.updatedAt) : ''}
            </span>
          </div>
          <CardTitle className="text-base sm:text-lg line-clamp-2">{tutorial.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {completedSteps} / {totalSteps} langkah
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <Button
              size="sm"
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => onNavigate('detail', tutorial._id)}
            >
              {progress.isCompleted ? (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lihat Lagi
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Lanjutkan Belajar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">Pembelajaran Saya</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Pantau progress belajar Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => onNavigate('home')} className="text-xs sm:text-sm">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{learningList.length}</p>
              <p className="text-xs text-gray-600">Total Tutorial</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{inProgressTutorials.length}</p>
              <p className="text-xs text-gray-600">Sedang Berjalan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{completedTutorials.length}</p>
              <p className="text-xs text-gray-600">Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">%</span>
              </div>
              <p className="text-2xl font-bold">
                {learningList.length > 0
                  ? Math.round((completedTutorials.length / learningList.length) * 100)
                  : 0}
              </p>
              <p className="text-xs text-gray-600">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tutorial Lists */}
        {learningList.length > 0 ? (
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="in-progress">
                Sedang Berjalan ({inProgressTutorials.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Selesai ({completedTutorials.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="in-progress">
              {inProgressTutorials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {inProgressTutorials.map((progress) => (
                    <TutorialCard key={progress._id} progress={progress} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-4">Belum ada tutorial yang sedang berjalan</p>
                    <Button onClick={() => onNavigate('home')} className="bg-red-600 hover:bg-red-700">
                      Mulai Belajar
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedTutorials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {completedTutorials.map((progress) => (
                    <TutorialCard key={progress._id} progress={progress} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-4">Belum ada tutorial yang diselesaikan</p>
                    <Button onClick={() => onNavigate('home')} className="bg-red-600 hover:bg-red-700">
                      Mulai Belajar
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Belum Ada Pembelajaran</h3>
              <p className="text-gray-600 mb-6">
                Mulai belajar tutorial pertama Anda untuk melihat progress di sini
              </p>
              <Button onClick={() => onNavigate('home')} className="bg-red-600 hover:bg-red-700">
                Jelajahi Tutorial
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
