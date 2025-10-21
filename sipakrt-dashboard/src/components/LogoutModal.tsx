import { LogOut } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log('Logging out...');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-0 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#007BFF] to-[#0056d2] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(0,123,255,0.3)]">
            <LogOut className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-gray-800 mb-3">Yakin ingin keluar dari SIPAKRT?</h3>
          <p className="text-gray-500 mb-8">Anda dapat masuk kembali kapan saja</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl shadow-[0_4px_16px_rgba(0,123,255,0.3)]"
            >
              Keluar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
