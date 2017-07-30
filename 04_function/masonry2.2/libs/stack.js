function stack(){
	this.item = [];
}

//뒤에 원소 추가
stack.prototype.push = function(n){
	this.item.push(n);
}
//뒤에꺼 삭제
stack.prototype.pop = function(){
	this.item.pop();
}
//꼭대기 반환(맨뒤)
stack.prototype.peek = function(){
	return this.item[this.item.length-1];
}
//isEmpty
stack.prototype.isEmpty = function(){
	return this.item.length == 0;
}
//사이즈
stack.prototype.size = function(){
	return this.item.length;
}
//클리어
stack.prototype.clear = function(){
	this.item = [];
}
//프린트 toString() : 배열을 문자열로 변환하여 반환하는 배열메소드
stack.prototype.print = function(){
	console.log(this.item.toString());
}