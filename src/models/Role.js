import Model from './Model.js'

export default class Role extends Model {
  buildUrl (request) {
    const { params } = request
    return ['roles', ...params]
  }

  static async delete_role (id) {
    return (new this()).request({ method: 'DELETE', url: `roles/${id}`, isStatic: true })
  }
}
