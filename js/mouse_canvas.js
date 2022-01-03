var mouseX;
var mouseY;

const MouseOnCanvas = {
	init : function(canvas){
		this.cbounds = canvas.getBoundingClientRect();
	},
	updateMouseValues : function(e){
		mouseX = Math.round((e.clientX - this.cbounds.left) * (c.width / Math.round(this.cbounds.right - this.cbounds.left)));
		mouseY = Math.round((e.clientY - this.cbounds.top) * (c.height / Math.round(this.cbounds.bottom - this.cbounds.top)));
	}
}