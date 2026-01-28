#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

using namespace std;

int main()
{
    int n;
    cin >> n;

    vector<char> attendance(n);
    for (int i = 0; i < n; i++)
    {
        cin >> attendance[i];
    }

    unordered_map<int, int> mp;
    mp[0] = -1;

    int current_sum = 0;
    int max_length = 0;

    for (int i = 0; i < n; i++)
    {
        if (attendance[i] == 'P')
        {
            current_sum = current_sum + 1;
        }
        else
        {
            current_sum = current_sum - 1;
        }

        if (mp.find(current_sum) != mp.end())
        {
            int previous_index = mp[current_sum];
            int current_window_length = i - previous_index;

            if (current_window_length > max_length)
            {
                max_length = current_window_length;
            }
        }
        else
        {
            mp[current_sum] = i;
        }
    }

    cout << max_length << endl;

    return 0;
}

// Time Complexity: O(n)