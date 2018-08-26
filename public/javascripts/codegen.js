Vue.component('codegen', {
  template: `
    <div class="card" style="margin-top: 10px;">
      <div class="card-header">
        代码生成
      </div>
      <div class="card-body">
        <form action="">
          <div class="row">
            <div class="col-3">
              <div class="form-group">
                <label for="jdbcUrlId">数据库连接</label>
                <input type="text" class="form-control" id="jdbcUrlId" 
                       placeholder="数据库连接" v-model="config.jdbcUrl">
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label for="jdbcDriverId">数据库驱动</label>
                <input type="text" class="form-control" id="jdbcDriverId" 
                       placeholder="数据库驱动" v-model="config.jdbcDriver">
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label for="jdbcUsernameId">数据库用户</label>
                <input type="text" class="form-control" id="jdbcUsernameId" 
                       placeholder="数据库用户" v-model="config.jdbcUsername">
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label for="jdbcPasswordId">数据库密码</label>
                <input type="text" class="form-control" id="jdbcPasswordId" 
                       placeholder="数据库密码" v-model="config.jdbcPassword">
              </div>
            </div>
          </div>
          <button type="submit" onclick="return false;" 
                  @click="submit" class="btn btn-primary">生成代码</button>
        </form>
      </div>
    </div>`,
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
      }
    }
  },
  methods: {
    submit() {
      console.log(this.config)
    }
  }
})
