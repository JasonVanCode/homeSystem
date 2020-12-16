<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="iconfont icon-NS--"></i> switch发售游戏
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="游戏名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
               >
                <el-table-column  label="#" width="55" align="center">
                     <template slot-scope="scope">{{scope.$index + 1}}</template>
                </el-table-column>
                <el-table-column prop="game_name" label="游戏名称"></el-table-column>
                <el-table-column label="图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="base_imgurl + scope.row.true_imgurl"
                            :preview-src-list="[base_imgurl + scope.row.true_imgurl]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sale_time" label="发售时间"></el-table-column>
                <el-table-column prop="price" label="发售价格"></el-table-column>
                <el-table-column prop="supported_platforms" label="支持平台"></el-table-column>
                <el-table-column prop="game_type" label="游戏类型"></el-table-column>
                <el-table-column prop="publisher" label="发行商"></el-table-column>
                <el-table-column prop="language" label="游戏支持的语言"></el-table-column>
                <el-table-column prop="game_size" label="游戏大小"></el-table-column>
                <el-table-column prop="player_num" label="游玩人数"></el-table-column>
                  <el-table-column prop="online_player_num" label="联网游玩人数">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.perpage"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getSwitchlist } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
                page: 1,
                perpage: 10
            },
            tableData: [],
            pageTotal:1
        };
    },
    computed: {
        base_imgurl() {
            return 'http://192.168.8.159:8091/eshop_game/';
        }
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            getSwitchlist(this.query).then(res => {
                console.log(res);
                if(res.code == 200 && res.result){
                    this.tableData = res.result.data;
                    this.pageTotal = res.result.total;
                }
            });
        },
        handleSearch(){
            this.query.page = 1;
            this.getData();
        },
        handlePageChange(page){
            this.query.page = page;
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
