Vue.component('description', {
  template: `
    <div class="card">
      <div class="card-header">
        使用说明
      </div>
      <div class="card-body">
        <p>1. 这里是代码生成平台，可以一键生成代码并自动提交到对应的 Gitlab 仓库，本地拉取最新代码即可看到生成的代码；</p>
        <p>2. 目前只支持后端代码生成；</p>
        <p>3. 代码会直接提交到项目的默认分支；</p>
        <p>4. 填写代码生成需要的参数，并选择对应的后端业务项目与代码合并目录，点击开始生成等待提示成功。</p>
      </div>
    </div>`
})
