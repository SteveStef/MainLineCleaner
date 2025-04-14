import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Monday, April 5 2025
export function translateDateToSpanish(dateString: string) {

  const daysOfWeek = {
    "Monday": "Lunes",
    "Tuesday": "Martes",
    "Wednesday": "Miércoles",
    "Thursday": "Jueves",
    "Friday": "Viernes",
    "Saturday": "Sábado",
    "Sunday": "Domingo"
  };

  const months = {
    "January": "Enero",
    "February": "Febrero",
    "March": "Marzo",
    "April": "Abril",
    "May": "Mayo",
    "June": "Junio",
    "July": "Julio",
    "August": "Agosto",
    "September": "Septiembre",
    "October": "Octubre",
    "November": "Noviembre",
    "December": "Diciembre"
  };

  // Split the input string by comma to separate day of week from the rest
  const parts = dateString.split(", ");
  if (parts.length < 2) {
    throw new Error("Invalid date format");
  }

  // Get the day-of-week and remaining part ("April 5 2025")
  const dayOfWeekEng = parts[0];
  const restParts = parts[1].split(" ");
  if (restParts.length < 3) {
    throw new Error("Invalid date format");
  }
  
  // Extract the month, day, and year
  const monthEng = restParts[0];
  const day = restParts[1];
  const year = restParts[2];

  // Lookup the Spanish translations
  const dayOfWeekEsp = daysOfWeek[dayOfWeekEng];
  const monthEsp = months[monthEng];

  if (!dayOfWeekEsp || !monthEsp) {
    throw new Error("Invalid day or month");
  }

  return `${dayOfWeekEsp}, ${day} de ${monthEsp} de ${year}`;
}
