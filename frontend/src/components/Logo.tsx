import { Satellite } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <Satellite className="h-8 w-8 text-white animate-bounce-slow" />
      <span className="text-2xl font-bold bg-white to-accent bg-clip-text text-transparent">
        ThermoFusion Lab
      </span>
    </Link>
  );
}