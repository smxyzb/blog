# es5 
```

function flatArr(list = [], defatltArr = [], keys = ['id', 'title']) {
  var newArr = defatltArr
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    var obj = {}
    keys.forEach((key) => {
      if (item[key]) {
        obj[key] = item[key]
      }
    })
    newArr.push(obj)
    if (item.children) {
      newArr = flatArr(item.children, newArr, keys)
    }
  }
  console.log(newArr);
  return newArr
}
const data = [{
    id: 1,
    title: "课程1",
    children: [{
        id: 4,
        title: "课程1-1"
      },
      {
        id: 5,
        title: "课程1-2",
        children: [{
            id: 6,
            title: "课程1-2-1"
          },
          {
            id: 7,
            title: "课程1-2-2"
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "课程2"
  },
  {
    id: 3,
    title: "课程3"
  },
];
// flatArr(data)
```
