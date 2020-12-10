module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'site/src/<%= pkg.name %>.min.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: "*",
                    keepalive: true,
                    base: "site"
                }
            }
        },
        jshint: {
            all: ["Gruntfile.js", "src/**/*.js"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify-es");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask("default", ["uglify"]);
    grunt.registerTask("run", ["uglify", "connect"]);
};