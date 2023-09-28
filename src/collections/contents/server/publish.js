/*
 * pwix:editor/src/collections/contents/server/publish.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Contents } from '../contents.js';

// returns the list of known contents

Meteor.publish( 'te_contents.listAll', function( collection_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.listAll expects collection_name be a non-empty string' );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    return collection.find();
});
