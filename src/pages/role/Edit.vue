<template>
  <div id="UpdateRole">
    <Form/>
  </div>
</template>

<script>
import Role from '@/models/Role'
import Permission from '@/models/Permission'
import Company from '@/models/Company'
import Form from './Form'

export default {
  name: 'Edit',

  components: {
    Form
  },

  beforeRouteEnter: async (to, from, next) => {
    // Get Detail
    const respDetail = await Role.find(to.params['id'], {
      query: {
        include: 'companyRole,permissions'
      }
    })
    // Get Permission
    const respPermission = await Permission.all()
    // Get Companies
    const respCompanies = await Company.all({
      query: {
        per_page: 0
      }
    })

    to.meta['detail'] = respDetail.data
    to.meta['permission'] = respPermission.data
    to.meta['companies'] = respCompanies.data

    return next()
  }
}
</script>

<style scoped>

</style>
