#include<bits/stdc++.h>
using namespace std;

#define pii pair<int, int>

int prim(int v, vector<vector<pii>> &adj){
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<bool> inMst(v, false);

    int totalWeight = 0;

    pq.push({0, 0});

    while(!pq.empty()){
        int weight = pq.top().first;
        int node = pq.top().second;
        pq.pop();

        if(inMst[node]) continue;

        inMst[node] = true;
        totalWeight += weight;

        for(auto i: adj[node]){
            int adjWeight = i.first;
            int adjNode = i.second;

            if(!inMst[adjNode]) pq.push({adjWeight, adjWeight}); 
        }
    }

    return totalWeight;
}

int main(){
    int v = 5;
    vector<vector<pii>> adj(v);

    adj[0].push_back({1, 2});
    adj[1].push_back({0, 2});
    
    adj[0].push_back({3, 6});
    adj[3].push_back({0, 6});
    
    adj[1].push_back({2, 3});
    adj[2].push_back({1, 3});
    
    adj[1].push_back({3, 8});
    adj[3].push_back({1, 8});
    
    adj[1].push_back({4, 5});
    adj[4].push_back({1, 5});
    
    adj[2].push_back({4, 7});
    adj[4].push_back({2, 7});
    
    cout << "Minimum Spanning Tree Weight: " << prim(v, adj);

    return 0;
}