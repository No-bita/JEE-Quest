import React from "react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string; // URL to your QR code image
  children?: React.ReactNode;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, qrCodeUrl, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Complete Your Payment</h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Scan the QR code below to complete your payment. Access will be updated shortly. 
          For any disputes, email <b>info.jeequest@gmail.com</b>.
        </p>
        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto mb-4" />
        <div className="text-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
