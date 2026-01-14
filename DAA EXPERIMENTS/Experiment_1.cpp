#include <bits/stdc++.h>
using namespace std;
using namespace std::chrono;

int operations = 0;   
int maxDepth = 0;           

void complexRec(int n, int depth) {
    if (n <= 2) {
        operations++; 
        return;
    }

    if (depth > maxDepth) {
    maxDepth = depth;
    }

    int p = n;
    while (p > 0) {
        vector<int> temp(n);
        for (int i = 0; i < n; i++) {
            temp[i] = i ^ p;
            operations++;
        }
        p >>= 1;
        operations++;
    }

    vector<int> small(n);
    for (int i = 0; i < n; i++) {
        small[i] = i * i;
        operations++;
    }

    if (n % 3 == 0) {
       reverse(small.begin(), small.end());
       operations += n;
    } else {
       reverse(small.begin(), small.end());
       operations += n;
    }


    complexRec(n / 2, depth + 1);
    complexRec(n / 2, depth + 1);
    complexRec(n / 2, depth + 1);
}


int main() {
    int testValues[] = {10, 50, 100, 200, 500, 1000};
    for (int i = 0; i < 6; i++) {
        int n = testValues[i];
        operations = 0;
        maxDepth = 0;

        auto start = high_resolution_clock::now();
        complexRec(n, 1);
        auto end = high_resolution_clock::now();

        auto duration = duration_cast<milliseconds>(end - start);

        cout << "n: " << n << ", Operations: " << operations << ", Max Depth: " << maxDepth << ", Time: " << duration.count() << " ms" << endl;
    }
    return 0;
}
// Recurrence Relation: T(n) = 3*T(n/2) + O(n*logn)
// Time Complexity: O(n^(log2(3))) 