/*
 * /src/client/components/teSwitch/teSwitch.js
 *
 *  Display a edition button when the user is allowed to edit the current page.
 *  This is a toggle button, which may be:
 *  - off: editor is in STANDARD mode
 *  - on: editor is in PREVIEW mode
 * 
 * Parms:
 * - labelTop: a (HTML) string to be displayed above the switch, defaulting to none
 * - labelRight: a (HTML) string to be displayed on the right of the switch, defaulting to none
 * - labelBottom: a (HTML) string to be displayed below the switch, defaulting to none
 * - labelLeft: a (HTML) string to be displayed on the left of the switch, defaulting to none
 * - title: a label as the button title, defaulting to none
 * - state: whether the switch is initially on or off, defaulting to on
 * - enabled: whether the switch is enabled, defaulting to on
 * 
 * The state of the button is available via the Editor.switch.state reactive var, whose value is true for switch on (false else).
 * The switches are advertised via te-switch-on / te-switch-off events.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import './teSwitch.html';

Template.teSwitch.onCreated( function(){
    const self = this;

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS || Editor._conf.verbosity & Editor.C.Verbose.SWITCH ){
        console.debug( 'pwix:editor teSwitch onCreated()' );
    }

    self.TE = {
        // arguments dealt with here
        state: new ReactiveVar( true ),

        // internal vars
        stateKey: COOKIE_SWITCH_STATE,

        // get a bool arg if present
        argBool( name ){
            if( Object.keys( Template.currentData()).includes( name )){
                const b = Template.currentData()[name];
                if( b === true || b === false ){
                    self.TE[name].set( b );
                } else {
                    console.warn( 'teSwitch expects \''+name+'\' be a boolean, found', b );
                }
            }
        },

        // get the last switch state from local store
        //  - if feature has been asked for in the configuration
        //  - if this has not been disabled by the user if a cookieMaager is present
        storeGet(){
            let _state = self.TE.state.get();
            //console.log( 'init state', _state );
            if( self.TE.useStore()){
                _state = localStorage.getItem( self.TE.stateKey );
                //console.log( 'got state', _state );
            }
            return _state;
        },

        storeSet(){
            if( self.TE.useStore()){
                localStorage.setItem( self.TE.stateKey, Editor.switch.state.get());
            }
        },

        // whether to use the local store
        useStore(){
            let use = Editor._conf.storeSwitchState;
            if( use && Meteor.cookieManager ){
                use = Meteor.cookieManager.isEnabled( self.TE.stateKey );
            }
            //console.log( 'useStore', use );
            return use;
        }
    };

    // maybe get last state from local store before following autorun
    self.TE.state.set( self.TE.storeGet());

    // get arguments
    self.autorun(() => {
        self.TE.argBool( 'state' );
    });

    // advertise we have a switch
    Editor.switch.used.set( true );

    // set the initial state
    self.autorun(() => {
        Editor.switch.state.set( self.TE.state.get());
    });
});

Template.teSwitch.onRendered( function(){
    const self = this;

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS || Editor._conf.verbosity & Editor.C.Verbose.SWITCH ){
        console.debug( 'pwix:editor teSwitch onRendered()' );
    }

    // store the switch state (if asked for)
    self.autorun(() => {
        self.TE.storeSet();
    });
});

Template.teSwitch.helpers({
    parms(){
        let o = Template.currentData();
        o.state = Template.instance().TE.state.get();
        return o;
    }
});

Template.teSwitch.events({
    'ts-state .teSwitch'( event, instance, data ){
        Editor.switch.state.set( data.state );
        instance.$( '.teSwitch' ).trigger( data.state ? 'te-switch-on' : 'te-switch-off' );
    },

    'te-switch-off .teSwitch'(){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG || Editor._conf.verbosity & Editor.C.Verbose.SWITCH  ){
            console.debug( 'pwix:editor teSwitch te-switch-off' );
        }
    },

    'te-switch-on .teSwitch'(){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG || Editor._conf.verbosity & Editor.C.Verbose.SWITCH  ){
            console.debug( 'pwix:editor teSwitch te-switch-on' );
        }
    }
});

Template.teSwitch.onDestroyed( function(){
    // advertise we no more have a switch
    Editor.switch.used.set( false );

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS || Editor._conf.verbosity & Editor.C.Verbose.SWITCH  ){
        console.debug( 'pwix:editor teSwitch onDestroyed()' );
    }
});
