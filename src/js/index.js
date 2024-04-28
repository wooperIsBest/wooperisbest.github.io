const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

window.onload = buildTable;

function buildTable(){
	const content = document.getElementById("project-table");
	
	for(const project of projects){
		let row = document.createElement("tr");
		
			let name = document.createElement("td");
			name.innerText = project.name;
			name.title = project.title;
			row.append(name);
			
				if(project.warning){
					let warning = document.createElement("span");
					warning.innerText = "⚠️";
					warning.title = "This project is " + project.warning + "!";
					name.append(warning);
				}
			
			let language = document.createElement("td");
			language.className = "center";
			row.append(language);

				let img = document.createElement("img");
				img.src = "./resources/images/index/" + project.type + ".png";
				img.title = "Made in " + project.type;
				img.width = 20;
				language.append(img);
		
			let site = document.createElement("td");
			site.className = "center";
			row.append(site);
			
				let link = document.createElement("a");
				link.href = "./projects/" + project.site;
				link.innerText = project.siteType;
				site.append(link);

			let source = document.createElement("td");
			source.className = "center";
			if(project.source){
				let link = document.createElement("a");
				link.href = "https://github.com/wooperIsBest/wooperisbest.github.io/tree/main/src/" + project.source;
				source.append(link);

				let img = document.createElement("img");
				img.src = "./resources/images/index/GitHub.png";
				img.title = "View source code on GitHub";
				img.width = 20;
				link.append(img);
			}else{
				source.innerText = "---";
				source.title = "Sorry, no source code available.";
			}
			row.append(source);
			
			let date = document.createElement("td");
			date.className = "center";
			let d = new Date(project.date);
			date.innerText = months[d.getMonth()] + " " + (d.getDate() < 10 ? "0" : "") + d.getDate() + ", " + d.getFullYear();
			row.append(date);
			
		content.append(row);
	}
}
