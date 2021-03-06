# Introducción

Grunt es un **lanzador de tareas** automáticas que nos facilitará las cosas a la hora de hacer labores repetitivas durante el desarrollo web front-end, como reducir código, generar css, combinar ficheros e incluso actualizar el navegador. 

Grunt cuenta con una estructura **basada en plugins** muy especializados, con la idea de que combinando esos plugins se lleven a cabo tareas más complejas. Existen cerca de 4000 plugins para Grunt y la lista va aumentando diariamente. Puedes encontrar la [lista de plugins aquí](http://gruntjs.com/plugins).

En este taller vamos a presentar Grunt, veremos cómo se instala, cómo se configura y cómo se usa.

# Requisitos previos de instalación

Grunt está implementado en JavaScript, utilizando [Node.js](http://nodejs.org/) como entorno para ejecutarse. Por tanto, es imprescindible que esté instalado. La forma más sencilla de instalar Node en un sistema como Ubuntu es con los siguientes comandos:

    curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
    sudo apt-get install nodejs


Con esto ya tendremos disponibles tanto `node` como [npm](https://www.npmjs.com/), el gestor de paquetes de Node.

# Proyecto de ejemplo

Para ir aprendiendo a usar Grunt, vamos a aplicarlo a un proyecto de ejemplo que descargaremos del repositorio del taller. Usaremos:

    git clone git@github.com:JoseTomasTocino/grunt-workshop.git

El proyecto de ejemplo está en la carpeta `empty` y tiene la siguiente estructura:

- Un fichero web `index.html` con contenido de prueba.
- Una carpeta `assets-src`, donde se encuentra el código fuente de los ficheros JavaScript y CSS originales.
- Una carpeta `assets`, donde se se ubicarán los ficheros generados a partir de los originales.

## Paso 1: creación de package.json

Al comenzar cualquier proyecto lo primero que debemos hacer es crear un fichero llamado `package.json` ([más información sobre el fichero package.json](http://browsenpm.org/package.json)). Este fichero contiene información sobre vuestro proyecto, como el nombre, la versión, información sobre el desarrollador y la lista de dependencias, que se descargarán del repositorio de `npm`.

Para empezar a crearlo, nos vamos a la carpeta `empty` y escribimos:

    npm init

Rellena los campos que te pide, puedes dejar la mayoría en blanco porque por ahora no son relevantes ni obligatorios. Al terminar, se generará el fichero. Puedes obtener más información sobre el fichero en:

    npm help json

## Paso 2: instalando Grunt

**Grunt** se instala en dos partes. En primer lugar, es necesario instalar el cliente de Grunt, utilizando

    sudo npm install -g grunt-cli

Esto nos habilitará un comando global `grunt` con el que trabajar. Seguidamente, necesitamos instalar Grunt de forma local en nuestro proyecto, escribiendo lo siguiente:

    npm install grunt --save-dev

Esto, además, actualizará el fichero `package.json` añadiendo Grunt como dependencia de desarrollo.

## Paso 3: creación del fichero Gruntfile.js

Las operaciones que Grunt ejecuta se deben definir en un fichero llamado `Gruntfile.js`, que tiene una estructura bien definida:

```javascript
module.exports = function(grunt) 
{    
    // 1. Bloque de configuración
    grunt.initConfig(
    {
        concat: 
        {
            // Configuración particular de cada plugin
        }    
    });

    // 2. Bloque de carga de plugins
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 3. Bloque de tareas
    grunt.registerTask('default', ['concat']);

};
```

Su estructura es muy sencilla. El primer paso siempre será decidir **qué plugins** vamos a usar, **instalarlos** y cargarlos mediante las llamadas a `grunt.loadNpmTasks`. 

```javascript
grunt.loadNpmTasks('grunt-contrib-concat');
```

El segundo paso será definir las **opciones de configuración** de cada plugin dentro del bloque `grunt.initConfig`. Por regla general, indicaremos unos ficheros de entrada y una salida, y opcionalmente algunos parámetros dependientes de cada plugin.

```javascript
grunt.initConfig(
{
    concat:
    {
        // Aquí va la configuración del plugin 
    }
});
```

El último paso será declarar las **tareas** que queremos ejecutar con Grunt. Las tareas listan los pasos a ejecutar para obtener cierto resultado, utilizando `grunt.registerTask`, por ejemplo:

```javascript
grunt.registerTask('nombre_tarea', ['concat', 'uglify']);
```

Cuando está todo configurado, indicamos la tarea a ejecutar usando

```bash
grunt nombre_tarea
```

Hay un caso especial, el de la tarea por defecto, denominada *default*, que se ejecuta cuando lanzamos `grunt` sin argumentos.

## Paso 4: operaciones básicas

Si nos vamos a la carpeta `assets-src/js` veréis que tenemos dos ficheros JavaScript: `function.js` y `main.js`. El primero de ellos define varias funciones de utilidad, mientras que el segundo las utiliza. Además, en la carpeta `assets-src/js/vendor` está la popular biblioteca **jQuery**. 

Sería interesante poder usar esos tres ficheros sin tener que cargarlos uno a uno en el HTML. Por ello, lo mejor es **concatenarlos** en un solo archivo `script.js` en la carpeta `assets/js`, tarea que podemos hacer utilizando el plugin **concat** de Grunt. Para instalarlo, escribimos:

    npm install grunt-contrib-concat --save-dev

Seguidamente, editamos el fichero `Gruntfile.js` para que quede con el siguiente aspecto:

```javascript
module.exports = function(grunt) 
{
    // 1. Bloque de configuración
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),

        concat:
        {
            files:
            {
                src:  "assets-src/js/**/*",
                dest: "assets/js/script.js"
            }
        }   
    });

    // 2. Bloque de carga de plugins
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 3. Bloque de tareas
    grunt.registerTask('default', ['concat']);
};
```

Como veis, hemos añadido en la configuración del plugin `concat` un bloque con información sobre los ficheros de origen (`src`) y el fichero de destino (`dest`) en el que se combinan todos los scripts. Además, hemos añadido la carga del plugin, y hemos editado la tarea `default` para que incluya la ejecución de `concat`. Si nos vamos a la terminal y escribimos

    grunt

Obtendremos el siguiente resultado:

```bash
$ grunt
Running "concat:files" (concat) task
File assets/js/script.js created.

Done, without errors.
```

Se habrá generado el fichero `assets/js/script.js`. 

## Paso 5: operaciones encadenadas

Si os fijáis en el fichero generado, veréis que es bastante extenso. Puede resultar interesante reducir el tamaño del fichero, borrando saltos de línea innecesarios y minimizando el código. Para ello, podemos usar el plugin `uglify`. Para usarlo, seguimos los mismos pasos que antes, primero lo instalamos con npm:

```bash
npm install grunt-contrib-uglify --save-dev
```

Segundo, lo añadimos a la lista de carga en nuestro fichero `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-contrib-uglify');
```

Añadimos su bloque de configuración. En este caso, **uglify** tomará como entrada el resultado de la tarea anterior (`concat`) y generará un nuevo fichero reducido. Así, el bloque de configuración para este plugin será:

```javascript
uglify:
{
    files:
    {
        src:  "assets/js/script.js",
        dest: "assets/js/script.min.js"
    }
}
```

Por último, añadimos este paso adicional a la tarea por defecto:

```javascript
grunt.registerTask('default', ['concat', 'uglify']);
```

¡Listo!

### Paso 5.1: opciones para los plugins

Cada uno de los plugins de Grunt cuenta con opciones para modificar su comportamiento de varias maneras. Por ejemplo, supongamos que queremos que `uglify` no borre los comentarios del código. Existe una opción, **preserveComments** que nos permitirá hacer eso mismo. Las opciones de los plugins se ubican en un bloque `options` dentro del bloque de configuración de cada plugin. Por ejemplo:

```javascript
uglify:
{
    options:
    {
        preserveComments: "all"
    },

    files:
    {
        src:  "assets/js/script.js",
        dest: "assets/js/script.min.js"
    }
}
```

Es posible ver todas las opciones de cada plugin en la página oficial de npm (npmjs.org).

## Paso 6: vigilancia de ficheros con `watch`

Hasta ahora, hemos visto operaciones que lanzamos manualmente desde la terminal, pero puede resultar interesante que se ejecuten de forma automática, por ejemplo, cuando se modifica un fichero. Para ello tenemos el plugin `watch`, que hace exactamente eso. Primero, lo instalamos con:

```bash
npm install grunt-contrib-watch --save-dev
```

Lo cargamos:

```javascript
grunt.loadNpmTasks('grunt-contrib-watch');
```

Y ahora a configurar. Este plugin necesita saber qué ficheros _debe vigilar_, qué __tarea debe ejecutar__ cuando se produzcan modificaciones y las opciones que queramos. En nuestro caso vamos a decirle que vigile el html, nuestra carpeta de ficheros JavaScript y CSS, y que ejecute todas las tareas que tenemos. La opción `spawn: false` mejora el rendimiento del plugin pero es opcional:

```javascript
watch:
{
    files: ["index.html", "assets-src/**/*"],
    tasks: ['concat', 'uglify'],
    options: {
        spawn: false,
    }
}
```

Si nos vamos a la terminal y ponemos `grunt watch`, veremos que Grunt se queda esperando (_"Waiting..."_). Si vamos al editor y modificamos algunos de los ficheros vigilados, se ejecutarán automáticamente las tareas:

    Waiting...
    >> File "assets-src/js/functions.js" changed.
    
    Running "concat:files" (concat) task
    File assets/js/script.js created.
    
    Running "uglify:files" (uglify) task
    >> 1 file created.
    
    Running "watch" task
    Completed in 0.830s at Tue Dec 02 2014 09:49:43 GMT+0100 (CET)

Lo que hemos comentado hasta ahora está muy bien, pero... ¿y si pudiésemos ir más allá? Por ejemplo, actualizar automáticamente el navegador según hagamos cambios. ¡Pues es posible! Solo tenemos que añadir una opción más al bloque de configuración de watch:

```javascript
options: {
    spawn: false,
    livereload: true,
},
```

Ahora, en nuestro navegador, instalamos la extensión LiveReload (http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-). Lanzamos grunt (con `grunt watch`) y pulsamos en el navegador el botón que aparecerá en la barra. Ahora, al actualizar cualquier fichero se actualizará el navegador automáticamente.

### Paso 6.1: servidor local

Por **limitaciones de seguridad**, no es posible utilizar LiveReload con ficheros locales (los que tienen una URL que empieza por `file://`). Si no estáis usando Apache ni Nginx, es posible probar esto usando un pequeño servidor de Python. Simplemente en la carpeta en la que estéis, escribid:

```bash
python -m SimpleHTTPServer
```

Y podréis acceder a la web desde la url `http://0.0.0.0:8000`

## Paso 7: reutilizando variables

Para evitar repetir bloques similares, es posible utilizar variables e información dentro de Grunt. Por ejemplo, ¿recordáis el fichero `package.json` que se creó al principio? Es posible usar las cadenas de texto de ese fichero. Para ello, simplemente añadimos la siguiente línea al bloque de configuración:

```javascript
grunt.initConfig(
{
    pkg: grunt.file.readJSON('package.json'),

    // resto del fichero
```

Ahora, podemos utilizar cualquiera de las variables definidas en `package.json` mediante una sintaxis muy sencilla. Por ejemplo, para acceder al nombre del proyecto:

    <%= pkg.name %>

Así, si queremos que los ficheros JavaScript generados tengan el nombre del proyecto, podemos usar:

```javascript
files:
{
    src: "assets/js/script.js",
    dest: "assets/js/<%= pkg.name %>.script.min.js"
}
```

Y ahora el fichero generado se llamará `taller_grunt.script.min.js`. También podemos definir nosotros mismos nuestras propias variables dentro de `initConfig` y usarlas según nos convenga. Por ejemplo, podemos definir un mensaje personalizado:

```javascript
grunt.initConfig(
{
    pkg: grunt.file.readJSON('package.json'),

    message: "/// Esta es una práctica de <%= pkg.author %> \n" +
             "/// UCA - <%= grunt.template.today('yyyy') %> \n",
```
 

Una vez definida podemos, por ejemplo, hacer que aparezca este mensaje en la cabecera del fichero, mediante la opción `banner` del plugin `uglify`:

```javascript
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
```

## Paso 8: objetivos (_targets_)

Por cada plugin es posible configurar diferentes **bloques de configuración** según nuestras necesidades, conocidos como **objetivos** o **targets**. Por ejemplo, supongamos que estamos editando código CSS y código JavaScript, y queremos lo siguiente:

* Cada vez que editemos el JavaScript, que se concatene y minifique (con `uglify`) y se actualice el navegador.
* Cada vez que editemos el CSS, que se concatene y se actualice el navegador.
* Cada vez que editemos el HTML, simplemente actualizar el navegador.

En los dos primeros casos utilizaremos el plugin `concat`, pero hasta ahora solo lo hemos configurado para concatenar ficheros JavaScript. Para que haga lo propio con ficheros CSS, haremos uso de los targets. Crearemos uno para los ficheros CSS y otro para los ficheros JS. El bloque de configuración del plugin `concat` quedará así:

```javascript
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
```

Ahora, si queremos concatenar los ficheros JavaScript desde la línea de comandos, podremos lanzar la acción con

```bash
grunt concat:js
```

Y para hacer lo propio con los ficheros CSS:

```bash
grunt concat:css
```

O ejecutar todos los _targets_ de una tarea:

```bash
grunt concat
```

Ahora bien, como decíamos, necesitamos integrar el plugin `watch` con esta nueva configuración. De nuevo, haremos uso de los _targets_, quedando la configuración de `watch` así:

```javascript
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
```

Así, podremos al lanzar `grunt watch` desde la terminal, automáticamente se ejecutarán las operaciones indicadas según el fichero que se modifique, actualizándose también el navegador.

# Otros plugins de Grunt

## Preprocesado de CSS con Sass y Compass

[Sass ](http://sass-lang.com) es un preprocesador de CSS muy potente, que nos permite escribir hojas de estilos de manera sencilla que luego se convierten en código CSS multiplataforma. A su vez, [Compass](http://compass-style.org/) es un framework de desarrollo CSS que utiliza Sass y que ofrece una gran cantidad de utilidades para facilitarnos el desarrollo de CSS en forma de _mixins_ y funciones de todo tipo.

El plugin `grunt-contrib-compass` facilita el procesado de ficheros escritos con Sass/Compass directamente desde Grunt.

## Minificación de CSS

Con `cssmin` (se instala con `npm install grunt-contrib-cssmin --save-dev`) podemos minificar nuestro CSS para que ocupe el mínimo tamaño posible.

## Validación de ficheros JavaScript

Con `jshint` (se instala con `npm install grunt-contrib-jshint --save-dev`) podemos verificar nuestros ficheros JavaScript para comprobar que siguen buenas prácticas de programación y otras verificaciones.



