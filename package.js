Package.describe({
    name: 'pwix:editor',
    version: '1.0.0',
    summary: 'An encapsulation of "trumbowyg" for Meteor',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'pwiEditor',
        'TE_MODE_HIDDEN',
        'TE_MODE_STANDARD',
        'TE_MODE_PREVIEW',
        'TE_MODE_EDITOR',
        'TE_VERBOSE_NONE',
        'TE_VERBOSE_TBWMSG',
        'TE_VERBOSE_TEMSG',
        'TE_VERBOSE_CREDEL',
        'TE_VERBOSE_UPLOAD'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:editor' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom( '2.9.0' );
    api.use( 'blaze-html-templates', 'client' );
    api.use( 'ecmascript', 'client' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:i18n@1.0.0', 'client' );
    api.addFiles( 'src/client/components/teEditor/teEditor.js', 'client' );
}

Npm.depends({
    'bootstrap': '5.2.1',
    'trumbowyg': '2.25.2',
    'uuid': '9.0.0'
});
