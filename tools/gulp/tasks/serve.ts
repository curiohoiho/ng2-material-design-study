import { task } from 'gulp';
import { serverTask } from '../task_helpers';

// gets the gulpServer running on port 4200
task('serve', serverTask());