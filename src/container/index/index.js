export class Todo {
  static #NAME = 'todo'

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }
  // масив де будуть збиратись обєкти наших задач
  static #list = []
  static #count = 0
  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }
  // це посилання на блок коду котре знаходиться в task
  static #block = null

  // це посилання на блок коду в template
  static #template = null

  // це посилання на блок коду в form
  static #input = null
  static #button = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    this.#block = document.querySelector('.task__list')
    this.#input = document.querySelector('.form__input')
    this.#button = document.querySelector('.form__button')

    // console.log(
    //   this.#block,
    //   this.#template,
    //   this.#input,
    //   this.#button,
    // )

    //прикрипляємо функцію очищення до кнопки
    this.#button.onclick = this.#handleAdd
    this.#loadData()

    this.#render()
  }
  // записуємо завдання , потім натискаємо на кнопку і інпут стирається
  static #handleAdd = () => {
    const value = this.#input.value
    if (value.length > 1) {
      this.#createTaskData(value)
      this.#input.value = ''

      this.#render()
      this.#saveData()
    }
  }
  // функція яка відображає контент на сторінці
  static #render = () => {
    this.#block.innerHTML = ''
    if (this.#list.length === 0) {
      this.#block.innerText = 'Список задач пустий'
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData)
        this.#block.append(el)
      })
    }
  }

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true)
    const [id, text, btnDo, btnCancel] = el.children
    id.innerText = `${data.id}.`

    text.innerText = data.text

    btnCancel.onclick = this.#handleCancel(data)
    btnDo.onclick = this.#handleDo(data, btnDo, el)

    if (data.done) {
      el.classList.add('task--done')
      btnDo.classList.remove('task__button--do')
      btnDo.classList.add('task__button--done')
    }

    return el
  }

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id)

    if (result === true || result === false) {
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')

      this.#saveData()
    }
  }
  // це функція яка переключає якщо з do  done cancel (toggle  переключатель)
  static #toggleDone = (id) => {
    const task = this.#list.find((item) => item.id === id)

    if (task) {
      task.done = !task.done
      return task.done
    } else {
      return null
    }
  }

  static #handleCancel = (data) => () => {
    if (confirm('Видалити задачу ?')) {
      const result = this.#deleteById(data.id)
      if (result) this.#render()
      this.#saveData()
    }
  }
  static #deleteById = (id) => {
    this.#list = this.#list.filter((item) => item.id !== id)
    return true
  }
}
Todo.init()

window.todo = Todo
