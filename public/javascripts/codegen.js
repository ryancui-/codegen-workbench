const projectUrl = '/api/listProjects'
const treeUrl = '/api/listProjectTree'

Vue.component('codegen', {
  template: '#codegenTpl',
  data() {
    return {
      config: {
        jdbcUrl: '',
        jdbcDriver: 'com.mysql.jdbc.Driver',
        jdbcUsername: '',
        jdbcPassword: '',
        tableName: '',
        moduleName: '',
        beanName: '',
        projectId: null,
        branchName: '',
        mergeDir: ''
      },
      selectedProject: null,
      selectedDir: null,
      projectList: [],
      topDirList: []
    }
  },
  methods: {
    submit() {
      $('body').loading('start')
      $.ajax({
        url: '/api/codegen',
        data: this.config,
        method: 'POST',
        dataType: 'json',
        success(data) {
          $('body').loading('stop')
          if (data.success) {
            alert('成功')
          } else {
            alert('失败' + data.msg)
          }
        }
      })
    },
    selectProject(project) {
      this.selectedProject = project

      // 加载对应的根目录列表
      this.getProjectTopDir(this.selectedProject.id)

      this.config.projectId = this.selectedProject.id
      this.config.branchName = this.selectedProject.default_branch
      this.config.mergeDir = ''
    },
    selectDir(dir) {
      this.selectedDir = dir

      this.config.mergeDir = this.selectedDir.path
    },
    getProjectTopDir(projectId) {
      const that = this

      $('body').loading('start')
      $.ajax({
        url: treeUrl + '/' + projectId,
        dataType: 'json',
        success(data) {
          that.topDirList = data.filter(i => i.type === 'tree')
          $('body').loading('stop')
        }
      })
    }
  },
  computed: {
    canSubmit() {
      return this.config.jdbcUrl && this.config.jdbcDriver
        && this.config.jdbcUsername && this.config.jdbcPassword
        && this.config.tableName && this.config.moduleName && this.config.beanName
        && this.config.projectId && this.config.branchName && this.config.mergeDir
    }
  },
  created() {
    const that = this

    $('body').loading('start')
    $.ajax({
      url: projectUrl,
      dataType: 'json',
      success(data) {
        that.projectList = data
        $('body').loading('stop')
      }
    })
  }
})
