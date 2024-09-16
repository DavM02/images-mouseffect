const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
 
async function getAutoprefixer() {
    return import('gulp-autoprefixer');
}

async function styles() {
    const autoprefixer = (await getAutoprefixer()).default;

    return gulp.src(['src/css/main.css'])
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
}

function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env'],
            // plugins: ['@babel/plugin-transform-modules-commonjs']
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

function html() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
}

// Watch task
function watch() {
    gulp.watch('src/css/**/*.css', styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch(['src/index.html'], html);
}

// Export tasks
exports.scripts = scripts;
exports.styles = styles;
exports.html = html;
exports.watch = watch;

exports.default = gulp.series(
    gulp.parallel(scripts, styles, html),
    watch
);
 