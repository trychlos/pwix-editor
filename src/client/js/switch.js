/*
 * pwix:editor/src/client/js/switch.js
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

pwiEditor.switch = {
    used: new ReactiveVar( false ),
    state: new ReactiveVar( false )
};

Tracker.autorun(() => {
    const b = pwiEditor.switch.used.get();
    if( pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH  ){
        console.debug( 'pwix:editor switch.used', b );
    }
});

Tracker.autorun(() => {
    const b = pwiEditor.switch.state.get();
    if( pwiEditor.conf.verbosity & TE_VERBOSE_SWITCH  ){
        console.debug( 'pwix:editor switch.state', b );
    }
});
