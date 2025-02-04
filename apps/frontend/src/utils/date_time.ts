
export function formatTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);

  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${period}`;
}


export function formatDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput);


  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  const isYesterday = diffTime >= oneDay && diffTime < 2 * oneDay;
  const isToday = diffTime < oneDay;

  function formatStandardDate(d: Date): string {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear().toString().slice(-2);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const isAM = hours < 12;
    hours = hours % 12 || 12;
    const ampm = isAM ? 'AM' : 'PM';

    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  }

  if (isYesterday) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
    return `Yesterday at ${formattedTime}`;
  }

  if (isToday) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
    return `Today at ${formattedTime}`;
  }

  return formatStandardDate(date);
}
