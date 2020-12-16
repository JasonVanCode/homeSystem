<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="iconfont icon-ditu"></i> 百度地图
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 注意这边的baidu-map是空元素，一定要设置宽高否则会显示不出地图 -->
            <baidu-map 
            class="map" 
            :center="center" 
            :zoom="zoom" 
            @ready="handler" 
            :scroll-wheel-zoom = "true"
            >
                <!-- 点 -->
                 <bm-marker :position="marker_position" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
                 </bm-marker>
                <!-- 定位 -->
                 <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
            </baidu-map>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            center: {lng: 116.404, lat: 39.915},
            zoom: 15,
            marker_position:{lng: 116.404, lat: 39.915}
        };
    },
    created() {
        // this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
       handler ({BMap, map}) {
            console.log(BMap, map)
            this.center.lng = 116.404
            this.center.lat = 39.915
            this.zoom = 15
        },
        locationSuccess(point, AddressComponent, marker){
            console.log(point);
            if(point.point){
                this.marker_position = {lng:point.point.lng,lat:point.point.lat};
            }
        }
    }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 600px;
}
.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
