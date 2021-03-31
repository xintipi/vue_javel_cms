<template>
  <ValidationObserver tag="form"
                      ref="observer"
                      class="role-section"
                      @submit.prevent="validateBeforeSubmit()">
    <!--Card Field-->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">

          <!--Display name role-->
          <InputText v-model="form.display_name"
                     class="col-md-6 mb-3 mb-sm-0"
                     rules="required|max:100"
                     :max-length="100"
                     vid="display_name"
                     label="display_name_role"
                     :required="true"/>

          <!--Company ID-->
          <InputCategory v-if="currentUser && currentUser.roles.name === ADMIN_TYPE.SUPER_ADMIN"
                         v-model="form.company_id"
                         class="col-md-6 mb-3"
                         rules="required"
                         vid="company_id"
                         label="company_id"
                         :options="optionsCompanyCategory"
                         :disabled="$route.name ==='role.edit'"
                         :required="true"/>

          <!--Description-->
          <InputText v-model="form.description"
                     class="col-md-6 mb-3 mb-sm-0"
                     vid="description"
                     rules="max:100"
                     :max-length="100"
                     label="description_role"/>
        </div>
      </div>
    </div>

    <!--Card Google Map API-->
    <div class="card">
      <div class="card-body">
        <a-transfer
          show-search=""
          :filter-option="filterOption"
          :list-style="{ width: '47%', height: '30rem'}"
          :data-source="list_permission"
          :titles="[$t('available_permission'), $t('selected_permission')]"
          :target-keys="targetKeys"
          :render="permission => permission.title"
          :disabled="$route.name ==='role.edit' && $route.meta['detail'].name === ADMIN_TYPE.SUPER_ADMIN"
          @change="handleChange"
        />
      </div>
    </div>

    <!-- Action Section Submit & Cancel -->
    <div class="card-footer card-action fixed-bottom shadow">
      <button type="submit"
              v-if="$route.params.id ? hasPermissionAction(PERMISSIONS.UPDATE_ROLE) : hasPermissionAction(PERMISSIONS.CREATE_ROLE)"
              :disabled="$route.name ==='role.edit' && $route.meta['detail'].name === ADMIN_TYPE.SUPER_ADMIN"
              class="btn btn-pill btn-success float-right px-4 font-weight-bold"
              :class="{'btn-loading disabled': isSubmit}">
        {{this.$route.name === 'role.edit' ? $t('btn_update') : $t('btn_save')}}
      </button>

      <button type="button"
              class="btn btn-pill btn-light float-right px-4 mr-3"
              @click="onCancel">
        <span>{{ $t('back') }}</span>
      </button>
    </div>
  </ValidationObserver>
</template>

<script>

import Role from '@/models/Role'
import store from '@/store'
import Form from '@/mixins/form.mixin'
import InputText from '@/components/Form/InputText'
import InputCategory from '@/components/Form/InputCategory'
import {forEach, pickBy, lowerCase, map} from 'lodash-es'

export default {
  name: 'Form',

  components: {
    InputCategory,
    InputText
  },

  data () {
    return {
      list_permission: [],
      list_companies: [],
      targetKeys: [],
      form: {
        company_id: '',
        name: '',
        display_name: '',
        description: '',
        permissions: []
      },
      isSubmit: false
    }
  },

  mixins: [Form],

  created () {
    this.list_permission = map(this.$route.meta['permission'], (item) => {
      return {
        key: item.id,
        title: this.$t(item.display_name),
        name: item.name,
        description: item.description
      }
    })

    this.list_companies = this.$route.meta['companies']

    if ('id' in this.$route.params && this.$route.name === 'role.edit') {
      this.form = Object.assign(this.form, {
        company_id: this.$route.meta['detail'].companyRole !== null ? this.$route.meta['detail'].companyRole.id : '',
        ...this.$route.meta['detail']
      })
      if (this.form.permissions) {
        this.targetKeys = this.form.permissions.map(permission => permission.id)
      }
    }
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    },

    optionsCompanyCategory () {
      return {
        data: this.list_companies,
        id: 'id',
        key: 'company_name',
        code: 'company_code'
      }
    }
  },

  methods: {
    async validateBeforeSubmit () {
      const isValid = await this.$refs.observer.validate()

      if (isValid) {
        this.handleSubmit()
      }
    },

    handleSubmit () {
      this.isSubmit = true
      let data = this.form
      data.permissions = [...this.targetKeys]
      data.name = data.display_name
      // Check permission not super admin
      if (this.currentUser && this.currentUser.roles.name !== this.ADMIN_TYPE.SUPER_ADMIN) {
        data.company_id = this.currentUser.company.id
      }

      if (this.$route.name === 'role.edit') {
        this.updateRole(data)
      } else {
        this.createRole(data)
      }
    },

    async updateRole (data) {
      try {
        const resp = new Role(data)
        await resp.save()

        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))

        await this.$router.push({name: 'role.index'}).catch(_ => {
        })
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
      }
    },

    async createRole (data) {
      try {
        const resp = await Role.create(data)

        if (resp && Object.keys(resp).length) {
          await this.onSuccess(this.$t('message_success'), this.$t('create_message_successfully'))

          this.$router.push({name: 'role.index'}).catch(_ => {})
        }
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
        throw err
      }
    },

    checkErrorsAPI (err) {
      forEach(err.response.data.errors, (item) => {
        pickBy(this.$refs.observer.errors, (value, key) => {
          if (item.field === key) {
            value.push(item.message)
            this.isSubmit = false
          }
        })
      })
    },

    onCancel () {
      return this.$router.push({ name: 'role.index' })
    },

    filterOption (inputValue, option) {
      if (!inputValue) return false

      const lowercase = lowerCase(option.title)
      return lowercase.indexOf(lowerCase(inputValue)) > -1
    },

    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
    }
  }
}
</script>

<style lang="scss" scoped>
  .role-section {
    padding: 1.25rem;
  }
</style>
