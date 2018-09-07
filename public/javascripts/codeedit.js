Vue.component('codeedit', {
  template: '#codeEdit',
  data() {
    return {
      treeObj: null,
      editor: null,
      currentPath: ''
    }
  },
  mounted() {
    this.initCodeMirror()
    this.loadTemplateTree('platform-service-template')
  },
  methods: {
    loadTemplateTree(templateName) {
      const that = this

      $('body').loading('start')
      $.ajax({
        method: 'GET',
        url: `/api/listTemplateTree/${templateName}`,
        dataType: 'json',
        success(data) {
          that.initZtree(data)
        }
      })
    },
    initCodeMirror() {
      this.editor = CodeMirror(document.getElementById('editor'), {
        lineNumbers: true,
        tabSize: 2,
        lineWrapping: true
      })

      this.editor.setOption('extraKeys', {
        Tab: cm => {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
          cm.replaceSelection(spaces)
        }
      })
    },
    saveCode() {
      const that = this
      const content = this.editor.getValue()

      $('body').loading('start')
      $.ajax({
        method: 'POST',
        url: '/api/writeFile',
        data: {
          path: that.currentPath,
          content
        },
        dataType: 'json',
        success(data) {
          $('body').loading('stop')
          if (data.success) {
            alert('保存成功')
          } else {
            alert('保存失败')
          }
        }
      })
    },
    initZtree(treedata) {
      const that = this

      this.treeObj = $.fn.zTree.init($("#fileTree"), {
        callback: {
          onClick: (evt, treeid, treeNode) => {
            if (treeNode.type === 'file') {

              if (treeNode.filename.endsWith('.java')) {
                that.editor.setOption('mode', 'text/x-java')
              } else if (treeNode.filename.endsWith('.xml')) {
                that.editor.setOption('mode', 'application/xml')
              } else {
                that.editor.setOption('mode', 'text')
              }

              $('body').loading('start')
              $.ajax({
                method: 'POST',
                url: '/api/readFile',
                data: {
                  path: treeNode.path
                },
                dataType: 'text',
                success(data) {
                  that.currentPath = treeNode.path
                  that.editor.setValue(data)

                  $('body').loading('stop')
                }
              })
            }
          }
        },
        data: {
          key: {
            name: 'filename'
          }
        }
      }, treedata)
    }
  }
})
