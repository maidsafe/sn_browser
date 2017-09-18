var gulp = require('gulp'),
  concat = require('gulp-concat'),
  nodemon = require('gulp-nodemon'),
  watch = require('gulp-watch'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  babelify = require('babelify');

gulp.task('js-deps', function () {
  gulp.src([
      './node_modules/mocha/mocha.js'
    ])
    .pipe(gulp.dest('./build/js'));
});

gulp.task('html', function () {
  gulp.src(
    './index.html'
    )
    .pipe(gulp.dest('./build'));
});

gulp.task('css-deps', function () {
  gulp.src([
      './node_modules/mocha/mocha.css',
    ])
    .pipe(concat('deps.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('js', function () {
  var sourceDirectory = __dirname + '/test_modules',
    destinationDirectory = __dirname + '/build/js',
    outputFile = 'test-modules.js';

    var bundler = browserify([
      sourceDirectory + '/app.js',
      sourceDirectory + '/immutable_data.js',
      sourceDirectory + '/mutable_data.js',
      sourceDirectory + '/cipher_opt.js',
      sourceDirectory + '/crypto.js',
      sourceDirectory + '/crypto_keypair.js',
      sourceDirectory + '/crypto_pub_enc_key.js',
      sourceDirectory + '/crypto_sec_enc_key.js',
      sourceDirectory + '/crypto_sign_key.js',
      sourceDirectory + '/mutable_data_entries.js',
      sourceDirectory + '/mutable_data_keys.js',
      sourceDirectory + '/mutable_data_mutation.js',
      sourceDirectory + '/mutable_data_permissions.js',
      sourceDirectory + '/mutable_data_permissions_set.js',
      sourceDirectory + '/mutable_data_values.js',
      sourceDirectory + '/nfs.js',
      sourceDirectory + '/nfs_file.js'
    ]).transform(babelify);

    return bundler.bundle()
      .on('error', function(err) {
        console.log(err);
      })
      .pipe(source('test-modules.js'))
      .pipe(gulp.dest(destinationDirectory))

});

gulp.task('serve', function () {
  nodemon({
    script: './index.js',
    ext: 'html js',
    ignore: ['build/**/*.*'],
    tasks: []
  }).on('restart', function () {
    console.log('server restarted....');
  });
});

gulp.task('watch', function () {
  watch(['./test_modules/*.js'], function () {
    gulp.start('js');
  });

  watch('./index.html', function () {
    gulp.start('html');
  });
});

gulp.task('default', ['js-deps', 'html', 'css-deps', 'js', 'watch', 'serve']);
