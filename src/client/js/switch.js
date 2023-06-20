/*
 * pwix:editor/src/client/js/switch.js
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

teEditor.switch = {
    used: new ReactiveVar( false ),
    state: new ReactiveVar( false )
};

Tracker.autorun(() => {
    const b = teEditor.switch.used.get();
    if( teEditor._conf.verbosity & TE_VERBOSE_SWITCH  ){
        console.debug( 'pwix:editor switch.used', b );
    }
});

Tracker.autorun(() => {
    const b = teEditor.switch.state.get();
    if( teEditor._conf.verbosity & TE_VERBOSE_SWITCH  ){
        console.debug( 'pwix:editor switch.state', b );
    }
});
