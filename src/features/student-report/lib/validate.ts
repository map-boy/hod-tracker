export const normalizeCourse = (v: string): string => v.toUpperCase().replace(/[^A-Z0-9]/g, '');

export const isCourse = (v: string): boolean => /^[A-Z]{2,4}\d{3}$/.test(normalizeCourse(v));

export const isRegNo = (v: string): boolean => /^\d{6,12}$/.test(v.trim());

export function normalizePhone(v: string): string | null {
  const m = /^(?:\+?250|0)?(7[2389]\d{7})$/.exec(v.replace(/[\s-]/g, ''));
  return m ? `+250${m[1]}` : null;
}
