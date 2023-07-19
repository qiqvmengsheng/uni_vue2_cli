const mockdata = (interval = 30) => {
  const time = Date.now();
  const data = {
    Radon: [],
    RadonAt: [],
    FastRadon: [],
    Thoron: [],
    temperature: [],
    Pressure: [],
    humidity: [],
    Sample_Interval: [],
    RadonError: [],
    ThoronError: [],
  };
  for (let i = 1; i <= 38; i += 1) {
    data[`Plot_${i}`] = `Plot_${i}`;
  }
  for (let i = 0; i < 100; i += 1) {
    data.Radon.push((40000 + Math.random() * 10000).toFixed(2));
    data.RadonAt.push(
      uni.$u.timeFormat(
        time - (100 - i) * 1000 * 60 * interval,
        'yyyy-mm-dd hh:MM:ss'
      )
    );
    data.Thoron.push((Math.random() * 10000).toFixed(2));
    data.temperature.push((20 + Math.random() * 3).toFixed(1));
    data.Pressure.push((900 + Math.random() * 3).toFixed(2));
    data.humidity.push((60 + Math.random() * 5).toFixed(2));
    data.Sample_Interval.push(interval);
  }
  return data;
};

export default mockdata;
