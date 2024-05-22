#include "header.h"

#define TYPE_MATCH(checkType) \
    if(currentToken->type != checkType){ \
        printf("Syntax Error: Expected %s, found %s\n", TokenType_toString(checkType), TokenType_toString(currentToken->type)); \
        return ERROR_NODE; \
    }

ParserNode END_NODE     = { tt_undefined,   "", NULL };
ParserNode ERROR_NODE   = { tt_error,       "", NULL };

Token* currentToken;

ParserNode parseKeyword(){
    TYPE_MATCH(tt_keyword);
    
    ParserNode node;
    node.type = tt_keyword;
    strcpy(node.value, currentToken->value);
    node.subNodes = NULL;
    
    currentToken++;
    return node;
}

ParserNode parseIdentifier(){
    TYPE_MATCH(tt_identifier);
    
    ParserNode node;
    node.type = tt_identifier;
    strcpy(node.value, currentToken->value);
    node.subNodes = NULL;
    
    currentToken++;
    return node;
}

ParserNode parseRelop(){
    TYPE_MATCH(tt_relop);
    
    ParserNode node;
    node.type = tt_relop;
    strcpy(node.value, currentToken->value);
    node.subNodes = NULL;
    
    currentToken++;
    return node;
}

ParserNode parseString(){
    TYPE_MATCH(tt_string);
    
    ParserNode node;
    node.type = tt_string;
    strcpy(node.value, currentToken->value);
    node.subNodes = NULL;
    
    currentToken++;
    return node;
}

ParserNode parseNumber(){
    TYPE_MATCH(tt_number);
    
    ParserNode node;
    node.type = tt_number,
    strcpy(node.value, currentToken->value);
    node.subNodes = NULL;
    
    currentToken++;
    return node;
}

ParserNode parseOperator(){
    TYPE_MATCH(tt_operator);
    
    ParserNode node;
    node.type = tt_operator,
    strcpy(node.value, currentToken->value);
    node.subNodes = NULL;
    
    currentToken++;
    return node;
}


/*
factor ::= var | number | (expression)
*/
ParserNode parseFactor(){
    ParserNode node;
    
    switch(currentToken->type){
        case tt_identifier:
            node = parseIdentifier();
            break;
        case tt_number:
            node = parseNumber();
            break;
        case tt_parenthesis: //TODO:
            break;
        default:
            printf("Syntax Error: ");
            break;
    }
    
    return node;
}

/*
term ::= factor ((*|/) factor)*
*/
ParserNode parseTerm(){
    size_t subNodesCount = 2;
    
    ParserNode node;
    node.type = tt_term;
    node.value[0] = '\0';
    node.subNodes = malloc(sizeof(ParserNode) * subNodesCount);
    
    int i = 0;
    
    node.subNodes[i++] = parseFactor();
    
    while(
        currentToken->type == tt_operator && (
        currentToken->value[0] == '*' ||
        currentToken->value[0] == '/'
    )){
        node.subNodes = realloc(node.subNodes, sizeof(ParserNode) * (subNodesCount += 2));
        node.subNodes[i++] = parseOperator();
        node.subNodes[i++] = parseFactor();
    }
    
    node.subNodes[i] = END_NODE;
    
    return node;
}

/*
expression ::= (+|-|ε) term ((+|-) term)*
*/
ParserNode parseExpression(){
    size_t subNodesCount = (currentToken->type == tt_number ? 4 : 3);
    
    ParserNode node;
    node.type = tt_expression;
    node.value[0] = '\0';
    node.subNodes = malloc(sizeof(ParserNode) * subNodesCount);
    
    int i = 0;
    
    if(currentToken->type == tt_number || currentToken->type == tt_identifier){
        node.subNodes[i++] = parseTerm();
    }
    
    while(
        currentToken->type == tt_operator &&
        (currentToken->value[0] == '+' ||
        currentToken->value[0] == '-')
    ){
        node.subNodes[i++] = parseOperator();
        node.subNodes[i++] = parseTerm();
        if(i >= subNodesCount - 2){
            node.subNodes = realloc(node.subNodes, sizeof(ParserNode) * (subNodesCount += 4));
        }
    }
    
    node.subNodes[i] = END_NODE;
    
    if(i < 1){
        printf("Syntax Error: Expected expression, found %s\n", TokenType_toString(currentToken->type));
        return ERROR_NODE;
    }
    
    for(i = 0; i < 5; i++){
        if(node.subNodes[i].type == tt_error){
            return ERROR_NODE;
        }
    }
    return node;
}

/*
expr-list ::= (string|expression) (, (string|expression) )*
*/
ParserNode parseExprList(){
    size_t subNodeCount = 3;
    
    ParserNode node;
    node.type = tt_exprlist;
    node.value[0] = '\0';
    node.subNodes = malloc(sizeof(ParserNode) * subNodeCount);
    
    int i = 0;
    
    if(currentToken->type == tt_string){
        node.subNodes[i++] = parseString();
    }else{
        node.subNodes[i++] = parseExpression();
    }
    
    while(currentToken->type == tt_comma){
        currentToken++;
        
        node.subNodes = realloc(node.subNodes, sizeof(ParserNode) * (subNodeCount++));
        if(currentToken->type == tt_string){
            node.subNodes[i++] = parseString();
        }else{
            node.subNodes[i++] = parseExpression();
        }
    }
    node.subNodes[i] = END_NODE;
    
    return node;
}

/*
statement ::= PRINT expr-list
              IF expression relop expression THEN statement
              GOTO expression
              INPUT var-list
              LET var = expression
              GOSUB expression
              RETURN
              CLEAR
              LIST
              RUN (string)*
              END
*/
ParserNode parseStatement(){
    ParserNode node;
    node.type = tt_statement;
    node.value[0] = '\0';
    node.subNodes = NULL;
    
    if(currentToken->type != tt_keyword){
        printf("Syntax Error: expected statement, found %s\n", TokenType_toString(currentToken->type));
        return ERROR_NODE;
    }
    
    if(!strcmp(currentToken->value, "PRINT")){
        node.subNodes = malloc(sizeof(ParserNode) * 3);
        
        node.subNodes[0] = parseKeyword();
        node.subNodes[1] = parseExprList();
        node.subNodes[2] = END_NODE;
    }else if(!strcmp(currentToken->value, "IF")){
        node.subNodes = malloc(sizeof(ParserNode) * 7);
        
        node.subNodes[0] = parseKeyword();
        node.subNodes[1] = parseExpression();
        node.subNodes[2] = parseRelop();
        node.subNodes[3] = parseExpression();
        node.subNodes[4] = parseKeyword();
        node.subNodes[5] = parseStatement();
        node.subNodes[6] = END_NODE;
        
        if(strcmp(node.subNodes[4].value, "THEN")){
            printf("Syntax Error: Expected THEN, found %s\n", node.subNodes[4].value);
            return ERROR_NODE;
        }
    }else if(!strcmp(currentToken->value, "LET")){
        node.subNodes = malloc(sizeof(ParserNode) * 5);
        
        node.subNodes[0] = parseKeyword();
        node.subNodes[1] = parseIdentifier();
        node.subNodes[2] = parseRelop();
        node.subNodes[3] = parseExpression();
        node.subNodes[4] = END_NODE;
        
        if(strcmp(node.subNodes[2].value, "=")){
            printf("Syntax Error: Expected =, found %s\n", currentToken->value);
            return ERROR_NODE;
        }
    }else if(!strcmp(currentToken->value, "RUN")){
        if((currentToken + 1)->type == tt_string){
            node.subNodes = malloc(sizeof(ParserNode) * 3);
            node.subNodes[0] = parseKeyword();
            node.subNodes[1] = parseString();
            node.subNodes[2] = END_NODE;
        }else{
            node.subNodes = malloc(sizeof(ParserNode) * 2);
            node.subNodes[0] = parseKeyword();
            node.subNodes[1] = END_NODE;
        }
    }else if(
        !strcmp(currentToken->value, "CLEAR") ||
        !strcmp(currentToken->value, "END")
    ){
        node.subNodes = malloc(sizeof(ParserNode) * 2);
        
        node.subNodes[0] = parseKeyword();
        node.subNodes[1] = END_NODE;
    }else if(!strcmp(currentToken->value, "GOTO")){
        node.subNodes = malloc(sizeof(ParserNode) * 3);
        
        node.subNodes[0] = parseKeyword();
        node.subNodes[1] = parseExpression();
        node.subNodes[2] = END_NODE;
    }else if(!strcmp(currentToken->value, "INPUT")){
        node.subNodes = malloc(sizeof(ParserNode) * 3);
        
        node.subNodes[0] = parseKeyword();
        node.subNodes[1] = parseIdentifier();
        node.subNodes[2] = END_NODE;
    }
    
    for(int i = 0; i < 5; i++){
        if(node.subNodes[i].type == tt_error){
            return ERROR_NODE;
        }
    }
    
    return node;
}

/*
line ::= number statement CR | statement CR
*/
ParserNode parseLine(){
    ParserNode node;
    node.type = tt_line;
    node.value[0] = '\0';
    node.subNodes = malloc(sizeof(ParserNode) * 3);
    
    if(currentToken->type == tt_number){
        
        node.subNodes[0] = parseNumber();
        node.subNodes[1] = parseStatement();
        node.subNodes[2] = END_NODE;
    }else{
        node.subNodes[0] = parseStatement();
        node.subNodes[1] = END_NODE;
    }
    
    for(int i = 0; i < 3; i++){
        if(node.subNodes[i].type == tt_error){
            return ERROR_NODE;
        }
    }
    return node;
}

ParserNode* parse(Token* tokens){
    ParserNode* tree = malloc(sizeof(ParserNode));
    tree->type = tt_program;
    tree->value[0] = '\0';
    tree->subNodes = malloc(sizeof(ParserNode) * 3);
    
    currentToken = tokens;
    
    tree->subNodes[0] = parseLine();
    tree->subNodes[1] = END_NODE;
    
    for(int i = 0; i < 5; i++){
        if(tree->subNodes[i].type == tt_error){
            return &ERROR_NODE;
        }
    }
    return tree;
}