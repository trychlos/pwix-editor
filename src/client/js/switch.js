/*
 * pwix:editor/src/client/js/switch.js
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

Editor.switch = {
    used: new ReactiveVar( false ),
    state: new ReactiveVar( false )
};

Tracker.autorun(() => {
    const b = Editor.switch.used.get();
    if( Editor._conf.verbosity & Editor.C.Verbose.SWITCH  ){
        console.debug( 'pwix:editor switch.used', b );
    }
});

Tracker.autorun(() => {
    const b = Editor.switch.state.get();
    if( Editor._conf.verbosity & Editor.C.Verbose.SWITCH  ){
        console.debug( 'pwix:editor switch.state', b );
    }
});
