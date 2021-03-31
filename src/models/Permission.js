import Model from './Model.js'

export default class Permission extends Model {
  buildUrl (request) {
    const { params } = request
    return ['permissions', ...params]
  }
}
