<template>
  <div class="admin-section">
    <div class="card">
      <div class="card-body">
        <!--Form-->
        <ValidationObserver tag="form"
                            ref="observer"
                            @submit.prevent="validateBeforeSubmit()">
          <div class="row">
            <!--company_id-->
            <InputCategory v-if="currentUser.login_id === ADMIN_TYPE.SUPER_ADMIN && detail.login_id !== currentUser.login_id"
                           v-model="form.company_id"
                           rules="required"
                           class="col-md-6 mb-3"
                           vid="company_id"
                           label="company_id"
                           :options="optionsCompany"
                           :filterRole="true"
                           @handle-filter-role="handleFilterRole"
                           :required="true"/>

            <!--Admin roles-->
            <InputCategory v-if="detail.login_id !== ADMIN_TYPE.SUPER_ADMIN"
                           v-model="form.role_id"
                           class="col-md-6 col-xs-12 mb-3"
                           rules="required"
                           vid="role_id"
                           label="display_name_role"
                           :options="optionsRole"
                           :disabled="!form.company_id"
                           :required="true"/>

            <!--Admin name-->
            <InputText v-model="form.admin_name"
                       class="col-md-6 col-xs-12 mb-3"
                       rules="required|max:100"
                       :max-length="100"
                       vid="admin_name"
                       label="admin_name"
                       :required="true"/>

            <!--Admin Furigana-->
            <InputText v-model="form.admin_furigana"
                       class="col-md-6 col-xs-12 mb-3"
                       rules="required|only_kata|max:100"
                       :max-length="100"
                       vid="admin_furigana"
                       label="furigana"
                       :required="true"/>

            <!--Login ID-->
            <InputText v-model="form.login_id"
                       class="col-md-6 col-xs-12 mb-3"
                       rules="required|alpha_num|min:5|max:100"
                       :max-length="100"
                       vid="login_id"
                       label="login_id"
                       :disabledInput="$route.name === 'admin.edit'"
                       :required="true"/>

            <template v-if="$route.name === 'admin.edit'">
              <!--Login password-->
              <InputText v-model="form.login_password"
                         class="col-md-6 col-xs-12 mb-3"
                         rules="half_alphabet|min:8|max:100"
                         :max-length="100"
                         type="password"
                         vid="login_password"
                         label="login_password"/>

              <!--Login password confirm-->
              <InputText v-model="form.login_password_confirmation"
                         class="col-md-6 col-xs-12 mb-3"
                         rules="confirmed:login_password"
                         type="password"
                         vid="login_password_confirmation"
                         label="login_password_confirmation"/>
            </template>

            <template v-else>
              <!--Login password ( required )-->
              <InputText v-model="form.login_password"
                         class="col-md-6 col-xs-12 mb-3"
                         rules="required|half_alphabet|min:8|max:100"
                         type="password"
                         vid="login_password"
                         label="login_password"
                         :max-length="100"
                         :required="true"/>

              <!--Login password confirm-->
              <InputText v-model="form.login_password_confirmation"
                         class="col-md-6 col-xs-12 mb-3"
                         rules="required|confirmed:login_password"
                         type="password"
                         vid="login_password_confirmation"
                         label="login_password_confirmation"
                         :max-length="100"
                         :required="true"/>
            </template>

            <!--Is active-->
            <InputSwitch v-model="form.is_active"
                         class="col-md-6 col-xs-12 mb-3 mb-sm-0"
                         label="text_active"/>
          </div>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer card-action fixed-bottom shadow">
            <button type="submit"
                    v-if="$route.params.id ? hasPermissionAction(PERMISSIONS.UPDATE_ADMIN) : hasPermissionAction(PERMISSIONS.CREATE_ADMIN)"
                    class="btn btn-pill btn-success float-right px-4 font-weight-bold"
                    :class="{'btn-loading disabled': isSubmit}">
              {{this.$route.name === 'admin.edit' ? $t('btn_update') : $t('btn_save')}}
            </button>

            <button type="button"
                    class="btn btn-pill btn-light float-right px-4 mr-3"
                    @click="onCancel">
              <span>{{ $t('back') }}</span>
            </button>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>

import Admin from '@/models/Admin'
import Form from '@/mixins/form.mixin'
import InputCategory from '@/components/Form/InputCategory'
import InputText from '@/components/Form/InputText'
import InputSwitch from '@/components/Form/InputSwitch'
import {forEach, pickBy} from 'lodash-es'
import store from '@/store'
import Role from '@/models/Role'

export default {
  name: 'Form',

  components: {
    InputSwitch,
    InputText,
    InputCategory
  },

  data () {
    return {
      list_role: [],
      list_companies: [],
      detail: {},
      form: {
        company_id: '',
        role_id: '',
        admin_name: '',
        admin_furigana: '',
        login_id: '',
        login_password: '',
        login_password_confirmation: '',
        is_active: true
      },
      isSubmit: false
    }
  },

  mixins: [Form],

  created () {
    this.list_role = this.$route.meta['role']
    this.list_companies = this.$route.meta['company']
    this.detail = {...this.$route.meta['detail']}
    // Check permission not super admin
    if (this.currentUser && this.currentUser.roles.name !== this.ADMIN_TYPE.SUPER_ADMIN) {
      this.form.company_id = this.currentUser.company.id
    }

    if ('id' in this.$route.params && this.$route.name === 'admin.edit') {
      this.form = Object.assign(this.form, {
        company_id: this.detail.company !== null ? this.detail.company.id : '',
        role_id: this.detail.roles !== null ? this.detail.roles.id : '',
        ...this.detail
      })
    }
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    },

    optionsCompany () {
      return {
        data: this.list_companies,
        id: 'id',
        key: 'company_name',
        code: 'company_code'
      }
    },

    optionsRole () {
      return {
        data: this.list_role,
        id: 'id',
        key: 'display_name'
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

      if (this.$route.name === 'admin.edit') {
        this.updateAdmin(data)
      } else {
        this.createAdmin(data)
      }
    },

    async updateAdmin (data) {
      try {
        const resp = new Admin(data)
        await resp.save()

        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))

        await this.$router.push({name: 'admin.index'}).catch(_ => {
        })
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
      }
    },

    async createAdmin (data) {
      try {
        const resp = await Admin.create(data)

        if (Object.keys(resp).length) {
          await this.onSuccess(this.$t('message_success'), this.$t('create_message_successfully'))

          this.$router.push({name: 'admin.index'}).catch(_ => {})
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
      return this.$router.push({name: 'admin.index'})
    },

    // Handle filter role with company_id
    async handleFilterRole () {
      this.form.role_id = ''

      if (this.currentUser.roles.name === this.ADMIN_TYPE.SUPER_ADMIN && this.form.company_id) {
        const respRole = await Role.all({
          query: {
            per_page: 0,
            'filters[company_id]': this.form.company_id
          }
        })

        this.list_role = respRole.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .admin-section {
    padding: 1.25rem;
  }
</style>
