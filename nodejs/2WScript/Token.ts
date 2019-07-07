class Token{
    public static EOF = new Token(-1);
    public static EOL = "\\n";
    private lineNumber: number;

    protected constructor(line: number) {
        this.lineNumber = line;
    }

    public getLineNumber(): number{
        return this.lineNumber;
    }

    public isIdentifier(): boolean{
        return false;
    }

    public isNumber(): boolean{
        return false;
    }

    public isString(): boolean{
        return false;
    }

    public getNumber():number{
        throw new Error('not number token!');
    }

    public getText(): string{
        return "";
    }
}
