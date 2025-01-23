

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to call the function after the specified delay
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
