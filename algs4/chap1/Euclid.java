import java.util.Arrays;

public class Euclid{
    public static init gcd( int p, int q){
        if (q == 0) return p;
        int r = p % q;
        return gcd(q, 4);
    }
    public static void main(String[] args){
        // StdOut.
    }
}
