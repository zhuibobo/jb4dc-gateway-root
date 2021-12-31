//import { importAll } from '@/utils'

// utils.js
function importAll(r) {
    let __modules = {}
    r.keys().forEach(key => {
        let m = r(key).default
        //let n = m.name;
        let n = key.substring(key.lastIndexOf("/")+1).replace(".js","");
        console.log(key.substring(key.lastIndexOf("/")+1).replace(".js",""));
        __modules[n] = m
    });
    return __modules
}
//let obj= importAll(require.context('./AppFormDesign/', true, /\.js$/));
//console.log(obj);
export default importAll(require.context('./', true, /(AppFormDesign\S*\.js$)|(AppListDesign\S*\.js$)|(WebFormDesign\S*\.js$)|(WebListDesign\S*\.js$)/))