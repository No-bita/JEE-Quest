import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { X, Plus, Save, FileText } from 'lucide-react';
import imageUrlUploader from './imageUrlUploader';
import MathRenderer from './MathRenderer';

// Question interface
interface Question {
  id: number;
  text: string;
  imageUrl: string;
  options: { id: string; text: string; }[];
  correctOption: string;
  subject: string;
  latex?: string;
}

interface QuestionEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paperId: string;
  onSave: (questions: Question[]) => void;
  initialQuestions?: Question[];
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  open,
  onOpenChange,
  paperId,
  onSave,
  initialQuestions = []
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [latexPreview, setLatexPreview] = useState<string>('');
  
  useEffect(() => {
    if (initialQuestions.length === 0) {
      setQuestions([{
        id: 1,
        text: '',
        imageUrl: '',
        options: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
        correctOption: 'A',
        subject: 'Physics',
        latex: ''
      }]);
    } else {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);
  
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  
  useEffect(() => {
    if (currentQuestion?.latex) {
      setLatexPreview(currentQuestion.latex);
    } else {
      setLatexPreview('');
    }
  }, [currentQuestionIndex, currentQuestion?.latex]);
  
  const handleQuestionChange = (field: keyof Question, value: any) => {
    setQuestions(questions.map((q, i) => 
      i === currentQuestionIndex ? { ...q, [field]: value } : q
    ));
  };
  
  const handleOptionChange = (optionId: string, field: 'text' | 'imageUrl', value: string) => {
    setQuestions(questions.map((q, i) => 
      i === currentQuestionIndex ? {
        ...q,
        options: q.options.map(opt => 
          opt.id === optionId ? { ...opt, [field]: value } : opt
        )
      } : q
    ));
  };
  
  const addNewQuestion = () => {
    const newId = Math.max(0, ...questions.map(q => q.id)) + 1;
    const newQuestion: Question = {
      id: newId,
      text: '',
      imageUrl: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ],
      correctOption: 'A',
      subject: 'Physics',
      latex: ''
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };
  
  const removeCurrentQuestion = () => {
    if (questions.length <= 1) {
      toast.error("Cannot remove the only question");
      return;
    }
    
    const newQuestions = questions.filter((_, i) => i !== currentQuestionIndex);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(Math.min(currentQuestionIndex, newQuestions.length - 1));
  };
  
  const handleSave = () => {
    const invalidQuestions = questions.filter(
      q => !q.text || q.options.some(opt => !opt.text)
    );
    
    if (invalidQuestions.length > 0) {
      toast.error("Some questions are incomplete. Please fill all fields.");
      return;
    }
    
    onSave(questions);
    toast.success("Questions saved successfully!");
    onOpenChange(false);
  };

  const handleLatexChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const latex = e.target.value;
    setLatexPreview(latex);
    handleQuestionChange('latex', latex);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Questions</DialogTitle>
          <DialogDescription>
            Manage questions for this paper. Add, edit, or remove questions as needed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Select 
              value={currentQuestionIndex.toString()} 
              onValueChange={v => setCurrentQuestionIndex(parseInt(v))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select question" />
              </SelectTrigger>
              <SelectContent>
                {questions.map((q, i) => (
                  <SelectItem key={q.id} value={i.toString()}>
                    Question {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={removeCurrentQuestion}>
              <X size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={addNewQuestion}>
              <Plus size={16} />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="content" className="w-full mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText size={16} />
              Content
            </TabsTrigger>
            <TabsTrigger value="latex" className="flex items-center gap-2">
              <span className="font-serif italic">TeX</span>
              LaTeX
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                value={currentQuestion?.text || ''}
                onChange={e => handleQuestionChange('text', e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter the question text here..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Question Image (Optional)</Label>
              <div className="border rounded-md p-2">
                <imageUrlUploader 
                  initialimageUrl={currentQuestion?.imageUrl}
                  onimageUrlSelected={(url) => handleQuestionChange('imageUrl', url)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={currentQuestion?.subject || 'Physics'} 
                onValueChange={v => handleQuestionChange('subject', v)}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Options</Label>
              {currentQuestion?.options.map(option => (
                <div key={option.id} className="p-4 border rounded-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-md font-medium">
                      {option.id}
                    </div>
                    <Input
                      value={option.text}
                      onChange={e => handleOptionChange(option.id, 'text', e.target.value)}
                      placeholder={`Option ${option.id}`}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label>Correct Option</Label>
              <RadioGroup 
                value={currentQuestion?.correctOption || 'A'}
                onValueChange={v => handleQuestionChange('correctOption', v)}
                className="flex space-x-4"
              >
                {currentQuestion?.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`correctOption-${option.id}`} />
                    <Label htmlFor={`correctOption-${option.id}`}>{option.id}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="latex" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latex-editor">LaTeX Equation</Label>
                <Textarea
                  id="latex-editor"
                  value={currentQuestion?.latex || ''}
                  onChange={handleLatexChange}
                  className="min-h-[200px] font-mono"
                  placeholder="Enter LaTeX equation, e.g., E = mc^2"
                />
                <p className="text-xs text-muted-foreground">
                  Use LaTeX syntax for equations. The preview will update as you type.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Equation Preview</Label>
                <div className="border rounded-md p-4 min-h-[200px] flex items-center justify-center bg-slate-50">
                  {latexPreview ? (
                    <MathRenderer math={latexPreview} display={true} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      Enter LaTeX to see preview
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>LaTeX Tips</Label>
              <div className="text-sm space-y-1 p-3 bg-slate-50 rounded-md">
                <p>• Fractions: \frac{"{numerator}"}{"{denominator}"}</p>
                <p>• Powers: x^2, x^{"{a+b}"}</p>
                <p>• Square roots: \sqrt{"{x}"}, \sqrt[n]{"{x}"}</p>
                <p>• Greek letters: \alpha, \beta, \gamma, \Delta</p>
                <p>• Subscripts: x_i, x_{"{i,j}"}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Save Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionEditor;