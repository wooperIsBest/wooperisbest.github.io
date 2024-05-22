#include <stdio.h>
#include <stdlib.h>
#include "header.h"

#define MAX_LINE_LENGTH 128

#define DEBUG_MODE 0

void tabs(int n){
    for(int i = 0; i < n; i++){
        printf("    ");
    }
}

void printParseTree(ParserNode* tree, int layer){
    tabs(layer);
    printf("%s", string(
        "{type: ",
        TokenType_toString(tree->type),
        ", value: ",
        tree->value,
        ", subNodes: {"
    ));
    
    if(tree->subNodes != NULL){
        printf("\n");
        int i = 0;
        while(tree->subNodes[i].type){
            printParseTree(tree->subNodes + i, layer + 1);
            i++;
        }
        tabs(layer);
    }else{
        printf("NULL");
    }
    printf("}\n");
}

int main()
{
    char input[MAX_LINE_LENGTH];
    
    printf("--- TINY BASIC SHELL v1.0 ---\n");
    while(1){
        fgets(input, MAX_LINE_LENGTH, stdin);
        
        if(input[0] == '\n') continue;
        
        Token* tokens = lex(input);
        
        if(!tokens) continue;
        
        #if DEBUG_MODE
            char* token = NULL;
            for(int i = 0; tokens[i].type; i++){
                token = Token_toString(tokens + i);
                printf("%s\n", token);
                free(token);
            }
        #endif
        
        ParserNode* parseTree = parse(tokens);
        
        #if DEBUG_MODE
            //if(parseTree->type != tt_error){
                printf("\n\nPARSER TREE\n");
                printParseTree(parseTree, 0);
            //}
        #endif
        
        free(tokens);
        
        if(parseTree->type != tt_error){
            runLine(parseTree->subNodes);
        }
        
        //remember to recursively free parser nodes please
    }
    
    return 0;
}