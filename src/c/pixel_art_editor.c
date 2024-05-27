#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <SDL.h>
#include <SDL_image.h>

#define SDL_CHECK(ptr, name) \
	if (!ptr) { \
		printf("Error creating %s: %s\n", name, SDL_GetError()); \
		system("pause"); \
		return false; \
	}

/*<RunNpp>
	tag SDL
	tag SDL_image
//	tag NoConsole
</RunNpp>*/
//	tag StayOpen

//Application metadata
const char* APP_NAME = "Pixel Art Editor";

const int MIN_WINDOW_WIDTH = 680;
const int MIN_WINDOW_HEIGHT = 400;
const int FRAME_RATE = 1000 / 60;

//Color constants
const SDL_Color BACKGROUND_COLOR 		= {240, 240, 240, 255};
const SDL_Color CANVAS_CHECK_1_COLOR	= {255, 255, 255, 255};
const SDL_Color CANVAS_CHECK_2_COLOR	= {190, 190, 190, 255};

const SDL_Color TOOLBAR_COLOR			= {218, 240, 240, 255};
const SDL_Color BUTTON_DEFAULT_COLOR	= {190, 190, 190, 255};
const SDL_Color BUTTON_SELECT_COLOR		= {150, 150, 150, 255};

const SDL_Color MOUSE_POINTER_COLOR		= {120, 120, 120, 255};

const SDL_Color BLACK					= {0,   0,   0,   255};
const SDL_Color BLANK					= {0,   0,   0,   0  };

#define color_equals(c1, c2) (c1.r == c2.r && c1.g == c2.g && c1.b == c2.b && c1.a == c2.a)

//Drawing helpers
SDL_Rect rect;

#define SDL_SetColor(color) SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, color.a);
#define SDL_DrawRect(rx, ry, rw, rh) rect.x = rx; rect.y = ry; rect.w = rw; rect.h = rh; SDL_RenderDrawRect(renderer, &rect);
#define SDL_FillRect(rx, ry, rw, rh) rect.x = rx; rect.y = ry; rect.w = rw; rect.h = rh; SDL_RenderFillRect(renderer, &rect);

//SDL setup
SDL_Window* window;
SDL_Renderer* renderer;

bool init(void);
bool draw(void);
void kill(void);

//Images
#define NUM_IMAGES 5
const char* IMAGE_NAMES[NUM_IMAGES] = {
	"Pencil.png",
	"Eraser.png",
	"Bucket.png",
	"Line.png",
	"Dropper.png",
};
SDL_Texture* images[NUM_IMAGES];

//Window scaling constants, variables, and tools
const int VIRTUAL_WIDTH = 100;
const int VIRTUAL_HEIGHT = 100;
int windowWidth;
int windowHeight;

#define windowX(virtualX) (windowWidth * (virtualX) / VIRTUAL_WIDTH)
#define windowY(virtualY) (windowHeight * (virtualY) / VIRTUAL_HEIGHT)
#define windowSize(virtualSize) ((windowWidth < windowHeight ? windowWidth : windowHeight) * (virtualSize) / VIRTUAL_WIDTH)

//UI Constants
const int TOOLBAR_HEIGHT = 100;
const int BUTTON_SIZE = 50;

const int RESIZE_HANDLE_SIZE = 14;
const int SCROLLBAR_WIDTH = 16;

//Canvas and drawing
int canvasWidth = 16;
int canvasHeight = 16;
int pixelScale = 1 << 4;

SDL_Color* canvas;
#define canvasPoint(x, y) (canvas[(x) + (y) * canvasWidth])

enum DrawingTool {
	DrawingTool_Pencil,
	DrawingTool_Eraser,
	DrawingTool_Fill,
	DrawingTool_Line,
	DrawingTool_Dropper,
	
	DrawingTool_Last = DrawingTool_Dropper
};

//User interaction
bool mouseDown;
bool mouseClick;
bool mouseUnclick;
int mouseX;
int mouseY;
int lastMouseX;
int lastMouseY;
int lastMouseClickX;
int lastMouseClickY;
int lastMouseClickCanvasX;
int lastMouseClickCanvasY;

int scrollX = 0;
int scrollY = 0;

int scrollAmount = 1;

enum DragTarget {
	DragTarget_None,
	DragTarget_ResizeHandleY,
	DragTarget_ResizeHandleX,
};
enum DragTarget dragTarget;

enum DrawingTool selectedTool = DrawingTool_Pencil;

SDL_Color colorPalette[] = {
	{255, 255, 255, 255},
	{0,   0,   0,   255},
	{255, 0,   0,   255},
	{255, 145, 0,   255},
	{255, 255, 0,   255},
	{0,   255, 0,   255},
	{0,   0,   255, 255},
	{3,   236, 252, 255},
	{190, 0,   255, 255},
	{0,   0,   0,   0  },
};
SDL_Color selectedColor = {0, 255, 0, 255};

enum BrushSize {
	BrushSize_Small  = 1,
	BrushSize_Medium = 3,
	BrushSize_Large  = 5
};

enum BrushSize brushSize = BrushSize_Small;

#define mouseInRect(x, y, w, h) (mouseX >= x && mouseX < x + w && mouseY >= y && mouseY < y + h)
void drawPoint(bool write, int x, int y);
void fill(SDL_Color replace, int x, int y);
void line(bool write, int x1, int y1, int x2, int y2);

//Main program
int main(int argc, char** args) {
	if (!init()) return 1;

	while(draw()) {
		lastMouseX = mouseX;
		lastMouseY = mouseY;
		mouseDown = SDL_GetMouseState(&mouseX, &mouseY) & SDL_BUTTON(1);
		SDL_GetWindowSize(window, &windowWidth, &windowHeight);
		SDL_Delay(FRAME_RATE);
	}

	kill();
	return 0;
}

bool draw() {
	//Event handling
	SDL_Event event;
	
	while(SDL_PollEvent(&event)) {
		switch(event.type){
			case SDL_QUIT: 
				return false;
			case SDL_MOUSEBUTTONDOWN:
				mouseClick = true;
				lastMouseClickX = mouseX;
				lastMouseClickY = mouseY;
				
				lastMouseClickCanvasX = (mouseX - scrollX) / pixelScale;
				lastMouseClickCanvasY = (mouseY - TOOLBAR_HEIGHT - scrollY) / pixelScale;
				
				break;
			case SDL_MOUSEBUTTONUP:
				mouseUnclick = true;
				break;
			case SDL_KEYDOWN:
				switch(event.key.keysym.sym){
					case SDLK_MINUS:
						if(pixelScale >= 2) pixelScale /= 2;
						break;
					case SDLK_EQUALS:
					case SDLK_PLUS:
						if(pixelScale <= 1 << 8) pixelScale *= 2;
						break;
					case SDLK_UP:
						scrollY += scrollAmount;
						break;
					case SDLK_DOWN:
						scrollY -= scrollAmount;
						break;
					case SDLK_RIGHT:
						scrollX -= scrollAmount;
						break;
					case SDLK_LEFT:
						scrollX += scrollAmount;
						break;
				}
				break;
		}
	}
	
	//Scrollbar Logic
	scrollAmount = pixelScale;
	
	if(canvasWidth * pixelScale <= windowWidth){
		scrollX = 0;
	}else if(scrollX > 0){
		scrollX = 0;
	}else if(pixelScale * canvasWidth + scrollX < windowWidth) {
		scrollX = windowWidth - pixelScale * canvasWidth;
	}
	
	if(TOOLBAR_HEIGHT + canvasHeight * pixelScale <= windowHeight){
		scrollY = 0;
	}else if(scrollY > 0){
		scrollY = 0;
	}else if(TOOLBAR_HEIGHT + pixelScale * canvasHeight + scrollY < windowHeight) {
		scrollY = windowHeight - (TOOLBAR_HEIGHT + pixelScale * canvasHeight);
	}
	
	//Background
	SDL_SetColor(BACKGROUND_COLOR);
	SDL_RenderClear(renderer);
	
	//Canvas
	for(int y = 0; y < canvasHeight; y++){
		for(int x = 0; x < canvasWidth; x++){
			int pixelX = x * pixelScale + scrollX;
			int pixelY = TOOLBAR_HEIGHT + y * pixelScale + scrollY;
			
			if(mouseInRect(pixelX, pixelY, pixelScale, pixelScale) && mouseY > TOOLBAR_HEIGHT && dragTarget == DragTarget_None){
				SDL_SetColor(MOUSE_POINTER_COLOR);
			}else if(canvas[x + y * canvasWidth].a){
				SDL_SetColor(canvas[x + y * canvasWidth]);
			}else if((x + y) % 2){
				SDL_SetColor(CANVAS_CHECK_1_COLOR);
			}else{
				SDL_SetColor(CANVAS_CHECK_2_COLOR);
			}
			SDL_FillRect(pixelX, pixelY, pixelScale, pixelScale);
		}
	}
	
	if(dragTarget == DragTarget_None){
		SDL_SetColor(BLACK);
		SDL_DrawRect(0, TOOLBAR_HEIGHT, canvasWidth * pixelScale, canvasHeight * pixelScale);
	}
	
	//Canvas resize handles
	if(mouseClick && mouseInRect(canvasWidth * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2, TOOLBAR_HEIGHT + canvasHeight * pixelScale - RESIZE_HANDLE_SIZE / 2, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE)){
		dragTarget = DragTarget_ResizeHandleY;
	}
	
	if(dragTarget == DragTarget_ResizeHandleY){
		SDL_SetColor(BLACK);
		SDL_DrawRect(0, TOOLBAR_HEIGHT, canvasWidth * pixelScale, (mouseY - TOOLBAR_HEIGHT) / pixelScale * pixelScale);
		
		SDL_SetColor(TOOLBAR_COLOR);
		SDL_FillRect(
			canvasWidth * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2,
			(mouseY - TOOLBAR_HEIGHT) / pixelScale * pixelScale + TOOLBAR_HEIGHT - RESIZE_HANDLE_SIZE / 2,
			RESIZE_HANDLE_SIZE,
			RESIZE_HANDLE_SIZE
		);
		SDL_SetColor(BLACK);
		SDL_DrawRect(
			canvasWidth * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2,
			(mouseY - TOOLBAR_HEIGHT) / pixelScale * pixelScale + TOOLBAR_HEIGHT - RESIZE_HANDLE_SIZE / 2,
			RESIZE_HANDLE_SIZE,
			RESIZE_HANDLE_SIZE
		);
		
		if(mouseUnclick){
			int oldCanvasHeight = canvasHeight;
			SDL_Color* oldCanvas = canvas;
			
			canvasHeight = (mouseY - TOOLBAR_HEIGHT) / pixelScale;
			canvas = realloc(canvas, sizeof(SDL_Color) * canvasWidth * canvasHeight);
			
			if(canvas == NULL){
				printf("Not enough memory to resize the canvas!\n");
				canvasHeight = oldCanvasHeight;
				canvas = oldCanvas;
			}else{
				//Clear any garbage data from the realloc
				for(int i = canvasWidth * oldCanvasHeight; i < canvasWidth * canvasHeight; i++){
					canvas[i] = BLANK;
				}
			}
		}
	}else{
		SDL_SetColor(TOOLBAR_COLOR);
		SDL_FillRect(canvasWidth * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2, TOOLBAR_HEIGHT + canvasHeight * pixelScale - RESIZE_HANDLE_SIZE / 2, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
		SDL_SetColor(BLACK);
		SDL_DrawRect(canvasWidth * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2, TOOLBAR_HEIGHT + canvasHeight * pixelScale - RESIZE_HANDLE_SIZE / 2, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
	}
	
	if(mouseClick && mouseInRect(canvasWidth * pixelScale - RESIZE_HANDLE_SIZE / 2, TOOLBAR_HEIGHT + canvasHeight * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE)){
		dragTarget = DragTarget_ResizeHandleX;
	}
	
	if(dragTarget == DragTarget_ResizeHandleX){
		SDL_SetColor(BLACK);
		SDL_DrawRect(0, TOOLBAR_HEIGHT, mouseX / pixelScale * pixelScale, canvasHeight * pixelScale);
		
		SDL_SetColor(TOOLBAR_COLOR);
		SDL_FillRect(
			mouseX / pixelScale * pixelScale - RESIZE_HANDLE_SIZE / 2,
			TOOLBAR_HEIGHT + canvasHeight * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2,
			RESIZE_HANDLE_SIZE,
			RESIZE_HANDLE_SIZE
		);
		SDL_SetColor(BLACK);
		SDL_DrawRect(
			mouseX / pixelScale * pixelScale - RESIZE_HANDLE_SIZE / 2,
			TOOLBAR_HEIGHT + canvasHeight * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2,
			RESIZE_HANDLE_SIZE,
			RESIZE_HANDLE_SIZE
		);
		
		
		
		if(mouseUnclick){
			int oldCanvasWidth = canvasWidth;
			SDL_Color* oldCanvas = canvas;
			
			canvasWidth = mouseX / pixelScale;
			
			if(canvasWidth > oldCanvasWidth){
				canvas = realloc(canvas, sizeof(SDL_Color) * canvasWidth * canvasHeight);
				
				if(canvas == NULL){
					printf("Not enough memory to resize the canvas!\n");
					canvasWidth = oldCanvasWidth;
					canvas = oldCanvas;
				}else{
					for(int i = canvasHeight - 1; i > 0; i--){
						for(int x = oldCanvasWidth - 1; x >= 0; x--){
							canvas[i * canvasWidth + x] = canvas[i * oldCanvasWidth + x];
							canvas[i * oldCanvasWidth + x] = BLANK;
						}
						for(int x = oldCanvasWidth; x < canvasWidth; x++){
							canvas[i * canvasWidth + x] = BLANK;
						}
					}
				}
			}else{
				for(int i = 1; i < canvasHeight; i++){
					for(int x = 0; x < canvasWidth; x++){
						canvas[i * canvasWidth + x] = canvas[i * oldCanvasWidth + x];
					}
				}
				
				canvas = realloc(canvas, sizeof(SDL_Color) * canvasWidth * canvasHeight);
				
				if(canvas == NULL){
					printf("Not enough memory to resize the canvas!\n");
					canvasWidth = oldCanvasWidth;
					canvas = oldCanvas;
				}	
			}
		}
	}else{
		SDL_SetColor(TOOLBAR_COLOR);
		SDL_FillRect(canvasWidth * pixelScale - RESIZE_HANDLE_SIZE / 2, TOOLBAR_HEIGHT + canvasHeight * pixelScale / 2- RESIZE_HANDLE_SIZE / 2, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
		SDL_SetColor(BLACK);
		SDL_DrawRect(canvasWidth * pixelScale - RESIZE_HANDLE_SIZE / 2, TOOLBAR_HEIGHT + canvasHeight * pixelScale / 2 - RESIZE_HANDLE_SIZE / 2, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
	}
	
	//User input
	const Uint8* keys = SDL_GetKeyboardState(NULL);
	
	if(mouseInRect(0, TOOLBAR_HEIGHT, canvasWidth * pixelScale, canvasHeight * pixelScale) && dragTarget == DragTarget_None){
		int mouseCanvasX = (mouseX - scrollX) / pixelScale;
		int mouseCanvasY = (mouseY - TOOLBAR_HEIGHT - scrollY) / pixelScale;
		
		int lastMouseCanvasX = (lastMouseX - scrollX) / pixelScale;
		int lastMouseCanvasY = (lastMouseY - TOOLBAR_HEIGHT - scrollY) / pixelScale;
		
		SDL_Color color;
		if(mouseDown){
			switch(selectedTool){
				case DrawingTool_Pencil:
					line(true, lastMouseCanvasX, lastMouseCanvasY, mouseCanvasX, mouseCanvasY);
					break;
				case DrawingTool_Eraser:
					color = selectedColor;
					selectedColor = BLANK;
					line(true, lastMouseCanvasX, lastMouseCanvasY, mouseCanvasX, mouseCanvasY);
					selectedColor = color;
					break;
				case DrawingTool_Line:
					if(
						lastMouseClickX >= 0 && lastMouseClickX < canvasWidth * pixelScale &&
						lastMouseClickY >= TOOLBAR_HEIGHT && lastMouseClickY <= TOOLBAR_HEIGHT + canvasHeight * pixelScale
					){
						line(false, mouseCanvasX, mouseCanvasY, lastMouseClickCanvasX, lastMouseClickCanvasY);
					}
					break;
				case DrawingTool_Dropper:
					selectedColor = canvasPoint(mouseCanvasX, mouseCanvasY);
				default:
					break;
			}
		}
		
		if(mouseClick){
			if(selectedTool == DrawingTool_Fill && !color_equals(selectedColor, canvasPoint(mouseX / pixelScale, (mouseY - TOOLBAR_HEIGHT) / pixelScale))){
				fill(canvasPoint(mouseCanvasX, mouseCanvasY), mouseCanvasX, mouseCanvasY);
			}
		}
		
		if(mouseUnclick){
			if(selectedTool == DrawingTool_Line){
				if(
					lastMouseClickX >= 0 && lastMouseClickX < canvasWidth * pixelScale &&
					lastMouseClickY >= TOOLBAR_HEIGHT && lastMouseClickY <= TOOLBAR_HEIGHT + canvasHeight * pixelScale
				){
					line(true, mouseCanvasX, mouseCanvasY, lastMouseClickCanvasX, lastMouseClickCanvasY);
				}
			}
		}
	}
	
	//Scrollbar UI
	if(canvasWidth * pixelScale > windowWidth){
		SDL_SetColor(BUTTON_DEFAULT_COLOR);
		SDL_FillRect(0, windowHeight - SCROLLBAR_WIDTH, windowWidth, SCROLLBAR_WIDTH);
		
		SDL_SetColor(BUTTON_SELECT_COLOR);
		float percent = (float) windowWidth / (canvasWidth * pixelScale);
		float scrollPercent = (float) scrollX / (windowWidth - pixelScale * canvasWidth);
		SDL_FillRect(scrollPercent * (1 - percent) * windowWidth, windowHeight - SCROLLBAR_WIDTH, percent * windowWidth, SCROLLBAR_WIDTH);
	}

	if(TOOLBAR_HEIGHT + canvasHeight * pixelScale > windowHeight){
		SDL_SetColor(BUTTON_DEFAULT_COLOR);
		SDL_FillRect(windowWidth - SCROLLBAR_WIDTH, TOOLBAR_HEIGHT, SCROLLBAR_WIDTH, windowHeight - TOOLBAR_HEIGHT);
		
		SDL_SetColor(BUTTON_SELECT_COLOR);
		float percent = (float) (windowHeight - TOOLBAR_HEIGHT) / (canvasHeight * pixelScale - TOOLBAR_HEIGHT);
		float scrollPercent = (float) scrollY / (windowHeight - (TOOLBAR_HEIGHT + pixelScale * canvasHeight));
		SDL_FillRect(windowWidth - SCROLLBAR_WIDTH, TOOLBAR_HEIGHT + scrollPercent * (1 - percent) * (windowHeight - TOOLBAR_HEIGHT), SCROLLBAR_WIDTH, percent * (windowHeight - TOOLBAR_HEIGHT));
	}
	
	//Toolbar UI
	SDL_SetColor(TOOLBAR_COLOR);
	SDL_FillRect(0, 0, windowWidth, TOOLBAR_HEIGHT);
	
	//Tools
	int padding = (TOOLBAR_HEIGHT - BUTTON_SIZE) / 2;
	for(int i = 0; i <= DrawingTool_Last; i++){
		int buttonX = padding + i * (BUTTON_SIZE + padding);
		int buttonY = padding;
		
		if(i == selectedTool){
			SDL_SetColor(BUTTON_SELECT_COLOR);
		}else{
			SDL_SetColor(BUTTON_DEFAULT_COLOR);
		}
		
		SDL_FillRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE);
		SDL_RenderCopy(renderer, images[i], NULL, &rect);
		
		SDL_SetColor(BLACK);
		SDL_DrawRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE);
		
		if(mouseDown && mouseInRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE)){
			selectedTool = i;
		}
	}
	
	//Selected Color
	if(selectedColor.a > 0){
		SDL_SetColor(selectedColor);
		SDL_FillRect(padding + (DrawingTool_Last + 1) * (BUTTON_SIZE + padding), padding, BUTTON_SIZE, BUTTON_SIZE);
		SDL_SetColor(BLACK);
		SDL_DrawRect(padding + (DrawingTool_Last + 1) * (BUTTON_SIZE + padding), padding, BUTTON_SIZE, BUTTON_SIZE);
	}else{
		SDL_SetColor(CANVAS_CHECK_1_COLOR);
		SDL_FillRect(padding + (DrawingTool_Last + 1) * (BUTTON_SIZE + padding), padding, BUTTON_SIZE, BUTTON_SIZE);
		SDL_SetColor(CANVAS_CHECK_2_COLOR);
		SDL_FillRect(padding + (DrawingTool_Last + 1) * (BUTTON_SIZE + padding), padding, BUTTON_SIZE / 2, BUTTON_SIZE / 2);
		SDL_FillRect(padding + (DrawingTool_Last + 1) * (BUTTON_SIZE + padding) + BUTTON_SIZE / 2, padding + BUTTON_SIZE / 2, BUTTON_SIZE / 2, BUTTON_SIZE / 2);
	}
	
	//Palette
	for(int i = 0; colorPalette[i].a; i++){
		int buttonX = padding + (DrawingTool_Last + 2) * (BUTTON_SIZE + padding) + i * padding;
		int buttonY = padding;
		
		SDL_SetColor(colorPalette[i]);
		SDL_FillRect(buttonX, buttonY, BUTTON_SIZE / 2, BUTTON_SIZE / 2);
		
		if(mouseDown && mouseInRect(buttonX, buttonY, BUTTON_SIZE / 2, BUTTON_SIZE / 2)){
			selectedColor = colorPalette[i];
		}
	}
	
	if(keys[SDL_SCANCODE_P]) selectedTool = DrawingTool_Pencil;
	if(keys[SDL_SCANCODE_E]) selectedTool = DrawingTool_Eraser;
	if(keys[SDL_SCANCODE_F]) selectedTool = DrawingTool_Fill;
	if(keys[SDL_SCANCODE_L]) selectedTool = DrawingTool_Line;
	if(keys[SDL_SCANCODE_D]) selectedTool = DrawingTool_Dropper;
	
	if(keys[SDL_SCANCODE_1]) brushSize = BrushSize_Small;
	if(keys[SDL_SCANCODE_2]) brushSize = BrushSize_Medium;
	if(keys[SDL_SCANCODE_3]) brushSize = BrushSize_Large;
	
	if(mouseUnclick) dragTarget = DragTarget_None;
	mouseClick = false;
	mouseUnclick = false;
	
	SDL_RenderPresent(renderer);
	return true;
}

bool init(){
	if (SDL_Init(SDL_INIT_EVERYTHING) < 0) {
		printf("Error initializing SDL: %s\n", SDL_GetError());
		system("pause");
		return false;
	}
	
	if (IMG_Init(IMG_INIT_PNG) < 0) {
		printf("Error initializing SDL_image: %s\n", IMG_GetError());
		system("pause");
		return false;
	}

	window = SDL_CreateWindow(
		APP_NAME,
		SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT,
		SDL_WINDOW_SHOWN | SDL_WINDOW_RESIZABLE | SDL_WINDOW_MAXIMIZED
	);
	SDL_CHECK(window, "Window");
	SDL_SetWindowMinimumSize(window, MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT);
	
	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
	SDL_CHECK(renderer, "Renderer");
	
	for(int i = 0; i < NUM_IMAGES; i++){
		SDL_Surface* image = IMG_Load(IMAGE_NAMES[i]);
		SDL_CHECK(image, "Image");
		
		Uint32 colorkey = SDL_MapRGB(image->format, 255, 255, 255);
		SDL_SetColorKey(image, SDL_TRUE, colorkey);
		
		images[i] = SDL_CreateTextureFromSurface(renderer, image);
		
		SDL_FreeSurface(image);
	}
	
	canvas = calloc(sizeof(SDL_Color), canvasWidth * canvasHeight);
	
	return true;
}

void kill(){
	for(int i = 0; i < NUM_IMAGES; i++){
		SDL_DestroyTexture(images[i]);
	}
	
	free(canvas);
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	SDL_Quit();
}

void drawPoint(bool write, int x, int y){
	int startX = x - brushSize / 2;
	int endX = x + brushSize / 2;
	
	if(startX < 0) startX = 0;
	if(endX >= canvasWidth) endX = canvasWidth - 1;
	
	int startY = y - brushSize / 2;
	int endY = y + brushSize / 2;
	
	if(startY < 0) startY = 0;
	if(endY >= canvasHeight) endY = canvasHeight - 1;
	
	for(int ox = startX; ox <= endX; ox++){
		for(int oy = startY; oy <= endY; oy++){
			SDL_FillRect(ox * pixelScale + scrollX, TOOLBAR_HEIGHT + oy * pixelScale + scrollY, pixelScale, pixelScale);
			
			if(write) canvasPoint(ox, oy) = selectedColor;
		}
	}
}

void fill(SDL_Color replace, int x, int y){
	if(x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) return;
	SDL_Color point = canvasPoint(x, y);
	if(!color_equals(point, replace)) return;
	
	canvasPoint(x, y) = selectedColor;
	fill(replace, x + 1, y);
	fill(replace, x, y + 1);
	fill(replace, x - 1, y);
	fill(replace, x, y - 1);
}

void line(bool write, int x1, int y1, int x2, int y2){
	SDL_SetColor(selectedColor);
	float slope = (float) (y1 - y2) / (x1 - x2);
	
	drawPoint(write, x2, y2);
	
	if(slope <= 1 && slope >= -1){ //y = mx + b
		int min = (x1 < x2 ? x1 : x2);
		int max = (x1 > x2 ? x1 : x2);
		
		for(int x = min; x < max; x++){
			int y = slope * (x - x2) + y2 + 0.5;
			
			drawPoint(write, x, y);
		}
	}else{ //x = my + b;
		slope = 1 / slope;
		int min = (y1 < y2 ? y1 : y2);
		int max = (y1 > y2 ? y1 : y2);
		
		for(int y = min; y < max; y++){
			int x = slope * (y - y2) + x2 + 0.5;
			
			drawPoint(write, x, y);
		}
	}
	
	drawPoint(write, x1, y1);
}