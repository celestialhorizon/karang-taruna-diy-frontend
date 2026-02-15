import { Header } from '../Header';
import { Footer } from '../Footer';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

interface FAQProps {
  onNavigate: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQ({ onNavigate }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('diy_current_user') || 'null');

  const faqData: FAQItem[] = [
    {
      category: 'Akun & Registrasi',
      question: 'Bagaimana cara mendaftar di platform ini?',
      answer: 'Klik tombol "Daftar" di halaman utama, lalu isi formulir pendaftaran dengan informasi lengkap seperti nama, email, username, password, nama Karang Taruna, dan wilayah domisili. Setelah selesai, klik "Daftar" dan Anda dapat langsung login.'
    },
    {
      category: 'Akun & Registrasi',
      question: 'Apakah saya harus mendaftar untuk melihat tutorial?',
      answer: 'Tidak. Anda dapat menjelajahi daftar tutorial tanpa login. Namun, untuk mengakses detail tutorial lengkap, mengikuti langkah-langkah, dan melacak progress belajar, Anda harus login terlebih dahulu.'
    },
    {
      category: 'Akun & Registrasi',
      question: 'Apakah pendaftaran gratis?',
      answer: 'Ya, pendaftaran dan akses ke semua tutorial di platform ini sepenuhnya gratis untuk anggota Karang Taruna.'
    },
    {
      category: 'Tutorial & Pembelajaran',
      question: 'Berapa banyak tutorial yang tersedia?',
      answer: 'Saat ini kami memiliki berbagai tutorial dalam kategori Plambing, Listrik, Pengecatan, Pertukangan Kayu, dan Perawatan. Kami terus menambahkan konten baru secara berkala.'
    },
    {
      category: 'Tutorial & Pembelajaran',
      question: 'Bagaimana cara melacak progress belajar saya?',
      answer: 'Setelah login, setiap kali Anda menyelesaikan langkah dalam tutorial, progress akan otomatis tersimpan. Anda dapat melihat semua tutorial yang sedang diikuti dan yang sudah selesai di halaman "Pembelajaran Saya".'
    },
    {
      category: 'Tutorial & Pembelajaran',
      question: 'Apakah saya bisa mengulang tutorial yang sudah selesai?',
      answer: 'Ya, Anda dapat membuka kembali dan mempelajari ulang tutorial yang sudah selesai kapan saja. Progress akan tetap tersimpan.'
    },
    {
      category: 'Tutorial & Pembelajaran',
      question: 'Bagaimana cara menemukan tutorial yang sesuai dengan tingkat keahlian saya?',
      answer: 'Gunakan filter "Tingkat Kesulitan" di halaman utama untuk menyaring tutorial berdasarkan level Pemula, Menengah, atau Lanjutan. Anda juga dapat menggunakan filter status progress untuk melihat tutorial yang belum dimulai, sedang berlangsung, atau sudah selesai.'
    },
    {
      category: 'Fitur Platform',
      question: 'Apa saja fitur filter dan sorting yang tersedia?',
      answer: 'Anda dapat memfilter tutorial berdasarkan kategori, tingkat kesulitan, dan status progress (untuk user yang login). Anda juga dapat mengurutkan tutorial berdasarkan durasi (terpendek/terpanjang) dan waktu pembuatan (terbaru/terlama).'
    },
    {
      category: 'Fitur Platform',
      question: 'Apakah data saya aman?',
      answer: 'Ya. Saat ini data Anda disimpan secara lokal di browser Anda menggunakan localStorage. Kami tidak menyimpan informasi pribadi di server eksternal. Silakan baca Kebijakan Privasi kami untuk informasi lebih detail.'
    },
    {
      category: 'Fitur Platform',
      question: 'Apakah platform ini bisa diakses dari smartphone?',
      answer: 'Ya, platform kami menggunakan desain mobile-first yang responsive dan dapat diakses dengan baik dari smartphone, tablet, maupun desktop.'
    },
    {
      category: 'Teknis',
      question: 'Browser apa yang didukung?',
      answer: 'Platform kami mendukung browser modern seperti Google Chrome, Mozilla Firefox, Safari, dan Microsoft Edge versi terbaru.'
    },
    {
      category: 'Teknis',
      question: 'Bagaimana jika saya lupa password?',
      answer: 'Saat ini fitur reset password belum tersedia karena data disimpan secara lokal. Pastikan Anda mengingat password Anda atau mencatatnya di tempat yang aman.'
    },
    {
      category: 'Teknis',
      question: 'Data saya hilang setelah clear cache browser, kenapa?',
      answer: 'Karena data disimpan di localStorage browser, menghapus cache atau data browser akan menghapus data akun dan progress Anda. Pastikan untuk tidak menghapus data browser jika ingin mempertahankan progress.'
    },
    {
      category: 'Konten',
      question: 'Apakah saya bisa request tutorial tertentu?',
      answer: 'Ya! Kami sangat terbuka terhadap saran konten. Hubungi kami melalui halaman Kontak untuk mengajukan request tutorial.'
    },
    {
      category: 'Konten',
      question: 'Apakah konten tutorial aman untuk dipraktikkan?',
      answer: 'Semua tutorial kami dibuat dengan mempertimbangkan aspek keselamatan. Namun, pekerjaan pertukangan memiliki risiko. Selalu gunakan alat pelindung diri (APD) yang sesuai, ikuti instruksi keselamatan, dan bertindak dengan hati-hati.'
    }
  ];

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
        title="FAQ"
        subtitle="Pertanyaan yang Sering Diajukan"
      />

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700">
              Tidak menemukan jawaban yang Anda cari? Silakan{' '}
              <button
                onClick={() => onNavigate('contact')}
                className="text-red-600 font-medium hover:underline"
              >
                hubungi kami
              </button>{' '}
              dan kami akan dengan senang hati membantu Anda.
            </p>
          </div>

          {/* FAQ by Category */}
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-yellow-600 px-6 py-3">
                <h2 className="font-semibold text-white">{category}</h2>
              </div>
              <div className="divide-y">
                {faqData
                  .filter((item) => item.category === category)
                  .map((item) => {
                    const globalIndex = faqData.indexOf(item);
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <div key={globalIndex} className="border-gray-200">
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-900 flex-1">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="bg-gradient-to-r from-red-50 to-yellow-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Masih Ada Pertanyaan?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Tim kami siap membantu Anda. Jangan ragu untuk menghubungi kami.
            </p>
            <Button
              onClick={() => onNavigate('contact')}
              className="bg-red-600 hover:bg-red-700"
            >
              Hubungi Kami
            </Button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
