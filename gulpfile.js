const gulp = require( 'gulp' ),
    browserify = require( 'browserify' ),
    babelify = require( 'babelify' ),
    source = require( 'vinyl-source-stream' ),
    buffer = require( 'vinyl-buffer' ),
    uglify = require( 'gulp-uglify' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    autoprefix = require( 'gulp-autoprefixer' ),
    imagemin = require( 'gulp-imagemin' ),
    livereload = require( 'gulp-livereload' ),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha'),
    envify = require('envify'),
    documentation = require('gulp-documentation'),
    babel = require('babel-core/register'),
    istanbul = require('gulp-istanbul');


const TEST_FILES = './tests/*.test.js'

gulp.task( 'dev', () => {
    return browserify( {
            entries: './src/topoquery.js',
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
    gulp.watch( './src/js/*.js', [ 'dev', 'test', 'lint' ] )
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
            'js:babel-core/register',
        ]
      })
      .pipe( mocha( { reporter:'nyan' } ) )
      // .pipe(istanbul.writeReports())
} )

gulp.task( 'lint', () => {
    return gulp.src( [ './src/js/*.js' ] )
        .pipe( eslint() )
        .pipe( eslint.format() )
} )

gulp.task( 'build', [ 'test', 'lint' ], () => {
    return browserify( {
            entries: './src/topoquery.js',
            debug: true
        } )
        .transform( 'babelify', {
            presets: [ 'es2015' ]
        } )
        .transform(envify)
        .bundle()
        .pipe( source( 'topooquery.min.js' ) )
        .pipe( buffer() )
        .pipe( sourcemaps.init() )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './maps' ) )
        .pipe( gulp.dest( './dist/js' ) )
} )

gulp.task('docs', () => {
    gulp.src( [ './src/**/*.js' ] )
        .pipe( documentation( { shallow: true, format: 'html' } ) )
        .pipe( gulp.dest( 'docs' ) )
} )
