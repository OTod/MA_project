module.exports = function (grunt) {

    //Configuration
    grunt.initConfig({
        //pass in options and plug-ins, and references to files, etc
       /* concat: {
            js: {
                src: ['jquery-1.12.4.s', '...', '...'],// paths to any JS scripts we want to concatenate, or 'js/*.js'
                dest: 'build/script.js'//path to the directory, where we want our result
            },
            css: {
                src: ['styles', '...', '...'],// paths to any JS scripts we want to concatenate, or 'js/*.js'
                dest: 'build/styles.css'//path to the directory, where we want our result
            }
        },*/
        less:{
            development:{
                files:{
                    './assets/css/admin_menu_style.css':'./less/admin_menu_style.less',
                    './assets/css/Admin_page_style.css':'./less/Admin_page_style.less',
                    './assets/css/food_menu_style.css':'./less/food_menu_style.less',
                    './assets/css/style.css':'./less/style.less'
                }
            }
        },
        watch: {
            styles: {
                files: [
                    'less/*.less',
                    'less/**/*.less' // which files to watch
                ],
                tasks: ['less:development'],
                options: {
                    nospawn: true
                }
            }
        },
/*
        uglify: {
            build: {
                files: [{
                    src: 'build/scripts.js',
                    dest: 'build/scripts.js'
                }]
            }
        }*/
    });

    //Load plug-ins to the file
    //grunt.loadNpmTasks('grunt-contrib-concat');// if we have several files of scripts or styles, concat can join them in one
    //grunt.loadNpmTasks('grunt-contrib-uglify')

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //Register tasks
    //grunt.register('concat-js', ['concat:js']);//will run the particular task - concat js, but not the css

    grunt.registerTask('default',["less","watch"]);

}