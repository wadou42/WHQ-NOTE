### 新服务器设置git
下载git
```bash
apt install git -y
```

配置邮箱账户  
```bash
git config --global user.name "wanghongqi"
git config --global user.email "wanghongqi@tju.edu.cn"
```

服务器生成rsa
```bash
ssh-keygen -t rsa 
# 之后就可以上传至gitee等平台，但是注意，很多服务器可能并不支持ssh，只能使用https
ssh -T git@github.com   # verify
```


### 本地已有代码，从头创建仓库
远程先创建一个空的仓库, 不用加README文件
本地
```bash
git remote add origin git@github.com:wadou42/SRTuner.git

git add .
git commit -m "init"
git push -u origin master
```

### 网络代理
设置代理、取消代理
```bash

git remote set-url origin git@github.com:wadou42/Autotunning.git
```

### 添加ssh
```bash
ssh-keygen -t rsa -C "wanghongqi@tju.edu.cn"
cat .ssh/id_rsa.pub
```
### 创建分支
从`master`分支创建新的`dev-123`分支
```bash
git fetch
git checkout master           # 切换到基准分支
git pull origin master        # 确保本地 master 分支最新
git checkout -b dev  # 创建新分支(这里默认以当前分支创建，也可以加上master)
# git checkout -b dev master
git push -u origin dev # 推送新分支到远程
```
### 从远程同步分支
将刚创建的分支push到远程仓库之后，在一台新的服务器上如何获取这个分支呢：
```bash
git checkout -b refactor origin/refactor

# 如果是一个新的服务器，可以这样同步所有的分支
for branch in $(git branch -r | grep -v 'HEAD'); do git checkout --track "$branch"; done
```

### 工作流
```bash
# 同步gitee主分支内容
git checkout master
git fetch
git log origin/master || git diff master origin/master
git merge origin/master || git rebase origin/master

# 创建一个新分支用于开发
git checkout -b feature/your-new-feature-name

# 开发
git add 
git commit

# 推送分支到远端
git push -u origin feature/your-new-feature-name

# 在gitee上提pull request合并 feature/your-new-feature-name 到 master（如果需要别人review的话，就指定人）

# 在pull request通过的时候删除gitee上的相关分支
# 同步一次gitee主分支内容，然后删除本地分支
```
Q：如果分支落后几个commit，又领先几个commit 怎么操作？
A：先在自己的master上pull origin/master，然后git merge到自己的分支，最后再commit
Q：如何将某一个文件恢复到上一次commit？
A：git checkout -- file_path 或者使用git restore file;
### restore命令
```bash
git restore file;
git restore --staged file
```

### commit 规范
• `feat`: 新功能 (如新实验脚本)。
• `fix`: 修复 Bug (如 Loss NaN 问题)。
• `build`: 影响构建或外部依赖 (如 `.gitattributes`, `Dockerfile`)。
• `data`: (自定义) 提交模型权重、实验结果或数据集。
• `docs`: 仅文档修改。
• `refactor`: 代码重构，不影响逻辑。

**修改最后一次提交信息**：`git commit --amend -m "新消息"`。

### Git LFS

• 核心比喻：LFS 像“行李寄存处”，Git 仓库只存“寄存小票”（指针文件）。
• 初始化：`git lfs install` (全局执行一次)。
• 追踪规则：`git lfs track "*.pth"` (生成 `.gitattributes`)。
• 关键步骤：必须 `git add .gitattributes` 并提交，规则才能生效。
• 检查状态：使用 `git lfs ls-files` 查看哪些文件已被 LFS 接管。