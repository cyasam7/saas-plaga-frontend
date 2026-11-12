import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { QueryClient, QueryClientProvider } from "react-query"
import { BranchService } from "src/app/shared/services/BranchService"
import { IGetBranchFormResponse } from "../../../types"
import { BranchForm } from ".."

const branchFormResponse: IGetBranchFormResponse = {
  id: "branch-1",
  clientId: "client-1",
  form: {
    name: "Sucursal Centro",
    address: "Av. Juárez 100",
    contactPhone: "+525555555555",
    contactPerson: null,
    notes: null,
    areas: [
      { id: "area-kitchen", name: "Cocina", description: null },
      { id: "area-storage", name: "Bodega", description: "Planta baja" },
    ],
  },
}

function renderBranchForm(branchId: string, onSaved = vi.fn().mockResolvedValue(undefined), onClose = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={queryClient}>
      <BranchForm open clientId="client-1" branchId={branchId} onClose={onClose} onSaved={onSaved} />
    </QueryClientProvider>
  )

  return { onSaved, onClose }
}

describe("BranchForm", () => {
  beforeEach(() => {
    vi.spyOn(BranchService, "getForm").mockResolvedValue(branchFormResponse)
  })

  // Solo se restauran los spies del servicio: restoreAllMocks borraría los mocks globales de setupTest.
  afterEach(() => {
    vi.mocked(BranchService.getForm).mockRestore()
    vi.mocked(BranchService.updateForm).mockRestore?.()
    vi.mocked(BranchService.createForm).mockRestore?.()
  })

  it("creates a new branch with the default areas through the same form", async () => {
    const createFormSpy = vi.spyOn(BranchService, "createForm").mockResolvedValue({ id: "branch-new" })
    const { onSaved, onClose } = renderBranchForm("")

    expect(screen.getByText("Agregar Nueva Sucursal")).toBeInTheDocument()
    expect(BranchService.getForm).not.toHaveBeenCalled()
    expect(screen.getByDisplayValue("Exterior")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Interior")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Nombre \(Ej: Sucursal centro\)/), { target: { value: "Sucursal Norte" } })
    fireEvent.change(screen.getByLabelText(/Dirección completa/), { target: { value: "Av. Universidad 1330" } })
    fireEvent.change(screen.getByLabelText(/Teléfono del responsable/), { target: { value: "5555555555" } })
    fireEvent.click(screen.getByLabelText("Eliminar área 2"))
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }))

    await waitFor(() => expect(createFormSpy).toHaveBeenCalledTimes(1))
    const [sentClientId, sentForm] = createFormSpy.mock.calls[0]
    expect(sentClientId).toBe("client-1")
    expect(sentForm).toMatchObject({
      name: "Sucursal Norte",
      address: "Av. Universidad 1330",
      contactPerson: null,
      notes: null,
      areas: [{ name: "Exterior", description: null }],
    })
    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("loads the branch areas and sends the whole form, with the area changes, to the PUT", async () => {
    const updateFormSpy = vi.spyOn(BranchService, "updateForm").mockResolvedValue(undefined)
    const { onSaved, onClose } = renderBranchForm("branch-1")

    expect(await screen.findByDisplayValue("Cocina")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Bodega")).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText("Eliminar área 2"))
    fireEvent.click(screen.getByRole("button", { name: "Agregar área" }))
    const areaNameInputs = screen.getAllByLabelText("Nombre del área")
    fireEvent.change(areaNameInputs[1], { target: { value: "Terraza" } })

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }))

    await waitFor(() => expect(updateFormSpy).toHaveBeenCalledTimes(1))
    expect(updateFormSpy).toHaveBeenCalledWith("branch-1", {
      ...branchFormResponse.form,
      areas: [
        { id: "area-kitchen", name: "Cocina", description: null },
        { name: "Terraza", description: null },
      ],
    })
    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not submit when every area was removed", async () => {
    const updateFormSpy = vi.spyOn(BranchService, "updateForm").mockResolvedValue(undefined)
    renderBranchForm("branch-1")

    await screen.findByDisplayValue("Cocina")
    fireEvent.click(screen.getByLabelText("Eliminar área 2"))
    fireEvent.click(screen.getByLabelText("Eliminar área 1"))
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }))

    expect(await screen.findByText("Agregue al menos un área")).toBeInTheDocument()
    expect(updateFormSpy).not.toHaveBeenCalled()
  })

  it("keeps the dialog open when the API rejects the update", async () => {
    vi.spyOn(BranchService, "updateForm").mockRejectedValue(new Error("Aun existen dispositivos en esta area"))
    const { onSaved, onClose } = renderBranchForm("branch-1")

    await screen.findByDisplayValue("Cocina")
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }))

    await waitFor(() => expect(BranchService.updateForm).toHaveBeenCalledTimes(1))
    expect(onSaved).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })
})
