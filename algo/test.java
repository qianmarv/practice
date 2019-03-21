public static String ex(int n){
    String s = ex(n-3) + n + ex(n-2) + n;
    if (n <= 0) return "";
    return s;
}
