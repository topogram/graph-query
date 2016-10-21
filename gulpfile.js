const gulp = require( 'gulp' ),
    browserify = require( 'browserify' ),
    source = require( 'vinyl-source-stream' ),
    buffer = require( 'vinyl-buffer' ),
    uglify = require( 'gulp-uglify' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    livereload = require( 'gulp-livereload' ),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha'),
    gutil = require('gulp-util'),
    envify = require('envify'),
    documentation = require('gulp-documentation'),
    babel = require('babel-core/register')
    // istanbul = require('gulp-istanbul');


const TEST_FILES = './tests/*.test.js'
const JS_FILES = './src/js/**/*.js'
const SRC_FILE = './src/js/TopoQuery.js'


gulp.task( 'dev', () => {
    return browserify( {
            entries: SRC_FILE,
            debug: true
        } )
        .on('error', function( err ){
            console.log( err );
        } )
        .transform( 'babelify', {
            presets: [ 'es2015' ]
        } )
        .transform(envify)
        .bundle()
        .pipe( source( 'topoquery.js' ) )
        .pipe( buffer() )
        .pipe( gulp.dest( './dist/js' ) )
        .pipe( livereload() )
} )

gulp.task( 'watch', [ 'lint', 'dev'], () => {
    livereload.listen()
    gulp.watch( [TEST_FILES, JS_FILES], [ 'dev', 'test', 'lint' ] )

} )


// gulp.task('pre:coverage', function () {
//   return gulp.src(['src/**/*.js'])
//     .pipe(istanbul({
//           instrumenter: isparta.Instrumenter,
//         }))
//     .pipe(istanbul.hookRequire());
// });

gulp.task( 'test', /*['pre:coverage'],*/ () => {
    gulp.src( TEST_FILES,
      {
          read: false,
          compilers: [
            'js:babel-core/register'
        ]
      })
      .pipe( mocha( { reporter:'nyan' } ) )
      .on('error',  gutil.log)
      // .pipe(istanbul.writeReports())
} )

gulp.task( 'lint', () => {
    return gulp.src( [ './src/js/*.js' ] )
        .pipe( eslint() )
        .pipe( eslint.format() )
} )

gulp.task( 'build', [ 'test', 'lint' ], () => {
    return browserify( {
            entries: SRC_FILE,
            debug: true
        } )
        .transform( 'babelify', {
            presets: [ 'es2015' ]
        } )
        .transform(envify)
        .bundle()
        .pipe( source( 'topoquery.min.js' ) )
        .pipe( buffer() )
        .pipe( sourcemaps.init() )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './maps' ) )
        .pipe( gulp.dest( './dist/js' ) )
} )

gulp.task('doc', () => {
    gulp.src( [ './src/**/*.js' ] )
        .pipe( documentation( { shallow: true, format: 'html' } ) )
        .pipe( gulp.dest( 'docs' ) )
} )
