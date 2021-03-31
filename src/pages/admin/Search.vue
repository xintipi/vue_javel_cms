<template>
  <div class="card">
    <div class="card-body">
      <!--Form-->
      <form role="search" @submit.prevent="search">
        <div class="row">
          <!--Role-->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{$t('role_admin_name')}}</label>

            <a-select
              show-search
              style="width: 100%"
              v-model="filter.role_name">
              <a-select-option value="">
                {{$t('select_option_empty')}}
              </a-select-option>
              <template v-for="(item, index) in listAdminRole">
                <a-select-option v-if="item.roles !== null"
                                 :key="item.id + index"
                                 :value="item.roles.display_name">
                  {{ item.roles.display_name }}
                </a-select-option>
              </template>
            </a-select>
          </div>

          <!--Login ID-->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{$t('login_id')}}</label>

            <a-input v-model="filter.login_id"/>
          </div>

          <!--Admin name-->
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <label class="form-label font-weight-bold">{{$t('admin_name')}}</label>

            <a-input v-model="filter.admin_name"/>
          </div>

          <!--Active-->
          <div class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
            <label class="form-label font-weight-bold">{{$t('status')}}</label>

            <a-select
              show-search
              :placeholder="$t('select_option_empty')"
              style="width: 100%"
              v-model="filter.is_active">
              <a-select-option value="">
                {{$t('select_option_empty')}}
              </a-select-option>
              <a-select-option value="1">
                {{$t('select_option_active')}}
              </a-select-option>
              <a-select-option value="0">
                {{$t('select_option_inactive')}}
              </a-select-option>
            </a-select>
          </div>

          <!--Search & Reset-->
          <div class="col-12 col-sm-6 col-md-4 ml-auto">
            <label class="form-label font-weight-bold" v-html="'&nbsp;'"/>

            <div class="row">
              <div class="col-6">
                <button type="button" @click="reset" class="text-nowrap btn btn-pill btn-light btn-block border-0">
                  {{$t('btn_reset')}}
                </button>
              </div>

              <div class="col-6">
                <button type="submit" class="text-nowrap btn btn-pill btn-primary btn-block border-0">
                  {{$t('btn_search')}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { uniqBy } from 'lodash-es'
import { RefreshCwIcon, SearchIcon } from 'vue-feather-icons'

export default {
  name: 'Search',
  data () {
    return {
      list_admin_role: [],
      filter: {
        role_name: '',
        login_id: '',
        admin_name: '',
        is_active: ''
      }
    }
  },

  components: {
    // Icon
    SearchIcon,
    RefreshCwIcon
  },

  created () {
    this.list_admin_role = this.$route.meta['list']
  },

  computed: {
    listAdminRole () {
      return uniqBy(this.list_admin_role, (o) => {
        if (o.roles) {
          return o.roles.display_name
        }
      })
    }
  },

  methods: {
    search () {
      this.$emit('filter-changed', this.filter)
    },

    reset () {
      for (let property in this.filter) {
        if (this.filter.hasOwnProperty(property)) {
          this.filter[property] = ''
        }
      }

      this.$emit('filter-changed', this.filter)
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>
