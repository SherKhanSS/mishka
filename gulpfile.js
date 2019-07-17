"use strict";

var gulp = require("gulp"),
    gp = require('gulp-load-plugins')(),
    autoprefixer = require("autoprefixer"),
    include = require("posthtml-include"),
    del = require("del"),
    server = require("browser-sync").create(),
//The base paths are separate so that you can use them for other paths
    basePatch = {
        src: "source",
        build: "build",
        less: "source/less",
        lessBlocks: "source/less/blocks",
        img: "source/img",
        css: "source/css",
        fonts: "source/fonts",
        js: "source/js"
    },
    path = {
        //Patch to source
        src: {
            htmlWatch: basePatch.src + "/*.html",
            lessAll: basePatch.less + "/style.less",
            //To watch, we quickly write each folder separately
            lessWatch:
                [basePatch.less + "/*.less",
                    basePatch.lessBlocks + "/*.less"],
            //To watch, we quickly write each folder separately
            cssAll: basePatch.css + "/style.css"
        },
        //Patch to build
        build: {
            root: basePatch.build + "/",
            htmlWatch: basePatch.src + "/*.html",
            css: basePatch.build + "/css",
            img: basePatch.build + "/img",
            fonts: basePatch.build + "/fonts",
            js: basePatch.build + "/js"
        }
    };

gulp.task("style", function () {
    return gulp.src(path.src.lessAll)
        .pipe(gp.plumber())
        .pipe(gp.less())
        .pipe(gp.postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest(path.build.css))
        .pipe(gp.csso())
        .pipe(gp.rename("style.min.css"))
        .pipe(gulp.dest(path.build.css))
        .pipe(server.stream());
});

gulp.task("img", function () {
    return gulp.src([basePatch.img + "/**/*.{jpg,png,svg}", "!" + basePatch.img + "/icon-*.svg"])
        .pipe(gp.imagemin([
            gp.imagemin.optipng({optimizationLevel: 3}),
            gp.imagemin.jpegtran({progressive: true}),
            gp.imagemin.svgo({
                plugins: [
                    {removeUselessStrokeAndFill: true}
                ]
            })
        ]))
        .pipe(gulp.dest(path.build.img));
});

gulp.task("webp", function () {
    return gulp.src(path.build.img + "/**/*.{jpg,png}")
        .pipe(gp.webp({quality: 80}))
        .pipe(gulp.dest(path.build.img));
});

gulp.task("sprite", function () {
    return gulp.src(basePatch.img + "/icon-*.svg")
        .pipe(gp.cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(gp.svgstore({
            inlineSvg: true,
        }))
        .pipe(gp.rename("sprite.svg"))
        .pipe(gulp.dest(path.build.img));
});

gulp.task("html", function () {
    return gulp.src(basePatch.src + "/*.html")
        .pipe(gp.posthtml([
            include()
        ]))
        .pipe(gp.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.root));
});

gulp.task('js', function () {
    // returns a Node.js stream, but no handling of error messages
    return gulp.src([basePatch.js + "/*.js", "!" + basePatch.js + "/*.min.js"])
        .pipe(gp.uglify())
        .pipe(gulp.dest(path.build.js));
});

gulp.task("copy-fonts-to-build", function () {
    return gulp.src(basePatch.fonts + "/*.{woff,woff2}")
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task("copy-js-lib-to-build", function () {
    return gulp.src(basePatch.js + "/*.min.js")
        .pipe(gulp.dest(path.build.js));
});

gulp.task("clean", function () {
    return del(basePatch.build);
});

gulp.task("serve", function () {
    server.init({
        server: path.build.root,
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch(path.src.lessWatch, gulp.series("style"));
    gulp.watch(path.src.htmlWatch, gulp.series("html"));
    gulp.watch(basePatch.img + "/sprite.svg", gulp.series("html"));
    gulp.watch(path.build.htmlWatch).on("change", server.reload);
    gulp.watch(path.build.img).on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "sprite", "style", "js", "img", "webp", "copy-fonts-to-build", "copy-js-lib-to-build", "html"));
