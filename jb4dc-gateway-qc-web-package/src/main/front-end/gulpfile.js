'use strict';

require("@babel/polyfill");
const babel = require('gulp-babel');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlclean = require('gulp-htmlclean');
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

//const replacecust = require("./gulp-plugin/gulp-replace-cust/index.js");
//const replaceBlockObj=require("./replaceBlock.js");

const replacecust = require("../../../../gulp-cust/gulp-plugin/gulp-replace-cust/index.js");
const replaceBlockObj=require("../../../../gulp-cust/replaceBlock.js");

const sourcePath = "static";
const distPath = "../resources/static/QCSystem";

/*编译Vue的扩展插件*/
/*gulp.task('js-vue-ex-component',()=>{
    return gulp.src([sourcePath + '/Js/VueComponent/!**!/!*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('SSOVueEXComponent.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});*/

gulp.task('copy-builder-client-package',()=>{
    return gulp.src("../../../../jb4dc-gateway-builder-client-web-package/src/main/resources/static/**", {base:"../../../../jb4dc-gateway-builder-client-web-package/src/main/resources/static"})
        .pipe(gulp.dest(distPath));
});

gulp.task('qc-system-dist-watch', function() {
    gulp.watch("../../../../jb4dc-gateway-builder-client-web-package/src/main/resources/static/**", gulp.series('copy-builder-client-package'));
    /*gulp.watch(sourcePath + "/Js/VueComponent/!**!/!*.js", gulp.series('js-vue-ex-component'));*/
});

//endregion

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    return gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('JBuild4DFormDesignLib'), replaceBlockObj.replaceJBuild4DFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('BootStrap4Lib'), replaceBlockObj.replaceBootStrap4Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FrameV1Lib'), replaceBlockObj.replaceFrameV1Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('GoJsLib'), replaceBlockObj.replaceGoJsLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('Webix'), replaceBlockObj.replaceWebixLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignRuntimeLib'), replaceBlockObj.replaceHTMLDesignRuntimeLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignWysiwygLib'), replaceBlockObj.replaceHTMLDesignWysiwygLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('LineAwesomeLib'), replaceBlockObj.replaceLineAwesomeLib))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false,
            removeComments:true
        }))
        /*.pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))*/
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(gulp.dest(toPath));
}