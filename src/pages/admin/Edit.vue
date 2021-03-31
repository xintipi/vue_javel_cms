<template>
  <div id="UpdateAdmin">
    <Form />
  </div>
</template>

<script>
import Admin from '@/models/Admin'
import Form from './Form'
import Role from '@/models/Role'
import Company from '@/models/Company'
import store from '@/store'
import { ADMIN_TYPE } from '@/enum/admin-type.enum'

export default {
  name: 'Edit',

  components: {
    Form
  },

  beforeRouteEnter: async (to, from, next) => {
    const respDetail = await Admin.find(to.params['id'], {
      query: {
        'include': 'roles,company'
      }
    })
    if (respDetail.login_id !== ADMIN_TYPE.SUPER_ADMIN) {
      const respRole = await Role.all({
        query: {
          per_page: 0,
          'filters[company_id]': respDetail.company.id
        }
      })

      to.meta['role'] = respRole.data
    }
    const respCompany = await Company.all({
      query: {
        per_page: 0
      }
    })

    to.meta['detail'] = respDetail
    to.meta['company'] = respCompany.data

    return next()
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    }
  }
}
</script>

<style scoped>

</style>
