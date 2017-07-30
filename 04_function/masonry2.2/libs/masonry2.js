(function($){
    $.fn.Gallery = function(options){
        $.defaultOption = {
            items: $(this).children('li'),
            col:5,
            itemWidth:300,
            itemMargin:10
        }

        this.each(function(){
            options = $.extend(null, $.defaultOption, options);
            console.log(options);
            var gellery = new Gallery(options.items,options.col,options.itemWidth,options.itemMargin);
        });
    }
    //기존클래스(s)
    function Gallery(item,col,w,m){
        this.listItem = null;
        this.colGrid = null;
        this.listWidth = null;
        this.itemMargin = null;
        this.layoutStack = null;

        this.init(item,col,w,m);
    }

    Gallery.prototype.init = function(item,col,w,m){
        this.listItem = $(item);
        this.colGrid = col;
        this.listWidth = w;
        this.itemMargin= m;
        this.layoutStack = new Array(col);
        this._showMasonry();

    }
    //스택에서 길이와 정보가져오는 부분을 메서드화
    Gallery.prototype._pickLayout = function(){
         var compareIdx = new Array();

        //레이아웃들 스택의 마지막 데이터들을 가져옴
        for(j = 0; j < this.colGrid; j++){
            compareIdx[j] = this.layoutStack[j].peek();
            compareIdx[j].col = j;
        }
        //가져온 끝에있는 인덱스들의 y값 높이를 비교하여, 가장 작은 y를 찾아 현재 높이와 x셋팅
        compareIdx.sort(this._compareTop);
        return compareIdx;
    }
    //기본 1줄 위치잡기 부분을 메서드화
    Gallery.prototype._basicSetposX = function(i){
        if(i == 0){
             var x = (( i % this.colGrid)*this.listWidth);
        }else{
             var x = (this.itemMargin*( i % this.colGrid)) + (( i % this.colGrid)*this.listWidth);
        }
        return x;
    }
    Gallery.prototype._showMasonry = function(){
        var max = this.listItem.length;
        var pos = new Array();

        //레이아웃에 맞쳐서 스택형성
        for(var k=0; k < this.colGrid ; k++){
            this.layoutStack[k] = new stack();
        }

        for(var i = 0; i < max; i++){
            var temp = {x:null, y:null};                //임시위치값
            var layoutTemp = {x:null, y:null,idx:i};    //임시레이아웃스택
            var col = null;

            //2번째 줄부터는 가장 짧은위치찾아 잡기
            if(i >= this.colGrid){
                var shortLayout = this._pickLayout();
                temp.x = shortLayout[0].x;
                temp.y = shortLayout[0].y + this.itemMargin;
                col = shortLayout[0].col;
            //기본 첫번째 줄은 x축만 계산하여 넣어줌
            }else{
                 temp.x = this._basicSetposX(i);
                 temp.y = 0;
                 col = i % this.colGrid;
            }

            pos[i] = temp;
            layoutTemp.x = temp.x;
            layoutTemp.y += temp.y + parseInt(this.listItem.eq(i).css('height'));
            layoutTemp.idx = i;
            this.layoutStack[col].push(layoutTemp);
        }
        this._moveItems(pos);
    }

    Gallery.prototype._moveItems = function(pos){
        var max = this.listItem.length;
        for(var i = 0; i < max; i++){
            var list = this.listItem.eq(i);
            list.css({left:pos[i].x, top:pos[i].y});
        }
        var contWidth = (this.listWidth*this.colGrid)+(this.itemMargin*(this.colGrid-1));
        //2.1 > 마지막 컨텐츠의 y값 넣어줬는데, ->오류
        //2.2 > 마지막 줄에서 가장 긴 y값 가져와 가장 긴거 찾아내서 전체세로사이즈 넣어줌.
        var longLayout = this._pickLayout().reverse();
        var contHeight = longLayout[0].y;
        this.listItem.parent().css('width',contWidth+'px').css('height',contHeight+'px');
    }

    Gallery.prototype._compareTop = function(a,b){
        if(a.y < b.y){
            return -1;
        }
        if(a.y > b.y){
            return 1;
        }
        return 0;
    }
    //기존클래스(e)
})(jQuery)

