#include <iostream>
using namespace std;

int main() {
    int nums[] = {10, 9, 2, 5, 3, 7, 101, 18};
    int n = 8;

    int dp[100];

    for (int i = 0; i < n; i++) {
        dp[i] = 1;
    }

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                if (dp[i] < dp[j] + 1) {
                    dp[i] = dp[j] + 1;
                }
            }
        }
    }

    int ans = dp[0];

    for (int i = 1; i < n; i++) {
        if (dp[i] > ans) {
            ans = dp[i];
        }
    }

    cout << ans << endl;

    return 0;
}