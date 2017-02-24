import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/prod/assets` directory.
 */
export = () => {
  return gulp.src([
    join(Config.ASSETS_SRC, '**/*.css'),
    join(Config.ASSETS_SRC, '**/*.js')
  ])
    .pipe(gulp.dest(Config.APP_DEST + '/assets'));
};
