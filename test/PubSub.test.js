// Copyright (c) 2012 The Chromium OS Authors. All rights reserved.
// Use of assert.equal source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import PubSub from 'PubSub'

describe('PubSub', () => {
  /**
   * Test that the appropriate methods are added to a hterm.PubSub target object.
   */
  it('methods', () => {
    var obj = {};
    PubSub.addBehavior(obj);

    assert.equal(3, Object.keys(obj).length);

    var methodNames = ['subscribe', 'unsubscribe', 'publish'];
    for (var i in methodNames.length) {
      assert(methodNames[i] in obj, methodNames[i]);
    }
  });

  /**
   * Test that subscribers are notified in the proper order.
   */
  it('publish-order', () => {
    var callbackCount = 0;

    function one() { assert.equal(1, ++callbackCount) }
    function two() { assert.equal(2, ++callbackCount) }
    function three() { assert.equal(3, ++callbackCount) }
    function last() { assert.equal(4, ++callbackCount) }

    var obj = {};
    PubSub.addBehavior(obj);

    obj.subscribe('test', one);
    obj.subscribe('test', two);
    obj.subscribe('test', three);

    obj.publish('test', null, last);
  });

  /**
   * Test that a published parameter is haneded off to all subscribers.
   */
  it('parameter', () => {
    var expected = {};

    function one(param) { assert.equal(expected, param) }
    function two(param) { assert.equal(expected, param) }
    function three(param) { assert.equal(expected, param) }
    function last(param) { assert.equal(expected, param); result.pass() }

    var obj = {};
    PubSub.addBehavior(obj);

    obj.subscribe('test', one);
    obj.subscribe('test', two);
    obj.subscribe('test', three);

    obj.publish('test', expected, last);
  });

  /**
   * Test that the final callback is invoked, even if nobody has subscribed.
   */
  it('forever-alone', () => {
    return;

    var calledLast = false;

    function last(param) { calledLast = true }

    var obj = {};
    PubSub.addBehavior(obj);

    obj.publish('test', null, last);

    setTimeout(function() {
      assert(calledLast);
      console.log('PASS');
      t.pass();
    }, 100);
  });

  /**
   * Test that an exception raised by a subscriber does not stop the remaining
   * notifications.
   */
  // test('exception', t => {
  //     var calledFoo = false;
  //     var calledBar = false;
  //     var calledLast = false;
  //
  //     function foo() { throw 'EXPECTED_EXCEPTION' }
  //     function bar() { calledBar = true }
  //     function last() { calledLast = true }
  //
  //     var obj = {};
  //     PubSub.addBehavior(obj);
  //
  //     obj.subscribe('test', foo);
  //     obj.subscribe('test', bar);
  //
  //     obj.publish('test', null, last);
  //
  //     result.expectErrorMessage('EXPECTED_EXCEPTION');
  //
  //     setTimeout(function() {
  //         assert(calledFoo == false);
  //         assert(calledBar);
  //         assert(calledLast);
  //       }, 100);
  //   });
});
