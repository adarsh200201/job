const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ADARSHSHARMA__:SITADEVI%401234765__@cluster1.tcdmjd6.mongodb.net/job';
const DSAQuestion = require('../models/DSAQuestion');

const solutions = {
  'Two Sum': {
    cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}`,
    java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    mapping = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in mapping:
            return [mapping[complement], i]
        mapping[num] = i
    return []`
  },
  "Maximum Subarray (Kadane's Algorithm)": {
    cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0], currentSum = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
    java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0], currentSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}`,
    python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`
  },
  'Reverse a Linked List': {
    cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
}`,
    python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`
  },
  'Valid Parentheses': {
    cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> map = { {')', '('}, {'}', '{'}, {']', '['} };
    for (char ch : s) {
        if (ch == '(' || ch == '{' || ch == '[') {
            st.push(ch);
        } else {
            if (st.empty() || st.top() != map[ch]) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
    java: `import java.util.Stack;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> map = new HashMap<>();
        map.put(')', '(');
        map.put('}', '{');
        map.put(']', '[');
        for (char ch : s.toCharArray()) {
            if (ch == '(' || ch == '{' || ch == '[') {
                stack.push(ch);
            } else {
                if (stack.isEmpty() || stack.pop() != map.get(ch)) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`,
    python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in "({[":
            stack.append(char)
        else:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`
  },
  'Binary Search': {
    cpp: `#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
    python: `def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`
  },
  'Fibonacci Number (Memoization)': {
    cpp: `#include <unordered_map>
using namespace std;

unordered_map<int, int> memo;
int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}`,
    java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    private Map<Integer, Integer> memo = new HashMap<>();
    
    public int fib(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        int result = fib(n - 1) + fib(n - 2);
        memo.put(n, result);
        return result;
    }
}`,
    python: `def fib(n: int, memo: dict = None) -> int:
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`
  },
  'Maximum Depth of Binary Tree': {
    cpp: `#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
    java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
    python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxDepth(root: TreeNode) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`
  },
  'Number of Islands (BFS)': {
    cpp: `#include <vector>
#include <queue>
using namespace std;

void bfs(vector<vector<char>>& grid, int r, int c) {
    queue<pair<int, int>> q;
    q.push({r, c});
    grid[r][c] = '0';
    int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        for (auto& dir : dirs) {
            int nx = x + dir[0], ny = y + dir[1];
            if (nx >= 0 && ny >= 0 && nx < grid.size() && ny < grid[0].size() && grid[nx][ny] == '1') {
                grid[nx][ny] = '0';
                q.push({nx, ny});
            }
        }
    }
}

int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int i = 0; i < grid.size(); i++) {
        for (int j = 0; j < grid[0].size(); j++) {
            if (grid[i][j] == '1') {
                count++;
                bfs(grid, i, j);
            }
        }
    }
    return count;
}`,
    java: `import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    bfs(grid, i, j);
                }
            }
        }
        return count;
    }
    
    private void bfs(char[][] grid, int r, int c) {
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{r, c});
        grid[r][c] = '0';
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            for (int[] dir : dirs) {
                int nx = curr[0] + dir[0];
                int ny = curr[1] + dir[1];
                if (nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length && grid[nx][ny] == '1') {
                    grid[nx][ny] = '0';
                    queue.offer(new int[]{nx, ny});
                }
            }
        }
    }
}`,
    python: `from collections import deque

def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    count = 0
    rows, cols = len(grid), len(grid[0])
    
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'
        while queue:
            x, y = queue.popleft()
            for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == '1':
                    grid[nx][ny] = '0'
                    queue.append((nx, ny))
                    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '1':
                count += 1
                bfs(i, j)
    return count`
  }
};

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    for (const [title, langSolutions] of Object.entries(solutions)) {
      const result = await DSAQuestion.updateOne(
        { title: title },
        {
          $set: {
            solutionCodeCpp: langSolutions.cpp,
            solutionCodeJava: langSolutions.java,
            solutionCodePython: langSolutions.python
          }
        }
      );
      console.log(`Updated "${title}": matched=${result.matchedCount}, modified=${result.modifiedCount}`);
    }
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
