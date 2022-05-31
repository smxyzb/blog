# commit

## git commit -m 'xxxx'

### --amend 撤销最近的一个 commit，并产生新的 commit。常用语 commit msg 写错的时候修改信息

# 想修改最近一次未push的commit信息，可以使用
```
git commit --amend --only // 进入vim 编辑

git commit --amend --only -m 'xxxxx'
```

# 从一个commit中移除一个不需要的文件
```
git checkout HEAD filename
git add -A
git commit --amend
```

# 交互式选择要提交的文件
```
git add -p
```
