import client from './client'

export const meshApi = {
  generate: (shapes: object[], cell_size = 0.05) =>
    client.post('/api/mesh/generate', { shapes, cell_size }),
}