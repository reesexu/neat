import {regeneratorRuntime} from '../../lib/index'
const {models} = getApp()

Page({
  data: {
    todos: []
  },
  onLoad () {
    this.getTodos()
  },
  async addTodo ({detail}) {
    try {
      await models.todo.addTodo({title: detail.value})
      await this.getTodos()
    } catch (error) {
      console.error(error)
    }
  },
  async getTodos () {
    try {
      const {data} = await models.todo.getTodos()
      this.setData({todos: data})
    } catch (error) {
      console.error(error)
    }
  }
})
