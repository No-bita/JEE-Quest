import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAFBF6] border-t border-[#E3E9E2] mt-8">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding & Support */}
        <div>
          <span className="text-2xl font-bold text-[#5BB98C]">JEE Quest</span>
          <p className="mt-3 text-[#384B47] text-sm">Your trusted resource hub for JEE preparation.</p>
          <p className="mt-4 text-[#6C8B7B] text-sm">Support: <a href="mailto:help@jeequest.com" className="underline text-[#5BB98C]">help@jeequest.com</a></p>
        </div>
        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-3 text-[#384B47]">Resources</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:underline">Practice Papers</a></li>
            <li><a href="#" className="hover:underline">Study Guides</a></li>
            <li><a href="#" className="hover:underline">Exam Strategy</a></li>
            <li><a href="#" className="hover:underline">Motivation</a></li>
          </ul>
        </div>
        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3 text-[#384B47]">Company</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Our Team</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>
        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-3 text-[#384B47]">Get the latest JEE tips</h4>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="px-3 py-2 rounded border border-[#5BB98C] focus:ring-2 focus:ring-[#5BB98C] bg-[#F7FAF7] placeholder-[#A3C4A8]"
            />
            <button
              type="submit"
              className="bg-[#5BB98C] text-white px-4 py-2 rounded hover:bg-[#4CA97A] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-[#A3C4A8] py-4 border-t border-[#E3E9E2]">
        &copy; {new Date().getFullYear()} JEE Quest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
