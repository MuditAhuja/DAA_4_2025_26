#include<bits/stdc++.h>
using namespace std;

class DSU{
    vector<int> parent, rank;

    public:
    DSU(int n){
        parent.resize(n);
        rank.resize(n, 0);
        for(int i=0; i<n; i++) parent[i] = i;
    }

    int find(int x){
        if(parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void unite(int x, int y){
        int px = find(x);
        int py = find(y);

        if(px == py) return;

        if(rank[px] < rank[py]) parent[px] = py;
        else if(rank[px] > rank[py]) parent[py] = px;
        else{
            parent[py] = px;
            rank[px]++;
        }
    }
};

int kruskal(int v, vector<vector<int>> &edges){
    sort(edges.begin(), edges.end(), [](vector<int> &a, vector<int> &b){
                                            return a[2] < b[2];
                                        });
    
    DSU dsu(v);
    int totalWeight = 0;
    int edgesUsed = 0;

    for(auto edge: edges){
        int u = edge[0];
        int v = edge[1];
        int wt = edge[2];

        if(dsu.find(u) != dsu.find(v)){
            dsu.unite(u, v);
            totalWeight += wt;
            edgesUsed++;
        }

        if(edgesUsed == v-1) break;
    }

    return totalWeight;
}

int main(){
    int v = 5;
    vector<vector<int>> edges = {
        {0, 1, 2},
        {0, 3, 6},
        {1, 2, 3},
        {1, 3, 8},
        {1, 4, 5},
        {2, 4, 7}
    };

    cout << "Minimal Spamming Tree Weight: " << kruskal(v, edges);

    return 0;
}