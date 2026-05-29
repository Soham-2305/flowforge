import client from './client'

export interface Project {
  id: string
  name: string
  geometry: string
  status: string
  cd: number | null
  cl: number | null
  iterations: number
  residual: number | null
  shapes: object[]
  solver_params: object
  boundaries: object
  created_at: string | null
  updated_at: string | null
}

export const projectsApi = {
  list: () => client.get<Project[]>('/api/projects/'),
  get: (id: string) => client.get<Project>(`/api/projects/${id}`),
  create: (name: string, geometry = 'Custom') =>
    client.post<Project>('/api/projects/', { name, geometry }),
  update: (id: string, data: Partial<Project>) =>
    client.patch<Project>(`/api/projects/${id}`, data),
  delete: (id: string) => client.delete(`/api/projects/${id}`),
}