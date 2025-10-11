import { Link } from 'wouter';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

const sizeClasses = {
  sm: 'h-6 w-20',
  md: 'h-8 w-24', 
  lg: 'h-10 w-32',
  xl: 'h-12 w-40'
};

export default function Logo({ 
  className = '', 
  showText = true, 
  size = 'md',
  href = '/'
}: LogoProps) {
  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/assets/MAIN LOGO.png?v=5" 
        alt="Share Wheelz" 
        className={`${sizeClasses[size]} mr-3`}
      />
      {showText && (
        <span className="text-2xl font-bold gradient-text">
          Share Wheelz
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <div className="hover:scale-105 transition-transform duration-200 rounded-md px-3 py-2 group cursor-pointer">
          {logoElement}
        </div>
      </Link>
    );
  }

  return logoElement;
}
