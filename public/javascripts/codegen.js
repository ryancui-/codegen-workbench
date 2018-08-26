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
      console.log(this.config)
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
    /**
     * 加载项目根路径
     * @param projectId
     */
    getProjectTopDir(projectId) {
      const that = this

      $.ajax({
        url: 'http://mock.366cs.cn/mock/25/listProjectTree',
        dataType: 'json',
        success(data) {
          that.topDirList = data.data.filter(i => i.type === 'tree')
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
    $.ajax({
      url: 'http://mock.366cs.cn/mock/25/projectList',
      dataType: 'json',
      success(data) {
        that.projectList = data.data
      }
    })
  }
})
