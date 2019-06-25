import deleteEmpty from 'delete-empty';
import del from 'del';
import config from '../config';

export default function clean(callback) {
  del.sync(config.settings.clean.patterns, config.settings.clean.options);
  deleteEmpty.sync(config.settings.cleanDirectory.path);
  callback();
}