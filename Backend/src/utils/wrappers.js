function wrapCppSolution(code) {
    return `
#include <bits/stdc++.h>
using namespace std;

${code}

vector<int> parseArray(const string& s) {
    vector<int> arr;
    string nums = s.substr(s.find("[") + 1, s.find("]") - s.find("[") - 1);
    stringstream ss(nums);
    string v;
    while (getline(ss, v, ',')) 
        arr.push_back(stoi(v));
    return arr;
}

int parseTarget(const string& s) {
    return stoi(s.substr(s.find("target =") + 8));
}

int main() {
    string input;
    getline(cin, input);

    vector<int> nums = parseArray(input);
    int target = -1;

    // if target exists
    if (input.find("target") != string::npos)
        target = parseTarget(input);

    Solution sol;

    // Handle two types of problems: twoSum & findMax
    string codeStr = string("${code}");

    if (codeStr.find("twoSum") != string::npos) {
        vector<int> ans = sol.twoSum(nums, target);
        cout << "[" << ans[0] << "," << ans[1] << "]";
    } else {
        int ans = sol.findMax(nums);
        cout << ans;
    }

    return 0;
}
`;
}

module.exports = { wrapCppSolution };
