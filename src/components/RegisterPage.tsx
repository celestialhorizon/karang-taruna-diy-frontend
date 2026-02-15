import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import logo from 'assets/logo';
import { api } from '../lib/api';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

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

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    karangTarunaName: '',
    provinsi: '',
    kabupatenKota: '',
    kecamatan: '',
    jalan: '',
    phone: '',
    interests: [] as string[],
    skillLevel: '',
    peranAnggota: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Field wajib
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
    }

    if (!formData.karangTarunaName.trim()) {
      newErrors.karangTarunaName = 'Nama karang taruna wajib diisi';
    }

    if (!formData.provinsi.trim()) {
      newErrors.provinsi = 'Provinsi wajib diisi';
    }

    if (!formData.kabupatenKota.trim()) {
      newErrors.kabupatenKota = 'Kabupaten/Kota wajib diisi';
    }

    if (!formData.kecamatan.trim()) {
      newErrors.kecamatan = 'Kecamatan wajib diisi';
    }

    if (!formData.jalan.trim()) {
      newErrors.jalan = 'Jalan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInterestChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, category]
        : prev.interests.filter(i => i !== category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
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
        toast.success('Registrasi berhasil! Silakan login.');
        onNavigate('login');
      } catch (error: any) {
        if (error.message.includes('Email')) {
          setErrors({ email: error.message });
        } else if (error.message.includes('Username')) {
          setErrors({ username: error.message });
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="Karang Taruna Logo" className="w-20 h-20" />
          </div>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>
            Bergabung dengan Karang Taruna DIY Tutorial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pribadi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Data Pribadi</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username <span className="text-red-600">*</span></Label>
                  <Input
                    id="username"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password <span className="text-red-600">*</span></Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Informasi Karang Taruna */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Informasi Karang Taruna</h3>
              
              <div className="space-y-2">
                <Label htmlFor="karangTarunaName">Nama Karang Taruna <span className="text-red-600">*</span></Label>
                <Input
                  id="karangTarunaName"
                  placeholder="Contoh: Karang Taruna Mekar Jaya"
                  value={formData.karangTarunaName}
                  onChange={(e) => setFormData({ ...formData, karangTarunaName: e.target.value })}
                  className={errors.karangTarunaName ? 'border-red-500' : ''}
                />
                {errors.karangTarunaName && <p className="text-sm text-red-500">{errors.karangTarunaName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="peranAnggota">Peran Anggota</Label>
                <Input
                  id="peranAnggota"
                  placeholder="Contoh: Ketua, Sekretaris, Anggota, dll."
                  value={formData.peranAnggota}
                  onChange={(e) => setFormData({ ...formData, peranAnggota: e.target.value })}
                />
              </div>
            </div>

            {/* Wilayah Domisili */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Wilayah Domisili</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provinsi">Provinsi <span className="text-red-600">*</span></Label>
                  <Input
                    id="provinsi"
                    placeholder="Contoh: Jawa Barat"
                    value={formData.provinsi}
                    onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    className={errors.provinsi ? 'border-red-500' : ''}
                  />
                  {errors.provinsi && <p className="text-sm text-red-500">{errors.provinsi}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kabupatenKota">Kabupaten/Kota <span className="text-red-600">*</span></Label>
                  <Input
                    id="kabupatenKota"
                    placeholder="Contoh: Bandung"
                    value={formData.kabupatenKota}
                    onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                    className={errors.kabupatenKota ? 'border-red-500' : ''}
                  />
                  {errors.kabupatenKota && <p className="text-sm text-red-500">{errors.kabupatenKota}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kecamatan">Kecamatan <span className="text-red-600">*</span></Label>
                <Input
                  id="kecamatan"
                  placeholder="Contoh: Cibiru"
                  value={formData.kecamatan}
                  onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                  className={errors.kecamatan ? 'border-red-500' : ''}
                />
                {errors.kecamatan && <p className="text-sm text-red-500">{errors.kecamatan}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jalan">Jalan <span className="text-red-600">*</span></Label>
                <Input
                  id="jalan"
                  placeholder="Contoh: Jl. Raya Cibiru No. 123"
                  value={formData.jalan}
                  onChange={(e) => setFormData({ ...formData, jalan: e.target.value })}
                  className={errors.jalan ? 'border-red-500' : ''}
                />
                {errors.jalan && <p className="text-sm text-red-500">{errors.jalan}</p>}
              </div>
            </div>

            {/* Minat dan Keahlian */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Minat dan Keahlian</h3>
              
              <div className="space-y-2">
                <Label>Minat DIY (dapat memilih lebih dari satu)</Label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${category}`}
                        checked={formData.interests.includes(category)}
                        onCheckedChange={(checked) => handleInterestChange(category, checked as boolean)}
                      />
                      <label
                        htmlFor={`interest-${category}`}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Tingkat Keahlian</Label>
                <Select value={formData.skillLevel} onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}>
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

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Daftar Sekarang
            </Button>

            <div className="text-center text-sm">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-red-600 hover:underline font-medium"
              >
                Login di sini
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