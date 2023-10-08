/*
 * pwix:editor/src/common/js/collections.js
 */

import { Mongo } from 'meteor/mongo';

import '../../collections/contents/contents.js';

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
            collection = new Mongo.Collection( name );
            if( schema ){
                collection.attachSchema( schema );
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
