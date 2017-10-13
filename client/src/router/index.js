import Vue from 'vue'
import Router from 'vue-router'
import Programs from '@/components/Programs'
import Program from '@/components/Program'
import Episode from '@/components/Episode'
import Xsplit from '@/components/Xsplit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Root',
      path: '/',
      component: Programs
    },
    {
      name: 'Programs',
      path: '/programs',
      component: Programs
    },
    {
      name: 'Program',
      path: '/programs/:programId',
      component: Program
    },
    {
      name: 'Episode',
      path: '/programs/:programId/episodes/:episodeId',
      component: Episode
    }
  ]
})
