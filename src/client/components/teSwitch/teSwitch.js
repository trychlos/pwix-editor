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
 * - initialState: whether the switch is initially on or off, defaulting to off
 * 
 * The state of the button is available via the pwiEditor.switch.state reactive var, whose value is true for switch on (false else).
 * The switches are advertised via te-switch-on / te-switch-off events.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../toggle_switch/toggle_switch.js';

import './teSwitch.html';

Template.teSwitch.onCreated( function(){
    const self = this;

    self.TE = {
        // arguments dealt with here
        initialState: new ReactiveVar( false ),

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
        }
    };

    // get arguments
    self.autorun(() => {
        self.TE.argBool( 'initialState' );
    });

    // advertise we have a switch
    pwiEditor.switch.used.set( true );

    // set the initial state
    self.autorun(() => {
        pwiEditor.switch.state.set( self.TE.initialState.get());
    });

    // be verbose
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COMPONENTS || pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH ){
        console.debug( 'pwix:editor teSwitch onCreated()' );
    }
});

Template.teSwitch.onRendered( function(){
    const self = this;

    // be verbose
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COMPONENTS || pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH ){
        console.debug( 'pwix:editor teSwitch onRendered()' );
    }
});

Template.teSwitch.events({
    'change .teSwitch'( event, instance ){
        const checked = instance.$( '.te-toggle-switch input' ).is( ':checked' );
        pwiEditor.switch.state.set( checked );
        instance.$( '.teSwitch' ).trigger( checked ? 'te-switch-on' : 'te-switch-off' );
    },

    'te-switch-off .teSwitch'(){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG || pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH  ){
            console.debug( 'pwix:editor teSwitch te-switch-off' );
        }
    },

    'te-switch-on .teSwitch'(){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG || pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH  ){
            console.debug( 'pwix:editor teSwitch te-switch-on' );
        }
    }
});

Template.teSwitch.onDestroyed( function(){
    // advertise we no more have a switch
    pwiEditor.switch.used.set( false );

    // be verbose
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COMPONENTS || pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH  ){
        console.debug( 'pwix:editor teSwitch onDestroyed()' );
    }
});
