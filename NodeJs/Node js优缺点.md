# 优点

## 可以再不新增线程的情况下对任务进行并发处理，原理就是通过事件循环（Eventloop）实现

## 非阻塞时 I/O 操作，运行速度快，可用于 I/O 密集操作

## 轻量、可伸缩，适于实时数据交互应用

# 缺点：

## 单进程，单线程，不适用与 CPU 密集型操作，如果中间出现占用 cou 的任务，会导致后面的任务无法进行

## 只支持单核 CPU，不能充分利用 CPU

## 可靠性低，一旦代码某个环节崩溃，整个系统都崩溃
