import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTachometerAlt, FaBook, FaChartBar, FaComments, FaEnvelope, FaUsers, FaLayerGroup, FaCalendarAlt, FaQuestionCircle, FaSignOutAlt, FaTrophy, FaStickyNote, FaBookmark, FaLightbulb, FaShareAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOutClick = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };
  const [openSections, setOpenSections] = useState({
    community: true,
    resources: true,
    live: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-72 bg-white shadow-lg flex flex-col p-4 min-h-fit">
      {/* Logo and App Name Row */}
      <Link to="/papers" className="flex items-center gap-2 mb-6 mt-2 hover:opacity-90 focus:outline-none">
        <img src="/images/JEEQuest.png" alt="JEE Quest Logo" className="h-10 w-10 rounded-full object-cover" />
        <span className="text-2xl font-bold tracking-tight" style={{ color: '#5BB98C' }}>JEE Quest</span>
      </Link>
      <div>
        
        {/* Main Navigation */}
        <nav>
          <ul className="space-y-1">
            <li>
              <Link
                to="/papers"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${location.pathname === '/papers' ? 'bg-[#1D9A6C] text-white' : 'hover:bg-gray-100'}`}
              >
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                <FaChartBar /> Analytics
              </a>
            </li>
            <li>
              <Link
                to="/leaderboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${location.pathname === '/leaderboard' ? 'bg-[#1D9A6C] text-white' : 'hover:bg-gray-100'}`}
              >
                <FaTrophy /> Leaderboard
              </Link>
            </li>
          </ul>
        </nav>
        {/* Collapsible Sections */}
        <div className="mt-6">
          {/* Community & Collaboration */}
          <div>
            <button
              className="flex items-center w-full text-xs text-gray-400 gap-2 px-2 py-1"
              onClick={() => toggleSection('community')}
            >
              Community & Support
              <span className={`ml-auto transition-transform ${openSections.community ? '' : 'rotate-180'}`}>▼</span>
            </button>
            {openSections.community && (
              <ul className="pl-5 mt-1 space-y-1">
                <li>
                  <Link
                    to="/discussions"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${location.pathname === '/discussions' ? 'bg-[#1D9A6C] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <FaComments /> Discussion
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {/* Resources & Support */}
          <div className="mt-4">
            <button
              className="flex items-center w-full text-xs text-gray-400 gap-2 px-2 py-1"
              onClick={() => toggleSection('resources')}
            >
              Resources & Support
              <span className={`ml-auto transition-transform ${openSections.resources ? '' : 'rotate-180'}`}>▼</span>
            </button>
            {openSections.resources && (
              <ul className="pl-5 mt-1 space-y-1">
                <li>
                  <Link
  to="/about"
  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${location.pathname === '/about' ? 'bg-[#1D9A6C] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
>
  <FaLayerGroup /> Resources
</Link>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                    <FaStickyNote /> My Notes
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                    <FaBookmark /> My Bookmarks
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                    <FaQuestionCircle /> Support
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      {/* Career and Referral Section */}
      <div className="mt-4">
        <ul className="space-y-1">
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <FaLightbulb /> Career Guidance
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <FaShareAlt /> Referral
            </a>
          </li>
        </ul>
      </div>
      </div>
      {/* Logout */}
      <div className="mt-6">
        <button onClick={handleSignOutClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 w-full">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
