import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Title */}
      <h1 className="text-5xl font-bold text-center mb-12 text-primary">Resources</h1>

      {/* Section Wrapper */}
      <div className="space-y-12">
        {/* Section 1: Introduction */}
        <section className="bg-gray-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Crack JEE Mains 2025 with Confidence</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            JEE Main is India’s premier entrance exam for aspiring engineers. It is the gateway to top engineering colleges, including IITs, NITs, and IIITs. Admissions are based on your JEE Main score and rank, making it essential to perform well.

            This exam evaluates students on three core subjects: Physics, Chemistry, and Mathematics. With thousands of students competing each year, preparing effectively is key to success.

            At JEE Quest, we provide solved question papers to help students understand the exam pattern, improve accuracy, and build confidence. Whether you’re a student aiming for your dream college or a parent guiding your child’s journey, we’re here to support you every step of the way
          </p>
        </section>

        {/* Section 2: Benefits */}
        <section className="bg-blue-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Why Solving JEE Main Previous Year Papers Matters?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Completing the syllabus is just the beginning. The next step is practicing effectively, and this is where JEE Mains Previous Year Papers play a crucial role. These papers help you transition from preparation to performance by giving a real feel of the D-Day.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed mt-4">
            <li>Understand the Exam Pattern: Familiarize yourself with the types of questions, marking scheme, and syllabus coverage.</li>
            <li>Boost speed and Accuracy: Regular practice sharpens problem-solving skills, helping you answer quickly and correctly under pressure.</li>
            <li>Identify Weak Areas: Pinpoint topics that need more attention and focus your efforts where it matters the most.</li>
            <li>Simulate Real Exam Conditions: Solve papers in a timed environment to build stamina and confidence for the actual exam day.</li>
          </ul>
        </section>

        {/* Section 3: Preparation Tips */}
        <section className="bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Preparation Tips for JEE Main 2025</h2>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed">
            <li>Time management.</li>
            <li>Focus on important topics.</li>
            <li>Plan your day ahead.</li>
            <li>Practice is key to success.</li>
            <li>Take tests after every concept.</li>
            <li>Regular revision.</li>
          </ul>
        </section>

        {/* Section 4: Staying Positive */}
        <section className="bg-blue-100 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Top Ways to Stay Positive Before JEE Main Exam 2025</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Self-motivation is crucial while preparing for competitive exams like JEE Main. Students often face challenges but must remind themselves of their ultimate goals and keep pushing forward.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed mt-4">
            <li>Learn from your mistakes and avoid repeating them.</li>
            <li>Visualize a better and bigger picture of your future success.</li>
            <li>Set daily goals and reward yourself for achieving them.</li>
            <li>Stay positive and focus on your strengths.</li>
          </ul>
        </section>

        {/* Section 5: Call-to-action */}
        <div className="text-center mt-16">
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-dark transition">
            Explore More Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
