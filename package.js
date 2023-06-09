Package.describe({
    name: 'pwix:editor',
    version: '1.1.1',
    summary: 'An encapsulation of "trumbowyg" for Meteor',
    git: 'https://github.com/trychlos/pwix-editor',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'teEditor',
        'TE_MODE_HIDDEN',
        'TE_MODE_STANDARD',
        'TE_MODE_PREVIEW',
        'TE_MODE_EDITION',
        'TE_VERBOSE_NONE',
        'TE_VERBOSE_COLLECTIONS',
        'TE_VERBOSE_COMPONENTS',
        'TE_VERBOSE_CONFIGURE',
        'TE_VERBOSE_MODE',
        'TE_VERBOSE_SWITCH',
        'TE_VERBOSE_TEMSG',
        'TE_VERBOSE_TRUMBOWYG',
        'TE_VERBOSE_UPLOAD'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:editor' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom( '2.9.0' );
    api.use( 'aldeed:collection2@3.5.0' );
    api.use( 'blaze-html-templates@2.0.0', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:i18n@1.0.0' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
    api.addFiles( 'src/client/components/teSerializer/teSerializer.js', 'client' );
    api.addFiles( 'src/client/components/teScriber/teScriber.js', 'client' );
    api.addFiles( 'src/client/components/teSwitch/teSwitch.js', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies
