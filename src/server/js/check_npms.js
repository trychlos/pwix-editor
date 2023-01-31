/*
 * pwix:editor/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    // whitelist packages which are included via a subfolder
    require( '@popperjs/core/package.json' );
    require( 'bootstrap/package.json' );
    require( 'jquery-resizable-dom/package.json' );
    require( 'trumbowyg/package.json' );
}

checkNpmVersions({
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
    'jquery-resizable-dom': '^0.35.0',
    'trumbowyg': '^2.25.2',
    'uuid': '^9.0.0'
    }, 'pwix:editor' );
