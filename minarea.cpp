#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;
int minarea(vector<int>x,vector<int>y,int k)
{
    sort(x.begin(),x.end());
    sort(y.begin(),y.end());
    int xmin=x[0];
    int xmax=x[x.size()-1];
    int ymin=y[0];
    int ymax=y[y.size()-1];
    int side=max(xmax-xmin+2,ymax-ymin+2);
    return side*side;
}
int main()
{
    vector<int>x,y;int n;
    cin>>n;
    for(int i=0;i<n;i++)
    {
        int a;
        cin>>a;
        x.push_back(a);
    }
      for(int i=0;i<n;i++)
    {
        int b;
        cin>>b;
        y.push_back(b);
    }
    int k;
    cin>>k;
    cout<<minarea(x,y,k);
return 0;
}