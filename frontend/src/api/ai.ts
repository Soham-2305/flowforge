import client from './client'

export const aiApi = {
  predict: (reynolds_number: number, geometry_type: string) =>
    client.post('/api/ai/predict', { reynolds_number, geometry_type }),
  diagnose: (project_id: string, cd: number, cl: number, reynolds_number: number) =>
    client.post('/api/ai/diagnose', { project_id, cd, cl, reynolds_number }),
}