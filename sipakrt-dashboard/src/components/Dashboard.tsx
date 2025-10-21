import { FileText, Wallet, Shield, Bell, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const kasData = [
  { bulan: 'Jan', saldo: 4500000 },
  { bulan: 'Feb', saldo: 5200000 },
  { bulan: 'Mar', saldo: 4800000 },
  { bulan: 'Apr', saldo: 6100000 },
  { bulan: 'Mei', saldo: 5900000 },
  { bulan: 'Jun', saldo: 6500000 },
];

const pengumuman = [
  { id: 1, title: 'Gotong Royong Minggu Depan', date: '25 Okt 2025', tag: 'Kegiatan' },
  { id: 2, title: 'Pembayaran Iuran Bulan November', date: '20 Okt 2025', tag: 'Keuangan' },
  { id: 3, title: 'Jadwal Ronda Telah Diperbarui', date: '18 Okt 2025', tag: 'Keamanan' },
];

const pengaduan = [
  { id: 1, title: 'Lampu jalan mati di Gang 3', status: 'Diproses', color: 'bg-orange-400' },
  { id: 2, title: 'Sampah belum diangkut 2 hari', status: 'Baru', color: 'bg-blue-400' },
  { id: 3, title: 'Jalan berlubang perlu perbaikan', status: 'Selesai', color: 'bg-green-400' },
];

const rondaToday = [
  { name: 'Ahmad', avatar: 'Ahmad', time: '20:00 - 22:00' },
  { name: 'Bambang', avatar: 'Bambang', time: '22:00 - 00:00' },
  { name: 'Dedi', avatar: 'Dedi', time: '00:00 - 02:00' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-[#007BFF] to-[#0056d2] text-white rounded-2xl shadow-[0_8px_32px_rgba(0,123,255,0.2)] border-0 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white mb-2">Selamat Datang di SIPAKRT</h2>
            <p className="text-blue-100">
              RT 03 / RW 05 • Kelurahan Sejahtera, Kota Harmoni
            </p>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🏠</div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 ease-out hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#007BFF]" />
            </div>
            <div>
              <p className="text-2xl text-gray-800">3</p>
              <p className="text-sm text-gray-500">Surat Diajukan</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(200,230,201,0.3)] transition-all duration-300 ease-out hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl text-gray-800">1</p>
              <p className="text-sm text-gray-500">Tagihan Aktif</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(200,200,255,0.3)] transition-all duration-300 ease-out hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl text-gray-800">2</p>
              <p className="text-sm text-gray-500">Jadwal Ronda</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(255,235,150,0.3)] transition-all duration-300 ease-out hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl text-gray-800">5</p>
              <p className="text-sm text-gray-500">Pengumuman</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kas RT Chart */}
        <Card className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-800 mb-1">Ringkasan Kas RT</h3>
              <p className="text-sm text-gray-500">Trend 6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">+12%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={kasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FB" />
              <XAxis dataKey="bulan" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="#007BFF" 
                strokeWidth={3}
                dot={{ fill: '#007BFF', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Jadwal Ronda */}
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#007BFF]" />
            <h3 className="text-gray-800">Jadwal Ronda Hari Ini</h3>
          </div>
          <div className="space-y-4">
            {rondaToday.map((person, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB] hover:bg-blue-100 transition-colors">
                <Avatar className="w-10 h-10 ring-2 ring-white">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.avatar}`} />
                  <AvatarFallback className="bg-[#007BFF] text-white">{person.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.time}</p>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pengumuman */}
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800">Pengumuman Terbaru</h3>
            <button className="text-sm text-[#007BFF] hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {pengumuman.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-xl border border-gray-100 hover:border-[#007BFF] hover:bg-[#E8F1FB] transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-800 group-hover:text-[#007BFF]">{item.title}</p>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-[#007BFF] hover:bg-blue-100">
                    {item.tag}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Pengaduan */}
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800">Pengaduan Terakhir</h3>
            <button className="text-sm text-[#007BFF] hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {pengaduan.map((item) => (
              <div 
                key={item.id} 
                className="relative p-4 pl-6 rounded-xl border border-gray-100 hover:border-[#007BFF] hover:bg-[#E8F1FB] transition-all duration-300 cursor-pointer"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${item.color}`} />
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800">{item.title}</p>
                  <Badge variant="outline" className="text-xs whitespace-nowrap ml-2">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;

