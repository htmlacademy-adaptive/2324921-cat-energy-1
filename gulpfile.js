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
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import del from 'del';

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
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src ('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

// WebP

const createWebp = () => {
  return gulp.src ('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}

// SVG

const svg = () => {
gulp.src (['source/img/*.svg', '!source/img/social-icons/*.svg'])
 .pipe(svgo())
 .pipe(gulp.dest('build/img'));
}
const sprite = () => {
 return gulp.src ('source/img/social-icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true  // будет использоваться не в стилях, а в разметке (инлайново)
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src ([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico', 'source/*.webmanifest',
  ], {
    base:'source'
  })
  .pipe(gulp.dest('build'))
  done();
};

// Clean

export const clean = () => {
  return del.sinc('build');
};

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
