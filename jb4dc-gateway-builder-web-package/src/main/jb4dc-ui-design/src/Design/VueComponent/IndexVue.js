//import { importAll } from '@/utils'

// utils.js
function importAll(r) {
    let __modules = {}
    r.keys().forEach(key => {
        let m = r(key).default
        let n = m.name;
        __modules[n] = m
    });
    return __modules
}
//let obj= importAll(require.context('./AppFormDesign/', true, /\.js$/));
//console.log(obj);
export default importAll(require.context('./', true, /(BaseInfo\S*\.vue$)|(Dialog\S*\.vue$)|(MainTab\S*\.vue$)|(Parts\S*\.vue$)|(Property\S*\.vue$)/))