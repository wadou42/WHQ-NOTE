### BinarySelection

~~~c++
#include <iostream>

using namespace std;

int binarySearch(const int list[],int key, int low,int high)
{
    if(low > high)
        return -1;
    int mid = (low+high)/2;
    if(list[mid] == key)
        return mid;
    else if(list[mid] > key)
        return binarySearch(list,key,low,mid-1);
    else
        return binarySearch(list,key,mid+1,high);
}

int binarySearch(const int list[],int key,int size)
{
    int low = 0;
    int high = size -1;
    return binarySearch(list,key,low,high);
}

int main(){
    int list[10] = {1,5,9,11,55,99,111,555,999,1000};

    cout << binarySearch(list,999,10) << endl;
    cout << binarySearch(list,1,10) << endl;
    
    return 0;
    }
~~~

~~~c++
int BinarySearch(int a[],int x,int n)
{
    int low = 0, high = n - 1;
    int mid = 0;
    while(high>=low){
        mid = (high + low) / 2;
        if(a[mid] == x)
            return mid;
        if(a[mid]>x)
            high = mid - 1;
        else
            low = mid + 1;
    }
    return -1;
}
~~~





~~~c++
nclude<iostream>
#include<stdio.h>
#include<stdlib.h>
#include<string>
#include<iomanip>
#include<algorithm>
#include<string.h>
#include<queue>
#include<cmath>

using namespace std;
const int maxn=1e5+10;
const int inf=1e10;
typedef long long ll;

int n,m;
int a[maxn];

int check(int top)
{
    int num=1;
    int cur=0;
    for(int i=0; i<n; i++)
    {
        if(cur+a[i]<=top) cur+=a[i];
        else
        {
            num++;
            cur=a[i];
        }
    }
    return num<=m;
}

int main()
{
    while(cin>>n>>m)
    {
        int ma=0,sum=0;
        for(int i=0; i<n; i++)
        {
            cin>>a[i];
            sum+=a[i];
            ma=max(ma,a[i]);
        }

        int low=ma,high=sum;
        int ans=0;

        while(low<=high)
        {
            int mid=(low+high)>>1;
            if(check(mid))
            {
                ans=high;
                high=mid-1;
            }
            else low=mid+1;
        }

        printf("%d\n",ans);
    }
    system("pause");
    return 0;
~~~

