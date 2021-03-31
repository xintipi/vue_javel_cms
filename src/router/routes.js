import Resource from '@/components/Resource'
import { AuthGuard, LoginGuard, ResolveGuard } from '@/router/guards'

import { PERMISSIONS } from '@/enum/permissions.enum'

export function page (path) {
  return () => import(/* webpackChunkName: "[request]" */ `@/pages/${path}`)
}

export const routes = [
  // Login
  {
    path: '/login',
    name: 'login',
    component: page('Login.vue'),
    meta: { layout: 'auth' },
    beforeEnter: ResolveGuard([LoginGuard])
  },

  // Home
  {
    path: '/',
    component: Resource,
    children: [
      {
        path: '',
        name: 'home',
        component: page('Home.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'dashboard_left_menu',
          permissions: [PERMISSIONS.VIEW_DASHBOARD],
          breadcrumbs: [
            { title: 'dashboard_left_menu' }
          ]
        }
      }
    ]
  },

  // Banner
  {
    path: '/banners',
    component: Resource,
    children: [
      {
        path: '',
        name: 'banners.index',
        component: page('banners/Index.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'banner_list_page',
          permissions: [PERMISSIONS.VIEW_BANNER],
          breadcrumbs: [
            { title: 'banner_list_page', name: 'banners.index' }
          ]
        }
      },
      {
        path: '/banners/create',
        name: 'banners.create',
        component: page('banners/Create.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          type: 'banner',
          permissions: [PERMISSIONS.CREATE_BANNER],
          title: 'banner_list_page_title',
          breadcrumbs: [
            { title: 'banner_list_page', name: 'banners.index' },
            { title: 'banner_create_page', name: 'banners.create' }
          ]
        }
      },
      {
        path: '/banners/:id/edit',
        name: 'banners.edit',
        component: page('banners/Edit.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          type: 'banner',
          permissions: [PERMISSIONS.VIEW_BANNER],
          title: 'banner_update_page',
          breadcrumbs: [
            { title: 'banner_list_page', name: 'banners.index' },
            { title: 'banner_update_page', name: 'banners.edit' }
          ]
        }
      }
    ]
  },

  // News
  {
    path: '/news',
    component: Resource,
    children: [
      {
        path: '',
        name: 'news.index',
        component: page('news/Index.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'news_management',
          permissions: [PERMISSIONS.VIEW_NEWS],
          breadcrumbs: [
            { title: 'news_management', name: 'news.index' }
          ]
        }
      },
      {
        path: '/news/create',
        name: 'news.create',
        component: page('news/Create.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          type: 'news',
          permissions: [PERMISSIONS.CREATE_NEWS],
          title: 'news_management_page_title',
          breadcrumbs: [
            { title: 'news_management', name: 'news.index' },
            { title: 'news_create', name: 'news.create' }
          ]
        }
      },
      {
        path: '/news/:id',
        name: 'news.show',
        component: page('news/Show.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'news_management',
          breadcrumbs: [
            { title: 'news_management', name: 'news.index' },
            { title: 'news_show', name: 'news.show' }
          ]
        }
      },
      {
        path: '/news/:id/edit',
        name: 'news.edit',
        component: page('news/Edit.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          type: 'news',
          permissions: [PERMISSIONS.VIEW_NEWS],
          title: 'news_edit',
          breadcrumbs: [
            { title: 'news_management', name: 'news.index' },
            { title: 'news_edit', name: 'news.edit' }
          ]
        }
      }
    ]
  },

  // Admin
  {
    path: '/admin',
    component: Resource,
    children: [
      {
        path: '',
        name: 'admin.index',
        component: page('admin/Index.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'admin_list',
          permissions: [PERMISSIONS.VIEW_ADMIN],
          breadcrumbs: [
            { title: 'admin_list', name: 'admin.index' }
          ]
        }
      },
      {
        path: '/admin/create',
        name: 'admin.create',
        component: page('admin/Create.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'admin_create',
          permissions: [PERMISSIONS.CREATE_ADMIN],
          breadcrumbs: [
            { title: 'admin_list', name: 'admin.index' },
            { title: 'admin_create', name: 'admin.create' }
          ]
        }
      },
      {
        path: '/admin/:id/edit',
        name: 'admin.edit',
        component: page('admin/Edit.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'admin_edit',
          permissions: [PERMISSIONS.VIEW_ADMIN],
          breadcrumbs: [
            { title: 'admin_list', name: 'admin.index' },
            { title: 'admin_edit', name: 'admin.edit' }
          ]
        }
      }
    ]
  },

  // User
  {
    path: '/user',
    component: Resource,
    children: [
      {
        path: '',
        name: 'user.index',
        component: page('user/Index.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'user_list',
          permissions: [PERMISSIONS.VIEW_USER],
          breadcrumbs: [
            { title: 'user_list', name: 'user.index' }
          ]
        }
      },
      {
        path: '/user/create',
        name: 'user.create',
        component: page('user/Create.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'user_list_page_title',
          permissions: [PERMISSIONS.CREATE_USER],
          breadcrumbs: [
            { title: 'user_list', name: 'user.index' },
            { title: 'user_create', name: 'user.create' }
          ]
        }
      },
      {
        path: '/user/:id/edit',
        name: 'user.edit',
        component: page('user/Edit.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'user_edit',
          permissions: [PERMISSIONS.VIEW_USER],
          breadcrumbs: [
            { title: 'user_list', name: 'user.index' },
            { title: 'user_edit', name: 'user.edit' }
          ]
        }
      }
    ]
  },

  // Role
  {
    path: '/role',
    component: Resource,
    children: [
      {
        path: '',
        name: 'role.index',
        component: page('role/Index.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'role_list',
          permissions: [PERMISSIONS.VIEW_ROLE],
          breadcrumbs: [
            { title: 'role_list', name: 'role.index' }
          ]
        }
      },
      {
        path: '/role/create',
        name: 'role.create',
        component: page('role/Create.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'role_list_page_title',
          permissions: [PERMISSIONS.CREATE_ROLE],
          breadcrumbs: [
            { title: 'role_list', name: 'role.index' },
            { title: 'role_create', name: 'role.create' }
          ]
        }
      },
      {
        path: '/role/edit/:id',
        name: 'role.edit',
        component: page('role/Edit.vue'),
        beforeEnter: ResolveGuard([AuthGuard]),
        meta: {
          title: 'role_edit',
          permissions: [PERMISSIONS.VIEW_ROLE],
          breadcrumbs: [
            { title: 'role_list', name: 'role.index' },
            { title: 'role_edit', name: 'role.edit' }
          ]
        }
      }
    ]
  },

  // Error
  {
    path: '/error',
    component: Resource,
    children: [
      {
        path: '/403',
        name: 'error.403',
        component: page('error/Error403.vue'),
        meta: {
          title: '',
          permissions: PERMISSIONS.ALL,
          breadcrumbs: [
            { title: 'error', name: 'error.403' }
          ]
        }
      },
      {
        path: '/404',
        name: 'error.404',
        component: page('error/Error404.vue'),
        meta: {
          title: '',
          permissions: PERMISSIONS.ALL,
          breadcrumbs: [
            { title: 'error', name: 'error.404' }
          ]
        }
      },
      {
        path: '/409',
        name: 'error.409',
        component: page('error/Error409.vue'),
        meta: {
          title: '',
          permissions: PERMISSIONS.ALL,
          breadcrumbs: [
            { title: 'error', name: 'error.409' }
          ]
        }
      },
      {
        path: '/429',
        name: 'error.429',
        component: page('error/Error429.vue'),
        meta: {
          title: '',
          permissions: PERMISSIONS.ALL,
          breadcrumbs: [
            { title: 'error', name: 'error.429' }
          ]
        }
      },
      {
        path: '/500',
        name: 'error.500',
        component: page('error/Error500.vue'),
        meta: {
          title: '',
          permissions: PERMISSIONS.ALL,
          breadcrumbs: [
            { title: 'error', name: 'error.500' }
          ]
        }
      },
      {
        path: '/503',
        name: 'error.503',
        component: page('error/Error503.vue'),
        meta: {
          title: '',
          permissions: PERMISSIONS.ALL,
          breadcrumbs: [
            { title: 'error', name: 'error.503' }
          ]
        }
      }
    ]
  },

  // Page not found
  {
    path: '*',
    component: page('error/Error404.vue')
  }
]
