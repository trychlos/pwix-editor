/*
 * pwix:editor/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    // whitelist packages which are included via a subfolder
    require( 'jquery-resizable-dom/package.json' );
    require( 'uuid/package.json' );
}

checkNpmVersions({
    'jquery-resizable-dom': '^0.35.0',   // required by trumbowyg:resizimg plugin
    'lodash': '^4.17.0',
    // as of 2023- 9-15 we embed a (buggy) version 2.27.3
    //  keep this patched version until https://github.com/Alex-D/Trumbowyg/issues/1396 is fixed
    //'trumbowyg': '^2.25.2',
    'uuid': '^9.0.0 || ^10.0.0 || ^11.0.0'
},
    'pwix:editor'
);
