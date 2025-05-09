"use client";
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import ResourceCard from '@/components/ResourceCard';
import Footer from '@/components/Footer';
import { BookOpen, FileText, TrendingUp, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const categories = [
  {
    icon: <BookOpen size={32} />, title: 'Practice Papers', desc: 'Solved previous year JEE papers for real exam experience.'
  },
  {
    icon: <FileText size={32} />, title: 'Study Guides', desc: 'Handpicked notes, formula sheets, and quick revision guides.'
  },
  {
    icon: <TrendingUp size={32} />, title: 'Exam Strategy', desc: 'Tips and tutorials for maximizing your JEE Main score.'
  },
  {
    icon: <Star size={32} />, title: 'Motivation', desc: 'Stay positive and focused with expert advice.'
  }
];

const resources = [
  {
    icon: <BookOpen size={24} />, title: 'JEE Main 2024 Solved Paper', description: 'Get the latest solved paper with detailed solutions and analysis.'
  },
  {
    icon: <FileText size={24} />, title: 'Physics Formula Sheet', description: 'Quick revision: All key Physics formulas for JEE Main.'
  },
  {
    icon: <TrendingUp size={24} />, title: 'How to Avoid Silly Mistakes', description: 'Exam strategy guide to help you minimize errors and maximize marks.'
  },
  {
    icon: <Star size={24} />, title: 'Motivational Stories', description: 'Real stories from toppers and their journey to success.'
  }
];

const tabs = [
  'All',
  'Practice Papers',
  'Study Guides',
  'Exam Strategy',
  'Motivation',
  'Blog',
];

const blogPosts = [
  {
    slug: 'jee-mains-prep-tips',
    title: 'Top Tips for JEE Mains Preparation',
    summary: 'Boost your JEE Mains score with these proven strategies...',
    date: '2024-07-01',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
  },
];

const AboutUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <>
      <Helmet>
        <title>About Us | JEE Quest Resource Hub</title>
        <meta name="description" content="Learn about JEE Quest, our mission, and explore curated resources, guides, and tips to help you crack JEE Mains with confidence." />
        <link rel="canonical" href="https://jee-quest.vercel.app/about" />
        <meta property="og:title" content="About Us | JEE Quest Resource Hub" />
        <meta property="og:description" content="Learn about JEE Quest, our mission, and explore curated resources, guides, and tips to help you crack JEE Mains with confidence." />
        <meta property="og:url" content="https://jee-quest.vercel.app/about" />
        <meta property="og:image" content="https://jee-quest.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | JEE Quest Resource Hub" />
        <meta name="twitter:description" content="Learn about JEE Quest, our mission, and explore curated resources, guides, and tips to help you crack JEE Mains with confidence." />
        <meta name="twitter:image" content="https://jee-quest.vercel.app/og-image.png" />
      </Helmet>
      <NavBar />
      {/* Hero Section */}
      <section className="bg-[#F3F8F6] text-[#1A2B2E] py-16 px-4 text-center mt-16 md:mt-20 border-b border-[#E3E9E2]">
        <h1 className="mb-4 text-[#2D5A4A]">Resource hub</h1>
        <p className="mb-8 text-lg max-w-xl mx-auto text-[#4B6358]">Ideas, templates, and tools for students preparing for JEE. Curated to help you crack the exam with confidence.</p>
        <button className="bg-[#5BB98C] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#4CA97A] transition">Discover resources</button>
      </section>

      {/* Tab Navigation */}
      <nav className="max-w-5xl mx-auto mt-8 flex gap-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`pb-3 px-2 text-gray-700 border-b-2 transition-colors duration-150 whitespace-nowrap ${activeTab === tab ? 'border-[#5BB98C] text-[#5BB98C] bg-white' : 'border-transparent hover:text-[#5BB98C]'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Featured Resource/Blog Card */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-6">
          <img src={blogPosts[0].image} className="w-full md:w-1/3 rounded-lg object-cover" alt="Featured" />
          <div>
            <h2 className="text-2xl text-[#2D5A4A] mb-2">{blogPosts[0].title}</h2>
            <p className="text-[#4B6358] mb-4">{blogPosts[0].summary}</p>
            <span className="text-xs text-gray-400">{blogPosts[0].date}</span>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#5BB98C]">{res.icon}</span>
              <span className="text-base text-gray-900">{res.title}</span>
            </div>
            <div className="text-gray-600 text-sm leading-relaxed">{res.description}</div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <section id="faq-section" className="max-w-3xl mx-auto mt-16 mb-20 px-4 bg-[#FAFBF6] rounded-2xl py-12 shadow-none transition-opacity duration-500">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#384B47]">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-3">
          {[{
            question: "How to develop better skills for solving JEE questions?",
            answer: "Practise makes a man perfect and the same applies to JEE exams as well. Unlike the regular board exams, JEE is a competitive exam. It tests more than your conceptual understanding of the syllabus. It tests your knowledge, accuracy and decision making skills. Therefore the strategy to study the same will also differ. You must make sure that you practise as many previous years question papers and take up as many mock papers as possible. The syllabus is already being studied for board exams, therefore students must practise analyzing and arriving at the right answers in the shortest period of time. This can be done through repeated practise of previous year question papers."
          }, {
            question: "What is the general paper pattern of the JEE Main 2025 exam?",
            answer: (<ul className="list-disc pl-5 space-y-1"><li><strong>Exam Mode:</strong> Computer-based test mode.</li><li><strong>Exam Duration:</strong> 3 hours (<strong>4 hours</strong> for persons with benchmark disabilities).</li><li><strong>Subjects:</strong> Physics, Chemistry, and Mathematics.</li><li><strong>Total Number of Questions:</strong> 75 (Each subject will have 25 questions).</li><li><strong>Type of Questions:</strong> 20 MCQ, 5 Numerical questions (numerical value as an answer).</li><li><strong>Marking Scheme:</strong> For MCQs: <strong>+4</strong> Marks for a correct answer and <strong>-1</strong> Mark for an incorrect answer. For numeric value answers: <strong>+4</strong> Marks for every correct answer and <strong>0</strong> Mark for every incorrect answer.</li><li><strong>Maximum Marks:</strong> 300.</li><li><strong>Medium of Exam:</strong> English or Hindi (Candidates from Gujarat, Daman & Diu and Dadra and Nagar Haveli can opt for Gujarati as well).</li></ul>),
          }, {
            question: "What are the benefits of solving previous year question papers?",
            answer: (<div><div className="font-bold mb-3">The benefits of solving Previous years Question Papers are as follows:</div><ul className="list-disc pl-5 space-y-2"><li><strong>Helps you to analyze your preparation levels.</strong></li><li><strong>Will learn time management.</strong></li><li><strong>Helps students to improve the accuracy of their answers</strong></li><li><strong>Aid students to identify their strengths and weaknesses.</strong></li><li><strong>Helps you to identify important chapters, concepts and their weightage.</strong></li><li><strong>Gives you a clear picture of the exam paper pattern.</strong></li><li><strong>Allows you to identify repeated concepts and questions patterns allowing you to plan your study strategy accordingly.</strong></li></ul></div>),
          }, {
            question: "How does JEEQuest help students perform better in JEE Mains 2026?",
            answer: (<div><strong>JEEQuest is a leading Ed-tech platform in India.</strong> The core objective of JEEQuest is to provide quality education for students and develop in them a sense of motivation and drive towards gaining knowledge. Also, it promotes and upholds the concept of studying from the comfort of your home for better performance. Therefore students can avail LIVE online, two-way interactive classes from experts to help them clear their <strong>JEE Main 2025 exam</strong>. Students are also provided with doubts solving sessions to help students understand concepts better. Along with these, students can get solved previous years question papers, mock papers and mock tests for <strong>JEE Main 2025</strong> paper to help students boost their performance.</div>),
          }].map((faq, idx) => (
            <details key={idx} className="group border border-[#E6ECE7] rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow px-2 md:px-4 py-3 md:py-4">
              <summary className="font-semibold cursor-pointer transition-colors text-[#384B47] group-open:text-[#5BB98C] hover:text-[#5BB98C] flex items-center justify-between">{faq.question}</summary>
              <div className="border-t border-[#E6ECE7] mt-3 pt-3 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-[#FAFBF6] text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your JEE prep?</h2>
        <p className="mb-8 text-gray-700 max-w-2xl mx-auto">Access curated resources, practice papers, and expert tips to maximize your score. Take the next step towards your dream college today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[#5BB98C] text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-[#4CA97A] transition">Start Practicing</button>
          <button className="border border-[#5BB98C] text-[#5BB98C] px-8 py-3 rounded-md font-medium text-lg hover:bg-[#E3E9E2] transition">Contact Us</button>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
