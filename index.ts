import UnstatedManager from './src/unstated-manager'
import UnstatedLogger from './src/unstated-logger';
import connect from './src/unstated-connect';
import combine from './src/unstated-combine';

const Manager = new UnstatedManager()
const Logger = new UnstatedLogger()

export {
  Manager,
  Logger,
  connect,
  combine
}