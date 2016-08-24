module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['src/third/jquery.js',
                    'src/core/underscore.js',
                    'src/core/foundation.js',
                    'src/data/data.js',
                    'src/third/codemirror/codemirror.js',
                    'src/third/**/*.js',
                    'src/core/**/*.js',
                    'src/data/**/*.js',

                    'src/base/status.js',
                    'src/base/base.js',
                    'src/base/ob.js',
                    'src/base/widget.js',
                    'src/base/model.js',
                    'src/base/view.js',
                    'src/base/shortcut.js',
                    'src/base/utils/*.js',
                    'src/base/behavior/behavior.js',
                    'src/base/wrapper/layout.js',
                    'src/base/module/pane.js',
                    'src/base/module/single/single.js',
                    'src/base/module/single/text.js',
                    'src/base/module/single/button/button.basic.js',
                    'src/base/module/single/button/button.node.js',

                    'src/base/**/*.js', 'src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            css: {
                src: ['src/css/**/*.css'],//当前grunt项目中路径下的src/css目录下的所有css文件
                dest: 'dist/<%= pkg.name %>.css'  //生成到grunt项目路径下的dist文件夹下为all.css
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat'],
                options: {
                    spanw: true,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'watch']);
};