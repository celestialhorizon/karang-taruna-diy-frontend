import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Edit, Trash2, Plus, Eye, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { authStorage } from '../../lib/auth';

const CATEGORIES = [
  'Pertukangan Kayu',
  'Pengecatan',
  'Listrik',
  'Plambing',
  'Perawatan'
];

const SKILL_LEVELS = [
  'Pemula',
  'Menengah',
  'Mahir'
];

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [progressFilter, setProgressFilter] = useState('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    karangTarunaName: '',
    provinsi: '',
    kabupatenKota: '',
    kecamatan: '',
    jalan: '',
    phone: '',
    interests: [] as string[],
    skillLevel: '',
    peranAnggota: '',
    systemRole: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.karangTarunaName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by progress status
    if (progressFilter !== 'all') {
      filtered = filtered.filter(() => {
        const progress = getUserProgress();
        if (progressFilter === 'not-started') {
          return progress.total === 0;
        } else if (progressFilter === 'in-progress') {
          return progress.total > 0 && progress.completed < progress.total;
        } else if (progressFilter === 'completed') {
          return progress.total > 0 && progress.completed === progress.total;
        }
        return true;
      });
    }

    // Filter by skill level
    if (skillLevelFilter !== 'all') {
      filtered = filtered.filter(user => user.skillLevel === skillLevelFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, progressFilter, skillLevelFilter]);

  const loadUsers = async () => {
    try {
      const token = authStorage.getToken();
      console.log('Token from authStorage:', token);
      if (token) {
        const usersData = await api.getUsers(token);
        console.log('Users data:', usersData);
        setUsers(usersData);
        setFilteredUsers(usersData);
      } else {
        console.log('No token found');
        toast.error('No authentication token found. Please login again.');
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      // Display detailed error messages from backend
      let errorMessage = 'Gagal memuat data pengguna';
      
      if (error.response) {
        // Handle ApiError with response data
        if (error.response.message) {
          errorMessage = error.response.message;
        }
        // Handle Mongoose validation errors
        if (error.response.errors) {
          const validationErrors = Object.values(error.response.errors)
            .map((err: any) => err.message)
            .join(', ');
          errorMessage = validationErrors || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };


  const handleInterestChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, category]
        : prev.interests.filter(i => i !== category)
    }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.karangTarunaName || !formData.provinsi || !formData.kabupatenKota || !formData.kecamatan || !formData.jalan) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      await api.register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        karangTarunaName: formData.karangTarunaName,
        provinsi: formData.provinsi,
        kabupatenKota: formData.kabupatenKota,
        kecamatan: formData.kecamatan,
        jalan: formData.jalan,
        phone: formData.phone,
        interests: formData.interests,
        skillLevel: formData.skillLevel,
        peranAnggota: formData.peranAnggota
      });
      toast.success('Pengguna berhasil ditambahkan!');
      setIsAddDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      // Display detailed error messages from backend
      let errorMessage = 'Gagal menambahkan pengguna';
      
      if (error.response) {
        // Handle ApiError with response data
        if (error.response.message) {
          errorMessage = error.response.message;
        }
        // Handle Mongoose validation errors
        if (error.response.errors) {
          const validationErrors = Object.values(error.response.errors)
            .map((err: any) => err.message)
            .join(', ');
          errorMessage = validationErrors || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser || !formData.name || !formData.username || !formData.email || !formData.karangTarunaName || !formData.provinsi || !formData.kabupatenKota || !formData.kecamatan || !formData.jalan) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      const token = authStorage.getToken();
      if (token) {
        await api.updateUser(token, selectedUser._id, {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          karangTarunaName: formData.karangTarunaName,
          provinsi: formData.provinsi,
          kabupatenKota: formData.kabupatenKota,
          kecamatan: formData.kecamatan,
          jalan: formData.jalan,
          phone: formData.phone,
          interests: formData.interests,
          skillLevel: formData.skillLevel,
          peranAnggota: formData.peranAnggota,
          role: formData.systemRole || 'user',
          isActive: true
        });
        toast.success('Data pengguna berhasil diupdate!');
        setIsEditDialogOpen(false);
        resetForm();
        loadUsers();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      // Display detailed error messages from backend
      let errorMessage = 'Gagal mengupdate data pengguna';
      
      if (error.response) {
        // Handle ApiError with response data
        if (error.response.message) {
          errorMessage = error.response.message;
        }
        // Handle Mongoose validation errors
        if (error.response.errors) {
          const validationErrors = Object.values(error.response.errors)
            .map((err: any) => err.message)
            .join(', ');
          errorMessage = validationErrors || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        const token = authStorage.getToken();
        if (token) {
          await api.deleteUser(token, userId);
          toast.success('Pengguna berhasil dihapus!');
          loadUsers();
        }
      } catch (error: any) {
        console.error('Error deleting user:', error);
        // Display detailed error messages from backend
        let errorMessage = 'Gagal menghapus pengguna';
        
        if (error.response) {
          // Handle ApiError with response data
          if (error.response.message) {
            errorMessage = error.response.message;
          }
          // Handle Mongoose validation errors
          if (error.response.errors) {
            const validationErrors = Object.values(error.response.errors)
              .map((err: any) => err.message)
              .join(', ');
            errorMessage = validationErrors || errorMessage;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      }
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      karangTarunaName: user.karangTarunaName || '',
      provinsi: user.provinsi || '',
      kabupatenKota: user.kabupatenKota || '',
      kecamatan: user.kecamatan || '',
      jalan: user.jalan || '',
      phone: user.phone || '',
      interests: user.interests || [],
      skillLevel: user.skillLevel || '',
      peranAnggota: user.peranAnggota || '',
      systemRole: user.role || 'user'
    });
    setIsEditDialogOpen(true);
  };

  const openDetailDialog = (user: any) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      karangTarunaName: '',
      provinsi: '',
      kabupatenKota: '',
      kecamatan: '',
      jalan: '',
      phone: '',
      interests: [],
      skillLevel: '',
      peranAnggota: '',
      systemRole: 'user'
    });
    setSelectedUser(null);
  };

  const getUserProgress = () => {
    return { total: 0, completed: 0 };
  };

  const exportData = () => {
    const dataToExport = users.map(user => {
      const progress = getUserProgress();
      return {
        Nama: user.name || '-',
        Username: user.username || '-',
        Email: user.email || '-',
        'Karang Taruna': user.karangTarunaName || '-',
        'Peran Anggota': user.peranAnggota || '-',
        'Hak Akses': user.role || '-',
        'Provinsi': user.provinsi || '-',
        'Kabupaten/Kota': user.kabupatenKota || '-',
        'Kecamatan': user.kecamatan || '-',
        'Jalan': user.jalan || '-',
        'No. Telepon': user.phone || '-',
        'Minat DIY': (user.interests || []).join('; ') || '-',
        'Tingkat Keahlian': user.skillLevel || '-',
        'Tutorial Diikuti': progress.total,
        'Tutorial Selesai': progress.completed,
        'Tanggal Registrasi': user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'
      };
    });

    const csvContent = [
      Object.keys(dataToExport[0] || {}).join(','),
      ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-pengguna-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data berhasil diexport!');
  };

  const renderFormFields = () => (
    <ScrollArea className="max-h-[60vh] pr-4">
      <div className="space-y-4 py-2">
        {/* Data Pribadi */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm border-b pb-1">Data Pribadi</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="form-name">Nama Lengkap *</Label>
              <Input
                id="form-name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-username">Username *</Label>
              <Input
                id="form-username"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-email">Email *</Label>
            <Input
              id="form-email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-password">Password {isEditDialogOpen ? '(Kosongkan jika tidak ingin mengubah)' : '*'}</Label>
            <Input
              id="form-password"
              type="password"
              placeholder={isEditDialogOpen ? 'Kosongkan jika tidak ingin mengubah' : 'Minimal 6 karakter'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-phone">Nomor Telepon</Label>
            <Input
              id="form-phone"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Informasi Karang Taruna */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm border-b pb-1">Informasi Karang Taruna</h4>
          
          <div className="space-y-2">
            <Label htmlFor="form-kt">Nama Karang Taruna *</Label>
            <Input
              id="form-kt"
              placeholder="Contoh: Karang Taruna Mekar Jaya"
              value={formData.karangTarunaName}
              onChange={(e) => setFormData({ ...formData, karangTarunaName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-peran">Peran Anggota</Label>
            <Input
              id="form-peran"
              placeholder="Contoh: Ketua, Sekretaris, Anggota, dll."
              value={formData.peranAnggota}
              onChange={(e) => setFormData({ ...formData, peranAnggota: e.target.value })}
            />
          </div>
        </div>

        {/* Wilayah Domisili */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm border-b pb-1">Wilayah Domisili</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="form-provinsi">Provinsi *</Label>
              <Input
                id="form-provinsi"
                placeholder="Contoh: Jawa Barat"
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-kab">Kabupaten/Kota *</Label>
              <Input
                id="form-kab"
                placeholder="Contoh: Bandung"
                value={formData.kabupatenKota}
                onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-kec">Kecamatan *</Label>
            <Input
              id="form-kec"
              placeholder="Contoh: Cibiru"
              value={formData.kecamatan}
              onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-jalan">Jalan *</Label>
            <Input
              id="form-jalan"
              placeholder="Contoh: Jl. Raya Cibiru No. 123"
              value={formData.jalan}
              onChange={(e) => setFormData({ ...formData, jalan: e.target.value })}
            />
          </div>
        </div>

        {/* Minat dan Keahlian */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm border-b pb-1">Minat dan Keahlian</h4>
          
          <div className="space-y-2">
            <Label>Minat DIY (dapat memilih lebih dari satu)</Label>
            <div className="space-y-2 bg-gray-50 p-3 rounded-md">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`form-interest-${category}`}
                    checked={formData.interests.includes(category)}
                    onCheckedChange={(checked: boolean) => handleInterestChange(category, checked)}
                  />
                  <label
                    htmlFor={`form-interest-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-skill">Tingkat Keahlian</Label>
            <Select value={formData.skillLevel} onValueChange={(value: string) => setFormData({ ...formData, skillLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat keahlian" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hak Akses - only shown in edit mode */}
        {isEditDialogOpen && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm border-b pb-1">Hak Akses Sistem</h4>
            <div className="space-y-2">
              <Label htmlFor="form-system-role">Tingkat Hak Akses</Label>
              <Select value={formData.systemRole} onValueChange={(value: string) => setFormData({ ...formData, systemRole: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hak akses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Daftar Pengguna</h3>
          <p className="text-sm text-gray-600">Total: {users.length} pengguna</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengguna
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                <DialogDescription>
                  Masukkan data pengguna yang akan ditambahkan
                </DialogDescription>
              </DialogHeader>
              {renderFormFields()}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={handleAdd}>
                  Tambah Pengguna
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, email, username, atau karang taruna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={progressFilter} onValueChange={(value: string) => setProgressFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter berdasarkan progress" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="not-started">Belum Mulai</SelectItem>
            <SelectItem value="in-progress">Sedang Berlangsung</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
          </SelectContent>
        </Select>
        <Select value={skillLevelFilter} onValueChange={(value: string) => setSkillLevelFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter berdasarkan tingkat keahlian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Karang Taruna</TableHead>
              <TableHead className="text-center">Tutorial</TableHead>
              <TableHead>Tanggal Registrasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const progress = getUserProgress();
                return (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name || '-'}</TableCell>
                    <TableCell>{user.username || '-'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.karangTarunaName || '-'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Badge variant="secondary">{progress.total}</Badge>
                        <Badge className="bg-green-600">{progress.completed}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailDialog(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna terdaftar'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Update data pengguna
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleEdit}>
              Update Pengguna
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap pengguna dan progress belajar
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-2">
                {/* Data Pribadi */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Data Pribadi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Nama Lengkap</Label>
                      <p className="font-medium">{selectedUser.name || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Username</Label>
                      <p className="font-medium">{selectedUser.username || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Nomor Telepon</Label>
                    <p className="font-medium">{selectedUser.phone || '-'}</p>
                  </div>
                </div>

                {/* Informasi Karang Taruna */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Informasi Karang Taruna</h4>
                  <div>
                    <Label className="text-gray-600">Nama Karang Taruna</Label>
                    <p className="font-medium">{selectedUser.karangTarunaName || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Peran Anggota</Label>
                    <p className="font-medium">{selectedUser.peranAnggota || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Hak Akses Sistem</Label>
                    <Badge variant={selectedUser.role === 'admin' ? 'destructive' : 'secondary'}>
                      {selectedUser.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                </div>

                {/* Wilayah Domisili */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Wilayah Domisili</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Provinsi</Label>
                      <p className="font-medium">{selectedUser.provinsi || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Kabupaten/Kota</Label>
                      <p className="font-medium">{selectedUser.kabupatenKota || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Kecamatan</Label>
                    <p className="font-medium">{selectedUser.kecamatan || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Jalan</Label>
                    <p className="font-medium">{selectedUser.jalan || '-'}</p>
                  </div>
                </div>

                {/* Minat dan Keahlian */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Minat dan Keahlian</h4>
                  <div>
                    <Label className="text-gray-600">Minat DIY</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.interests && selectedUser.interests.length > 0 ? (
                        selectedUser.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary">{interest}</Badge>
                        ))
                      ) : (
                        <p className="font-medium text-gray-500">-</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tingkat Keahlian</Label>
                    <p className="font-medium">{selectedUser.skillLevel || '-'}</p>
                  </div>
                </div>

                {/* Progress Belajar */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Progress Belajar</h4>
                  <div>
                    <Label className="text-gray-600">Tanggal Registrasi</Label>
                    <p className="font-medium">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Tidak tersedia'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {getUserProgress().total}
                        </p>
                        <p className="text-sm text-gray-600">Tutorial Diikuti</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {getUserProgress().completed}
                        </p>
                        <p className="text-sm text-gray-600">Tutorial Selesai</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}