## TSD问题 -- dp算法

~~~c++
#include <iostream>
#include <fstream>
#include<cmath>
const int INF = 1e6;
using namespace std;

int n,res = INF,All_upper_bound,first_city = 0,num = 0;
int ** CITYS;
int** city_res;
void Dynamic_Programming()
{
    int i,j,k,temp;
    int** d = new int* [n];
    int** path = new int* [n];
    int amount_aggregation = (int)pow(2,n-1);
    for(i = 0; i < n; i++)
    {
        d[i] = new int[amount_aggregation];
        path[i] = new int[amount_aggregation];
    }

    for(i = 0; i < n;i++)
        d[i][0] = CITYS[i][0];

    for(i = 0; i < amount_aggregation - 1; i++)
    {
        for(j = 1; j < n; j++)
        {
            if(((int)pow(2,j-1))&i == 0)
            {
                d[j][i] = INF;
                for(k = 1; k < n; k++)
                {
                    if((int)pow(2,k-1) & i)
                    {
                        temp = CITYS[j][k] + d[k][i-(int)pow(2,k-1)];
                        if(temp < d[j][i])
                        {
                            d[j][i] = temp;
                            path[j][i] = k;
                        }
                    }
                }
            }
        }
    }
    d[0][amount_aggregation-1] = INF;
    for(i = 1;i < n; i++)
    {
        temp = CITYS[0][i] + d[i][amount_aggregation - 1 - (int)pow(2,i - 1)];
        if(temp < d[0][amount_aggregation -1])
        {
            d[0][amount_aggregation - 1] = temp;
            path[0][amount_aggregation -1] = i;
        }
    }

    res = d[0][amount_aggregation - 1];
    i = 0;
    j = amount_aggregation - 1;
    k = 0;
    city_res[k++] = 0;
    while(j > 0)
    {
        i = path[i][j];
        j = j - (int)pow(2, i - 1);
        city_res[k++] = i;
    }
    delete[]d;
    delete[]path;
}
~~~

