import { Header } from '../Header';
import { Footer } from '../Footer';
import { Button } from '../ui/button';
import { Target, Users, Award, Heart } from 'lucide-react';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

export function AboutUs({ onNavigate }: AboutUsProps) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('diy_current_user') || 'null');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={user}
        onNavigate={onNavigate}
        onLogout={() => {
          localStorage.removeItem('diy_current_user');
          onNavigate('home');
        }}
        title="Tentang Kami"
        subtitle="Platform Tutorial DIY Karang Taruna"
      />

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Memberdayakan Generasi Muda Indonesia</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Platform Tutorial DIY Karang Taruna adalah sebuah inisiatif digital yang dirancang khusus untuk 
              memberdayakan anggota Karang Taruna di seluruh Indonesia dengan keterampilan praktis dalam bidang 
              pertukangan dan DIY (Do It Yourself).
            </p>
            <p className="text-gray-700 leading-relaxed">
              Kami percaya bahwa dengan memberikan akses mudah ke pengetahuan dan keterampilan praktis, 
              generasi muda dapat lebih mandiri, produktif, dan berkontribusi positif bagi masyarakat.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Visi Kami</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Menjadi platform pembelajaran keterampilan DIY terdepan yang memberdayakan setiap anggota 
                Karang Taruna untuk memiliki kompetensi praktis yang berguna dalam kehidupan sehari-hari.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-red-50 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Misi Kami</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Menyediakan tutorial berkualitas tinggi yang mudah dipahami</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Meningkatkan keterampilan teknis generasi muda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Mendukung kemandirian ekonomi melalui keterampilan praktis</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Kolaboratif</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Membangun komunitas yang saling mendukung dan berbagi pengetahuan.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Praktis</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Fokus pada keterampilan yang langsung dapat diterapkan dalam kehidupan nyata.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Berkualitas</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Menyediakan konten tutorial yang terverifikasi dan mudah dipahami.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Inklusif</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Terbuka untuk semua tingkat keahlian, dari pemula hingga mahir.
                </p>
              </div>
            </div>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apa yang Kami Tawarkan</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Tutorial Langkah demi Langkah</h3>
                  <p className="text-sm text-gray-600">
                    Panduan detail dengan instruksi yang jelas dan mudah diikuti untuk berbagai proyek DIY.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Konten Video & Artikel</h3>
                  <p className="text-sm text-gray-600">
                    Berbagai format konten untuk memenuhi preferensi belajar yang berbeda-beda.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Tracking Progress Belajar</h3>
                  <p className="text-sm text-gray-600">
                    Sistem yang membantu Anda melacak kemajuan pembelajaran dan tutorial yang telah diselesaikan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Kategori Beragam</h3>
                  <p className="text-sm text-gray-600">
                    Dari plambing, listrik, pengecatan, hingga pertukangan kayu - semua ada di satu tempat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-red-600 to-yellow-600 rounded-lg shadow-sm p-6 sm:p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Siap Memulai Perjalanan Belajar Anda?</h2>
            <p className="mb-6 text-red-50">
              Bergabunglah dengan ribuan anggota Karang Taruna lainnya yang telah meningkatkan keterampilan mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => onNavigate('register')}
                className="bg-white text-red-600 hover:bg-gray-100"
                size="lg"
              >
                Daftar Sekarang
              </Button>
              <Button
                onClick={() => onNavigate('home')}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                size="lg"
              >
                Jelajahi Tutorial
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
