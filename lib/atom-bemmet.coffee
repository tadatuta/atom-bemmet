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
        bemjson = bemmet.stringify(selection)
        editor.insertText(bemjson)
