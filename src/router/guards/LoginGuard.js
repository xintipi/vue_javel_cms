import store from '@/store'

export const LoginGuard = (to, from, next) => {
  if (store.getters.profile || store.state.token) {
    next({ name: 'home' })
    return
  }
  next()
}
