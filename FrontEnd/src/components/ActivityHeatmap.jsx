import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../utils/axiosClient';

const ActivityHeatmap = () => {
  const [realActivity, setRealActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await axiosClient.get('/user/activity'); 
        setRealActivity(data);
      } catch (error) {
        console.error("Failed to fetch activity heatmap data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  // Process data into separated month blocks
  const activityData = useMemo(() => {
    let totalSubmissions = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    // Fast lookup dictionary for dates
    const activityMap = realActivity.reduce((acc, curr) => {
      acc[curr.date] = curr.count;
      return acc;
    }, {});

    const monthsData = [];
    let currentMonthNumber = -1;

    // Generate the last 365 days
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const month = d.getMonth();
      const year = d.getFullYear();
      
      // Force safe local date strings (YYYY-MM-DD)
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      const localDateString = `${year}-${monthStr}-${dayStr}`;

      // If we entered a new month, create a new month block
      if (month !== currentMonthNumber) {
        currentMonthNumber = month;
        monthsData.push({
          label: d.toLocaleString('default', { month: 'short' }),
          days: [],
        });

        // Add invisible padding so the first day aligns with the correct day of the week (Sun=0, Sat=6)
        const dayOfWeek = d.getDay();
        for (let pad = 0; pad < dayOfWeek; pad++) {
          monthsData[monthsData.length - 1].days.push({ isPadding: true });
        }
      }

      // Look up stats for the current day
      const count = activityMap[localDateString] || 0;

      if (count > 0) {
        totalSubmissions += count;
        activeDays++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0; // Reset streak
      }

      // Push the real day into the current month block
      monthsData[monthsData.length - 1].days.push({
        date: d,
        dateString: localDateString,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count,
        isPadding: false
      });
    }

    return { monthsData, totalSubmissions, activeDays, maxStreak };
  }, [realActivity]);

  const getColorClass = (count) => {
    if (count === 0) return 'bg-[#2c303b] hover:ring-gray-500';
    if (count === 1) return 'bg-[#0e4429] hover:ring-green-700';
    if (count === 2) return 'bg-[#006d32] hover:ring-green-600';
    if (count === 3) return 'bg-[#26a641] hover:ring-green-400';
    return 'bg-[#39d353] hover:ring-green-300'; 
  };

  if (isLoading) {
    return <div className="h-48 bg-[#151821] animate-pulse rounded-3xl border border-gray-800 mb-8 shadow-xl"></div>;
  }

  return (
    <div className="bg-[#151821] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl">
      
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-gray-200 text-lg">
          <span className="font-bold text-white text-xl mr-2">{activityData.totalSubmissions}</span> 
          submissions in the past year
        </h3>
        <div className="flex gap-6 text-sm text-gray-400 bg-[#1a1e2a] px-5 py-2.5 rounded-xl border border-gray-800/60">
          <p>Active Days: <span className="text-white font-bold ml-1">{activityData.activeDays}</span></p>
          <div className="w-px bg-gray-700"></div>
          <p>Max Streak: <span className="text-white font-bold ml-1">{activityData.maxStreak}</span></p>
        </div>
      </div>

      {/* Heatmap Area */}
      <div className="overflow-x-auto pb-6 custom-scrollbar">
        {/* CHANGED: gap-4 sm:gap-6 is now gap-2 sm:gap-3 for tighter month spacing */}
        <div className="flex gap-2 sm:gap-3 min-w-max">
          {activityData.monthsData.map((month, mIndex) => (
            <div key={mIndex} className="flex flex-col gap-1.5">
              
              {/* Grid of days for this specific month */}
              {/* CHANGED: gap-1.5 to gap-1 so the squares inside the month are also perfectly snug */}
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {month.days.map((day, dIndex) => {
                  if (day.isPadding) {
                    return <div key={`pad-${dIndex}`} className="w-3 h-3 rounded-[3px] bg-transparent"></div>;
                  }
                  
                  return (
                    <div
                      key={dIndex}
                      title={`${day.count} submissions on ${day.displayDate}`}
                      className={`w-3 h-3 rounded-[3px] cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 hover:ring-offset-[#151821] ${getColorClass(day.count)}`}
                    ></div>
                  );
                })}
              </div>

              {/* Month Label */}
              <span className="text-xs text-gray-500 font-medium pl-1 mt-1">
                {month.label}
              </span>
              
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-2 text-xs text-gray-400 gap-2">
        <span>Less</span>
        <div className="flex gap-1 mx-1">
          <div className="w-3 h-3 rounded-[3px] bg-[#2c303b]"></div>
          <div className="w-3 h-3 rounded-[3px] bg-[#0e4429]"></div>
          <div className="w-3 h-3 rounded-[3px] bg-[#006d32]"></div>
          <div className="w-3 h-3 rounded-[3px] bg-[#26a641]"></div>
          <div className="w-3 h-3 rounded-[3px] bg-[#39d353]"></div>
        </div>
        <span>More</span>
      </div>

    </div>
  );
};

export default ActivityHeatmap;