import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import PaperCard from '@/components/PaperCard';
import Banner from '@/components/Banner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CalendarRange, LogIn, BarChart2, BookOpen, History, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import clsx from 'clsx';

const cn = clsx;

// Mock papers data
const mockPapers = [
  {
    id: 'jee2025-1',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 22, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-2',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 22, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-3',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 23, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-4',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 23, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-5',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-6',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-7',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 28, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-8',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 28, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-9',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 29, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-10',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 29, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2024-1',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-2',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-3',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 29, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-4',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 29, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-5',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 30, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-6',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 30, 2024',
    questionCount: 90,
    duration: 180,
  },  {
    id: 'jee2024-7',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 31, 2024',
    questionCount: 90,
    duration: 180,
  },  {
    id: 'jee2024-8',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 31, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-9',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Feb 01, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-10',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Feb 01, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-11',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 04, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-12',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 04, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-13',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 05, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-14',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 05, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-15',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 06, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-16',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 06, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-17',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 08, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-18',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 08, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-19',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 09, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-20',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 09, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-1',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 24, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-2',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 24, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-3',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 25, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-4',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 25, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-5',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 29, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-6',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 29, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-7',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 30, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-8',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 30, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-9',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 31, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-10',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 31, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-11',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Feb 01, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-12',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Feb 01, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2022-1',
    year: 2022,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2022-2',
    year: 2022,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2021-1',
    year: 2021,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2021-2',
    year: 2021,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2020-1',
    year: 2020,
    session: 'Session 2',
    shift: 'Shift 1',
    date: 'Sept 06, 2020',
    questionCount: 75,
    duration: 180,
  },
];

interface Question {
  id: number;
  text: string;
  imageUrl: string;
  options: { id: string; text: string; }[];
  correctOption: string;
  subject: string;
}


const mockNotifications = [
  {
    icon: <svg width="18" height="18" fill="none" stroke="#5BB98C" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
    title: 'Your test results are out! 🎉',
    time: '2 hours ago',
    read: false,
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="#5BB98C" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" /></svg>,
    title: 'New paper available: Jan 2025 - Morning',
    time: 'Yesterday',
    read: true,
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="#5BB98C" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17v-6a5 5 0 0 0-10 0v6" /><rect x="5" y="17" width="14" height="2" rx="1" /></svg>,
    title: 'Reminder: Complete your profile',
    time: '2 days ago',
    read: false,
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="#5BB98C" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4l3-3" /></svg>,
    title: 'Leaderboard updated! Check your rank',
    time: '3 days ago',
    read: true,
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="#5BB98C" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" /></svg>,
    title: 'New discussion reply: Physics Doubts',
    time: '4 days ago',
    read: false,
  },
];

const Dashboard: React.FC = () => {
  // --- User Profile Dropdown State and Refs ---
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileBtnRef = React.useRef<HTMLButtonElement>(null);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifBtnRef = React.useRef<HTMLButtonElement>(null);
  const notifDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node) &&
        notifBtnRef.current &&
        !notifBtnRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('User');
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    topSubject: 'None',
    studyHours: 0
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUserStats = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/userstats/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const stats = await response.json();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load your stats');
    }
  }

  useEffect(() => {
    // Check login status from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    // Get user name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    // Redirect to signin if not logged in
    if (!loggedIn) {
      navigate('/signin');
    } else {
      const userId = localStorage.getItem('userId');
      fetchUserStats(userId);
    }
  }, [navigate]);

  // Filter papers based on search query and filters
  const filteredPapers = mockPapers.filter(paper => {
    // Apply year filter
    if (sessionFilter !== 'all' && paper.session !== sessionFilter) return false;
    
    // Apply search query
    if (searchQuery) {
      const paperTitle = `${paper.date} - Shift ${paper.shift}`;
      const searchString = `${paperTitle} ${paper.session} ${paper.year}`.toLowerCase();
      if (!searchString.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });
  
  // Group papers by year for the tabs
  const papersByYear: Record<number, typeof mockPapers> = {};
  mockPapers.forEach(paper => {
    if (!papersByYear[paper.year]) {
      papersByYear[paper.year] = [];
    }
    papersByYear[paper.year].push(paper);
  });
  
  const years = Object.keys(papersByYear).sort((a, b) => Number(b) - Number(a));
  
  
  const isPaperPremium = (paperId: string) => {
    const year = parseInt(paperId.split('-')[0].replace('jee', ''));
    return year >= 2021;
  };

  return (
    <div className="flex min-h-0">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <div className="page-container pt-8 md:pt-12">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Welcome back, {userName}</h1>
            </div>
            <div className="flex items-center gap-3">
  {/* Search Icon */}
  {/* Notification Bell with Dot */}
  <div className="relative">
    <button
      className="rounded-xl bg-[#FAFAFA] p-2 shadow-sm border border-[#F0F0F0] hover:bg-[#F3F3F3] transition"
      onClick={() => setNotifOpen((open) => !open)}
      ref={notifBtnRef}
      aria-label="Notifications"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#232323" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    </button>
    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
    {notifOpen && (
      <div ref={notifDropdownRef} className="absolute right-0 mt-2 w-80 bg-white border border-[#E3E9E2] shadow-xl rounded-xl z-50 animate-fade-in">
        <div className="px-4 py-3 border-b border-[#E3E9E2] flex items-center justify-between">
          <span className="font-semibold text-[#384B47]">Notifications</span>
          <button className="text-xs text-[#5BB98C] hover:underline">Mark all as read</button>
        </div>
        <ul className="max-h-80 overflow-y-auto divide-y divide-[#F0F0F0]">
          {mockNotifications.length > 0 ? (
            mockNotifications.slice(0, 5).map((notif, idx) => (
              <li key={idx} className={`flex items-start gap-3 px-4 py-3 hover:bg-[#FAFBF6] cursor-pointer ${!notif.read ? 'bg-[#F7FAF7]' : ''}`}>
                <span className={`mt-1 ${notif.read ? 'text-gray-400' : 'text-[#5BB98C]'}`}>{notif.icon}</span>
                <div className="flex-1">
                  <div className={`text-sm ${!notif.read ? 'font-semibold text-[#1A2B2E]' : 'text-gray-700'}`}>{notif.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                </div>
                {!notif.read && <span className="block h-2 w-2 rounded-full bg-[#5BB98C] mt-2"></span>}
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-400 text-sm">You're all caught up!</li>
          )}
        </ul>
        <div className="border-t border-[#E3E9E2] px-4 py-2 text-center">
          <a href="#" className="text-[#5BB98C] text-sm font-medium hover:underline">See all notifications</a>
        </div>
      </div>
    )}
  </div>
  {/* User Profile Section */}
  <div className="relative">
    <button
      className="flex items-center gap-3 pl-2 rounded-xl bg-[#FAFAFA] p-2 shadow-sm border border-[#F0F0F0] hover:bg-[#F3F3F3] transition"
      onClick={() => setProfileDropdownOpen((open) => !open)}
      ref={profileBtnRef}
      aria-label="User menu"
    >
      <img
        src={localStorage.getItem('userAvatar') || 'https://randomuser.me/api/portraits/men/32.jpg'}
        alt={userName}
        className="h-10 w-10 rounded-full object-cover bg-gray-200"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://randomuser.me/api/portraits/men/32.jpg'; }}
      />
      <div className="flex flex-col items-start">
        <span className="font-bold text-lg leading-5">{userName}</span>
      </div>
    </button>
    {profileDropdownOpen && (
      <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-[#E3E9E2] shadow-xl rounded-xl z-50 animate-fade-in">
        <ul className="divide-y divide-[#F0F0F0]">
          <li className="px-4 py-3 hover:bg-[#FAFBF6] cursor-pointer">Profile</li>
          <li className="px-4 py-3 hover:bg-[#FAFBF6] cursor-pointer">Settings</li>
          <li className="px-4 py-3 hover:bg-[#FAFBF6] cursor-pointer text-red-500">Logout</li>
        </ul>
      </div>
    )}
  </div>
</div>
          </div>
          
          {/* Quick Stats Modern Dashboard */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 items-stretch">
  {/* Tests Completed */}
  <div className="rounded-3xl border border-[#F0F0F0] shadow-lg w-full h-32 flex flex-col items-center justify-center text-center gap-1" style={{ backgroundColor: '#D6CCFF' }}>
    <span className="text-md text-gray-500">Tests Completed</span>
    <span className="text-3xl font-bold text-black">{userStats.testsCompleted}</span>
  </div>
  {userStats.testsCompleted === 0 && (
    <div className="w-full flex flex-col items-center mt-2">
      {(() => {
        // Check if any 2020 paper is unlocked (free trial)
        const paidPapers = JSON.parse(localStorage.getItem('paidPapers') || '[]');
        const hasUnlocked2020 = paidPapers.some((id: string) => id.startsWith('jee2020'));
        if (!hasUnlocked2020) {
          return (
            <span className="text-xs text-[#5BB98C] mt-1">Start your journey with a <b>free trial</b> paper from 2020!</span>
          );
        } else {
          return (
            <span className="text-xs text-[#C77D2E] mt-1">Ready for more? <b>Purchase a paper</b> to unlock practice!</span>
          );
        }
      })()}
    </div>
  )}
  {/* Average Score */}
  <div className="rounded-3xl border border-[#F0F0F0] shadow-lg w-full h-32 flex flex-col items-center justify-center text-center gap-1" style={{ backgroundColor: '#FFCFC7' }}>
    <span className="text-md text-gray-500">Average Score</span>
    <span className="text-3xl font-bold text-black">{userStats.averageScore}%</span>
  </div>
  {/* Top Subject */}
  <div className="rounded-3xl border border-[#F0F0F0] shadow-lg w-full h-32 flex flex-col items-center justify-center text-center gap-1" style={{ backgroundColor: '#FFE3AC' }}>
    <span className="text-md text-gray-500">Top Subject</span>
    <span className="text-3xl font-bold text-black">{userStats.topSubject}</span>
  </div>
  {/* Study Hours */}
  <div className="rounded-3xl border border-[#F0F0F0] shadow-lg w-full h-32 flex flex-col items-center justify-center text-center gap-1" style={{ backgroundColor: '#B6F7B0' }}>
    <span className="text-md text-gray-500">Study Hours</span>
    <span className="text-3xl font-bold text-black">{Math.floor(userStats.studyHours)} hrs</span>
  </div>
</div>
          
          {/* Main Content - Practice Papers with integrated filters */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Practice Papers</CardTitle>
                <CardDescription>Browse JEE test papers by year</CardDescription>
              </div>
              
              {/* Filters moved into the card header */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Search papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={sessionFilter} onValueChange={setSessionFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <CalendarRange size={16} className="mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {[...new Set(mockPapers.map(paper => paper.session))].map(session => (
                      <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              {searchQuery || sessionFilter !== 'all' ? (
                // Show filtered results
                <div>
                  <h3 className="text-sm font-medium mb-4">
                    Filtered Results ({filteredPapers.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPapers.map(paper => (
                      <PaperCard
                        key={paper.id}
                        id={paper.id}
                        year={paper.year}
                        session={paper.session}
                        shift={paper.shift}
                        date={paper.date}
                        questionCount={paper.questionCount}
                        duration={paper.duration}
                        isPremium={isPaperPremium(paper.id)}
                      />
                    ))}
                  </div>
                  
                  {filteredPapers.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No papers match your search criteria.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setSessionFilter('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Show papers organized by year in tabs
                <Tabs defaultValue={years[0]} className="w-full">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
                    {years.map(year => (
                      <TabsTrigger
                        key={year}
                        value={year}
                        className={cn(
                          "relative px-4 py-2 rounded-md text-center",
                          year === "2020" ? "bg-blue-50 border border-blue-500 text-blue-600 font-bold" : ""
                        )}
                      >
                        {year}
                        {year === "2020" && (
                          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-[1px] rounded-md">
                            Free trial
                          </span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {years.map(year => (
                    <TabsContent key={year} value={year}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {papersByYear[Number(year)].map(paper => (
                          <PaperCard
                            key={paper.id}
                            id={paper.id}
                            year={paper.year}
                            session={paper.session}
                            shift={paper.shift}
                            date={paper.date}
                            questionCount={paper.questionCount}
                            duration={paper.duration}
                            isPremium={isPaperPremium(paper.id)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="page-container pt-24">
          {/* Other dashboard components */}
        </div>
        
        {/* Add the Banner component */}
        <Banner 
          text="🚀 We’re Hiring a Growth Intern! Click to Apply 🚀" 
          linkUrl="https://forms.gle/fKCit1Kih2wbZGu9A"
        />
      </div>
    </div>
  );
};

export default Dashboard;