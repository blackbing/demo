function GIFController(imgElement){
    var onload = function(){
        var imgCanvas = document.createElement('canvas');
        /*if(!imgCanvas.getContext && typeof G_vmlCanvasManager!='undefined'){
            imgCanvas = G_vmlCanvasManager.initElement(imgCanvas);
        }
        imgCanvas.width = blockXCount * blockWidth;
        imgCanvas.height = blockYCount * blockWidth;
        imgCanvas.style.cssText = 'position:absolute; z-index:10;';
        
        stageElm.append(imgCanvas);*/
        imgCanvas.width = imgElement.width;
        imgCanvas.height = imgElement.height;
        ctx = imgCanvas.getContext('2d');
        ctx.drawImage(imgElement,0,0);
        var parentNode = imgElement.parentNode;
        parentNode.insertBefore(imgCanvas, imgElement);
        parentNode.removeChild(imgElement);
    };
    if(imgElement.width && imgElement.height){
        onload();
    }else{
        imgElement.onload = onload;
    }
}
(function(){
    var imgs = document.getElementsByTagName('img');
    for(var i=0; i<imgs.length; i++){
        GIFController(imgs[i]);
    }
})()