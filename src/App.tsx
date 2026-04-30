import { useRef, useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Bot, User, DatabaseZap } from 'lucide-react';

// 1. GENERATOR AMUNISI: Membuat 100.000 Data Dummy dalam hitungan milidetik
const generateMockData = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    sender: i % 2 === 0 ? 'Bot' : 'User',
    message: `[Log ID: ${i}] Mengirimkan paket data terenkripsi. Status analitik AI menunjukkan tingkat akurasi 99.8%. Menunggu respons server...`,
    timestamp: new Date(Date.now() - i * 10000).toLocaleTimeString(),
  }));
};

const App = () => {
  const [logCount] = useState(100000);
  const data = useMemo(() => generateMockData(logCount), [logCount]);

  // 2. REF & VIRTUALIZER: Inti dari manipulasi DOM
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimasi tinggi setiap baris chat dalam pixel
    overscan: 5, // Merender 5 item ekstra di luar layar untuk kelancaran scrolling
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 flex flex-col items-center font-sans">
      
      {/* HEADER DASHBOARD */}
      <div className="w-full max-w-4xl mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-3">
            <DatabaseZap className="w-8 h-8" />
            Log.ai Enterprise Log Monitor
          </h1>
          <p className="text-slate-400 mt-1">
            Mendemonstrasikan <span className="text-emerald-400 font-bold">Zero-Lag Rendering</span> pada {logCount.toLocaleString()} baris data menggunakan DOM Virtualization.
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Active Nodes in DOM</p>
          <p className="text-2xl font-mono text-emerald-400">{rowVirtualizer.getVirtualItems().length}</p>
        </div>
      </div>

      {/* CONTAINER VIRTUALIZATION */}
      <div 
        ref={parentRef}
        className="w-full max-w-4xl h-[600px] overflow-auto bg-slate-800 rounded-xl border border-slate-700 shadow-2xl relative custom-scrollbar"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const chat = data[virtualRow.index];
            const isBot = chat.sender === 'Bot';

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="px-6 py-3 border-b border-slate-700/50 flex items-start gap-4 hover:bg-slate-700/30 transition-colors"
              >
                <div className={`p-2 rounded-full ${isBot ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm font-semibold ${isBot ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {chat.sender}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed truncate max-w-2xl">
                    {chat.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default App;