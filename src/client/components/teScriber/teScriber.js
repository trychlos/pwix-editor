/*
 * pwix:editor/src/client/components/teScriber/teScriber.js
 *
 * Edition mode can be set or modified by:
 * 
 * - the 'mode' argument passed in by the caller (parent) component
 * - clicking on 'view'/'edit' buttons
 * - switching the 'Edit' toggle switch
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import { v4 as uuidv4 } from 'uuid';

import 'jquery-resizable-dom/dist/jquery-resizable.min.js';

import 'trumbowyg/dist/ui/trumbowyg.min.css';
//import 'trumbowyg/dist/trumbowyg.min.js';
import 'trumbowyg/dist/trumbowyg.js'; // keep this modified version until https://github.com/Alex-D/Trumbowyg/issues/1396 is fixed

import 'trumbowyg/plugins/colors/trumbowyg.colors.js';
import 'trumbowyg/plugins/emoji/trumbowyg.emoji.js';
import 'trumbowyg/plugins/fontfamily/trumbowyg.fontfamily.js';
import 'trumbowyg/plugins/fontsize/trumbowyg.fontsize.js';
import 'trumbowyg/plugins/history/trumbowyg.history.js';
import 'trumbowyg/plugins/pasteimage/trumbowyg.pasteimage.js';
import 'trumbowyg/plugins/resizimg/trumbowyg.resizimg.js';
import 'trumbowyg/plugins/upload/trumbowyg.upload.js';

import '../../../common/js/index.js';

import './teScriber.html';
import './teScriber.less';

Template.teScriber.onCreated( function(){
    const self = this;

    self.TE = {
        // the parms
        content: null,
        name: '',
        currentMode: new ReactiveVar( TE_MODE_STANDARD ),
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
            const _hasSwitch = teEditor.switch.used.get();
            let _switchState;
            if( _hasSwitch ){
                _switchState = teEditor.switch.state.get();
                if( !_switchState ){
                    switch( mode ){
                        case TE_MODE_PREVIEW:
                        case TE_MODE_EDITION:
                            mode =  TE_MODE_STANDARD;
                            self.TE.mode_asked = TE_MODE_PREVIEW;
                            break;
                    }
                }

            }
            if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
                console.debug( 'pwix:editor teScriber checkSwitch() asked='+_input, 'switchExists='+ _hasSwitch, 'switchState='+_switchState, 'returning', mode );
            }
            return mode;
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
                ['fontsize'],
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
                if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
                    console.debug( 'pwi:editor teScriber editorCreate() instanciating...' );
                }
                self.TE.editorDiv.trumbowyg({
                    btnsDef: self.TE.editorBtnsDef(),
                    btns: self.TE.editorButtons(),
                    plugins: self.TE.editorPlugins(),
                    semantic: {
                        'div': 'div'
                    }
                });
            }
        },

        // delete the Trumbowyg edtor (quitting the EDITION mode)
        editorDelete(){
            if( self.TE.editorInitialized.get()){
                if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
                    console.debug( 'pwix:editor teScriber editorDelete() destroying instance' );
                }
                const res = self.TE.editorDiv.trumbowyg( 'destroy' );
                //console.log( 'destroy='+res );
                self.TE.editorInitialized.set( false );
            }
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
            return plugins;
        },

        // set the focus
        focus(){
            self.$( '.trumbowyg-editor' ).focus();
        },

        // get/set the edit mode
        mode( mode=null ){
            if( mode ){
                if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
                    console.debug( 'pwix:editor teScriber mode() asked='+mode );
                }
                self.TE.mode_asked = mode;
                if( teEditor.Modes.includes( mode )){
                    mode = self.TE.checkSwitch( mode );
                    const prev = self.TE.currentMode.get();
                    if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
                        console.debug( 'pwix:editor teScriber mode() previous was', prev );
                    }
                    if( prev !== mode ){
                        if( self.view.isRendered ){
                            self.$( '.teScriber' ).trigger( 'te-mode-changed', { prev: prev, new: mode });
                        }
                        self.TE.currentMode.set( mode );
                    } else if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
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

    // see https://alex-d.github.io/Trumbowyg/documentation/#svg-icons
    //  actually explicitely load the icons on package startup
    //$.trumbowyg.svgPath = teEditor.conf.svgPath;
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
            if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
                console.debug( 'pwix:editor teScriber currentData() asking mode='+mode );
            }
            self.TE.mode_parm = mode;
            self.TE.mode( mode );
        }
    });

    // parm
    //  name, defaults to ''
    self.autorun(() => {
        const name = Template.currentData().name;
        if( name ){
            self.TE.name = name;
        } else {
            self.TE.name = i18n.label( teEditor.i18n, 'unnamed' );
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
        self.TE.uploadUrl = teEditor.conf.uploadUrl;
        if( teEditor.conf.verbosity & TE_VERBOSE_UPLOAD ){
            console.debug( 'pwix:editor teScriber uploadUrl', self.TE.uploadUrl );
        }
    });

    // follow the state of the teSwitch if it us used by the application
    //  we do not used here the switch state, but have to read it in order to be reactive when it changes
    self.autorun(() => {
        const _hasSwitch = teEditor.switch.used.get();
        if( _hasSwitch ){
            const _state = teEditor.switch.state.get();
            if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
                console.debug( 'pwix:editor teScriber auto follow teSwitch for', self.TE.mode_asked );
            }
            self.TE.mode( self.TE.mode_asked );
        }
    });

    // be verbose
    if( teEditor.conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teScriber onCreated()', self.TE.name );
    }
});

Template.teScriber.onRendered( function(){
    const self = this;

    // be verbose
    if( teEditor.conf.verbosity & TE_VERBOSE_COMPONENTS ){
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
        if( teEditor.conf.verbosity & TE_VERBOSE_MODE ){
            console.debug( 'pwix:editor teScriber autorun() honoring', mode );
        }
        self.$( '.te-edit-container' ).removeClass().addClass( 'te-edit-container '+mode );
        switch( mode ){
            case TE_MODE_HIDDEN:
                self.TE.editorDelete();
                break;
            case TE_MODE_STANDARD:
                self.TE.editorDelete();
                self.TE.contentHtml();
                break;
            case TE_MODE_PREVIEW:
                self.TE.editorDelete();
                self.TE.contentHtml();
                self.TE.toggleOn( '.te-view-btn' );
                break;
            case TE_MODE_EDITION:
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
    // change the edition mode
    'click .te-edit-btn'( event, instance ){
        instance.TE.mode( TE_MODE_EDITION );
        // doesn't propagate the event
        return false;
    },

    'click .te-view-btn'( event, instance ){
        instance.TE.mode( TE_MODE_PREVIEW );
        // doesn't propagate the event
        return false;
    },

    // keep the 'content' object up to date on each edition change
    'tbwchange .te-edit-content'( event, instance ){
        const editorInitialized = instance.TE.editorInitialized.get();
        const tbwchange_update = instance.TE.tbwchange_update;
        const tbwchange_sendmsg = instance.TE.tbwchange_sendmsg;
        if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
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
                } else if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
                    console.debug( 'pwix:editor teScriber tbwchange tbwchange_sendmsg is false' );
                }
                // update the input/output ReactiveVar if allowed to
                if( tbwchange_update && instance.TE.content ){
                    instance.TE.content.set( html );
                } else if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
                    console.debug( 'pwix:editor teScriber tbwchange tbwchange_update is false' );
                }
                instance.TE.tbwchange_last = html;
            } else if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
                console.debug( 'pwix:editor teScriber tbwchange html is unchanged' );
            }
        }
    },

    // the editor is destroyed
    'tbwclose .te-edit-content'( event, instance ){
        if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
            console.debug( 'pwix:editor teScriber tbwclose' );
        }
    },

    // the editor is initialized
    'tbwinit .te-edit-content'( event, instance ){
        if( teEditor.conf.verbosity & TE_VERBOSE_TRUMBOWYG ){
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
        if( teEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'pwix:editor teScriber te-content-changed', data );
        }
    },

    // re-set the html content of the editing area
    'te-content-reset .teScriber'( event, instance ){
        if( teEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'pwix:editor teScriber te-content-reset' );
        }
        instance.TE.contentReset();
        return false;
    },

    // debug the te-initialized message
    //  let event bubble up
    'te-initialized .teScriber'( event, instance ){
        if( teEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'pwix:editor teScriber te-initialized' );
        }
    },

    // request to change the edition mode
    'te-mode-set .teScriber'( event, instance, data ){
        if( teEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'pwix:editor teScriber te-mode-set', data );
        }
        instance.TE.mode( data.mode );
        return false;
    },

    // the edition mode has changed
    //  let the event bubble up
    'te-mode-changed .teScriber'( event, instance, data ){
        if( teEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'pwix:editor teScriber te-mode-changed', data );
        }
    }
});

Template.teScriber.onDestroyed( function(){
    this.TE.editorDelete();

    // be verbose
    if( teEditor.conf.verbosity & TE_VERBOSE_COMPONENTS ){
        console.debug( 'pwix:editor teScriber onDestroyed()' );
    }
});
