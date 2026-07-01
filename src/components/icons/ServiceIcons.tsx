// Custom colored service icons matching the Google icon style

export function ContractorIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" fill="#5B7FE8"/>
      <path d="M9 22V12H15V22" fill="#7B5FE8"/>
      <circle cx="12" cy="8" r="1.5" fill="#FFD700"/>
    </svg>
  );
}

export function ElectricityIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#electric-gradient)"/>
      <defs>
        <linearGradient id="electric-gradient" x1="3" y1="2" x2="21" y2="22">
          <stop offset="0%" stopColor="#FFB800"/>
          <stop offset="100%" stopColor="#FFA000"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PlumbingIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 14L19 19" stroke="#0F6E4C" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="11" cy="11" r="8" fill="#0F6E4C" fillOpacity="0.2"/>
      <circle cx="11" cy="11" r="5" fill="#0F6E4C"/>
      <path d="M17 17L20 20" stroke="#56CCF2" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PaintingIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M18 3L21 6L11 16L8 13L18 3Z" fill="#FF6B9D"/>
      <rect x="7" y="14" width="5" height="8" rx="1" fill="#C44569"/>
      <circle cx="5" cy="5" r="2" fill="#FFB8D1"/>
      <circle cx="10" cy="3" r="1.5" fill="#FF6B9D"/>
      <circle cx="15" cy="5" r="1.5" fill="#C44569"/>
    </svg>
  );
}

export function CleaningIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3V11" stroke="#4FACFE" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="4" r="2" fill="#00F2FE"/>
      <path d="M8 11L12 11L16 11L17 22H7L8 11Z" fill="url(#clean-gradient)"/>
      <circle cx="7" cy="6" r="1" fill="#4FACFE" fillOpacity="0.6"/>
      <circle cx="17" cy="6" r="1" fill="#4FACFE" fillOpacity="0.6"/>
      <circle cx="10" cy="8" r="1" fill="#00F2FE" fillOpacity="0.6"/>
      <defs>
        <linearGradient id="clean-gradient" x1="7" y1="11" x2="17" y2="22">
          <stop offset="0%" stopColor="#4FACFE"/>
          <stop offset="100%" stopColor="#00F2FE"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EquipmentIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="#F7971E"/>
      <rect x="3" y="8" width="4" height="4" rx="1" fill="#FFD200"/>
      <rect x="17" y="8" width="4" height="4" rx="1" fill="#FFD200"/>
      <circle cx="9" cy="15" r="2" fill="#1A1A1A"/>
      <circle cx="15" cy="15" r="2" fill="#1A1A1A"/>
      <rect x="11" y="3" width="2" height="8" fill="#F7971E"/>
    </svg>
  );
}

export function RealEstateIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V12Z" fill="url(#estate-gradient)"/>
      <rect x="9" y="14" width="6" height="8" fill="#FFFFFF"/>
      <rect x="11" y="16" width="2" height="3" fill="#667eea"/>
      <defs>
        <linearGradient id="estate-gradient" x1="3" y1="3" x2="21" y2="22">
          <stop offset="0%" stopColor="#667eea"/>
          <stop offset="100%" stopColor="#764ba2"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Design3DIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#C8A24A"/>
      <path d="M2 17L12 22L22 17" stroke="#D3A55A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M2 12L12 17L22 12" stroke="#D3A55A" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="7" r="1.5" fill="#FFD700"/>
    </svg>
  );
}

export function ACIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="url(#ac-gradient)"/>
      <line x1="8" y1="10" x2="16" y2="10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="14" x2="16" y2="14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 18C6 18 7 20 8 20C9 20 9 18 9 18" stroke="#56CCF2" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 18C11 18 12 20 13 20C14 20 14 18 14 18" stroke="#56CCF2" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 18C16 18 17 20 18 20C19 20 19 18 19 18" stroke="#56CCF2" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="ac-gradient" x1="4" y1="6" x2="20" y2="18">
          <stop offset="0%" stopColor="#56CCF2"/>
          <stop offset="100%" stopColor="#2F80ED"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CarpentryIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 6L20 12L14 18L8 12L14 6Z" fill="#8B4513"/>
      <path d="M8 12L14 6L10 2L4 8L8 12Z" fill="#A0522D"/>
      <rect x="2" y="20" width="20" height="2" fill="#654321"/>
      <circle cx="17" cy="9" r="1" fill="#FFD700"/>
    </svg>
  );
}

export function MaintenanceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="#5B7FE8"/>
      <circle cx="8" cy="16" r="2" fill="#7B5FE8"/>
      <path d="M18 6l-2 2" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function MaterialsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" fill="#8B7355"/>
      <rect x="13" y="3" width="8" height="8" rx="1" fill="#A0826D"/>
      <rect x="3" y="13" width="8" height="8" rx="1" fill="#A0826D"/>
      <rect x="13" y="13" width="8" height="8" rx="1" fill="#8B7355"/>
      <circle cx="7" cy="7" r="1" fill="#FFFFFF" fillOpacity="0.3"/>
      <circle cx="17" cy="17" r="1" fill="#FFFFFF" fillOpacity="0.3"/>
    </svg>
  );
}

export function DesignIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#design-gradient)"/>
      <path d="M2 17L12 22V12L2 7V17Z" fill="#7B5FE8" fillOpacity="0.8"/>
      <path d="M22 17L12 22V12L22 7V17Z" fill="#5B7FE8" fillOpacity="0.8"/>
      <defs>
        <linearGradient id="design-gradient" x1="2" y1="2" x2="22" y2="12">
          <stop offset="0%" stopColor="#C8A24A"/>
          <stop offset="100%" stopColor="#D3A55A"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
