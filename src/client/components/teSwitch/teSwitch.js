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
 * - state: whether the switch is initially on or off, defaulting to off
 * - enabled: whether the switch is enabled, defaulting to on
 * 
 * The state of the button is available via the Editor.switch.state reactive var, whose value is true for switch on (false else).
 * The switches are advertised via te-switch-on / te-switch-off events.
 */

import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';

import './teSwitch.html';

const logger = Logger.get();

Template.teSwitch.onCreated( function(){
    const self = this;

    // be verbose
    logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COMPONENTS | Editor.C.Verbose.SWITCH }, 'teSwitch onCreated()' );

    self.TE = {
        // arguments dealt with here
        state: new ReactiveVar( false ),

        // get a bool arg if present
        argBool( name ){
            if( Object.keys( Template.currentData()).includes( name )){
                const b = Template.currentData()[name];
                if( b === true || b === false ){
                    self.TE[name].set( b );
                } else {
                    logger.warn( 'teSwitch expects \''+name+'\' be a boolean, found', b );
                }
            }
        }
    };

    // maybe get last state from local store before following autorun
    self.TE.state.set( Editor._store.get( COOKIE_SWITCH_STATE ));

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
    logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COMPONENTS | Editor.C.Verbose.SWITCH }, 'teSwitch onRendered()' );
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
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.TEMSG | Editor.C.Verbose.SWITCH }, 'te-switch-off' );
    },

    'te-switch-on .teSwitch'(){
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.TEMSG | Editor.C.Verbose.SWITCH }, 'te-switch-on' );
    }
});

Template.teSwitch.onDestroyed( function(){
    // advertise we no more have a switch
    Editor.switch.used.set( false );

    // be verbose
    logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COMPONENTS | Editor.C.Verbose.SWITCH }, 'teSwitch onDestroyed()' );
});
