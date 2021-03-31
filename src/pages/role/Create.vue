<template>
  <div id="CreateRole">
    <Form/>
  </div>
</template>

<script>
import Permission from '@/models/Permission'
import Company from '@/models/Company'
import Form from './Form'

export default {
  name: 'Create',

  components: { Form },

  async beforeRouteEnter (to, from, next) {
    // Get Permission
    const respPermission = await Permission.all()
    // Get Companies
    const respCompanies = await Company.all({
      query: {
        per_page: 0
      }
    })

    to.meta['permission'] = respPermission.data
    to.meta['companies'] = respCompanies.data

    return next()
  }
}
</script>

<style scoped>

</style>
