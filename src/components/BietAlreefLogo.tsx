import logoSrc from 'figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png';

interface BietAlreefLogoProps {
  /** حجم الشعار — يمكن تمرير className أو size رقمي */
  size?: number;
  className?: string;
  /** إظهار الاسم النصي بجانب الشعار */
  withText?: boolean;
}

export function BietAlreefLogo({ size = 56, className = '', withText = false }: BietAlreefLogoProps) {
  if (withText) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img
          src={logoSrc}
          alt="بيت الريف — Biet Alreef"
          width={size}
          height={size}
          className="object-contain flex-shrink-0"
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="بيت الريف — Biet Alreef"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
