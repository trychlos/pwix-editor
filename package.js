Package.describe({
    name: 'pwix:editor',
    version: '1.3.0-rc',
    summary: 'An encapsulation of "trumbowyg" for Meteor',
    git: 'https://github.com/trychlos/pwix-editor',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'Editor'
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
    api.use( 'pwix:i18n@1.5.2' );
    api.use( 'pwix:toggle-switch@0.3.1' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
    api.addFiles([
        'src/client/components/teSerializer/teSerializer.js',
        'src/client/components/teScriber/teScriber.js',
        'src/client/components/teSwitch/teSwitch.js'
    ],
        'client'
    );
    api.addAssets([
        'src/client/third-party/arial/ARIAL.woff',
        'src/client/third-party/arial/arial-black.ttf',
        'src/client/third-party/comic/LDFComicSans.ttf',
        'src/client/third-party/courier/CourierPrime-Regular.ttf',
        'src/client/third-party/cousine/Cousine-Regular.ttf',
        'src/client/third-party/josefin/static/JosefinSans-Regular.ttf',
        'src/client/third-party/opensans/static/OpenSans-Regular.ttf',
        'src/client/third-party/orbitron/static/Orbitron-Regular.ttf',
        'src/client/third-party/serpentine/Serpentine-Medium.otf',
        'src/client/third-party/tahoma/Tahoma Regular font.ttf',
        'src/client/third-party/ubuntu/UbuntuMono-Regular.ttf'
    ],
        'client'
    );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies
