/*
 * /src/client/components/teSerializer/teSerializer.js
 *
 * Get the named content from the database and let it be displayed/edited.
 * If the user is allowed to edition, then the teScriber is initialized in PREVIEW mode.
 * 
 * Parms:
 *  - name: mandatory - the content name in the database
 * 
 * Apart from 'content' and 'mode' which are managed here, other arguments passed to this component are all also passed to underlying teScriber.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import './teSerializer.html';

Template.teSerializer.onCreated( function(){
    const self = this;

    self.TE = {
        // component parameters
        name: new ReactiveVar( null ),

        // runtime data
        docObject: null,
        lastSavedContent: null,
        docContent: new ReactiveVar( null ),
        exists: false,
    };

    //console.debug( 'teSerializer data', Template.currentData());

    // get runtime parameters of the component
    self.autorun(() => {
        if( Object.keys( Template.currentData()).includes( 'name' )){
            self.TE.name.set( Template.currentData().name );
        }
        if( !self.TE.name.get()){
            console.error( 'teSerializer expects a \'name\' argument, not found' );
        }
    });

    // be verbose
    if( teEditor._conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teSerializer onCreated()', self.TE.name.get());
    }
});

Template.teSerializer.onRendered( function(){
    const self = this;

    // be verbose
    if( teEditor._conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teSerializer onRendered()' );
    }

    // get the editable content from the database
    self.autorun(() => {
        const name = self.TE.name.get();
        if( name ){
            Meteor.call( 'te_contents.byName', name, ( err, res ) => {
                if( err ){
                    console.error( 'teSerializer te_contents.byName({ name:'+name+' })', err );
                } else {
                    //console.log( 'content.byName', name, res );
                    //console.log( 'content.byName', self.TE.name, ( res && res.content ? res.content.length : 0 ), 'char(s)' );
                    if( res ){
                        self.TE.docObject = res;
                        self.TE.lastSavedContent = res.content;
                        self.TE.docContent.set( res.content );
                    } else {
                        self.TE.docObject = { name: name, content: '' };
                        self.TE.lastSavedContent = '';
                        self.TE.docContent.set( '' );
                    }
                    self.$( '.teScriber' ).trigger( 'te-content-reset' );
                }
            });
        }
    });
});

Template.teSerializer.helpers({
    // provide parms to teScriber
    editParms(){
        const TE = Template.instance().TE;
        let o = Template.currentData();
        //o.mode = TE.updateAllowed.get() ? TE_MODE_PREVIEW : ( TE.readAllowed.get() ? TE_MODE_STANDARD : TE_MODE_NONE );
        //o.mode = TE_MODE_PREVIEW;
        o.mode = o.mode || TE_MODE_PREVIEW;
        if( teEditor._conf.verbosity & TE_VERBOSE_MODE ){
            //console.debug( 'pwix:editor teSerializer editParms readAllowed='+TE.readAllowed.get(), 'updateAllowed='+ TE.updateAllowed.get(), 'asking for', o.mode );
            console.debug( 'pwix:editor teSerializer editParms asks for', o.mode );
        }
        o.content = TE.docContent;
        return o;
    }
});

Template.teSerializer.events({
    // autosave on each change
    'te-content-changed .teSerializer'( event, instance, data ){
        if( data.html !== instance.TE.lastSavedContent ){
            const name = instance.TE.name.get();
            if( name ){
                Meteor.call( 'te_contents.set', name, data.html, ( err, res ) => {
                    if( err ){
                        console.error( err );
                    } else {
                        instance.TE.lastSavedContent = data.html;
                        instance.$( '.teSerializer' ).trigger( 'te-serialized', { result: res });
                    }
                });
            }
        }
    },

    // verbose
    'te-serialized .teSerializer'( event, instance, data ){
        if( teEditor._conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'pwix:editor teSerializer te-serialized', data );
        }
    }
});

Template.teSerializer.onDestroyed( function(){
    // be verbose
    if( teEditor._conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teSerializer onDestroyed()' );
    }
});
