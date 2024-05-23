class Attribute {
	accessModifier;
	type;
	name;
	defaultValue;
	
	constructor(accessModifier, type, name, defaultValue){
		this.accessModifier = accessModifier;
		this.type = type;
		this.name = name;
		this.defaultValue = defaultValue;
	}
}

const attributeRow = ' \
	<tr> \
		<td> \
			<select> \
				<option value="private ">Private</option> \
				<option value="public ">Public</option> \
				<option value="protected ">Protected</option> \
				<option value="">Package-Access</option> \
			</select> \
		</td> \
		<td> \
			<input placeholder="type"></input> \
		</td> \
		<td> \
			<input placeholder="name"></input> \
		</td> \
		<td> \
			<input placeholder="default value"></input> \
		</td> \
		<td> \
			<button onclick="removeRow(this.parentElement.parentElement);">-</button> \
		</td> \
	</tr>';

const outputElement = document.getElementById("output");
const attributeTable = document.getElementById("input-attributes");

window.onload = function(){
	for(const inputElement of document.getElementsByClassName("input")){
		inputElement.oninput = generate;
	}
	generate();
};

function removeRow(obj){
	obj.remove();
	generate();
}

function addRow(){
	let row = document.createElement("tr");
	row.innerHTML = attributeRow;
	attributeTable.insertBefore(row, attributeTable.children[attributeTable.children.length - 1]);
	generate();
}

function value(name){
	return document.getElementById("input-" + name).value;
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function generate(){
	let tab = "	";
	if(document.getElementById("input-useSpaces").checked){
		tab = "    ";
	}
	
	attributes = [];
	
	for(let i = 0; i < attributeTable.children.length - 1; i++){
		let attribute = attributeTable.children[i];
		
		attributes.push(new Attribute(
			attribute.children[0].children[0].value,
			attribute.children[1].children[0].value,
			attribute.children[2].children[0].value,
			attribute.children[3].children[0].value
		));
	}
	
	//class declaration
	output = "class ";
	output += value("className");
	output += " {\n";
	
	//class attributes
	for(let attribute of attributes){
		output += tab + 
			attribute.accessModifier +
			attribute.type + " " +
			attribute.name;
		
		if(attribute.defaultValue != ""){
			output += " = " + attribute.defaultValue;
		}
		
		output += ";\n"
	}
	output += tab + "\n";
	
	//constructor
	output += tab + "public " + value("className") + "(";
	for(let attribute of attributes){
		if(attribute.defaultValue == ""){
			output +=
				attribute.type + " " +
				attribute.name;
			if(attribute != attributes[attributes.length - 1]) output += ", ";
		}
	}
	output += "){\n";
	
	for(let attribute of attributes){
		if(attribute.defaultValue == ""){
			output += tab + tab + "this." + attribute.name + " = " + attribute.name + ";\n"
		}
	}
	output += tab + "}\n" + tab + "\n";
	
	//get and set methods
	for(let attribute of attributes){
		output += tab + "public " + attribute.type + " get" + capitalize(attribute.name) + "(){\n";
		output += tab + tab + "return this." + attribute.name + ";\n";
		output += tab + "}\n" + tab + "\n";
		
		output += tab + "public void set" + capitalize(attribute.name) + "(" + attribute.type + " " + attribute.name + "){\n"
		output += tab + tab + "this." + attribute.name + " = " + attribute.name + ";\n";
		output += tab + "}\n";
		
		if(attribute != attributes[attributes.length - 1]) output += "\n";
	}
	
	output += "}";
	
	outputElement.innerText = output;
}