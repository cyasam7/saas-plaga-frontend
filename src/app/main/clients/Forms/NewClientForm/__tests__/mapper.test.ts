import { describe, it, expect } from "vitest"
import { clientToFormValues } from "../mapper"
import { Client } from "../../../types"

const businessClient: Client = {
  id: "client-1",
  name: "Acme SA",
  type: "business",
  legalName: "Acme Sociedad Anónima",
  taxpayerType: "moral",
  rfc: "AAA010101AAA",
  businessActivity: "Manufactura",
  requiresCompliance: true,
  locations: [
    {
      id: "branch-1",
      name: "Sucursal Centro",
      address: "Av. Juárez 100",
      contactPhone: "+5215555555555",
      contactPerson: "Juan",
      references: "Frente al parque",
      areas: [{ id: "area-1", name: "Cocina", description: "Planta baja" }],
    },
  ],
}

const individualClient: Client = {
  id: "client-2",
  name: "Jane Doe",
  type: "individual",
  phone: "+5215544332211",
  email: "jane@example.com",
  ownerName: "Jane Doe",
  propertyType: "house",
}

describe("clientToFormValues", () => {
  it("preserves business locations with their branch and area ids (lossless re-sync)", () => {
    const values = clientToFormValues(businessClient)

    // Branch/area ids must survive so the backend re-sync is idempotent and
    // never deletes existing branches when a section is edited.
    expect(values.locations).toHaveLength(1)
    expect(values.locations[0].id).toBe("branch-1")
    expect(values.locations[0].areas[0].id).toBe("area-1")
    expect(values.type).toBe("business")
    expect(values.requiresCompliance).toBe(true)
  })

  it("maps residential fields and defaults locations to an empty array", () => {
    const values = clientToFormValues(individualClient)

    expect(values.ownerName).toBe("Jane Doe")
    expect(values.propertyType).toBe("house")
    expect(values.phone).toBe("+5215544332211")
    expect(values.locations).toEqual([])
  })

  it("normalizes missing optional strings to empty strings", () => {
    const bare: Client = { id: "c3", name: "Sin datos", type: "individual" }
    const values = clientToFormValues(bare)

    expect(values.legalName).toBe("")
    expect(values.rfc).toBe("")
    expect(values.ownerName).toBe("")
    expect(values.phone).toBe("")
    expect(values.requiresCompliance).toBe(false)
  })
})
