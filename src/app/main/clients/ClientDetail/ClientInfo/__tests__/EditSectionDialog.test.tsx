import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { EditSectionDialog } from "../EditSectionDialog"
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
      references: "",
      areas: [{ id: "area-1", name: "Cocina" }],
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

describe("EditSectionDialog", () => {
  const onSave = vi.fn().mockResolvedValue(undefined)
  const onClose = vi.fn()

  beforeEach(() => {
    onSave.mockClear()
    onClose.mockClear()
  })

  it("renders only the targeted section's fields", () => {
    render(
      <EditSectionDialog open section="fiscal" client={businessClient} onClose={onClose} onSave={onSave} />
    )

    expect(screen.getByLabelText("RFC")).toBeInTheDocument()
    expect(screen.getByLabelText("Tipo de persona")).toBeInTheDocument()
    // Fields from other sections must not leak into a fiscal-only edit.
    expect(screen.queryByLabelText("Giro")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Teléfono")).not.toBeInTheDocument()
  })

  it("preserves business locations when saving an unrelated section (data-loss guard)", async () => {
    render(
      <EditSectionDialog open section="fiscal" client={businessClient} onClose={onClose} onSave={onSave} />
    )

    const rfc = screen.getByLabelText("RFC") as HTMLInputElement
    fireEvent.change(rfc, { target: { value: "BBB020202BBB" } })
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))

    const payload = onSave.mock.calls[0][0]
    // Edited field is applied...
    expect(payload.rfc).toBe("BBB020202BBB")
    // ...and the full client (incl. branches/areas with ids) is carried through,
    // so the backend's delete-missing branch re-sync stays lossless.
    expect(payload.locations).toHaveLength(1)
    expect(payload.locations[0].id).toBe("branch-1")
    expect(payload.locations[0].areas[0].id).toBe("area-1")
    expect(onClose).toHaveBeenCalled()
  })

  it("blocks saving the contact section with an invalid phone", async () => {
    render(
      <EditSectionDialog open section="contact" client={individualClient} onClose={onClose} onSave={onSave} />
    )

    const phone = document.querySelector('input[type="tel"]') as HTMLInputElement
    fireEvent.change(phone, { target: { value: "123" } })
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }))

    await waitFor(() => expect(screen.getByText("Ingrese un número de teléfono válido")).toBeInTheDocument())
    expect(onSave).not.toHaveBeenCalled()
  })
})
