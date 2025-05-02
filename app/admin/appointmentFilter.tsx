"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { isWithinInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon, Search, X, Filter } from "lucide-react"

// Define the appointment type based on your data structure
interface Appointment {
  id: string
  bookingId: string
  clientName: string
  appointmentDate: string
  time: string
  service: string
  email: string
  phone: string
  address: string
  status: string
  notes: string
  notesES: string
}

interface FilterOptions {
  searchTerm: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
  status: string | null
  service: string | null
}

// Filter hook
function useAppointmentFilter(appointments: Appointment[]) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchTerm: "",
    dateRange: {
      from: null,
      to: null,
    },
    status: null,
    service: "",
  })

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments)

  // Update filters
  const updateFilter = (newFilterOptions: Partial<FilterOptions>) => {
    setFilterOptions((prev) => ({
      ...prev,
      ...newFilterOptions,
    }))
  }

  // Filter function
  const filterAppointments = () => {
    return appointments.filter((appointment) => {
      // Search term filter (checks multiple fields)
      if (filterOptions.searchTerm) {
        const searchTerm = filterOptions.searchTerm.toLowerCase()
        const searchableFields = [
          appointment.clientName,
          appointment.bookingId,
          appointment.email,
          appointment.phone,
          appointment.address,
          appointment.status, // Include status for filtering by status terms
        ]

        const matchesSearch = searchableFields.some((field) => field?.toLowerCase().includes(searchTerm))

        if (!matchesSearch) return false
      }

      // Date range filter
      if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
        const appointmentDate = new Date(appointment.appointmentDate)

        if (filterOptions.dateRange.from && filterOptions.dateRange.to) {
          // Both from and to dates are set
          if (
            !isWithinInterval(appointmentDate, {
              start: filterOptions.dateRange.from,
              end: filterOptions.dateRange.to,
            })
          ) {
            return false
          }
        } else if (filterOptions.dateRange.from) {
          // Only from date is set
          if (appointmentDate < filterOptions.dateRange.from) {
            return false
          }
        } else if (filterOptions.dateRange.to) {
          // Only to date is set
          if (appointmentDate > filterOptions.dateRange.to) {
            return false
          }
        }
      }

      // Status filter
      if (filterOptions.status && filterOptions.status !== "all" && appointment.status !== filterOptions.status) {
        return false
      }

      // Service filter
      if (filterOptions.service && filterOptions.service !== "all" && appointment.service !== filterOptions.service) {
        return false
      }

      // If all filters pass, include this appointment
      return true
    })
  }

  // Update filtered appointments whenever filter options or appointments change
  useEffect(() => {
    setFilteredAppointments(filterAppointments())
  }, [filterOptions, appointments])

  return {
    filteredAppointments,
    filterOptions,
    updateFilter,
  }
}

export default function AppointmentsTable({
  appointments,
  language,
  t,
  formatDateToSpanish,
  getStatusBadge,
  tes,
  setSelectedAppointment,
  setIsEditDialogOpen,
}) {
  const { filteredAppointments, filterOptions, updateFilter } = useAppointmentFilter(appointments)
  const services = [...new Set(appointments.map((app) => app.service))]

  // Clear all filters
  const clearFilters = () => {
    updateFilter({
      searchTerm: "",
      dateRange: { from: null, to: null },
      status: null,
      service: "",
    })
  }

  return (
    <Card className="border-blue-100 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
        </div>
        <CardTitle>{t["tabs.all_appointments"]}</CardTitle>
        <CardDescription>{t["all.table.header.actions"]}</CardDescription>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t["search.appointments"]}
              className="pl-8"
              value={filterOptions.searchTerm}
              onChange={(e) => updateFilter({ searchTerm: e.target.value })}
            />
          </div>

          {/* Date range picker */}
          <div className="min-w-[200px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {(!filterOptions.dateRange.from && !filterOptions.dateRange.to) && <>{t["filter.select.date.range"]}</>}
                  {filterOptions.dateRange.from ? (
                    filterOptions.dateRange.to ? (
                      <>
                        {language === "en"
                          ? `${format(filterOptions.dateRange.from, "MMM d, yyyy")} - ${format(filterOptions.dateRange.to, "MMM d, yyyy")}`
                          : `${formatDateToSpanish(format(filterOptions.dateRange.from, "MMM d, yyyy"), false)} - ${formatDateToSpanish(format(filterOptions.dateRange.to, "MMM d, yyyy"), false)}`}
                      </>
                    ) : language === "en" ? (
                      `From ${format(filterOptions.dateRange.from, "MMM d, yyyy")}`
                    ) : (
                      `Desde ${formatDateToSpanish(format(filterOptions.dateRange.from, "MMM d, yyyy"), false)}`
                    )
                  ) : filterOptions.dateRange.to ? (
                    language === "en" ? (
                      `Until ${format(filterOptions.dateRange.to, "MMM d, yyyy")}`
                    ) : (
                      `Hasta ${formatDateToSpanish(format(filterOptions.dateRange.to, "MMM d, yyyy"), false)}`
                    )
                  ):(<></>)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filterOptions.dateRange.from,
                    to: filterOptions.dateRange.to,
                  }}
                  onSelect={(range) =>
                    updateFilter({
                      dateRange: {
                        from: range?.from || null,
                        to: range?.to || null,
                      },
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>


          {/* Service filter */}
          <div className="min-w-[150px]">
            <Select
              value={filterOptions.service}
              onValueChange={(value) => updateFilter({ service: value === "all" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t["filter.service"]} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t["filter.all_services"]}</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {t[service]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick filters dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <Filter className="mr-2 h-4 w-4" />
                {t["filter"]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilter({ searchTerm: "confirmed" })}>
                {t["filter.confirmed"]}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilter({ searchTerm: "completed" })}>
                {t["filter.completed"]}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilter({ searchTerm: "canceled" })}>
                {t["filter.canceled"]}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearFilters}>{t["filter.clear"]}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters button */}
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-1 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
            {t["filter.clear"]}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t["all.table.header.booking_id"]}</TableHead>
                <TableHead>{t["all.table.header.client"]}</TableHead>
                <TableHead>{t["all.table.header.date_time"]}</TableHead>
                <TableHead>{t["all.table.header.service"]}</TableHead>
                <TableHead>{t["all.table.header.contact"]}</TableHead>
                <TableHead>{t["all.table.header.address"]}</TableHead>
                <TableHead>{t["all.table.header.status"]}</TableHead>
                <TableHead className="text-right">{t["all.table.header.actions"]}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                    <TableCell className="font-medium">{appointment.clientName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {language === "en"
                            ? format(new Date(appointment.appointmentDate), "MMM d, yyyy")
                            : formatDateToSpanish(format(new Date(appointment.appointmentDate), "MMM d, yyyy"), false)}
                        </span>
                        <span className="text-sm text-muted-foreground">{t[appointment.time]}</span>
                      </div>
                    </TableCell>
                    <TableCell>{t[appointment.service]}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{appointment.email}</span>
                        <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={appointment.address}>
                      {appointment.address}
                    </TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (language === "es") appointment.notesES = await tes(appointment.notes);
                          setSelectedAppointment(appointment);
                          setIsEditDialogOpen(true);
                        }}
                        className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {t["button.view_details"]}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {t["all.no_appointments"]}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
