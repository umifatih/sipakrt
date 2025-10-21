'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TextField from '@/components/TextField';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Profil Saya</h2>
      <Card className="p-5">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <TextField label="Nama Lengkap" defaultValue="Andi Saputra" />
            <TextField label="Email" defaultValue="andi@mail.com" />
            <TextField label="No. HP" defaultValue="0812-xxx-xxx" />
            <TextField label="Alamat" defaultValue="Blok A3 No.12" />
          </div>
          <div className="grid gap-3">
            <TextField label="NIK" defaultValue="1371•••••••001" disabled hint="Tidak dapat diubah" />
            <TextField label="No. KK" defaultValue="1371•••••••1234" disabled hint="Tidak dapat diubah" />
            <TextField label="Status Kependudukan" defaultValue="Tetap" disabled />
          </div>
        </div>
        <div className="mt-6">
          <Button variant="primary">Simpan Perubahan</Button>
        </div>
      </Card>
    </div>
  );
}
