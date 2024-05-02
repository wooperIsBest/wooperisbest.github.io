#include <stdio.h>
#include <stdlib.h>
#include <SDL.h>

#define false 0
#define true  1

#define MATRIX_WIDTH 10
#define MATRIX_HEIGHT 20
#define MATRIX_OFFSCREEN_HEIGHT 3

#define CELL_SIZE 35
#define PIECE_TYPES 8
#define PIECE_DATA_SIZE 5

#define UI_WIDTH 300

int init(char* name);
int loop();
void kill();
int frame = 0;

int timeStep = 50;

uint8_t matrix[MATRIX_WIDTH][MATRIX_HEIGHT + MATRIX_OFFSCREEN_HEIGHT];

uint8_t pieceData[PIECE_TYPES][PIECE_DATA_SIZE][PIECE_DATA_SIZE] = {
	{ //NULL
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //O Piece
		{0, 0, 0, 0, 0},
		{0, 1, 1, 0, 0},
		{0, 1, 1, 0, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //I Piece
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
		{1, 1, 1, 1, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //J Piece
		{0, 0, 0, 0, 0},
		{0, 0, 0, 1, 0},
		{0, 1, 1, 1, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //L Piece
		{0, 0, 0, 0, 0},
		{0, 1, 0, 0, 0},
		{0, 1, 1, 1, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //S Piece
		{0, 0, 0, 0, 0},
		{0, 0, 1, 1, 0},
		{0, 1, 1, 0, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //T Piece
		{0, 0, 0, 0, 0},
		{0, 0, 1, 0, 0},
		{0, 1, 1, 1, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
	{ //S Piece
		{0, 0, 0, 0, 0},
		{0, 1, 1, 0, 0},
		{0, 0, 1, 1, 0},
		{0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0},
	},
};
SDL_Color pieceColors[PIECE_TYPES] = {
	{0, 0, 0, 0},		//NULL
	{239, 247, 5, 255},	//O
	{66, 185, 245, 255},//I
	{0, 83, 217, 255},	//J
	{245, 173, 66, 255},//L
	{8, 212, 63, 255},	//S
	{210, 50, 250, 255},//T
	{250, 35, 35, 255},	//S
};

SDL_Point currentPiecePos;
int currentPieceType = 1;
int nextPieceType = 3;
uint8_t currentPieceData[PIECE_DATA_SIZE][PIECE_DATA_SIZE];

int pause = false;

// Pointers to our window and renderer
SDL_Window* window;
SDL_Renderer* renderer;

int main(int argc, char** args) {
	if ( !init("Tetris") ) return 1;

	while ( loop() ) {
		// wait before processing the next frame
		SDL_Delay(10);
		if(!pause){
			frame++;
		}
	}

	kill();
	return 0;
}

void copyPieceData(int pieceType){
	for(int x = 0; x < PIECE_DATA_SIZE; x++){
		for(int y = 0; y < PIECE_DATA_SIZE; y++){
			currentPieceData[x][y] = pieceData[pieceType][x][y];
		}
	}
}

void rotate(){
	uint8_t temp[PIECE_DATA_SIZE][PIECE_DATA_SIZE];
	
	for(int x = 0; x < PIECE_DATA_SIZE; x++){
		for(int y = 0; y < PIECE_DATA_SIZE; y++){
			temp[x][y] = currentPieceData[y][-x + (PIECE_DATA_SIZE / 2) * 2];
		}
	}
	
	for(int x = 0; x < PIECE_DATA_SIZE; x++){
		for(int y = 0; y < PIECE_DATA_SIZE; y++){
			currentPieceData[x][y] = temp[x][y];
		}
	}
}

void kickRight(){
	int success = false;
	while(!success){
		success = true;
		
		for(int i = 0; i < PIECE_DATA_SIZE; i++){
			for(int j = 0; j < PIECE_DATA_SIZE; j++){
				if(currentPieceData[i][j] && (matrix[currentPiecePos.x + i][currentPiecePos.y + j] || currentPiecePos.x + i < 0)){
					success = false;
					break;
				}
			}
		}
		
		if(!success){
			currentPiecePos.x++;
		}
	}
}

void kickLeft(){
	int success = false;
	while(!success){
		success = true;
		
		for(int i = 0; i < PIECE_DATA_SIZE; i++){
			for(int j = 0; j < PIECE_DATA_SIZE; j++){
				if(currentPieceData[i][j] && (matrix[currentPiecePos.x + i][currentPiecePos.y + j] || currentPiecePos.x + i >= MATRIX_WIDTH)){
					success = false;
					break;
				}
			}
		}
		
		if(!success){
			currentPiecePos.x--;
		}
	}
}

int loop() {

	//static const unsigned char* keys = SDL_GetKeymatrixState( NULL );

	SDL_Event e;
	
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
				switch(e.key.keysym.sym){
					case SDLK_RIGHT:
						currentPiecePos.x++;
						kickLeft();
						break;
					case SDLK_LEFT:
						currentPiecePos.x--;
						kickRight();
						break;
					case SDLK_DOWN:
						currentPiecePos.y++;
						break;
					case SDLK_RETURN:
						pause = !pause;
						break;
					case SDLK_UP:
						rotate();
						kickRight();
						kickLeft();
						break;
				}
				break;
		}
	}

	//Clear Window
	SDL_SetRenderDrawColor(renderer, 0, 0, 0, 0);
	SDL_RenderClear(renderer);
	
	SDL_Color color;
	SDL_Rect rect;
	rect.w = CELL_SIZE;
	rect.h = CELL_SIZE;
	
	//Render Blocks and Matrix
	for(int x = 0; x < MATRIX_WIDTH; x++){
		for(int y = MATRIX_OFFSCREEN_HEIGHT; y < MATRIX_HEIGHT + MATRIX_OFFSCREEN_HEIGHT; y++){
			rect.x = x * CELL_SIZE;
			rect.y = (y - MATRIX_OFFSCREEN_HEIGHT) * CELL_SIZE;
			
			if(matrix[x][y]){
				color = pieceColors[matrix[x][y]];
				SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, 255);
				SDL_RenderFillRect(renderer, &rect);
			}
			
			if(
				x >= currentPiecePos.x && x < currentPiecePos.x + PIECE_DATA_SIZE &&
				y >= currentPiecePos.y && y < currentPiecePos.y + PIECE_DATA_SIZE &&
				currentPieceData[x - currentPiecePos.x][y - currentPiecePos.y]
			){
				if(y + 1 >= MATRIX_HEIGHT + MATRIX_OFFSCREEN_HEIGHT || matrix[x][y+1]){
					if(!pause){
						for(int i = 0; i < PIECE_DATA_SIZE; i++){
							for(int j = 0; j < PIECE_DATA_SIZE; j++){
								if(currentPieceData[i][j] && currentPiecePos.y > 0){
									matrix[currentPiecePos.x + i][currentPiecePos.y + j] = currentPieceType;
								}
							}
						}
						if(currentPiecePos.y <= 0){
							pause = true;
							return false;
						}
						currentPiecePos.y = 0;
						currentPieceType = nextPieceType;
						nextPieceType = rand() % (PIECE_TYPES - 1) + 1;
						copyPieceData(currentPieceType);
					}
				}else{
					color = pieceColors[currentPieceType];
					SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, 255);
					SDL_RenderFillRect(renderer, &rect);
				}
			}
			
			SDL_SetRenderDrawColor(renderer, 100, 100, 100, 255);
			SDL_RenderDrawRect(renderer, &rect);
		}
	}
	
	if(frame % timeStep == 0){
		currentPiecePos.y++;
	}
	
	//Check for clears
	for(int y = MATRIX_OFFSCREEN_HEIGHT; y < MATRIX_HEIGHT + MATRIX_OFFSCREEN_HEIGHT; y++){
		int clear = true;
		for(int x = 0; x < MATRIX_WIDTH; x++){
			if(matrix[x][y] == 0){
				clear = false;
			}
		}

		if(clear){
			for(int i = y; i > 0; i--){
				for(int x = 0; x < MATRIX_WIDTH; x++){
					matrix[x][i] = matrix[x][i-1];
				}
			}
		}
	}
	
	//Render UI
	for(int x = 0; x < PIECE_DATA_SIZE; x++){
		for(int y = 0; y < PIECE_DATA_SIZE; y++){
			if(pieceData[nextPieceType][x][y]){
				rect.x = MATRIX_WIDTH * CELL_SIZE + UI_WIDTH / 2 - CELL_SIZE * PIECE_DATA_SIZE / 2 + x * CELL_SIZE;
				rect.y = MATRIX_HEIGHT * CELL_SIZE / 4 + y * CELL_SIZE;
				
				color = pieceColors[nextPieceType];
				
				SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, 255);
				SDL_RenderFillRect(renderer, &rect);
				
				SDL_SetRenderDrawColor( renderer, 100, 100, 100, 255 );
				SDL_RenderDrawRect(renderer, &rect);
			}
		}
	}
	
	
	//Render Window
	SDL_RenderPresent( renderer );

	return true;
}

int init(char* name) {
	if ( SDL_Init( SDL_INIT_EVERYTHING ) < 0 ) {
		return false;
	} 

	window = SDL_CreateWindow( name, SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, MATRIX_WIDTH * CELL_SIZE + UI_WIDTH, MATRIX_HEIGHT * CELL_SIZE, SDL_WINDOW_SHOWN );
	if ( !window ) {
		return false;
	}

	renderer = SDL_CreateRenderer( window, -1, SDL_RENDERER_ACCELERATED );
	if ( !renderer ) {
		return false;
	}
	
	currentPiecePos.x = 1;
	currentPiecePos.y = 1;
	
	copyPieceData(currentPieceType);

	SDL_SetRenderDrawColor( renderer, 255, 255, 255, 255 );
	SDL_RenderClear( renderer );
	return true;
}

void kill() {
	SDL_DestroyRenderer( renderer );
	SDL_DestroyWindow( window );
	SDL_Quit();
}