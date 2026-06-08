import { useState } from 'react';
import { Camera, Edit2, Save, X } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

export function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '0812-3456-7890',
    address: 'Jl. Melati No. 15, RT 03/RW 05',
  });

  const handleSave = () => {
    toast.success('Profil berhasil diperbarui!');
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative group mb-4">
            <Avatar className="w-32 h-32 ring-4 ring-[#007BFF] ring-offset-4">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" />
              <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#0056d2] text-white text-3xl">BS</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#007BFF] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <h2 className="text-gray-800 mb-1">{formData.name}</h2>
          <p className="text-gray-500">RT 03 / RW 05 • Kelurahan Sejahtera</p>
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            className="mt-4 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl shadow-[0_4px_16px_rgba(0,123,255,0.3)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,123,255,0.4)]"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-[#E8F1FB]">
            <p className="text-sm text-gray-500 mb-1">NIK</p>
            <p className="text-gray-800">3201234567891234</p>
          </div>
          <div className="p-4 rounded-xl bg-[#E8F1FB]">
            <p className="text-sm text-gray-500 mb-1">No. KK</p>
            <p className="text-gray-800">3201234567890001</p>
          </div>
          <div className="p-4 rounded-xl bg-[#E8F1FB]">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-gray-800">{formData.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#E8F1FB]">
            <p className="text-sm text-gray-500 mb-1">No. Telepon</p>
            <p className="text-gray-800">{formData.phone}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#E8F1FB] md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Alamat</p>
            <p className="text-gray-800">{formData.address}</p>
          </div>
        </div>
      </Card>

      {/* Additional Info Card */}
      <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
        <h3 className="text-gray-800 mb-4">Informasi Keamanan</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="text-sm text-gray-800">✅ Login terakhir: Senin, 20 Oktober 2025, 14:30</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-800">🔐 Password terakhir diubah: 15 September 2025</p>
          </div>
          <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-[#E8F1FB] hover:border-[#007BFF]">
            Ubah Password
          </Button>
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#007BFF] focus:ring-[#007BFF]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#007BFF] focus:ring-[#007BFF]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#007BFF] focus:ring-[#007BFF]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#007BFF] focus:ring-[#007BFF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 rounded-xl border-gray-200"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
