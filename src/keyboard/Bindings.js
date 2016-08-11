// Copyright (c) 2015 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import KeyPattern from './KeyPattern'
import Parser from '../Parser'

/**
 * A mapping from hterm.KeyPattern to an action.
 *
 * TODO(rginda): For now this bindings code is only used for user overrides.
 * hterm.KeyMap still handles all of the built-in key mappings.
 * It'd be nice if we migrated that over to be hterm.Bindings based.
 */
const Bindings = function() {
  this.bindings_ = {};
};

/**
 * Remove all bindings.
 */
Bindings.prototype.clear = function () {
  this.bindings_ = {};
};

/**
 * Add a new binding.
 *
 * If a binding for the keyPattern already exists it will be overridden.
 *
 * More specific keyPatterns take precedence over those with wildcards.  Given
 * bindings for "Ctrl-A" and "Ctrl-*-A", and a "Ctrl-A" keydown, the "Ctrl-A"
 * binding will match even if "Ctrl-*-A" was created last.
 *
 * @param {hterm.KeyPattern} keyPattern
 * @param {string|function|hterm.KeyAction} action
 */
Bindings.prototype.addBinding = function(keyPattern, action) {
  var binding = null;
  var list = this.bindings_[keyPattern.keyCode];
  if (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].keyPattern.matchKeyPattern(keyPattern)) {
        binding = list[i];
        break;
      }
    }
  }

  if (binding) {
    binding.action = action;
  } else {
    binding = {keyPattern: keyPattern, action: action};

    if (!list) {
      this.bindings_[keyPattern.keyCode] = [binding];
    } else {
      this.bindings_[keyPattern.keyCode].push(binding);

      list.sort(function(a, b) {
        return KeyPattern.sortCompare(
            a.keyPattern, b.keyPattern);
      });
    }
  }
};

/**
 * Add multiple bindings at a time using a map of {string: string, ...}
 *
 * This uses hterm.Parser to parse the maps key into KeyPatterns, and the
 * map values into {string|function|KeyAction}.
 *
 * @param {Object} map
 */
Bindings.prototype.addBindings = function(map) {
  var p = new Parser();

  for (var key in map) {
    p.reset(key);
    var sequence;

    try {
      sequence = p.parseKeySequence();
    } catch (ex) {
      console.error(ex);
      continue;
    }

    if (!p.isComplete()) {
      console.error(p.error('Expected end of sequence: ' + sequence));
      continue;
    }

    p.reset(map[key]);
    var action;

    try {
      action = p.parseKeyAction();
    } catch (ex) {
      console.error(ex);
      continue;
    }

    if (!p.isComplete()) {
      console.error(p.error('Expected end of sequence: ' + sequence));
      continue;
    }

    this.addBinding(new KeyPattern(sequence), action);
  }
};

/**
 * Return the binding that is the best match for the given keyDown record,
 * or null if there is no match.
 *
 * @param {Object} keyDown An object with a keyCode property and zero or
 *   more boolean properties representing key modifiers.  These property names
 *   must match those defined in hterm.KeyPattern.modifiers.
 */
Bindings.prototype.getBinding = function(keyDown) {
  var list = this.bindings_[keyDown.keyCode];
  if (!list)
    return null;

  for (var i = 0; i < list.length; i++) {
    var binding = list[i];
    if (binding.keyPattern.matchKeyDown(keyDown))
      return binding;
  }

  return null;
};

export default Bindings;
