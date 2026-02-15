import { Header } from '../Header';
import { Footer } from '../Footer';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
        title="Kebijakan Privasi"
        subtitle="Terakhir diperbarui: 10 Februari 2026"
      />

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Pendahuluan</h2>
            <p className="text-gray-900 leading-relaxed">
              Selamat datang di Platform Tutorial DIY Karang Taruna ("kami", "milik kami"). Kami berkomitmen untuk melindungi 
              privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi 
              informasi pribadi Anda saat menggunakan platform kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Informasi yang Kami Kumpulkan</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Nama lengkap dan username</li>
              <li>Alamat email</li>
              <li>Nomor telepon (opsional)</li>
              <li>Nama Karang Taruna dan wilayah domisili</li>
              <li>Informasi profil seperti minat DIY, tingkat keahlian, dan peran anggota</li>
              <li>Data progress pembelajaran dan aktivitas di platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Penggunaan Informasi</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Kami menggunakan informasi yang dikumpulkan untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Menyediakan dan memelihara layanan platform</li>
              <li>Mengelola akun dan autentikasi pengguna</li>
              <li>Melacak progress pembelajaran Anda</li>
              <li>Memberikan rekomendasi konten yang relevan</li>
              <li>Meningkatkan pengalaman pengguna</li>
              <li>Mengirim notifikasi terkait tutorial dan pembaruan platform</li>
              <li>Menganalisis penggunaan platform untuk perbaikan layanan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Penyimpanan Data</h2>
            <p className="text-gray-900 leading-relaxed">
              Data Anda saat ini disimpan secara lokal di browser Anda menggunakan localStorage. Kami tidak menyimpan 
              informasi pribadi Anda di server eksternal. Data akan tetap ada di perangkat Anda hingga Anda menghapus 
              cache browser atau data aplikasi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Keamanan Data</h2>
            <p className="text-gray-900 leading-relaxed">
              Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, 
              penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi melalui internet 
              atau penyimpanan elektronik yang 100% aman.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Berbagi Informasi</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga, kecuali:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Dengan persetujuan eksplisit Anda</li>
              <li>Untuk mematuhi kewajiban hukum</li>
              <li>Untuk melindungi hak, properti, atau keamanan kami dan pengguna lain</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Hak Pengguna</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Mengakses informasi pribadi Anda</li>
              <li>Memperbarui atau mengoreksi informasi Anda</li>
              <li>Menghapus akun dan data Anda</li>
              <li>Menolak penggunaan informasi Anda untuk tujuan tertentu</li>
              <li>Mengunduh data Anda (portabilitas data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookie dan Teknologi Pelacakan</h2>
            <p className="text-gray-900 leading-relaxed">
              Platform kami menggunakan localStorage untuk menyimpan preferensi dan data sesi Anda. Ini membantu 
              kami memberikan pengalaman yang lebih baik dan personal. Anda dapat menghapus data ini kapan saja 
              melalui pengaturan browser Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Privasi Anak-anak</h2>
            <p className="text-gray-900 leading-relaxed">
              Platform kami ditujukan untuk anggota Karang Taruna yang umumnya berusia 17 tahun ke atas. Jika Anda 
              berusia di bawah 17 tahun, harap gunakan platform ini dengan pengawasan orang tua atau wali.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Perubahan Kebijakan</h2>
            <p className="text-gray-900 leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini 
              dengan tanggal "Terakhir diperbarui" yang diperbarui. Kami mendorong Anda untuk meninjau kebijakan ini 
              secara berkala.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Hubungi Kami</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm text-gray-900">
              <p><strong>Email:</strong> privacy@karangtarunadiy.id</p>
              <p><strong>Telepon:</strong> +62 812-3456-7890</p>
              <p><strong>Alamat:</strong> Jakarta, Indonesia</p>
            </div>
          </section>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}