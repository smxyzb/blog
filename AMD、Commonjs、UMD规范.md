### 一、AMD 规范（异步模块规范）

```
    //    文件名: foo.js
    define(['jquery'], function ($) {
        //    方法
        function myFunc(){};

        //    暴露公共方法
        return myFunc;
    });
```

###二、Commonjs 规范

```
    //    依赖
    var $ = require('jquery');
    //    方法
    function myFunc(){};

    //    暴露公共方法（一个）
    module.exports = myFunc;
```

###三、UMD 规范：通用模块规范

```
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // Node, CommonJS之类的
            module.exports = factory(require('jquery'));
        } else {
            // 浏览器全局变量(root 即 window)
            root.returnExports = factory(root.jQuery);
        }
    }(this, function ($) {
        //    方法
        function myFunc(){};

        //    暴露公共方法
        return myFunc;
    }));
```
