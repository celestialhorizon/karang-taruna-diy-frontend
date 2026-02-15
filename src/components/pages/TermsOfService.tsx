import { Header } from '../Header';
import { Footer } from '../Footer';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
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
        title="Syarat & Ketentuan"
        subtitle="Terakhir diperbarui: 10 Februari 2026"
      />

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Penerimaan Ketentuan</h2>
            <p className="text-gray-900 leading-relaxed">
              Dengan mengakses dan menggunakan Platform Tutorial DIY Karang Taruna ("Platform"), Anda menyetujui 
              untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, 
              harap jangan menggunakan Platform kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Deskripsi Layanan</h2>
            <p className="text-gray-900 leading-relaxed">
              Platform kami menyediakan tutorial pertukangan dan keterampilan DIY (Do It Yourself) untuk anggota 
              Karang Taruna. Layanan mencakup akses ke konten video, artikel, panduan langkah demi langkah, 
              dan sistem tracking progress pembelajaran.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pendaftaran Akun</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Untuk mengakses fitur lengkap Platform, Anda harus:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Berusia minimal 17 tahun atau memiliki izin orang tua/wali</li>
              <li>Memberikan informasi yang akurat dan lengkap saat pendaftaran</li>
              <li>Menjaga kerahasiaan password dan keamanan akun Anda</li>
              <li>Bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
              <li>Segera memberi tahu kami jika terjadi penggunaan tidak sah pada akun Anda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Penggunaan Platform yang Dapat Diterima</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Anda setuju untuk TIDAK:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Menggunakan Platform untuk tujuan ilegal atau tidak sah</li>
              <li>Mendistribusikan atau menjual kembali konten tutorial tanpa izin</li>
              <li>Mengunggah malware, virus, atau kode berbahaya lainnya</li>
              <li>Mencoba mengakses area yang dibatasi dari Platform</li>
              <li>Mengganggu atau merusak integritas atau kinerja Platform</li>
              <li>Menyamar sebagai orang lain atau entitas lain</li>
              <li>Mengumpulkan informasi pengguna lain tanpa izin</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Hak Kekayaan Intelektual</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Semua konten di Platform, termasuk namun tidak terbatas pada:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Teks, grafik, logo, ikon, gambar, video, dan audio</li>
              <li>Kompilasi konten dan perangkat lunak</li>
              <li>Desain interface dan tata letak</li>
            </ul>
            <p className="text-gray-900 leading-relaxed mt-3">
              adalah milik Platform Tutorial DIY Karang Taruna dan dilindungi oleh hukum hak cipta Indonesia 
              dan internasional. Anda diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dialihkan 
              untuk mengakses dan menggunakan Platform untuk tujuan pembelajaran pribadi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Konten Pengguna</h2>
            <p className="text-gray-900 leading-relaxed">
              Saat ini Platform tidak memungkinkan pengguna untuk mengunggah konten. Jika fitur ini ditambahkan 
              di masa depan, ketentuan penggunaan konten pengguna akan diperbarui di sini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Penafian</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Platform ini disediakan "sebagaimana adanya" tanpa jaminan apa pun. Kami tidak menjamin:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-900 ml-4">
              <li>Platform akan selalu tersedia atau bebas dari kesalahan</li>
              <li>Informasi dalam tutorial selalu akurat, lengkap, atau terkini</li>
              <li>Hasil spesifik dari penggunaan tutorial</li>
            </ul>
            <p className="text-gray-900 leading-relaxed mt-3 font-semibold">
              PENTING: Tutorial pertukangan melibatkan penggunaan alat dan bahan yang berpotensi berbahaya. 
              Selalu gunakan alat pelindung diri yang sesuai dan ikuti prosedur keselamatan. Kami tidak 
              bertanggung jawab atas cedera atau kerusakan yang terjadi saat mengikuti tutorial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Batasan Tanggung Jawab</h2>
            <p className="text-gray-900 leading-relaxed">
              Sejauh diizinkan oleh hukum, kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, 
              insidental, konsekuensial, atau khusus yang timbul dari penggunaan atau ketidakmampuan menggunakan 
              Platform, termasuk namun tidak terbatas pada cedera fisik, kehilangan data, atau kehilangan keuntungan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Penangguhan dan Penghentian</h2>
            <p className="text-gray-900 leading-relaxed">
              Kami berhak untuk menangguhkan atau menghentikan akses Anda ke Platform, dengan atau tanpa 
              pemberitahuan, jika kami yakin Anda telah melanggar Syarat dan Ketentuan ini atau terlibat 
              dalam aktivitas yang merugikan Platform atau pengguna lain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Perubahan Layanan dan Ketentuan</h2>
            <p className="text-gray-900 leading-relaxed">
              Kami berhak untuk memodifikasi atau menghentikan Platform atau bagian mana pun darinya, 
              dengan atau tanpa pemberitahuan. Kami juga dapat memperbarui Syarat dan Ketentuan ini dari 
              waktu ke waktu. Penggunaan berkelanjutan Platform setelah perubahan merupakan penerimaan Anda 
              terhadap ketentuan yang direvisi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Hukum yang Berlaku</h2>
            <p className="text-gray-900 leading-relaxed">
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
              Setiap perselisihan yang timbul dari atau terkait dengan ketentuan ini akan diselesaikan 
              melalui pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Pemisahan</h2>
            <p className="text-gray-900 leading-relaxed">
              Jika ada ketentuan dalam Syarat dan Ketentuan ini yang dianggap tidak sah atau tidak dapat 
              diberlakukan, ketentuan tersebut akan dihapus dan ketentuan yang tersisa akan tetap berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Hubungi Kami</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm text-gray-900">
              <p><strong>Email:</strong> legal@karangtarunadiy.id</p>
              <p><strong>Telepon:</strong> +62 812-3456-7890</p>
              <p><strong>Alamat:</strong> Jakarta, Indonesia</p>
            </div>
          </section>

          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Perhatian:</strong> Dengan menggunakan Platform ini, Anda mengakui bahwa Anda telah 
              membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini.
            </p>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}