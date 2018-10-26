import UnstatedManager from './src/unstated-manager'
import UnstatedLogger from './src/unstated-logger';

const Manager = new UnstatedManager()
const Logger = new UnstatedLogger()

export {
  Manager,
  Logger
}