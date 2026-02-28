/*
 * pwix:editor/src/client/js/switch.js
 */

import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

const logger = Logger.get();

Editor.switch = {
    used: new ReactiveVar( false ),
    state: new ReactiveVar( false )
};

Tracker.autorun(() => {
    const b = Editor.switch.used.get();
    logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.SWITCH }, 'switch.used', b );
});

Tracker.autorun(() => {
    const b = Editor.switch.state.get();
    logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.SWITCH }, 'switch.state', b );
});
