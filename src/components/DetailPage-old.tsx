import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Video, Clock, BarChart, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import logo from 'assets/logo';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';

interface DetailPageProps {
  tutorialId: string;
  user: any;
  onNavigate: (page: string) => void;
}

export function DetailPage({ tutorialId, user, onNavigate }: DetailPageProps) {
  const [tutorial, setTutorial] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load tutorial from API
  useEffect(() => {
    const loadTutorial = async () => {
      try {
        setLoading(true);
        const data = await api.getTutorial(tutorialId);
        setTutorial(data);
      } catch (error: any) {
        console.error('Failed to load tutorial:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTutorial();
  }, [tutorialId]);

  // Load progress from API
  useEffect(() => {
    const loadProgress = async () => {
      const token = authStorage.getToken();
      if (user && token && tutorialId) {
        try {
          const progress = await api.getTutorialProgress(token, tutorialId);
          if (progress && progress.completedSteps && progress.completedSteps.length > 0) {
            setCurrentStep(Math.max(...progress.completedSteps));
          }
        } catch (error: any) {
          console.error('Failed to load progress:', error);
        }
      }
    };
    loadProgress();
  }, [user, tutorialId]);

  // Save progress when step changes
  useEffect(() => {
    const saveProgress = async () => {
      const token = authStorage.getToken();
      if (user && token && tutorial && currentStep > 0) {
        try {
          await api.updateTutorialProgress(token, tutorialId, currentStep, true);
        } catch (error: any) {
          console.error('Failed to save progress:', error);
        }
      }
    };
    saveProgress();
  }, [currentStep, user, tutorialId, tutorial]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading tutorial...</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Tutorial tidak ditemukan</p>
          <Button onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-green-100 text-green-700';
      case 'Menengah': return 'bg-yellow-100 text-yellow-700';
      case 'Lanjutan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const steps = tutorial.steps || [];
  const currentStepData = currentStep < steps.length ? steps[currentStep] : null;
  const progressPercentage = steps.length > 0 ? ((currentStep + 1) / (steps.length + 1)) * 100 : 100;
  const isLastStep = currentStep === steps.length;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    toast.success('Selamat! Anda telah menyelesaikan tutorial ini!');
    setTimeout(() => onNavigate('home'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')} className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              Kembali
            </Button>
            <img src={logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Tutorial Info */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">{tutorial.category}</Badge>
            <Badge className={`${getDifficultyColor(tutorial.difficulty)} text-xs`}>
              <BarChart className="w-3 h-3 mr-1" />
              {tutorial.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <><Video className="w-3 h-3 mr-1" /> Video</>
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {tutorial.duration} menit
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{tutorial.title}</h1>
          <p className="text-sm sm:text-base text-gray-600">{tutorial.description}</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress Belajar</span>
                <span className="text-gray-600">
                  Langkah {Math.min(currentStep + 1, steps.length + 1)} dari {steps.length + 1}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-500">
                {isLastStep ? 'Selesai!' : `${Math.round(progressPercentage)}% selesai`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step Content or Completion */}
        {!isLastStep && currentStepData ? (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Main Video/Image */}
              {currentStep === 0 && (
                <Card className="overflow-hidden">
                  {tutorial.videoUrl ? (
                    <div className="aspect-video bg-gray-900">
                      <iframe
                        width="100%"
                        height="100%"
                        src={tutorial.videoUrl}
                        title={tutorial.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 sm:h-64 lg:h-96">
                      <ImageWithFallback
                        src={tutorial.imageUrl}
                        alt={tutorial.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </Card>
              )}

              {/* Step Content */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {currentStep + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl mb-1">{currentStepData.title}</CardTitle>
                      <CardDescription className="text-sm">{currentStepData.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {currentStepData.imageUrl && (
                      <div className="border rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={currentStepData.imageUrl}
                          alt={currentStepData.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Deskripsi Langkah
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{currentStepData.description}</p>
                    </div>

                    {currentStepData.safetyNote && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-yellow-900 mb-1">Catatan Keselamatan:</p>
                            <p className="text-sm text-yellow-800">{currentStepData.safetyNote}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Selanjutnya
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Materials Required */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Bahan yang Diperlukan</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ul className="space-y-2">
                    {tutorial.materials && tutorial.materials.map((mat: any, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base">{mat.name} - {mat.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Steps Overview */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Daftar Langkah</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ol className="space-y-2">
                    {steps.map((step: any, index: number) => (
                      <li
                        key={index}
                        className={`flex items-start gap-2 text-sm cursor-pointer p-2 rounded transition-colors ${
                          index === currentStep
                            ? 'bg-red-50 text-red-900 font-medium'
                            : index < currentStep
                            ? 'text-green-700'
                            : 'text-gray-600'
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <span className="flex-shrink-0">
                          {index < currentStep ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="w-4 h-4 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                          )}
                        </span>
                        <span className="line-clamp-2">{step.title}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Completion Screen
          <Card className="text-center">
            <CardContent className="p-8 sm:p-12">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">Selamat! 🎉</h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Anda telah menyelesaikan tutorial
                  </p>
                  <p className="text-xl font-semibold text-gray-900">{tutorial.title}</p>
                </div>
                
                {tutorial.finalNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-blue-900">{tutorial.finalNotes}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                  >
                    Ulangi Tutorial
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleComplete}
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
