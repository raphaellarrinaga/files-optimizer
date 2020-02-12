/**
 * @file
 */

(function () {
  'use strict';

  const gulp = require('gulp');
  const imagemin = require('gulp-imagemin');
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');
  const ext_replace = require('gulp-ext-replace');
  const plumber = require('gulp-plumber');
  const notify = require('gulp-notify');

  function images() {
    return gulp
      .src('src/images/*')
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 70, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]))
      .pipe(gulp.dest('dist/images'));
  }

  exports.images = images;

  function js() {
    return gulp
      .src('src/js/*')
      .pipe(plumber(reportError))
      .pipe(
        babel({
          presets: ['@babel/preset-env'],
          plugins: ['@babel/transform-runtime', '@babel/plugin-syntax-dynamic-import'],
        })
      )
      .pipe(uglify())
      .pipe(ext_replace('.min.js', '.es6.js'))
      .pipe(gulp.dest('dist/js'));
  }

  exports.js = js;

  const reportError = (error) => {
    notify.onError({
      title: 'Gulp error in ' + error.plugin,
      message: error.toString()
    })(error);
  };

  // const gulp = require('gulp'),
  //   sass = require('gulp-sass'),
  //   bourbon = require('bourbon'),
  //   postcss = require('gulp-postcss'),
  //   autoprefixer = require('autoprefixer'),
  //   combineMq = require('gulp-combine-mq'),
  //   browserSync = require('browser-sync').create(),
  //   sassGlob = require('gulp-sass-glob'),
  //   imagemin = require('gulp-imagemin'),
  //   newer = require('gulp-newer'),
  //   path = require('path'),
  //   sourcemaps = require('gulp-sourcemaps');

  // const config = require("./gulp.config");

  // const paths = {
  //   styles: {
  //     src: './src/sass/**/*.scss',
  //     dest: './dist/css'
  //   },
  //   templates: './templates/**/*.twig',
  //   js: {
  //     src: './src/js/**/*.js',
  //     dest: './dist/js'
  //   },
  //   styleguide: {
  //     components: './src/styleguide/components',
  //     src: './src/styleguide',
  //     dest: './dist/styleguide'
  //   },
  //   images: {
  //     src: 'src/images/**/*',
  //     dest: 'dist/images'
  //   },
  // };

  // const processors = [
  //   autoprefixer(),
  // ];

  // // Error notifications with notify.

  // const fractal = require('@frctl/fractal').create();
  // const mandelbrot = require('@frctl/mandelbrot');
  // const twigAdapter = require('@frctl/twig');

  // const myCustomisedTheme = mandelbrot({
  //   panels: ['notes', 'html', 'view', 'context', 'resources', 'info'],
  //   skin: 'black',
  //   static: {
  //     mount: 'theme'
  //   }
  // });

  // // Add an additional static assets path.
  // // @see https://fractal.build/guide/web/#static-assets
  // // @see https://github.com/frctl/fractal/issues/122
  // const imgDir = path.join(__dirname, paths.images.dest);
  // const staticImages = 'images';
  // myCustomisedTheme.addStatic(imgDir, staticImages);
  // const cssDir = path.join(__dirname, paths.styles.dest);
  // const staticCss = 'css';
  // myCustomisedTheme.addStatic(cssDir, staticCss);
  // const jsDir = path.join(__dirname, paths.js.dest);
  // const staticJs = 'js';
  // myCustomisedTheme.addStatic(jsDir, staticJs);

  // // Tell Fractal to use the configured theme by default.
  // fractal.web.theme(myCustomisedTheme);
  // // Title for the project.
  // fractal.set('project.title', 'Living Styleguide');
  // // Destination for the static export.
  // fractal.web.set('builder.dest', paths.styleguide.dest);
  // // Browsersync.
  // fractal.web.set('server.sync', true);
  // // Location of the component directory.
  // fractal.components.set('path', paths.styleguide.components);
  // // Let Fractal know that this preview layout should be used as the default layout for our components.
  // fractal.components.set('default.preview', '@preview');
  // // Set default components status to work in progress. This has to be overridden in component.config.js files.
  // fractal.components.set('default.status', 'wip');

  // // Use Twig intead of handlebars.js.
  // fractal.components.engine(twigAdapter);
  // fractal.components.set('ext', '.twig');

  // /*
  //  * Start the Fractal server.
  //  *
  //  * In this example we are passing the option 'sync: true' which means that it will
  //  * use BrowserSync to watch for changes to the filesystem and refresh the browser automatically.
  //  * Obviously this is completely optional!
  //  *
  //  * This task will also log any errors to the console.
  //  */

  // function fractalWatch() {
  //   const server = fractal.web.server({
  //     sync: true
  //   });
  //   server.on('error', err => logger.error(err.message));
  //   return server.start().then(() => {
  //     logger.success(`Fractal server is now running at ${server.url}`);
  //   });
  // }

  // /*
  //  * Run a static export of the project web UI.
  //  *
  //  * This task will report on progress using the 'progress' event emitted by the
  //  * builder instance, and log any errors to the terminal.
  //  *
  //  * The build destination will be the directory specified in the 'builder.dest'
  //  * configuration option set above.
  //  */

  // function fractalBuild() {
  //   const builder = fractal.web.builder();
  //   builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
  //   builder.on('error', err => logger.error(err.message));
  //   return builder.build().then(() => {
  //     logger.success('Fractal build completed!');
  //   });
  // }

  // // Keep a reference to the fractal CLI console utility.
  // const logger = fractal.cli.console;

  // function compileCSS() {
  //   return gulp
  //     .src(paths.styles.src)
  //     .pipe(plumber(reportError))
  //     .pipe(sourcemaps.init())
  //     .pipe(sassGlob())
  //     .pipe(
  //       sass({
  //         precision: 2,
  //         includePaths: [].concat(
  //           bourbon.includePaths,
  //           'node_modules/mappy-breakpoints'
  //         )
  //       })
  //     )
  //     .pipe(postcss(processors))
  //     .pipe(combineMq({
  //       beautify: false // False will inline css.
  //     }))
  //     .pipe(sourcemaps.write("./sourcemap"))
  //     .on('error', sass.logError)
  //     .pipe(gulp.dest(paths.styles.dest))
  //     .pipe(browserSync.stream());
  // }

  // exports.compileCSS = compileCSS;

  // function reload(done) {
  //   browserSync.reload();
  //   done();
  // }

  // function serve(done) {
  //   browserSync.init({
  //     server: false,
  //     ui: false,
  //     open: false,
  //     proxy: config.browserSync.hostname,
  //     port: config.browserSync.port,
  //     injectChanges: config.browserSync.injectChanges,
  //   });
  //   done();
  // }

  // // Optimize Images.
  // function images() {
  //   return gulp
  //     .src(paths.images.src)
  //     .pipe(newer(paths.images.dest))
  //     .pipe(
  //       imagemin([
  //         imagemin.gifsicle({ interlaced: true }),
  //         imagemin.jpegtran({ progressive: true }),
  //         imagemin.optipng({ optimizationLevel: 5 })
  //       ])
  //     )
  //     .pipe(gulp.dest(paths.images.dest));
  // }

  // exports.images = images;

  // function watchFiles() {
  //   gulp.watch(paths.images.src, images);
  //   gulp.watch(paths.styles.src, compileCSS);
  //   gulp.watch(paths.js.src, compileJS);
  //   gulp.watch(paths.templates, reload);
  // }

  // exports.watchFiles = watchFiles;

  // const watch = gulp.parallel(watchFiles, fractalWatch);
  // const dev = gulp.series(serve, watch);
  // exports.dev = dev;

  // const build = gulp.series(compileCSS, images, compileJS, fractalBuild);
  // exports.build = build;

}());
