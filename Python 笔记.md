### 遍历目录下的所有文件
```python
from pathlib import Path

def list_file(dir_path):
	path = Path(dir_path)
	for file in path.rglob("*"):
		if file.is_file():
			print(file)
```

### 延迟初始化
比较灵活，使用哪一种模型、类、函数，甚至是包
```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

animal_factory = {
    "dog": lambda: Dog(),
    "cat": lambda: Cat()
}

animal = animal_factory["dog"]()
print(animal.speak())  # 输出: Woof!
```

```python
import module_a
import module_b

module_factory = {
    "a": lambda: module_a,
    "b": lambda: module_b
}

module = module_factory["a"]()
print(module.function())  # 调用 module_a 中的函数
```

### random
**如果需要复现结果，需要设置随机数种子**
```python
# 生成随机的浮点数[0,1)之间的
random_float = random.random()
random_float = random.uniform(1.5,2.5) # 生成[a,b]之间的浮点数

#生成随机整数
random_int = random.randint(a,b)  #[a,b]之间的整数
random_int = random.randrange(a,b,c)  #[a,b] 之前步长为c的整数
print(random.randrange(0, 100, 5))  # 输出: 45

# 随机选择
random_int = random.choice([1,2,3])  #这里的数组也可以是字符串数组，都可以
random_list_int = random.choices([1,2,3,4], k=5)  # [4,3,3,4,1]

# 随机打乱
lst = [1,2,3,4]
random.shuffle(lst)
```

### tqdm 生成进度条



### tensor数据类型转化


### matplotlib绘图
0.**乱码问题**
这个字体可能没有，可以在~/.cache/matplotlib/\*.json中查看其他字体，也可以去下载
```python 
plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 解决负号'-'显示为方块的问题
```
1.**基础用法**：
```python
import matplotlib.pyplot as plt
import numpy as np

# 数据部分
x = [0, 1, 2, 3, 4, 5]
y1 = [1, 3, 2, 5, 4, 6]
y2 = [2, 4, 1, 3, 5, 7]
y3 = [0, 2, 3, 4, 1, 2]

# 创建图和轴
fig, ax = plt.subplots(figsize=(10, 6))  # 设置图的大小，宽10、高6

# 画多条线
ax.plot(x, y1, label='Line 1', marker='o', color='blue', linestyle='-', linewidth=2, markersize=8)  # 蓝色实线

ax.plot(x, y2, label='Line 2', marker='x', color='green', linestyle='--', linewidth=2, markersize=8)  # 绿色虚线

ax.plot(x, y3, label='Line 3', marker='s', color='red', linestyle='-.', linewidth=2, markersize=8)  # 红色点划线

# 图例：显示在图外右侧
ax.legend(loc='lower right', bbox_to_anchor=(1, 0), fontsize=12)

# 网格：开启网格，并设置透明度
ax.grid(True, linestyle='--', alpha=0.5)

# 添加标题和轴标签
ax.set_title('abcdedg', fontsize=16, fontweight='bold', pad=20)  # 图形标题，padding控制距离
ax.set_xlabel('time', fontsize=14)
ax.set_ylabel('value', fontsize=14)

# 设置x轴和y轴的刻度范围（可以防止某些数据被剪裁）
ax.set_xlim(-0.5, 5.5)  # 设置x轴范围
ax.set_ylim(-0.5, 7.5)  # 设置y轴范围

# 设置x轴和y轴刻度的间隔
ax.set_xticks(np.arange(0, 6, 1))  # x轴刻度每隔1
ax.set_yticks(np.arange(0, 8, 1))  # y轴刻度每隔1

# 设置x轴和y轴刻度的格式
# ax.tick_params(axis='both', which='major', labelsize=12)
ax.tick_params(axis='both', which='major', labelsize=12, length=3, width=1, direction='in', colors='black')

# 添加文本标签在某些数据点上
for i in range(len(x)):
    ax.text(x[i], y1[i] + 0.2, f'{y1[i]}', ha='center', fontsize=10)
    ax.text(x[i], y2[i] + 0.2, f'{y2[i]}', ha='center', fontsize=10)
    ax.text(x[i], y3[i] + 0.2, f'{y3[i]}', ha='center', fontsize=10)

# 使得图形更紧凑，避免标签重叠
fig.tight_layout()
  
# 保存图形（可以选择保存为PNG、SVG等格式）
fig.savefig('professional_line_plot.png', dpi=300, bbox_inches='tight')
  
# 显示图形
plt.show()
```
2.**标记和颜色**
其中markerfacecolor是填充物的颜色，markeredgecolor是边缘的颜色
```python
plt.plot(X, Y, marker='o', markerfacecolor='red', markeredgecolor='black')
```
一些常见的标志
'.' 点标记
',' 像素标记
'o' 圆圈
'v' 下三角
'^' 上三角
'<' 左三角
'>' 右三角
'1' 类似三叉戟向下
'2' 类似三叉戟向上
'3' 左三叉戟
'4' 右三叉戟
's' 正方形
'p' 五边形
'\*' 星号
'h' 六边形侧边
'H' 六边形点
'+' 加号
'x' x标记
'D' 菱形
'd' 细菱形
'|' 水平线标记
'\_' 垂直线标记

## `RE`

###  常用函数

1. `re.search(pattern, string)`

- 在整个字符串中搜索第一个匹配项。
    
- 返回一个 `Match` 对象（或 `None`）。
    
- 用 `.group()` 获取匹配内容。

**示例**：
```python
 match = re.search(r"\d+", "Task took 123 ms")  
 if match:  
     print(match.group())       # '123'  
     print(int(match.group()))  # 123（用于计算）

```

### 2. `re.findall(pattern, string)`

- 找出所有匹配项，返回 **字符串组成的列表**。
    
- 如果使用了多个 `()` 捕获组，返回的是元组列表。
    
**示例**：
```python
 nums = re.findall(r"\d+", "ID: 123, 456, 789")  
 print(nums)           # ['123', '456', '789']  
 nums = [int(n) for n in nums]
```

### 3. 捕获组 `()` 与 `group(n)`

- `()` 表示正则中的**捕获组**。
    
- `group(0)`：整个匹配串
    
- `group(1)`：第一个 `()` 的内容，以此类推
**示例**：
```python
 text = "Backup ID: 456, Archive ID: 789"  
 match = re.search(r"Backup ID:\s*(\d+), Archive ID:\s*(\d+)", text)  
 print(match.group(1))  # '456'  
 print(match.group(2))  # '789'
```


**常见错误和注意事项**

- ✅ `re.search()` 和 `re.findall()` 都需要传入两个参数：
    
 `re.search(pattern, string)`  
 `re.findall(pattern, string)`

- ✅ 提取到的数字默认是字符串类型，需要用 `int()` 转换才能用于计算。
    
---
### 🛠 常用正则语法速查

|表达式|含义|
|---|---|
|`\d`|任意一个数字|
|`\d+`|一串连续数字|
|`\s`|一个空白字符（空格、\t）|
|`\s*`|0 个或多个空白符|
|`^`|行首|
|`$`|行尾|
|`.`|任意字符（不含换行）|
|`[...]`|匹配字符集内任意字符|
|`()`|捕获组（group）|
|`\b`|单词边界（boundary）|

---
示例：提取日志数字并计算平均值
```python
logs = [  
     "Duration: 83ms",  
     "Duration: 105ms",  
     "Duration: 97ms",  
     "Duration: 89ms"  
 ]  
 ​  
 total = 0  
 count = 0  
 ​  
 for log in logs:  
     match = re.search(r"Duration:\s*(\d+)ms", log)  
     if match:  
         total += int(match.group(1))  
         count += 1  
 ​  
 average = total / count if count else 0  
 print("平均耗时:", average)
```
 

---

示例：提取特定字段的数字

```python
 line = "Backup ID: 456, Archive ID: 789"  
 match = re.search(r"Backup ID:\s*(\d+), Archive ID:\s*(\d+)", line)  
 if match:  
     print("Backup ID:", int(match.group(1)))  
     print("Archive ID:", int(match.group(2)))
```


---

 示例：提取以 ERROR 开头的日志行
```python 
 logs = [  
     "INFO running",  
     "ERROR file not found",  
     "WARNING disk low",  
     "ERROR timeout"  
 ]  
 ​  
 for line in logs:  
     if re.search(r"^ERROR", line):  
         print(line)
```

---

总结建议

-  写 `re.search()` 和 `re.findall()` 时，记得传入**字符串参数**。
-  提取出来的数字是字符串，计算前记得用 `int()` 转换。
- 使用 `()` 进行捕获，配合 `.group(n)` 提取目标字段。
- 推荐工具： [https://regex101.com/](https://regex101.com/)（可交互测试，解释正则） [Python re 官方文档](https://docs.python.org/3/library/re.html)