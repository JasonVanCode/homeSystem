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
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
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
                <!-- <el-table-column prop="phone" label="文章内容"></el-table-column> -->
                <el-table-column prop="article_date" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
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
import { blogList } from '../../api/index';
import { provinceAndCityData,CodeToText} from 'element-china-area-data'
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
            role_list:[],
            options:provinceAndCityData,
            tableData: [],
            codetotext:CodeToText,
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            sexarrs:[{name:'男',value:1},{name:'女',value:0}],
            lockarrs:[{name:'正常',value:0},{name:'锁定',value:1}],
            idx: -1,
            id: -1,
            imageUrl:null
        };
    },
    created() {
        this.getData();
    },
    methods: {
        handleChange (value) {
         console.log(value)
        },
        uploadChange(file, fileList){
             this.imageUrl = URL.createObjectURL(file.raw);
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
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    userDel({id:row.user_id}).then(res => {
                        this.handleSearch();
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
            }
            let id = [];
             // 二次确认删除
            self.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                self.multipleSelection.map(val => {
                    id.push(val.user_id);
                });
                userDel({id:id}).then(res => {
                    this.handleSearch();
                    if(res.result.status == 'success'){
                        this.$message.success('删除成功');
                    }else{
                        this.$message.error('删除失败');
                    }
                });
            })
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            console.log(row);
            this.form = {
                user_id:row.user_id,
                username:row.username,
                realname:row.realname,
                password:row.password,
                avatar:row.avatar,
                phone:row.phone,
                email:row.email,
                role_id:row.role_id?row.role_id.split(','):[],
                sex:row.sex,
                locked:row.locked
            };
            // this.imageUrl = row.head_img;
            this.editVisible = true;
        },
        handleSave(){
            this.editVisible = true;
              this.form =  {
                user_id:null,
                username:null,
                realname:null,
                password:null,
                avatar:null,
                phone:null,
                email:null,
                role_id:[],
                sex:null,
                locked:0
            }
            this.imageUrl = null;
        },
        // 保存编辑
        saveEdit(formName) {
            let self = this;
            let data = new FormData();
            self.editVisible = false;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    let form = JSON.stringify(self.form);
                    data.append('form',form);   
                    let { uploadFiles } = this.$refs.upload;
                    if(uploadFiles.length > 0 ){
                        uploadFiles.forEach(item => {
                            data.append('file', item.raw);
                        })
                    }
                    userSave(data).then(res => {
                        if(res.result.status == 'success'){
                            self.$message.success('操作成功');
                            self.handleSearch();
                        }else{
                            self.$message.error(res.msg);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
