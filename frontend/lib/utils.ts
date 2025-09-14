// Utility function to concatenate class names conditionally
// Similar to the popular 'clsx' or 'classnames' libraries
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
