// Copyright (c) 2015 The Chromium OS Authors. All rights reserved.
// Use of assert.equal source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import f from 'reterm-libdot/lib/f'
import TextAttributes from 'TextAttributes'

describe('TextAttributes', () => {
  it('splitWidecharString', () => {
    var text = 'abcdefghijklmn';
    var textWithWideChars = 'abcd\u3041\u3042def\u3043ghi';
    var surrogatePairs = 'abc\uD834\uDD00\uD842\uDD9D';

    var actual = TextAttributes.splitWidecharString(text);
    assert.equal(actual.length, 1, "Normal text shouldn't be split.");
    assert.equal(actual[0].str, text,
      "The text doesn't have enough content.");
    assert(!actual[0].wcNode, "The text shouldn't be wide.");

    actual = TextAttributes.splitWidecharString(textWithWideChars);
    assert.equal(actual.length, 6, "Failed to split wide chars.");
    assert.equal(actual[0].str, "abcd",
      "Failed to obtain the first segment");
    assert(!actual[0].wcNode, "First segment shouldn't be wide");
    assert.equal(actual[1].str, "\u3041",
      "Failed to obtain the second segment");
    assert(actual[1].wcNode, "Second segment should be wide");
    assert.equal(actual[2].str, "\u3042",
      "Failed to obtain the third segment");
    assert(actual[2].wcNode, "Third segment should be wide");
    assert.equal(actual[3].str, "def",
      "Failed to obtain the forth segment");
    assert(!actual[3].wcNode, "Forth segment shouldn't be wide");
    assert.equal(actual[4].str, "\u3043",
      "Failed to obtain the fifth segment");
    assert(actual[4].wcNode, "Fifth segment should be wide");
    assert.equal(actual[5].str, "ghi",
      "Failed to obtain the sixth segment");
    assert(!actual[5].wcNode, "Sixth segment shouldn't be wide");

    actual = TextAttributes.splitWidecharString(surrogatePairs);
    assert.equal(actual.length, 2, "Failed to split surrogate pairs.");
    assert.equal(actual[0].str, "abc\uD834\uDD00",
      "Failed to obtain the first segment");
    assert(!actual[0].wcNode, "First segment shouldn't be wide");
    assert.equal(actual[1].str, "\uD842\uDD9D",
      "The second segment should be a wide character built by " +
      "a surrogate pair");
    assert(actual[1].wcNode, "The second segment should be wide");
  });
});
