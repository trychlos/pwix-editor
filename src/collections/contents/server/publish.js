/*
 * pwix:editor/src/collections/contents/server/publish.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Contents } from '../contents.js';

// returns the list of known contents

Meteor.publish( 'teContent.listAll', function( collection_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'teContent.listAll expects collection_name a non-empty string, found', collection_name );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    return collection.find();
});

// returns a document by its name
Meteor.publish( 'teContent.byName', function( collection_name, document_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'teContent.byName expects collection_name be a non-empty string, found', collection_name );
    assert( document_name && _.isString( document_name ) && document_name.length, 'teContent.byName expects document_name be a non-empty string, found', document_name );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    return collection.find({ name: document_name });
});
