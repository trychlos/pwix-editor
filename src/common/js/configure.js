/*
 * pwix:editor/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};
Editor._conf = new ReactiveVar( _conf );

Editor._defaults = {
    fontfamilyAdds: [],
    storeSwitchState: false,
    tabularContentWidth: 200,
    uploadUrl: '',
    verbosity: Editor.C.Verbose.CONFIGURE
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
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( Editor._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                console.warn( 'pwix:editor configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( Editor._defaults, _conf, built_conf );
            Editor._conf.set( _conf );
            if( _conf.verbosity & Editor.C.Verbose.CONFIGURE ){
                console.debug( 'pwix:editor configure() with', built_conf );
            }
        }
    }
    // also acts as a getter
    return Editor._conf.get();
};

_conf = _.merge( {}, Editor._defaults );
Editor._conf.set( _conf );
