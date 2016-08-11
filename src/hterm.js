// Copyright (c) 2012 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { Chrome, Local } from 'reterm-libdot/lib/storage';
import resource from 'reterm-libdot/lib/resource';

/**
 * The type of window hosting hterm.
 *
 * This is set as part of hterm.init().  The value is invalid until
 * initialization completes.
 */
export let windowType = null;

/**
 * Warning message to display in the terminal when browser zoom is enabled.
 *
 * You can replace it with your own localized message.
 */
export const zoomWarningMessage = 'ZOOM != 100%';

/**
 * Brief overlay message displayed when text is copied to the clipboard.
 *
 * By default it is the unicode BLACK SCISSORS character, but you can
 * replace it with your own localized message.
 *
 * This is only displayed when the 'enable-clipboard-notice' preference
 * is enabled.
 */
export const notifyCopyMessage = '\u2702';


/**
 * Text shown in a desktop notification for the terminal
 * bell.  \u226a is a unicode EIGHTH NOTE, %(title) will
 * be replaced by the terminal title.
 */
export const desktopNotificationTitle = '\u266A %(title) \u266A';

export const defaultStorage = new Local();

/**
 * Return decimal { width, height } for a given dom node.
 */
export const getClientSize = function(dom) {
  return dom.getBoundingClientRect();
};

/**
 * Return decimal width for a given dom node.
 */
export const getClientWidth = function(dom) {
  return dom.getBoundingClientRect().width;
};

/**
 * Return decimal height for a given dom node.
 */
export const getClientHeight = function(dom) {
  return dom.getBoundingClientRect().height;
};

/**
 * Copy the current selection to the system clipboard.
 *
 * @param {HTMLDocument} The document with the selection to copy.
 */
export const copySelectionToClipboard = function(document) {
  try {
    document.execCommand('copy');
  } catch (firefoxException) {
    // Ignore this. FF throws an exception if there was an error, even though
    // the spec says just return false.
  }
};

/**
 * Paste the system clipboard into the element with focus.
 *
 * @param {HTMLDocument} The document to paste into.
 */
export const pasteFromClipboard = function(document) {
  try {
    document.execCommand('paste');
  } catch (firefoxException) {
    // Ignore this. FF throws an exception if there was an error, even though
    // the spec says just return false.
  }
};

/**
 * The hterm init function, registered with lib.registerInit().
 *
 * This is called during lib.init().
 *
 * @param {function} onInit The function lib.init() wants us to invoke when
 *     initialization is complete.
 */
function onWindow(window) {
  windowType = window.type;
}

function onTab(tab) {
  if (tab && window.chrome) {
    chrome.windows.get(tab.windowId, null, onWindow);
  } else {
    // TODO(rginda): This is where we end up for a v1 app's background page.
    // Maybe windowType = 'none' would be more appropriate, or something.
    windowType = 'normal';
  }
}

// The chrome.tabs API is not supported in packaged apps, and detecting if
// you're a packaged app is a little awkward.
var isPackagedApp = false;
if (window.chrome && chrome.runtime && chrome.runtime.getManifest) {
  var manifest = chrome.runtime.getManifest();
  var isPackagedApp = manifest.app && manifest.app.background;
}

if (isPackagedApp) {
  // Packaged apps are never displayed in browser tabs.
  setTimeout(onWindow.bind(null, {type: 'popup'}), 0);
} else {
  if (window.chrome && chrome.tabs) {
    // The getCurrent method gets the tab that is "currently running", not the
    // topmost or focused tab.
    chrome.tabs.getCurrent(onTab);
  } else {
    setTimeout(onWindow.bind(null, {type: 'normal'}), 0);
  }
}
