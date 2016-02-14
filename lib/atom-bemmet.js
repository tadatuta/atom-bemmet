var CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
    subscriptions: null,
    activate: function(state) {
        var _this = this;

        this.subscriptions = new CompositeDisposable;
        return this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-bemmet:convert': function() {
                return _this.convert();
            }
        }));
    },
    deactivate: function() {
        return this.subscriptions.dispose();
    },
    convert: function() {
        var editor = atom.workspace.getActiveTextEditor();

        if (!editor) return;

        var bemmet = require('bemmet'),
            selection = editor.getSelectedText(),
            caretPos = editor.getCursorBufferPosition(),
            rangeBeforeCaret = [[0, 0], caretPos],
            textBeforeCaret = editor.getTextInBufferRange(rangeBeforeCaret);

        if (selection && !(new RegExp(selection + '$')).test(textBeforeCaret)) {
            rangeBeforeCaret = [[0, 0], [caretPos.row, caretPos.column + selection.length]];
            textBeforeCaret += selection;
        }

        if (!selection) {
            var textBeforeCaretNoSpaces = textBeforeCaret.replace(/\{(.*)\}/g, function(str) {
                return str.replace(/\ /g, 'S');
            });

            var lastSpaceSymbol = /\s/.exec(textBeforeCaretNoSpaces.split('').reverse().join('')),
                spaceNearCaretIdx = lastSpaceSymbol && textBeforeCaretNoSpaces.lastIndexOf(lastSpaceSymbol[0]);

            selection = ((typeof spaceNearCaretIdx !== null && spaceNearCaretIdx > -1) ? textBeforeCaret.substr(spaceNearCaretIdx) : textBeforeCaret).trim();
        }

        var parentBlock = /block['"\s]*:(?:\s)?['"]{1}(.*?)['"]{1}/.exec(textBeforeCaret.substr(textBeforeCaret.lastIndexOf('block')));
        parentBlock && parentBlock[1] && (parentBlock = parentBlock[1]);

        var bemjson = '';

        try {
            bemjson = bemmet.stringify(selection, parentBlock);
        } catch(err) {
            console.error(err);
        }

        var indexOfSelection = textBeforeCaret.lastIndexOf(selection),
            replacedContent = '';

        if (bemjson && indexOfSelection >= 0) {
            replacedContent = textBeforeCaret.substring(0, indexOfSelection) + bemjson + textBeforeCaret.substring(indexOfSelection + selection.length);
        }

        return replacedContent && editor.setTextInBufferRange(rangeBeforeCaret, replacedContent);
    }
};
