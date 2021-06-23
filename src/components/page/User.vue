<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 人员管理
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
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column  label="#" width="55" align="center" type="index"></el-table-column>
                <el-table-column prop="username" label="账号"></el-table-column>
                <el-table-column prop="realname" label="姓名"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="hostname + scope.row.avatar"
                            :preview-src-list="[hostname + scope.row.avatar]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="username" label="性别">
                     <template slot-scope="scope">
                         {{ scope.row.sex == 1?'男':'女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="注册时间"></el-table-column>
                 <el-table-column label="账号状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.locked == 0?'success':(scope.row.locked== 1?'danger':'')"
                        >{{scope.row.locked == 0?'正常':'锁定'}}</el-tag>
                    </template>
                </el-table-column>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="新增" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                <el-form-item label="账号1" prop="username">
                    <el-input v-model="form.username" :disabled="form.user_id?true:false"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="realname">
                    <el-input v-model="form.realname" type="text"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                   <el-upload
                        class="avatar-uploader"
                        :auto-upload="false"
                         action="*"
                        :show-file-list="false"
                        :on-change="uploadChange"
                        ref="upload"
                        >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="form.phone" type="text"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" type="text"></el-input>
                </el-form-item>
                <el-form-item label="性别" >
                    <el-select v-model="form.sex" placeholder="请选择"  clearable>
                        <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in sexarrs"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色分配" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="请选择"  clearable multiple> 
                        <el-option :key="item.role_id" :label="item.name" :value="String(item.role_id)" v-for="item in role_list"></el-option>
                    </el-select>
                 </el-form-item>
                <el-form-item label="账号状态" >
                    <el-select v-model="form.locked" placeholder="请选择"  clearable>
                        <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in lockarrs"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getUserlist,userSave,userDel,getRoleList } from '../../api/index';
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
            form: {
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
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                realname:[
                    { required: true, message: '请填写姓名', trigger: 'blur' }
                ],
                 phone:[
                    { required: true, message: '请填写手机号', trigger: 'blur' }
                ],
                 email:[
                    { required: true, message: '请填写邮箱', trigger: 'blur' }
                ],
                 role_id:[
                    { required: true, message: '请选择权限', trigger: 'blur' }
                ]
            },
            idx: -1,
            id: -1,
            imageUrl:null,
            hostname:null
        };
    },
    created() {
        this.hostname = 'http://'+window.location.hostname+':8091/'
        this.getData();
        this.getRolelist();
    },
    methods: {
        getRolelist(){
            let self = this;
            getRoleList().then(res => {
                console.log(res);
                self.role_list = res.result;
            });
        },
        handleChange (value) {
         console.log(value)
        },
        uploadChange(file, fileList){
             this.imageUrl = URL.createObjectURL(file.raw);
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
                getUserlist({
                        page: self.query.page,
                        perpage:self.query.perpage
                    }).then(res => {
                        console.log(res);
                        if(res.code == 200){
                            let result = res.result;
                            self.pageTotal = result.total;
                            self.tableData = result.data;
                        }
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
                return;
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

            // let str = '';
            // this.delList = this.delList.concat(this.multipleSelection);
            // for (let i = 0; i < length; i++) {
            //     str += this.multipleSelection[i].name + ' ';
            // }
            // this.$message.error(`删除了${str}`);
            // this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            console.log(row);
            this.imageUrl = null;
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
