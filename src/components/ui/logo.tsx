
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showVersion?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showVersion = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/f8be561d-d5b5-49a8-adaa-dbf01721ef9f.png" 
        alt="WZRD.tech" 
        className={cn("object-contain", sizeClasses[size])}
      />
      {showVersion && (
        <span className="text-xs text-white/50 bg-[#292F46] px-2 py-0.5 rounded">ALPHA</span>
      )}
    </div>
  );
}
