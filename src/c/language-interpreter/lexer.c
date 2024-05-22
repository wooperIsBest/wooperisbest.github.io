#include <ctype.h>
#include "header.h"

Token* tokens;
int tokensIndex;
int tokensSize;

char buffer[8];
int bufferIndex;

int line;

int i;
char c;

void pushToken(enum TokenType type){
    buffer[bufferIndex] = '\0';
    
    tokens[tokensIndex].type = type;
    strncpy(tokens[tokensIndex].value, buffer, 8);
    tokens[tokensIndex].value[7] = '\0';
    
    bufferIndex = 0;
    tokensIndex++;
    i--;
    
    if(tokensIndex >= tokensSize - 1){
        tokens = realloc(tokens, sizeof(Token) * (tokensSize *= 2));
    }
}

/*
 * Takes a list of characters and returns a series of Tokens with the intended values.
 */
Token* lex(char* input){
    tokensSize = 16;
    tokens = calloc(sizeof(Token), tokensSize);
    MEMORY_CHECK(tokens);
    tokensIndex = 0;
    
    bufferIndex = 0;
    line = 1;
    
    i = 0;
    
    while((c = input[i++]) != '\0'){
        //Variables, keywords
        if(isalpha(c)){
            do {
                buffer[bufferIndex++] = c;
            } while(isalpha(c = input[i++]) && bufferIndex < 7);
            
            buffer[bufferIndex] = '\0';
            
            //Check if it's a variable
            if(strlen(buffer) == 1){
                pushToken(tt_identifier);
                continue;
            }
            
            //Check if it's a valid keyword
            if(string_indexOf(keywords, buffer) > -1){
                pushToken(tt_keyword);
                continue;
            }
            
            //Otherwise, it is invalid
            ERROR("Syntax", line, string("Unrecognized keyword \"", buffer, "\""));
        }
        
        if(c == '\"'){
            while((c = input[i++]) != '"' && bufferIndex < 7) {
                buffer[bufferIndex++] = c;
            }
            
            i++;
            buffer[bufferIndex] = '\0';
            
            pushToken(tt_string);
            continue;
        }
        
        //Number
        if(isdigit(c)){
            do {
                buffer[bufferIndex++] = c;
            } while(isdigit(c = input[i++]) && bufferIndex < 7);
            
            pushToken(tt_number);
            continue;
        }
        
        //Relop
        if(c == '<' || c == '>' || c == '='){
            buffer[bufferIndex++] = c;
            c = input[i++];
            if(c == buffer[0] || c == '='){
                buffer[bufferIndex++] = c;
            }
            
            i++;
            pushToken(tt_relop);
            continue;
        }
        
        //Operator
        if(c == '+' || c == '-' || c == '*' || c == '/'){
            buffer[bufferIndex++] = c;
            i++;
            pushToken(tt_operator);
            continue;
        }
        
        //Parenthesis
        if(c == '(' || c == ')'){
            buffer[bufferIndex++] = c;
            i++;
            pushToken(tt_parenthesis);
            continue;
        }
        
        if(c == ','){
            buffer[bufferIndex++] = c;
            i++;
            pushToken(tt_comma);
            continue;
        }
        
        //Newlines
        if(c == '\n'){
            tokens[tokensIndex++].type = tt_newline;
            line++;
            continue;
        }
        
        //Whitespace
        if(isspace(c)){
            continue;
        }
        
        //Otherwise, invalid character
        ERROR("Syntax", line, string("Invalid character '", &c, "'"));
    }
    
    return tokens;
}