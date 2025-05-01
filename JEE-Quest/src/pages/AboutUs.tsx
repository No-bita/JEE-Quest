"use client";
import React from 'react';
import NavBar from '@/components/NavBar';
import ResourceCard from '@/components/ResourceCard';
import Footer from '@/components/Footer';
import { BookOpen, FileText, TrendingUp, Star } from 'lucide-react';

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

const AboutUs: React.FC = () => {
  return (
    <>
      <NavBar />
      {/* Hero Section */}
      <section className="bg-[#FAFBF6] text-[#1A2B2E] py-16 px-4 text-center mt-16 md:mt-20">
        <h1 className="text-5xl font-bold mb-4">Resource hub</h1>
        <p className="mb-8 text-lg max-w-xl mx-auto">Ideas, templates, and tools for students preparing for JEE. Curated to help you crack the exam with confidence.</p>
        <button className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition">Discover resources</button>
      </section>

      {/* Category Row */}
      <div className="bg-[#F7FAF7] text-[#1A2B2E] py-8 flex flex-col md:flex-row items-center justify-center gap-10 border-b border-[#E3E9E2]">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center w-56 text-center">
            <div className="mb-2">{cat.icon}</div>
            <div className="font-semibold text-lg mb-1">{cat.title}</div>
            <div className="text-gray-300 text-sm">{cat.desc}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="bg-[#FAFBF6] min-h-[60vh] py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">Explore all our resources</h2>
        <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
          {/* Sidebar */}
          <aside className="w-full md:w-64 mb-8 md:mb-0">
            <div className="mb-6 text-gray-500 text-sm">4 resources</div>
            <div className="relative mb-8">
              <input type="text" placeholder="Search all resources" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-8">
              <div className="font-semibold mb-2 text-gray-700">Categories</div>
              <ul className="space-y-1">
                <li><span className="block bg-blue-100 text-blue-700 px-3 py-1 rounded">All</span></li>
                <li className="text-gray-600">Practice Papers</li>
                <li><a href="#faq-section" className="text-gray-600 hover:underline" role="link">FAQs</a></li>
                <li className="text-gray-600">Exam Strategy</li>
                <li className="text-gray-600">Motivation</li>
              </ul>
            </div>
          </aside>
          {/* Resource Cards Grid */}
          <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res, idx) => (
              <div key={idx} className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#5BB98C]">{res.icon}</span>
                  <span className="font-medium text-base text-gray-900">{res.title}</span>
                </div>
                <div className="text-gray-600 text-sm leading-relaxed">{res.description}</div>
              </div>
            ))}
          </section>
        </div>
      </main>

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
