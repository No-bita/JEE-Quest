import React, { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';
import PaymentModal from "@/components/PaymentModal";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get('paperId');
  const paperTitle = searchParams.get('title') || 'JEE Papers';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showPaidButton, setShowPaidButton] = useState(false);

  const handlePayNowClick = (type: "single") => {
    setQrCodeUrl("/images/GooglePay_QR.png");
    setShowPaidButton(true);
    setIsModalOpen(true);
  };

  // Grant access to single paper (local logic, can be extended to backend)
  const grantPaperAccess = async () => {
    if (!paperId) return;
    let paidPapers = JSON.parse(localStorage.getItem('paidPapers') || '[]');
    if (!paidPapers.includes(paperId)) {
      paidPapers.push(paperId);
      localStorage.setItem('paidPapers', JSON.stringify(paidPapers));
    }
    setIsModalOpen(false);
    setTimeout(() => navigate(`/practice/${paperId}`), 1000);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen" style={{ backgroundColor: '#FAFBF6' }}>
        <div className="max-w-2xl mx-auto pt-32 px-2 md:px-0">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-3">Choose Your Study Plan</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access premium JEE practice materials to boost your preparation and ace your exams.
            </p>
          </div>

          <div className="flex justify-center mb-16">
            {/* Individual Paper Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
              {/* Show user what paper they are buying */}
              <div className="mb-4 p-4 rounded-lg border border-primary bg-[#F5F3FF] text-center">
                <div className="text-base text-muted-foreground">You are about to buy:</div>
                <div className="text-lg font-semibold text-primary mt-1">
                  {(() => {
                    // Try to parse the paperTitle for year, date, and shift
                    // Accepts formats like 'JEE Mains 2025 - Morning Shift' or 'JEE Mains 2025 - Morning Shift (Jan 22, 2025)'
                    const regex = /(JEE Mains|JEE Main|JEE)\s*(\d{4})\s*-\s*([A-Za-z ]+)(?:\s*\(([^)]+)\))?/;
                    const match = regex.exec(paperTitle);
                    if (match) {
                      const [, exam, year, shift, dateFromTitle] = match;
                      // Prefer date from title if present, else fallback to search param
                      const date = dateFromTitle || (searchParams.get('date'));
                      if (date) {
                        return `${exam} ${date} - ${shift.trim()}`;
                      } else {
                        return `${exam} ${year} - ${shift.trim()}`;
                      }
                    }
                    // Fallback to original title
                    return paperTitle;
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#D6CCFF] rounded-full p-3 flex items-center justify-center">
                  <CreditCard size={28} color="#7C3AED" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Single Paper Access</h2>
                  <p className="text-sm text-muted-foreground">
                    Get access to individual papers of your choice.
                  </p>
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-primary mb-1">₹21
                  <span className="text-base font-normal text-muted-foreground ml-1">/ paper</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={18} />
                  <span className="text-base">Full access to the selected paper</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={18} />
                  <span className="text-base">Detailed solutions & explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={18} />
                  <span className="text-base">Performance tracking for this paper</span>
                </div>
              </div>
              <Button
                className="w-full rounded-full bg-primary text-white font-semibold text-lg py-3 mt-2 shadow hover:bg-primary/90 transition"
                onClick={() => handlePayNowClick("single")}
                size="lg"
              >
                Pay Now
              </Button>
            </div>
          </div>



          
          <div className="text-center mb-16">
            <Button 
              variant="outline" 
              onClick={() => navigate('/papers')}
            >
              Back to Papers
            </Button>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qrCodeUrl={qrCodeUrl}
      >
        {showPaidButton && (
          <div className="mt-4 flex justify-center">
            <Button className="bg-primary text-white" onClick={grantPaperAccess}>
              I've Paid
            </Button>
          </div>
        )}
      </PaymentModal>
    </>
  );
};

export default Pricing;
