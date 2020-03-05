function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;

	this.draw = function(){
        
		if(mouseIsPressed){
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
                
//loadPixels()-loads the pixel data of the current display window into the pixels[] array. 
//This function must always be called before reading from or writing to pixels[].
        
				loadPixels();
			}

			else{
// to apply changes we need to call updatePixels()
				updatePixels(); 
				line(startMouseX, startMouseY, mouseX, mouseY);
			}

		}

		else if(drawing){
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};


}
