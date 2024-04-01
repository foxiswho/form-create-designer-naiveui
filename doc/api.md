
# 详情地址
POST
```json
{
  "id": "0",
  "designer": ""
}
```
> id: 当前id

返回值
```json lines
{
    "code": "200",
    "message": "操作成功",
    "data": {
        "id": "0",
        "designer": "",
        "data": {
            "content": "",
            "form": "",
            "formSingle": false
        }
    }
}
```

> code: 200 表示成功，其他表示失败
> 
> message： 错误信息
> 
> data： 返回值数据
> 
>        id ： 当前id
> 
>        designer：设计器
> 
>        data：设计器用的数据
> 
>              content：form-create-designer-naiveui 设计器的 rule 内容
> 
>              form： form-create-designer-naiveui 设计器的 option 内容
> 
>              formSingle： 表单参数配置(option)是 否单独 列出