import client from './client'

export const solverApi = {
  run: (project_id: string, params: object) =>
    client.post('/api/solver/run', { project_id, params }),
  stop: (project_id: string) =>
    client.post(`/api/solver/stop/${project_id}`),
}