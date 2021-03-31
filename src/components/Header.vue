<template>
  <header class="navbar navbar-expand-md d-none d-lg-flex">
    <div class="container-fluid">
      <button class="navbar-toggler" data-target="#navbar-menu" data-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-nav flex-row order-md-last ml-auto">
        <div class="nav-item dropdown">
          <a class="nav-link d-flex lh-1 text-reset p-0" href="#">
            <span class="avatar">
              <a-icon type="user" />
            </span>
            <div v-if="currentUser && currentUser.admin_name !== undefined" class="d-xl-block pl-2">
              <div>{{currentUser.admin_name}}</div>
              <div class="mt-1 small text-muted">{{currentUser.login_id}}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { BellIcon, LogOutIcon } from 'vue-feather-icons'
import store from '@/store'
import * as types from '@/store/mutation-types'
import Admin from '../models/Admin'
import { LOCALE } from '../enum/locale.enum'

export default {

  name: 'Header',

  components: {
    LogOutIcon,
    BellIcon
  },

  data () {
    return {
      languages: [LOCALE.ja, LOCALE.en]
    }
  },

  computed: {
    currentUser () {
      if (store.getters.profile !== null) {
        return store.getters.profile.data
      }
    }
  },

  methods: {
    async logout () {
      try {
        await Admin.logout()
      } catch (e) {}
      store.commit(types.LOG_OUT)
      await this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    background: #DCE7F0;
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 100;
  }
</style>
