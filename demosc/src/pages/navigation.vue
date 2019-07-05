<template>
  <div>
    <div class="content">
      <Row style="margin-bottom: 20px">
        <Col span="4">
          <Button type="primary" @click="show = true">新增</Button>
        </Col>
      </Row>
      <Table border :columns="table.columns" :loading="table.loading" :data="table.data" width="600">
        <template slot-scope="{ row, index }" slot="operation">
          <Button type="primary" size="small" style="margin-right: 5px" @click="showBox(row)">编辑</Button>
          <!--<Button type="primary" size="small" @click="deleteBanner(index)">删除</Button>-->
        </template>
      </Table>
      <Modal
        title="输出参数"
        v-model="show"
        :loading="loading"
        :mask-closable="false"
        @on-ok="add('formValidate')"
        @on-cancel="cancelType">
        <Form ref="formValidate" :model="table" :rules="ruleValidate" :label-width="80">
          <Row style="margin-bottom: 20px">
            <Col span="24" style="display: flex">
              <FormItem label="分类名" prop="title">
                <Input v-model="table.title"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row style="margin-bottom: 20px">
            <Col span="24" style="display: flex">
              <FormItem label="排序" prop="sortOrder">
                <Input v-model="table.sortOrder"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {get, post} from "../libs/ajax";

  export default {
    name: "navigation",
    data() {
      return {
        show: false,
        table: {
          columns: [
            {
              title: 'ID',
              key: 'id'
            },
            {
              title: '分类名',
              key: 'title'
            },
            {
              title: '排序',
              key: 'sortOrder',
            },
            {
              title: '操作',
              slot: 'operation',
            }
          ],
          data: [],
          title: '',
          id: '',
          sortOrder: '',
          loading: false,
        },
        ruleValidate: {
          title: [
            {required: true, message: '分类名不能为空', trigger: 'blur'}
          ],
          sortOrder: [
            {required: true, message: '排序不能为空', trigger: 'blur'}
          ],
        },
        loading: true
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      add(name) {
        var that = this;
        that.$refs[name].validate((valid) => {
          if (that.table.sortOrder == '' || that.table.title == '') {
            setTimeout(() => {
              that.loading = false;
              that.$nextTick(() => {
                that.loading = true;
              });
            }, 1000);
          }
          if (valid) {
            var data = {
              id: that.table.id,
              parentId: 0,
              sortOrder: that.table.sortOrder,
              title: that.table.title,
            }
            post('/category/addOrUpdateCategory', data, function (res) {
              if (res.code == 200) {
                that.table.show = false;
                that.table.title = '';
                that.table.sortOrder = '';
                that.table.id = '';
                that.loadData();
              } else {
                that.$Message.info(res.msg);
              }
            })
          } else {
            that.$Message.error('Fail!');
          }
        })
      },
      cancelType() {
        this.table.title = '';
        this.table.sortOrder = '';
      },
      loadData() {
        var that = this;
        that.table.loading = true
        get('/category/getCategory', {}, function (res) {
          if (res.code == 200) {
            that.table.loading = false;
            that.table.data = res.data;
          } else {
            that.$Message.info(res.msg)
          }
        })
      },
      showBox(row) {
        this.show = true
        this.table.title = row.title;
        this.table.sortOrder = row.sortOrder;
        this.table.id = row.id;
      },
    }
  }
</script>

<style scoped>
  .content {
    padding: 30px 20px;
  }
</style>
