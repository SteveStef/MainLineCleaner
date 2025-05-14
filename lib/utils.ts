import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/date.ts
import { parse, parseISO, isValid } from 'date-fns'

export function formatDateToSpanish(
  dateInput: Date | string | number,
  short: boolean = false
): string {

  const mpDays: Record<string, string> = {
    Mon: "Lunes",
    Tue: "Martes",
    Wed: "Miércoles",
    Thu: "Jueves",
    Fri: "Viernes",
    Sat: "Sábado",
    Sun: "Domingo",
  }

  let date: Date

  if (typeof dateInput === "string" && dateInput.length === 3) {
    const translated = mpDays[dateInput as keyof typeof mpDays]
    if (translated) {
      return short ? translated.slice(0, 3) : translated
    }
  }
  if (dateInput instanceof Date) {
    date = dateInput
  }
  // 2) Accept a timestamp
  else if (typeof dateInput === 'number') {
    date = new Date(dateInput)
  }
  // 3) Otherwise assume string → try ISO, JS Date, then common patterns
  else {
    // try ISO first
    date = parseISO(dateInput)
    if (!isValid(date)) {
      // next, JS Date constructor
      date = new Date(dateInput)
    }
    if (!isValid(date)) {
      // finally, try a few custom formats
      const FORMATS = [
        'yyyy-MM-dd',
        'MM/dd/yyyy',
        'dd/MM/yyyy',
        'MMM d, yyyy',
        'MMMM d, yyyy',
        'MMM d',
        'MMMM d',
      ]
      for (const fmt of FORMATS) {
        const tryDate = parse(dateInput, fmt, new Date())
        if (isValid(tryDate)) {
          date = tryDate
          break
        }
      }
    }
  }

  if (!isValid(date)) {
    console.warn('Invalid date:', dateInput)
    return String(dateInput)
  }

  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ]
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  const monthsShort = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ]

  const dayName = days[date.getDay()]
  const dayNum = date.getDate()
  const monthIndex = date.getMonth()
  const monthName = months[monthIndex]
  const monthAbbrev = monthsShort[monthIndex]
  const year = date.getFullYear()

  if (short) {
    return `${monthAbbrev} ${dayNum}, ${year}`
  }
  return `${dayName}, ${dayNum} de ${monthName} de ${year}`
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

export async function baseRequest(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    if(body && method !== "GET") {
      if(typeof body === "object" || Array.isArray(body)) {
        options["body"] = JSON.stringify(body);
      } else {
        options["body"] = body;
      }
    }
    return await fetch(url, options);
  } catch(err) {
    console.log(err);
    return null;
  }
}
