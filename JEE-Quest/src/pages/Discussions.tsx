import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search, MessageCircle, Star } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

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
    title: 'Doubt in Integration (Maths)',
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
          <Button className="flex items-center gap-2 bg-[#5BB98C] hover:bg-[#4aa97a] text-white rounded-xl px-4 py-2 shadow">
            <Plus size={18} /> Ask a Question
          </Button>
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
              <Card key={thread.id} className={`flex items-start gap-4 p-6 rounded-xl border shadow-sm ${thread.pinned ? 'border-[#FFB800] bg-yellow-50/40' : ''}`}>
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
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Discussions;
