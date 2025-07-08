/*
 * pwix:editor/src/common/collections/contents/schema.js
 *
 * The actual collection name is configurable.
 * Because the actual collection name is only known at runtime, we cannot define here the Mongo collection,
 *  but have to define both client and server-side collections at each use.
 * 
 * See Contents.methods and common/init/collections.js
 */

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

Tracker.autorun(() => {
    const fieldSet = Editor.collections.Contents.fieldSet.get();
    if( fieldSet ){
        Editor.collections.Contents.schema = new SimpleSchema( fieldSet.toSchema());
    }
});
