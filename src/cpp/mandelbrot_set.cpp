#include <iostream>
#include <SDL.h>

using namespace std;

bool init(char* name);
bool loop();
void kill();

struct complex {
	float a;
	float b;
};

// Pointers to our window and renderer
SDL_Window* window;
SDL_Renderer* renderer;

int main(int argc, char** args) {
	if ( !init("Mandelbrot Set") ) return 1;
	while ( loop() ) {
		// wait before processing the next frame
		SDL_Delay(10); 
	}

	kill();
	return 0;
}

float rangeStartX = -2.5;
float rangeEndX = 1.5;
float rangeStartY = -2;
float rangeEndY = 2;

float lerp(float a, float b, float t){
	return a + (b - a) * t;
}

bool loop() {
	static const unsigned char* keys = SDL_GetKeyboardState( NULL );

	SDL_Event e;
	SDL_Rect r;
	
	while ( SDL_PollEvent( &e ) != 0 ) {
		switch ( e.type ) {
			case SDL_QUIT:
				return false;
			case SDL_MOUSEBUTTONDOWN:
				break;
			case SDL_MOUSEMOTION:
				break;
			case SDL_MOUSEBUTTONUP:
				break;
			case SDL_KEYDOWN:
				float scale = 0.1 * (rangeEndX - rangeStartX);
				switch(e.key.keysym.sym){
					case SDLK_LEFT:
						rangeStartX -= scale;
						rangeEndX -= scale;
						break;
					case SDLK_RIGHT:
						rangeStartX += scale;
						rangeEndX += scale;
						break;
					case SDLK_UP:
						rangeStartY -= scale;
						rangeEndY -= scale;
						break;
					case SDLK_DOWN:
						rangeStartY += scale;
						rangeEndY += scale;
						break;
					case SDLK_w:
						float centerX = (rangeStartX + rangeEndX) / 2;
						float centerY = (rangeStartY + rangeEndY) / 2;
						rangeStartX = lerp(rangeStartX, centerX, 0.1);
						rangeEndX = lerp(rangeEndX, centerX, 0.1);
						rangeStartY = lerp(rangeStartY, centerY, 0.1);
						rangeEndY = lerp(rangeEndY, centerY, 0.1);
						//rangeStartX -= 0.1 * rangeStartX;
						//rangeEndX -= 0.1 * rangeEndX;
						//rangeStartY -= 0.1 * rangeStartY;
						//rangeEndY -= 0.1 * rangeEndY;
						break;
				}
				break;
		}
	}

	//Clear Window
	SDL_SetRenderDrawColor( renderer, 255, 255, 255, 255 );
	SDL_RenderClear( renderer );
	
	SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
	
	float SIZE = 800;
	int MAX_ITERATIONS = 255;
	for(float x = 0; x < SIZE; x++){
		for(float y = 0; y < SIZE; y++){
			struct complex c = { rangeStartX + (rangeEndX - rangeStartX) * x / SIZE, rangeStartY + (rangeEndY - rangeStartY) * y / SIZE};
			struct complex value = {0, 0};
			
			int i = 0;
			while(value.a * value.a + value.b * value.b <= 4 && i < MAX_ITERATIONS){
				float tempA = (value.a * value.a) - (value.b * value.b) + c.a;
				value.b = 2 * value.a * value.b + c.b;
				value.a = tempA;
				i++;
			}
			
			//SDL_SetRenderDrawColor(renderer, i, i, i, 255);
			int brightness = i * 10 * MAX_ITERATIONS / 255;
			SDL_SetRenderDrawColor(renderer, brightness, brightness, brightness, 255);
			SDL_RenderDrawPoint(renderer, x, y);
		}
	}
	
	SDL_RenderPresent( renderer );
	return true;
}

bool init(char* name) {
	if ( SDL_Init( SDL_INIT_EVERYTHING ) < 0 ) {
		cout << "Error initializing SDL: " << SDL_GetError() << endl;
		system("pause");
		return false;
	} 

	window = SDL_CreateWindow( name, SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 800, 800, SDL_WINDOW_SHOWN );
	if ( !window ) {
		cout << "Error creating window: " << SDL_GetError() << endl;
		system("pause");
		return false;
	}

	renderer = SDL_CreateRenderer( window, -1, SDL_RENDERER_ACCELERATED );
	if ( !renderer ) {
		cout << "Error creating renderer: " << SDL_GetError() << endl;
		return false;
	}

	SDL_SetRenderDrawColor( renderer, 255, 255, 255, 255 );
	SDL_RenderClear( renderer );
	return true;
}

void kill() {
	SDL_DestroyRenderer( renderer );
	SDL_DestroyWindow( window );
	SDL_Quit();
}