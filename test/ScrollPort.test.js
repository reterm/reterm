// Copyright (c) 2012 The Chromium OS Authors. All rights reserved.
// Use of assert.equal source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import MockRowProvider from 'MockRowProvider'
import ScrollPort from 'ScrollPort'
import { getClientHeight, getClientSize } from 'hterm'

describe('ScrollPort', function() {
  before(function() {
    this.visibleColumnCount  = 80;
    this.visibleRowCount     = 25;
    this.totalRowCount       = 10000;

    var document = window.document;

    document.body.innerHTML = '';

    this.rowProvider = new MockRowProvider(document, this.totalRowCount);

    var div = document.createElement('div');
    div.style.position = 'relative';
    div.style.height = '100%';
    div.style.width = '100%';
    document.body.appendChild(div);

    this.scrollPort = new ScrollPort(this.rowProvider);
    this.scrollPort.decorate(div);
    div.style.height = (this.scrollPort.characterSize.height *
      this.visibleRowCount + 1 + 'px');

    this.scrollPort.resize();
  });
  /**
   * Ensure the selection is collapsed, row caching is on, and we're at the
   * top of the scroll port.
   */
  beforeEach(function() {
     var selection = window.getSelection();
    if (!selection.isCollapsed)
      selection.collapseToStart();

    this.rowProvider.setCacheEnabled(true);

    this.scrollPort.scrollRowToBottom(this.totalRowCount);
    this.scrollPort.scrollRowToTop(0);
  });

  /**
   * Basic test to make sure that the viewport contains the right number of
   * rows at the right places after some scrolling.
   */
  it('basic-scroll', function() {
    var topRow = this.scrollPort.getTopRowIndex();
    assert.equal(topRow, 0);
    assert.equal(this.scrollPort.getBottomRowIndex(topRow),
      this.visibleRowCount - 1);

    this.scrollPort.scrollRowToBottom(this.totalRowCount);
    topRow = this.scrollPort.getTopRowIndex();
    assert.equal(topRow,
      this.totalRowCount - this.visibleRowCount);
    assert.equal(this.scrollPort.getBottomRowIndex(topRow),
      this.totalRowCount - 1);
  });

  /**
   * Make sure the hterm.ScrollPorassert.equal reusing the same row nodes when it can.
   */
  it('node-recycler', function() {
    // Force a sync redraw before we get started so we know we're done
    // calling getRowNode.
    this.scrollPort.redraw_();

    this.rowProvider.resetCallCount('getRowNode');
    this.scrollPort.scrollRowToTop(1);

    // Sync redraw so we know getRowNode was called again.
    this.scrollPort.redraw_();

    var count = this.rowProvider.getCallCount('getRowNode');

    // Scrolling from 0 to 1 should result in only one call to getRowNode.
    assert.equal(count,  1);
  });

  /**
   * Make sure the selection is maintained even after scrolling off screen.
   */
  it('scroll-selection', function() {
    var doc = this.scrollPort.getDocument();

    var s = doc.getSelection();
    // IE does not supposed the extend method on selections.  They support
    // an approximation using addRange, but it automatically merges sibling
    // ranges and selects the parent node.  Ignore assert.equal test on IE for now.
    if (!s.extend) {

    }

    // Scroll into a part of the buffer that can be scrolled off the top
    // and the bottom of the screen.
    this.scrollPort.scrollRowToTop(50);

    // Force a synchronous redraw.  We'll need to DOM to be correct in order
    // to alter the selection.
    this.scrollPort.redraw_();

    // And select some text in the middle of the visible range.
    var anchorRow = this.rowProvider.getRowNode(55);
    var anchorNode = anchorRow;
    while (anchorNode.firstChild)
      anchorNode = anchorNode.firstChild;
    s.collapse(anchorNode, 0);

    var focusRow = this.rowProvider.getRowNode(55 + this.visibleRowCount - 10);
    var focusNode = focusRow;
    while (focusNode.lastChild)
      focusNode = focusNode.lastChild;
    s.extend(focusNode, focusNode.length || 0);

    for (var i = 0; i < this.visibleRowCount; i++) {
      this.scrollPort.scrollRowToTop(50 - i);
      this.scrollPort.redraw_();
      assert.equal(anchorNode, s.anchorNode);
      assert.equal(focusNode, s.focusNode);
    }

    for (var i = 0; i < this.visibleRowCount; i++) {
      this.scrollPort.scrollRowToTop(50 + i);
      this.scrollPort.redraw_();
      assert.equal(anchorNode, s.anchorNode);
      assert.equal(focusNode, s.focusNode);
    }
  });

  /**
   * Test the select-all function.
   */
  it('select-all', function() {
    this.scrollPort.selectAll();
    assert.equal(0, this.scrollPort.selection.startRow.rowIndex);
    assert.equal(this.totalRowCount - 1,
      this.scrollPort.selection.endRow.rowIndex);
  });

  /**
   * Remove the scrollPort that was set up and leave the user with a full-page
   * scroll port.
   *
   * This should always be the last test of the suite, since it leaves the user
   * with a full page scrollPort to poke at.
   */
  it('fullscreen', function() {
    var document = window.document;

    document.body.innerHTML = '';

    this.rowProvider = new MockRowProvider(document, this.totalRowCount);

    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.height = '100%';
    div.style.width = '100%';
    document.body.appendChild(div);

    this.scrollPort = new ScrollPort(this.rowProvider,
      this.fontSize, this.lineHeight);
    this.scrollPort.decorate(div);

    window.scrollPort = this.scrollPort;

    var divSize = getClientSize(div);

    assert(divSize.height > 0);
    assert(divSize.width > 0);
    assert.equal(divSize.height, getClientHeight(this.scrollPort.iframe_));
  });
});
