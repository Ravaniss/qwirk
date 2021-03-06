import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/splash-screen',
      name: 'splash-screen',
      component: () => import('./views/SplashScreen.vue')
    },
    {
      path: '/',
      name: 'auth',
      component: () => import('./views/Auth.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: 'server/:serverId',
      name: 'server',
      component: () => import('./views/Tchat.vue'),
      children: [
        {
          path: 'tchat/:convId/:type',
          name: 'tchatServer',
          component: () => import('./views/Tchat.vue'),
        }
      ]
    },
    {
      path: '/landing-page',
      name: 'landing-page',
      component: () => import('./views/LandingPage.vue'),
      children: [
        {
          path: 'tchat/:convId/:type',
          name: 'tchat',
          component: () => import('./views/Tchat.vue'),
        },
        {
          path: 'library',
          name: 'library',
          component: () => import('./views/Library.vue'),
          children: [
            {
              path: '',
              name: 'myGames',
              component: () => import('./views/Grids/LibraryGrid.vue'),
            }
          ]
        },
        {
          path: 'store',
          name: 'store',
          component: () => import('./views/Store.vue'),
        },
        {
          path: 'friends',
          component: () => import('./views/Friends.vue'),
          children: [
            {
              path: '',
              name: 'allFriend',
              component: () => import('./views/Grids/FriendGrid.vue'),
            },
            {
              path: 'online',
              name: 'online',
              component: () => import('./views/Grids/FriendGrid.vue'),
            },
            {
              path: 'wait',
              name: 'wait',
              component: () => import('./views/Grids/FriendWaitGrid.vue'),
            },
            {
              path: 'locked',
              name: 'locked',
              component: () => import('./views/Grids/FriendGrid.vue'),
            },
            {
              path: 'add',
              name: 'addFriend',
              component: () => import('./views/AddFriend.vue'),
            }
          ]
        },
        {
          path: 'success',
          name: 'success',
          component: () => import('./views/Success.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
})
