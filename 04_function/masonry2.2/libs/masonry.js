function masonry(){
    this.listItem = null;
    this.colGrid = null;
    this.listWidth = null;
    this.itemMargin= null;
}

masonry.prototype.init = function(item,col,w,m){
    this.listItem = $(item);
    this.colGrid = col;
    this.listWidth = w;
    this.itemMargin= m;
    this.showMasonry();

}
masonry.prototype.showMasonry = function(){
    var max = this.listItem.length;
    var x = new Array();
    var y = new Array();
    for(var i = 0; i < max; i++){
        var list = this.listItem.eq(i);

        if(i >= this.colGrid){
            var itemHeight = parseInt(this.listItem.eq(i-this.colGrid).css('height'));
            itemHeight += y[i-this.colGrid];//parseInt(this.listItem.eq(i-this.colGrid).css('top'));
        }else{
             var itemHeight = 0;
        }
        //좌측컨텐츠와 여백
        if(i % this.colGrid == 0){
             x[i] = (( i % this.colGrid)*this.listWidth);
        }else{
             x[i] = this.itemMargin + (( i % this.colGrid)*this.listWidth);
        }
        y[i] = this.itemMargin + itemHeight;
        //list.css({left:x, top:y});
    }
    this.moveItems(x,y)
}

masonry.prototype.moveItems = function(x,y){
    var max = this.listItem.length;
    for(var i = 0; i < max; i++){
        var list = this.listItem.eq(i);
        list.css({left:x[i], top:y[i]});
    }
    var contWidth = (this.listWidth*this.colGrid)+(this.itemMargin*(this.colGrid-1));
    this.listItem.parent().css('width',contWidth+'px');
}
