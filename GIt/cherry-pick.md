# cherry-pick: 转移单个或多个commit 到其他分支

```
git cherry-pick <commitHash> // 单个转移

git cherry-pick <HashA> <HashB> // 多个转移
```

## 假如有一个分支main，修改了多个bug，并且已经提交为A,B
## 此时 main 有两个commit，A-hash,B-hash。但是我们希望这两个修改是分开的，不能合并在一起。
### 首先恢复 main 分支到这两个提交前的状态 git reset --hard Aheadxxxxx
### 基于main 新建两个 分支 branchA,branchB
### 分别在分支A,B 上使用 git cherry-pick HashA,HashB, 分别提交到分支A,B 上了

## 转移 A到B之间的一系列提交，顺序必须与commit 的顺序一致，否则会失败，但不会报错
```
git cherry-pick A..B  // 不包含 A

git cherry-pick A^..B  // 包含 A

```

## 参数 
### -e | --edit ：编辑提交信息
### -n | --no-commit ：只更新工作区和暂存区，不产生新的 commit
### -x ：在commit 后面追加一行 注释信息 （cherry picked from commit xxxx）
### -s | --signoff ：在commit 后面追加一行签名信息，表示谁进行了这个操作
### -m parent-number | -mainline parent-number : -m 告诉 Git应该采用哪个分支的变动。它的参数parent-number是一个从1开始的整数，代表原始提交的父分支编号
```
 git cherry-pick -m 1 <commitHash>
```

## 冲突
### --continue ：解决冲突后，一定先git add .,然后执行 git cherry-pick --continue
### --abort : 中断chrry-pick， 代码回到之前的状态
### --quit ：退出 cherry-pick ，但是代码不会回滚

## 转移代码库
### 先将 要转移的代码库加为远程仓库
```
git remote add target git://gitxxxxx

```
### 拉取远程代码库到本地
```
 git fetch target
```

### 获取要转移的远程仓库的提交 hash 值  <commitHash>
```
git log target/master
```

### 执行转移，git cherry-pick <commitHash>