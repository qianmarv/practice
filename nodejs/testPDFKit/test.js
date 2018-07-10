let sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

let howLongToSleep = async function () {
    // 在这里使用起来就像同步代码那样直观
    console.time();
    console.log('1');
    await sleep(5000);  //sleep 为一个执行需要耗费 3s 的函数
    console.log('2');
};

async function test(){
    await howLongToSleep();
    console.log('3');
}

test()