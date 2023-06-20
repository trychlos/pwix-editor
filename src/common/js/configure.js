/*
 * pwix:editor/src/common/js/configure.js
 */

import _ from 'lodash';

teEditor = {

    // collections
    collections: {},

    // configuration
    _conf: {},

    _defaults: {
        collections: {
            prefix: 'te_'
        },
        storeSwitchState: false,
        uploadUrl: '',
        verbosity: TE_VERBOSE_NONE
    },

    /**
     * @summary Get/set the package configuration
     * @locus Anywhere
     * @param {Object} o Options object
     * @returns {Object} Configuration object
     */
    configure: function( o ){
        if( o && _.isObject( o )){
            _.merge( teEditor._conf, teEditor._defaults, o );
        }
        if( teEditor._conf.verbosity & TE_VERBOSE_CONFIGURE ){
            console.debug( 'pwix:editor configure() with', o, 'building', teEditor._conf );
        }
    }
};

_.merge( teEditor._conf, teEditor._defaults );