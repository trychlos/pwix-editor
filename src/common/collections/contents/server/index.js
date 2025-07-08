/*
 * pwix:editor/src/common/collections/contents/server/index.js
 */

import './methods.js';
import './publish.js';

if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
    console.debug( 'pwix:editor/src/common/collections/contents/server/index.js declaring Contents collection' );
}
