<template>
  <aside class="navbar navbar-vertical navbar-expand-lg">
    <div class="container-fluid">
      <button class="navbar-toggler" data-target="#navbar-menu" data-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="row">
        <router-link class="navbar-brand text-center" :to="{name: 'home'}">
          <img alt="Newphoria" class="navbar-brand-image" src="../assets/images/rakul-white-logo.svg">
        </router-link>
      </div>

      <div class="collapse navbar-collapse" id="navbar-menu">
        <ul class="navbar-nav">
          <li  v-for="item of navigations"
               :key="item.id"
               class="nav-item"
               :class="{'dropdown': item.dropdown, 'nav-item-active': $route.name && $route.name.includes('app') && item.dropdown }">
            <!--navigation normal-->
            <router-link
              v-if="hasPermission(item)"
              :exact="item.exact"
              :to="{name: item.routeName}"
              class="nav-link">
                <span class="nav-link-title font-weight-bold">
                  {{ $t(`${ item.title }`) }}
                </span>
            </router-link>

            <div v-if="item.line" class="line"/>
          </li>

          <!--Logout-->
          <li class="nav-item">
            <a @click.prevent="logout"
               href="#"
              class="nav-link">
              <span class="nav-link-title font-weight-bold">
                {{ $t('logout') }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
import { navigations } from '@/config'
import { PERMISSIONS } from '@/enum/permissions.enum'
import store from '@/store'
import {isEmpty} from 'lodash-es'
import Admin from '@/models/Admin'
import * as types from '@/store/mutation-types'

export default {
  name: 'Nav',

  computed: {
    permissions () {
      return store.getters.currentPermissions || []
    }
  },

  data () {
    return {
      navigations
    }
  },

  methods: {
    hasPermission (item) {
      const currentRoute = this.$router.resolve({ name: item.routeName }).route

      if (currentRoute.meta.permissions.includes(PERMISSIONS.ALL)) {
        return true
      }

      if (!isEmpty(currentRoute.meta.permissions)) {
        return !!this.permissions.find(permission => currentRoute.meta.permissions.includes(permission.name))
      }

      return false
    },

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
    background: #007CC3;
    padding: 0;
    box-shadow: 3px 0 10px rgba(0, 0, 0, .16);
    &-brand {
      box-shadow: 3px 0 10px rgba(0,0,0,.3);
      padding: 1rem 1.25rem!important;
      justify-content: start!important;
      &-image {
        height: 24px;
      }
    }

    &-nav {
      .nav-item {
        .nav-link {
          color: #ffffff!important;
          padding: 15px 1.25rem !important;
          line-height: 1;
          border-radius: inherit;
          &.router-link-exact-active {
            background: rgba(255, 255, 255, .15);
          }
          &.router-link-active {
            background: rgba(255, 255, 255, .15);
            &+.dropdown-menu {
              background: rgba(255,255,255,0.15);
            }
          }
          &:hover {
            color: rgba(255, 255, 255, .6);
          }
        }
        .dropdown-menu {
          li {
            .dropdown-item {
              color: rgba(255, 255, 255, .6);
              padding: 10.5px 1.25rem 10.5px 2.5rem;
              line-height: 1;
              position: relative;
              span {
                font-size: 12px;
              }
              &:hover {
                color: #ffffff;
                background: transparent;
              }
              &-active {
                color: #ffffff;
                &:before {
                  content: '';
                  position: absolute;
                  width: 8px;
                  height: 8px;
                  background: #ffffff;
                  border-radius: 50%;
                  left: 20px;
                  top: 50%;
                  margin-top: -4px;
                }
              }
            }
          }
        }
        &-active {
          background: rgba(255, 255, 255, .15);
        }
      }
    }
  }
  .line {
    border-bottom: 1px solid #ffffff;
    margin: 12px 1.25rem;
  }
</style>
