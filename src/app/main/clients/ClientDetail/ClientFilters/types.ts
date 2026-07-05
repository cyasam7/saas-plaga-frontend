export interface ClientFiltersProps {
  onFilterChange?: (filters: ClientFiltersState) => void
}

export interface ClientFiltersState {
  date: string
  sortBy: string
  serviceStatus: string
}

export interface NewClientData {
  name: string
  type: "business" | "individual"
  email: string
  phone: string
  address: string
  businessDetails?: {
    contactPerson: string
    position: string
    employeeCount: number
  }
} 