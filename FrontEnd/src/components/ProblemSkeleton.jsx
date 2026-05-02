import React from 'react';

const ProblemSkeleton = () => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center border-b border-[#2a2e3a] bg-[#1a1e2a] animate-pulse">
      <div className="col-span-1 flex justify-center">
        <div className="w-5 h-5 rounded-full bg-slate-700"></div>
      </div>
      
      <div className="col-span-6 md:col-span-7 flex items-center">
        <div className="w-3/5 max-w-[300px] h-5 rounded bg-slate-700"></div>
      </div>
      
      <div className="col-span-3 md:col-span-2 flex justify-center">
        <div className="w-16 h-5 rounded bg-slate-700"></div>
      </div>
      
      <div className="col-span-2 hidden md:flex justify-center">
        <div className="w-12 h-5 rounded bg-slate-700"></div>
      </div>
    </div>
  );
};

export default ProblemSkeleton;
