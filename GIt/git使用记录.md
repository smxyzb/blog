# Git

## git 工作流程

## git commit -m 'xxxx'
### --amend 撤销最近的一个 commit，并产生新的 commit。常用语 commit msg 写错的时候修改信息
## rebase 和 merge (假如两个分支 a 和 b )
```
// branch a 有commit1，commit2
// branch b 有commit3，commit4
```
### 都是合并代码

### merge 会保留所有的历史 commit 记录，并且按提交时间顺序排序，产生一个新的 merge commit
```
git checkout a
git merge b
git log
// 可以看到 commit 顺序为 commit1，commit2 ，commit3，commit4

```
### 分支合并：git rebase xxx
#### 将 xxx 分支的所有提交都迁移到当前分支的所有未push 的 commit 之前，与 merge不同的是 rebase 会将合入的分支的commit 往前提
```
git checkout a
git rebase b
git log
```
可以看到 commit 顺序为 commit3，commit4 ，newcommit1，newcommit2。当前 b 分支的两个commit会被删除，并且创建对应的新的commit hash，合并进来的a 分支的两个 commit 保持不变
适用于同步进行开发的不同分支合入主分支
<strong>注意：rebase 不能用于公共分支操作，不要基于rebase的分支checkout新分支！！！</strong>
<strong>注意：rebase 冲突问题</strong>
<strong>1、解决冲突，保存</strong>
<strong>2、git add .</strong>
<strong>3、不要执行 git commit ！！！ </strong>
<strong>4、git rebase --continue </strong>


### 交互式 git rebase -i [startPonit] [endPoint]。假如有四个 commit 分别是, a,b,c,d ,hash 分别是 ahash,bhash,chash,dhash。可以进行合并、删除、移动 commit 操作
```
git rebase -i bhash

// pick ahash fix:测试
// s    xxxhash  feat:测试0
```
可以对 bhash 后面的commit 做修改，具体操作参数如下表，如果是后面有多条，可以对 commit 进行顺序上的调整

|  命令	  |  缩写  |	含义       |
|  ----   | ----  |
|  pick	  |   p   | 保留该commit|
|  ----   | ----  |
|  reword	|   r   |保留该commit，但需要修改该commit的注释|
|  ----   | ----  |
|  edit	  |   e	  |保留该commit, 但我要停下来修改该提交(不仅仅修改注释)|
|  ----   | ----  |
|  squash |	  s   |将该commit合并到前一个commit|
|  ----   | ----  |
|  fixup  |   f   |将该commit合并到前一个commit，但不要保留该提交的注释信息|
|  ----   | ----  |
|  exec   |	  x   |执行shell命令|
|  ----   | ----  |
|  drop   |	  d	  |丢弃该commit|

## 重置本地修改 reset , revert , reflog

### reset 是直接修改 HEAD 版本位置，指向固定的版本,后面的八版本将不存在

### revert 是用于“反做”某一个版本，以达到撤销该版本的修改的目的。他后面的版本会被保留，并且会生成一个新的版本
```
git revert HEAD
```

### reflog 用于恢复项目历史记录，他显示的是HEAD变更次数的列表。可恢复任何已提交的内容。场景比如 之前通过reset --hard 恢复到了某个commit，但是又想保留还原之后的一些更改。
1、如果想恢复到某次提交，直接 git reset --hard HEAD
2、如果想恢复某次提交的某些文件，使用 git checkout -- file
3、如果想恢复到某次提交，使用 git cherry-pick
<strong>reflog 不会一直存在，会被定期清理</strong>
<strong>reflog 只是本地的更变记录</strong>


## git fetch 与 git pull 的区别

    git fetch：这将更新git remote 中所有的远程仓库所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中
    git pull : 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，然后git fetch 获得当前指向的远程分支
    的后续版本的数据，然后再利用git merge将其与本地的当前分支合并。所以可以认为git pull是git fetch和git merge两个步骤的结合
