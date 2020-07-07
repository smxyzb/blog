# Git

## git 工作流程

## rebase 和 merge

### 都是合并代码

### merge 会保留所有的历史 commit 记录

### rebase 会对之前定的 commit 进行裁剪合并，生成一个新的 commit，产生一个更清晰的提交历史记录

## reset , reverse，

### reset 是直接修改 HEAD 版本位置，指向固定的版本,后面的八版本将不存在

### revert 是用于“反做”某一个版本，以达到撤销该版本的修改的目的。他后面的版本会被保留，并且会生成一个新的版本

## git fetch 与 git pull 的区别

    git fetch：这将更新git remote 中所有的远程仓库所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中
    git pull : 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，然后git fetch 获得当前指向的远程分支
    的后续版本的数据，然后再利用git merge将其与本地的当前分支合并。所以可以认为git pull是git fetch和git merge两个步骤的结合
