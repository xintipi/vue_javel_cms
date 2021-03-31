import Model from './Model.js'

export default class User extends Model {
  buildUrl (request) {
    const { params } = request
    return ['users', ...params]
  }

  static async delete_user (id) {
    return (new this()).request({ method: 'DELETE', url: `users/${id}`, isStatic: true })
  }
}
