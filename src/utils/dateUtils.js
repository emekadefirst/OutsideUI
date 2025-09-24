// utils/dateUtils.js
export const formatDateTime = (timeArray) => {
  if (!timeArray || timeArray.length === 0) {
    return { date: 'TBD', time: 'TBD', endTime: null };
  }
  
  const startDate = new Date(timeArray[0]);
  const endDate = timeArray.length > 1 ? new Date(timeArray[1]) : null;
  
  const dateOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  };
  
  const formattedDate = startDate.toLocaleDateString('en-US', dateOptions);
  const formattedTime = startDate.toLocaleTimeString('en-US', timeOptions);
  
  return { 
    date: formattedDate, 
    time: formattedTime,
    endTime: endDate ? endDate.toLocaleTimeString('en-US', timeOptions) : null
  };
};