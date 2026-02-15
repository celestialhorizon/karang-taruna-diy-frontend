import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash2, Plus, Eye, List } from 'lucide-react';
import { toast } from 'sonner';
import { StepManagement } from './StepManagement';
import { api } from '../../lib/api';
import { MediaUpload } from '../ui/MediaUpload';
import { authStorage } from '../../lib/auth';

export function TutorialManagement() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('none');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [showStepManagement, setShowStepManagement] = useState(false);
  const [stepManagementTutorial, setStepManagementTutorial] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: '',
    duration: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    author: ''
  });

  useEffect(() => {
    loadTutorials();
  }, []);

  const loadTutorials = async () => {
    try {
      const data = await api.getTutorials();
      setTutorials(data);
    } catch (error: any) {
      toast.error('Gagal memuat tutorial');
    }
  };

  // Get sorted tutorials
  const getSortedTutorials = () => {
    let sorted = [...tutorials];
    
    if (sortBy === 'duration-asc') {
      sorted.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'duration-desc') {
      sorted.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'created-asc') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'created-desc') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return sorted;
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.category || !formData.difficulty || !formData.duration) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      const token = authStorage.getToken();
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || 'Tutorial baru',
          category: formData.category,
          difficulty: formData.difficulty,
          duration: parseInt(formData.duration) || 15,
          imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=1080',
          videoUrl: formData.videoUrl || 'https://example.com/video.mp4',
          author: formData.author || 'Admin',
          steps: [],
          materials: []
        })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Tutorial berhasil ditambahkan!');
      setIsAddDialogOpen(false);
      resetForm();
      loadTutorials();
    } catch (error: any) {
      toast.error('Gagal menambahkan tutorial');
    }
  };

  const handleEdit = async () => {
    if (!formData.title || !formData.category || !formData.difficulty || !formData.duration) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      const token = authStorage.getToken();
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/tutorials/${selectedTutorial._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          duration: parseInt(formData.duration) || 15,
          imageUrl: formData.imageUrl || selectedTutorial.imageUrl,
          videoUrl: formData.videoUrl || selectedTutorial.videoUrl,
          author: formData.author || selectedTutorial.author
        })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Tutorial berhasil diupdate!');
      setIsEditDialogOpen(false);
      resetForm();
      loadTutorials();
    } catch (error: any) {
      toast.error('Gagal mengupdate tutorial');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tutorial ini?')) {
      try {
        const token = authStorage.getToken();
        if (!token) return;
        const res = await fetch(`http://localhost:5000/api/tutorials/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed');
        toast.success('Tutorial berhasil dihapus!');
        loadTutorials();
      } catch (error: any) {
        toast.error('Gagal menghapus tutorial');
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const token = authStorage.getToken();
      if (!token) return;
      await fetch(`http://localhost:5000/api/tutorials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isActive: !isActive })
      });
      toast.success('Status tutorial berhasil diubah!');
      loadTutorials();
    } catch (error: any) {
      toast.error('Gagal mengubah status');
    }
  };

  const openEditDialog = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setFormData({
      title: tutorial.title,
      category: tutorial.category,
      difficulty: tutorial.difficulty,
      duration: String(tutorial.duration),
      description: tutorial.description || '',
      imageUrl: tutorial.imageUrl || '',
      videoUrl: tutorial.videoUrl || '',
      author: tutorial.author || ''
    });
    setIsEditDialogOpen(true);
  };

  const openStepManagement = (tutorial: any) => {
    setStepManagementTutorial(tutorial);
    setShowStepManagement(true);
  };

  if (showStepManagement && stepManagementTutorial) {
    return (
      <StepManagement
        tutorialId={stepManagementTutorial._id}
        tutorialTitle={stepManagementTutorial.title}
        onBack={() => setShowStepManagement(false)}
      />
    );
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      difficulty: '',
      duration: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      author: ''
    });
    setSelectedTutorial(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Daftar Tutorial</h3>
          <p className="text-sm text-gray-600">Total: {tutorials.length} tutorial</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tutorial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Tutorial Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi tutorial yang akan ditambahkan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Tutorial *</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul tutorial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plambing">Plambing</SelectItem>
                      <SelectItem value="Listrik">Listrik</SelectItem>
                      <SelectItem value="Pengecatan">Pengecatan</SelectItem>
                      <SelectItem value="Pertukangan Kayu">Pertukangan Kayu</SelectItem>
                      <SelectItem value="Perawatan">Perawatan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Tingkat Kesulitan *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pemula">Pemula</SelectItem>
                      <SelectItem value="Menengah">Menengah</SelectItem>
                      <SelectItem value="Lanjutan">Lanjutan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durasi *</Label>
                  <Input
                    id="duration"
                    placeholder="Contoh: 15 menit"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Penulis</Label>
                  <Input
                    id="author"
                    placeholder="Nama penulis"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi tutorial"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Thumbnail Image Upload */}
              <MediaUpload
                label="Gambar Thumbnail Tutorial *"
                type="image"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleAdd}>
                Tambah Tutorial
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sorting Controls */}
      <div className="flex gap-4 items-center">
        <Label className="text-sm font-medium">Urutkan:</Label>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih urutan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default (ID)</SelectItem>
            <SelectItem value="duration-asc">Durasi (Terpendek)</SelectItem>
            <SelectItem value="duration-desc">Durasi (Terpanjang)</SelectItem>
            <SelectItem value="created-asc">Waktu Dibuat (Terlama)</SelectItem>
            <SelectItem value="created-desc">Waktu Dibuat (Terbaru)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedTutorials().map((tutorial) => (
              <TableRow key={tutorial._id}>
                <TableCell className="font-medium">{tutorial._id?.slice(-4)}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{tutorial.title}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tutorial.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    tutorial.difficulty === 'Pemula' ? 'bg-green-100 text-green-700' :
                    tutorial.difficulty === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {tutorial.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>{tutorial.duration} menit</TableCell>
                <TableCell>
                  <Badge variant="secondary">video</Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={tutorial.isActive ? 'bg-green-600' : 'bg-gray-500'}
                  >
                    {tutorial.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(tutorial.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openStepManagement(tutorial)}
                      title="Kelola Langkah"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(tutorial._id, tutorial.isActive)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(tutorial)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(tutorial._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tutorial</DialogTitle>
            <DialogDescription>
              Update informasi tutorial
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Tutorial *</Label>
              <Input
                id="edit-title"
                placeholder="Masukkan judul tutorial"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plambing">Plambing</SelectItem>
                    <SelectItem value="Listrik">Listrik</SelectItem>
                    <SelectItem value="Pengecatan">Pengecatan</SelectItem>
                    <SelectItem value="Pertukangan Kayu">Pertukangan Kayu</SelectItem>
                    <SelectItem value="Perawatan">Perawatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-difficulty">Tingkat Kesulitan *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pemula">Pemula</SelectItem>
                    <SelectItem value="Menengah">Menengah</SelectItem>
                    <SelectItem value="Lanjutan">Lanjutan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Durasi *</Label>
                <Input
                  id="edit-duration"
                  placeholder="Contoh: 15 menit"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-author">Penulis</Label>
                <Input
                  id="edit-author"
                  placeholder="Nama penulis"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                placeholder="Masukkan deskripsi tutorial"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Thumbnail Image Upload */}
            <MediaUpload
              label="Gambar Thumbnail Tutorial *"
              type="image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleEdit}>
              Update Tutorial
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}