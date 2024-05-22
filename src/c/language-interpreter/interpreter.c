#include "stdint.h"
#include "header.h"

#define PROGRAM_SIZE 256

ParserNode* programLines[PROGRAM_SIZE];
int programCounter = 0;
int16_t variables['Z' - 'A'];

int runTerm(ParserNode* term){
    int total = 0;
    if(term->subNodes[0].type == tt_identifier){
        total = variables[term->subNodes[0].value[0] - 'A'];
    }else{
        total = atoi(term->subNodes[0].value);
    }
    
    for(int j = 1; term->subNodes[j - 1].type; j += 2){
        int factor;
        if(term->subNodes[j + 1].type == tt_identifier){
            factor = variables[term->subNodes[j + 1].value[0] - 'A'];
        }else{
            factor = atoi(term->subNodes[j + 1].value);
        }
        
        if(term->subNodes[j].value[0] == '*'){
            total *= factor;
        }
        if(term->subNodes[j].value[0] == '/'){
            total /= factor;
        }
    }
    return total;
}

int runExpression(ParserNode* expr){
    int sum = 0;
    int i = 0;
    
    if(expr->subNodes[i].type == tt_term){
        sum += runTerm(expr->subNodes);
        i++;
    }
    
    for(; expr->subNodes[i].type; i+=2){
        if(expr->subNodes[i].value[0] == '+'){
            sum += runTerm(expr->subNodes + i + 1);
        }
        if(expr->subNodes[i].value[0] == '-'){
            sum -= runTerm(expr->subNodes + i + 1);
        }
    }
    return sum;
}

void run();

void runLine(ParserNode* line){
    if(line->type != tt_line){
        printf("Expected line, found %s\n", TokenType_toString(line->type));
        return;
    }
    
    if(line->subNodes[0].type == tt_number){
        if(!strcmp(line->subNodes[1].subNodes[0].value, "RUN")){
            printf("Error: Can't place RUN command in program\n");
            return;
        }
        programLines[atoi(line->subNodes[0].value)] = line;
        line->subNodes++;
    }else{
        ParserNode statement = line->subNodes[0];
        char* command = statement.subNodes[0].value;
        
        if(!strcmp(command, "PRINT")){
            for(int i = 0; statement.subNodes[1].subNodes[i].type != tt_undefined; i++){
                if(statement.subNodes[1].subNodes[i].type == tt_string){
                    printf("%s", statement.subNodes[1].subNodes[i].value);
                }else{
                    printf("%d", runExpression(statement.subNodes[1].subNodes + i));
                }
            }
            printf("\n");
            return;
        }
        
        if(!strcmp(command, "IF")){
            char* relop = statement.subNodes[2].value;
            if(!strcmp(relop, ">")){
                if(runExpression(statement.subNodes + 1) > runExpression(statement.subNodes + 3)){
                    ParserNode line;
                    line.type = tt_line;
                    line.value[0] = '\0';
                    line.subNodes = statement.subNodes + 5;
                    runLine(&line);
                    return;
                }
            }
            if(!strcmp(relop, "<")){
                if(runExpression(statement.subNodes + 1) < runExpression(statement.subNodes + 3)){
                    ParserNode line;
                    line.type = tt_line;
                    line.value[0] = '\0';
                    line.subNodes = statement.subNodes + 5;
                    runLine(&line);
                    return;
                }
            }
            if(!strcmp(relop, "==")){
                if(runExpression(statement.subNodes + 1) == runExpression(statement.subNodes + 3)){
                    ParserNode line;
                    line.type = tt_line;
                    line.value[0] = '\0';
                    line.subNodes = statement.subNodes + 5;
                    runLine(&line);
                    return;
                }
            }
            if(!strcmp(relop, ">=")){
                if(runExpression(statement.subNodes + 1) >= runExpression(statement.subNodes + 3)){
                    ParserNode line;
                    line.type = tt_line;
                    line.value[0] = '\0';
                    line.subNodes = statement.subNodes + 5;
                    runLine(&line);
                    return;
                }
            }
            if(!strcmp(relop, "<=")){
                if(runExpression(statement.subNodes + 1) <= runExpression(statement.subNodes + 3)){
                    ParserNode line;
                    line.type = tt_line;
                    line.value[0] = '\0';
                    line.subNodes = statement.subNodes + 5;
                    runLine(&line);
                    return;
                }
            }
        }
        
        if(!strcmp(command, "LET")){
            variables[statement.subNodes[1].value[0] - 'A'] = runExpression(statement.subNodes + 3);
            
            #if DEBUG_MODE
                for(int i = 0; i <= 'Z' - 'A'; i++){
                    printf("%c = %d\n", i + 'A', variables[i]);
                }
                return;
            #endif
        }
        
        if(!strcmp(command, "GOTO")){
            programCounter = runExpression(statement.subNodes + 1) - 1;
            return;
        }
        
        if(!strcmp(command, "CLEAR")){
            #ifdef unix
                system("clear");
            #endif
            #ifdef _WIN32
                system("cls");
            #endif
            
            return;
        }
        
        if(!strcmp(command, "RUN")){
            if(statement.subNodes[1].type == tt_string){
                FILE* file = fopen(statement.subNodes[1].value, "r");
                if(file == NULL){
                    printf("Error: File not found.\n");
                    return;
                }
                
                //probably should free this first
                for(int i = 0; i < PROGRAM_SIZE; i++){
                    if(programLines[i]){
                        //printf("%d: %p\n", i, programLines + i);
                        //free(programLines + i);
                        programLines[i] = NULL;
                    }
                }
                char line[64];
                int i = 0;
                while(fgets(line, 64, file)){
                    if(line[0] == '\n'){
                        i++;
                        continue;
                    }
                    
                    Token* tokens = lex(line);
                    
                    if(!tokens) continue;
                    if(tokens[0].type == tt_newline) continue;
                    
                    ParserNode* parseTree = parse(tokens);
                    
                    free(tokens);
                    
                    if(parseTree->type == tt_error){
                        printf("Something went wrong.\n");
                        return;
                    }
                    
                    programLines[i++] = parseTree->subNodes;
                }
                
                fclose(file);
                run();
            }else{
                run();
            }
            return;
        }
        
        if(!strcmp(command, "INPUT")){
            int input = 0;
            printf("Input: ");
            scanf("%d", &input);
            variables[statement.subNodes[1].value[0] - 'A'] = input;
            return;
        }
        
        if(!strcmp(command, "END")){
            exit(0);
        }
    }
}


void run(){
    for(programCounter = 0; programCounter < PROGRAM_SIZE; programCounter++){
        if(programLines[programCounter]){
            #if DEBUG_MODE
                printf("Running %d\n", programCounter);
                //printf("Line %d:\n", i);
                //printParseTree(programLines[i], 0);
            #endif
            runLine(programLines[programCounter]);
        }
    }
}