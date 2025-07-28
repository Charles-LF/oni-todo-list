import { Context } from '@koishijs/client'
import Page from './page.vue'

export default (ctx: Context) => {
  ctx.page({
    name: '缺氧代办清单',
    path: '/todolist',
    component: Page,
  })
}
