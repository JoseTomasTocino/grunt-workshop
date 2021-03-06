module.exports = function(grunt) {

    // 1. Bloque de configuración
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),

        message: "/// Esta es una práctica de <%= pkg.author %> \n" +
                 "/// UCA - <%= grunt.template.today('yyyy') %> \n",

        concat:
        {
            js:
            {
                src: ["assets-src/js/vendor/**/*", "assets-src/js/source/*"],
                dest: "assets/js/script.js"
            },

            css:
            {
                src: ["assets-src/css/**/*"],
                dest: "assets/css/style.css"
            }
        },

        uglify:
        {
            options:
            {
                banner: "<%= message %>"
            },

            files:
            {
                src: "assets/js/script.js",
                dest: "assets/js/script.min.js"
            }
        },

        watch:
        {
            html: {
                files: ["index.html"]
            },

            js: {
                files: ["assets-src/js/**/*"],
                tasks: ["concat:js", "uglify"]
            },

            css: {
                files: ["assets-src/css/**/*"],
                tasks: ["concat:css"]
            },

            options: {
                spawn: false,
                livereload: true,
            }
        }

    });

    // 2. Bloque de carga de plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 3. Bloque de tareas
    grunt.registerTask('default', ['concat', 'uglify']);

};
