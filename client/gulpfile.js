var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss'],
  bower: './bower_components/',
  dstlib: './www/lib/'
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});


gulp.task('ionic',function(){
  gulp.src([paths.bower+'ionic/**/*',
    '!'+paths.bower+'**/*.min.*',
    '!'+paths.bower+'**/*bundle.*',
    '!'+paths.bower+'**/*.json',
    '!'+paths.bower+'js/',
    '!'+paths.bower+'**/*.md'])
    .pipe(gulp.dest(paths.dstlib+'ionic'));
});

/*
gulp.task('angular', function(){
  gulp.src(paths.bower+'angular/angular.js')
    .pipe(gulp.dest(paths.dstlib+'angular/'));
  gulp.src(paths.bower+'angular-animate/angular-animate.js')
    .pipe(gulp.dest(paths.dstlib+'angular/'));
  gulp.src(paths.bower+'angular-sanitize/angular-sanitize.js')
    .pipe(gulp.dest(paths.dstlib+'angular/'));
  gulp.src(paths.bower+'angular-ui-router/release/angular-ui-router.js')
    .pipe(gulp.dest(paths.dstlib+'angular/'));
  gulp.src(paths.bower+'angular-resource/angular-resource.js')
    .pipe(gulp.dest(paths.dstlib+'angular/'));
});
*/

gulp.task('ionic-material', function(){
  return gulp.src([paths.bower+'ionic-material/dist/*'])
    .pipe(gulp.dest(paths.dstlib+'ionic-material'));
});

gulp.task('robotodraft',function() {
  return gulp.src([paths.bower+'robotodraft/**/*',
    '!'+paths.bower+'**/*.html',
    '!'+paths.bower+'**/*.json',
    '!'+paths.bower+'**/*.md'])
    .pipe(gulp.dest(paths.dstlib+'robotodraft'));
});

gulp.task('moment',function(){
  gulp.src([paths.bower+'moment/min/*.min.js',
    '!'+paths.bower+'**/*.html',
    '!'+paths.bower+'**/*.json',
    '!'+paths.bower+'**/*.md'])
    .pipe(gulp.dest(paths.dstlib+'moment'));
  gulp.src(paths.bower+'angular-moment/angular-moment.min.js')
    .pipe(gulp.dest(paths.dstlib+'moment'));
});

gulp.task('build', function(){
  // build lib
  return gulp.src([paths.bower+'ionic/js/ionic.js',
    paths.bower+'angular/angular.js',
    paths.bower+'angular-animate/angular-animate.js',
    paths.bower+'angular-sanitize/angular-sanitize.js',
    paths.bower+'angular-ui-router/release/angular-ui-router.js',
    paths.bower+'angular-resource/angular-resource.js',
    paths.bower+'ionic/js/ionic-angular.js'])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(paths.dstlib))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(paths.dstlib));
});

gulp.task('lib',['ionic','ionic-material','robotodraft','moment'], function(done){
  
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
