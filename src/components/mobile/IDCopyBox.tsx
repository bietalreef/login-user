import { Copy, Check } from 'lucide-react';
import { useState, useRef } from 'react';

interface IDCopyBoxProps {
  id: string;
  className?: string;
}

export function IDCopyBox({ id, className = '' }: IDCopyBoxProps) {
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Method 1: Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      // Fall through to fallback method
      console.log('Clipboard API failed, using fallback');
    }

    // Method 2: Fallback using textarea and execCommand
    try {
      if (textAreaRef.current) {
        textAreaRef.current.select();
        textAreaRef.current.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          
          // Deselect
          window.getSelection()?.removeAllRanges();
        } else {
          console.error('Copy command failed');
        }
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg px-3 py-1.5 relative ${className}`}
      dir="rtl"
    >
      {/* Hidden textarea for fallback copy method */}
      <textarea
        ref={textAreaRef}
        value={id}
        readOnly
        className="absolute opacity-0 pointer-events-none"
        style={{ position: 'absolute', left: '-9999px' }}
        aria-hidden="true"
      />
      
      <span className="text-xs font-mono text-[#1F3D2B] font-semibold">
        {id}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-purple-200 rounded transition-colors flex items-center justify-center"
        title="نسخ المعرف"
        type="button"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-purple-600" />
        )}
      </button>
    </div>
  );
}