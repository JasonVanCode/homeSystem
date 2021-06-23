<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <el-form label-width="70px" :model="ruleForm" :rules="rules" ref="ruleForm" >
                <el-form-item label="文章标题"  label-width="70px" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="文章标题" ></el-input>
                 </el-form-item>

                <el-form-item label="文章类型"  label-width="70px" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择"  clearable> 
                        <el-option label="Linux" value="Linux"></el-option>
                        <el-option label="PHP" value="PHP"></el-option>
                        <el-option label="Mysql" value="Mysql"></el-option>
                        <el-option label="Redis" value="Redis"></el-option>
                    </el-select>
                 </el-form-item>
             </el-form>
             {{content}}
             <mavon-editor v-model="content" :ishljs = "true" @imgAdd="imgAdd" />
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import {blogSave,blogEditList} from '../../api/index.js';
    export default {
        name: 'editor',
        data: function(){
            return {
                editid:null,
                content: '',
                editorOption: {
                    placeholder: 'Hello World'
                },
                ruleForm:{
                    name:'',
                    type:''
                },
                rules:{
                    name: [
                        { required: true, message: '请填写文章名称', trigger: 'change' },
                    ],
                    type: [
                        { required: true, message: '请选择文章类型', trigger: 'change' }
                    ],
                }
            }
        },
        created() {
            console.log(this.$route);
            if(this.$route.query.id){
                this.editid = this.$route.query.id;
                this.getEditdata( this.editid );
            }
        },
        components: {
        },
        methods: {
            getEditdata(id){
                let self = this;
                blogEditList({
                    id:id
                }).then(res => {
                    let result = res.result;
                    self.content = result.article_content;
                    self.ruleForm.name = result.article_title;
                    self.ruleForm.type = result.article_type;
                });
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
                // console.log(this.content);
            },
            submit(){
                let self = this;
                if(!self.content){
                    self.$message.error('请填写文章！');
                    return;
                }
                self.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        blogSave({name:self.ruleForm.name,type:self.ruleForm.type,content:self.content}).then(res => {
                            console.log(res);
                            if(res.msg == 'success'){
                                self.$message.success('添加成功！');
                                self.content = '';
                                self.$refs['ruleForm'].resetFields();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                // this.$message.success('提交成功！');
            },
            imgAdd()
            {
                alert(333);
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>