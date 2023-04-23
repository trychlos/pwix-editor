import { Contents } from '../contents.js';

// returns the list of known contents
Meteor.publish( 'te_contents.listAll', function(){
    return teEditor.collections.Contents.server.find();
});
