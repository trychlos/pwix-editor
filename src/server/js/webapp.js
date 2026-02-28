/*
 * pwix:editor/src/server/js/webapp.js
 *
 * Meteor #12524 workaround: make sure assets load happen from the canonic url
 */

import url from 'url';

import { Logger } from 'meteor/pwix:logger';
import { WebApp } from 'meteor/webapp';

const logger = Logger.get();

// returns true if the url has been redirected (so it is no worth to try others redirecters)
const _meteorWorkAround = function( url, res ){
    const usedPath = [
        '/packages/pwix_editor/'
    ];
    let found = false;
    usedPath.every(( path ) => {
        const indexOf = url.indexOf( path );
        //logger.debug( 'url', url, 'path', path, 'index', indexOf );
        if( indexOf > 0 ){
            found = true;
            const newurl = path + url.substring( indexOf+path.length );
            logger.debug( 'redirecting', url, 'to', newurl );
            res.writeHead( 301, {
                Location: newurl
            });
            res.end();
        }
        return !found;
    });
    return found;
}

// when route='/doc/res', a path like /images/... is transformed by Meteor in /doc/images...
// this is a known Meteor bug
WebApp.connectHandlers.use( function( req, res, next ){
    //logger.debug( req.url );
    if( !_meteorWorkAround( req.url, res )){
        next();
    }
});
