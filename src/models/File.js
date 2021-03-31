import Model from './Model.js'

export default class File extends Model {
  buildUrl (request) {
    const { params } = request
    return ['files', ...params]
  }

  static async upload ({ data, onUploadProgress }) {
    return (new this()).makeRequest({ method: 'POST', url: `/api/cms/files/upload`, data, onUploadProgress })
  }

  static async deleteImageAzure (fileId, pageId, type) {
    return (new this()).makeRequest({ method: 'DELETE', url: `/api/cms/files/${fileId}/${pageId}?type=${type}`, isStatic: true })
  }
}
