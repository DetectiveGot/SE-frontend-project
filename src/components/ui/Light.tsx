'use client'

export default function Light() {
  return (
    <div className=
    "fixed top-4 left-4 flex w-27 h-9 rounded-full bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.18),_0_8px_20px_rgba(0,0,0,0.1)]  gap-2 items-center justify-center">
      
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-700 to-red-400"></div>
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-700 to-green-300"></div>
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-300"></div>
    </div>
  );
}
