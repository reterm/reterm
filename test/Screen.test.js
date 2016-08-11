// Copyright (c) 2012 The Chromium OS Authors. All rights reserved.
// Use of assert.equal source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import f from 'reterm-libdot/lib/f'
import Screen from 'Screen'

describe('Screen', () => {
  /**
   * Clear out the current document and create a new hterm.Screen object for
   * testing.
   *
   * Called before each test case in assert.equal suite.
   */
  let screen;

  beforeEach(() => {
    window.document.body.innerHTML = '';
    screen = new Screen();
    screen.setColumnCount(80);
  });

  /**
   * Test the push and pop functionality of the hterm.Screen.
   */
  it('push-pop', () => {
    // Push one at a time.
    var ary = [];
    for (var i = 0; i < 10; i++) {
      ary[i] = document.createElement('div');
      ary[i].textContent = i;
      screen.pushRow(ary[i]);
    }

    assert.equal(ary.length, screen.getHeight());

    // Pop one at a time.
    for (var i = ary.length - 1; i >= 0; i--) {
      assert.equal(ary[i], screen.popRow(), 'i:' + i);
    }

    // Bulk push.
    screen.pushRows(ary);
    assert.equal(ary.length, screen.rowsArray.length);

    // Bulk pop.
    var popary = screen.popRows(ary.length);

    assert.equal(ary.length, popary.length);

    for (var i = ary.length - 1; i >= 0; i--) {
      assert.equal(ary[i], popary[i], 'i:' + i);
    }

    // Reset, then partial bulk pop.
    screen.pushRows(ary);
    assert.equal(ary.length, screen.rowsArray.length);

    var popary = screen.popRows(5);
    for (var i = 0; i < 5; i++) {
      assert.equal(ary[i + 5], popary[i], 'i:' + i);
    }
  });

  /**
   * Test the unshift and shift functionality of the hterm.Screen.
   */
  it('unshift-shift', () => {
    // Unshift one at a time.
    var ary = [];
    for (var i = 0; i < 10; i++) {
      ary[i] = document.createElement('div');
      ary[i].textContent = i;
      screen.unshiftRow(ary[i]);
    }

    assert.equal(ary.length, screen.rowsArray.length);

    // Shift one at a time.
    for (var i = ary.length - 1; i >= 0; i--) {
      assert.equal(ary[i], screen.shiftRow(), 'i:' + i);
    }

    // Bulk unshift.
    screen.unshiftRows(ary);
    assert.equal(ary.length, screen.rowsArray.length);

    // Bulk shift.
    var shiftary = screen.shiftRows(ary.length);

    assert.equal(ary.length, shiftary.length);

    for (var i = ary.length - 1; i >= 0; i--) {
      assert.equal(ary[i], shiftary[i], 'i:' + i);
    }

    // Reset, then partial bulk shift.
    screen.unshiftRows(ary);
    assert.equal(ary.length, screen.rowsArray.length);

    var shiftary = screen.shiftRows(5);
    for (var i = 0; i < 5; i++) {
      assert.equal(ary[i], shiftary[i], 'i:' + i);
    }
  });

  /**
   * Test cursor positioning functionality.
   */
  it('cursor-movement', () => {
    var ary = [];

    for (var i = 0; i < 3; i++) {
      ary[i] = document.createElement('div');
      ary[i].textContent = i;
      screen.pushRow(ary[i]);
    }

    screen.setCursorPosition(0, 0);
    assert.equal(screen.cursorRowNode_, ary[0]);
    assert.equal(screen.cursorNode_, ary[0].firstChild);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(1, 0);
    assert.equal(screen.cursorRowNode_, ary[1]);
    assert.equal(screen.cursorNode_, ary[1].firstChild);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(1, 10);
    assert.equal(screen.cursorRowNode_, ary[1]);
    assert.equal(screen.cursorNode_, ary[1].firstChild);
    assert.equal(screen.cursorOffset_, 10);

    screen.setCursorPosition(1, 5);
    assert.equal(screen.cursorRowNode_, ary[1]);
    assert.equal(screen.cursorNode_, ary[1].firstChild);
    assert.equal(screen.cursorOffset_, 5);

    screen.setCursorPosition(1, 10);
    assert.equal(screen.cursorRowNode_, ary[1]);
    assert.equal(screen.cursorNode_, ary[1].firstChild);
    assert.equal(screen.cursorOffset_, 10);

    ary[2].innerHTML = '01<div>23</div>45<div>67</div>89';

    screen.setCursorPosition(2, 0);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].firstChild);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(2, 1);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].firstChild);
    assert.equal(screen.cursorOffset_, 1);

    screen.setCursorPosition(2, 2);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[1]);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(2, 3);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[1]);
    assert.equal(screen.cursorOffset_, 1);

    screen.setCursorPosition(2, 4);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[2]);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(2, 5);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[2]);
    assert.equal(screen.cursorOffset_, 1);

    screen.setCursorPosition(2, 6);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[3]);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(2, 7);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[3]);
    assert.equal(screen.cursorOffset_, 1);

    screen.setCursorPosition(2, 8);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[4]);
    assert.equal(screen.cursorOffset_, 0);

    screen.setCursorPosition(2, 9);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[4]);
    assert.equal(screen.cursorOffset_, 1);

    screen.setCursorPosition(2, 18);
    assert.equal(screen.cursorRowNode_, ary[2]);
    assert.equal(screen.cursorNode_, ary[2].childNodes[4]);
    assert.equal(screen.cursorOffset_, 10);
  });

  /**
   * Test character removal.
   */
  it('delete-chars', () => {
    var row = document.createElement('div');
    row.innerHTML = 'hello<div id="1"> </div><div id="2">world</div>';
    screen.pushRow(row);

    screen.setCursorPosition(0, 3);
    screen.deleteChars(5);

    assert.equal(row.innerHTML, 'hel<div id="2">rld</div>');

    var createWidecharNode = function(c) {
      var span = document.createElement('span');
      span.textContent = c;
      span.className = 'wc-node';
      span.wcNode = true;
      return span;
    };

    var wc_row = document.createElement('div');
    wc_row.appendChild(createWidecharNode('\u4E2D'));
    wc_row.appendChild(createWidecharNode('\u6587'));
    wc_row.appendChild(createWidecharNode('\u5B57'));
    wc_row.appendChild(createWidecharNode('\u4E32'));
    screen.pushRow(wc_row);

    screen.setCursorPosition(1, 2);
    screen.deleteChars(2);

    assert.equal(wc_row.innerHTML, '<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.setCursorPosition(1, 0);
    screen.deleteChars(6);

    assert.equal(wc_row.innerHTML, '');
  });

  /**
   * Test the ability to insert text in a line.
   */
  it('insert', () => {
    // Sample rows.  Row 0 is a simple, empty row.  Row 1 simulates rows with
    // mixed text attributes.
    var ary = [document.createElement('div'), document.createElement('div'),
      document.createElement('div')];
    ary[1].innerHTML = 'hello<div id="1"> </div><div id="2">world</div>';
    screen.pushRows(ary);

    // Basic insert.
    screen.setCursorPosition(0, 0);
    screen.insertString('XXXXX');
    assert.equal(ary[0].innerHTML, 'XXXXX');

    // Test that positioning the cursor beyond the end of the current text does
    // not cause spaces to be printed.
    screen.clearCursorRow();
    screen.setCursorPosition(0, 3);
    assert.equal(ary[0].innerHTML, '');

    // Print some text at assert.equal cursor position and make sure the spaces show up.
    screen.insertString('XXXXX');
    assert.equal(ary[0].innerHTML, '   XXXXX');

    // Fetch enough whitespace to ensure that the row is full.
    var ws = f.getWhitespace(screen.getWidth());

    // Check text clipping and cursor clamping.
    screen.clearCursorRow();
    screen.insertString('XXXX');
    screen.setCursorPosition(0, 2);
    screen.insertString(ws);
    screen.maybeClipCurrentRow();
    assert.equal(ary[0].innerHTML, 'XX' + ws.substr(2));
    assert.equal(screen.cursorPosition.column, 79);

    // Insert into a more complicated row.
    screen.setCursorPosition(1, 3);
    screen.insertString('XXXXX');
    assert.equal(ary[1].innerHTML, 'helXXXXXlo<div id="1"> </div>' +
      '<div id="2">world</div>');

    // Test inserting widechar string.
    var wideCharString = '\u4E2D\u6587\u5B57\u4E32';
    screen.setCursorPosition(2, 0);
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.insertString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    assert.equal(ary[2].innerHTML, '<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.clearCursorRow();
    screen.setCursorPosition(2, 3);
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.insertString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    assert.equal(ary[2].innerHTML, '   <span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.setCursorPosition(2, 7);
    screen.insertString('XXXXX');
    assert.equal(ary[2].innerHTML, '   <span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' + 'XXXXX' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.clearCursorRow();
    screen.insertString('XXXXX');
    screen.setCursorPosition(2, 3);
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.insertString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    assert.equal(ary[2].innerHTML, 'XXX<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>XX');
  });

  /**
   * Test the ability to overwrite test.
   */
  it('overwrite', () => {
    var ary = [];
    ary[0] = document.createElement('div');
    ary[0].innerHTML = 'hello<div id="1"> </div><div id="2">world</div>';
    ary[1] = document.createElement('div');
    ary[2] = document.createElement('div');
    screen.pushRows(ary);

    screen.setCursorPosition(0, 3);
    screen.overwriteString('XXXXX');

    assert.equal(ary[0].innerHTML, 'helXXXXX<div id="2">rld</div>');

    screen.setCursorPosition(1, 0);
    screen.overwriteString('XXXXX');

    assert.equal(ary[1].innerHTML, 'XXXXX');

    // Test overwritting widechar string.
    var wideCharString = '\u4E2D\u6587\u5B57\u4E32';
    screen.setCursorPosition(2, 0);
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.overwriteString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    assert.equal(ary[2].innerHTML, '<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.clearCursorRow();
    screen.insertString('XXXXX');
    screen.setCursorPosition(2, 3);
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.overwriteString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    assert.equal(ary[2].innerHTML, 'XXX<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.setCursorPosition(2, 7);
    screen.overwriteString('OO');
    assert.equal(ary[2].innerHTML, 'XXX<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' + 'OO' +
      '<span class="wc-node">\u4E32</span>');

    screen.clearCursorRow();
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.insertString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    screen.setCursorPosition(2, 4);
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.overwriteString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    assert.equal(ary[2].innerHTML, '<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u4E2D</span>' +
      '<span class="wc-node">\u6587</span>' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');

    screen.clearCursorRow();
    screen.textAttributes.wcNode = true;
    for (var i = 0; i < wideCharString.length; i++) {
      screen.insertString(wideCharString.charAt(i));
    }
    screen.textAttributes.wcNode = false;
    screen.setCursorPosition(2, 0);
    screen.overwriteString('    ');
    assert.equal(ary[2].innerHTML, '    ' +
      '<span class="wc-node">\u5B57</span>' +
      '<span class="wc-node">\u4E32</span>');
  });
});
