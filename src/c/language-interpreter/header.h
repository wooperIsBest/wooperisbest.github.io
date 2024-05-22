#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ERROR(type, line, msg) { printf("%s Error (line %d): %s\n", type, line, msg); return NULL; }

#define DEBUG_MSG(msg) printf(msg); fflush(stdout);
#define MEMORY_CHECK(ptr) if(ptr == NULL){ DEBUG_MSG("Memory error"); exit(1); }

enum TokenType {
    //Lexer types
    tt_undefined,
    tt_keyword,
    tt_number,
    tt_operator,
    tt_identifier,
    tt_newline,
    tt_relop,
    tt_string,
    tt_parenthesis,
    tt_comma,
    //Parser types
    tt_program,
    tt_line,
    tt_statement,
    tt_expression,
    tt_exprlist,
    tt_term,
    tt_error,
};

typedef struct Token Token;
struct Token {
    enum TokenType type;
    char value[8];
};

typedef struct ParserNode ParserNode;
struct ParserNode {
    enum TokenType type;
    char value[8];
    ParserNode* subNodes;
};

extern void nextInput();

extern const char* keywords[];

#define string(...) __string__(NULL, __VA_ARGS__, NULL)
extern char* __string__(char* str1, ...);

extern int string_indexOf(const char** array, char* string);

extern const char* TokenType_toString(enum TokenType type);
extern char* Token_toString(Token* token);

extern void printParseTree(ParserNode* tree, int layer);

extern Token* lex(char* input);
extern ParserNode* parse(Token* tokens);
extern void runLine(ParserNode* line);