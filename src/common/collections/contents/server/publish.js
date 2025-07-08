/*
 * pwix:editor/src/common/collections/contents/server/publish.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

// publishes the list of known contents
//  have the full content for each document + add a length data

Meteor.publish( 'teContent.listAll', function( collection_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'teContent.listAll expects collection_name a non-empty string, found', collection_name );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    const self = this;

    const f_transform = function( item ){
        item.length = item.content ? item.content.length : 0;
        return item;
    }

    const observer = collection.find({}, { sort: { name: 1 }}).observe({
        added: function( doc){
            self.added( collection_name, doc._id, f_transform( doc ));
        },
        changed: function( newDoc, oldDoc ){
            self.changed( collection_name, newDoc._id, f_transform( newDoc ));
        },
        removed: function( oldDoc ){
            self.removed( collection_name, oldDoc._id );
        }
    });

    self.onStop( function(){
        observer.stop();
    });

    self.ready();
});

// publishes a document by its name
Meteor.publish( 'teContent.byName', function( collection_name, document_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'teContent.byName expects collection_name be a non-empty string, found', collection_name );
    assert( document_name && _.isString( document_name ) && document_name.length, 'teContent.byName expects document_name be a non-empty string, found', document_name );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    return collection.find({ name: document_name });
});
