# lineImage


## 功能说明

等高图片瀑布流 类似于百度的照片显示效果


## 使用方法



>
- 写法一
    $('#im_box').lineImages({
        watch: true,//如果是定宽可以把watch设置为false        
        images: sourceImages
    });    
- 写法二   
    $('#im_box').lineImages({
        watch:true,//如果是定宽可以把watch设置为false
    }).loadImages(sourceImages); 
- 写法三    
    var lm = $('#im_box').lineImages({
        watch:true,//如果是定宽可以把watch设置为false
    });   
    lm.loadImages(sourceImages);
    

         

         
