import Vue from 'vue'
import Router from 'vue-router'
import { routes } from '@/router/routes'
import store from '@/store'
import head from 'lodash-es/head'
import * as types from '@/store/mutation-types'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/cms2/',
  routes
})

/**
 * Global Before Guards
 *
 * @param to
 * @param from
 * @param next
 * @returns {Promise<void>}
 */
const beforeEach = async (to, from, next) => {
  const currentRoute = head(to.matched)
  store.commit(types.SET_LAYOUT, { layout: currentRoute.meta.layout })
  router.app.$Progress.start()
  next()
}

/**
 * Global After Hooks
 *
 * @returns {Promise<void>}
 */
const afterEach = async () => {
  await router.app.$nextTick()
  store.commit(types.END_LOADING)
  router.app.$Progress.finish()
}

router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
