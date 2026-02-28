/*
 * pwix:editor/src/common/js/collections.js
 */

import { Logger } from 'meteor/pwix:logger';
import { Mongo } from 'meteor/mongo';

import '../collections/contents/index.js';

const logger = Logger.get();

/**
 * @summary Common getter and initialization code to dynamically define a Contents collection
 * @locaus Anywhere
 * @param {String} name the collection name
 * @param {Object} schema the schema to be attached to the newly defined collection
 */
Editor.collections.get = function( name, schema ){
    if( !Object.keys( Editor.collections.byName ).includes( name )){
        // thanks to dburles:mongo-collection-instances
        let collection = Mongo.Collection.get( name );
        if( !collection ){
            logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'instanciating Mongo.Collection', name );

            collection = new Mongo.Collection( name );
            if( schema ){
                collection.attachSchema( schema );
                collection.attachBehaviour( 'timestampable' );
            }
            if( Meteor.isServer ){
                collection.deny({
                    insert(){ return true; },
                    update(){ return true; },
                    remove(){ return true; },
                });
            }
        }
        Editor.collections.byName[name] = collection;
    }
    return Editor.collections.byName[name];
}
