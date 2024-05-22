#include <stdarg.h>
#include "header.h"

//Helper function for string concatenation
char* __string__(char* str1, ...){
    int bufferLen = 16;
    char* string = malloc(bufferLen);
    
    int stringLen = 0;
    
    va_list argptr;
    va_start(argptr, str1);
    
    char* append = NULL;
    while((append = va_arg(argptr, char*)) != NULL){
        int i = 0;
        while(append[i]){
            string[stringLen++] = append[i++];
            
            if(stringLen >= bufferLen){
                string = realloc(string, bufferLen *= 2);
            }
        }
    }
    
    va_end(argptr);
    
    string[stringLen] = '\0';
    return string;
}

int string_indexOf(const char** array, char* string){
    for(int i = 0; array[i] != NULL; i++){
        if(strcmp(array[i], string) == 0){
            return i;
        }
    }
    return -1;
}

const char* TokenType_toString(enum TokenType type){
    switch(type){
        case tt_undefined:  return "undefined";
        case tt_keyword:    return "keyword";
        case tt_number:     return "number";
        case tt_operator:   return "operator";
        case tt_identifier: return "identifier";
        case tt_newline:    return "newline";
        case tt_relop:      return "relop";
        case tt_string:     return "string";
        case tt_parenthesis:return "parenthesis";
        case tt_comma:      return "comma";
        case tt_line:       return "line";
        case tt_program:    return "program";
        case tt_statement:  return "statement";
        case tt_expression: return "expression";
        case tt_exprlist:   return "expr-list";
        case tt_error:      return "error";
        case tt_term:       return "term";
        default:            return "invalid";
    }
}

char* Token_toString(Token* token){
    return string("TOKEN {type: ", TokenType_toString(token->type), ", value: ", token->value, "}");
}

const char* keywords[] = {
    "PRINT",
    "IF",
    "THEN",
    "GOTO",
    "INPUT",
    "LET",
    "GOSUB",
    "RETURN",
    "CLEAR",
    "LIST",
    "RUN",
    "END",
    NULL
};