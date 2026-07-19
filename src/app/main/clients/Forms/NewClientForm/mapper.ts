import { Client } from "../../types"
import { FormClientValues } from "./types"

/**
 * Reconstructs the full form payload from a persisted client.
 *
 * Section-based editing on the client detail page must POST the *whole* client
 * (not just the edited fields): the backend's `syncLocations` performs
 * delete-missing reconciliation, so omitting `locations` for a business client
 * would wipe its branches/areas. Rebuilding from the freshly fetched client —
 * preserving branch/area ids — keeps the re-sync idempotent and lossless.
 */
export function clientToFormValues(client: Client): FormClientValues {
  return {
    type: client.type,
    name: client.name,
    legalName: client.legalName ?? "",
    taxpayerType: client.taxpayerType,
    rfc: client.rfc ?? "",
    businessActivity: client.businessActivity ?? "",
    requiresCompliance: client.requiresCompliance ?? false,
    locations: (client.locations ?? []).map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      contactPhone: location.contactPhone,
      contactPerson: location.contactPerson ?? "",
      references: location.references ?? "",
      areas: (location.areas ?? []).map((area) => ({
        id: area.id,
        name: area.name,
        description: area.description ?? "",
      })),
    })),
    email: client.email,
    phone: client.phone ?? "",
    ownerName: client.ownerName ?? "",
    propertyType: client.propertyType,
  }
}
