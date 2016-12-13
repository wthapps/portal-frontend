'use strict';

// Configurable paths
var basePath = '../client/assets',
    distPath = basePath + '/dist',
    thirdPartyPath = basePath + '/third_party',
    appComponentPath = '../client/app',
    bowerPath = 'bower_components';

// Configurable vendor scripts
var thirdPartyFile = [
    //thirdPartyPath + '/jquery.placeholder.js',
    thirdPartyPath + '/Swiper/dist/js/swiper.jquery.js',
    thirdPartyPath + '/swiper.thumbnails.js',
    bowerPath + '/dropzone/dist/min/dropzone.min.js',
    bowerPath + '/cropper/dist/cropper.min.js',

    //zone
    bowerPath + '/wheelzoom/wheelzoom.js',
    bowerPath + '/file-saver/FileSaver.min.js',
    bowerPath + '/shave/dist/shave.min.js',
    basePath + '/js/common.js'
];

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    // Vendor fonts
                    {
                        expand: true,
                        dot: true,
                        cwd: bowerPath + '/bootstrap-sass/assets/fonts',
                        src: 'bootstrap/*',
                        dest: basePath + '/fonts'
                    },
                    // Vendor modernizr.js
                    {
                        expand: true,
                        dot: true,
                        cwd: bowerPath + '/modernizr',
                        src: 'modernizr.js',
                        dest: thirdPartyPath
                    },
                    // Vendor jquery-placeholder.js
                    {
                        expand: true,
                        dot: true,
                        cwd: bowerPath + '/jquery-placeholder',
                        src: 'jquery.placeholder.js',
                        dest: thirdPartyPath
                    }
                ]
            }
        },
        concat: {
            appjs: {
                src: thirdPartyFile,
                dest: distPath + '/app.js'
            },
            appcss: {
                src: [
                    basePath + '/css/style.css'
                ],
                dest: distPath + '/app.css'
            }
        },
        // min css
        cssmin: {
            options: {
                yuicompress: true
            },
            app: {
                src: distPath + '/app.css',
                dest: distPath + '/app.min.css'
            }
        },
        // min js
        uglify: {
            options: {
                compress: true
            },
            appmin: {
                src: distPath + '/app.js',
                dest: distPath + '/app.min.js'
            }
        },
        jshint: {
            app: {
                files: {
                    src: [
                        basePath + '/js/common.js'
                    ]
                }
            }
        },
        sass: {
            options: {
                sourceMap: true,
                sourceMapEmbed: false,
                sourceMapContents: true,
                includePaths: ['.']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: basePath + '/scss',
                    src: ['**/*.{scss,sass}'],
                    dest: basePath + '/css',
                    ext: '.css'
                }]
            },
            dist2: {
              files: [{
                expand: true,
                cwd: appComponentPath,
                src: ['**/*.{scss,sass}'],
                dest: appComponentPath,
                ext: '.css'
              }]
            }
        },

        watch: {
            appjs: {
                files: [
                    basePath + '/js/*.js',
                    basePath + '/js/**/*.js'
                ],
                tasks: [
                    'jshint:app',
                    'concat:appjs',
                    'uglify:appmin'
                ]
            },
            appcss: {
                files: [
                    basePath + '/scss/*.{scss,sass}',
                    basePath + '/scss/**/*.{scss,sass}'
                ],
                tasks: [
                    'sass',
                    'concat:appcss',
                    'cssmin:app'
                ]
            }
        },
        imagemin: {
            dynamic: {
                optimizationLevel: 7,
                files: [{
                    expand: true,
                    cwd: basePath + '/images_temp/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: basePath + '/images/'
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-notify');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

    // Initial task(s).
    grunt.registerTask('setup', [
        'copy',
        'sass',
        'jshint',
        'concat',
        'cssmin',
        'uglify',
        'imagemin'
    ]);

    grunt.registerTask('buildcss', [
        'sass',
        'concat',
        'cssmin'
    ]);
    grunt.registerTask('build', [
        'sass',
        'jshint',
        'concat',
        'cssmin',
        'uglify',
        'imagemin'
    ]);
    grunt.registerTask('buildAppComponent', [
        'sass'
    ]);
};
