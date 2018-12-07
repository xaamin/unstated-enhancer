import UnstatedManager from './src/unstated-manager'
import UnstatedLogger from './src/unstated-logger';
import UnstatedPersist from './src/unstated-persist';
import connect from './src/unstated-connect';
import combine from './src/unstated-combine';

const Manager = new UnstatedManager()
const Logger = new UnstatedLogger()
const Persist = new UnstatedPersist();

export {
  Manager,
  Logger,
  Persist,
  connect,
  combine
}