/*
 * pwix:editor/src/client/components/teScriber/teScriber.js
 *
 * Edition mode can be set or modified by:
 * 
 * - the 'mode' argument passed in by the caller (parent) component
 * - clicking on 'view'/'edit' buttons
 * - switching the 'Edit' toggle switch
 * 
 * Parms:
 * - content: a ReactiveVar which contains the document to be edited
 * - mode: the edition mode, defaulting to STANDARD
 * - document: the document name, defaulting to 'unnamed'
 * - displayName: whether to display the document name, defaulting to true
 * - withNamePanel: whether to display the name panel, defaulting to true
 * - withHTMLBtn: whether to display the HTML button, defaulting to true
 * - withFullScreenBtn: whether to display the FullScreen button, defaulting to true
 * - fontfamilyAdds: an array of font families to be added, defaulting to empty
 */

import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { pwixI18n } from 'meteor/pwix:i18n';

// required by trumbowyg:resizimg plugin
import 'jquery-resizable-dom/dist/jquery-resizable.min.js';

//import 'trumbowyg/dist/ui/trumbowyg.min.css';
//import 'trumbowyg/dist/trumbowyg.min.js';

//import 'trumbowyg/plugins/colors/trumbowyg.colors.js';
//import 'trumbowyg/plugins/emoji/trumbowyg.emoji.js';
//import 'trumbowyg/plugins/fontfamily/trumbowyg.fontfamily.js';
//import 'trumbowyg/plugins/fontsize/trumbowyg.fontsize.js';
//import 'trumbowyg/plugins/history/trumbowyg.history.js';
//import 'trumbowyg/plugins/pasteimage/trumbowyg.pasteimage.js';
//import 'trumbowyg/plugins/resizimg/trumbowyg.resizimg.js';
//import 'trumbowyg/plugins/upload/trumbowyg.upload.js';

// cf. /server/js/check_npms.js
//  as of 2023- 9-15 use a local patched version
import '../../third-party/js/trumbowyg/dist/trumbowyg.js';
import '../../third-party/js/trumbowyg/dist/ui/trumbowyg.min.css';
import '../../third-party/js/trumbowyg/plugins/colors/trumbowyg.colors.js';
import '../../third-party/js/trumbowyg/plugins/emoji/trumbowyg.emoji.js';
import '../../third-party/js/trumbowyg/plugins/fontfamily/trumbowyg.fontfamily.js';
import '../../third-party/js/trumbowyg/plugins/fontsize/trumbowyg.fontsize.js';
import '../../third-party/js/trumbowyg/plugins/history/trumbowyg.history.js';
import '../../third-party/js/trumbowyg/plugins/pasteimage/trumbowyg.pasteimage.js';
import '../../third-party/js/trumbowyg/plugins/resizimg/trumbowyg.resizimg.js';
import '../../third-party/js/trumbowyg/plugins/table/trumbowyg.table.js';
import '../../third-party/js/trumbowyg/plugins/upload/trumbowyg.upload.js';

import '../../../common/js/index.js';

import './teScriber.html';
import './teScriber.less';

Template.teScriber.onCreated( function(){
    const self = this;

    self.TE = {
        // the parms
        content: null,
        name: '',
        currentMode: new ReactiveVar( Editor.C.Mode.STANDARD ),
        displayName: true,
        withNamePanel: true,
        withHTMLBtn: true,
        withFullScreenBtn: true,

        // internal vars
        editorInitialized: new ReactiveVar( false ),
        id: uuidv4(),
        uploadUrl: null,
        mode_parm: null,    // the mode asked for by the component parent
        mode_asked: null,   // the mode asked for internally
        editorDiv: null,

        // get a bool arg if present
        argBool( name ){
            if( Object.keys( Template.currentData()).includes( name )){
                const b = Template.currentData()[name];
                if( b === true || b === false ){
                    self.TE[name] = b;
                } else {
                    console.warn( 'teScriber expects \''+name+'\' be a boolean, found', b );
                }
            }
        },

        // check the asked mode vs the current state of the edition toggle switch
        // returns the mode to be considered
        checkSwitch( mode ){
            const _input = mode;
            const _hasSwitch = Editor.switch.used.get();
            let _switchState;
            if( _hasSwitch ){
                _switchState = Editor.switch.state.get();
                if( !_switchState ){
                    switch( mode ){
                        case Editor.C.Mode.PREVIEW:
                        case Editor.C.Mode.EDITION:
                            mode =  Editor.C.Mode.STANDARD;
                            self.TE.mode_asked = Editor.C.Mode.PREVIEW;
                            break;
                    }
                }

            }
            if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
                console.debug( 'pwix:editor teScriber checkSwitch() asked='+_input, 'switchExists='+ _hasSwitch, 'switchState='+_switchState, 'returning', mode );
            }
            return mode;
        },

        // lexically compare two strings - case insensitive
        cmpStrings( a, b ){
            const A = a.toUpperCase();
            const B = b.toUpperCase();
            return A < B ? -1 : ( A > B ? 1 : 0 );
        },

        // re-set the html content of the editing area on mode change
        //  + try to minimize the tbwchange message effects when the editing area is changed here
        tbwchange_update: true,
        tbwchange_sendmsg: true,
        tbwchange_last: null,

        contentHtml(){
            if( self.view.isRendered && !self.TE.editorInitialized.get()){
                self.TE.editorDiv.html( self.TE.content.get());
            }
        },

        contentReset(){
            if( self.view.isRendered && self.TE.editorInitialized.get()){
                self.TE.tbwchange_update = false;
                if( self.TE.content ){
                    self.TE.editorDiv.trumbowyg( 'html', self.TE.content.get());
                }
                self.TE.tbwchange_update = true;
            }
        },

        // get the default buttons
        editorBtnsDef(){
            let btns = [];
            if( self.TE.uploadUrl ){
                btns.push({
                    // Create a new dropdown
                    image: {
                        dropdown: ['insertImage', 'upload'],
                        ico: 'insertImage'
                    }
                });
            }
            return btns;
        },

        // get the buttons
        editorButtons(){
            let btns = [];
            if( self.TE.withHTMLBtn ){
                btns.push( ['viewHTML'] );
            }
            btns.push(
                ['historyUndo', 'historyRedo'],
                ['formatting'],
                ['fontfamily'],
                //['fontsize'],
                //['fontsize_custom'],
                ['fontsize_custom2', 'fontsize_plus', 'fontsize_minus'],
                ['strong', 'em', 'del'],
                ['superscript', 'subscript'],
                ['foreColor', 'backColor'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                ['unorderedList', 'orderedList'],
                ['link'],
                ['image'],
                ['emoji'],
                ['horizontalRule'],
                ['removeformat']
            );
            if( self.TE.withFullScreenBtn ){
                btns.push( ['fullscreen'] );
            }
            return btns;
        },

        // create the Trumbowyg editor (starting the EDITION mode)
        //  this code run the creation; the initialization itself is made on tbwinit message
        editorCreate(){
            if( self.view.isRendered && !self.TE.editorInitialized.get()){
                if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
                    console.debug( 'pwi:editor teScriber editorCreate() instanciating...' );
                }
                self.TE.editorDiv.trumbowyg({
                    btnsDef: self.TE.editorBtnsDef(),
                    btns: self.TE.editorButtons(),
                    plugins: self.TE.editorPlugins(),
                    semantic: {
                        'div': 'div'
                    },
                    autogrowOnEnter: true,
                    imageWidthModalEdit: true,
                    lang: pwixI18n.language(),
                    maxBtnPaneRows: 2
                });
            }
        },

        // delete the Trumbowyg edtor (quitting the EDITION mode)
        editorDelete(){
            if( self.TE.editorInitialized.get()){
                if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
                    console.debug( 'pwix:editor teScriber editorDelete() destroying instance' );
                }
                self.TE.editorDiv.trumbowyg( 'destroy' );
                self.TE.editorInitialized.set( false );
            }
        },

        editorFontFamilyDefault(){
            return [
                { name: 'Arial', family: 'Arial, Helvetica, sans-serif' },
                { name: 'Arial Black', family: 'Arial Black, sans-serif' },
                { name: 'Comic Sans', family: 'Comic Sans, sans-serif' },
                { name: 'Courier', family: 'Courier, sans-serif' },
                { name: 'Cousine', family: 'Cousine, sans-serif' },
                { name: 'Josefin Sans', family: 'Josefin Sans, sans-serif' },
                { name: 'Orbitron', family: 'Orbitron, sans-serif' },
                { name: 'Serpentine', family: 'Serpentine, sans-serif' },
                { name: 'Ubuntu Mono', family: 'Ubuntu Mono, sans-serif' }
            ];
        },

        // setup the editor plugins
        editorPlugins(){
            let plugins = {};
            if( self.TE.uploadUrl ){
                plugins.upload = {
                    serverPath: self.TE.uploadUrl,
                    fileFieldName: 'image',
                    urlPropertyName: 'data.link'
                };
            }
            // have our own font families
            const defaults = self.TE.editorFontFamilyDefault();
            const adds = Template.currentData().fontfamilyAdds || [];
            let families = [ ...defaults, ...adds ];
            families.sort(( a, b ) => { return self.TE.cmpStrings( a.name, b.name )});
            //console.debug( families );
            plugins.fontfamily = {
                fontList: families
            };
            return plugins;
        },

        // set the focus
        focus(){
            self.$( '.trumbowyg-editor' ).focus();
        },

        // get/set the edit mode
        mode( mode=null ){
            if( mode ){
                if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
                    console.debug( 'pwix:editor teScriber mode() asked='+mode );
                }
                self.TE.mode_asked = mode;
                if( Editor.Modes.includes( mode )){
                    mode = self.TE.checkSwitch( mode );
                    const prev = self.TE.currentMode.get();
                    if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
                        console.debug( 'pwix:editor teScriber mode() previous was', prev );
                    }
                    if( prev !== mode ){
                        if( self.view.isRendered ){
                            self.$( '.teScriber' ).trigger( 'te-mode-changed', { prev: prev, new: mode });
                        }
                        self.TE.currentMode.set( mode );
                    } else if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
                        console.debug( 'pwix:editor teScriber mode() mode is unchanged' );
                    }
                } else {
                    console.error( 'pwix:editor teScriber: invalid edition mode', mode );
                }
            }
            return self.TE.currentMode.get();
        },

        // toggle the edit/preview buttons

        toggleOff(){
            self.$( '.te-btn' ).removeClass( 'active' ).prop( 'active', false ).prop( 'aria-pressed', false );
        },

        toggleOn( buttonSelector ){
            self.TE.toggleOff();
            self.$( buttonSelector ).addClass( 'active' ).prop( 'active', true ).prop( 'aria-pressed', true );
        }
    };

    self.autorun(() => {
        //console.debug( Template.currentData());
    });

    // see https://alex-d.github.io/Trumbowyg/documentation/#svg-icons
    //  actually explicitely load the icons on package startup
    //$.trumbowyg.svgPath = Editor._conf.svgPath;
    //$.trumbowyg.svgPath = '/packages/pwi_editor/icons.svg';
    //$.trumbowyg.svgPsvgAbsoluteUsePath = true;

    // parm
    //  content (ReactiveVar|null)
    self.autorun(() => {
        const content = Template.currentData().content;
        if( content ){
            self.TE.content = content;
            //console.log( 'parm autorun set content' );
        }
    });

    // parm
    //  mode, defaults to STANDARD
    self.autorun(() => {
        const mode = Template.currentData().mode;
        if( mode !== self.TE.mode_parm ){
            if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
                console.debug( 'pwix:editor teScriber currentData() asking mode='+mode );
            }
            self.TE.mode_parm = mode;
            self.TE.mode( mode );
        }
    });

    // parm
    //  document, defaults to ''
    self.autorun(() => {
        const name = Template.currentData().document;
        if( name ){
            self.TE.name = name;
        } else {
            self.TE.name = pwixI18n.label( I18N, 'unnamed' );
        }
        //console.log( 'parm autorun set name' );
    });

    // boolean parms
    self.autorun(() => {
        self.TE.argBool( 'displayName' );
        self.TE.argBool( 'withNamePanel' );
        self.TE.argBool( 'withHTMLBtn' );
        self.TE.argBool( 'withFullScreenBtn' );
    });

    // upload url for the images
    self.autorun(() => {
        self.TE.uploadUrl = Editor._conf.uploadUrl;
        if( Editor._conf.verbosity & Editor.C.Verbose.UPLOAD ){
            console.debug( 'pwix:editor teScriber uploadUrl', self.TE.uploadUrl );
        }
    });

    // follow the state of the teSwitch if it us used by the application
    //  we do not used here the switch state, but have to read it in order to be reactive when it changes
    self.autorun(() => {
        const _hasSwitch = Editor.switch.used.get();
        if( _hasSwitch ){
            const _state = Editor.switch.state.get();
            if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
                console.debug( 'pwix:editor teScriber auto follow teSwitch for', self.TE.mode_asked );
            }
            self.TE.mode( self.TE.mode_asked );
        }
    });

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS ){
        console.debug( 'pwix:editor teScriber onCreated()', self.TE.name );
    }
});

Template.teScriber.onRendered( function(){
    const self = this;

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS ){
        console.debug( 'pwix:editor teScriber onRendered()' );
    }

    // display the topmost panel
    if( self.TE.withNamePanel ){
        self.$( '.te-content-name' ).removeClass( 'te-hidden' );
    } else {
        self.$( '.te-content-name' ).addClass( 'te-hidden' );
    }

    // gathers the editor div
    self.TE.editorDiv = self.$( '.te-edit-content#'+self.TE.id );

    // honor the ask mode
    self.autorun(() => {
        const mode = self.TE.mode();
        if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
            console.debug( 'pwix:editor teScriber autorun() honoring', mode );
        }
        self.$( '.te-edit-container' ).removeClass().addClass( 'te-edit-container '+mode );
        switch( mode ){
            case Editor.C.Mode.HIDDEN:
                self.TE.editorDelete();
                break;
            case Editor.C.Mode.STANDARD:
                self.TE.editorDelete();
                self.TE.contentHtml();
                break;
            case Editor.C.Mode.PREVIEW:
                self.TE.editorDelete();
                self.TE.contentHtml();
                self.TE.toggleOn( '.te-view-btn' );
                break;
            case Editor.C.Mode.EDITION:
                self.TE.editorCreate();
                self.TE.toggleOn( '.te-edit-btn' );
                break;
        }
    });

});

Template.teScriber.helpers({
    // give the name of the object, provided by the caller or the default
    name(){
        const TE = Template.instance().TE;
        return TE.displayName ? TE.name : '';
    },
    // give an id to the div
    id(){
        return Template.instance().TE.id;
    }
});

Template.teScriber.events({

    // the Enter key in editor mode should be used to add a new line rather than submitting any form
    //  as we do not know how to provide the correct behavior without letting the event bubble up
    //  just provide a flag to say to Modal or others to not submit
    'keydown .te-edit-container.TE_MODE_EDITION'( event, instance ){
        if( event.keyCode === 13 ){
            // original event is shared among all event handlers
            event.originalEvent['pwix:modal'] = {
                submitable: false,
                origin: 'pwix:editor'
            };
        }
    },

    // change the edition mode
    'click .te-edit-btn'( event, instance ){
        instance.TE.mode( Editor.C.Mode.EDITION );
        // doesn't propagate the event
        return false;
    },

    'click .te-view-btn'( event, instance ){
        instance.TE.mode( Editor.C.Mode.PREVIEW );
        // doesn't propagate the event
        return false;
    },

    // keep the 'content' object up to date on each edition change
    'tbwchange .te-edit-content'( event, instance ){
        const editorInitialized = instance.TE.editorInitialized.get();
        const tbwchange_update = instance.TE.tbwchange_update;
        const tbwchange_sendmsg = instance.TE.tbwchange_sendmsg;
        if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
            console.debug( 'pwix:editor teScriber tbwchange editorInitialized='+editorInitialized, 'tbwchange_update='+tbwchange_update, 'tbwchange_sendmsg='+tbwchange_sendmsg );
        }
        if( editorInitialized ){
            const html = $( event.currentTarget ).trumbowyg( 'html' );
            if( html !== instance.TE.tbwchange_last ){
                // send a change message if allowed to
                if( tbwchange_sendmsg ){
                    let o = { html: html };
                    if( Template.currentData().name ){
                        o.name = Template.currentData().name;
                    }
                    instance.$( '.teScriber' ).trigger( 'te-content-changed', o );
                } else if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
                    console.debug( 'pwix:editor teScriber tbwchange tbwchange_sendmsg is false' );
                }
                // update the input/output ReactiveVar if allowed to
                if( tbwchange_update && instance.TE.content ){
                    instance.TE.content.set( html );
                } else if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
                    console.debug( 'pwix:editor teScriber tbwchange tbwchange_update is false' );
                }
                instance.TE.tbwchange_last = html;
            } else if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
                console.debug( 'pwix:editor teScriber tbwchange html is unchanged' );
            }
        }
    },

    // the editor is destroyed
    'tbwclose .te-edit-container'( event, instance ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
            console.debug( 'pwix:editor teScriber tbwclose' );
        }
    },

    // the editor is initialized
    'tbwinit .te-edit-content'( event, instance ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TRUMBOWYG ){
            console.debug( 'pwix:editor teScriber tbwinit' );
        }
        instance.TE.editorInitialized.set( true );
        instance.TE.focus();
        instance.$( '.teScriber' ).trigger( 'te-initialized' );
        // trumbowyg editor creates a textarea and set an height on it
        //  propagates this height to trumbowyg-box parent
        //const height = instance.$( '.teScriber textarea.trumbowyg-textarea' ).css( 'height' );
        //console.log( 'height', height );  // 1 px
        // set the editable content from the passed-in object
        //  do not do that during edition as this would be an infinite loop of reinit
        instance.TE.contentReset();
    },

    // html content has changed
    'te-content-changed .teScriber'( event, instance, data ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG ){
            console.debug( 'pwix:editor teScriber te-content-changed', data );
        }
    },

    // re-set the html content of the editing area
    'te-content-reset .teScriber'( event, instance ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG ){
            console.debug( 'pwix:editor teScriber te-content-reset' );
        }
        instance.TE.contentReset();
        return false;
    },

    // debug the te-initialized message
    //  let event bubble up
    'te-initialized .teScriber'( event, instance ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG ){
            console.debug( 'pwix:editor teScriber te-initialized' );
        }
    },

    // request to change the edition mode
    'te-mode-set .teScriber'( event, instance, data ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG ){
            console.debug( 'pwix:editor teScriber te-mode-set', data );
        }
        instance.TE.mode( data.mode );
        return false;
    },

    // the edition mode has changed
    //  let the event bubble up
    'te-mode-changed .teScriber'( event, instance, data ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG ){
            console.debug( 'pwix:editor teScriber te-mode-changed', data );
        }
    }
});

Template.teScriber.onDestroyed( function(){
    this.TE.editorDelete();

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS ){
        console.debug( 'pwix:editor teScriber onDestroyed()' );
    }
});
