import Model from './Model.js'

export default class Admin extends Model {
  buildUrl ({ params }) {
    return ['admins', ...params]
  }

  static async profile (configs = {}) {
    return (new this()).request({ method: 'GET', url: `auth/profile`, ...configs, isStatic: true })
  }

  static async delete_admin (id) {
    return (new this()).request({ method: 'DELETE', url: `admins/${id}`, isStatic: true })
  }

  static async login ({ login_id, login_password, company_code }) {
    const data = { login_id, login_password, company_code }
    return (new this()).request({ method: 'POST', url: `auth/admin/login`, data, isStatic: true })
  }

  static async logout () {
    return (new this()).request({ method: 'DELETE', url: `auth/admin/logout`, isStatic: true })
  }

  afterRequest ({ data }, { action, isStatic }) {
    if (action === 'custom') {
      return data
    }
    if (action === 'paginate') {
      data.data = this.make(data.data)
      return data
    }
    return isStatic ? this.make(data.data) : this.fill(data.data)
  }
}
