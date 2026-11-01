import React from 'react';
import {
  GraduationCap,
  Utensils,
  Car,
  HeartPulse,
  Home,
  Laptop,
  HelpCircle,
  BookOpen,
  Wrench,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  iconName: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, ...props }) => {
  switch (iconName) {
    case 'GraduationCap':
    case 'Academic':
    case 'Textbooks':
      return <BookOpen {...props} />;
    case 'Utensils':
    case 'Food':
      return <Utensils {...props} />;
    case 'Car':
    case 'Transport':
    case 'Rides':
      return <Car {...props} />;
    case 'HeartPulse':
    case 'Health':
      return <HeartPulse {...props} />;
    case 'Home':
    case 'Household':
      return <Home {...props} />;
    case 'Laptop':
    case 'Tech':
      return <Laptop {...props} />;
    case 'Wrench':
    case 'Repairs':
      return <Wrench {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
