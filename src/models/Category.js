import Model from './Model.js'

export default class Category extends Model {
  buildUrl (request) {
    const { params } = request
    return ['categories', ...params]
  }
}
