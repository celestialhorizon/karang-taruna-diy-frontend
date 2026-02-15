import { Header } from '../Header';
import { Footer } from '../Footer';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('diy_current_user') || 'null');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    // Simulate form submission
    toast.success('Pesan Anda berhasil dikirim! Kami akan merespon dalam 1-2 hari kerja.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={user}
        onNavigate={onNavigate}
        onLogout={() => {
          localStorage.removeItem('diy_current_user');
          onNavigate('home');
        }}
        title="Hubungi Kami"
        subtitle="Kami siap membantu Anda"
      />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subjek *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Topik pesan Anda"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Pesan *</Label>
                <Textarea
                  id="message"
                  placeholder="Tuliskan pesan Anda di sini..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                <Send className="w-4 h-4 mr-2" />
                Kirim Pesan
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 text-sm">info@karangtarunadiy.id</p>
                    <p className="text-gray-600 text-sm">support@karangtarunadiy.id</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600 text-sm">+62 812-3456-7890</p>
                    <p className="text-gray-500 text-xs mt-1">Senin - Jumat: 09:00 - 17:00 WIB</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                    <p className="text-gray-600 text-sm">
                      Jakarta, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Link */}
            <div className="bg-gradient-to-br from-red-50 to-yellow-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Pertanyaan Umum?</h3>
              <p className="text-sm text-gray-900 mb-4">
                Mungkin pertanyaan Anda sudah terjawab di halaman FAQ kami.
              </p>
              <Button
                onClick={() => onNavigate('faq')}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Lihat FAQ
              </Button>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Waktu Respon</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Email: 1-2 hari kerja
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Telepon: Langsung (jam kerja)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Untuk Pertanyaan Teknis</h3>
              <p className="text-sm text-gray-600">
                Jika Anda mengalami masalah teknis dengan platform, pastikan untuk menyertakan detail 
                seperti browser yang digunakan, perangkat, dan screenshot jika memungkinkan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Untuk Request Konten</h3>
              <p className="text-sm text-gray-600">
                Kami menerima saran untuk konten tutorial baru. Jelaskan topik yang Anda inginkan 
                dan mengapa tutorial tersebut akan bermanfaat bagi komunitas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Untuk Kerjasama</h3>
              <p className="text-sm text-gray-600">
                Tertarik untuk berkolaborasi atau bermitra dengan kami? Hubungi kami melalui email 
                dengan detail proposal kerjasama Anda.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Untuk Feedback</h3>
              <p className="text-sm text-gray-600">
                Masukan Anda sangat berharga bagi kami. Jangan ragu untuk membagikan pengalaman, 
                saran, atau kritik untuk membantu kami meningkatkan layanan.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
