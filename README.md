# lineImage


## 功能说明

Jquery 插件(lineImage) 等高图片瀑布流 类似于百度的照片显示效果

## 参数说明

- watch 
    :是否监听窗体变化来自动调整图片布局,布尔值
- images
    :图片集合,数组,可以为链接地址或者为对象object
    :当为object时,可以设置属性src和link
- baseHeight
    :基准高度,开始计算行高的基准值,像素
- baseGapX
    :图片横向间距,像素
- baseGapY
    :图片行间距,像素
    
    


## 使用方法



>
- 写法一
```javascript
    $('#im_box').lineImages({
        watch: true,//如果是定宽可以把watch设置为false        
        images: sourceImages
    });   
```
- 写法二  
```javascript
    $('#im_box').lineImages({
        watch:true,//如果是定宽可以把watch设置为false
    }).loadImages(sourceImages); 
```
- 写法三  
```javascript
    var lm = $('#im_box').lineImages({
        watch:true,//如果是定宽可以把watch设置为false
    });   
    lm.loadImages(sourceImages);
```
    

         

         

