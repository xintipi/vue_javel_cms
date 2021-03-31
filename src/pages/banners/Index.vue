<template>
  <div id="BannerIndex">
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

      <template slot="thumbnail_url" slot-scope="thumbnail_url">
        <template v-if="thumbnail_url">
          <img class="img-thumbnail-list" v-lazy="thumbnail_url" alt=""/>
        </template>
        <template v-else>
          <img class="img-thumbnail-list" v-lazy="'../../assets/images/dummy_image.png'" alt=""/>
        </template>
      </template>

      <template slot="app_setting"
                slot-scope="app_setting">
        <p class="mb-0"
           v-html="app_setting.appSetting ? app_setting.appSetting.app_setting_name : $t('not_template')"/>
      </template>

      <template slot="duration"
                slot-scope="duration">
        {{ duration.publish_start_datetime }} ~ {{ duration.publish_end_datetime}}
      </template>

      <template slot="prefectures"
                slot-scope="prefectures">
        <template v-if="prefectures.length">
          {{ prefectures.map((item) => item.prefecture_name).join(', ') }}
        </template>
      </template>

      <!--Custom badge active-->
      <template slot="is_active"
                slot-scope="is_active">
        <span class="badge bg-primary text-white" v-if="is_active"> {{$t('active')}} </span>
        <span class="badge bg-light" v-else> {{$t('inactive')}} </span>
      </template>

      <!--Custom type table-->
      <template slot="action_edit"
                slot-scope="action_edit">
        <a-tooltip placement="bottom" :title="$t('tooltip_edit')">
          <a @click.prevent="handleEdit(action_edit.id)"
             href="#"
             class="text-decoration-none action">
            <img src="../../assets/images/icon-edit.svg" alt="icon">
          </a>
        </a-tooltip>
      </template>

      <template slot="action_delete"
                slot-scope="action_delete">
        <a-tooltip placement="bottom" :title="$t('tooltip_delete')" v-if="hasPermissionAction(PERMISSIONS.DELETE_BANNER)">
          <a href="#"
             @click.prevent="handleOpenModal(action_delete.id)"
             class="text-decoration-none action">
            <img src="../../assets/images/icon-delete.svg" alt="icon">
          </a>
        </a-tooltip>
      </template>
    </a-table>

    <!-- Create -->
    <div class="card-footer card-action fixed-bottom shadow">
      <div class="btn-create">
        <router-link :to="{name: 'banners.create'}" class="btn btn-success btn-pill float-right px-4 font-weight-bold" tag="button">
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
import Banner from '@/models/Banner'
import Prefecture from '@/models/Prefecture'
import Table from '@/mixins/table.mixin'
import Form from '@/mixins/form.mixin'
import { convertPagination } from '@/utils/filters'
import store from '@/store'
import * as types from '@/store/mutation-types'
import Search from './Search'
import { EditIcon, Trash2Icon } from 'vue-feather-icons'
import {map, replace} from 'lodash-es'
import ModalDelete from '@/components/Modal/ModalDelete'

export default {
  name: 'Index',

  components: {
    ModalDelete,
    Search,
    EditIcon,
    Trash2Icon
  },

  async beforeRouteEnter (to, from, next) {
    const resp = await Banner.paginate({
      query: {
        page: 1,
        per_page: 10,
        include: 'prefectures,appSetting',
        'fields[banners]': 'thumbnail,thumbnail_url,banner_title,publish_start_datetime,publish_end_datetime,display_order,is_active,updated_at,id',
        'sortBy[updated_at]': 'desc'
      }
    })

    // Get Prefecture
    let respPrefecture = store.getters.prefectures

    if (!respPrefecture) {
      respPrefecture = await Prefecture.all()

      store.commit(types.SET_PREFECTURES, respPrefecture)
    }

    to.meta['list'] = resp.data
    to.meta['pagination'] = convertPagination(resp.pagination)
    to.meta['prefectures'] = respPrefecture.data

    next()
  },

  data () {
    return {
      isLoading: false,
      list: [],
      pagination: {},
      filter: {},
      sortBy: 'updated_at',
      sortDesc: true,
      prefectureNames: [],
      perPage: '',
      openModal: false,
      idBanner: ''
    }
  },

  mixins: [Table, Form],

  computed: {
    columns () {
      return [
        {
          title: this.$t('thumbnail'),
          dataIndex: 'thumbnail_url',
          scopedSlots: { customRender: 'thumbnail_url' },
          width: 85
        },
        {
          title: this.$t('name_app_setting'),
          scopedSlots: { customRender: 'app_setting' }
        },
        {
          title: this.$t('duration'),
          scopedSlots: { customRender: 'duration' }
        },
        {
          title: this.$t('banner_title_table'),
          dataIndex: 'banner_title',
          ellipsis: true
        },
        {
          title: this.$t('prefecture'),
          scopedSlots: { customRender: 'prefectures' },
          dataIndex: 'prefectures'
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_active',
          scopedSlots: {customRender: 'is_active'},
          width: '110px',
          align: 'center'
        },
        {
          title: this.$t('display_order'),
          dataIndex: 'display_order',
          width: 120,
          align: 'center'
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
    }
  },

  created () {
    this.list = this.$route.meta['list']
    this.pagination = this.$route.meta['pagination']

    // get all prefecture name list
    this.prefectureNames = map(this.list, (item) => item.prefecture_name)
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

      this.filter = { ...$event }

      await this.fetchList(params)
    },

    async fetchList (params = {}) {
      this.openModal = false
      this.isLoading = true
      const filter = {}

      for (let property in this.filter) {
        filter[`filters[${property}]`] = this.filter[property]
      }

      try {
        const resp = await Banner.paginate({
          query: {
            'include': 'prefectures,appSetting',
            'fields[banners]': 'thumbnail,thumbnail_url,banner_title,publish_start_datetime,publish_end_datetime,display_order,is_active,updated_at,id',
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

    async handleDelete () {
      try {
        const params = {
          page: 1,
          per_page: this.perPage || 20
        }

        await Banner.delete(this.idBanner)

        // set toast
        await this.onSuccess(this.$t('message_success'), this.$t('delete_message_successfully'))

        await this.fetchList(params)
      } catch (err) {
        await this.onError(this.$t('message_error'), this.$t('delete_message_error'))
      }
    },

    handleEdit (id) {
      this.$router.push({ name: 'banners.edit',
        params: {id}
      })
    },

    handleOpenModal (id) {
      this.openModal = true
      this.idBanner = id
    }
  }
}
</script>

<style lang="scss" scoped>
  #BannerIndex {
    padding: 1.25rem;
  }
</style>
