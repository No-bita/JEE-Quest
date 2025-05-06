import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search, MessageCircle, Star } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

const mockThreads = [
  {
    id: 1,
    title: 'How to approach Physics for JEE Advanced?',
    author: 'Ankit Sharma',
    replies: 12,
    time: '1 hour ago',
    tags: ['Physics', 'Strategy'],
    pinned: true,
  },
  {
    id: 2,
    title: 'Best books for Organic Chemistry?',
    author: 'Priya Verma',
    replies: 8,
    time: '2 hours ago',
    tags: ['Chemistry', 'Books'],
    pinned: false,
  },
  {
    id: 3,
    title: 'Doubt in Integration',
    author: 'Rahul Jain',
    replies: 5,
    time: '3 hours ago',
    tags: ['Maths', 'Doubts'],
    pinned: false,
  },
  {
    id: 4,
    title: 'How to manage time during the exam?',
    author: 'Sneha Patel',
    replies: 10,
    time: '5 hours ago',
    tags: ['Strategy', 'Time Management'],
    pinned: false,
  },
];

const Discussions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [threads, setThreads] = useState(mockThreads);
  const [showAskModal, setShowAskModal] = useState(false);
  const [askTitle, setAskTitle] = useState('');
  const [askDescription, setAskDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [askImage, setAskImage] = useState<string | null>(null);

  // Modal for viewing a thread
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);

  const handleAskSubmit = () => {
    if (!askTitle.trim()) return;
    const tagsArr = selectedTags.length ? selectedTags : ['General'];
    const newThread = {
      id: threads.length + 1,
      title: askTitle,
      author: 'You', // In real app, use logged in user
      replies: 0,
      time: 'just now',
      tags: tagsArr,
      pinned: false,
      image: askImage,
    };
    setThreads([newThread, ...threads]);
    setShowAskModal(false);
    setAskTitle('');
    setAskDescription('');
    setSelectedTags([]);
    setAskImage(null);
  };

  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(search.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-4 md:px-12 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Community Discussions</h1>
          <Dialog open={showAskModal} onOpenChange={setShowAskModal}>
  <DialogTrigger asChild>
    <Button className="flex items-center gap-2 bg-[#5BB98C] hover:bg-[#4aa97a] text-white rounded-xl px-4 py-2 shadow">
      <Plus size={18} /> Ask a Question
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-lg w-full">
    <DialogHeader>
      <DialogTitle>Ask a Question</DialogTitle>
      <DialogDescription>Share your question with the community. Be descriptive for better answers.</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 mt-2">
      <Input
        placeholder="Title (e.g. How to approach Physics for JEE Advanced?)"
        value={askTitle}
        onChange={e => setAskTitle(e.target.value)}
        className="rounded-xl"
      />
      <textarea
        className="w-full min-h-[90px] rounded-xl border border-[#E3E9E2] p-2"
        placeholder="Describe your question in detail..."
        value={askDescription}
        onChange={e => setAskDescription(e.target.value)}
      />
      {/* Image upload */}
      <div>
        <label className="block text-sm mb-1">Attach Image (optional)</label>
        <div
          className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#E3E9E2] rounded-xl py-5 px-4 bg-white hover:bg-gray-50 cursor-pointer transition"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = ev => setAskImage(ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }}
          tabIndex={0}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="absolute w-full h-full opacity-0 cursor-pointer left-0 top-0 z-10"
            aria-label="Attach image"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => setAskImage(ev.target?.result as string);
                reader.readAsDataURL(file);
              } else {
                setAskImage(null);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="z-0 pointer-events-none"
            tabIndex={-1}
          >
            {askImage ? 'Change Image' : 'Upload Image'}
          </Button>
          <span className="text-xs text-gray-500 mt-2">Drag and drop or click to select an image</span>
        </div>
        {askImage && (
          <div className="mt-2 flex flex-col items-center">
            <img src={askImage} alt="Preview" className="max-h-40 rounded-lg border" />
            <button
              type="button"
              className="block text-xs text-red-500 mt-1 hover:underline"
              onClick={() => setAskImage(null)}
            >Remove Image</button>
          </div>
        )}
      </div>
      {/* Tag Dropdown (multi-select) */}
      <div>
        <Select onValueChange={tag => {
          if (!selectedTags.includes(tag)) setSelectedTags([...selectedTags, tag]);
        }}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder={selectedTags.length ? 'Add more tags...' : 'Select tags'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Maths">Maths</SelectItem>
            <SelectItem value="Strategy">Strategy</SelectItem>
            <SelectItem value="Books">Books</SelectItem>
            <SelectItem value="Doubts">Doubts</SelectItem>
            <SelectItem value="Time Management">Time Management</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map(tag => (
            <span key={tag} className="bg-[#E3E9E2] text-xs px-2 py-0.5 rounded-full text-[#384B47] flex items-center gap-1">
              {tag}
              <button
                type="button"
                className="ml-1 text-gray-500 hover:text-red-500"
                onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button
        className="bg-[#5BB98C] hover:bg-[#4aa97a] text-white rounded-xl"
        onClick={handleAskSubmit}
        disabled={!askTitle.trim()}
      >
        Post Question
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search discussions, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border border-[#E3E9E2] shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="text-center text-gray-400 py-20">No discussions found.</div>
          ) : (
             filteredThreads.map((thread) => (
              <button
                key={thread.id}
                className={`w-full text-left focus:outline-none`}
                onClick={() => {
                  setSelectedThread(thread);
                  setShowThreadModal(true);
                }}
              >
                <Card className={`flex items-start gap-4 p-6 rounded-xl border shadow-sm transition hover:ring-2 hover:ring-[#5BB98C] cursor-pointer ${thread.pinned ? 'border-[#FFB800] bg-yellow-50/40' : ''}`}>
                  <div className="flex flex-col items-center justify-center mr-4">
                    <MessageCircle className="text-[#5BB98C] mb-1" size={22} />
                    <span className="text-xs text-gray-500">{thread.replies}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-[#232323]">{thread.title}</span>
                      {thread.pinned && <Star className="text-[#FFB800]" size={16} />}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-1">
                      {thread.tags.map((tag) => (
                        <span key={tag} className="bg-[#E3E9E2] text-xs px-2 py-0.5 rounded-full text-[#384B47]">{tag}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      By {thread.author} • {thread.time}
                    </div>
                  </div>
                </Card>
              </button>
            ))
          )}
        </div>
        {/* Thread Modal */}
        <Dialog open={showThreadModal} onOpenChange={setShowThreadModal}>
          <DialogContent className="max-w-xl w-full">
            {selectedThread && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedThread.title}</DialogTitle>
                  <DialogDescription>
                    By {selectedThread.author} • {selectedThread.time}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedThread.tags.map((tag: string) => (
                    <span key={tag} className="bg-[#E3E9E2] text-xs px-2 py-0.5 rounded-full text-[#384B47]">{tag}</span>
                  ))}
                </div>
                {selectedThread.image && (
                  <div className="mb-4">
                    <img src={selectedThread.image} alt="Question attachment" className="max-h-64 rounded-lg border mx-auto" />
                  </div>
                )}
                {/* Placeholder for replies/comments */}
                <div className="mt-4 text-gray-500 text-center py-8 border rounded-lg border-dashed">Replies and comments coming soon...</div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Discussions;
