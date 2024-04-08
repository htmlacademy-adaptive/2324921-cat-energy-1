import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';  // добавлен для минификации css (style.min.css)
import rename from 'gulp-rename';  // добавлен для ренейма файла style.css на style.min.css
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import gulpSquoosh from 'gulp-squoosh';

// Styles

const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([  //style.css
      autoprefixer(),  //style.css -> style.css[prefix]
      csso()  //style.css[prefix] -> style.css[prefix, min]
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src ('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build/html'));
}

// Scripts

const script = () => {
  return gulp.src ('source/*.js')
.pipe(terser())
.pipe(gulp.dest('build/js'));
}

// Images

const optimazeImages = () => {
  return gulp.src ('source/img/**/*.{jpg,png}')
  .pipe(gulpSquoosh())
  .pipe(gulp.dest('build/img'));
}

 const copyImages = () => {
  return gulp.src ('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

// WebP
export const createWebp = () => {
  return gulp.src ('source/img/**/*.{jpg,png}')
  .pipe(gulpSquoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}

// function images() {
//   return src('src/images/**/*.png')
//     .pipe(
//       squoosh({
//         oxipng: {},
//         webp: {},
//         avif: {},
//       })
//     )
//     .pipe(dest('dist/images'));
// }

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  html, styles, script, server, watcher
);
