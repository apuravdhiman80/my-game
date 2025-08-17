#include<iostream>
#include<vector>
#include<algorithm>
#include <numeric>
#include <climits>
using namespace std;
int minsum(vector<int>nums)
{
          int n = nums.size();
          int m=n/2;
          long total=accumulate(nums.begin(),nums.end(),0);
          
}
int main()
{
    vector<int>nums;
    int n;
    cin>>n;
    for(int i=0;i<n;i++)
    {
        int a;
        cin>>a;
        nums.push_back(a);
    }
    cout<<minsum(nums);
return 0;
}