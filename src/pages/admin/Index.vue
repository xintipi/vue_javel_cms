<template>
  <div id="AdminIndex">
    <Search @filter-changed="onFilterChange($event)"/>

    <a-table bordered
             :columns="columns"
             :data-source="list"
             :loading="isLoading"
             :rowKey="record => record.id"
             table-layout="fixed"
             :pagination="{
               ...pagination,
               showSizeChanger: true,
               buildOptionText: buildOptionText,
               pageSizeOptions: ['10', '20', '30'],
               showTotal: showTotal
             }"
             @change="onPageChange">

      <!--Custom type table-->
      <template v-if="role_admin !== null"
                slot="role_admin"
                slot-scope="role_admin">
        {{role_admin.display_name}}
      </template>

      <!--Custom badge active-->
      <template slot="is_active" slot-scope="is_active">
        <span class="badge bg-primary text-white" v-if="is_active"> {{$t('active')}} </span>
        <span class="badge bg-light" v-else> {{$t('inactive')}} </span>
      </template>

      <!--Custom type table-->
      <template slot="action_edit"
                slot-scope="action_edit">
        <a-tooltip placement="bottom"
                   :title="$t('tooltip_edit')">
          <a @click.prevent="handleEdit(action_edit.id)"
             href="#"
             class="text-decoration-none action">
            <img src="../../assets/images/icon-edit.svg"
                 alt="icon">
          </a>
        </a-tooltip>
      </template>

      <template slot="action_delete"
                slot-scope="action_delete">
        <a-tooltip placement="bottom"
                   :title="$t('tooltip_delete')"
                   v-if="hasPermissionAction(PERMISSIONS.DELETE_ADMIN)">
          <a href="#"
             @click.prevent="handleOpenModal(action_delete.id)"
             class="text-decoration-none action">
            <img src="../../assets/images/icon-delete.svg"
                 alt="icon">
          </a>
        </a-tooltip>
      </template>
    </a-table>

    <!-- Create -->
    <div class="card-footer card-action fixed-bottom shadow">
      <div class="btn-create">
        <router-link :to="{name: 'admin.create'}"
                     class="btn btn-success btn-pill float-right px-4 font-weight-bold"
                     tag="button">
          {{$t('btn_create')}}
        </router-link>
      </div>
    </div>

    <!--Modal delete-->
    <ModalDelete v-if="openModal"
                 @cancel="openModal = false"
                 @action="handleDelete"/>
  </div>
</template>

<script>
import Admin from '@/models/Admin'
import Table from '@/mixins/table.mixin'
import Form from '@/mixins/form.mixin'
import {convertPagination} from '@/utils/filters'
import Search from './Search'
import {EditIcon, Trash2Icon, PlusIcon} from 'vue-feather-icons'
import replace from 'lodash-es/replace'
import store from '@/store'
import ModalDelete from '@/components/Modal/ModalDelete'

export default {
  name: 'Index',

  mixins: [Table, Form],

  components: {
    ModalDelete,
    Search,
    EditIcon,
    Trash2Icon,
    PlusIcon
  },

  async beforeRouteEnter (to, from, next) {
    // Get All Admin
    const resp = await Admin.paginate({
      query: {
        page: 1,
        per_page: 10,
        'include': 'roles',
        'sortBy[updated_at]': 'desc'
      }
    })
    // Save data in meta of router
    to.meta['list'] = resp.data
    to.meta['pagination'] = convertPagination(resp.pagination)

    return next()
  },

  data () {
    return {
      isLoading: false,
      list: [],
      pagination: {},
      filter: {},
      sortBy: 'updated_at',
      sortDesc: true,
      perPage: '',
      openModal: false,
      idAdmin: ''
    }
  },

  computed: {
    columns () {
      return [
        {
          title: this.$t('role_admin_name'),
          dataIndex: 'roles',
          scopedSlots: {customRender: 'role_admin'}
        },
        {
          title: this.$t('login_id'),
          dataIndex: 'login_id'
        },
        {
          title: this.$t('admin_name'),
          dataIndex: 'admin_name'
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_active',
          scopedSlots: {customRender: 'is_active'},
          width: '110px',
          align: 'center'
        },
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at'
        },
        {
          title: this.$t('updated_at'),
          dataIndex: 'updated_at'
        },
        {
          title: this.$t('btn_edit'),
          scopedSlots: {customRender: 'action_edit'},
          align: 'center',
          width: '65px'
        },
        {
          title: this.$t('btn_delete'),
          scopedSlots: {customRender: 'action_delete'},
          align: 'center',
          width: '65px'
        }
      ]
    },

    currentUser () {
      return store.getters.profile.data
    }
  },

  created () {
    this.list = this.$route.meta['list']
    this.pagination = this.$route.meta['pagination']
  },

  methods: {
    async onPageChange (pagination, filters, sorter) {
      this.perPage = pagination.pageSize
      const sortBy = `sortBy[${sorter.field}]`
      const sortDesc = replace(sorter.order, 'end', '')

      const params = {
        page: pagination.current,
        per_page: pagination.pageSize,
        [sortBy]: sortDesc
      }

      await this.fetchList(params)
    },

    async onFilterChange ($event) {
      const params = {
        page: 1,
        per_page: this.perPage || 10
      }

      this.filter = {...$event}

      await this.fetchList(params)
    },

    async handleEdit (id) {
      this.$router.push({
        name: 'admin.edit',
        params: {
          id: id
        }
      }).catch(_ => {
      })
    },

    async handleDelete () {
      await Admin.delete_admin(this.idAdmin)

      await this.onSuccess(this.$t('message_success'), this.$t('delete_message_successfully'))

      await this.fetchList()
    },

    async fetchList (params = {}) {
      this.openModal = false
      this.isLoading = true

      const filter = {}

      for (let property in this.filter) {
        filter[`filters[${property}]`] = this.filter[property]
      }

      try {
        const resp = await Admin.paginate({
          query: {
            'include': 'roles',
            'sortBy[updated_at]': 'desc',
            ...params,
            ...filter
          }
        })

        this.list = [...resp.data]
        this.pagination = convertPagination(resp.pagination)
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },

    handleOpenModal (id) {
      this.openModal = true
      this.idAdmin = id
    }
  }
}
</script>

<style lang="scss" scoped>
  #AdminIndex {
    padding: 1.25rem;
  }
</style>
