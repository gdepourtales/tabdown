(function() {
  'use strict';

  var extend = function(destination, source) {
    if (!destination || !source) return destination;
    for (var key in source) {
      if (destination[key] !== source[key])
        destination[key] = source[key];
    }
    return destination;
  };

  var formatError = function(input, offset, expected) {
    var lines = input.split(/\n/g),
        lineNo = 0,
        position = 0;

    while (position <= offset) {
      position += lines[lineNo].length + 1;
      lineNo += 1;
    }
    var message = 'Line ' + lineNo + ': expected ' + expected.join(', ') + '\n',
        line = lines[lineNo - 1];

    message += line + '\n';
    position -= line.length + 1;

    while (position < offset) {
      message += ' ';
      position += 1;
    }
    return message + '^';
  };

  var inherit = function(subclass, parent) {
    var chain = function() {};
    chain.prototype = parent.prototype;
    subclass.prototype = new chain();
    subclass.prototype.constructor = subclass;
  };

  var TreeNode = function(text, offset, elements) {
    this.text = text;
    this.offset = offset;
    this.elements = elements || [];
  };

  TreeNode.prototype.forEach = function(block, context) {
    for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
      block.call(context, el[i], i, el);
    }
  };

  var TreeNode1 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['tuning'] = elements[0];
  };
  inherit(TreeNode1, TreeNode);

  var TreeNode2 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['tune_note'] = elements[1];
  };
  inherit(TreeNode2, TreeNode);

  var TreeNode3 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['tune_note'] = elements[1];
  };
  inherit(TreeNode3, TreeNode);

  var TreeNode4 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['measure'] = elements[1];
  };
  inherit(TreeNode4, TreeNode);

  var TreeNode5 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['newline'] = elements[0];
    this['measure'] = elements[2];
  };
  inherit(TreeNode5, TreeNode);

  var TreeNode6 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['notes'] = elements[4];
  };
  inherit(TreeNode6, TreeNode);

  var TreeNode7 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['tempo'] = elements[0];
  };
  inherit(TreeNode7, TreeNode);

  var TreeNode8 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['marker'] = elements[0];
  };
  inherit(TreeNode8, TreeNode);

  var TreeNode9 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['triplet_feel'] = elements[0];
  };
  inherit(TreeNode9, TreeNode);

  var TreeNode10 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['start_repeat'] = elements[0];
  };
  inherit(TreeNode10, TreeNode);

  var TreeNode11 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['close_repeat'] = elements[1];
  };
  inherit(TreeNode11, TreeNode);

  var TreeNode12 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['string_number'] = elements[0];
    this['fret_number'] = elements[6];
    this['note_duration_ext'] = elements[7];
  };
  inherit(TreeNode12, TreeNode);

  var TreeNode13 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['string_number'] = elements[0];
    this['note_duration_ext'] = elements[2];
  };
  inherit(TreeNode13, TreeNode);

  var TreeNode14 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['fret_number'] = elements[5];
    this['note_duration_ext'] = elements[6];
  };
  inherit(TreeNode14, TreeNode);

  var TreeNode15 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['note_duration_ext'] = elements[1];
  };
  inherit(TreeNode15, TreeNode);

  var TreeNode16 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['note_duration_ext'] = elements[1];
  };
  inherit(TreeNode16, TreeNode);

  var TreeNode17 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['note_duration'] = elements[1];
    this['tempo_value'] = elements[4];
  };
  inherit(TreeNode17, TreeNode);

  var TreeNode18 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['note_duration'] = elements[0];
  };
  inherit(TreeNode18, TreeNode);

  var FAILURE = {};

  var Grammar = {
    _read_song: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._song = this._cache._song || {};
      var cached = this._cache._song[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      address1 = this._read_tuning();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 1, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          address3 = this._read__();
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var remaining1 = 0, index3 = this._offset, elements2 = [], address5 = true;
          while (address5 !== FAILURE) {
            address5 = this._read_measures();
            if (address5 !== FAILURE) {
              elements2.push(address5);
              --remaining1;
            }
          }
          if (remaining1 <= 0) {
            address4 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
            this._offset = this._offset;
          } else {
            address4 = FAILURE;
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
            var address6 = FAILURE;
            var remaining2 = 0, index4 = this._offset, elements3 = [], address7 = true;
            while (address7 !== FAILURE) {
              address7 = this._read_newline();
              if (address7 !== FAILURE) {
                elements3.push(address7);
                --remaining2;
              }
            }
            if (remaining2 <= 0) {
              address6 = new TreeNode(this._input.substring(index4, this._offset), index4, elements3);
              this._offset = this._offset;
            } else {
              address6 = FAILURE;
            }
            if (address6 !== FAILURE) {
              elements0[3] = address6;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_song(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._song[index0] = [address0, this._offset];
      return address0;
    },

    _read_tuning: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._tuning = this._cache._tuning || {};
      var cached = this._cache._tuning[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 7);
      }
      if (chunk0 === 'tuning(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
        this._offset = this._offset + 7;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"tuning("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_tune_note();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var remaining0 = 1, index2 = this._offset, elements1 = [], address4 = true;
          while (address4 !== FAILURE) {
            var index3 = this._offset, elements2 = new Array(2);
            var address5 = FAILURE;
            var chunk1 = null;
            if (this._offset < this._inputSize) {
              chunk1 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk1 === ',') {
              address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address5 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('","');
              }
            }
            if (address5 !== FAILURE) {
              elements2[0] = address5;
              var address6 = FAILURE;
              address6 = this._read_tune_note();
              if (address6 !== FAILURE) {
                elements2[1] = address6;
              } else {
                elements2 = null;
                this._offset = index3;
              }
            } else {
              elements2 = null;
              this._offset = index3;
            }
            if (elements2 === null) {
              address4 = FAILURE;
            } else {
              address4 = new TreeNode3(this._input.substring(index3, this._offset), index3, elements2);
              this._offset = this._offset;
            }
            if (address4 !== FAILURE) {
              elements1.push(address4);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address3 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address7 = FAILURE;
            var chunk2 = null;
            if (this._offset < this._inputSize) {
              chunk2 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk2 === ')') {
              address7 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address7 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('")"');
              }
            }
            if (address7 !== FAILURE) {
              elements0[3] = address7;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_tuning(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._tuning[index0] = [address0, this._offset];
      return address0;
    },

    _read_tune_note: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._tune_note = this._cache._tune_note || {};
      var cached = this._cache._tune_note[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[A-G]/.test(chunk0)) {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[A-G]');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 === '#') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"#"');
          }
        }
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index2, index2), index2);
          this._offset = index2;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 !== null && /^[1-8]/.test(chunk2)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[1-8]');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._tune_note[index0] = [address0, this._offset];
      return address0;
    },

    _read_measures: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._measures = this._cache._measures || {};
      var cached = this._cache._measures[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var remaining0 = 0, index2 = this._offset, elements1 = [], address2 = true;
      while (address2 !== FAILURE) {
        address2 = this._read__();
        if (address2 !== FAILURE) {
          elements1.push(address2);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
        this._offset = this._offset;
      } else {
        address1 = FAILURE;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address3 = FAILURE;
        address3 = this._read_measure();
        if (address3 !== FAILURE) {
          elements0[1] = address3;
          var address4 = FAILURE;
          var remaining1 = 0, index3 = this._offset, elements2 = [], address5 = true;
          while (address5 !== FAILURE) {
            address5 = this._read__();
            if (address5 !== FAILURE) {
              elements2.push(address5);
              --remaining1;
            }
          }
          if (remaining1 <= 0) {
            address4 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
            this._offset = this._offset;
          } else {
            address4 = FAILURE;
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
            var address6 = FAILURE;
            var remaining2 = 0, index4 = this._offset, elements3 = [], address7 = true;
            while (address7 !== FAILURE) {
              var index5 = this._offset, elements4 = new Array(4);
              var address8 = FAILURE;
              address8 = this._read_newline();
              if (address8 !== FAILURE) {
                elements4[0] = address8;
                var address9 = FAILURE;
                var remaining3 = 0, index6 = this._offset, elements5 = [], address10 = true;
                while (address10 !== FAILURE) {
                  address10 = this._read__();
                  if (address10 !== FAILURE) {
                    elements5.push(address10);
                    --remaining3;
                  }
                }
                if (remaining3 <= 0) {
                  address9 = new TreeNode(this._input.substring(index6, this._offset), index6, elements5);
                  this._offset = this._offset;
                } else {
                  address9 = FAILURE;
                }
                if (address9 !== FAILURE) {
                  elements4[1] = address9;
                  var address11 = FAILURE;
                  address11 = this._read_measure();
                  if (address11 !== FAILURE) {
                    elements4[2] = address11;
                    var address12 = FAILURE;
                    var remaining4 = 0, index7 = this._offset, elements6 = [], address13 = true;
                    while (address13 !== FAILURE) {
                      address13 = this._read__();
                      if (address13 !== FAILURE) {
                        elements6.push(address13);
                        --remaining4;
                      }
                    }
                    if (remaining4 <= 0) {
                      address12 = new TreeNode(this._input.substring(index7, this._offset), index7, elements6);
                      this._offset = this._offset;
                    } else {
                      address12 = FAILURE;
                    }
                    if (address12 !== FAILURE) {
                      elements4[3] = address12;
                    } else {
                      elements4 = null;
                      this._offset = index5;
                    }
                  } else {
                    elements4 = null;
                    this._offset = index5;
                  }
                } else {
                  elements4 = null;
                  this._offset = index5;
                }
              } else {
                elements4 = null;
                this._offset = index5;
              }
              if (elements4 === null) {
                address7 = FAILURE;
              } else {
                address7 = new TreeNode5(this._input.substring(index5, this._offset), index5, elements4);
                this._offset = this._offset;
              }
              if (address7 !== FAILURE) {
                elements3.push(address7);
                --remaining2;
              }
            }
            if (remaining2 <= 0) {
              address6 = new TreeNode(this._input.substring(index4, this._offset), index4, elements3);
              this._offset = this._offset;
            } else {
              address6 = FAILURE;
            }
            if (address6 !== FAILURE) {
              elements0[3] = address6;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode4(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._measures[index0] = [address0, this._offset];
      return address0;
    },

    _read_measure: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._measure = this._cache._measure || {};
      var cached = this._cache._measure[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(6);
      var address1 = FAILURE;
      var index2 = this._offset;
      var index3 = this._offset, elements1 = new Array(2);
      var address2 = FAILURE;
      address2 = this._read_tempo();
      if (address2 !== FAILURE) {
        elements1[0] = address2;
        var address3 = FAILURE;
        var remaining0 = 1, index4 = this._offset, elements2 = [], address4 = true;
        while (address4 !== FAILURE) {
          address4 = this._read__();
          if (address4 !== FAILURE) {
            elements2.push(address4);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address3 = new TreeNode(this._input.substring(index4, this._offset), index4, elements2);
          this._offset = this._offset;
        } else {
          address3 = FAILURE;
        }
        if (address3 !== FAILURE) {
          elements1[1] = address3;
        } else {
          elements1 = null;
          this._offset = index3;
        }
      } else {
        elements1 = null;
        this._offset = index3;
      }
      if (elements1 === null) {
        address1 = FAILURE;
      } else {
        address1 = new TreeNode7(this._input.substring(index3, this._offset), index3, elements1);
        this._offset = this._offset;
      }
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address5 = FAILURE;
        var index5 = this._offset;
        var index6 = this._offset, elements3 = new Array(2);
        var address6 = FAILURE;
        address6 = this._read_marker();
        if (address6 !== FAILURE) {
          elements3[0] = address6;
          var address7 = FAILURE;
          var remaining1 = 1, index7 = this._offset, elements4 = [], address8 = true;
          while (address8 !== FAILURE) {
            address8 = this._read__();
            if (address8 !== FAILURE) {
              elements4.push(address8);
              --remaining1;
            }
          }
          if (remaining1 <= 0) {
            address7 = new TreeNode(this._input.substring(index7, this._offset), index7, elements4);
            this._offset = this._offset;
          } else {
            address7 = FAILURE;
          }
          if (address7 !== FAILURE) {
            elements3[1] = address7;
          } else {
            elements3 = null;
            this._offset = index6;
          }
        } else {
          elements3 = null;
          this._offset = index6;
        }
        if (elements3 === null) {
          address5 = FAILURE;
        } else {
          address5 = new TreeNode8(this._input.substring(index6, this._offset), index6, elements3);
          this._offset = this._offset;
        }
        if (address5 === FAILURE) {
          address5 = new TreeNode(this._input.substring(index5, index5), index5);
          this._offset = index5;
        }
        if (address5 !== FAILURE) {
          elements0[1] = address5;
          var address9 = FAILURE;
          var index8 = this._offset;
          var index9 = this._offset, elements5 = new Array(2);
          var address10 = FAILURE;
          address10 = this._read_triplet_feel();
          if (address10 !== FAILURE) {
            elements5[0] = address10;
            var address11 = FAILURE;
            var remaining2 = 1, index10 = this._offset, elements6 = [], address12 = true;
            while (address12 !== FAILURE) {
              address12 = this._read__();
              if (address12 !== FAILURE) {
                elements6.push(address12);
                --remaining2;
              }
            }
            if (remaining2 <= 0) {
              address11 = new TreeNode(this._input.substring(index10, this._offset), index10, elements6);
              this._offset = this._offset;
            } else {
              address11 = FAILURE;
            }
            if (address11 !== FAILURE) {
              elements5[1] = address11;
            } else {
              elements5 = null;
              this._offset = index9;
            }
          } else {
            elements5 = null;
            this._offset = index9;
          }
          if (elements5 === null) {
            address9 = FAILURE;
          } else {
            address9 = new TreeNode9(this._input.substring(index9, this._offset), index9, elements5);
            this._offset = this._offset;
          }
          if (address9 === FAILURE) {
            address9 = new TreeNode(this._input.substring(index8, index8), index8);
            this._offset = index8;
          }
          if (address9 !== FAILURE) {
            elements0[2] = address9;
            var address13 = FAILURE;
            var index11 = this._offset;
            var index12 = this._offset, elements7 = new Array(2);
            var address14 = FAILURE;
            address14 = this._read_start_repeat();
            if (address14 !== FAILURE) {
              elements7[0] = address14;
              var address15 = FAILURE;
              var remaining3 = 1, index13 = this._offset, elements8 = [], address16 = true;
              while (address16 !== FAILURE) {
                address16 = this._read__();
                if (address16 !== FAILURE) {
                  elements8.push(address16);
                  --remaining3;
                }
              }
              if (remaining3 <= 0) {
                address15 = new TreeNode(this._input.substring(index13, this._offset), index13, elements8);
                this._offset = this._offset;
              } else {
                address15 = FAILURE;
              }
              if (address15 !== FAILURE) {
                elements7[1] = address15;
              } else {
                elements7 = null;
                this._offset = index12;
              }
            } else {
              elements7 = null;
              this._offset = index12;
            }
            if (elements7 === null) {
              address13 = FAILURE;
            } else {
              address13 = new TreeNode10(this._input.substring(index12, this._offset), index12, elements7);
              this._offset = this._offset;
            }
            if (address13 === FAILURE) {
              address13 = new TreeNode(this._input.substring(index11, index11), index11);
              this._offset = index11;
            }
            if (address13 !== FAILURE) {
              elements0[3] = address13;
              var address17 = FAILURE;
              address17 = this._read_notes();
              if (address17 !== FAILURE) {
                elements0[4] = address17;
                var address18 = FAILURE;
                var index14 = this._offset;
                var index15 = this._offset, elements9 = new Array(2);
                var address19 = FAILURE;
                var remaining4 = 1, index16 = this._offset, elements10 = [], address20 = true;
                while (address20 !== FAILURE) {
                  address20 = this._read__();
                  if (address20 !== FAILURE) {
                    elements10.push(address20);
                    --remaining4;
                  }
                }
                if (remaining4 <= 0) {
                  address19 = new TreeNode(this._input.substring(index16, this._offset), index16, elements10);
                  this._offset = this._offset;
                } else {
                  address19 = FAILURE;
                }
                if (address19 !== FAILURE) {
                  elements9[0] = address19;
                  var address21 = FAILURE;
                  address21 = this._read_close_repeat();
                  if (address21 !== FAILURE) {
                    elements9[1] = address21;
                  } else {
                    elements9 = null;
                    this._offset = index15;
                  }
                } else {
                  elements9 = null;
                  this._offset = index15;
                }
                if (elements9 === null) {
                  address18 = FAILURE;
                } else {
                  address18 = new TreeNode11(this._input.substring(index15, this._offset), index15, elements9);
                  this._offset = this._offset;
                }
                if (address18 === FAILURE) {
                  address18 = new TreeNode(this._input.substring(index14, index14), index14);
                  this._offset = index14;
                }
                if (address18 !== FAILURE) {
                  elements0[5] = address18;
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode6(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._measure[index0] = [address0, this._offset];
      return address0;
    },

    _read_start_repeat: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._start_repeat = this._cache._start_repeat || {};
      var cached = this._cache._start_repeat[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 2);
      }
      if (chunk0 === '|:') {
        address0 = this._actions.make_start_repeat(this._input, this._offset, this._offset + 2);
        this._offset = this._offset + 2;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"|:"');
        }
      }
      this._cache._start_repeat[index0] = [address0, this._offset];
      return address0;
    },

    _read_close_repeat: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._close_repeat = this._cache._close_repeat || {};
      var cached = this._cache._close_repeat[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 2);
      }
      if (chunk0 === ':|') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
        this._offset = this._offset + 2;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('":|"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var index3 = this._offset, elements1 = new Array(3);
        var address3 = FAILURE;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 !== null && /^[1-9]/.test(chunk1)) {
          address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address3 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('[1-9]');
          }
        }
        if (address3 !== FAILURE) {
          elements1[0] = address3;
          var address4 = FAILURE;
          var index4 = this._offset;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 !== null && /^[0-9]/.test(chunk2)) {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[0-9]');
            }
          }
          if (address4 === FAILURE) {
            address4 = new TreeNode(this._input.substring(index4, index4), index4);
            this._offset = index4;
          }
          if (address4 !== FAILURE) {
            elements1[1] = address4;
            var address5 = FAILURE;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk3 === 'x') {
              address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address5 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"x"');
              }
            }
            if (address5 !== FAILURE) {
              elements1[2] = address5;
            } else {
              elements1 = null;
              this._offset = index3;
            }
          } else {
            elements1 = null;
            this._offset = index3;
          }
        } else {
          elements1 = null;
          this._offset = index3;
        }
        if (elements1 === null) {
          address2 = FAILURE;
        } else {
          address2 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
          this._offset = this._offset;
        }
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index2, index2), index2);
          this._offset = index2;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_close_repeat(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._close_repeat[index0] = [address0, this._offset];
      return address0;
    },

    _read_notes: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._notes = this._cache._notes || {};
      var cached = this._cache._notes[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var index2 = this._offset;
      address1 = this._read_string_number();
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index3 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          address3 = this._read__();
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var index4 = this._offset;
          address4 = this._read_repeated_notes();
          if (address4 === FAILURE) {
            this._offset = index4;
            address4 = this._read_note();
            if (address4 === FAILURE) {
              this._offset = index4;
              address4 = this._read_tied_note();
              if (address4 === FAILURE) {
                this._offset = index4;
                address4 = this._read_chord();
                if (address4 === FAILURE) {
                  this._offset = index4;
                  address4 = this._read_silence();
                  if (address4 === FAILURE) {
                    this._offset = index4;
                  }
                }
              }
            }
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
            var address5 = FAILURE;
            var remaining1 = 0, index5 = this._offset, elements2 = [], address6 = true;
            while (address6 !== FAILURE) {
              var index6 = this._offset, elements3 = new Array(4);
              var address7 = FAILURE;
              var remaining2 = 1, index7 = this._offset, elements4 = [], address8 = true;
              while (address8 !== FAILURE) {
                address8 = this._read__();
                if (address8 !== FAILURE) {
                  elements4.push(address8);
                  --remaining2;
                }
              }
              if (remaining2 <= 0) {
                address7 = new TreeNode(this._input.substring(index7, this._offset), index7, elements4);
                this._offset = this._offset;
              } else {
                address7 = FAILURE;
              }
              if (address7 !== FAILURE) {
                elements3[0] = address7;
                var address9 = FAILURE;
                var index8 = this._offset;
                address9 = this._read_string_number();
                if (address9 === FAILURE) {
                  address9 = new TreeNode(this._input.substring(index8, index8), index8);
                  this._offset = index8;
                }
                if (address9 !== FAILURE) {
                  elements3[1] = address9;
                  var address10 = FAILURE;
                  var remaining3 = 0, index9 = this._offset, elements5 = [], address11 = true;
                  while (address11 !== FAILURE) {
                    address11 = this._read__();
                    if (address11 !== FAILURE) {
                      elements5.push(address11);
                      --remaining3;
                    }
                  }
                  if (remaining3 <= 0) {
                    address10 = new TreeNode(this._input.substring(index9, this._offset), index9, elements5);
                    this._offset = this._offset;
                  } else {
                    address10 = FAILURE;
                  }
                  if (address10 !== FAILURE) {
                    elements3[2] = address10;
                    var address12 = FAILURE;
                    var index10 = this._offset;
                    address12 = this._read_repeated_notes();
                    if (address12 === FAILURE) {
                      this._offset = index10;
                      address12 = this._read_note();
                      if (address12 === FAILURE) {
                        this._offset = index10;
                        address12 = this._read_tied_note();
                        if (address12 === FAILURE) {
                          this._offset = index10;
                          address12 = this._read_chord();
                          if (address12 === FAILURE) {
                            this._offset = index10;
                            address12 = this._read_silence();
                            if (address12 === FAILURE) {
                              this._offset = index10;
                            }
                          }
                        }
                      }
                    }
                    if (address12 !== FAILURE) {
                      elements3[3] = address12;
                    } else {
                      elements3 = null;
                      this._offset = index6;
                    }
                  } else {
                    elements3 = null;
                    this._offset = index6;
                  }
                } else {
                  elements3 = null;
                  this._offset = index6;
                }
              } else {
                elements3 = null;
                this._offset = index6;
              }
              if (elements3 === null) {
                address6 = FAILURE;
              } else {
                address6 = new TreeNode(this._input.substring(index6, this._offset), index6, elements3);
                this._offset = this._offset;
              }
              if (address6 !== FAILURE) {
                elements2.push(address6);
                --remaining1;
              }
            }
            if (remaining1 <= 0) {
              address5 = new TreeNode(this._input.substring(index5, this._offset), index5, elements2);
              this._offset = this._offset;
            } else {
              address5 = FAILURE;
            }
            if (address5 !== FAILURE) {
              elements0[3] = address5;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_notes(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._notes[index0] = [address0, this._offset];
      return address0;
    },

    _read_repeated_notes: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._repeated_notes = this._cache._repeated_notes || {};
      var cached = this._cache._repeated_notes[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(6);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[1-9]/.test(chunk0)) {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[1-9]');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 !== null && /^[0-9]/.test(chunk1)) {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('[0-9]');
          }
        }
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index2, index2), index2);
          this._offset = index2;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 2);
          }
          if (chunk2 === 'x(') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
            this._offset = this._offset + 2;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"x("');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            var index3 = this._offset;
            address4 = this._read_note();
            if (address4 === FAILURE) {
              this._offset = index3;
              address4 = this._read_chord();
              if (address4 === FAILURE) {
                this._offset = index3;
                address4 = this._read_tied_note();
                if (address4 === FAILURE) {
                  this._offset = index3;
                  address4 = this._read_silence();
                  if (address4 === FAILURE) {
                    this._offset = index3;
                  }
                }
              }
            }
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              var remaining0 = 0, index4 = this._offset, elements1 = [], address6 = true;
              while (address6 !== FAILURE) {
                var index5 = this._offset, elements2 = new Array(2);
                var address7 = FAILURE;
                var remaining1 = 1, index6 = this._offset, elements3 = [], address8 = true;
                while (address8 !== FAILURE) {
                  address8 = this._read__();
                  if (address8 !== FAILURE) {
                    elements3.push(address8);
                    --remaining1;
                  }
                }
                if (remaining1 <= 0) {
                  address7 = new TreeNode(this._input.substring(index6, this._offset), index6, elements3);
                  this._offset = this._offset;
                } else {
                  address7 = FAILURE;
                }
                if (address7 !== FAILURE) {
                  elements2[0] = address7;
                  var address9 = FAILURE;
                  var index7 = this._offset;
                  address9 = this._read_note();
                  if (address9 === FAILURE) {
                    this._offset = index7;
                    address9 = this._read_tied_note();
                    if (address9 === FAILURE) {
                      this._offset = index7;
                      address9 = this._read_chord();
                      if (address9 === FAILURE) {
                        this._offset = index7;
                        address9 = this._read_silence();
                        if (address9 === FAILURE) {
                          this._offset = index7;
                        }
                      }
                    }
                  }
                  if (address9 !== FAILURE) {
                    elements2[1] = address9;
                  } else {
                    elements2 = null;
                    this._offset = index5;
                  }
                } else {
                  elements2 = null;
                  this._offset = index5;
                }
                if (elements2 === null) {
                  address6 = FAILURE;
                } else {
                  address6 = new TreeNode(this._input.substring(index5, this._offset), index5, elements2);
                  this._offset = this._offset;
                }
                if (address6 !== FAILURE) {
                  elements1.push(address6);
                  --remaining0;
                }
              }
              if (remaining0 <= 0) {
                address5 = new TreeNode(this._input.substring(index4, this._offset), index4, elements1);
                this._offset = this._offset;
              } else {
                address5 = FAILURE;
              }
              if (address5 !== FAILURE) {
                elements0[4] = address5;
                var address10 = FAILURE;
                var chunk3 = null;
                if (this._offset < this._inputSize) {
                  chunk3 = this._input.substring(this._offset, this._offset + 1);
                }
                if (chunk3 === ')') {
                  address10 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                  this._offset = this._offset + 1;
                } else {
                  address10 = FAILURE;
                  if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                  }
                  if (this._offset === this._failure) {
                    this._expected.push('")"');
                  }
                }
                if (address10 !== FAILURE) {
                  elements0[5] = address10;
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_repeated_notes(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._repeated_notes[index0] = [address0, this._offset];
      return address0;
    },

    _read_chord: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._chord = this._cache._chord || {};
      var cached = this._cache._chord[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        address2 = this._read_chord_note();
        if (address2 === FAILURE) {
          this._offset = index2;
          address2 = this._read_chord_tied_note();
          if (address2 === FAILURE) {
            this._offset = index2;
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var remaining0 = 0, index3 = this._offset, elements1 = [], address4 = true;
          while (address4 !== FAILURE) {
            var index4 = this._offset, elements2 = new Array(2);
            var address5 = FAILURE;
            var remaining1 = 1, index5 = this._offset, elements3 = [], address6 = true;
            while (address6 !== FAILURE) {
              address6 = this._read__();
              if (address6 !== FAILURE) {
                elements3.push(address6);
                --remaining1;
              }
            }
            if (remaining1 <= 0) {
              address5 = new TreeNode(this._input.substring(index5, this._offset), index5, elements3);
              this._offset = this._offset;
            } else {
              address5 = FAILURE;
            }
            if (address5 !== FAILURE) {
              elements2[0] = address5;
              var address7 = FAILURE;
              var index6 = this._offset;
              address7 = this._read_chord_note();
              if (address7 === FAILURE) {
                this._offset = index6;
                address7 = this._read_chord_tied_note();
                if (address7 === FAILURE) {
                  this._offset = index6;
                }
              }
              if (address7 !== FAILURE) {
                elements2[1] = address7;
              } else {
                elements2 = null;
                this._offset = index4;
              }
            } else {
              elements2 = null;
              this._offset = index4;
            }
            if (elements2 === null) {
              address4 = FAILURE;
            } else {
              address4 = new TreeNode(this._input.substring(index4, this._offset), index4, elements2);
              this._offset = this._offset;
            }
            if (address4 !== FAILURE) {
              elements1.push(address4);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address3 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address8 = FAILURE;
            var chunk1 = null;
            if (this._offset < this._inputSize) {
              chunk1 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk1 === ')') {
              address8 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address8 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('")"');
              }
            }
            if (address8 !== FAILURE) {
              elements0[3] = address8;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_chord(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._chord[index0] = [address0, this._offset];
      return address0;
    },

    _read_chord_note: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._chord_note = this._cache._chord_note || {};
      var cached = this._cache._chord_note[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(11);
      var address1 = FAILURE;
      address1 = this._read_string_number();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        address2 = this._read_slide();
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index2, index2), index2);
          this._offset = index2;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var index3 = this._offset;
          address3 = this._read_prebend();
          if (address3 === FAILURE) {
            address3 = new TreeNode(this._input.substring(index3, index3), index3);
            this._offset = index3;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            var index4 = this._offset;
            address4 = this._read_grace_fret();
            if (address4 === FAILURE) {
              address4 = new TreeNode(this._input.substring(index4, index4), index4);
              this._offset = index4;
            }
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              var index5 = this._offset;
              var chunk0 = null;
              if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
              }
              if (chunk0 === 'g') {
                address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
              } else {
                address5 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('"g"');
                }
              }
              if (address5 === FAILURE) {
                address5 = new TreeNode(this._input.substring(index5, index5), index5);
                this._offset = index5;
              }
              if (address5 !== FAILURE) {
                elements0[4] = address5;
                var address6 = FAILURE;
                var index6 = this._offset;
                var chunk1 = null;
                if (this._offset < this._inputSize) {
                  chunk1 = this._input.substring(this._offset, this._offset + 1);
                }
                if (chunk1 === 'd') {
                  address6 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                  this._offset = this._offset + 1;
                } else {
                  address6 = FAILURE;
                  if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                  }
                  if (this._offset === this._failure) {
                    this._expected.push('"d"');
                  }
                }
                if (address6 === FAILURE) {
                  address6 = new TreeNode(this._input.substring(index6, index6), index6);
                  this._offset = index6;
                }
                if (address6 !== FAILURE) {
                  elements0[5] = address6;
                  var address7 = FAILURE;
                  address7 = this._read_fret_number();
                  if (address7 !== FAILURE) {
                    elements0[6] = address7;
                    var address8 = FAILURE;
                    address8 = this._read_note_duration_ext();
                    if (address8 !== FAILURE) {
                      elements0[7] = address8;
                      var address9 = FAILURE;
                      var index7 = this._offset;
                      var chunk2 = null;
                      if (this._offset < this._inputSize) {
                        chunk2 = this._input.substring(this._offset, this._offset + 1);
                      }
                      if (chunk2 === '_') {
                        address9 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                        this._offset = this._offset + 1;
                      } else {
                        address9 = FAILURE;
                        if (this._offset > this._failure) {
                          this._failure = this._offset;
                          this._expected = [];
                        }
                        if (this._offset === this._failure) {
                          this._expected.push('"_"');
                        }
                      }
                      if (address9 === FAILURE) {
                        address9 = new TreeNode(this._input.substring(index7, index7), index7);
                        this._offset = index7;
                      }
                      if (address9 !== FAILURE) {
                        elements0[8] = address9;
                        var address10 = FAILURE;
                        var index8 = this._offset;
                        address10 = this._read_bend();
                        if (address10 === FAILURE) {
                          address10 = new TreeNode(this._input.substring(index8, index8), index8);
                          this._offset = index8;
                        }
                        if (address10 !== FAILURE) {
                          elements0[9] = address10;
                          var address11 = FAILURE;
                          var index9 = this._offset;
                          address11 = this._read_slide();
                          if (address11 === FAILURE) {
                            address11 = new TreeNode(this._input.substring(index9, index9), index9);
                            this._offset = index9;
                          }
                          if (address11 !== FAILURE) {
                            elements0[10] = address11;
                          } else {
                            elements0 = null;
                            this._offset = index1;
                          }
                        } else {
                          elements0 = null;
                          this._offset = index1;
                        }
                      } else {
                        elements0 = null;
                        this._offset = index1;
                      }
                    } else {
                      elements0 = null;
                      this._offset = index1;
                    }
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_chord_note(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._chord_note[index0] = [address0, this._offset];
      return address0;
    },

    _read_string_number: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._string_number = this._cache._string_number || {};
      var cached = this._cache._string_number[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[1-9]/.test(chunk0)) {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[1-9]');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 === ':') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('":"');
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var remaining0 = 0, index2 = this._offset, elements1 = [], address4 = true;
          while (address4 !== FAILURE) {
            address4 = this._read__();
            if (address4 !== FAILURE) {
              elements1.push(address4);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address3 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_string_number(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._string_number[index0] = [address0, this._offset];
      return address0;
    },

    _read_chord_tied_note: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._chord_tied_note = this._cache._chord_tied_note || {};
      var cached = this._cache._chord_tied_note[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      address1 = this._read_string_number();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 === '_') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"_"');
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_note_duration_ext();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            var index2 = this._offset;
            address4 = this._read_slide();
            if (address4 === FAILURE) {
              address4 = new TreeNode(this._input.substring(index2, index2), index2);
              this._offset = index2;
            }
            if (address4 !== FAILURE) {
              elements0[3] = address4;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_chord_tied_note(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._chord_tied_note[index0] = [address0, this._offset];
      return address0;
    },

    _read_note: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._note = this._cache._note || {};
      var cached = this._cache._note[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(10);
      var address1 = FAILURE;
      var index2 = this._offset;
      address1 = this._read_slide();
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index3 = this._offset;
        address2 = this._read_prebend();
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index3, index3), index3);
          this._offset = index3;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var index4 = this._offset;
          address3 = this._read_grace_fret();
          if (address3 === FAILURE) {
            address3 = new TreeNode(this._input.substring(index4, index4), index4);
            this._offset = index4;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            var index5 = this._offset;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
              chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 === 'g') {
              address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address4 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"g"');
              }
            }
            if (address4 === FAILURE) {
              address4 = new TreeNode(this._input.substring(index5, index5), index5);
              this._offset = index5;
            }
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              var index6 = this._offset;
              var chunk1 = null;
              if (this._offset < this._inputSize) {
                chunk1 = this._input.substring(this._offset, this._offset + 1);
              }
              if (chunk1 === 'd') {
                address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
              } else {
                address5 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('"d"');
                }
              }
              if (address5 === FAILURE) {
                address5 = new TreeNode(this._input.substring(index6, index6), index6);
                this._offset = index6;
              }
              if (address5 !== FAILURE) {
                elements0[4] = address5;
                var address6 = FAILURE;
                address6 = this._read_fret_number();
                if (address6 !== FAILURE) {
                  elements0[5] = address6;
                  var address7 = FAILURE;
                  address7 = this._read_note_duration_ext();
                  if (address7 !== FAILURE) {
                    elements0[6] = address7;
                    var address8 = FAILURE;
                    var index7 = this._offset;
                    var chunk2 = null;
                    if (this._offset < this._inputSize) {
                      chunk2 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk2 === '_') {
                      address8 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                      this._offset = this._offset + 1;
                    } else {
                      address8 = FAILURE;
                      if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                      }
                      if (this._offset === this._failure) {
                        this._expected.push('"_"');
                      }
                    }
                    if (address8 === FAILURE) {
                      address8 = new TreeNode(this._input.substring(index7, index7), index7);
                      this._offset = index7;
                    }
                    if (address8 !== FAILURE) {
                      elements0[7] = address8;
                      var address9 = FAILURE;
                      var index8 = this._offset;
                      address9 = this._read_bend();
                      if (address9 === FAILURE) {
                        address9 = new TreeNode(this._input.substring(index8, index8), index8);
                        this._offset = index8;
                      }
                      if (address9 !== FAILURE) {
                        elements0[8] = address9;
                        var address10 = FAILURE;
                        var index9 = this._offset;
                        address10 = this._read_slide();
                        if (address10 === FAILURE) {
                          address10 = new TreeNode(this._input.substring(index9, index9), index9);
                          this._offset = index9;
                        }
                        if (address10 !== FAILURE) {
                          elements0[9] = address10;
                        } else {
                          elements0 = null;
                          this._offset = index1;
                        }
                      } else {
                        elements0 = null;
                        this._offset = index1;
                      }
                    } else {
                      elements0 = null;
                      this._offset = index1;
                    }
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_note(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._note[index0] = [address0, this._offset];
      return address0;
    },

    _read_tied_note: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._tied_note = this._cache._tied_note || {};
      var cached = this._cache._tied_note[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '_') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"_"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_note_duration_ext();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var index2 = this._offset;
          address3 = this._read_slide();
          if (address3 === FAILURE) {
            address3 = new TreeNode(this._input.substring(index2, index2), index2);
            this._offset = index2;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_tied_note(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._tied_note[index0] = [address0, this._offset];
      return address0;
    },

    _read_bend: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._bend = this._cache._bend || {};
      var cached = this._cache._bend[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 2);
      }
      if (chunk0 === 'b(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
        this._offset = this._offset + 2;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"b("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 3);
        }
        if (chunk1 === '/\\/') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
          this._offset = this._offset + 3;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"/\\\\/"');
          }
        }
        if (address2 === FAILURE) {
          this._offset = index2;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 2);
          }
          if (chunk2 === '/\\') {
            address2 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
            this._offset = this._offset + 2;
          } else {
            address2 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"/\\\\"');
            }
          }
          if (address2 === FAILURE) {
            this._offset = index2;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk3 === '/') {
              address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address2 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"/"');
              }
            }
            if (address2 === FAILURE) {
              this._offset = index2;
            }
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk4 = null;
          if (this._offset < this._inputSize) {
            chunk4 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk4 === ')') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_bend(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._bend[index0] = [address0, this._offset];
      return address0;
    },

    _read_prebend: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._prebend = this._cache._prebend || {};
      var cached = this._cache._prebend[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 2);
      }
      if (chunk0 === 'b(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
        this._offset = this._offset + 2;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"b("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 2);
        }
        if (chunk1 === '/\\') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
          this._offset = this._offset + 2;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"/\\\\"');
          }
        }
        if (address2 === FAILURE) {
          this._offset = index2;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === '/') {
            address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address2 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"/"');
            }
          }
          if (address2 === FAILURE) {
            this._offset = index2;
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk3 = null;
          if (this._offset < this._inputSize) {
            chunk3 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk3 === ')') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_prebend(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._prebend[index0] = [address0, this._offset];
      return address0;
    },

    _read_slide: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._slide = this._cache._slide || {};
      var cached = this._cache._slide[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[\\/]/.test(chunk0)) {
        address0 = this._actions.make_slide(this._input, this._offset, this._offset + 1);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[\\\\/]');
        }
      }
      this._cache._slide[index0] = [address0, this._offset];
      return address0;
    },

    _read_silence: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._silence = this._cache._silence || {};
      var cached = this._cache._silence[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '-') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"-"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_note_duration_ext();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_silence(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._silence[index0] = [address0, this._offset];
      return address0;
    },

    _read_fret_number: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._fret_number = this._cache._fret_number || {};
      var cached = this._cache._fret_number[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 !== null && /^[0-9]/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('[0-9]');
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._fret_number[index0] = [address0, this._offset];
      return address0;
    },

    _read_grace_fret: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._grace_fret = this._cache._grace_fret || {};
      var cached = this._cache._grace_fret[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 1, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[0-9]/.test(chunk1)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[0-9]');
            }
          }
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === ')') {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._grace_fret[index0] = [address0, this._offset];
      return address0;
    },

    _read_tempo: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._tempo = this._cache._tempo || {};
      var cached = this._cache._tempo[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(7);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 6);
      }
      if (chunk0 === 'tempo(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset);
        this._offset = this._offset + 6;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"tempo("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_note_duration();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var remaining0 = 0, index2 = this._offset, elements1 = [], address4 = true;
          while (address4 !== FAILURE) {
            address4 = this._read__();
            if (address4 !== FAILURE) {
              elements1.push(address4);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address3 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address5 = FAILURE;
            var chunk1 = null;
            if (this._offset < this._inputSize) {
              chunk1 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk1 === ',') {
              address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address5 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('","');
              }
            }
            if (address5 !== FAILURE) {
              elements0[3] = address5;
              var address6 = FAILURE;
              address6 = this._read_tempo_value();
              if (address6 !== FAILURE) {
                elements0[4] = address6;
                var address7 = FAILURE;
                var remaining1 = 0, index3 = this._offset, elements2 = [], address8 = true;
                while (address8 !== FAILURE) {
                  address8 = this._read__();
                  if (address8 !== FAILURE) {
                    elements2.push(address8);
                    --remaining1;
                  }
                }
                if (remaining1 <= 0) {
                  address7 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
                  this._offset = this._offset;
                } else {
                  address7 = FAILURE;
                }
                if (address7 !== FAILURE) {
                  elements0[5] = address7;
                  var address9 = FAILURE;
                  var chunk2 = null;
                  if (this._offset < this._inputSize) {
                    chunk2 = this._input.substring(this._offset, this._offset + 1);
                  }
                  if (chunk2 === ')') {
                    address9 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                    this._offset = this._offset + 1;
                  } else {
                    address9 = FAILURE;
                    if (this._offset > this._failure) {
                      this._failure = this._offset;
                      this._expected = [];
                    }
                    if (this._offset === this._failure) {
                      this._expected.push('")"');
                    }
                  }
                  if (address9 !== FAILURE) {
                    elements0[6] = address9;
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_tempo(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._tempo[index0] = [address0, this._offset];
      return address0;
    },

    _read_triplet_feel: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._triplet_feel = this._cache._triplet_feel || {};
      var cached = this._cache._triplet_feel[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 8);
      }
      if (chunk0 === 'triplet(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 8), this._offset);
        this._offset = this._offset + 8;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"triplet("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 === 'e') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"e"');
          }
        }
        if (address2 === FAILURE) {
          this._offset = index2;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === 's') {
            address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address2 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"s"');
            }
          }
          if (address2 === FAILURE) {
            this._offset = index2;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 3);
            }
            if (chunk3 === 'off') {
              address2 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
              this._offset = this._offset + 3;
            } else {
              address2 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"off"');
              }
            }
            if (address2 === FAILURE) {
              this._offset = index2;
            }
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk4 = null;
          if (this._offset < this._inputSize) {
            chunk4 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk4 === ')') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_triplet_feel(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._triplet_feel[index0] = [address0, this._offset];
      return address0;
    },

    _read_marker: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._marker = this._cache._marker || {};
      var cached = this._cache._marker[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 7);
      }
      if (chunk0 === 'marker(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
        this._offset = this._offset + 7;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"marker("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[^\n^\r^).]/.test(chunk1)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[^\\n^\\r^).]');
            }
          }
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === ')') {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_marker(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._marker[index0] = [address0, this._offset];
      return address0;
    },

    _read_note_duration_ext: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._note_duration_ext = this._cache._note_duration_ext || {};
      var cached = this._cache._note_duration_ext[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      address1 = this._read_note_duration();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 === '.') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"."');
          }
        }
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index2, index2), index2);
          this._offset = index2;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var index3 = this._offset;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 === 't') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"t"');
            }
          }
          if (address3 === FAILURE) {
            address3 = new TreeNode(this._input.substring(index3, index3), index3);
            this._offset = index3;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_note_duration_ext(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._note_duration_ext[index0] = [address0, this._offset];
      return address0;
    },

    _read_note_duration: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._note_duration = this._cache._note_duration || {};
      var cached = this._cache._note_duration[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === 'w') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"w"');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 === 'h') {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"h"');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === 'q') {
            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"q"');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk3 === 'e') {
              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address0 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"e"');
              }
            }
            if (address0 === FAILURE) {
              this._offset = index1;
              var chunk4 = null;
              if (this._offset < this._inputSize) {
                chunk4 = this._input.substring(this._offset, this._offset + 1);
              }
              if (chunk4 === 's') {
                address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
              } else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('"s"');
                }
              }
              if (address0 === FAILURE) {
                this._offset = index1;
                var chunk5 = null;
                if (this._offset < this._inputSize) {
                  chunk5 = this._input.substring(this._offset, this._offset + 1);
                }
                if (chunk5 === 't') {
                  address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                  this._offset = this._offset + 1;
                } else {
                  address0 = FAILURE;
                  if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                  }
                  if (this._offset === this._failure) {
                    this._expected.push('"t"');
                  }
                }
                if (address0 === FAILURE) {
                  this._offset = index1;
                  var chunk6 = null;
                  if (this._offset < this._inputSize) {
                    chunk6 = this._input.substring(this._offset, this._offset + 1);
                  }
                  if (chunk6 === 'i') {
                    address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                    this._offset = this._offset + 1;
                  } else {
                    address0 = FAILURE;
                    if (this._offset > this._failure) {
                      this._failure = this._offset;
                      this._expected = [];
                    }
                    if (this._offset === this._failure) {
                      this._expected.push('"i"');
                    }
                  }
                  if (address0 === FAILURE) {
                    this._offset = index1;
                  }
                }
              }
            }
          }
        }
      }
      this._cache._note_duration[index0] = [address0, this._offset];
      return address0;
    },

    _read_tempo_value: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._tempo_value = this._cache._tempo_value || {};
      var cached = this._cache._tempo_value[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[1-9]/.test(chunk0)) {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[1-9]');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[0-9]/.test(chunk1)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[0-9]');
            }
          }
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._tempo_value[index0] = [address0, this._offset];
      return address0;
    },

    _read_newline: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._newline = this._cache._newline || {};
      var cached = this._cache._newline[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var index2 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[\r]/.test(chunk0)) {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[\\r]');
        }
      }
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 !== null && /^[\n]/.test(chunk1)) {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('[\\n]');
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._newline[index0] = [address0, this._offset];
      return address0;
    },

    _read__: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache.__ = this._cache.__ || {};
      var cached = this._cache.__[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[ \t]/.test(chunk0)) {
        address0 = this._actions.make_whitespace(this._input, this._offset, this._offset + 1);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[ \\t]');
        }
      }
      this._cache.__[index0] = [address0, this._offset];
      return address0;
    }
  };

  var Parser = function(input, actions, types) {
    this._input = input;
    this._inputSize = input.length;
    this._actions = actions;
    this._types = types;
    this._offset = 0;
    this._cache = {};
    this._failure = 0;
    this._expected = [];
  };

  Parser.prototype.parse = function() {
    var tree = this._read_song();
    if (tree !== FAILURE && this._offset === this._inputSize) {
      return tree;
    }
    if (this._expected.length === 0) {
      this._failure = this._offset;
      this._expected.push('<EOF>');
    }
    this.constructor.lastError = {offset: this._offset, expected: this._expected};
    throw new SyntaxError(formatError(this._input, this._failure, this._expected));
  };

  var parse = function(input, options) {
    options = options || {};
    var parser = new Parser(input, options.actions, options.types);
    return parser.parse();
  };
  extend(Parser.prototype, Grammar);

  var exported = {Grammar: Grammar, Parser: Parser, parse: parse};

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.TABDOWN = exported;
  }
})();
