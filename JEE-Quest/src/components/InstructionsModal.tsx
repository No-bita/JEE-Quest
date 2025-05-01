import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InstructionsModalProps {
  open: boolean;
  onProceed: () => void;
}

const instructionsList = [
  'To answer a question, click on the question number in the Question Palette, or use Save & Next/Mark for Review & Next.',
  'To select your answer, click on one of the options. To deselect, click again or use the Clear Response button.',
  'To change your answer, select another option.',
  'You MUST click Save & Next to save your answer.',
  'To mark for review, click Mark for Review & Next.',
  'After last question in a section, Save & Next will take you to the next section.',
  'You can shuffle between sections/questions during the exam time.',
  'You must not carry any prohibited gadgets (mobile, bluetooth, etc.) into the examination hall.',
  'Non-adherence to instructions may result in disqualification.'
];

const InstructionsModal: React.FC<InstructionsModalProps> = ({ open, onProceed }) => {
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <Card className="max-w-xl w-full shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">Please read the instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside mb-4 text-left">
            {instructionsList.map((inst, idx) => (
              <li key={idx} className="mb-2">{inst}</li>
            ))}
          </ul>
          <div className="flex items-center mb-4">
            <Checkbox id="instructions-read" checked={checked} onCheckedChange={value => setChecked(value === true)} className="rounded-sm" />
            <label htmlFor="instructions-read" className="ml-2 text-sm">
              I have read and understood the instructions.
            </label>
          </div>
          <Button
            className="w-full rounded-full bg-[#1D9A6C] text-white hover:bg-[#157856] transition-colors duration-150"
            style={{ fontWeight: 400 }}
            onClick={onProceed}
            disabled={!checked}
          >
            Start Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructionsModal;
