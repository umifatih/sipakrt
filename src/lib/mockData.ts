export const ANNOUNCEMENTS = [
  { id: '1', title: 'Rapat Bulanan RT 05', date: '20 Okt 2025', category: 'Rapat' },
  { id: '2', title: 'Kerja Bakti Sabtu', date: '25 Okt 2025', category: 'Kerja Bakti' },
  { id: '3', title: 'Perayaan 17 Agustus', date: '17 Agu 2026', category: 'Perayaan' },
];

export const REPORTS = [
  { id: '1', type: 'Keamanan', status: 'Diproses', excerpt: 'Lampu jalan mati di blok C' },
  { id: '2', type: 'Sosial', status: 'Selesai', excerpt: 'Bantuan lansia telah disalurkan' },
  { id: '3', type: 'Kritik', status: 'Baru', excerpt: 'Perbaikan saluran air' },
];

export const FINANCE = {
  balance: 18500000,
  incomeThisMonth: 5200000,
  expenseThisMonth: 3100000,
  trend: [40, 42, 38, 45, 50, 48, 55, 60, 58, 66],
  table: [
    { date: '01/10', desc: 'Iuran Bulanan', amount: +1500000 },
    { date: '05/10', desc: 'Donasi', amount: +1000000 },
    { date: '09/10', desc: 'Biaya Kebersihan', amount: -500000 },
  ],
};
