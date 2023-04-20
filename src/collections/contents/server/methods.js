import { Contents } from '../contents.js';

Meteor.methods({
    // empty the collection
    'te_contents.empty'(){
        return pwiEditor.collections.Contents.server.remove({});
    },

    // get some content from the database
    'te_contents.byName'( name ){
        //console.log( pwiEditor.collections.Contents );
        return pwiEditor.collections.Contents.server.findOne({ name: name });
    },

    // import an element (so do not modify any data) 
    'te_contents.import'( elt ){
        return pwiEditor.collections.Contents.server.insert( elt );
    },

    // set some content into the database
    // name is mandatory
    'te_contents.set'( name, content ){
        if( !name ){
            throw new Meteor.Error(
                'content.set',
                'Empty name' );
        }
        let orig = pwiEditor.collections.Contents.server.findOne({ name: name });
        //console.log( 'content.set orig=', orig );
        let o = {
            content: content
        };
        if( orig ){
            //console.log( 'content.set setting updatedAt' );
            o.updatedAt = new Date();
            o.updatedBy = this.userId;
        } else {
            //console.log( 'content.set setting createdAt' );
            o.createdAt = new Date();
            o.createdBy = this.userId;
        }
        let res = pwiEditor.collections.Contents.server.upsert({ name: name }, { $set: o });
        if( res.numberAffected > 0 ){
            res.written = pwiEditor.collections.Contents.server.findOne({ name: name });
        }
        //console.log( 'content.set', res );
        return res;
    }
});
