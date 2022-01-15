//import { importAll } from '@/utils'

// utils.js
function importAll(r) {
    let __modules = {}
    r.keys().forEach(key => {
        let m = r(key).default
        let n = m.name;
        //console.log(n);
        __modules[n] = m
    });
    return __modules
}
//let obj= importAll(require.context('./AppFormDesign/', true, /\.js$/));
export default importAll(require.context('./', true, /(AppFormDesign\S*\.vue$)|(AppListDesign\S*\.vue$)|(WebFormDesign\S*\.vue$)|(WebListDesign\S*\.vue$)/))