class Solution {
  public:
    bool isPossible(vector<int>& arr, int k, long long maxTime) {
        int paintersRequired = 1;
        long currentTime = 0;
        
        for (int i = 0; i < arr.size(); i++) {
            if (currentTime + arr[i] > maxTime) {
                paintersRequired++;
                currentTime = arr[i];
                
                if (paintersRequired > k) {
                    return false;
                }
            } else {
                currentTime += arr[i];
            }
        }
        return true;
    }

  public:
    long long minTime(vector<int>& arr, int k) {
        long low = 0;
        long high = 0;
        
        for (int i = 0; i < arr.size(); i++) {
            if (arr[i] > low) {
                low = arr[i];
            }
            high += arr[i];
        }
        
        long ans = high;
        
        while (low <= high) {
            long long mid = low + (high - low) / 2;
            
            if (isPossible(arr, k, mid)) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        return ans;
    }
};