<html>
	Stateful（有状态） 和 stateless（无状态） widgets
什么是重点?

有些widgets是有状态的, 有些是无状态的
如果用户与widget交互，widget会发生变化，那么它就是有状态的.
widget的状态（state）是一些可以更改的值, 如一个slider滑动条的当前值或checkbox是否被选中.
widget的状态保存在一个State对象中, 它和widget的布局显示分离。
当widget状态改变时, State 对象调用setState(), 告诉框架去重绘widget.
</html>