var
  path = require('path'),
  exec = require('child_process').exec,
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  del = require('del');


gulp.task('cleanDeploymentFolder', function () {
  return del('./deploy/');
});

gulp.task('cleanClientDist', function () {
  return del(['!./client/dist/index.html', './client/dist/**/*']);
});


gulp.task('packForDeployment', ['cleanDeploymentFolder', 'cleanClientDist'], function (done) {

  // first copy server into deploy folder
  gulp.src(['./server/src/**/*'])
    .pipe(gulp.dest('deploy/src'));

  gulp.src(['./server/package.json'])
    .pipe(gulp.dest('deploy/'));

  // start client packaging
  gutil.log('Packing client...');
  exec('npm run build', {cwd: path.resolve(__dirname, './client')}, function (err) {
    if (err) {
      done(err);
    }
    gutil.log('Client packed');

    gulp.src(['./client/dist/**/*'])
      .pipe(gulp.dest('deploy/public/assets/'));

    gulp.src(['./client/index.html'])
      .pipe(gulp.dest('deploy/public/'));

  });

});
