Package.describe({
    name: 'pwix:editor',
    version: '1.4.1-rc',
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
    api.use( 'dburles:mongo-collection-instances@0.3.6' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'mongo' );
    api.use( 'pwix:i18n@1.5.2' );
    api.use( 'pwix:plus-button@0.11.0' );
    api.use( 'pwix:toggle-switch@0.3.1' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
    api.addFiles([
        'src/client/components/teManager/teManager.js',
        'src/client/components/teSerializer/teSerializer.js',
        'src/client/components/teScriber/teScriber.js',
        'src/client/components/teSwitch/teSwitch.js'
    ],
        'client'
    );
    api.addAssets([
        'src/client/third-party/fonts/arial/Arial-Black.ttf',
        'src/client/third-party/fonts/arial/ArialMT.ttf',
        'src/client/third-party/fonts/comic/LDFComicSans.ttf',
        'src/client/third-party/fonts/comic/LDFComicSansBold.ttf',
        'src/client/third-party/fonts/comic/LDFComicSansHairline.ttf',
        'src/client/third-party/fonts/comic/LDFComicSansLight.ttf',
        'src/client/third-party/fonts/courier/CourierPrime-Bold.ttf',
        'src/client/third-party/fonts/courier/CourierPrime-BoldItalic.ttf',
        'src/client/third-party/fonts/courier/CourierPrime-Italic.ttf',
        'src/client/third-party/fonts/courier/CourierPrime-Regular.ttf',
        'src/client/third-party/fonts/cousine/Cousine-Bold.ttf',
        'src/client/third-party/fonts/cousine/Cousine-BoldItalic.ttf',
        'src/client/third-party/fonts/cousine/Cousine-Italic.ttf',
        'src/client/third-party/fonts/cousine/Cousine-Regular.ttf',
        'src/client/third-party/fonts/josefin/JosefinSans-Bold.ttf',
        'src/client/third-party/fonts/josefin/JosefinSans-BoldItalic.ttf',
        'src/client/third-party/fonts/josefin/JosefinSans-Italic.ttf',
        'src/client/third-party/fonts/josefin/JosefinSans-Regular.ttf',
        'src/client/third-party/fonts/josefin/JosefinSans-Thin.ttf',
        'src/client/third-party/fonts/josefin/JosefinSans-ThinItalic.ttf',
        'src/client/third-party/fonts/orbitron/Orbitron-Black.ttf',
        'src/client/third-party/fonts/orbitron/Orbitron-Bold.ttf',
        'src/client/third-party/fonts/orbitron/Orbitron-Medium.ttf',
        'src/client/third-party/fonts/orbitron/Orbitron-Regular.ttf',
        'src/client/third-party/fonts/serpentine/Serpentine-Bold.ttf',
        'src/client/third-party/fonts/serpentine/Serpentine-Medium.ttf',
        'src/client/third-party/fonts/serpentine/Serpentine-ICGLight.ttf',
        'src/client/third-party/fonts/ubuntu/UbuntuMono-Bold.ttf',
        'src/client/third-party/fonts/ubuntu/UbuntuMono-BoldItalic.ttf',
        'src/client/third-party/fonts/ubuntu/UbuntuMono-Italic.ttf',
        'src/client/third-party/fonts/ubuntu/UbuntuMono-Regular.ttf',
        'src/client/third-party/js/trumbowyg/plugins/fontsize/ui/icons/fontsize-minus.svg',
        'src/client/third-party/js/trumbowyg/plugins/fontsize/ui/icons/fontsize-plus.svg'
    ],
        'client'
    );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies
