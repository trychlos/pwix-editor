import { Contents } from '../contents.js';

Meteor.methods({
    // empty the collection
    'te_contents.empty'(){
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.empty() call' );
        }
        const res = teEditor.collections.Contents.server.remove({});
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.empty() returns with', res );
        }
        return res;
    },

    // get some content from the database
    'te_contents.byName'( name ){
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.byName() call with name=', name );
        }
        const res = teEditor.collections.Contents.server.findOne({ name: name });
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.byName() returns with', res );
        }
        return res;
    },

    // import an element (so do not modify any data) 
    'te_contents.import'( elt ){
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.import() call with elt=', elt );
        }
        const res = teEditor.collections.Contents.server.insert( elt );
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.import() returns with', res );
        }
        return res;
    },

    // set some content into the database
    // name is mandatory
    'te_contents.set'( name, content ){
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.set() call with name=', name, 'content=', content );
        }
        if( !name ){
            throw new Meteor.Error(
                'content.set',
                'Empty name' );
        }
        let orig = teEditor.collections.Contents.server.findOne({ name: name });
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
        let res = teEditor.collections.Contents.server.upsert({ name: name }, { $set: o });
        if( res.numberAffected > 0 ){
            res.written = teEditor.collections.Contents.server.findOne({ name: name });
        }
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.set() returns with', res );
        }
        return res;
    }
});
