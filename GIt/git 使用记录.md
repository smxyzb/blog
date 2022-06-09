# Git

## 查看最近一次提交修改内容 git show

## git fetch 与 git pull 的区别

### git fetch：
#### 更新 git remote 中所有的远程仓库所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中。
#### 但是并不会改变本地仓库的状态，也不会更新本地仓库的分支。

### git pull : 
#### 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，
#### 然后 git fetch 获得当前指向的远程分支的后续版本的数据，
#### 最后再利用 git merge将其与本地的当前分支合并。所以可以认为git pull是git fetch和git merge两个步骤的结合。

### git fetch 后 也可以使用以下操作更新本地分支状态
```
git cherry-pick o/main
git rebase o/main
git merge o/main
// ...
```

## git push 参数

### git push [origin] [source] ： origin 标识远程仓库，source 标识本地仓库中的分支，即降本地分支source 推送到远程仓库origin/source 分支。

### git push origin [source]:[destination]: 将本地分支 source 推送到远程仓库 origin/destination 分支。
#### source 可以是任何 Git 能识别的位置
#### destination 可以是任何远程分支，当远程不存在destination分支时，会自动创建。