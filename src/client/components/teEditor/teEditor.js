/*
 * pwix:editor/src/client/components/teEditor/teEditor.js
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import { v4 as uuidv4 } from 'uuid';

import 'jquery-resizable-dom/dist/jquery-resizable.min.js';

import 'trumbowyg/dist/ui/trumbowyg.min.css';
import 'trumbowyg/dist/trumbowyg.min.js';

import 'trumbowyg/plugins/colors/trumbowyg.colors.js';
import 'trumbowyg/plugins/emoji/trumbowyg.emoji.js';
import 'trumbowyg/plugins/fontfamily/trumbowyg.fontfamily.js';
import 'trumbowyg/plugins/fontsize/trumbowyg.fontsize.js';
import 'trumbowyg/plugins/history/trumbowyg.history.js';
import 'trumbowyg/plugins/pasteimage/trumbowyg.pasteimage.js';
import 'trumbowyg/plugins/resizimg/trumbowyg.resizimg.js';
import 'trumbowyg/plugins/upload/trumbowyg.upload.js';

import '../../../common/js/index.js';

import './teEditor.html';
import './teEditor.less';

Template.teEditor.onCreated( function(){
    const self = this;

    self.TE = {
        // the parms
        content: null,
        name: '',
        currentMode: new ReactiveVar( TE_MODE_STANDARD ),
        withNamePanel: true,
        withHTMLBtn: true,
        withFullScreenBtn: true,

        // the interval vars
        editorInitialized: new ReactiveVar( false ),
        id: uuidv4(),
        uploadUrl: null,
        mode_parm: null,

        // re-set the html content of the editing area on mode change
        //  + try to minimize the tbwchange message effects when the editing area is changed here
        tbwchange_update: true,
        tbwchange_sendmsg: true,
        tbwchange_last: null,

        contentHtml(){
            if( self.view.isRendered && !self.TE.editorInitialized.get()){
                self.$( '.te-edit-content#'+self.TE.id ).html( self.TE.content.get());
            }
        },

        contentReset(){
            if( self.view.isRendered && self.TE.editorInitialized.get()){
                self.TE.tbwchange_update = false;
                if( self.TE.content ){
                    self.$( '.te-edit-content#'+self.TE.id ).trumbowyg( 'html', self.TE.content.get());
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

        // create the Trumbowyg editor (starting the EDITION mode)
        //  this code run the creation; the initialization itself is made on tbwinit message
        editorCreate(){
            if( self.view.isRendered && !self.TE.editorInitialized.get()){
                if( pwiEditor.conf.verbosity & TE_VERBOSE_CREDEL ){
                    console.debug( 'editorCreate() instanciating a new editor' );
                }
                self.$( '.te-edit-content#'+self.TE.id ).trumbowyg({
                    btnsDef: self.TE.editorBtnsDef(),
                    btns: self.TE.editorButtons(),
                    plugins: self.TE.editorPlugins()
                });
            }
        },

        // delete the Trumbowyg edtor (quitting the EDITION mode)
        editorDelete(){
            if( self.TE.editorInitialized.get()){
                if( pwiEditor.conf.verbosity & TE_VERBOSE_CREDEL ){
                    console.debug( 'editorDelete() destroying instance' );
                }
                const res = self.$( '.te-edit-content#'+self.TE.id ).trumbowyg( 'destroy' );
                console.log( 'destroy='+res );
                // may happen that the encapsulating 'trumbowyg-box' div be correctly detached, but not removed :(
                    /*
                if( !res ){
                    let $div = self.$( '.te-edit-content#'+self.TE.id ).prev( '.trumbowyg-box' );
                    if( $div ){
                        $div.remove();
                    }
                }
                */
                self.TE.editorInitialized.set( false );
            }
        },

        // set the focus
        focus(){
            self.$( '.trumbowyg-editor' ).focus();
        },

        // get/set the edit mode
        mode( mode=null ){
            if( mode ){
                if( pwiEditor.Modes.includes( mode )){
                    const prev = self.TE.currentMode.get();
                    if( prev !== mode ){
                        if( self.view.isRendered ){
                            self.$( '.teEditor' ).trigger( 'te-mode-changed', { prev: prev, new: mode });
                        }
                        self.TE.currentMode.set( mode );
                    }
                } else {
                    console.error( 'teEditor: invalid edition mode', mode );
                }
            }
            //console.log( 'mode returns', self.TE.currentMode.get());
            return self.TE.currentMode.get();
        },

        // toggle the edit/preview buttons
        toggle( event ){
            self.TE.toggleOff();
            self.TE.toggleOn( $( event.currentTarget ))
        },

        toggleOff(){
            self.$( '.te-btn' ).removeClass( 'active' ).prop( 'active', false ).prop( 'aria-pressed', false );
        },

        toggleOn( buttonSelector ){
            self.$( buttonSelector ).addClass( 'active' ).prop( 'active', true ).prop( 'aria-pressed', true );
        }
    };

    // see https://alex-d.github.io/Trumbowyg/documentation/#svg-icons
    //  actually explicitely load the icons on package startup
    //$.trumbowyg.svgPath = pwiEditor.conf.svgPath;
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
            self.TE.mode( mode );
            self.TE.mode_parm = mode;
            //console.log( 'parm autorun set mode' );
        }
    });

    // parm
    //  name, defaults to ''
    self.autorun(() => {
        const name = Template.currentData().name;
        if( name ){
            self.TE.name = name;
        } else {
            self.TE.name = i18n.label( pwiEditor.i18n, 'unnamed' );
        }
        //console.log( 'parm autorun set name' );
    });

    // parm
    //  withNamePanel, defaults to true
    self.autorun(() => {
        const data = Template.currentData();
        if( Object.keys( data ).includes( 'withNamePanel' ) && ( data.withNamePanel === true || data.withNamePanel === false )){
            self.TE.withNamePanel = data.withNamePanel;
        }
    });

    // parm
    //  withHTMLBtn, defaults to true
    self.autorun(() => {
        const data = Template.currentData();
        if( Object.keys( data ).includes( 'withHTMLBtn' ) && ( data.withHTMLBtn === true || data.withHTMLBtn === false )){
            self.TE.withHTMLBtn = data.withHTMLBtn;
        }
    });

    // parm
    //  withFullScreenBtn, defaults to true
    self.autorun(() => {
        const data = Template.currentData();
        if( Object.keys( data ).includes( 'withFullScreenBtn' ) && ( data.withFullScreenBtn === true || data.withFullScreenBtn === false )){
            self.TE.withFullScreenBtn = data.withFullScreenBtn;
        }
    });

    // upload url for the images
    self.autorun(() => {
        self.TE.uploadUrl = pwiEditor.conf.uploadUrl;
        if( pwiEditor.conf.verbosity & TE_VERBOSE_UPLOAD ){
            console.debug( 'uploadUrl', self.TE.uploadUrl );
        }
    });
});

Template.teEditor.onRendered( function(){
    const self = this;

    // display the topmost panel
    if( self.TE.withNamePanel ){
        self.$( '.te-content-name' ).removeClass( 'te-hidden' );
    } else {
        self.$( '.te-content-name' ).addClass( 'te-hidden' );
    }

    // honor the ask mode
    self.autorun(() => {
        const mode = self.TE.mode();
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

Template.teEditor.helpers({
    // give the name of the object, provided by the caller or the default
    name(){
        return Template.instance().TE.name || '';
    },
    // give an id to the div
    id(){
        return Template.instance().TE.id;
    }
});

Template.teEditor.events({
    // change the edition mode
    'click .te-edit-btn'( event, instance ){
        instance.TE.toggle( event );
        instance.TE.mode( TE_MODE_EDITION );
        // doesn't propagate the event
        return false;
    },

    'click .te-view-btn'( event, instance ){
        instance.TE.toggle( event );
        instance.TE.mode( TE_MODE_PREVIEW );
        // doesn't propagate the event
        return false;
    },

    // keep the 'content' object up to date on each edition change
    'tbwchange .te-edit-content'( event, instance ){
        const editorInitialized = instance.TE.editorInitialized.get();
        const tbwchange_update = instance.TE.tbwchange_update;
        const tbwchange_sendmsg = instance.TE.tbwchange_sendmsg;
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TBWMSG ){
            console.debug( 'tbwchange editorInitialized='+editorInitialized, 'tbwchange_update='+tbwchange_update, 'tbwchange_sendmsg='+tbwchange_sendmsg );
        }
        if( editorInitialized ){
            const html = $( event.currentTarget ).trumbowyg( 'html' );
            if( html !== instance.TE.tbwchange_last ){
                // send a change message if allowed to
                if( tbwchange_sendmsg ){
                    instance.$( '.teEditor' ).trigger( 'te-content-changed', { html: html });
                } else if( pwiEditor.conf.verbosity & TE_VERBOSE_TBWMSG ){
                    console.debug( 'tbwchange tbwchange_sendmsg is false' );
                }
                // update the input/output ReactiveVar if allowed to
                if( tbwchange_update && instance.TE.content ){
                    instance.TE.content.set( html );
                } else if( pwiEditor.conf.verbosity & TE_VERBOSE_TBWMSG ){
                    console.debug( 'tbwchange tbwchange_update is false' );
                }
                instance.TE.tbwchange_last = html;
            } else if( pwiEditor.conf.verbosity & TE_VERBOSE_TBWMSG ){
                console.debug( 'tbwchange html is unchanged' );
            }
        }
    },

    // the editor is destroyed
    'tbwclose .te-edit-content'( event, instance ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TBWMSG ){
            console.debug( 'tbwclose' );
        }
    },

    // the editor is initialized
    'tbwinit .te-edit-content'( event, instance ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TBWMSG ){
            console.debug( 'tbwinit' );
        }
        instance.TE.editorInitialized.set( true );
        instance.TE.focus();
        instance.$( '.teEditor' ).trigger( 'te-initialized' );
        // set the editable content from the passed-in object
        //  do not do that during edition as this would be an infinite loop of reinit
        instance.TE.contentReset();
    },

    // html content has changed
    'te-content-changed .teEditor'( event, instance, data ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.log( 'te-content-changed', data );
        }
    },

    // re-set the html content of the editing area
    'te-content-reset .teEditor'( event, instance ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.log( 'te-content-reset' );
        }
        instance.TE.contentReset();
        return false;
    },

    // debug the te-initialized message
    //  let event bubble up
    'te-initialized .teEditor'( event, instance ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'te-initialized' );
        }
    },

    // request to change the edition mode
    'te-mode-set .teEditor'( event, instance, data ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'te-mode-set', data );
        }
        instance.TE.mode( data.mode );
        return false;
    },

    // the edition mode has changed
    //  let the event bubble up
    'te-mode-changed .teEditor'( event, instance, data ){
        if( pwiEditor.conf.verbosity & TE_VERBOSE_TEMSG ){
            console.debug( 'te-mode-changed', data );
        }
    }
});

Template.teEditor.onDestroyed( function(){
    this.TE.editorDelete();
});
