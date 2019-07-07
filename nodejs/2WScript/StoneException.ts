class StoneException extends Error{
    public constructor(m:string, t: ASTree){
        let err = t ? m + " " + t.location() : m;
        super(err);
    }
}
