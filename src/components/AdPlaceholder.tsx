interface Props {
  id?: string;
}

export default function AdPlaceholder({ id }: Props) {
  return (
    <div
      id={id}
      className="w-full h-24 flex items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800/50 text-slate-500 text-sm font-mono tracking-widest select-none"
    >
      {/* Replace with Google AdSense code */}
      Advertisement Space
    </div>
  );
}
