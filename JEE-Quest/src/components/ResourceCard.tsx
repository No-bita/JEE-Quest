import React from 'react';
import { BookOpen, FileText, TrendingUp, Star } from 'lucide-react';

interface ResourceCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col gap-2 p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition">
    <div className="text-blue-500 mb-2">{icon}</div>
    <div className="font-semibold text-lg mb-1">{title}</div>
    <div className="text-gray-600 text-sm leading-relaxed">{description}</div>
  </div>
);

export default ResourceCard;
