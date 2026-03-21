import { useState, useEffect, useMemo } from 'react';
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

  // Exact LeetCode Dark Theme Colors
  const getColorClass = (count) => {
    if (count === 0) return 'bg-[#3e3e3e] hover:ring-gray-500'; // Dark gray for empty
    if (count === 1) return 'bg-[#00441b] hover:ring-[#006d2c]'; // Lightest activity
    if (count === 2) return 'bg-[#006d2c] hover:ring-[#2ca25f]'; 
    if (count === 3) return 'bg-[#2ca25f] hover:ring-[#66c2a4]'; 
    return 'bg-[#39d353] hover:ring-[#80ff9f]'; // Highest activity
  };

  if (isLoading) {
    return <div className="h-48 bg-[#282828] animate-pulse rounded-xl mb-8"></div>;
  }

  return (
    <div className="bg-[#282828] rounded-xl p-5 mb-8 text-gray-300 font-sans shadow-lg">
      
      {/* Header Stats - Matched exactly to the screenshot's minimalist style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
        <h3 className="text-[15px] text-gray-300">
          <span className="font-semibold text-white text-lg mr-1">{activityData.totalSubmissions}</span> 
          submissions in the past one year
        </h3>
        <div className="flex gap-4 text-[13px] text-gray-400">
          <p>Total active days: <span className="text-white font-semibold ml-1">{activityData.activeDays}</span></p>
          <p>Max streak: <span className="text-white font-semibold ml-1">{activityData.maxStreak}</span></p>
        </div>
      </div>

      {/* Heatmap Area */}
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        {/* Gap-3 between months creates that distinct column break from the screenshot */}
        <div className="flex gap-3 min-w-max">
          {activityData.monthsData.map((month, mIndex) => (
            <div key={mIndex} className="flex flex-col gap-1.5">
              
              {/* Gap-[3px] creates the tight grid inside each month */}
              <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                {month.days.map((day, dIndex) => {
                  if (day.isPadding) {
                    return <div key={`pad-${dIndex}`} className="w-[13px] h-[13px] rounded-sm bg-transparent"></div>;
                  }
                  
                  return (
                    <div
                      key={dIndex}
                      title={`${day.count} submissions on ${day.displayDate}`}
                      className={`w-[13px] h-[13px] rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-offset-1 hover:ring-offset-[#282828] ${getColorClass(day.count)}`}
                    ></div>
                  );
                })}
              </div>

              {/* Month Label */}
              <span className="text-xs text-gray-400 font-medium pl-1 mt-1 text-center w-full block">
                {month.label}
              </span>
              
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-4 text-xs text-gray-400 gap-2">
        <span>Less</span>
        <div className="flex gap-[3px] mx-1">
          <div className="w-[13px] h-[13px] rounded-sm bg-[#3e3e3e]"></div>
          <div className="w-[13px] h-[13px] rounded-sm bg-[#00441b]"></div>
          <div className="w-[13px] h-[13px] rounded-sm bg-[#006d2c]"></div>
          <div className="w-[13px] h-[13px] rounded-sm bg-[#2ca25f]"></div>
          <div className="w-[13px] h-[13px] rounded-sm bg-[#39d353]"></div>
        </div>
        <span>More</span>
      </div>

    </div>
  );
};

export default ActivityHeatmap;
// important 