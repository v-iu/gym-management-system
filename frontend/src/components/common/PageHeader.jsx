export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">
          {title}
        </h1>

        {subtitle && (
          <div className="inline-block mt-3
                          px-4 py-2 rounded-xl
                          bg-black/40 backdrop-blur-sm
                          border border-green-400/20
                          shadow-[0_0_15px_rgba(0,255,120,0.08)]">
            <p className="text-base text-green-300 tracking-wide">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
 className="px-4 py-2 rounded-xl
             bg-green-500 hover:bg-green-400
             text-black font-semibold
             shadow-[0_0_20px_rgba(0,255,120,0.35)]
             transition-all duration-200"
        >
          <span className="text-lg leading-none">+</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

