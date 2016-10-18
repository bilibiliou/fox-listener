import gulp from "gulp";
import load from "gulp-load-plugins";

const {
    uglify,
    plumber,
    babel,
    notify,
    rename,
    istanbul,
    mocha
} = load(gulp);

gulp.task(`uglify`, () => 
    gulp.src(`./src/*.js`)
        .pipe(plumber())
        .pipe(babel({
            presets: [`es2015`]
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: `.min`
        }))
        .pipe(notify(`代码编译成功！`))
        .pipe(gulp.dest(`./lib`))
)


