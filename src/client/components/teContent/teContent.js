/*
 * /src/client/components/teContent/teContent.js
 *
 * Get the named content from the database and let it be displayed/edited.
 * If the user is allowed to edition, then the teEditor is initialized in PREVIEW mode.
 * 
 * Parms:
 *  - name: mandatory - the content name in the database
 *  - createAllowed: whether creation of the content is allowed
 *      only considered if name doesn't yet exists
 *      default to false
 *  - readAllowed: whether display of the existing content is allowed
 *      only considered if name exists
 *      default to false
 *  - updateAllowed: whether edition is allowed
 *      only considered if name exists
 *      default to false
 *  - deleteAllowed: whether deletion is allowed
 *      only considered if name exists
 *      default to false
 * 
 * Apart from 'content' and 'mode' which are managed here, other arguments passed to this component are all also passed to underlying teEditor.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import './teContent.html';

Template.teContent.onCreated( function(){
    const self = this;

    self.TE = {
        // component parameters
        name: new ReactiveVar( null ),
        createAllowed: new ReactiveVar( false ),
        readAllowed: new ReactiveVar( false ),
        updateAllowed: new ReactiveVar( false ),
        deleteAllowed: new ReactiveVar( false ),

        // runtime data
        docObject: null,
        lastSavedContent: null,
        docContent: new ReactiveVar( null ),
        exists: false,

        boolArg( name ){
            if( Object.keys( Template.currentData()).includes( name )){
                const b = Template.currentData()[name];
                if( b === true || b === false ){
                    self.TE[name].set( b );
                } else {
                    console.warn( 'teContent expects \''+name+'\' be a boolean, found \''+b+'\', ignored' );
                }
            }
        }
    };

    // get runtime parameters of the component
    self.autorun(() => {
        if( Object.keys( Template.currentData()).includes( 'name' )){
            self.TE.name.set( Template.currentData().name );
        }
        if( !self.TE.name.get()){
            console.error( 'teContent expects a \'name\' argument, not found' );
        }
        self.TE.boolArg( 'createAllowed' );
        self.TE.boolArg( 'readAllowed' );
        self.TE.boolArg( 'updateAllowed' );
        self.TE.boolArg( 'deleteAllowed' );
    });

    // be verbose
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teContent onCreated()', self.TE.name.get());
    }
});

Template.teContent.onRendered( function(){
    const self = this;

    // be verbose
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teContent onRendered()' );
    }

    // get the editable content from the database
    self.autorun(() => {
        const name = self.TE.name.get();
        if( name ){
            Meteor.call( 'te_contents.byName', name, ( err, res ) => {
                if( err ){
                    console.error( 'teContent te_contents.byName({ name:'+name+' })', err );
                } else {
                    //console.log( 'content.byName', name, res );
                    //console.log( 'content.byName', self.TE.name, ( res && res.content ? res.content.length : 0 ), 'char(s)' );
                    if( res ){
                        if( self.TE.readAllowed.get()){
                            self.TE.docObject = res;
                            self.TE.lastSavedContent = res.content;
                            self.TE.docContent.set( res.content );

                        } else if( pwiEditor.conf.verbosity & TE_VERBOSE_WARN_READ ){
                            console.warn( 'pwix:editor teContent name=\''+name+'\' exists, but readAllowed=false' );
                            self.TE.docObject = { name: name, content: '' };
                            self.TE.lastSavedContent = '';
                            self.TE.docContent.set( '' );
                        }
                    } else if( self.TE.createAllowed.get()){
                        self.TE.docObject = { name: name, content: '' };
                        self.TE.lastSavedContent = '';
                        self.TE.docContent.set( '' );
                    
                    } else if( pwiEditor.conf.verbosity & TE_VERBOSE_WARN_CREATE ){
                        console.warn( 'pwix:editor teContent name=\''+name+'\' doesn\'t exist, but createAllowed=false' );
                        self.TE.docObject = { name: name, content: '' };
                        self.TE.lastSavedContent = '';
                        self.TE.docContent.set( '' );
                    }
                    self.$( '.teEditor' ).trigger( 'te-content-reset' );
                }
            });
        }
    });
});

Template.teContent.helpers({
    // provide parms to teEditor
    editParms(){
        const TE = Template.instance().TE;
        let o = Template.currentData();
        o.mode = TE.updateAllowed.get() ? TE_MODE_PREVIEW : ( TE.readAllowed.get() ? TE_MODE_STANDARD : TE_MODE_NONE );
        if( pwiEditor.conf.verbosity & TE_VERBOSE_MODE ){
            console.debug( 'pwix:editor teContent editParms readAllowed='+TE.readAllowed.get(), 'updateAllowed='+ TE.updateAllowed.get(), 'asking for', o.mode );
        }
        o.content = TE.docContent;
        return o;
    }
});

Template.teContent.events({
    // autosave on each change
    'te-content-changed .teContent'( event, instance, data ){
        if( data.html !== instance.TE.lastSavedContent ){
            const name = instance.TE.name.get();
            if( name ){
                if( instance.TE.updateAllowed.get()){
                    Meteor.call( 'te_contents.set', name, data.html, ( err, res ) => {
                        if( err ){
                            console.error( err );
                        } else {
                            console.log( 'te_contents.set', name, res );
                            instance.TE.lastSavedContent = data.html;
                        }
                    });
                } else if( pwiEditor.conf.verbosity & TE_VERBOSE_WARN_UPDATE ){
                    console.warn( 'pwix:editor teContent name=\''+name+'\' changed, but updateAllowed=false' );
                }
            }
        }
    }
});

Template.teContent.onDestroyed( function(){
    // be verbose
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teContent onDestroyed()' );
    }
});
