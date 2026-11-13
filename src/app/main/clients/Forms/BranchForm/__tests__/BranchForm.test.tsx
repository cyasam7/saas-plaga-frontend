import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { QueryClient, QueryClientProvider } from "react-query"
import { AxiosRequestConfig } from "axios"
import { AxiosFetcher } from "src/app/shared/fetcher"
import { IGetBranchFormResponse } from "src/app/requests/branches/useQueryGetBranchForm"
import { BranchForm } from ".."

// Se mockea la capa HTTP para ejercitar también los hooks de `src/app/requests/branches`.
vi.mock("src/app/shared/fetcher", () => ({ AxiosFetcher: vi.fn() }))

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

/** Responde GET /branch/:id/form; las escrituras usan `writeResult`. */
function mockBranchEndpoints(writeResult: () => Promise<unknown> = () => Promise.resolve(undefined)) {
  vi.mocked(AxiosFetcher).mockImplementation(((requestConfig: AxiosRequestConfig) =>
    requestConfig.method === "GET" ? Promise.resolve(branchFormResponse) : writeResult()) as typeof AxiosFetcher)
}

function getWriteRequests(): AxiosRequestConfig[] {
  return vi
    .mocked(AxiosFetcher)
    .mock.calls.map(([requestConfig]) => requestConfig)
    .filter((requestConfig) => requestConfig.method !== "GET")
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
    vi.mocked(AxiosFetcher).mockReset()
    mockBranchEndpoints()
  })

  it("creates a new branch with the default areas through POST /branch/form", async () => {
    vi.mocked(AxiosFetcher).mockImplementation((() => Promise.resolve({ id: "branch-new" })) as typeof AxiosFetcher)
    const { onSaved, onClose } = renderBranchForm("")

    expect(screen.getByText("Agregar Nueva Sucursal")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Exterior")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Interior")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Nombre \(Ej: Sucursal centro\)/), { target: { value: "Sucursal Norte" } })
    fireEvent.change(screen.getByLabelText(/Dirección completa/), { target: { value: "Av. Universidad 1330" } })
    fireEvent.change(screen.getByLabelText(/Teléfono del responsable/), { target: { value: "5555555555" } })
    fireEvent.click(screen.getByLabelText("Eliminar área 2"))
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }))

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
    // En alta no se consulta el formulario de una sucursal existente.
    expect(vi.mocked(AxiosFetcher).mock.calls.some(([requestConfig]) => requestConfig.method === "GET")).toBe(false)

    const [createRequest] = getWriteRequests()
    expect(createRequest).toMatchObject({ url: "/branch/form", method: "POST" })
    expect(createRequest.data).toMatchObject({
      clientId: "client-1",
      form: {
        name: "Sucursal Norte",
        address: "Av. Universidad 1330",
        contactPerson: null,
        notes: null,
        areas: [{ name: "Exterior", description: null }],
      },
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("loads the branch areas and sends the whole form, with the area changes, to PUT /branch/:id", async () => {
    const { onSaved, onClose } = renderBranchForm("branch-1")

    expect(await screen.findByDisplayValue("Cocina")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Bodega")).toBeInTheDocument()
    expect(AxiosFetcher).toHaveBeenCalledWith({ url: "/branch/branch-1/form", method: "GET" })

    fireEvent.click(screen.getByLabelText("Eliminar área 2"))
    fireEvent.click(screen.getByRole("button", { name: "Agregar área" }))
    const areaNameInputs = screen.getAllByLabelText("Nombre del área")
    fireEvent.change(areaNameInputs[1], { target: { value: "Terraza" } })

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }))

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
    expect(getWriteRequests()).toEqual([
      {
        url: "/branch/branch-1",
        method: "PUT",
        data: {
          ...branchFormResponse.form,
          areas: [
            { id: "area-kitchen", name: "Cocina", description: null },
            { name: "Terraza", description: null },
          ],
        },
      },
    ])
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not submit when every area was removed", async () => {
    renderBranchForm("branch-1")

    await screen.findByDisplayValue("Cocina")
    fireEvent.click(screen.getByLabelText("Eliminar área 2"))
    fireEvent.click(screen.getByLabelText("Eliminar área 1"))
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }))

    expect(await screen.findByText("Agregue al menos un área")).toBeInTheDocument()
    expect(getWriteRequests()).toHaveLength(0)
  })

  it("keeps the dialog open when the API rejects the update", async () => {
    mockBranchEndpoints(() => Promise.reject(new Error("Aun existen dispositivos en esta area")))
    const { onSaved, onClose } = renderBranchForm("branch-1")

    await screen.findByDisplayValue("Cocina")
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }))

    await waitFor(() => expect(getWriteRequests()).toHaveLength(1))
    expect(onSaved).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })
})
