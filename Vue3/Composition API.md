# 优势
## 逻辑复用的时候，比mixin更加灵活，数据来源更清晰，不会造成命名冲突
## 
## tree-shaking更加友好

## 更好的逻辑复用 ：逻辑复用的时候，比mixin更加灵活，数据来源更清晰，不会造成命名冲突
## 更灵活的代码组织：默认情况下就能让大多数人写出更具组织性的代码
## 更好的类型推导：组合式 API 主要利用基本的变量和函数，它们本身就是类型友好的
## 更小的生产包体积：<script setup> 形式书写的组件模板被编译为了一个内联函数，和 <script setup> 中的代码位于同一作用域，使用组合式 API 比等价情况下的选项式 API 更高效，对代码压缩也更友好