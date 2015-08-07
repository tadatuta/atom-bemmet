{CompositeDisposable} = require 'atom'

module.exports = AtomBemmet =
  subscriptions: null

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-bemmet:convert': => @convert()

  deactivate: ->
    @subscriptions.dispose()

  convert: ->
    if editor = atom.workspace.getActiveTextEditor()
        bemmet = require 'bemmet'
        selection = editor.getSelectedText()
        caretPos = editor.getCursorBufferPosition()
        rangeBeforeCaret = [[0, 0], caretPos]
        textBeforeCaret = editor.getTextInBufferRange(rangeBeforeCaret)
        if !selection
            textBeforeCaretNoSpaces = textBeforeCaret.replace(/\{(.*)\}/g, (str) ->
                str.replace(/\ /g, 'S'); # S is used as a space placeholder
            )
            spaceNearCaretIdx = textBeforeCaretNoSpaces.lastIndexOf(' ')
            selection = (if spaceNearCaretIdx > -1 then textBeforeCaret.substr(spaceNearCaretIdx) else textBeforeCaret).trim()

        # regexp gets 'b1' from strings like { block: 'b1' }
        parentBlock = /block['"\s]*:(?:\s)?['"]{1}(.*?)['"]{1}/
          .exec(textBeforeCaret.substr(textBeforeCaret.lastIndexOf('block')));

        parentBlock && parentBlock[1] && (parentBlock = parentBlock[1])

        bemjson = bemmet.stringify(selection, parentBlock)
        editor.setTextInBufferRange(rangeBeforeCaret, textBeforeCaret.replace(selection, bemjson))
