import { Context, Schema } from 'koishi'
import { resolve } from 'path'
import { } from '@koishijs/plugin-console'

export const name = 'oni-todo-list'

export const usage = `
  todo: 查看待办事项,\n
  todo.add : 添加待办事项,\n
  todo.complete : 标记待办事项为完成,\n
  todo.delete : 删除待办事项,\n
  todo.clear : 清空待办事项列表,
  
`

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export const inject = ['console', 'database']

export interface Itodoitem {
  id: number
  title: string
  completed: boolean
}

interface IThings {
  id: number
  things: string
}

declare module 'koishi' {
  interface Tables {
    todoitem: Itodoitem
    things: IThings
  }
}

declare module '@koishijs/plugin-console' {
  interface Events {
    'get-todo-list'(): Promise<Itodoitem[]>,
    'get-things'(): Promise<IThings[]>,
  }
}

export function apply(ctx: Context) {
  // 注册数据库
  ctx.model.extend('todoitem', {
    id: 'integer',
    title: 'string',
    completed: 'boolean',
  }, {
    primary: 'id',
  })

  ctx.model.extend('things', {
    id: 'integer',
    things: 'text'
  })

  ctx.inject(['console'], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  })

  // 前后端通信  没搞明白
  ctx.console.addListener('get-todo-list', async () => {
    return await ctx.database.get('todoitem', {}) || []
  })
  ctx.console.addListener('get-things',async()=>{
    return await ctx.database.get('things',{}) || []
  })

  // 指令注册
  ctx.command('todo', '待办事项清单', { authority: 0 }).action(async ({ session }) => {
    const todos = await ctx.database.get('todoitem', {})
    const incompleteTodos = todos.filter(todo => todo)
    return `
      前往网页端：https://klei.vip/onitodolist \n当前任务清单如下：\n${incompleteTodos.map(todo => `${todo.id}. ${todo.title} [${todo.completed ? '已完成' : '未完成'}]`).join('\n')}
    `
  })
  ctx.command('todo.add <title>', '添加待办事项', { authority: 0 }).action(async ({ session }, title: string) => {
    if (!title) {
      return '请提供待办事项的内容。'
    }
    const todos = await ctx.database.get('todoitem', {})
    const id = todos.length + 1 | 0
    const newItem: Itodoitem = { id, title, completed: false }
    await ctx.database.create('todoitem', newItem)
    return `已添加待办事项：ID ${id}，内容：${title}`
  })
  ctx.command('todo.complete <ids:number>', '标记待办事项为完成', { authority: 0 }).action(async ({ session }, id: number) => {
    const todos = await ctx.database.get('todoitem', { id: id })
    console.log(todos)
    if (!todos || todos.length === 0) {
      return `未找到 ID 为 ${id} 的待办事项。`
    }
    await ctx.database.set('todoitem', { id: id }, { completed: true })
    return `已标记待办事项 ID ${id} 为完成。`
  })
  ctx.command('todo.delete <id:number>', '删除待办事项', { authority: 0 }).action(async ({ session }, id: number) => {
    const todos = await ctx.database.get('todoitem', { id: id })
    if (!todos || todos.length === 0) {
      return `未找到 ID 为 ${id} 的待办事项。`
    }
    await ctx.database.remove('todoitem', { id: id })
    return `已删除待办事项 ID ${id}。`
  })
  ctx.command('todo.clear', '清空已完成的待办事项列表', { authority: 2 }).action(async ({ session }) => {
    const todos = await ctx.database.get('todoitem', {})
    const incompleteTodos = todos.filter(todo => todo.completed)
    incompleteTodos.map(async (todo) => {
      await ctx.database.remove('todoitem', { id: todo.id })
    })
    return `已尝试移除以下已完成的待办：\n${incompleteTodos.map(todo => `${todo.id}. ${todo.title} [${todo.completed ? '已完成' : '未完成'}]`).join('\n')}`
  })
  ctx.command('things','列出记住的列表，记你太美',{authority:0}).action(async()=>{
    const things = await ctx.database.get('things',{}) ||[]
    if (!things){
      return `还没有记好的事情喔！`
    }
    return `
    前往网页端：https://klei.vip/onitodolist \n当前记住的东西如下：\n${things.map(thing => `${thing.id}. ${thing.things}`).join('\n')}
    `
  })
   ctx.command('things.add <thingStr>', '记你太美', { authority: 0 }).alias('你记一下').action(async ({ session }, thingStr: string) => {
    if (!thingStr) {
      return '请提供待办事项的内容。'
    }
    const things = await ctx.database.get('things', {})
    const id = things.length + 1 | 0
    const newItem:IThings = { id, things:thingStr}
    await ctx.database.create('things', newItem)
    return `已添加待办事项：ID ${id}，内容：${thingStr}`
  })
    ctx.command('things.delete <id:number>', '忘记记住的东西', { authority: 0 }).action(async ({ session }, id: number) => {
    const things = await ctx.database.get('things', { id: id })
    if (!things || things.length === 0) {
      return `未找到 ID 为 ${id} 的东西。`
    }
    await ctx.database.remove('things', { id: id })
    return `已经忘记了 ID为 ${id}的事情啦。`
  })
}
