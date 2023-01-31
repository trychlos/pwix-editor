# pwix:editor

This is an encapsulation of 'trumbowyg' Javascript editor for Meteor, so a client-only package.

## A bit of taxonomy

### Documents

`pwix:editor` talks a lot of _documents_ though, actually, `pwix:editor` doesn't know anything about them.
But it expects that these unknown and unmanaged _documents_ have two main properties:

- a HTML content, says _document's content_ here
- a name which identifies the document, says _document's name_ here.

### Edition mode

`pwix:editor` is able to manage four edition modes:

- TE_MODE_HIDDEN

    Build the component, but do not display in the DOM.

- TE_MODE_STANDARD

    The document's content is displayed as standard HTML: this is the default startup mode.<br />
    In this mode, all the document's content is just displayed as if they were no editor at all.
    This way, you can safely directly integrates `teEditor` in your pages without your standard user is not conscious of anything.

- TE_MODE_PREVIEW

    The document's content is displayed inside of a thin panel.<br />
    The header of this panel displays the document's name, along with two 'Preview' and 'Edit' buttons.
    The document's content is displayed as standard HTML.

- TE_MODE_EDITION

    This mode is an extension of the TE_MODE_PREVIEW, where the user is able to actually edit the document's content.
    A buttons panel with different edition options (font size, color, etc.) along with a WYSIWYG HTML editor is available.

## Configuration

The package can be configured by calling `pwiEditor.configure()` function, with just a single object as parameters, which should only contains the options you want override.

Known configuration options are:

- uploadUrl

    The URL to which the images should be uploaded.<br />
    No default.

- verbosity

    Define the expected verbosity level.

    The accepted value can be any or-ed combination of following:

    - TE_VERBOSE_NONE

        Do not display anything to the console

    - TE_VERBOSE_TBWMSG

        Trace 'tbwxxx' messages

    - TE_VERBOSE_TEMSG

        Trace 'te-xxx' messages

    - TE_VERBOSE_CREDEL

        Trace creation and deletion functions

    - TE_VERBOSE_UPLOAD

        Trace upload configuration and operations


## Provides

### Global object

`pwiEditor`

### Exported constants

- TE_MODE_HIDDEN
- TE_MODE_STANDARD
- TE_MODE_PREVIEW
- TE_MODE_EDITOR

### `teEditor` component

The editor component itself.

#### Parameters

If the package doesn't manage any configuration, this component does. And it does reactively. Accepted parameters are:

- content

    Opt.<br />
    An input/output ReactiveVar which is expected to contain the ... document's content (by the way), interpreted as a HTML string.<br />
    It not provided, the component just displays an empty editing area.

- mode

    Opt.<br />
    The edition mode as a string.<br />
    Defaults to TE_MODE_STANDARD.

- name

    Opt. <br />
    The document's name as a string.<br />
    Defaults to the empty string.

- withNamePanel

    Opt.<br />
    Whether to display the topmost panel, which would include the document's name and the preview/edit buttons.<br />
    Defaults to true.

- withHTMLBtn

    Opt.<br />
    Whether to authorize the HTML button, which should be reserved to advanced users.<br />
    Defaults to true.

- withFullScreenBtn

    Opt.<br />
    Whether to authorize the FullScreen button, which should be reserved to edit full articles.<br />
    Defaults to true.

The `teEditor` component doesn't provide any save way. Instead, it provides two ways for the caller be informed of the changes:
- the 'content' ReactiveVar is continuously updated,
- a `te-content-changed` message is sent on the component at each change.

#### Informational messages

Informational messages are sent by the component on itself. The caller can take advantage of them to be kept informed about the various changes.

- te-mode-changed

    Triggered on the `teEditor` element when the edition mode changes<br />
    Provides an object `{ prev: <previous_mode>, new: <new_mode> }`

- te-content-changed

    Triggered on the `teEditor` element when the content has been changed (EDITION mode)
    Provides an object `{ html: <html> }`

- te-initialized

    Triggered on the `teEditor` element when the editor has been initialized (EDITION/PREVIEW mode)

#### Action messages

Action messages are the way the caller can interact with the component during its lifetime. They must be sent to the `teEditor` component.

- te-content-reset

    Force the editor to take into account the current 'content'.<br />
    May be useful when the caller has to cancel the done edition, and restore a previous value.<br />
    The 'te-content-changed' message is not sent when this action is requested.

- te-mode-set

    Change the mode to the specified one<br />
    Expects an object `{ mode: <mode> }`.

---
P. Wieser
- Last updated on 2023, Jan. 31st
