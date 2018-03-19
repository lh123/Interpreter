# 一款类JavaScript语言的解释器

## 1. 目前实现的功能
1. 函数调用和定义
2. 类型检测
3. 支持函数递归

## 2. 缺陷
1. 没有块作用与
2. 没有实现流程控制

## 3. 实例代码

```javascript
function fib(n: int): int {
    if(n < 2) {
        return n;
    } else {
        return fib(n-1) + fib(n-2);
    }
}
var r: int = fib(10);
printf("result is " + r);
