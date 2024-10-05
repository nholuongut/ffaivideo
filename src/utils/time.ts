const mktimestamp = (time_unit: number) => {
  const hour = Math.floor(time_unit / 10 ** 7 / 3600);
  const minute = Math.floor((time_unit / 10 ** 7 / 60) % 60);
  const seconds = (time_unit / 10 ** 7) % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
};

const formatter = (
  idx: number,
  startTime: number,
  endTime: number,
  subText: string,
): string => {
  const startT = mktimestamp(startTime).replace('.', ',');
  const endT = mktimestamp(endTime).replace('.', ',');
  return `${idx}\n${startT} --> ${endT}\n${subText}\n`;
};

export { mktimestamp, formatter };
