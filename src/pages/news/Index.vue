<template>
  <div class="news" id="NewsIndex">
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

      <template slot="duration" slot-scope="duration">
        {{ duration.publish_start_datetime }} ~ {{ duration.publish_end_datetime}}
      </template>

      <template slot="news_category" slot-scope="news_category">
        {{news_category.news_category_name}}
      </template>

      <!--Custom badge active-->
      <template slot="is_active" slot-scope="is_active">
        <span class="badge bg-primary text-white" v-if="is_active"> {{$t('active')}} </span>
        <span class="badge bg-light" v-else> {{$t('inactive')}} </span>
      </template>

      <template slot="news_title" slot-scope="news_title">
        {{ news_title }}
      </template>

      <template slot="prefectures" slot-scope="prefectures">
        <template v-if="prefectures.length">
          {{ prefectures.map((item) => item.prefecture_name).join(', ') }}
        </template>
      </template>

      <!--Custom type table-->
      <template slot="action_edit" slot-scope="action_edit">
        <a-tooltip placement="bottom" :title="$t('tooltip_edit')">
          <a @click.prevent="handleEdit(action_edit.id)"
             href="#"
             class="text-decoration-none action">
            <img src="../../assets/images/icon-edit.svg" alt="icon">
          </a>
        </a-tooltip>
      </template>

      <template slot="action_delete" slot-scope="action_delete">
        <a-tooltip placement="bottom" :title="$t('tooltip_delete')" v-if="hasPermissionAction(PERMISSIONS.DELETE_NEWS)">
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
        <router-link :to="{name: 'news.create'}" class="btn btn-success btn-pill float-right px-4 font-weight-bold" tag="button">
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
import News from '@/models/News'
import Prefecture from '@/models/Prefecture'
import Form from '@/mixins/form.mixin'
import Table from '@/mixins/table.mixin'
import {convertPagination} from '@/utils/filters'
import store from '@/store'
import * as types from '@/store/mutation-types'
import Search from './Search'
import {EditIcon, Trash2Icon, PlusIcon} from 'vue-feather-icons'
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
    // Get Prefecture
    let respPrefecture = store.getters.prefectures

    if (!respPrefecture) {
      respPrefecture = await Prefecture.all()

      store.commit(types.SET_PREFECTURES, respPrefecture)
    }

    const respNewsCategory = await News.news_categories()

    const resp = await News.paginate({
      query: {
        page: 1,
        per_page: 10,
        'sortBy[updated_at]': 'desc',
        'include': ['news_category', 'prefectures']
      }
    })

    to.meta['list'] = resp.data
    to.meta['prefectures'] = respPrefecture.data
    to.meta['categories'] = respNewsCategory.data
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
      openModal: false,
      idNew: ''
    }
  },

  computed: {
    columns () {
      return [
        {
          title: this.$t('thumbnail'),
          dataIndex: 'thumbnail_url',
          scopedSlots: {customRender: 'thumbnail_url'},
          width: 85
        },
        {
          title: this.$t('duration'),
          scopedSlots: {customRender: 'duration'},
          width: '150px'
        },
        {
          title: this.$t('news_category'),
          scopedSlots: {customRender: 'news_category'},
          dataIndex: 'news_category',
          width: '120px'
        },
        {
          title: this.$t('content_title'),
          dataIndex: 'news_title'
        },
        {
          title: this.$t('prefecture'),
          scopedSlots: {customRender: 'prefectures'},
          dataIndex: 'prefectures',
          width: '100px'
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_active',
          scopedSlots: {customRender: 'is_active'},
          width: '110px',
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
        per_page: this.perPage || 10,
        include: ['news_category', 'prefectures']
      }

      this.filter = {...$event}

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
        const resp = await News.paginate({
          query: {
            'sortBy[updated_at]': 'desc',
            'include': ['news_category', 'prefectures'],
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

    async handleEdit (id) {
      this.$router.push({
        name: 'news.edit',
        params: {
          id: id
        }
      }).catch(_ => {
      })
    },

    handleOpenModal (id) {
      this.openModal = true
      this.idNew = id
    },

    async handleDelete () {
      await News.delete(this.idNew)

      await this.fetchList()
    }
  }
}
</script>

<style lang="scss" scoped>
  #NewsIndex {
    padding: 1.25rem 1.25rem .5rem 1.25rem;
  }
</style>
