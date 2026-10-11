export const getGreeting = (name?: string) => {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  return name ? `${greeting}, ${name}` : greeting;
};