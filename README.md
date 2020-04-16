# Fox-Listener 

Pub/Sub model realize by es6

这是一个小小的工具项目(玩具)

发布订阅模式(观察者模式)的 es6实现


# install

```
npm i fox-listener --save
```

# Use

基本的发布订阅

```js
import fl from "fox-listener";

const foxListener = new fl();

foxListener.subscribe(`Event`,(who) => {
    console.log("我被 %s 订阅了", who)
});

// do something ...

foxListener.publish(`Event`, "Owen");
```

可以使用命名空间

```js
import fl from "fox-listener";

const foxListener = new fl();

foxListener.subscribe(`Event.say`,(who) => {
    console.log("%s 说话了", who)
});

foxListener.subscribe(`Event.sleep`,(who) => {
    console.log("%s 睡觉了", who)
});

// do something ...

foxListener.publish(`Event.sleep`, "Owen");

// Owen 睡觉了
```

如果执行类目，则将全部匿名空间执行

```js
import fl from "fox-listener";

const foxListener = new fl();

foxListener.subscribe(`Event.say`,(who) => {
    console.log("%s 说话了", who)
});

foxListener.subscribe(`Event.sleep`,(who) => {
    console.log("%s 睡觉了", who)
});

// do something ...

foxListener.publish(`Event`, "Owen");

// Owen 说话了
// Owen 睡觉了
```

可以使用unsubscribe 取消订阅的项目

```js
import fl from "fox-listener";

const foxListener = new fl();

foxListener.subscribe(`Event.say`,(who) => {
    console.log("%s 说话了", who)
});


foxListener.unsubscribe(`Event.say`);

// do something ...

foxListener.publish(`Event.say`, "Owen");

// throw Error The Event didnt bind !
```

如果 取消的是总类目，那么命名空间下订阅的内容也全部会被销毁

```js
import fl from "fox-listener";

const foxListener = new fl();

foxListener.subscribe(`Event`,(who) => {
    console.log("我是 %s", who)
});

foxListener.subscribe(`Event.say`,(who) => {
    console.log("%s 说话了", who)
});



foxListener.unsubscribe(`Event`);

// do something ...

// 即使删除的是Event 旗下的say类也会被删除清空

foxListener.publish(`Event.say`, "Owen");
// throw Error The Event didnt bind !
```


使用once函数，订阅的项目可以只执行一次就销毁。

```js
import fl from "fox-listener";

const foxListener = new fl();

foxListener.subscribe(`Event.say`,(who) => {
    console.log("%s 说话了", who)
});

// do something ...

foxListener.once(`Event.say`, "Owen");

// Owen 说话了

foxListener.publish(`Event.say`, "Owen");

// throw Error The Event didnt bind !
```

浅绑定
```js
import fl from "fox-listener";

const foxListener = new fl();

let data = {
    name: {
        firstName: 'Brown',
        lastName: 'Owen'
    },
    hobby: ['sanguosha', 'movie'],
    address: {
        compony: 'Baidu.Inc',
        info: {
            compony_address: '上地十街',
            home_address: 'blablabla'
        }
    }
}

 foxListener.watch('name.firstName', {deep: 0}, (val) => {
    // 我改变了我的名字
    return val + 'Blue';
})

data.name.firstName = 'Tim';
console.log(data.name.firstName); // TimBlue;
```

深绑定
```js
import fl from "fox-listener";

const foxListener = new fl();

let data = {
    name: {
        firstName: 'Brown',
        lastName: 'Owen'
    },
    hobby: ['sanguosha', 'movie'],
    address: {
        compony: 'Baidu.Inc',
        info: {
            compony_address: '上地十街',
            home_address: 'blablabla'
        }
    }
}

 foxListener.watch('address', {deep: 1}, (val) => {
    // 我改变了我的地址
    return val + '_wait';
})

data.address.compony = 'Tencent';
data.address.info.compony_address = '南山科技园';

console.log(data.address.compony); //'Tencent_wait'
console.log(data.address.info.compony_address); //'南山科技园_wait';
```

# licence

MIT
