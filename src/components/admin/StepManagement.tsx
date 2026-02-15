import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, List, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { MediaUpload } from '../ui/MediaUpload';
import { authStorage } from '../../lib/auth';
import { ImageWithFallback } from '../ImageWithFallback';

interface Step {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  safetyNote?: string;
}

interface StepManagementProps {
  tutorialId: string;
  tutorialTitle: string;
  onBack: () => void;
}

export function StepManagement({ tutorialId, tutorialTitle, onBack }: StepManagementProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    safetyNote: '',
    imageUrl: '',
    videoUrl: ''
  });

  useEffect(() => {
    loadSteps();
  }, [tutorialId]);

  const loadSteps = async () => {
    try {
      const tutorial = await api.getTutorial(tutorialId);
      setSteps(tutorial.steps || []);
    } catch (error: any) {
      toast.error('Gagal memuat langkah tutorial');
    }
  };

  const saveSteps = async (updatedSteps: Step[]) => {
    try {
      const token = authStorage.getToken();
      if (!token) return;
      const numberedSteps = updatedSteps.map((s, i) => ({ ...s, stepNumber: i + 1 }));
      await fetch(`${import.meta.env.VITE_API_URL}/api/tutorials/${tutorialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ steps: numberedSteps })
      });
      setSteps(numberedSteps);
    } catch (error: any) {
      toast.error('Gagal menyimpan langkah');
    }
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Judul dan deskripsi wajib diisi');
      return;
    }

    const newStep: Step = {
      stepNumber: steps.length + 1,
      title: formData.title,
      description: formData.description,
      safetyNote: formData.safetyNote,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl
    };

    const updatedSteps = [...steps, newStep];
    await saveSteps(updatedSteps);
    toast.success('Langkah berhasil ditambahkan!');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!formData.title || !formData.description || selectedStepIndex === null) {
      toast.error('Judul dan deskripsi wajib diisi');
      return;
    }

    const updatedSteps = [...steps];
    updatedSteps[selectedStepIndex] = {
      stepNumber: selectedStepIndex + 1,
      title: formData.title,
      description: formData.description,
      safetyNote: formData.safetyNote,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl
    };

    await saveSteps(updatedSteps);
    toast.success('Langkah berhasil diupdate!');
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (index: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus langkah ini?')) {
      const updatedSteps = steps.filter((_, i) => i !== index);
      await saveSteps(updatedSteps);
      toast.success('Langkah berhasil dihapus!');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const updatedSteps = [...steps];
    [updatedSteps[index - 1], updatedSteps[index]] = [updatedSteps[index], updatedSteps[index - 1]];
    await saveSteps(updatedSteps);
    toast.success('Urutan langkah berhasil diubah');
  };

  const handleMoveDown = async (index: number) => {
    if (index === steps.length - 1) return;
    const updatedSteps = [...steps];
    [updatedSteps[index], updatedSteps[index + 1]] = [updatedSteps[index + 1], updatedSteps[index]];
    await saveSteps(updatedSteps);
    toast.success('Urutan langkah berhasil diubah');
  };

  const openEditDialog = (index: number) => {
    const step = steps[index];
    setSelectedStepIndex(index);
    setFormData({
      title: step.title,
      description: step.description,
      safetyNote: step.safetyNote || '',
      imageUrl: step.imageUrl || '',
      videoUrl: step.videoUrl || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      safetyNote: '',
      imageUrl: '',
      videoUrl: ''
    });
    setSelectedStepIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Tutorial
          </Button>
          <h3 className="text-xl font-bold">Manajemen Langkah Tutorial</h3>
          <p className="text-sm text-gray-600">{tutorialTitle}</p>
          <p className="text-sm text-gray-500 mt-1">Total: {steps.length} langkah</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Langkah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Langkah Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi langkah tutorial yang akan ditambahkan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Langkah *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Persiapan dan Keselamatan"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Deskripsi *</Label>
                <Textarea
                  id="content"
                  placeholder="Penjelasan umum tentang langkah ini"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safetyNote">Catatan Keselamatan</Label>
                <Textarea
                  id="safetyNote"
                  placeholder="Catatan keselamatan untuk langkah ini"
                  value={formData.safetyNote}
                  onChange={(e) => setFormData({ ...formData, safetyNote: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-sm">Media (Opsional)</h4>
                
                <MediaUpload
                  label="Gambar Langkah"
                  type="image"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  placeholder="https://example.com/step-image.jpg"
                />

                <MediaUpload
                  label="Video Langkah"
                  type="video"
                  value={formData.videoUrl}
                  onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                  placeholder="https://example.com/step-video.mp4"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleAdd}>
                Tambah Langkah
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Steps List */}
      {steps.length > 0 ? (
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1">{step.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{step.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === steps.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {step.imageUrl && (
                    <div className="border rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={step.imageUrl} 
                        alt={step.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  {step.videoUrl && (
                    <div className="border rounded-lg overflow-hidden">
                      <video 
                        src={step.videoUrl} 
                        controls
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  {step.safetyNote && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-yellow-900 mb-1">⚠️ Catatan Keselamatan:</p>
                      <p className="text-sm text-yellow-800">{step.safetyNote}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <List className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Langkah</h3>
            <p className="text-gray-600 mb-6">
              Tambahkan langkah-langkah tutorial untuk memulai
            </p>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Langkah Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Langkah</DialogTitle>
            <DialogDescription>
              Update informasi langkah tutorial
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Langkah *</Label>
              <Input
                id="edit-title"
                placeholder="Contoh: Persiapan dan Keselamatan"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Deskripsi *</Label>
              <Textarea
                id="edit-content"
                placeholder="Penjelasan umum tentang langkah ini"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-safetyNote">Catatan Keselamatan</Label>
              <Textarea
                id="edit-safetyNote"
                placeholder="Catatan keselamatan untuk langkah ini"
                value={formData.safetyNote}
                onChange={(e) => setFormData({ ...formData, safetyNote: e.target.value })}
                rows={2}
              />
            </div>

            <div className="border-t pt-4 space-y-4">
              <h4 className="font-semibold text-sm">Media (Opsional)</h4>
              
              <MediaUpload
                label="Gambar Langkah"
                type="image"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                placeholder="https://example.com/step-image.jpg"
              />

              <MediaUpload
                label="Video Langkah"
                type="video"
                value={formData.videoUrl}
                onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                placeholder="https://example.com/step-video.mp4"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleEdit}>
              Update Langkah
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}