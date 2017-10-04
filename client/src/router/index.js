import Vue from 'vue'
import Router from 'vue-router'
import Programs from '@/components/Programs'
import Program from '@/components/Program'
import Episode from '@/components/Episode'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Programs',
      path: '/',
      component: Programs
    },
    {
      name: 'Program',
      path: '/programs/:programId',
      component: Program
    },
    {
      name: 'Episode',
      path: '/programs/:programId/episode/:episodeId',
      component: Episode
    }
  ]
})
