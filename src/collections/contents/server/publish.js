import { Contents } from '../contents.js';

// returns the list of known contents
Meteor.publish( 'te_contents.listAll', function(){
    return pwiEditor.collections.Contents.server.find();
});
