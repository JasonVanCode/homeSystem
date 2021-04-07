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
                        <el-option label="类型1" value="类型1"></el-option>
                        <el-option label="类型2" value="类型1"></el-option>
                        <el-option label="类型3" value="类型1"></el-option>
                        <el-option label="类型4" value="类型1"></el-option>
                    </el-select>
                 </el-form-item>
             </el-form>

            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"  @change="onEditorChange($event)"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {blogSave} from '../../api/index.js';
    export default {
        name: 'editor',
        data: function(){
            return {
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
        components: {
            quillEditor
        },
        methods: {
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
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>