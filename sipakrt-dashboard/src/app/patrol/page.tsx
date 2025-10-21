'use client';
import { useState } from 'react';
import { Shield, Calendar as CalendarIcon, Moon, Users, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

const schedules = [
  {
    week: 'Minggu 1 (20-26 Okt)',
    shifts: [
      { day: 'Senin', date: '20 Okt', shift1: { name: 'Ahmad', time: '20:00-00:00' }, shift2: { name: 'Bambang', time: '00:00-04:00' } },
      { day: 'Selasa', date: '21 Okt', shift1: { name: 'Dedi', time: '20:00-00:00' }, shift2: { name: 'Eko', time: '00:00-04:00' } },
      { day: 'Rabu', date: '22 Okt', shift1: { name: 'Fahmi', time: '20:00-00:00' }, shift2: { name: 'Gunawan', time: '00:00-04:00' } },
      { day: 'Kamis', date: '23 Okt', shift1: { name: 'Hendra', time: '20:00-00:00' }, shift2: { name: 'Irfan', time: '00:00-04:00' } },
      { day: 'Jumat', date: 'Anda', shift1: { name: 'Budi Santoso', time: '20:00-00:00', isYou: true }, shift2: { name: 'Ahmad', time: '00:00-04:00' } },
      { day: 'Sabtu', date: '25 Okt', shift1: { name: 'Bambang', time: '20:00-00:00' }, shift2: { name: 'Dedi', time: '00:00-04:00' } },
      { day: 'Minggu', date: '26 Okt', shift1: { name: 'Eko', time: '20:00-00:00' }, shift2: { name: 'Fahmi', time: '00:00-04:00' } },
    ],
  },
  {
    week: 'Minggu 2 (27 Okt - 2 Nov)',
    shifts: [
      { day: 'Senin', date: '27 Okt', shift1: { name: 'Gunawan', time: '20:00-00:00' }, shift2: { name: 'Hendra', time: '00:00-04:00' } },
      { day: 'Selasa', date: '28 Okt', shift1: { name: 'Irfan', time: '20:00-00:00' }, shift2: { name: 'Ahmad', time: '00:00-04:00' } },
      { day: 'Rabu', date: '29 Okt', shift1: { name: 'Bambang', time: '20:00-00:00' }, shift2: { name: 'Dedi', time: '00:00-04:00' } },
      { day: 'Kamis', date: '30 Okt', shift1: { name: 'Eko', time: '20:00-00:00' }, shift2: { name: 'Fahmi', time: '00:00-04:00' } },
      { day: 'Jumat', date: '31 Okt', shift1: { name: 'Gunawan', time: '20:00-00:00' }, shift2: { name: 'Hendra', time: '00:00-04:00' } },
      { day: 'Sabtu', date: '1 Nov', shift1: { name: 'Irfan', time: '20:00-00:00' }, shift2: { name: 'Ahmad', time: '00:00-04:00' } },
      { day: 'Minggu', date: '2 Nov', shift1: { name: 'Bambang', time: '20:00-00:00' }, shift2: { name: 'Dedi', time: '00:00-04:00' } },
    ],
  },
];

const swapRequests = [
  { id: 1, from: 'Budi Santoso', to: 'Ahmad', date: '24 Okt 2025', shift: '20:00-00:00', status: 'Menunggu' },
];

export function JadwalRonda() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSwapRequest = () => {
    toast.success('Permintaan tukar jadwal terkirim!');
    setIsSheetOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl shadow-[0_8px_32px_rgba(147,51,234,0.25)] border-0 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8" />
              <h2 className="text-white">Jadwal Ronda RT 03</h2>
            </div>
            <p className="text-purple-100">
              Jaga keamanan bersama untuk lingkungan yang lebih aman
            </p>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🛡️</div>
        </div>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Moon className="w-6 h-6 text-[#007BFF]" />
            </div>
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100">Jadwal Anda</Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Jadwal ronda terdekat</p>
          <p className="text-xl text-gray-800 mb-1">Jumat, 24 Oktober 2025</p>
          <p className="text-gray-600">20:00 - 00:00 WIB</p>
        </Card>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 cursor-pointer hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Perlu tukar jadwal?</p>
              <Button className="w-full bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl mt-2">
                Ajukan Tukar Jadwal
              </Button>
            </Card>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md rounded-l-2xl">
            <SheetHeader>
              <SheetTitle>Tukar Jadwal Ronda</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="p-4 rounded-xl bg-[#E8F1FB]">
                <p className="text-sm text-gray-500 mb-1">Jadwal Anda Saat Ini</p>
                <p className="text-gray-800">Jumat, 24 Oktober 2025</p>
                <p className="text-gray-600">20:00 - 00:00 WIB</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">Pilih warga untuk bertukar jadwal:</p>
                <div className="space-y-2">
                  {['Ahmad', 'Bambang', 'Dedi', 'Eko'].map((name) => (
                    <button
                      key={name}
                      onClick={handleSwapRequest}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#007BFF] hover:bg-[#E8F1FB] transition-all"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                        <AvatarFallback className="bg-[#007BFF] text-white">{name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="text-gray-800">{name}</p>
                        <p className="text-sm text-gray-500">Tersedia untuk tukar</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Swap Requests */}
      {swapRequests.length > 0 && (
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <h3 className="text-gray-800 mb-4">Permintaan Tukar Jadwal</h3>
          <div className="space-y-3">
            {swapRequests.map((request) => (
              <div 
                key={request.id}
                className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-800 mb-1">
                    Tukar dengan <span>{request.to}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.date} • {request.shift}
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100">
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <h3 className="text-gray-800 mb-4">Pilih Tanggal</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl"
          />
        </Card>

        <Card className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <h3 className="text-gray-800 mb-4">Jadwal Ronda</h3>
          <div className="space-y-6">
            {schedules.map((schedule, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-[#007BFF]" />
                  <h4 className="text-gray-700">{schedule.week}</h4>
                </div>
                <div className="space-y-2">
                  {schedule.shifts.map((shift, shiftIdx) => (
                    <div 
                      key={shiftIdx}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        shift.shift1.isYou
                          ? 'border-[#007BFF] bg-[#E8F1FB]'
                          : 'border-gray-200 hover:border-[#007BFF] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-800">{shift.day}, {shift.date}</p>
                        </div>
                        {shift.shift1.isYou && (
                          <Badge className="bg-[#007BFF] hover:bg-[#007BFF] text-white">
                            Jadwal Anda
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shift.shift1.name}`} />
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                              {shift.shift1.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-800">{shift.shift1.name}</p>
                            <p className="text-xs text-gray-500">{shift.shift1.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shift.shift2.name}`} />
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                              {shift.shift2.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-800">{shift.shift2.name}</p>
                            <p className="text-xs text-gray-500">{shift.shift2.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default JadwalRonda;