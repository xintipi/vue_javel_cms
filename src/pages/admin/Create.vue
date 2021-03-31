<template>
  <div id="CreateNews">
    <Form/>
  </div>
</template>

<script>
import Role from '@/models/Role'
import Company from '@/models/Company'
import Form from './Form'

export default {
  name: 'Create',

  components: { Form },

  async beforeRouteEnter (to, from, next) {
    const respRole = await Role.all({
      query: {
        per_page: 0
      }
    })
    const respCompany = await Company.all({
      query: {
        per_page: 0
      }
    })

    to.meta['role'] = respRole.data
    to.meta['company'] = respCompany.data

    return next()
  }
}
</script>

<style scoped>

</style>
