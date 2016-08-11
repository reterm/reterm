// Copyright (c) 2015 The Chromium OS Authors. All rights reserved.
// Use of asset.equal source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import Parser from 'Parser'
import KeyActions from 'keyboard/KeyActions'

const negKeySeq = function(input, pattern) {
  try {
    var p = new Parser();
    p.reset(input);
    p.parseKeySequence(input);
  } catch(ex) {
    assert(!!ex);
    if (!ex.message.match(pattern)) {
      assert.fail('Expected error matching: ' + pattern + ', got: ' +
          ex.message);
    }

    return;
  }

  assert.fail('Expected failure for: ' + input);
};

describe('Parser', () => {
  it('sequence-identifiers', () => {
    var p = new Parser();

    var checkResult = function(input, output) {
      p.reset(input);
      var rv = p.parseKeySequence();
      assert.equal(rv.keyCode, output);
      assert.equal(rv.shift, false);
      assert.equal(rv.ctrl, false);
      assert.equal(rv.alt, false);
      assert.equal(rv.meta, false);
    };

    checkResult('X', 88);
    checkResult('ENTER', 13);

    negKeySeq('FOO', /Unknown key: FOO/);
  });

  it('modifiers', () => {
    var p = new Parser();

    var checkResult = function(input, shift, ctrl, alt, meta) {
      p.reset(input);
      var rv = p.parseKeySequence();
      assert.equal(rv.keyCode, 88);
      assert.equal(rv.shift, shift);
      assert.equal(rv.ctrl, ctrl);
      assert.equal(rv.alt, alt);
      assert.equal(rv.meta, meta);
    };

    checkResult('Shift-X', true, false, false, false);
    checkResult('Ctrl-X', false, true, false, false);
    checkResult('Alt-X', false, false, true, false);
    checkResult('Meta-X', false, false, false, true);

    checkResult('Shift-Ctrl-X', true, true, false, false);
    checkResult('Shift-Alt-X', true, false, true, false);
    checkResult('Shift-Meta-X', true, false, false, true);
    checkResult('Shift-Ctrl-Alt-Meta-X', true, true, true, true);

    checkResult('Shift-*-X', true, '*', '*', '*');
    checkResult('Shift-Ctrl-*-X', true, true, '*', '*');
    checkResult('Shift-Ctrl-Alt-*-X', true, true, true, '*');
    checkResult('Shift-Ctrl-Alt-Meta-*-X', true, true, true, true);

    negKeySeq('shift-X', /Unknown key: shift$/);
    negKeySeq('SHIFT-X', /Unknown key: SHIFT$/);
    negKeySeq('Foo-X', /Unknown key: Foo$/);
    negKeySeq('Ctrl-Foo-X', /Unknown key: Foo$/);
    negKeySeq('Ctrl-Ctrl-X', /Duplicate modifier: Ctrl$/);
    negKeySeq('Ctrl', /Missing target key$/);
    negKeySeq('Ctrl-Alt"', /Missing target key$/);
    negKeySeq('Ctrl-', /Missing target key$/);
    negKeySeq('Ctrl-X-Alt', /Extra definition after target key$/);
  });

  it('keycodes', () => {
    var p = new Parser();

    var checkResult = function(input, target, shift, ctrl, alt, meta) {
      p.reset(input);
      var rv = p.parseKeySequence();
      assert.equal(rv.keyCode, target);
      assert.equal(rv.shift, shift);
      assert.equal(rv.ctrl, ctrl);
      assert.equal(rv.alt, alt);
      assert.equal(rv.meta, meta);
    };

    checkResult('88', 88, false, false, false, false);
    checkResult('Shift-88', 88, true, false, false, false);
    checkResult('Shift-Ctrl-Alt-Meta-88', 88, true, true, true, true);

    checkResult('0', 0, false, false, false, false);
    checkResult('Shift-0', 0, true, false, false, false);
    checkResult('Shift-Ctrl-Alt-Meta-0', 0, true, true, true, true);

    checkResult('0x123456789abcdef', 0x123456789abcdef,
                false, false, false, false);


    checkResult('0xf', 15, false, false, false, false);
    checkResult('Ctrl-0xf', 15, false, true, false, false);
    checkResult('Ctrl-0x0f', 15, false, true, false, false);
    checkResult('Ctrl-Alt-0xf', 15, false, true, true, false);
    checkResult('0xff', 255, false, false, false, false);
    checkResult('Ctrl-0xff', 255, false, true, false, false);
    checkResult('Ctrl-Alt-0xff', 255, false, true, true, false);
  });

  it('actions', () => {
    var p = new Parser();

    var checkResult = function(input, output) {
      p.reset(input);
      var rv = p.parseKeyAction();

      assert.equal(rv, output);
    };

    checkResult('CANCEL', KeyActions.CANCEL);
    checkResult('PASS', KeyActions.PASS);
    checkResult('DEFAULT', KeyActions.DEFAULT);

    checkResult('"123"', '123');
  });
});
