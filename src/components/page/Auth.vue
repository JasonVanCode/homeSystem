<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="iconfont icon-ic_opt_feature"></i> 权限管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-select v-model="role_id" placeholder="角色" class="handle-select mr10" @change="changerole" clearable>
                    <el-option :key="item.role_id" :label="item.name" :value="item.role_id" v-for="item in role_options"></el-option>
                </el-select>
                 <el-button type="primary"  @click.prevent="handleSave">保存</el-button>
            </div>
        <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
        </el-tree>
        </div>
    </div>
</template>

<script>
import { getRoleMenulist,authList,authSave,getRoleList } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            role_options:[],
            role_id:null,
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    created() {
        this.getData();
        this.getrolelist();
    },
    methods: {
        changerole(role_id){
            let self = this;
            //当切换角色的时候，先清空菜单选择的数据
            self.$refs.tree.setCheckedKeys([]);
            if(role_id){
                getRoleMenulist(role_id).then(res => {
                    if( res.result){
                        self.$refs.tree.setCheckedKeys(res.result);
                    }
                })
            }
        },
        getrolelist(){
            let self = this;
            getRoleList().then(res => {
                if(res.code == 200 && res.result){
                    self.role_options = res.result;
                }
            });
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
            authList().then(res => {
                 self.data = res.result;
            });
        },
        // 触发搜索按钮
        handleSave() {
            let self = this;
            let tree = self.$refs.tree;
            let savedata = tree.getCheckedKeys().concat(tree.getHalfCheckedKeys());
            if(!self.role_id){
                 self.$message.error('请选择角色');
                 return;
            }
            if(!savedata || savedata.length == 0){
                 self.$message.error('请选择要分配的菜单');
                 return;
            }
            authSave({role_id:self.role_id,menulist:savedata}).then(res => {
                if(res.result.status == 'success'){
                    self.$message.success('操作成功');
                }else{
                    self.$message.error(res.msg);
                }
            });

        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 180px;
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
