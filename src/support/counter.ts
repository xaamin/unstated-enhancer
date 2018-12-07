import CounterConfig from './CounterConfig'
import Logger from '../unstated-logger'

class Counter {

  counters: any;
  logger: Logger;
  collapsed: boolean;
  debounce: number;
  debounceId: any;

  constructor() {
    this.counters = {};
    this.collapsed = true;
    this.debounce = 200;
  }

  __sum(total, num) {
    return total + num;
  }

  config(config: CounterConfig) {
    for (const [key, value] of  Object.entries(config)) {
      this[key] = value;
    }
  }

  count(component: any | string) {
    const name = typeof component === 'string' ? component : component.constructor.name

    if (!this.counters[name]) {
      this.counters[name] = 0;
    }

    this.counters[name] += 1;

    this.__log();
  }

  __log() {
    if (this.debounceId) {
      clearTimeout(this.debounceId);
    }

    this.debounceId = setTimeout(() => {
      this.__print();
    }, this.debounce)
  }

  __print() {
    const titleStyles = ['color: black; font-weight: bold;']

    const group = this.collapsed ? console.groupCollapsed : console.group;
    const counter = Object.values(this.counters).reduce(this.__sum);
    const info = `${counter} COMPONENT UPDATES`;

    group( `%c ${info}`, ...titleStyles);

    let sorted: any = {};

    Object.keys(this.counters)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }

        return 0;
      }).forEach (( name: string ) => {
        console.log (`${name} ${this.counters[name]}`);
        sorted[name] = this.counters[name];
      });

    console.groupEnd();

    this.counters = {};
  }

}

export default Counter;