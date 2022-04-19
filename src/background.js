import core from './core.js'

console.log('插件加载成功! core.version:%s',  core.version)

core.init()

// function fn1() {
//     console.log('fn1');
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('fn2')
//         }, 1000);
//     })

// }

// async function fn2() {
//     console.log('fn2 await 上');
//     const result = await fn1()
//     console.log(result);
//     console.log('fn2 await 下');
// }

// fn2()

console.log('core.switchConfig:', core.switchConfig)