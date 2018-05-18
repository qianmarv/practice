function add(x, y){
    return x + y;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}
async function add_deplay(x, y){
    await sleep(1000)
    return add(x, y)    
}
export default add;