interface Movement {
  id: number;
  concept: string;
  amount: number | string;
}

interface QuincenaTableProps {
  title: string;
  dateRange: string;
  headerColor: string; // e.g., 'bg-[#93c5fd]'
  subheaderColor: string; // e.g., 'bg-[#dbeafe]'
  movements: Movement[];
  total: number | string;
}

export function QuincenaTable({
  title,
  dateRange,
  headerColor,
  subheaderColor,
  movements,
  total
}: QuincenaTableProps) {
  // Pad movements with empty rows to always show 6 rows for consistency
  const displayMovements = [...movements];
  while (displayMovements.length < 6) {
    displayMovements.push({ id: displayMovements.length + 1, concept: '-', amount: '-' });
  }

  return (
    <div className="pixel-table-box bg-white rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className={`${headerColor} p-3 border-b-2 border-black flex items-center space-x-3`}>
        <div className="w-9 h-9 bg-white border-2 border-black rounded-lg flex items-center justify-center text-lg shadow-sm">
          🗓️
        </div>
        <div>
          <h2 className="font-bold text-base text-gray-900 leading-none">{title}</h2>
          <p className="text-xs text-gray-700 font-semibold mt-1">{dateRange}</p>
        </div>
      </div>

      {/* Table Column Headers */}
      <div className={`grid grid-cols-12 ${subheaderColor} border-b-2 border-black text-xs font-bold text-gray-800 py-1.5 px-2`}>
        <span className="col-span-2 text-center">#</span>
        <span className="col-span-6">Concepto</span>
        <span className="col-span-4 text-right">Monto</span>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200 text-xs sm:text-sm font-medium flex-1 bg-white">
        {displayMovements.map((mov, idx) => (
          <div key={idx} className="grid grid-cols-12 px-2 py-2 items-center bg-white hover:bg-slate-50 transition-colors">
            <span className="col-span-2 text-center text-gray-500 font-bold">{idx + 1}</span>
            <span className={`col-span-6 font-semibold ${mov.concept === '-' ? 'text-gray-400 font-bold' : 'text-gray-900'}`}>
              {mov.concept}
            </span>
            <span className={`col-span-4 text-right font-mono font-bold ${mov.amount === '-' ? 'text-gray-400' : 'text-gray-800'}`}>
              {mov.amount !== '-' && typeof mov.amount === 'number' ? mov.amount.toLocaleString('es-CO') : mov.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Total Footer */}
      <div className="bg-[#dcfce7] border-t-2 border-black p-2 px-3 flex justify-between items-center text-sm font-bold text-gray-900">
        <span>Total</span>
        <span className="font-mono font-black text-base">
          {typeof total === 'number' ? total.toLocaleString('es-CO') : total}
        </span>
      </div>
    </div>
  );
}
