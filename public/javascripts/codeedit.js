Vue.component('codeedit', {
  template: '#codeEdit',
  data() {
    return {}
  },
  mounted() {
    const editor = CodeMirror(document.getElementById('editor'), {
      lineNumbers: true,
      tabSize: 2,
      lineWrapping: true
    })

    editor.setOption('extraKeys', {
      Tab: cm => {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
        cm.replaceSelection(spaces)
      }
    })

    var zNodes = [
      {
        name: "test1", open: true, children: [
          {name: "test1_1"}, {name: "test1_2"}]
      },
      {
        name: "test2", open: true, children: [
          {name: "test2_1"}, {name: "test2_2"}]
      }
    ]

    zTreeObj = $.fn.zTree.init($("#fileTree"), {}, zNodes)
  }
})
