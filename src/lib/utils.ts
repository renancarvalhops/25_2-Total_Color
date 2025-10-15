import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mod(value: number, modulus: number): number {
  const valueInt = Math.floor(value);
  const modulusInt = Math.floor(modulus);

  return ((valueInt % modulusInt) + modulusInt) % modulusInt;
}
