<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 文章列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="文章名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleSave">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column  label="#" width="55" align="center" type="index"></el-table-column>
                <el-table-column prop="article_title" label="文章名"></el-table-column>
                <el-table-column prop="article_type" label="文章类型"></el-table-column>
                <el-table-column prop="phone" label="文章内容">
                     <template slot-scope="scope">
                         {{handelContent(scope.row.article_content)}}
                     </template>
                </el-table-column>
                <el-table-column prop="article_date" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
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
import { blogList,blogDel } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                page: 1,
                perpage: 10
            },
            tableData: [],
            multipleSelection: [],
            pageTotal: 0,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        handelContent(str){
            let deal_str = str.substr(0,50);
            return this.delHtmlTag(deal_str) + '...';
        },
        delHtmlTag(str){
		    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
	    },
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
                blogList({
                        page: self.query.page,
                        perpage:self.query.perpage
                    }).then(res => {
                        console.log(res);
                        let result = res.result;
                        self.pageTotal = result.total;
                        self.tableData = result.data;
                });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 删除操作
        handleDelete( row) {
            // 二次确认删除
            let self = this;
            self.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    blogDel({id:row.article_id}).then(res => {
                        this.getData();
                        if(res.result.status == 'success'){
                            this.$message.success('删除成功');
                        }else{
                            this.$message.error('删除失败');
                        }
                    });
                });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            let self = this;
            let len = self.multipleSelection.length;
            if(len == 0){
                self.$message.error('请选择要删除的数据');
                return;
            }
            let id = [];
             // 二次确认删除
            self.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                self.multipleSelection.map(val => {
                    id.push(val.article_id);
                });
                console.log(id);
                blogDel({id:id}).then(res => {
                    self.getData();
                    if(res.result.status == 'success'){
                        self.$message.success('删除成功');
                    }else{
                        self.$message.error('删除失败');
                    }
                });
            })
        },
        // 编辑操作
        handleEdit(row) {
            this.$router.push({
                path:"/editoredit",//这个path就是你在router/index.js里边配置的路径
                query:{
                    id:row.article_id
                }
            })
        },
        handleSave(){
            this.$router.push({ path: '/editoredit' });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
