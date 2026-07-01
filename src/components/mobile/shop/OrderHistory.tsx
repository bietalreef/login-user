import { useShopStore, Order } from './ShopStore';
import { ArrowRight, Package, RefreshCw, ChevronLeft, MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useTranslation } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

export function OrderHistory() {
  const { orders, setCurrentView, setSelectedOrder, addToCart } = useShopStore();
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };
  const currency = isEn ? 'AED' : 'د.إ';

  const handleReorder = (order: Order) => {
    order.items.forEach(item => addToCart(item));
    setCurrentView('cart');
  };

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('tracking');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          label: isEn ? 'Delivered' : 'تم التوصيل',
          class: 'bg-[#2AA676]/15 text-[#2AA676] border border-[#2AA676]/20',
        };
      case 'shipped':
        return {
          label: isEn ? 'Shipping' : 'جاري التوصيل',
          class: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
        };
      case 'processing':
        return {
          label: isEn ? 'Processing' : 'قيد المعالجة',
          class: 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20',
        };
      default:
        return {
          label: isEn ? 'Pending' : 'قيد الانتظار',
          class: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto pb-4" style={{ fontFamily }}>
      <div className="p-4 flex items-center gap-4 sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10 border-b border-white/5">
        <button onClick={() => setCurrentView('home')} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg flex-1" style={{ fontFamily, textAlign }}>
          {isEn ? 'My Orders' : 'طلباتي'}
        </h1>
        {orders.length > 0 && (
          <span className="text-xs text-gray-500" style={{ fontFamily }}>
            {orders.length} {isEn ? 'orders' : 'طلب'}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Package className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily }}>
              {isEn ? 'No orders yet' : 'لا توجد طلبات بعد'}
            </h3>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto" style={{ fontFamily }}>
              {isEn
                ? 'Start shopping and your orders will appear here'
                : 'ابدأ التسوق وستظهر طلباتك هنا'}
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-[#D4AF37] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#B5952F] transition-colors"
              style={{ fontFamily }}
            >
              {isEn ? 'Browse Products' : 'تصفح المنتجات'}
            </button>
          </motion.div>
        ) : (
          orders.map((order, idx) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-[#252525] rounded-2xl p-4 border border-white/5"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white" style={{ fontFamily }}>
                      #{order.id}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusInfo.class}`} style={{ fontFamily }}>
                    {statusInfo.label}
                  </div>
                </div>

                {/* Order Items */}
                {order.items.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
                    {order.items.map((item) => (
                      <div key={item.id} className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-black border border-white/5">
                        <ImageWithFallback src={item.image} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-[#1A1A1A] border border-white/5 flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-bold">+{order.items.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Info */}
                {order.customer && (
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span style={{ fontFamily }}>{order.customer.city} — {order.customer.fullName}</span>
                  </div>
                )}

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="font-bold text-[#D4AF37]" style={{ fontFamily }}>
                    {order.total.toLocaleString()} {currency}
                  </span>
                  <div className="flex gap-2">
                    {(order.status === 'processing' || order.status === 'shipped') && (
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-[#D4AF37]/20"
                        style={{ fontFamily }}
                      >
                        {isEn ? 'Track' : 'تتبع'}
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        style={{ fontFamily }}
                      >
                        <RefreshCw className="w-3 h-3" /> {isEn ? 'Reorder' : 'إعادة الطلب'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}