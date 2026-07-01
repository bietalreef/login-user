import { useRef, useEffect, useState, useCallback } from 'react';
import { X, Camera, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Sun, Download, Move, RefreshCw } from 'lucide-react';
// FlipHorizontal/SwitchCamera not available in this lucide version
const FlipHorizontal = RefreshCw;
const SwitchCamera = Camera;
import { Product } from './ShopStore';

interface VRProductViewerProps {
  product: Product;
  onClose: () => void;
}

type ARState = 'requesting' | 'active' | 'denied' | 'unsupported' | 'captured';

export function VRProductViewer({ product, onClose }: VRProductViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productImgRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const capturedImageRef = useRef<string>('');

  const [arState, setArState] = useState<ARState>('requesting');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string>('');

  // Product transform state
  const [productPos, setProductPos] = useState({ x: 0.5, y: 0.6 }); // normalized 0-1
  const [productScale, setProductScale] = useState(0.4); // relative to screen width
  const [productRotation, setProductRotation] = useState(0);
  const [productFlipped, setProductFlipped] = useState(false);
  const [productOpacity, setProductOpacity] = useState(0.95);
  const [showShadow, setShowShadow] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Drag state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posAtDragStart = useRef({ x: 0, y: 0 });

  // Pinch state
  const lastPinchDist = useRef(0);
  const lastPinchAngle = useRef(0);
  const scaleAtPinchStart = useRef(0.4);
  const rotAtPinchStart = useRef(0);

  // Load product image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = product.image;
    img.onload = () => {
      productImgRef.current = img;
    };
    return () => {
      img.onload = null;
    };
  }, [product.image]);

  // Start camera
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setArState('active');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setArState('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setArState('unsupported');
      } else {
        // Fallback - try without facingMode constraint
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
            setArState('active');
          }
        } catch {
          setArState('unsupported');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setArState('unsupported');
      return;
    }
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Switch camera
  const switchCamera = useCallback(() => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    startCamera(newFacing);
  }, [facingMode, startCamera]);

  // Render loop - draw video + product onto canvas
  useEffect(() => {
    if (arState !== 'active') return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (video.readyState >= 2) {
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const cw = canvas.width;
        const ch = canvas.height;

        // Cover mode for video
        const videoAspect = vw / vh;
        const canvasAspect = cw / ch;
        let sx = 0, sy = 0, sw = vw, sh = vh;
        if (videoAspect > canvasAspect) {
          sw = vh * canvasAspect;
          sx = (vw - sw) / 2;
        } else {
          sh = vw / canvasAspect;
          sy = (vh - sh) / 2;
        }

        // Mirror if front camera
        if (facingMode === 'user') {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, sx, sy, sw, sh, -cw, 0, cw, ch);
          ctx.restore();
        } else {
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
        }

        // Draw product overlay
        const img = productImgRef.current;
        if (img && img.complete) {
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const pWidth = cw * productScale;
          const pHeight = pWidth / imgAspect;
          const px = productPos.x * cw;
          const py = productPos.y * ch;

          ctx.save();
          ctx.globalAlpha = productOpacity;
          ctx.translate(px, py);
          ctx.rotate((productRotation * Math.PI) / 180);
          if (productFlipped) ctx.scale(-1, 1);

          // Draw shadow
          if (showShadow) {
            ctx.save();
            ctx.globalAlpha = 0.3 * productOpacity;
            ctx.filter = 'blur(15px)';
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(0, pHeight / 2 + 10, pWidth * 0.4, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Draw product
          ctx.drawImage(img, -pWidth / 2, -pHeight / 2, pWidth, pHeight);

          // Draw selection border (subtle)
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 4]);
          ctx.strokeRect(-pWidth / 2 - 4, -pHeight / 2 - 4, pWidth + 8, pHeight + 8);
          ctx.setLineDash([]);

          // Corner handles
          const handleSize = 12;
          const corners = [
            [-pWidth / 2 - 4, -pHeight / 2 - 4],
            [pWidth / 2 + 4, -pHeight / 2 - 4],
            [-pWidth / 2 - 4, pHeight / 2 + 4],
            [pWidth / 2 + 4, pHeight / 2 + 4],
          ];
          ctx.fillStyle = '#D4AF37';
          corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, handleSize / 2, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        }

        // AR scan lines effect (subtle)
        ctx.save();
        ctx.globalAlpha = 0.03;
        for (let y = 0; y < ch; y += 3) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, y, cw, 1);
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [arState, productPos, productScale, productRotation, productFlipped, productOpacity, showShadow, facingMode]);

  // Touch/Mouse handlers for dragging product
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check if touching the product area
    const img = productImgRef.current;
    if (img) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const pWidth = productScale;
      const pHeight = pWidth / imgAspect * (rect.width / rect.height);
      
      const dx = Math.abs(x - productPos.x);
      const dy = Math.abs(y - productPos.y);
      
      if (dx < pWidth / 2 + 0.05 && dy < pHeight / 2 + 0.05) {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        posAtDragStart.current = { ...productPos };
        canvas.setPointerCapture(e.pointerId);
      }
    }
  }, [productPos, productScale]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dx = (e.clientX - dragStart.current.x) / rect.width;
    const dy = (e.clientY - dragStart.current.y) / rect.height;

    setProductPos({
      x: Math.max(0.1, Math.min(0.9, posAtDragStart.current.x + dx)),
      y: Math.max(0.1, Math.min(0.9, posAtDragStart.current.y + dy)),
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Touch handlers for pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
      lastPinchAngle.current = Math.atan2(dy, dx) * (180 / Math.PI);
      scaleAtPinchStart.current = productScale;
      rotAtPinchStart.current = productRotation;
    }
  }, [productScale, productRotation]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (lastPinchDist.current > 0) {
        const scaleRatio = dist / lastPinchDist.current;
        const newScale = scaleAtPinchStart.current * scaleRatio;
        setProductScale(Math.max(0.15, Math.min(1.2, newScale)));

        const angleDiff = angle - lastPinchAngle.current;
        setProductRotation(rotAtPinchStart.current + angleDiff);
      }
    }
  }, []);

  // Capture screenshot
  const captureScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Temporarily hide selection border by re-rendering without it
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const video = videoRef.current;
    if (!video) return;

    // Create a separate canvas for screenshot (without UI overlays)
    const screenshotCanvas = document.createElement('canvas');
    screenshotCanvas.width = canvas.width;
    screenshotCanvas.height = canvas.height;
    const sCtx = screenshotCanvas.getContext('2d');
    if (!sCtx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = screenshotCanvas.width;
    const ch = screenshotCanvas.height;

    const videoAspect = vw / vh;
    const canvasAspect = cw / ch;
    let sx = 0, sy = 0, sw = vw, sh = vh;
    if (videoAspect > canvasAspect) {
      sw = vh * canvasAspect;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / canvasAspect;
      sy = (vh - sh) / 2;
    }

    if (facingMode === 'user') {
      sCtx.save();
      sCtx.scale(-1, 1);
      sCtx.drawImage(video, sx, sy, sw, sh, -cw, 0, cw, ch);
      sCtx.restore();
    } else {
      sCtx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    // Draw product (clean, no border)
    const img = productImgRef.current;
    if (img && img.complete) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const pWidth = cw * productScale;
      const pHeight = pWidth / imgAspect;
      const px = productPos.x * cw;
      const py = productPos.y * ch;

      sCtx.save();
      sCtx.globalAlpha = productOpacity;
      sCtx.translate(px, py);
      sCtx.rotate((productRotation * Math.PI) / 180);
      if (productFlipped) sCtx.scale(-1, 1);

      if (showShadow) {
        sCtx.save();
        sCtx.globalAlpha = 0.35 * productOpacity;
        sCtx.filter = 'blur(20px)';
        sCtx.fillStyle = '#000';
        sCtx.beginPath();
        sCtx.ellipse(0, pHeight / 2 + 12, pWidth * 0.4, 18, 0, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.restore();
      }

      sCtx.drawImage(img, -pWidth / 2, -pHeight / 2, pWidth, pHeight);
      sCtx.restore();
    }

    // Add watermark
    sCtx.save();
    sCtx.globalAlpha = 0.6;
    sCtx.fillStyle = '#D4AF37';
    sCtx.font = `bold ${14 * window.devicePixelRatio}px Cairo, sans-serif`;
    sCtx.textAlign = 'right';
    sCtx.fillText('بيت الريف AR', cw - 20, ch - 20);
    sCtx.restore();

    const dataUrl = screenshotCanvas.toDataURL('image/jpeg', 0.92);
    capturedImageRef.current = dataUrl;
    setCapturedImage(dataUrl);
    setArState('captured');
  }, [productPos, productScale, productRotation, productFlipped, productOpacity, showShadow, facingMode]);

  // Download captured image
  const downloadImage = useCallback(() => {
    if (!capturedImageRef.current) return;
    const link = document.createElement('a');
    link.download = `بيت_الريف_AR_${product.name.replace(/\s/g, '_')}.jpg`;
    link.href = capturedImageRef.current;
    link.click();
  }, [product.name]);

  // Return to AR view from captured state
  const returnToAR = useCallback(() => {
    setCapturedImage('');
    setArState('active');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // --- RENDER ---

  // Error / Permission screens
  if (arState === 'denied') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-cairo text-white p-8">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <Camera className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-xl font-bold mb-3 text-center">الكاميرا غير مفعّلة</h2>
        <p className="text-gray-400 text-center text-sm mb-8 max-w-xs leading-relaxed">
          يحتاج وضع الواقع المعزز إلى صلاحية الوصول للكاميرا. يرجى السماح بالوصول من إعدادات المتصفح ثم المحاولة مجدداً.
        </p>
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              setArState('requesting');
              startCamera(facingMode);
            }}
            className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl"
          >
            إعادة المحاولة
          </button>
          <button onClick={onClose} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10">
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  if (arState === 'unsupported') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-cairo text-white p-8">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
          <Camera className="w-10 h-10 text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold mb-3 text-center">الكاميرا غير متوفرة</h2>
        <p className="text-gray-400 text-center text-sm mb-8 max-w-xs leading-relaxed">
          جهازك أو متصفحك لا يدعم الوصول المباشر للكاميرا. جرّب استخدام متصفح Chrome أو Safari على هاتفك.
        </p>
        <button onClick={onClose} className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-xl">
          العودة للمنتج
        </button>
      </div>
    );
  }

  // Captured screenshot view
  if (arState === 'captured' && capturedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col font-cairo">
        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
          <button onClick={returnToAR} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-[#D4AF37]/90 backdrop-blur-md px-4 py-2 rounded-full text-black text-xs font-bold">
            تم التقاط الصورة!
          </div>
        </div>

        {/* Captured image */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img src={capturedImage} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="AR capture" />
        </div>

        {/* Bottom actions */}
        <div className="p-6 pb-10 space-y-3">
          <button
            onClick={downloadImage}
            className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-base"
          >
            <Download className="w-5 h-5" />
            حفظ الصورة
          </button>
          <button
            onClick={returnToAR}
            className="w-full bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 border border-white/10 text-base"
          >
            <Camera className="w-5 h-5" />
            التقاط صورة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-cairo" dir="rtl">
      {/* Hidden video element for camera stream */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="hidden"
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>الواقع المعزز مباشر</span>
          </div>
        </div>

        <button
          onClick={switchCamera}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>
      </div>

      {/* AR Canvas - Full screen */}
      <canvas
        ref={canvasRef}
        className="flex-1 w-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      />

      {/* Loading overlay */}
      {arState === 'requesting' && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-30">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-[#D4AF37]/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-[#D4AF37] rounded-full animate-spin" />
            <Camera className="absolute inset-0 m-auto w-10 h-10 text-[#D4AF37]" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">جارٍ تشغيل الكاميرا...</h3>
          <p className="text-gray-500 text-sm">يرجى السماح بالوصول للكاميرا</p>
        </div>
      )}

      {/* Product info bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold z-20 max-w-[80%] truncate">
        {product.name} — {product.price.toLocaleString()} د.إ
      </div>

      {/* Instruction hint */}
      {showControls && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 animate-pulse">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-[11px] flex items-center gap-2 border border-white/10">
            <Move className="w-3.5 h-3.5 text-[#D4AF37]" />
            اسحب المنتج لتحريكه • اقرص للتكبير والتدوير
          </div>
        </div>
      )}

      {/* Side Controls */}
      {showControls && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button
            onClick={() => setProductScale(s => Math.min(1.2, s + 0.05))}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setProductScale(s => Math.max(0.1, s - 0.05))}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setProductRotation(r => r + 15)}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setProductFlipped(f => !f)}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowShadow(s => !s)}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ${showShadow ? 'bg-[#D4AF37]/70 text-black' : 'bg-black/50 text-white'}`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowControls(false)}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Show controls button when hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-10 px-6">
          {/* Size Slider */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-gray-400 text-[10px] min-w-[40px]">الحجم</span>
            <input
              type="range"
              min="10"
              max="100"
              value={Math.round(productScale * 100)}
              onChange={(e) => setProductScale(Number(e.target.value) / 100)}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-[#D4AF37] text-[10px] font-bold min-w-[30px] text-left">{Math.round(productScale * 100)}%</span>
          </div>

          {/* Opacity Slider */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-gray-400 text-[10px] min-w-[40px]">الشفافية</span>
            <input
              type="range"
              min="30"
              max="100"
              value={Math.round(productOpacity * 100)}
              onChange={(e) => setProductOpacity(Number(e.target.value) / 100)}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-[#D4AF37] text-[10px] font-bold min-w-[30px] text-left">{Math.round(productOpacity * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setProductPos({ x: 0.5, y: 0.6 });
                setProductScale(0.4);
                setProductRotation(0);
                setProductFlipped(false);
                setProductOpacity(0.95);
              }}
              className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={captureScreenshot}
              className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 text-base"
            >
              <Camera className="w-5 h-5" />
              التقاط صورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}