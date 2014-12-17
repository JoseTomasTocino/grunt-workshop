La primera tarea ya la tenemos definida, pero la segunda es nueva, por lo que tendremos que instalar un nuevo plugin, usando:

    npm install grunt-contrib-cssmin --save-dev

Y lo añadiremos a la lista de carga de nuestro `Gruntfile.js`:

    grunt.loadNpmTasks('grunt-contrib-cssmin');

El bloque de configuración de este plugin será: