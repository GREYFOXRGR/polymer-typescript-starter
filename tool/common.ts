import * as gulp from 'gulp';
import * as gulpif from 'gulp-if';
import * as sourcemaps from 'gulp-sourcemaps';
import * as typescript from 'gulp-typescript';

export const DIR_TMP = '.tmp';
export const DIR_DST = 'dist';
export const DIR_SRC = 'src';

/**
 * The `project` is used inside the "ts" task to compile TypeScript code using
 * tsconfig.json file. The project MUST be created outside of the task to
 * enable incremental compilation.
 */
const project = typescript.createProject('tsconfig.json', {
  /**
   * We don't use any kind of modules or <reference> tags in our project, so we
   * don't need to support external modules resolving. According to the
   * gulp-typescript plugin docs explicitly disabling it can improve
   * compilation time.
   */
  noExternalResolve: true
});

/**
 * Compiles all TypeScript code in the project to JavaScript.
 *
 * @param enableSourcemaps Pass `true` to enable source maps generation
 */
export function typescriptTask(enableSourcemaps: boolean = false) {
  let files = [`${DIR_SRC}/**/*.ts`, 'typings/browser/**/*.d.ts'];
  return gulp.src(files, {base: DIR_SRC})
      .pipe(gulpif(enableSourcemaps, sourcemaps.init()))
      .pipe(typescript(project))
      .pipe(gulpif(enableSourcemaps, sourcemaps.write()))
      .pipe(gulp.dest(DIR_TMP));
}

export function copyHtmlTask() {
  return gulp.src(`${DIR_SRC}/**/*.html`, {base: DIR_SRC})
      .pipe(gulp.dest(DIR_TMP));
}
