var c = document.getElementById("game");
var ctx = c.getContext("2d");

c.addEventListener("mousemove", updateMouseValues);
c.addEventListener("mousedown", updateMouseValues);
c.addEventListener("mouseup", updateMouseValues);
var mouseX, mouseY;
var lastX, lastY;
var draggingObject;
var cameraX = 0; cameraY = 0;
var selectionGroup;

window.onload = update;

var MouseInteractables = [];

class MouseInteractable {
	constructor(x, y, color, outlineColor, selectedColor){
		MouseInteractables.push(this);
		this.x = x;
		this.y = y;
		this.color = color;
		this.outlineColor = outlineColor;
		this.selectedColor = selectedColor;
	}
}

class Box extends MouseInteractable {
	constructor(x, y, width, height, color, outlineColor, selectedColor, inputs, outputs, gate){
		super(x, y, color, outlineColor, selectedColor);
		this.width = width;
		this.height = height;
		this.inputs = inputs;
		for(const input of inputs){
			input.parent = this;
		}
		this.outputs = outputs;
		for(const output of outputs){
			output.parent = this;
		}
		this.gate = gate;
	}
	draw(){
		ctx.beginPath();
		ctx.strokeStyle = this.outlineColor;
		if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
			ctx.fillStyle = this.selectedColor;
		}else{
			ctx.fillStyle = this.color;
		}
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		this[this.gate]();
		ctx.fillStyle = "black";
		ctx.font = "bold 30pt Consolas";
		ctx.textAlign = "center";
		ctx.fillText(this.gate, this.x + this.width / 2, this.y + 62);
	}
	onMouseDown(){
		if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
			draggingObject = this;
		}
	}
	onMouseUp(){
		if((mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height)){                
			if(this.x > 800){
				MouseInteractables.splice(MouseInteractables.indexOf(this), 1);
				for(var node of this.inputs.concat(this.outputs)){
					MouseInteractables.splice(MouseInteractables.indexOf(node), 1);
				}
			}
		}
	}
	NOT(){
		this.outputs[0].value = !this.inputs[0].value;
	}
	OR(){
		this.outputs[0].value = this.inputs[0].value || this.inputs[1].value;
	}
	AND(){
		this.outputs[0].value = this.inputs[0].value && this.inputs[1].value;
	}
	XOR(){
		this.outputs[0].value = (this.inputs[0].value || this.inputs[1].value) && !(this.inputs[0].value && this.inputs[1].value);
	}
	IN(){
		this.outputs[0].value = this.inputs[0].value;
	}
}

class BinaryNode extends MouseInteractable {
	constructor(x, y, radius, color, outlineColor, selectedColor, value, parent){
		super(x, y, color, outlineColor, selectedColor);
		this.radius = radius;
		this.value = value;
		this.parent = parent;
		this.out = [];
		this.in = null;
	}
	draw(){
		if(this.value){
			this.color = "green";
			this.selectedColor = "lime";
		}else{
			this.color = "red";
			this.selectedColor = "#f56767";
		}
		ctx.beginPath();
		ctx.strokeStyle = this.outlineColor;
		if(Math.abs(mouseX - (this.parent.x + this.x)) <= this.radius && Math.abs(mouseY - (this.parent.y + this.y)) <= this.radius){
			ctx.fillStyle = this.selectedColor;
		}else{
			ctx.fillStyle = this.color;
		}
		ctx.arc(this.parent.x + this.x, this.parent.y + this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		for(var i = 0; i < this.out.length; i++){
			this.out[i].value = this.value;
			ctx.moveTo(this.parent.x + this.x, this.parent.y + this.y);
			ctx.lineTo(this.out[i].parent.x + this.out[i].x, this.out[i].parent.y + this.out[i].y);
			ctx.stroke();
		}
	}
	onMouseDown(){
		if(Math.abs(mouseX - (this.parent.x + this.x)) <= this.radius && Math.abs(mouseY - (this.parent.y + this.y)) <= this.radius){
			if(this.parent.outputs.includes(this)){
				draggingObject = new Line(this);
			}
		}
	}
	onMouseUp(){
		if(Math.abs(mouseX - (this.parent.x + this.x)) <= this.radius && Math.abs(mouseY - (this.parent.y + this.y)) <= this.radius){
			if(mouseX == lastX && mouseY == lastY){
				if(this.parent.gate == "IN"){
					this.value = !this.value;
				}else{
					this.value = false;
					this.in?.out.splice(this.in?.out.indexOf(this), 1);
					this.in = null;
				}
			}else{
				if(draggingObject?.constructor == Line){
					if(draggingObject.originObject.parent != this.parent){
						if(!this.parent.outputs.includes(this) && this.parent.gate != "IN"){ //If this object is not an output or an "IN"
							this.in?.out.splice(this.in?.out.indexOf(this), 1);
							draggingObject.originObject.out.push(this);
							this.in = draggingObject.originObject;
						}
					}    
				}
			}
		}
	}
}

class Line {
	constructor(originObject){
		this.originObject = originObject;
	}
	draw(){
		ctx.moveTo(this.originObject.parent.x + this.originObject.x, this.originObject.parent.y + this.originObject.y);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
	}
}

class Gate {
	constructor(x, y, type){
		switch(type){
			case "AND":
			case "OR":
			case "XOR":
				new Box(x, y, 100, 100, "blue", "black", "#00e5ff", [
					new BinaryNode(0, 0, 20, "green", "black", "yellow", false),
					new BinaryNode(0, 100, 20, "green", "black", "yellow", false)
				], [
					new BinaryNode(100, 50, 20, "green", "black", "yellow", false)
				], type);
				break;
			case "NOT":
				new Box(x, y, 100, 100, "blue", "black", "#00e5ff", [
					new BinaryNode(0, 50, 20, "green", "black", "yellow", false)
				], [
					new BinaryNode(100, 50, 20, "green", "black", "yellow", true)
				], type);
				break;
			case "IN":
				new Box(x, y, 100, 100, "blue", "black", "#00e5ff", [
					new BinaryNode(0, 50, 30, "green", "black", "yellow", false)
				], [
					new BinaryNode(100, 50, 20, "green", "black", "yellow", false)
				], type);
				break;

		}
	}
}

class GateSpawner extends MouseInteractable {
	constructor(x, y, width, height, color, outlineColor, selectedColor, type){
		super(x, y, color, outlineColor, selectedColor);
		this.width = width;
		this.height = height;
		this.type = type;
	}
	draw(){
		ctx.beginPath();
		ctx.strokeStyle = this.outlineColor;
		if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
			ctx.fillStyle = this.selectedColor;
		}else{
			ctx.fillStyle = this.color;
		}
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.fillStyle = "black";
		ctx.font = "bold 30pt Consolas";
		ctx.textAlign = "center";
		ctx.fillText(this.type, this.x + this.width / 2, this.y + 62);
	}
	onMouseUp(){}
	onMouseDown(){
		if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
			draggingObject = new Gate(850, 850, this.type);
		}
	}
}

class SelectionBox {
	draw(){
		ctx.fillStyle = "rgba(0, 0, 255, 0.2)"
		ctx.fillRect(lastX, lastY, mouseX - lastX, mouseY - lastY);
		ctx.strokeStyle = "blue";
		ctx.strokeRect(lastX, lastY, mouseX - lastX, mouseY - lastY);
	}
	select(){
		var selectedBoxes = [];
		for(const item of MouseInteractables){
			if(item.constructor == Box){
				if(item.x < lastX && item.x > mouseX && item.y < lastY && item.y > mouseY){
					item.color = "#00e577";
					selectedBoxes.push(item);
				}
			}
		}
		if(selectedBoxes.length > 0){
			selectionGroup = new SelectionGroup(selectedBoxes);
		}
	}
}

class SelectionGroup {
	constructor(children){
		this.children = children;
		this.lastFrameX = mouseX;
		this.lastFrameY = mouseY;
		this.x = mouseX;
		this.y = mouseY;
	}
	draw(){
		for(const child of this.children){
			child.x += this.x - this.lastFrameX;
			child.y += this.y - this.lastFrameY;
		}
		this.lastFrameX = this.x;
		this.lastFrameY = this.y;
	}
}

var gates = ["IN", "NOT", "OR", "AND", "XOR"];
for(var i = 0; i < gates.length; i++){
	new GateSpawner(850, 50 + i * 150, 100, 100, "blue", "black", "#00e5ff", gates[i]);
}

function update(){
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, 1000, 1000);
	ctx.fillStyle = "#bbbbbb";
	ctx.fillRect(800, 0, 200, 1000);
	if(draggingObject && lastX != mouseX && lastY != mouseY){
		draggingObject.x = mouseX - draggingObject.width / 2;
		draggingObject.y = mouseY - draggingObject.height / 2;
	}
	if(selectionGroup){
		selectionGroup.x = mouseX;
		selectionGroup.y = mouseY;
		selectionGroup.draw();
	}
	if(draggingObject?.constructor == Line || draggingObject?.constructor == SelectionBox){
		draggingObject.draw();
	}
	for(var i = 0; i < MouseInteractables.length; i++){
		MouseInteractables[i].draw();
	}            
	
	window.requestAnimationFrame(update);
}

function updateMouseValues(e){
	let cbounds = c.getBoundingClientRect();
	mouseX = Math.round(e.offsetX * (c.width / (cbounds.right - cbounds.left)));
	mouseY = Math.round(e.offsetY * (c.height / (cbounds.bottom - cbounds.top)));
	
	if(e.type == "mousedown"){
		lastX = mouseX;
		lastY = mouseY;
		if(!selectionGroup){
			for(var i = 0; i < MouseInteractables.length; i++){
				MouseInteractables[i].onMouseDown();
			}
		}
		if(!draggingObject && !selectionGroup){
			draggingObject = new SelectionBox();
		}
	}
	if(e.type == "mouseup"){
		for(var i = 0; i < MouseInteractables.length; i++){
			MouseInteractables[i].onMouseUp();
		}
		if(draggingObject?.constructor == SelectionBox){
			draggingObject.select();
		}
		draggingObject = null;
		if(mouseX == lastX && mouseY == lastY && selectionGroup){
			for(const child of selectionGroup.children){
				child.color = "blue";
			}
			selectionGroup = null;
		}
	}
}

function copy(){
	if(selectionGroup){
		for(const child of selectionGroup.children){
			var clone = _.cloneDeep(child); //MouseInteractables[MouseInteractables.length - 1];
			clone.x += 0;
			clone.y += 0;
			clone.color = "blue";
			for(const node of clone.inputs.concat(clone.outputs)){
				MouseInteractables.push(node);
			}
			MouseInteractables.push(clone);
		}
	}
}