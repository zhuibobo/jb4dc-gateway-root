<template>
    <div class="uid-wysiwyg-component-root">
        <div>
            <div class="wysiwyg-container"></div>
        </div>
        <div>
            <div id="accordion">
                <h3>布局控件</h3>
                <div>

                </div>
                <h3>输入控件</h3>
                <div>

                </div>
                <h3>容器控件</h3>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>

import controlPluginsConfig from '../Config/ControlPlugins.json';

export default {
    name: "uid-wysiwyg-component",
    mounted() {
        $("#accordion").accordion({
            heightStyle: "fill"
        });
        console.log(controlPluginsConfig);
    }
}
</script>

<style scoped lang="less">
    @import "../../Less/Variable.less";

    .uid-wysiwyg-component-root{
        display: flex;
        /*background-color: #0B61A4;*/
        height: 100%;
        overflow: hidden;

        >div:first-child{
            flex-grow: 2;
            overflow: auto;
            padding: 2px 4px 2px 2px;

            .wysiwyg-container{
                border-radius: 4px;
                border: 1px solid @g-concrete-color-v04;
                height: 100%;
                box-sizing: border-box;
            }
        }
        >div:last-child{
            flex-basis: 200px;
            background-color: #EAEDED;
            margin-right: 2px;
            height:calc(100% - 4px);
        }
    }
</style>