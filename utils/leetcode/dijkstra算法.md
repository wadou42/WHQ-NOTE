~~~c++
#include <iostream>
#include <cstring>

using namespace std;
#define maxn 1007
#define INF 0x3f3f3f3f

int res[maxn];
int vis[maxn];
int map[maxn][maxn];
int startCity[maxn];
int endCity[maxn];

int m, n,k;
int u, v, w;

void Dijkstra (int startV){
    memset(vis, 0, sizeof(vis));
    memset(res, INF, sizeof(res));
    res[startV] = 0;
    for (int i = 0; i < maxn;i++){
        int cur = -1;
        for (int j = 1; j < maxn;j++){
            if (!vis[j] && (cur < 0|| res[j] < res[cur]))
                cur = j;
        }
    if(cur == -1)
            break;
    vis[cur] = 1;
    for (int j = 1; j < maxn;j++){
        if(!vis[j]&&(res[j]>res[cur] + map[cur][j]))
                res[j] = res[cur] + map[cur][j];
    }
    }
}
int main()
{
    cin >> m >> n >> k;
    memset(map, INF, sizeof(map));
    for (int i = 0; i < m;i++){
    cin >> u >> v >> w;
    map[u][v] = w;
    map[v][u] = w;
    }
    for (int i = 0;i<n;i++){
    cin >> startCity[i];
    }
    for (int i = 0; i < k;i++){
    cin >> endCity[i];
    }
    int ans = INF;
    for (int i = 0; i < n;i++){
    Dijkstra(startCity[i]);
    for (int j = 0; j < k;j++){
        ans = ans > res[endCity[j]] ? res[endCity[j]] : ans;
    }
    }
    cout << ans << endl;
    return 0;
}
~~~

