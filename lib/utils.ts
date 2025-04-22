import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToSpanish(
  dateString: string,
  short: boolean = false
): string {
  // Parse the input into a Date object
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  // Spanish day and month names
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const monthsShort = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthIndex = date.getMonth();
  const monthName = months[monthIndex];
  const monthAbbrev = monthsShort[monthIndex];
  const year = date.getFullYear();

  if (short) {
    // e.g. "abr 25, 2025"
    return `${monthAbbrev} ${dayNum}, ${year}`;
  }

  // Full format: "Viernes, 25 de abril de 2025"
  return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
}

export async function tes(text: string) {
  try {
    const url = "https://translation.googleapis.com/language/translate/v2?key=" + process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        target: "es",
      })
    });

    const data = await response.json();

    if(!response.ok) {
      return text;
    }
    return data.data.translations[0].translatedText;
  } catch(err) {
    console.log(err);
    return text;
  }
}


