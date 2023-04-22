/*
 * /src/client/components/toggle_switch/toggle_switch.js
 *
 * A CSS toggle switch
 * from https://www.w3schools.com/howto/howto_css_switch.asp
 *
 * Parms:
 * - labelTop: a (HTML) string to be displayed above the switch, defaulting to none
 * - labelRight: a (HTML) string to be displayed on the right of the switch, defaulting to none
 * - labelBottom: a (HTML) string to be displayed below the switch, defaulting to none
 * - labelLeft: a (HTML) string to be displayed on the left of the switch, defaulting to none
 * - title: a label as the button title, defaulting to none
 * - initialState: whether the switch is initially on or off, defaulting to off
 */

import './toggle_switch.html';
import './toggle_switch.less';

Template.toggle_switch.onCreated( function(){
    const self = this;

    self.TE = {
        // arguments
        labelTop: new ReactiveVar( '' ),
        labelRight: new ReactiveVar( '' ),
        labelBottom: new ReactiveVar( '' ),
        labelLeft: new ReactiveVar( '' ),
        title: new ReactiveVar( '' ),
        initialState: new ReactiveVar( false ),

        // get a bool arg if present
        argBool( name ){
            if( Object.keys( Template.currentData()).includes( name )){
                const b = Template.currentData()[name];
                if( b === true || b === false ){
                    self.TE[name].set( b );
                } else {
                    console.warn( 'toggle_switch expects \''+name+'\' be a boolean, found', b );
                }
            }
        },

        // get a string arg if present
        argString( name ){
            if( Object.keys( Template.currentData()).includes( name )){
                const s = Template.currentData()[name];
                if( s ){
                    if( typeof s === 'string' || s instanceof String ){
                        self.TE[name].set( s );
                    } else {
                        console.warn( 'toggle_switch expects \''+name+'\' be a (HTML) string, found', s );
                    }
                }
            }
        }
    };

    // get arguments
    self.autorun(() => {
        self.TE.argString( 'labelTop' );
        self.TE.argString( 'labelRight' );
        self.TE.argString( 'labelBottom' );
        self.TE.argString( 'labelLeft' );
        self.TE.argString( 'title' );
        self.TE.argBool( 'initialState' );
    });
});

Template.toggle_switch.onRendered( function(){
    const self = this;

    // set the initial state
    self.autorun(() => {
        self.$( 'label.switch input' ).prop( 'checked', self.TE.initialState.get());
    });
});

Template.toggle_switch.helpers({
    label( name ){
        const TE = Template.instance().TE;
        return TE[name].get();
    },
    
    title(){
        const TE = Template.instance().TE;
        return TE.title.get();
    }
});
