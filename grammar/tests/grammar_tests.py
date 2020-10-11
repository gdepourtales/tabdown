import unittest
import os
import grammar.tabdown

dirname = os.path.dirname(__file__)


class Actions(object):
    def process_note(selfself, input, start, end, elements):
        print("duration:", elements[1].text, ", string:", elements[0].text, ", fret:", elements[2].text)
        return elements


class MyTestCase(unittest.TestCase):
    def test_simple(self):
        simple_tabdown_file = open(os.path.join(dirname, 'files/simple.tabdown'))
        tree = grammar.tabdown.parse(simple_tabdown_file.read(), actions=Actions())
        simple_tabdown_file.close()

        print(tree.text)


if __name__ == '__main__':
    unittest.main()
