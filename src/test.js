var obj = {
  left: null,
  right: {
    left: null,
    right: {
      left: null,
      right: {

      }
    }
  }
}

var maxDepth = function (root) {
  if (root === null) { //注意等号
    return 0;
  } else {
    var leftDepth = 0;
    var rightDepth = 0
    if (root) {
      // console.log(root);
      leftDepth = maxDepth(root.left)
      // console.log(leftDepth);
      rightDepth = maxDepth(root.right)
      // console.log(rightDepth);
    }
    var childDepth = leftDepth > rightDepth ? leftDepth : rightDepth;

    return childDepth + 1; //根节点不为空高度至少为1
  }
};
// let str = JSON.stringify(obj)
// console.log(str);
// let nodeNums = str.match(/\w+/g).length
// console.log(nodeNums);
let deepNum = maxDepth(obj)
console.log(deepNum);