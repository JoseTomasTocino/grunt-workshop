module.exports = function(grunt) {

    // 1. Bloque de configuración
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),

        message: "/// Esta es una práctica de <%= pkg.author %> \n" +
                 "/// UCA - <%= grunt.template.today('yyyy') %> \n",

        concat:
        {
            files:
            {
                src: ["js/vendor/**/*", "js/source/*"],
                dest: "js/output/script.js"
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
                src: "js/output/script.js",
                dest: "js/output/script.min.js"
            }
        },

        watch:
        {
            files: ["index.html", "js/source/*", "css/**/*"],
            tasks: ['concat', 'uglify'],
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

    // 3. Bloque de tareas
    grunt.registerTask('default', ['concat', 'uglify']);

};