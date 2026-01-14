#include <bits/stdc++.h>
using namespace std;
using namespace std::chrono;

long long operations = 0;   
int maxDepth = 0;           

void complexRec(int n, int depth) {
    if (n <= 2) {
        operations++; 
        return;
    }

    maxDepth = max(maxDepth, depth);

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

    reverse(small.begin(), small.end());
    operations += n; 


    complexRec(n / 2, depth + 1);
    complexRec(n / 2, depth + 1);
    complexRec(n / 2, depth + 1);
}


int main() {
    for (int n : {10, 50, 100, 200, 500, 1000}) {
        operations = 0;
        maxDepth = 0;

        auto start = high_resolution_clock::now();
        complexRec(n, 1);
        auto end = high_resolution_clock::now();

        auto duration = duration_cast<milliseconds>(end - start);

        cout << "n: " << n 
             << ", Operations: " << operations 
             << ", Max Depth: " << maxDepth 
             << ", Time: " << duration.count() << " ms" << endl;
    }
    return 0;
}
// Recurrence Relation: T(n) = 3*T(n/2) + O(n log n)
// Time Complexity: O(n^(log2(3))) ≈ O(n^1.585)