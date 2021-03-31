<template>
  <div id="RoleIndex">
    <Search @filter-changed="onFilterChange($event)"/>

    <a-table bordered
             :columns="columns"
             :data-source="list"
             :loading="isLoading"
             :rowKey="record => record.id"
             :pagination="{
               ...pagination,
               showSizeChanger: true,
               buildOptionText: buildOptionText,
               pageSizeOptions: ['10', '20', '30'],
               showTotal: showTotal
             }"
             @change="onPageChange">

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
                   v-if="hasPermissionAction(PERMISSIONS.DELETE_ROLE)">
          <a href="#"
             v-if="currentUser.roles.id !== action_delete.id"
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
        <router-link :to="{name: 'role.create'}"
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
import Role from '@/models/Role'
import Table from '@/mixins/table.mixin'
import Form from '@/mixins/form.mixin'
import { convertPagination } from '@/utils/filters'
import Search from './Search'
import { EditIcon, Trash2Icon, PlusIcon } from 'vue-feather-icons'
import store from '@/store'
import ModalDelete from '@/components/Modal/ModalDelete'

export default {
  name: 'Index',

  components: {
    ModalDelete,
    Search,
    EditIcon,
    Trash2Icon,
    PlusIcon
  },

  async beforeRouteEnter (to, from, next) {
    // Get All Roles
    const resp = await Role.paginate({
      query: {
        page: 1,
        per_page: 10,
        'include': 'permissions',
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
      perPage: '',
      openModal: false,
      idRole: ''
    }
  },

  mixins: [Table, Form],

  computed: {
    columns () {
      return [
        {
          title: this.$t('display_name_role'),
          dataIndex: 'display_name'
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
    async onPageChange (pagination) {
      this.perPage = pagination.pageSize

      const params = {
        page: pagination.current,
        per_page: pagination.pageSize
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
        name: 'role.edit',
        params: {
          id: id
        }
      }).catch(_ => {})
    },

    async handleDelete () {
      try {
        await Role.delete_role(this.idRole)

        await this.onSuccess(this.$t('message_success'), this.$t('delete_message_successfully'))

        await this.fetchList()
      } catch (err) {
        await this.onError(this.$t('message_error'), this.$t('delete_message_error'))
      }
    },

    async fetchList (params = {}) {
      this.openModal = false
      this.isLoading = true

      const filter = {}

      for (let property in this.filter) {
        filter[`filters[${property}]`] = this.filter[property]
      }

      try {
        const resp = await Role.paginate({
          query: {
            ...params,
            ...filter,
            'include': 'permissions',
            'sortBy[updated_at]': 'desc'
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
      this.idRole = id
    }
  }
}
</script>

<style lang="scss" scoped>
  #RoleIndex {
    padding: 1.25rem;
  }
</style>
