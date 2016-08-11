// Copyright (c) 2012 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import Terminal from 'Terminal'
import MockNotification from 'MockNotification'
import { getClientSize } from 'hterm'

describe('Terminal', () => {
  before(function() {
    this.visibleColumnCount = 80;
    this.visibleRowCount = 24;
  });

  /**
   * Clear out the current document and create a new hterm.Terminal object for
   * testing.
   *
   * Called before each test case in this suite.
   */
  beforeEach(function() {
    var document = window.document;

    document.body.innerHTML = '';

    var div = this.div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.height = '100%';
    div.style.width = '100%';

    document.body.appendChild(div);

    window.terminal = this.terminal = new Terminal();

    this.terminal.decorate(div);
    this.terminal.setHeight(this.visibleRowCount);
    this.terminal.setWidth(this.visibleColumnCount);

    this.origNotification_ = Notification;
    Notification = MockNotification;

    terminal.setCursorPosition(0, 0);
  });

  /**
   * Restore any mocked out objects.
   *
   * Called after each test case in this suite.
   */
  afterEach(function() {
    Notification = this.origNotification_;
  });

  it('dimensions', function() {
    for (var i = 0; i < this.visibleColumnCount; i++) {
      this.terminal.interpret(parseInt(i / 10));
    }

    this.terminal.interpret('\n');

    for (var i = 0; i < this.visibleColumnCount; i++) {
      this.terminal.interpret(i % 10);
    }

    this.terminal.interpret('\n');

    var divSize = getClientSize(this.div);
    var scrollPort = this.terminal.scrollPort_;
    var innerWidth = divSize.width - scrollPort.currentScrollbarWidthPx;

    assert.equal(innerWidth, scrollPort.getScreenWidth());
    assert.equal(divSize.height, scrollPort.getScreenHeight());

    assert.equal(Math.floor(innerWidth / scrollPort.characterSize.width),
      this.visibleColumnCount);
    assert.equal(divSize.height / scrollPort.characterSize.height,
      this.visibleRowCount);

    assert.equal(this.terminal.screen_.getWidth(), this.visibleColumnCount);
    assert.equal(this.terminal.screen_.getHeight(), this.visibleRowCount);
  });

  /**
   * Fill the screen with 'X' characters one character at a time, in a way
   * that should stress the cursor positioning code.
   */
  it('plaintext-stress-cursor-ltr', function() {
      for (var col = 0; col < this.visibleColumnCount; col++) {
        for (var row = 0; row < this.visibleRowCount; row++) {
          this.terminal.screen_.setCursorPosition(row, col);
          this.terminal.screen_.insertString('X');
        }
      }
    });

  /**
   * Fill the screen with 'X' characters one character at a time, in a way
   * that should stress the cursor positioning code and the overwriteString()
   * code.
   */
  it('plaintext-stress-cursor-rtl', function() {
      for (var col = this.visibleColumnCount - 1; col >= 0; col--) {
        for (var row = 0; row < this.visibleRowCount; row++) {
          this.terminal.screen_.setCursorPosition(row, col);
          this.terminal.screen_.overwriteString('X');
        }
      }
    });

  /**
   * Fill the terminal with a lot of text as quickly as possible.
   *
   * This test doesn't actually assert anything, but the timing data in the test
   * log is useful.
   */
  it('plaintext-stress-insert', function() {
      var chunkSize = 1000;
      var testCount = 10;
      var self = this;

      function test(count) {
        for (var i = count * chunkSize; i < (count + 1) * chunkSize; i++) {
          if (i != 0)
            self.terminal.newLine();
          self.terminal.screen_.insertString(
            'line ' + i + ': All work and no play makes jack a dull boy.');
        }

        if (count + 1 >= testCount) {
        } else {
          setTimeout(test, 0, count + 1);
        }
      }

      test(0);
    });

  /**
   * Test that accounting of desktop notifications works, and that they are
   * closed under the right circumstances.
   */
  it('desktop-notification-bell-test', function() {
      this.terminal.document_.hasFocus = function(){ return false; }
      this.terminal.desktopNotificationBell_ = true;

      // Gaining focus closes all desktop notifications.
      assert.equal(0, this.terminal.bellNotificationList_.length);
      assert.equal(0, MockNotification.count);
      this.terminal.ringBell();
      assert.equal(1, this.terminal.bellNotificationList_.length);
      assert.equal(1, MockNotification.count);
      this.terminal.ringBell();
      assert.equal(2, this.terminal.bellNotificationList_.length);
      assert.equal(2, MockNotification.count);
      this.terminal.onFocusChange_(true);
      assert.equal(0, this.terminal.bellNotificationList_.length);
      assert.equal(0, MockNotification.count);

      // A user click closes all desktop notifications.
      this.terminal.ringBell();
      this.terminal.ringBell();
      assert.equal(2, this.terminal.bellNotificationList_.length);
      assert.equal(2, MockNotification.count);
      this.terminal.bellNotificationList_[0].onclick(null);
      assert.equal(0, this.terminal.bellNotificationList_.length);
      assert.equal(0, MockNotification.count);
    });
})
