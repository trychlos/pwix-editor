/*
 * pwix:editor/src/common/js/configure.js
 */

import _ from 'lodash';

Editor._defaults = {
    collections: {
        prefix: 'te_'
    },
    storeSwitchState: false,
    uploadUrl: '',
    verbosity: TE_VERBOSE_NONE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both in the client and the server
 * @locus Anywhere
 * @param {Object} o Options object
 * @returns {Object} Configuration object
 */
Editor.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( Editor._conf, Editor._defaults, o );
    }
    if( Editor._conf.verbosity & TE_VERBOSE_CONFIGURE ){
        console.debug( 'pwix:editor configure() with', o, 'building', Editor._conf );
    }
    // also acts as a getter
    return Editor._conf
};

_.merge( Editor._conf, Editor._defaults );
