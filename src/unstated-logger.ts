import * as differ from 'deep-object-diff'
import * as unstated from 'unstated'
import Str from './support/Str'
import LoggerConfig from './support/LoggerConfig';
import colors from './support/logger-colors'

const _global: any = window || global;
const __SUPER_SECRET_CONTAINER_DEBUG_HOOK__ = (unstated as any).__SUPER_SECRET_CONTAINER_DEBUG_HOOK__
const ENABLED = typeof _global !== 'undefined' && process.env.NODE_ENV !== 'production' && _global.__REDUX_DEVTOOLS_EXTENSION__

if (ENABLED) {
  console.log(`You're currently using the unstated logger for development, disable it for production`)
} else {
  console.log(`You're in production or redux dev tools plugin is missing so unstated logger is disabled`)
}

class Logger {
  collapsed: boolean
  detailed: boolean
  enabled: boolean
  beauty: boolean
  private __containers: any
  private __devtool: any
  logger: any
  colors: Object
  details: string[]
  ignore: string[]
  private __counter: Number

  constructor() {
    this.colors = colors
    this.collapsed = false
    this.detailed = true
    this.enabled = ENABLED;
    this.beauty = false;
    this.logger = console
    this.ignore = ['JUMP_TO_STATE', 'JUMP_TO_ACTION']
    this.details = ['added', 'updated', 'deleted']
    this.__containers = {}
    this.__counter = 1

    this.__default()
  }

  __default() {
    if (this.enabled) {
      const name = 'Unstated logger';

      this.__devtool = _global.__REDUX_DEVTOOLS_EXTENSION__.connect({ name })
      this.__devtool.init()
    }
  }

  config(config: LoggerConfig) {
    for (const [key, value] of  Object.entries(config)) {
      this[key] = value;
    }
  }

  get(container: string): any {
    return this.__containers[container].container
  }

  dispatch(payload) {
    if (this.enabled) {
      const info = payload.__action;

      delete payload.__action

      this.__devtool.send(info, payload)
    }
  }

  store() {
    const store: any = {}

    for (const [key, value] of Object.entries(this.__containers)) {
      store[key] = (value as any).container.state
    }

    return store
  }

  containers() {
    const containers: any = {}

    for (const [key, value] of Object.entries(this.__containers)) {
      containers[key] = (value as any).container
    }

    return containers
  }

  print() {
    const color = (this.colors as any).title
    const style = `color: ${color}; font-weight: bold`

    for (const [key, value] of Object.entries(this.__containers)) {
      console.log(`%c ${key} → `, style, (value as any).container.state)
    }
  }

  private stateWasChanged(state: Object) {
    return Object.keys(state).length > 0
  }

  private render(kind: string, value: Object) {
    const colors = this.colors as any

    const color = colors[kind].color
    const text = colors[kind].text
    const style = `color: ${color}; font-weight: bold`

    console.log(`%c → ${text}`, style, value)
  }

  start() {
    if (this.enabled) {
      __SUPER_SECRET_CONTAINER_DEBUG_HOOK__((container: any) => {
        let prevState = container.state || container.constructor.state
        let name = container.name || container.constructor.name

        if (this.beauty) {
          name = name.replace(/container$/ig, '');
          name = Str.title(Str.uncamel(name));
        }

        if (!this.__containers[name]) {
          this.connect(
            name,
            container
          )
        }

        container.subscribe(() => {
          const state = { ...container.state }

          delete container.state.__action;

          this.logToConsole(this.__containers[name], prevState, state)

          this.emitStateChangesToReduxDevTools(this.__containers[name], state)

          prevState = state
        })
      })
    }
  }

  private connect(widget: string, container: any): void {
    let instance: any
    const name = widget || 'Unstated ' + this.__counter

    container.__name = name

    this.__containers[name] = {
      container,
      instance
    }

    if (this.enabled) {
      instance = _global.__REDUX_DEVTOOLS_EXTENSION__.connect({ name })
      instance.init()

      this.__containers[name].instance = instance

      this.subscribeToReduxDevToolsEvents(this.__containers[name])
    }
  }

  private logToConsole(container: any, prevState: any, state: any) {
    const nextState = Object.assign({}, state)
    let name = container.container.__name

    const colors = this.colors as any
    const jump = container.container.__jump
    const group = this.collapsed ? console.groupCollapsed : console.group
    const titleStyle = ['color: gray; font-weight: lighter;']

    const info = this.getInfoForReduxDevTools(name, state) + (jump ? ' → ' + jump : '')

    group(`%c ${info}`, titleStyle)

    const stylesPrevState = `color: ${colors.prevState.color}; font-weight: bold`

    const oldState = Object.assign({}, prevState)

    delete oldState.__action

    console.log('%c PREV STATE:', stylesPrevState, oldState)

    if (this.detailed) {
      const diff = (differ as any).detailedDiff(prevState, state)

      for (const i in this.details) {
        const kind = this.details[i]
        const value = Object.assign({}, diff[kind])

        delete value.__action

        if (this.stateWasChanged(value)) {
          this.render(kind, value)
        }
      }
    }

    delete nextState.__action

    container.container.__jump = ''

    const stylesNextState = `color: ${colors.nextState.color}; font-weight: bold`

    console.log('%c NEXT STATE:', stylesNextState, nextState)

    console.groupEnd()
  }

  private subscribeToReduxDevToolsEvents(container: any): void {
    container.instance.subscribe((message: any) => {
      switch (message.payload && message.payload.type) {
        case 'JUMP_TO_STATE':
        case 'JUMP_TO_ACTION':
          const newState = JSON.parse(message.state)
          const action = {
            __action: message.payload.type
          }

          container.container.__jump = newState.__action

          const state = Object.assign({}, newState, action)

          container.container.setState(state)
      }
    })
  }

  private getInfoForReduxDevTools(name: string, nextState: any): string {
    let info = '...'

    if (typeof nextState === 'object') {
      info = '' + nextState.__action
      info = name + ' - ' + info

      delete nextState.__jump
    }

    return info
  }

  private emitStateChangesToReduxDevTools(container: any, state: any): void {
    if (container.instance) {
      const name = container.container.__name
      const action = '' + state.__action
      const ignored = this.ignore.indexOf(action) !== -1

      if (!ignored) {
        const info = this.getInfoForReduxDevTools(name, state)

        container.instance.send(info, state)
      }
    }
  }
}

export default Logger
